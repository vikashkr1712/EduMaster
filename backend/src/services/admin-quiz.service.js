import mongoose from 'mongoose';
import Course from '../models/Course.js';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import { ApiError } from '../utils/ApiError.js';

const SORTS = {
  newest: { createdAt: -1, _id: -1 },
  oldest: { createdAt: 1, _id: 1 },
  titleAsc: { title: 1, _id: 1 },
  titleDesc: { title: -1, _id: -1 },
  questionsAsc: { questionCount: 1, title: 1 },
  questionsDesc: { questionCount: -1, title: 1 },
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const assertId = (id, label = 'Quiz') => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, `Invalid ${label.toLowerCase()} ID`);
};

const assertAttachment = async (courseId, moduleId, lessonId) => {
  assertId(courseId, 'Course');
  const course = await Course.findById(courseId).select('_id title modules').lean();
  if (!course) throw new ApiError(404, 'Course not found');
  const module = course.modules?.find((item) => item.moduleId === moduleId);
  if (!module) throw new ApiError(404, 'Module does not belong to the selected course');
  const lesson = module.lessons?.find((item) => item.lessonId === lessonId);
  if (!lesson) throw new ApiError(404, 'Lesson does not belong to the selected module');
  return { course, module, lesson };
};

const duplicateAttachment = (error) => error?.code === 11000 && (error?.keyPattern?.lessonId || error?.keyValue?.lessonId);
const hasAttempts = (quizId) => QuizAttempt.exists({ quiz: quizId });

const relationStages = [
  { $lookup: { from: Course.collection.name, localField: 'course', foreignField: '_id', as: 'courseDoc' } },
  { $set: { courseDoc: { $arrayElemAt: ['$courseDoc', 0] }, questionCount: { $size: '$questions' } } },
  { $set: { moduleDoc: { $arrayElemAt: [{ $filter: { input: { $ifNull: ['$courseDoc.modules', []] }, as: 'module', cond: { $eq: ['$$module.moduleId', '$moduleId'] } } }, 0] } } },
  { $set: { lessonDoc: { $arrayElemAt: [{ $filter: { input: { $ifNull: ['$moduleDoc.lessons', []] }, as: 'lesson', cond: { $eq: ['$$lesson.lessonId', '$lessonId'] } } }, 0] } } },
  {
    $lookup: {
      from: QuizAttempt.collection.name,
      let: { quizId: '$_id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$quiz', '$$quizId'] } } },
        { $group: { _id: null, attemptCount: { $sum: 1 }, passedCount: { $sum: { $cond: ['$passed', 1, 0] } }, averageScore: { $avg: '$score' }, bestScore: { $max: '$score' } } },
      ],
      as: 'attemptStats',
    },
  },
  { $set: { attemptStats: { $ifNull: [{ $arrayElemAt: ['$attemptStats', 0] }, { attemptCount: 0, passedCount: 0, averageScore: 0, bestScore: 0 }] } } },
  { $set: { attemptCount: '$attemptStats.attemptCount', passedCount: '$attemptStats.passedCount', averageScore: { $round: ['$attemptStats.averageScore', 1] }, bestScore: '$attemptStats.bestScore' } },
];

const listProject = {
  __v: 0,
  courseDoc: 0,
  moduleDoc: 0,
  lessonDoc: 0,
  attemptStats: 0,
  questions: 0,
};

