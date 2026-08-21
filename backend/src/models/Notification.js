import mongoose from 'mongoose';

export const NOTIFICATION_TYPES = [
  'course', 'certificate', 'assignment', 'quiz', 'order',
  'payment', 'system', 'promotion',
];

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 500 },
    type: { type: String, enum: NOTIFICATION_TYPES, default: 'system' },
    read: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
    archived: { type: Boolean, default: false },
    actionUrl: { type: String, trim: true, maxlength: 500, default: '' },
    push: {
      enabled: { type: Boolean, default: false },
      title: { type: String, trim: true, maxlength: 120 },
      body: { type: String, trim: true, maxlength: 500 },
      data: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    campaign: { type: mongoose.Schema.Types.ObjectId, index: true },
    audience: { type: String, enum: ['allStudents', 'specificUser', 'courseStudents'] },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, archived: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index(
  { campaign: 1, user: 1 },
  { unique: true, partialFilterExpression: { campaign: { $type: 'objectId' } } }
);

export default mongoose.model('Notification', notificationSchema);
