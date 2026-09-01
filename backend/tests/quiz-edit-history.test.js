import assert from 'node:assert/strict';
import test from 'node:test';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { authorize } from '../src/middleware/authorize.js';
import { requiredCorrectAnswers } from '../src/utils/quizScoring.js';

let mongo;
let Course;
let CourseEnrollment;
let Quiz;
let QuizAttempt;
let User;
let adminQuizService;
let quizService;

const question = (label, correctAnswer = 0) => ({
  question: `${label} original wording`,
  options: [`${label} A`, `${label} B`, `${label} C`, `${label} D`],
  correctAnswer,
  explanation: `${label} original explanation`,
  difficulty: 'Medium',
});

test.before(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongo.getUri();
  ({ default: Course } = await import('../src/models/Course.js'));
  ({ default: CourseEnrollment } = await import('../src/models/CourseEnrollment.js'));
  ({ default: Quiz } = await import('../src/models/Quiz.js'));
  ({ default: QuizAttempt } = await import('../src/models/QuizAttempt.js'));
  ({ default: User } = await import('../src/models/User.js'));
  adminQuizService = await import('../src/services/admin-quiz.service.js');
  quizService = await import('../src/services/quiz.service.js');
  await mongoose.connect(process.env.MONGO_URI);
});

test.after(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});

test.beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

const createFixture = async () => {
  const course = await Course.create({
    title: 'Immutable Quiz QA',
    slug: `immutable-quiz-qa-${Date.now()}`,
    description: 'Temporary course for quiz history validation.',
    category: 'Development',
    level: 'Beginner',
    price: 0,
    instructor: 'QA Instructor',
    isPublished: true,
    modules: [{
      moduleId: 'quiz-history-module',
      title: 'Quiz History Module',
      lessons: [
        { lessonId: 'quiz-history-lesson', title: 'Quiz History Lesson', duration: '05:00', videoProvider: 'YouTube', videoId: 'dQw4w9WgXcQ', resources: [] },
        { lessonId: 'quiz-history-followup', title: 'Follow-up Lesson', duration: '05:00', videoProvider: 'YouTube', videoId: 'M7lc1UVf-VE', resources: [] },
      ],
    }],
  });
  const quiz = await Quiz.create({
    course: course._id,
    moduleId: 'quiz-history-module',
    lessonId: 'quiz-history-lesson',
    title: 'Original Quiz Title',
    passingMarks: 67,
    timeLimit: 10,
    isPublished: true,
    questions: [question('Alpha', 0), question('Beta', 1), question('Gamma', 2)],
  });
  const students = await User.create([
    { name: 'History Student', email: 'history-student@example.com', password: 'Password123', role: 'user' },
    { name: 'Future Student', email: 'future-student@example.com', password: 'Password123', role: 'user' },
  ]);
  await CourseEnrollment.create(students.map((student) => ({
    user: student._id,
    course: course._id,
    order: new mongoose.Types.ObjectId(),
    quizReadyLessons: ['quiz-history-lesson'],
  })));
  return { course, quiz, students };
};

