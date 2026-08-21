import mongoose from 'mongoose';

const quizAnswerSchema = new mongoose.Schema({
  question: { type: mongoose.Schema.Types.ObjectId, required: true },
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  selectedAnswer: { type: Number, default: null, min: 0, max: 3 },
  correctAnswer: { type: Number, required: true, min: 0, max: 3 },
  correct: { type: Boolean, required: true },
  explanation: { type: String, required: true },
}, { _id: false });

const quizAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    attemptNumber: { type: Number, required: true, min: 1 },
    score: { type: Number, min: 0, max: 100, default: 0 },
    correctAnswers: { type: Number, min: 0, default: 0 },
    wrongAnswers: { type: Number, min: 0, default: 0 },
    passed: { type: Boolean, default: false },
    status: { type: String, enum: ['in_progress', 'completed', 'expired'], default: 'in_progress' },
    startedAt: { type: Date, required: true, default: Date.now },
    expiresAt: { type: Date, required: true },
    completedAt: { type: Date, default: null },
    answers: { type: [quizAnswerSchema], default: [] },
  },
  { timestamps: true }
);

quizAttemptSchema.index({ user: 1, quiz: 1, attemptNumber: 1 }, { unique: true });

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
export default QuizAttempt;
