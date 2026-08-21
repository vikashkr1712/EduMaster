import mongoose from 'mongoose';
import Discussion from '../models/Discussion.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { createEvent } from './notification.service.js';

const ensureEnrollment = async (user, course) => {
  if (!mongoose.isValidObjectId(course) || !await CourseEnrollment.exists({ user, course })) throw new ApiError(403, 'You must enroll in this course to join its discussion');
};
const populateDiscussion = (query) => query.populate('author', 'name avatar').populate('replies.author', 'name avatar');

export const list = async (user, lessonId, courseId, sort = 'newest', page = 1) => {
  await ensureEnrollment(user, courseId);
  const sortQuery = sort === 'oldest' ? { createdAt: 1 } : sort === 'liked' ? { likesCount: -1, createdAt: -1 } : { createdAt: -1 };
  const pipeline = [
    { $match: { course: new mongoose.Types.ObjectId(courseId), lessonId } },
    { $addFields: { likesCount: { $size: '$likes' } } },
    { $sort: sortQuery }, { $skip: (page - 1) * 10 }, { $limit: 10 },
  ];
  const [raw, total] = await Promise.all([Discussion.aggregate(pipeline), Discussion.countDocuments({ course: courseId, lessonId })]);
  const discussions = await populateDiscussion(Discussion.find({ _id: { $in: raw.map((item) => item._id) } })).lean();
  const byId = new Map(discussions.map((item) => [String(item._id), item]));
  return {
    discussions: raw.map((item) => {
      const discussion = byId.get(String(item._id));
      const replyCount = discussion.replies.length;
      return { ...discussion, replies: discussion.replies.slice(-5), replyCount, hasMoreReplies: replyCount > 5, likesCount: item.likesCount };
    }),
    pagination: { page, pages: Math.ceil(total / 10), total },
  };
};

export const listReplies = async (user, id, page = 1) => {
  const discussion = await populateDiscussion(Discussion.findById(id)).lean();
  if (!discussion) throw new ApiError(404, 'Discussion not found');
  await ensureEnrollment(user, discussion.course);
  const pageSize = 5;
  const start = Math.max(0, discussion.replies.length - page * pageSize);
  const end = discussion.replies.length - (page - 1) * pageSize;
  return { replies: discussion.replies.slice(start, end), pagination: { page, pages: Math.ceil(discussion.replies.length / pageSize), total: discussion.replies.length } };
};

export const create = async (user, input) => {
  await ensureEnrollment(user, input.courseId);
  const discussion = await Discussion.create({ course: input.courseId, lessonId: input.lessonId, author: user, question: input.question });
  const count = await Discussion.countDocuments({ author: user });
  const updated = await User.findByIdAndUpdate(user, { $set: { 'stats.discussionPosts': count } }, { returnDocument: 'after' }).select('stats').lean();
  await createEvent({ userId: user, activity: { type: 'discussion', title: 'Asked a question', message: input.question, actionUrl: `/learn/${input.courseId}?lesson=${input.lessonId}` } });
  return { discussion: await populateDiscussion(Discussion.findById(discussion._id)).lean(), stats: updated.stats };
};

export const reply = async (user, id, message) => {
  const discussion = await Discussion.findById(id);
  if (!discussion) throw new ApiError(404, 'Discussion not found');
  await ensureEnrollment(user, discussion.course);
  discussion.replies.push({ author: user, message });
  await discussion.save();
  await createEvent({
    userId: user,
    activity: { type: 'discussion', title: 'Replied to a discussion', message, actionUrl: `/learn/${discussion.course}?lesson=${discussion.lessonId}` },
  });
  if (String(discussion.author) !== String(user)) await createEvent({
    userId: discussion.author,
    notification: { title: 'New discussion reply', message: 'A learner replied to your course question.', type: 'course', actionUrl: `/learn/${discussion.course}?lesson=${discussion.lessonId}` },
  });
  return { discussion: await populateDiscussion(Discussion.findById(id)).lean(), notifyAuthor: String(discussion.author) !== String(user) };
};

export const update = async (user, id, question) => {
  const discussion = await Discussion.findOneAndUpdate({ _id: id, author: user }, { $set: { question } }, { returnDocument: 'after' });
  if (!discussion) throw new ApiError(404, 'Discussion not found or you are not its author');
  return populateDiscussion(Discussion.findById(id)).lean();
};

export const remove = async (user, id) => {
  const discussion = await Discussion.findOneAndDelete({ _id: id, author: user });
  if (!discussion) throw new ApiError(404, 'Discussion not found or you are not its author');
  const count = await Discussion.countDocuments({ author: user });
  const updated = await User.findByIdAndUpdate(user, { $set: { 'stats.discussionPosts': count } }, { returnDocument: 'after' }).select('stats').lean();
  return { id, stats: updated.stats };
};

export const toggleLike = async (user, id) => {
  const discussion = await Discussion.findById(id);
  if (!discussion) throw new ApiError(404, 'Discussion not found');
  await ensureEnrollment(user, discussion.course);
  const liked = discussion.likes.some((value) => String(value) === String(user));
  if (liked) discussion.likes.pull(user); else discussion.likes.addToSet(user);
  await discussion.save();
  return { liked: !liked, likesCount: discussion.likes.length };
};

export const updateReply = async (user, id, replyId, message) => {
  const discussion = await Discussion.findById(id);
  if (!discussion) throw new ApiError(404, 'Discussion not found');
  const reply = discussion.replies.id(replyId);
  if (!reply || String(reply.author) !== String(user)) throw new ApiError(404, 'Reply not found or you are not its author');
  reply.message = message;
  await discussion.save();
  return populateDiscussion(Discussion.findById(id)).lean();
};

export const removeReply = async (user, id, replyId) => {
  const discussion = await Discussion.findById(id);
  if (!discussion) throw new ApiError(404, 'Discussion not found');
  const reply = discussion.replies.id(replyId);
  if (!reply || String(reply.author) !== String(user)) throw new ApiError(404, 'Reply not found or you are not its author');
  reply.deleteOne();
  await discussion.save();
  return populateDiscussion(Discussion.findById(id)).lean();
};

export const toggleReplyLike = async (user, id, replyId) => {
  const discussion = await Discussion.findById(id);
  if (!discussion) throw new ApiError(404, 'Discussion not found');
  await ensureEnrollment(user, discussion.course);
  const reply = discussion.replies.id(replyId);
  if (!reply) throw new ApiError(404, 'Reply not found');
  const liked = reply.likes.some((value) => String(value) === String(user));
  if (liked) reply.likes.pull(user); else reply.likes.addToSet(user);
  await discussion.save();
  return { liked: !liked, likesCount: reply.likes.length };
};