test('keeps completed attempts immutable while Admin freely edits the current quiz', async () => {
  const { quiz, students } = await createFixture();
  const originalQuestionIds = quiz.questions.map((entry) => entry._id.toString());

  const originalStart = await quizService.startQuiz(students[0]._id, quiz._id);
  assert.equal(originalStart.quiz.questionCount, 3);
  assert.equal(originalStart.attempt.questionSnapshot, undefined, 'correct answers must not leak in the start response');
  const originalResult = await quizService.submitQuiz(students[0]._id, quiz._id, {
    attemptId: originalStart.attempt._id,
    answers: originalQuestionIds.map((questionId, index) => ({ questionId, selectedAnswer: index })),
  });
  assert.equal(originalResult.attempt.correctAnswers, 3);
  assert.equal(originalResult.attempt.totalQuestions, 3);
  assert.equal(originalResult.attempt.percentage, 100);
  assert.equal(originalResult.attempt.passed, true);
  assert.equal(originalResult.quiz.passingMarks, 67);

  await adminQuizService.updateAdminQuiz(quiz._id, { title: 'Current Quiz Title', passingMarks: 75, timeLimit: 25 });
  await adminQuizService.updateAdminQuizQuestion(quiz._id, originalQuestionIds[0], {
    question: 'Alpha current wording',
    options: ['Current A', 'Current B', 'Current C', 'Current D'],
    correctAnswer: 2,
    explanation: 'Alpha current explanation',
    difficulty: 'Hard',
  });
  const added = await adminQuizService.createAdminQuizQuestion(quiz._id, question('Delta', 3));
  await adminQuizService.deleteAdminQuizQuestion(quiz._id, originalQuestionIds[1]);
  await adminQuizService.reorderAdminQuizQuestions(quiz._id, [added._id.toString(), originalQuestionIds[2], originalQuestionIds[0]]);

  const historical = await quizService.getQuizResult(students[0]._id, originalResult.attempt._id);
  assert.equal(historical.quiz.title, 'Original Quiz Title');
  assert.equal(historical.quiz.passingMarks, 67);
  assert.equal(historical.attempt.score, 100);
  assert.equal(historical.attempt.percentage, 100);
  assert.equal(historical.attempt.passed, true);
  assert.equal(historical.attempt.totalQuestions, 3);
  assert.deepEqual(historical.attempt.answers.map((answer) => answer.questionText), [
    'Alpha original wording', 'Beta original wording', 'Gamma original wording',
  ]);
  assert.deepEqual(historical.attempt.answers.map((answer) => answer.selectedAnswer), [0, 1, 2]);
  assert.deepEqual(historical.attempt.answers.map((answer) => answer.correctAnswer), [0, 1, 2]);

  const history = await quizService.getQuizHistory(students[0]._id);
  assert.equal(history.attempts[0].quiz.title, 'Original Quiz Title');
  assert.equal(history.attempts[0].quiz.passingMarks, 67);

  const futureStart = await quizService.startQuiz(students[1]._id, quiz._id);
  assert.equal(futureStart.quiz.title, 'Current Quiz Title');
  assert.equal(futureStart.quiz.passingMarks, 75);
  assert.equal(futureStart.quiz.timeLimit, 25);
  assert.equal(futureStart.quiz.questionCount, 3);
  assert.deepEqual(futureStart.quiz.questions.map((entry) => entry.question), [
    'Delta original wording', 'Gamma original wording', 'Alpha current wording',
  ]);
  const futureResult = await quizService.submitQuiz(students[1]._id, quiz._id, {
    attemptId: futureStart.attempt._id,
    answers: [
      { questionId: String(futureStart.quiz.questions[0]._id), selectedAnswer: 3 },
      { questionId: String(futureStart.quiz.questions[1]._id), selectedAnswer: 2 },
      { questionId: String(futureStart.quiz.questions[2]._id), selectedAnswer: 0 },
    ],
  });
  assert.equal(futureResult.attempt.correctAnswers, 2);
  assert.equal(futureResult.attempt.percentage, 67);
  assert.equal(futureResult.attempt.passed, false);
  assert.equal(futureResult.quiz.passingMarks, 75);

  const archived = await adminQuizService.deleteAdminQuiz(quiz._id);
  assert.equal(archived.archived, true);
  assert.equal((await Quiz.findById(quiz._id)).isPublished, false);
  assert.equal(await QuizAttempt.countDocuments({ quiz: quiz._id }), 2);
});