export const getAdminQuizzes = async (query = {}) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 50);
  const initialMatch = {};
  if (query.course) initialMatch.course = new mongoose.Types.ObjectId(query.course);
  if (query.status === 'published') initialMatch.isPublished = true;
  if (query.status === 'draft') initialMatch.isPublished = false;
  if (query.difficulty) initialMatch['questions.difficulty'] = query.difficulty;

  const laterMatch = {};
  if (query.search) {
    const search = new RegExp(escapeRegex(query.search), 'i');
    laterMatch.$or = [
      { title: search },
      { 'courseDoc.title': search },
      { 'moduleDoc.title': search },
      { 'lessonDoc.title': search },
    ];
  }
  if (query.attempts === 'with') laterMatch.attemptCount = { $gt: 0 };
  if (query.attempts === 'without') laterMatch.attemptCount = 0;

  const pipeline = [
    { $match: initialMatch },
    ...relationStages,
    ...(Object.keys(laterMatch).length ? [{ $match: laterMatch }] : []),
    {
      $set: {
        courseTitle: { $ifNull: ['$courseDoc.title', 'Course unavailable'] },
        moduleTitle: { $ifNull: ['$moduleDoc.title', 'Module unavailable'] },
        lessonTitle: { $ifNull: ['$lessonDoc.title', 'Lesson unavailable'] },
      },
    },
    {
      $facet: {
        quizzes: [{ $sort: SORTS[query.sort] ?? SORTS.newest }, { $skip: (page - 1) * limit }, { $limit: limit }, { $project: listProject }],
        total: [{ $count: 'value' }],
      },
    },
  ];

  const [result, quizOverview, attemptOverview] = await Promise.all([
    Quiz.aggregate(pipeline),
    Quiz.aggregate([{ $group: { _id: null, total: { $sum: 1 }, questions: { $sum: { $size: '$questions' } } } }]),
    QuizAttempt.aggregate([{ $group: { _id: null, attempts: { $sum: 1 }, passed: { $sum: { $cond: ['$passed', 1, 0] } } } }]),
  ]);
  const facet = result[0] ?? { quizzes: [], total: [] };
  const total = facet.total[0]?.value ?? 0;
  const quizSummary = quizOverview[0] ?? { total: 0, questions: 0 };
  const attemptSummary = attemptOverview[0] ?? { attempts: 0, passed: 0 };
  return {
    quizzes: facet.quizzes,
    pagination: { total, page, pages: Math.ceil(total / limit) || 1, limit },
    summary: { total: quizSummary.total, questions: quizSummary.questions, attempts: attemptSummary.attempts, passed: attemptSummary.passed },
  };
};

export const getAdminQuizOptions = async () => {
  const courses = await Course.find({ 'modules.0': { $exists: true } })
    .select('_id title modules.moduleId modules.title modules.lessons.lessonId modules.lessons.title')
    .sort({ title: 1 })
    .lean();
  return courses;
};

export const getAdminQuiz = async (id) => {
  assertId(id);
  const quiz = await Quiz.findById(id).lean();
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  const [course, stats] = await Promise.all([
    Course.findById(quiz.course).select('_id title modules').lean(),
    QuizAttempt.aggregate([
      { $match: { quiz: quiz._id } },
      { $group: { _id: null, attemptCount: { $sum: 1 }, passedCount: { $sum: { $cond: ['$passed', 1, 0] } }, averageScore: { $avg: '$score' }, bestScore: { $max: '$score' } } },
    ]),
  ]);
  const module = course?.modules?.find((item) => item.moduleId === quiz.moduleId);
  const lesson = module?.lessons?.find((item) => item.lessonId === quiz.lessonId);
  return {
    ...quiz,
    courseTitle: course?.title ?? 'Course unavailable',
    moduleTitle: module?.title ?? 'Module unavailable',
    lessonTitle: lesson?.title ?? 'Lesson unavailable',
    attemptCount: stats[0]?.attemptCount ?? 0,
    passedCount: stats[0]?.passedCount ?? 0,
    averageScore: Math.round((stats[0]?.averageScore ?? 0) * 10) / 10,
    bestScore: stats[0]?.bestScore ?? 0,
  };
};

export const createAdminQuiz = async (data) => {
  await assertAttachment(data.course, data.moduleId, data.lessonId);
  if (await Quiz.exists({ course: data.course, lessonId: data.lessonId })) {
    throw new ApiError(409, 'A quiz already exists for this lesson');
  }
  try {
    return await Quiz.create(data);
  } catch (error) {
    if (duplicateAttachment(error)) throw new ApiError(409, 'A quiz already exists for this lesson');
    throw error;
  }
};

