import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
  type: { type: String, trim: true, default: 'External Link' },
}, { _id: false });

const assignmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  moduleId: { type: String, required: true, trim: true },
  lessonId: { type: String, required: true, trim: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 180 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  instructions: { type: String, required: true, trim: true, maxlength: 5000 },
  dueDate: { type: Date, required: true },
  maxMarks: { type: Number, required: true, min: 1, max: 1000, default: 100 },
  attachments: { type: [attachmentSchema], default: [] },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

assignmentSchema.index({ course: 1, lessonId: 1 }, { unique: true });
const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
