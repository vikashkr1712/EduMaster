import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['course', 'certificate', 'assignment', 'quiz', 'order', 'discussion', 'note', 'download', 'account'],
      required: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 500 },
    actionUrl: { type: String, trim: true, maxlength: 500, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    dedupeKey: { type: String, trim: true },
  },
  { timestamps: true }
);

activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ user: 1, dedupeKey: 1 }, { unique: true, sparse: true });

export default mongoose.model('Activity', activitySchema);
