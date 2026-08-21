import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true, trim: true, maxlength: 3000 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const discussionSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  lessonId: { type: String, required: true, trim: true, index: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  question: { type: String, required: true, trim: true, maxlength: 3000 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  replies: { type: [replySchema], default: [] },
}, { timestamps: true });

discussionSchema.index({ course: 1, lessonId: 1, createdAt: -1 });
const Discussion = mongoose.model('Discussion', discussionSchema);
export default Discussion;
