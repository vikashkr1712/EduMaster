import mongoose from 'mongoose';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import { ApiError } from '../utils/ApiError.js';
import { buildQuizzesForCourse } from '../utils/quizFactory.js';
import { generateCertificate } from './certificate.service.js';
import { createEvent } from './notification.service.js';
import { requiredCorrectAnswers } from '../utils/quizScoring.js';

const quizSelect = 'title course moduleId lessonId passingMarks timeLimit questions isPublished';

const ensureEnrollment = async (userId, courseId) => {
  const enrollment = await CourseEnrollment.findOne({ user: userId, course: courseId });
  if (!enrollment) throw new ApiError(403, 'You must enroll in this course before taking its quiz');
  return enrollment;
};

const serializeQuiz = (quiz) => ({
  _id: quiz._id,
  course: quiz.course,
  moduleId: quiz.moduleId,
  lessonId: quiz.lessonId,
  title: quiz.title,
  passingMarks: quiz.passingMarks,
  timeLimit: quiz.timeLimit,
  questionCount: quiz.questions.length,
  questions: quiz.questions.map((question) => ({
    _id: question._id,
    question: question.question,
    options: question.options,
    difficulty: question.difficulty,
  })),
});

const snapshotQuestions = (quiz) => quiz.questions.map((question) => ({
  question: question._id,
  questionText: question.question,
  options: [...question.options],
  correctAnswer: question.correctAnswer,
  explanation: question.explanation,
  difficulty: question.difficulty,
}));

const serializeAttemptQuiz = (attempt, quiz) => {
  if (!attempt.questionSnapshot?.length) return serializeQuiz(quiz);
  return {
    _id: quiz._id,
    course: attempt.course,
    moduleId: attempt.moduleId || quiz.moduleId,
    lessonId: attempt.lessonId || quiz.lessonId,
    title: attempt.quizTitle || quiz.title,
    passingMarks: attempt.passingMarks ?? quiz.passingMarks,
    timeLimit: attempt.timeLimit ?? quiz.timeLimit,
    questionCount: attempt.questionSnapshot.length,
    questions: attempt.questionSnapshot.map((question) => ({
      _id: question.question,
      question: question.questionText,
      options: question.options,
      difficulty: question.difficulty,
    })),
  };
};

const historicalQuiz = (attempt, liveQuiz) => ({
  _id: liveQuiz?._id || attempt.quiz,
  title: attempt.quizTitle || liveQuiz?.title || 'Assessment',
  passingMarks: attempt.passingMarks ?? liveQuiz?.passingMarks ?? null,
  lessonId: attempt.lessonId || liveQuiz?.lessonId || null,
  moduleId: attempt.moduleId || liveQuiz?.moduleId || null,
});

const serializeActiveAttempt = (attempt) => ({
  _id: attempt._id,
  attemptNumber: attempt.attemptNumber,
  status: attempt.status,
  startedAt: attempt.startedAt,
  expiresAt: attempt.expiresAt,
});

const getQuizWithAccess = async (userId, quizId) => {
  const quiz = await Quiz.findById(quizId).select(quizSelect);
  if (!quiz || !quiz.isPublished) throw new ApiError(404, 'Quiz not found');
  const enrollment = await ensureEnrollment(userId, quiz.course);
  if (!enrollment.quizReadyLessons.includes(quiz.lessonId) && !enrollment.completedLessons.includes(quiz.lessonId)) {
    throw new ApiError(403, 'Finish the lesson before starting its quiz');
  }
  return quiz;
};

const syncQuizStats = async (userId) => {
  const attempts = await QuizAttempt.find({ user: userId, status: 'completed' }).select('quiz score passed').lean();
  const bestByQuiz = new Map();
  attempts.forEach((attempt) => {
    const key = String(attempt.quiz);
    const previous = bestByQuiz.get(key);
    if (!previous || attempt.score > previous.score) bestByQuiz.set(key, attempt);
  });
  const bestAttempts = [...bestByQuiz.values()];
  const stats = {
    quizzesAttempted: attempts.length,
    averageQuizScore: attempts.length ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length) : 0,
    passedQuizzes: bestAttempts.filter((attempt) => attempt.passed).length,
    bestQuizScore: attempts.length ? Math.max(...attempts.map((attempt) => attempt.score)) : 0,
  };
  const [learningSummary] = await CourseEnrollment.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(String(userId)) } },
    { $group: { _id: null, progress: { $avg: '$percentageCompleted' } } },
  ]);
  stats.progress = Math.round(learningSummary?.progress || 0);
  await User.findByIdAndUpdate(userId, { $set: Object.fromEntries(Object.entries(stats).map(([key, value]) => [`stats.${key}`, value])) });
  const user = await User.findById(userId).select('stats').lean();
  return user?.stats || stats;
};

