import mongoose from 'mongoose';

const emailQueueSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    to: { type: String, required: true, lowercase: true, trim: true },
    template: {
      type: String,
      enum: ['welcome', 'purchase-successful', 'certificate-ready', 'password-changed', 'assignment-reminder', 'weekly-progress'],
      required: true,
    },
    subject: { type: String, required: true, trim: true },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: { type: String, enum: ['queued', 'processing', 'sent', 'failed'], default: 'queued', index: true },
    attempts: { type: Number, default: 0, min: 0 },
    scheduledAt: { type: Date, default: Date.now, index: true },
    sentAt: Date,
    lastError: { type: String, maxlength: 1000 },
  },
  { timestamps: true }
);

emailQueueSchema.index({ status: 1, scheduledAt: 1 });

export default mongoose.model('EmailQueue', emailQueueSchema);