export const updateAdminQuiz = async (id, data) => {
  assertId(id);
  const quiz = await Quiz.findById(id);
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  const relation = {
    course: data.course ?? quiz.course.toString(),
    moduleId: data.moduleId ?? quiz.moduleId,
    lessonId: data.lessonId ?? quiz.lessonId,
  };
  const protectedChange = ['course', 'moduleId', 'lessonId', 'passingMarks', 'timeLimit'].some((field) =>
    data[field] !== undefined && String(data[field]) !== String(quiz[field]));
  if (protectedChange && await hasAttempts(quiz._id)) {
    throw new ApiError(409, 'Quiz attachment, passing score, and time limit cannot change after attempts exist');
  }
  if (data.isPublished === true && quiz.questions.length === 0) {
    throw new ApiError(409, 'Add at least one question before publishing this quiz');
  }
  if (data.course || data.moduleId || data.lessonId) await assertAttachment(relation.course, relation.moduleId, relation.lessonId);
  if ((data.course || data.lessonId) && await Quiz.exists({ course: relation.course, lessonId: relation.lessonId, _id: { $ne: quiz._id } })) {
    throw new ApiError(409, 'A quiz already exists for this lesson');
  }
  Object.assign(quiz, data);
  try {
    await quiz.save();
    return quiz;
  } catch (error) {
    if (duplicateAttachment(error)) throw new ApiError(409, 'A quiz already exists for this lesson');
    throw error;
  }
};

export const deleteAdminQuiz = async (id) => {
  assertId(id);
  const quiz = await Quiz.findById(id);
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  if (await hasAttempts(quiz._id)) throw new ApiError(409, 'Quiz cannot be deleted because learner attempts exist');
  await quiz.deleteOne();
};

export const createAdminQuizQuestion = async (id, data) => {
  assertId(id);
  const quiz = await Quiz.findById(id);
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  if (await hasAttempts(quiz._id)) throw new ApiError(409, 'Questions cannot be added after learner attempts exist');
  quiz.questions.push(data);
  await quiz.save();
  return quiz.questions.at(-1);
};

export const updateAdminQuizQuestion = async (id, questionId, data) => {
  assertId(id);
  assertId(questionId, 'Question');
  const quiz = await Quiz.findById(id);
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  const question = quiz.questions.id(questionId);
  if (!question) throw new ApiError(404, 'Question not found');
  if ((data.options !== undefined || data.correctAnswer !== undefined) && await hasAttempts(quiz._id)) {
    throw new ApiError(409, 'Question options and correct answers cannot change after learner attempts exist');
  }
  Object.assign(question, data);
  await quiz.save();
  return question;
};

export const deleteAdminQuizQuestion = async (id, questionId) => {
  assertId(id);
  assertId(questionId, 'Question');
  const quiz = await Quiz.findById(id);
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  const question = quiz.questions.id(questionId);
  if (!question) throw new ApiError(404, 'Question not found');
  if (await hasAttempts(quiz._id)) throw new ApiError(409, 'Questions cannot be deleted after learner attempts exist');
  if (quiz.isPublished && quiz.questions.length === 1) throw new ApiError(409, 'A published quiz must keep at least one question');
  question.deleteOne();
  await quiz.save();
};

export const reorderAdminQuizQuestions = async (id, ids) => {
  assertId(id);
  const quiz = await Quiz.findById(id);
  if (!quiz) throw new ApiError(404, 'Quiz not found');
  if (await hasAttempts(quiz._id)) throw new ApiError(409, 'Questions cannot be reordered after learner attempts exist');
  const currentIds = quiz.questions.map((question) => question._id.toString());
  if (ids.length !== currentIds.length || new Set(ids).size !== ids.length || ids.some((questionId) => !currentIds.includes(questionId))) {
    throw new ApiError(400, 'Question order must contain every question exactly once');
  }
  const byId = new Map(quiz.questions.map((question) => [question._id.toString(), question]));
  quiz.questions = ids.map((questionId) => byId.get(questionId));
  await quiz.save();
  return quiz.questions;
};
