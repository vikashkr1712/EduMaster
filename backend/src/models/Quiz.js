import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true, maxlength: 1000 },
  options: {
    type: [{ type: String, required: true, trim: true, maxlength: 500 }],
    validate: { validator: (options) => options.length === 4, message: 'Each question must have four options' },
  },
  correctAnswer: { type: Number, required: true, min: 0, max: 3 },
  explanation: { type: String, required: true, trim: true, maxlength: 1500 },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
}, { timestamps: false });

const quizSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    moduleId: { type: String, required: true, trim: true },
    lessonId: { type: String, required: true, trim: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    passingMarks: { type: Number, required: true, min: 1, max: 100, default: 60 },
    timeLimit: { type: Number, required: true, min: 1, max: 180, default: 10 },
    questions: { type: [questionSchema], required: true },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

quizSchema.index({ course: 1, lessonId: 1 }, { unique: true });

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
