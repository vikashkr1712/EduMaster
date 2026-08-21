import mongoose from 'mongoose';

const studentNoteSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  lessonId: { type: String, required: true, trim: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  content: { type: String, required: true, trim: true, maxlength: 5000 },
}, { timestamps: true });

studentNoteSchema.index({ student: 1, course: 1, lessonId: 1, updatedAt: -1 });
const StudentNote = mongoose.model('StudentNote', studentNoteSchema);
export default StudentNote;
