import mongoose from 'mongoose';
import Course from '../models/Course.js';
import Discussion from '../models/Discussion.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

const SORTS = {
  newest: { createdAt: -1, _id: -1 },
  oldest: { createdAt: 1, _id: 1 },
  mostReplies: { replyCount: -1, createdAt: -1 },
  mostLiked: { likeCount: -1, createdAt: -1 },
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const assertId = (id, label = 'discussion') => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, `Invalid ${label} ID`);
};

const relationStages = [
  { $lookup: { from: User.collection.name, localField: 'author', foreignField: '_id', as: 'authorDoc' } },
  { $lookup: { from: Course.collection.name, localField: 'course', foreignField: '_id', as: 'courseDoc' } },
  {
    $set: {
      authorDoc: { $arrayElemAt: ['$authorDoc', 0] },
      courseDoc: { $arrayElemAt: ['$courseDoc', 0] },
      replyCount: { $size: { $ifNull: ['$replies', []] } },
      likeCount: { $size: { $ifNull: ['$likes', []] } },
    },
  },
  {
    $set: {
      lessonDoc: {
        $arrayElemAt: [
          {
            $filter: {
              input: {
                $reduce: {
                  input: { $ifNull: ['$courseDoc.modules', []] },
                  initialValue: [],
                  in: {
                    $concatArrays: [
                      '$$value',
                      {
                        $map: {
                          input: { $ifNull: ['$$this.lessons', []] },
                          as: 'lesson',
                          in: {
                            lessonId: '$$lesson.lessonId',
                            lessonTitle: '$$lesson.title',
                            moduleId: '$$this.moduleId',
                            moduleTitle: '$$this.title',
                          },
                        },
                      },
                    ],
                  },
                },
              },
              as: 'lesson',
              cond: { $eq: ['$$lesson.lessonId', '$lessonId'] },
            },
          },
          0,
        ],
      },
    },
  },
  {
    $set: {
      authorName: { $ifNull: ['$authorDoc.name', 'User unavailable'] },
      authorEmail: { $ifNull: ['$authorDoc.email', 'Email unavailable'] },
      authorAvatar: '$authorDoc.avatar',
      courseTitle: { $ifNull: ['$courseDoc.title', 'Course unavailable'] },
      lessonTitle: { $ifNull: ['$lessonDoc.lessonTitle', '$lessonId'] },
      moduleTitle: { $ifNull: ['$lessonDoc.moduleTitle', 'Module unavailable'] },
    },
  },
];

export const getDiscussions = async (query = {}) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 50);
  const initialMatch = {};
  if (query.course) initialMatch.course = new mongoose.Types.ObjectId(query.course);

  const displayMatch = {};
  if (query.replies === 'has') displayMatch.replyCount = { $gt: 0 };
  if (query.replies === 'none') displayMatch.replyCount = 0;
  if (query.search) {
    const pattern = new RegExp(escapeRegex(query.search), 'i');
    displayMatch.$or = [
      { question: pattern },
      { authorName: pattern },
      { authorEmail: pattern },
      { courseTitle: pattern },
      { lessonTitle: pattern },
    ];
  }

  const [result, summary, courses] = await Promise.all([
    Discussion.aggregate([
      { $match: initialMatch },
      ...relationStages,
      ...(Object.keys(displayMatch).length ? [{ $match: displayMatch }] : []),
      {
        $facet: {
          discussions: [
            { $sort: SORTS[query.sort] ?? SORTS.newest },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                question: 1,
                lessonId: 1,
                createdAt: 1,
                updatedAt: 1,
                replyCount: 1,
                likeCount: 1,
                author: { _id: '$authorDoc._id', name: '$authorName', email: '$authorEmail', avatar: '$authorAvatar' },
                course: { _id: '$courseDoc._id', title: '$courseTitle' },
                lesson: { lessonId: '$lessonId', title: '$lessonTitle', moduleId: '$lessonDoc.moduleId', moduleTitle: '$moduleTitle' },
              },
            },
          ],
          total: [{ $count: 'value' }],
        },
      },
    ]),
    Discussion.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          totalReplies: { $sum: { $size: { $ifNull: ['$replies', []] } } },
          courses: { $addToSet: '$course' },
        },
      },
      { $project: { _id: 0, total: 1, totalReplies: 1, activeCourses: { $size: '$courses' } } },
    ]),
    Discussion.aggregate([
      { $group: { _id: '$course' } },
      { $lookup: { from: Course.collection.name, localField: '_id', foreignField: '_id', as: 'course' } },
      { $set: { course: { $arrayElemAt: ['$course', 0] } } },
      { $match: { 'course._id': { $exists: true } } },
      { $project: { _id: '$course._id', title: '$course.title' } },
      { $sort: { title: 1 } },
    ]),
  ]);

  const facet = result[0] ?? { discussions: [], total: [] };
  const total = facet.total[0]?.value ?? 0;
  return {
    discussions: facet.discussions,
    pagination: { total, page, pages: Math.ceil(total / limit) || 1, limit },
    summary: summary[0] ?? { total: 0, totalReplies: 0, activeCourses: 0 },
    courses,
  };
};

export const getDiscussion = async (id) => {
  assertId(id);
  const discussion = await Discussion.findById(id)
    .populate('author', 'name email avatar')
    .populate('replies.author', 'name email avatar')
    .populate('course', 'title slug modules')
    .lean();
  if (!discussion) throw new ApiError(404, 'Discussion not found');

  const course = discussion.course;
  const module = course?.modules?.find((item) => item.lessons?.some((lesson) => lesson.lessonId === discussion.lessonId));
  const lesson = module?.lessons?.find((item) => item.lessonId === discussion.lessonId);
  return {
    _id: discussion._id,
    question: discussion.question,
    lessonId: discussion.lessonId,
    author: discussion.author,
    course: course ? { _id: course._id, title: course.title, slug: course.slug } : null,
    lesson: {
      lessonId: discussion.lessonId,
      title: lesson?.title ?? discussion.lessonId,
      moduleId: module?.moduleId ?? null,
      moduleTitle: module?.title ?? null,
    },
    likesCount: discussion.likes?.length ?? 0,
    replies: (discussion.replies ?? []).map((reply) => ({
      _id: reply._id,
      author: reply.author,
      message: reply.message,
      likesCount: reply.likes?.length ?? 0,
      createdAt: reply.createdAt,
      updatedAt: reply.updatedAt,
    })),
    replyCount: discussion.replies?.length ?? 0,
    createdAt: discussion.createdAt,
    updatedAt: discussion.updatedAt,
  };
};

export const deleteDiscussion = async (id) => {
  assertId(id);
  const discussion = await Discussion.findById(id);
  if (!discussion) throw new ApiError(404, 'Discussion not found');
  const authorId = discussion.author;
  const repliesRemoved = discussion.replies.length;
  await discussion.deleteOne();
  const remainingPosts = await Discussion.countDocuments({ author: authorId });
  await User.updateOne({ _id: authorId }, { $set: { 'stats.discussionPosts': remainingPosts } });
  return { id, repliesRemoved };
};

export const deleteReply = async (id, replyId) => {
  assertId(id);
  assertId(replyId, 'reply');
  const discussion = await Discussion.findById(id);
  if (!discussion) throw new ApiError(404, 'Discussion not found');
  const reply = discussion.replies.id(replyId);
  if (!reply) throw new ApiError(404, 'Reply not found');
  reply.deleteOne();
  await discussion.save();
  return { discussionId: id, replyId };
};
