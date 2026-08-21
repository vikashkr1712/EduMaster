import StudentNote from '../models/StudentNote.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { createEvent } from './notification.service.js';

const ensureEnrollment = async (student, course) => {
  if (!await CourseEnrollment.exists({ user: student, course })) throw new ApiError(403, 'You must enroll in this course to save notes');
};
export const list = async (student, lessonId, courseId, search = '') => {
  await ensureEnrollment(student, courseId);
  const query = { student, course: courseId, lessonId };
  if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { content: { $regex: search, $options: 'i' } }];
  return StudentNote.find(query).sort({ updatedAt: -1 }).lean();
};
export const create = async (student, input) => {
  await ensureEnrollment(student, input.courseId);
  const note = await StudentNote.create({ student, course: input.courseId, lessonId: input.lessonId, title: input.title, content: input.content });
  const count = await StudentNote.countDocuments({ student });
  const user = await User.findByIdAndUpdate(student, { $set: { 'stats.notesCreated': count } }, { returnDocument: 'after' }).select('stats').lean();
  await createEvent({ userId: student, activity: { type: 'note', title: 'Saved a note', message: note.title, actionUrl: `/learn/${input.courseId}?lesson=${input.lessonId}` } });
  return { note: note.toObject(), stats: user.stats };
};
export const update = async (student, id, input) => {
  const note = await StudentNote.findOneAndUpdate({ _id: id, student }, { $set: input }, { returnDocument: 'after', runValidators: true }).lean();
  if (!note) throw new ApiError(404, 'Note not found');
  return note;
};
export const remove = async (student, id) => {
  const note = await StudentNote.findOneAndDelete({ _id: id, student });
  if (!note) throw new ApiError(404, 'Note not found');
  const count = await StudentNote.countDocuments({ student });
  const user = await User.findByIdAndUpdate(student, { $set: { 'stats.notesCreated': count } }, { returnDocument: 'after' }).select('stats').lean();
  return { id, stats: user.stats };
};