export const getQuizByLesson = async (userId, lessonId, courseId = null) => {
  let course = null;
  if (courseId && mongoose.isValidObjectId(courseId)) {
    course = await Course.findById(courseId);
    if (course) await ensureEnrollment(userId, course._id);
  }
  let quiz = course
    ? await Quiz.findOne({ course: course._id, lessonId, isPublished: true }).select(quizSelect)
    : null;
  if (!quiz && !course) {
    const enrolledCourseIds = await CourseEnrollment.find({ user: userId }).distinct('course');
    quiz = await Quiz.findOne({ course: { $in: enrolledCourseIds }, lessonId, isPublished: true }).select(quizSelect);
  }
  if (!quiz) {
    if (!course) {
      const enrolledCourseIds = await CourseEnrollment.find({ user: userId }).distinct('course');
      course = await Course.findOne({ _id: { $in: enrolledCourseIds }, 'modules.lessons.lessonId': lessonId, isPublished: true });
    }
    if (course) {
      const definitions = buildQuizzesForCourse(course);
      if (definitions.length) {
        await Quiz.bulkWrite(definitions.map((definition) => ({ updateOne: { filter: { course: course._id, lessonId: definition.lessonId }, update: { $setOnInsert: definition }, upsert: true } })));
        quiz = await Quiz.findOne({ lessonId, isPublished: true }).select(quizSelect);
      }
    }
  }
  if (!quiz) throw new ApiError(404, 'No quiz is attached to this lesson');
  await ensureEnrollment(userId, quiz.course);
  const bestAttempt = await QuizAttempt.findOne({ user: userId, quiz: quiz._id, status: 'completed' }).sort({ score: -1 }).select('score passed completedAt').lean();
  return { quiz: serializeQuiz(quiz), bestAttempt };
};

export const startQuiz = async (userId, quizId) => {
  const quiz = await getQuizWithAccess(userId, quizId);
  const activeAttempt = await QuizAttempt.findOne({ user: userId, quiz: quiz._id, status: 'in_progress', expiresAt: { $gt: new Date() } }).lean();
  if (activeAttempt) return { quiz: serializeAttemptQuiz(activeAttempt, quiz), attempt: serializeActiveAttempt(activeAttempt), resumed: true };
  await QuizAttempt.updateMany({ user: userId, quiz: quiz._id, status: 'in_progress' }, { $set: { status: 'expired', completedAt: new Date() } });
  const attemptNumber = await QuizAttempt.countDocuments({ user: userId, quiz: quiz._id }) + 1;
  const startedAt = new Date();
  const attempt = await QuizAttempt.create({
    user: userId,
    quiz: quiz._id,
    course: quiz.course,
    quizTitle: quiz.title,
    moduleId: quiz.moduleId,
    lessonId: quiz.lessonId,
    passingMarks: quiz.passingMarks,
    timeLimit: quiz.timeLimit,
    totalQuestions: quiz.questions.length,
    questionSnapshot: snapshotQuestions(quiz),
    attemptNumber,
    startedAt,
    expiresAt: new Date(startedAt.getTime() + quiz.timeLimit * 60000),
  });
  return { quiz: serializeQuiz(quiz), attempt: serializeActiveAttempt(attempt), resumed: false };
};