test('finishes an in-progress attempt against the version originally shown to the learner', async () => {
  const { quiz, students } = await createFixture();
  const originalQuestionIds = quiz.questions.map((entry) => entry._id.toString());
  const started = await quizService.startQuiz(students[0]._id, quiz._id);

  await adminQuizService.updateAdminQuiz(quiz._id, { title: 'Edited During Attempt', passingMarks: 100 });
  await adminQuizService.updateAdminQuizQuestion(quiz._id, originalQuestionIds[0], {
    question: 'Changed while learner is answering',
    options: ['New A', 'New B', 'New C', 'New D'],
    correctAnswer: 3,
    explanation: 'New explanation',
    difficulty: 'Hard',
  });

  const result = await quizService.submitQuiz(students[0]._id, quiz._id, {
    attemptId: started.attempt._id,
    answers: [
      { questionId: originalQuestionIds[0], selectedAnswer: 0 },
      { questionId: originalQuestionIds[1], selectedAnswer: 1 },
      { questionId: originalQuestionIds[2], selectedAnswer: null },
    ],
  });

  assert.equal(result.attempt.quizTitle, 'Original Quiz Title');
  assert.equal(result.attempt.passingMarks, 67);
  assert.equal(result.attempt.totalQuestions, 3);
  assert.equal(result.attempt.correctAnswers, 2);
  assert.equal(result.attempt.percentage, 67);
  assert.equal(result.attempt.passed, false, '2/3 must not satisfy a 67% threshold');
  assert.equal(result.attempt.answers[0].questionText, 'Alpha original wording');
  assert.equal(result.attempt.answers[0].correctAnswer, 0);
});

test('backfills only missing legacy history fields before the first Admin edit', async () => {
  const { quiz, students } = await createFixture();
  const completed = await QuizAttempt.create({
    user: students[0]._id,
    quiz: quiz._id,
    course: quiz.course,
    attemptNumber: 1,
    score: 100,
    correctAnswers: 3,
    wrongAnswers: 0,
    passed: true,
    status: 'completed',
    startedAt: new Date(Date.now() - 60_000),
    expiresAt: new Date(Date.now() + 60_000),
    completedAt: new Date(),
    answers: quiz.questions.map((entry, index) => ({
      question: entry._id,
      questionText: entry.question,
      options: entry.options,
      selectedAnswer: index,
      correctAnswer: entry.correctAnswer,
      correct: true,
      explanation: entry.explanation,
    })),
  });
  const active = await QuizAttempt.create({
    user: students[1]._id,
    quiz: quiz._id,
    course: quiz.course,
    attemptNumber: 1,
    status: 'in_progress',
    startedAt: new Date(),
    expiresAt: new Date(Date.now() + 600_000),
  });

  await adminQuizService.updateAdminQuiz(quiz._id, { title: 'Edited Legacy Quiz', passingMarks: 80 });
  const [savedCompleted, savedActive] = await Promise.all([
    QuizAttempt.findById(completed._id).lean(),
    QuizAttempt.findById(active._id).lean(),
  ]);
  assert.equal(savedCompleted.quizTitle, 'Original Quiz Title');
  assert.equal(savedCompleted.passingMarks, 67);
  assert.equal(savedCompleted.percentage, 100);
  assert.equal(savedCompleted.totalQuestions, 3);
  assert.equal(savedCompleted.score, 100);
  assert.equal(savedCompleted.passed, true);
  assert.equal(savedActive.questionSnapshot.length, 3);
  assert.equal(savedActive.questionSnapshot[0].questionText, 'Alpha original wording');
  assert.equal(savedActive.questionSnapshot[0].correctAnswer, 0);

  const historical = await quizService.getQuizResult(students[0]._id, completed._id);
  assert.equal(historical.quiz.title, 'Original Quiz Title');
  assert.equal(historical.quiz.passingMarks, 67);
});

test('derives required-correct counts without storing a separate editable value', () => {
  assert.equal(requiredCorrectAnswers(10, 70), 7);
  assert.equal(requiredCorrectAnswers(5, 60), 3);
  assert.equal(requiredCorrectAnswers(3, 67), 3);
});

test('keeps Admin quiz endpoints role-protected', () => {
  let allowed = false;
  authorize('admin')({ user: { role: 'admin' } }, {}, () => { allowed = true; });
  assert.equal(allowed, true);
  assert.throws(
    () => authorize('admin')({ user: { role: 'user' } }, {}, () => {}),
    (error) => error.statusCode === 403 && error.code === 'ROLE_FORBIDDEN'
  );
});
