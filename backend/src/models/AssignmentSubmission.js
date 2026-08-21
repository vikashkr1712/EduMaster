import mongoose from 'mongoose';

const submittedFileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  url: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true, min: 1 },
}, { _id: false });

const submissionVersionSchema = new mongoose.Schema({
  submittedFile: { type: submittedFileSchema, required: true },
  submittedAt: { type: Date, required: true },
  remarks: { type: String, trim: true, maxlength: 2000, default: '' },
  marks: { type: Number, min: 0, default: null },
  status: { type: String, enum: ['submitted', 'reviewed'], default: 'submitted' },
}, { timestamps: false });

const assignmentSubmissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true, index: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  submittedFile: { type: submittedFileSchema, required: true },
  submittedAt: { type: Date, default: Date.now },
  remarks: { type: String, trim: true, maxlength: 2000, default: '' },
  marks: { type: Number, min: 0, default: null },
  status: { type: String, enum: ['submitted', 'reviewed'], default: 'submitted' },
  versions: { type: [submissionVersionSchema], default: [] },
}, { timestamps: true });

assignmentSubmissionSchema.index({ student: 1, assignment: 1 }, { unique: true });
const AssignmentSubmission = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema);
export default AssignmentSubmission;