export const submitQuiz = async (userId, quizId, { attemptId, answers }) => {
  const quiz = await Quiz.findById(quizId).select(quizSelect);
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  await ensureEnrollment(userId, quiz.course);
  const attempt = await QuizAttempt.findOne({ _id: attemptId, user: userId, quiz: quiz._id });
  if (!attempt) throw new ApiError(404, 'Quiz attempt not found');
  if (attempt.status === 'completed') return getQuizResult(userId, attempt._id);

  const timeExpired = Date.now() > new Date(attempt.expiresAt).getTime() + 10000;
  const submittedAnswers = new Map((timeExpired ? [] : answers).map((answer) => [String(answer.questionId), answer.selectedAnswer]));
  const gradingQuestions = attempt.questionSnapshot?.length
    ? attempt.questionSnapshot.map((question) => ({
      _id: question.question,
      question: question.questionText,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      difficulty: question.difficulty,
    }))
    : quiz.questions;
  const reviewedAnswers = gradingQuestions.map((question) => {
    const selectedAnswer = submittedAnswers.has(String(question._id)) ? submittedAnswers.get(String(question._id)) : null;
    return {
      question: question._id,
      questionText: question.question,
      options: [...question.options],
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      correct: selectedAnswer === question.correctAnswer,
      explanation: question.explanation,
    };
  });
  const correctAnswers = reviewedAnswers.filter((answer) => answer.correct).length;
  const totalQuestions = reviewedAnswers.length;
  const score = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const passingMarks = attempt.passingMarks ?? quiz.passingMarks;
  const quizTitle = attempt.quizTitle || quiz.title;
  attempt.answers = reviewedAnswers;
  attempt.correctAnswers = correctAnswers;
  attempt.wrongAnswers = totalQuestions - correctAnswers;
  attempt.totalQuestions = totalQuestions;
  attempt.score = score;
  attempt.percentage = score;
  attempt.passed = correctAnswers >= requiredCorrectAnswers(totalQuestions, passingMarks);
  attempt.quizTitle = quizTitle;
  attempt.moduleId ||= quiz.moduleId;
  attempt.lessonId ||= quiz.lessonId;
  attempt.passingMarks = passingMarks;
  attempt.timeLimit ??= quiz.timeLimit;
  attempt.timeSpentSeconds = Math.max(0, Math.round((Date.now() - new Date(attempt.startedAt).getTime()) / 1000));
  attempt.status = 'completed';
  attempt.completedAt = new Date();
  await attempt.save();
  let enrollment = null;
  let completion = null;
  if (attempt.passed) {
    const course = await Course.findById(quiz.course);
    enrollment = await CourseEnrollment.findOne({ user: userId, course: quiz.course });
    if (course && enrollment) {
      if (!enrollment.completedLessons.includes(quiz.lessonId)) enrollment.completedLessons.push(quiz.lessonId);
      enrollment.quizReadyLessons = enrollment.quizReadyLessons.filter((lessonId) => lessonId !== quiz.lessonId);
      const completed = new Set(enrollment.completedLessons);
      enrollment.completedModules = course.modules.filter((module) => module.lessons.length && module.lessons.every((lesson) => completed.has(lesson.lessonId))).map((module) => module.moduleId);
      const lessonCount = course.modules.reduce((count, module) => count + module.lessons.length, 0);
      enrollment.progress = lessonCount ? Math.round((completed.size / lessonCount) * 100) : 0;
      enrollment.percentageCompleted = enrollment.progress;
      if (enrollment.progress === 100 && !enrollment.completedAt) enrollment.completedAt = new Date();
      await enrollment.save();
      if (enrollment.progress === 100) completion = await generateCertificate(userId, course._id);
    }
  }
  const quizStats = await syncQuizStats(userId);
  await createEvent({
    userId,
    notification: { title: attempt.passed ? 'Quiz passed' : 'Quiz completed', message: `You scored ${score}% on ${quizTitle}.`, type: 'quiz', actionUrl: `/quiz/${quiz.lessonId}?courseId=${quiz.course}` },
    activity: { type: 'quiz', title: attempt.passed ? 'Passed quiz' : 'Completed quiz', message: `Scored ${score}% on ${quizTitle}.`, actionUrl: `/quiz/${quiz.lessonId}?courseId=${quiz.course}` },
  });
  return {
    attempt: attempt.toObject(),
    quiz: { _id: quiz._id, title: quizTitle, course: attempt.course, lessonId: attempt.lessonId, passingMarks },
    enrollment,
    stats: { ...(completion?.stats || {}), ...quizStats },
    timeExpired,
    certificate: completion?.certificate || null,
    certificateGenerated: Boolean(completion?.generated),
  };
};

export const getQuizResult = async (userId, attemptId) => {
  const attempt = await QuizAttempt.findOne({ _id: attemptId, user: userId, status: 'completed' })
    .select('-questionSnapshot')
    .populate('quiz', 'title passingMarks lessonId moduleId')
    .populate('course', 'title instructor imageType')
    .lean();
  if (!attempt) throw new ApiError(404, 'Quiz result not found');
  const quiz = historicalQuiz(attempt, attempt.quiz);
  return { attempt: { ...attempt, quiz }, quiz };
};

export const getQuizHistory = async (userId) => {
  const [attempts, user] = await Promise.all([
    QuizAttempt.find({ user: userId, status: 'completed' }).sort({ completedAt: -1 }).select('-questionSnapshot').populate('quiz', 'title passingMarks lessonId').populate('course', 'title imageType').lean(),
    User.findById(userId).select('stats').lean(),
  ]);
  if (!user) throw new ApiError(404, 'User not found');
  return {
    attempts: attempts.map((attempt) => ({ ...attempt, quiz: historicalQuiz(attempt, attempt.quiz) })),
    stats: user.stats,
  };
};

export const getLessonQuizMap = async (userId, course) => {
  await ensureEnrollment(userId, course._id);
  const definitions = buildQuizzesForCourse(course);
  if (definitions.length) await Quiz.bulkWrite(definitions.map((definition) => ({ updateOne: { filter: { course: course._id, lessonId: definition.lessonId }, update: { $setOnInsert: definition }, upsert: true } })));
  const quizzes = await Quiz.find({ course: course._id, isPublished: true }).select('_id lessonId title passingMarks timeLimit').lean();
  const passedAttempts = await QuizAttempt.find({ user: userId, quiz: { $in: quizzes.map((quiz) => quiz._id) }, passed: true }).distinct('quiz');
  const passed = new Set(passedAttempts.map(String));
  return Object.fromEntries(quizzes.map((quiz) => [quiz.lessonId, { ...quiz, passed: passed.has(String(quiz._id)) }]));
};
