import mongoose from 'mongoose';

const courseEnrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    currentLesson: { type: String, default: null },
    completedLessons: { type: [String], default: [] },
    completedModules: { type: [String], default: [] },
    currentModule: { type: String, default: null },
    lastWatched: { type: Date, default: null },
    lastWatchedAt: { type: Date, default: null },
    percentageCompleted: { type: Number, min: 0, max: 100, default: 0 },
    watchTime: [{
      lessonId: { type: String, required: true },
      seconds: { type: Number, min: 0, default: 0 },
    }],
    bookmarks: { type: [String], default: [] },
    quizReadyLessons: { type: [String], default: [] },
    notes: [{
      lessonId: { type: String, required: true },
      content: { type: String, required: true, trim: true, maxlength: 3000 },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    }],
    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

courseEnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

courseEnrollmentSchema.methods.toJSON = function () {
  const enrollment = this.toObject();
  delete enrollment.__v;
  return enrollment;
};

const CourseEnrollment = mongoose.model('CourseEnrollment', courseEnrollmentSchema);

export default CourseEnrollment;
