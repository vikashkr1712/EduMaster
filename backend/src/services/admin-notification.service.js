import mongoose from 'mongoose';
import Course from '../models/Course.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

const SORTS = { newest: { createdAt: -1, _id: -1 }, oldest: { createdAt: 1, _id: 1 }, titleAsc: { title: 1, _id: 1 } };
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const assertId = (id) => { if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Invalid notification ID'); };
const campaignMatch = { campaign: { $exists: true, $ne: null } };

const campaignGroup = {
  $group: {
    _id: '$campaign',
    title: { $first: '$title' },
    message: { $first: '$message' },
    type: { $first: '$type' },
    audience: { $first: '$audience' },
    course: { $first: '$course' },
    createdBy: { $first: '$createdBy' },
    actionUrl: { $first: '$actionUrl' },
    createdAt: { $min: '$createdAt' },
    recipientCount: { $sum: 1 },
    readCount: { $sum: { $cond: ['$read', 1, 0] } },
    unreadCount: { $sum: { $cond: ['$read', 0, 1] } },
  },
};

const relationStages = [
  { $lookup: { from: User.collection.name, localField: 'createdBy', foreignField: '_id', as: 'creatorDoc' } },
  { $lookup: { from: Course.collection.name, localField: 'course', foreignField: '_id', as: 'courseDoc' } },
  { $set: { creatorDoc: { $arrayElemAt: ['$creatorDoc', 0] }, courseDoc: { $arrayElemAt: ['$courseDoc', 0] } } },
  { $project: { title: 1, message: 1, type: 1, audience: 1, actionUrl: 1, createdAt: 1, recipientCount: 1, readCount: 1, unreadCount: 1, createdBy: { _id: '$creatorDoc._id', name: '$creatorDoc.name', email: '$creatorDoc.email' }, course: { _id: '$courseDoc._id', title: '$courseDoc.title' } } },
];

export const getAdminNotifications = async (query = {}) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 50);
  const initial = { ...campaignMatch };
  if (query.audience) initial.audience = query.audience;
  if (query.type) initial.type = query.type;
  if (query.course) initial.course = new mongoose.Types.ObjectId(query.course);
  const groupedMatch = {};
  if (query.search) {
    const pattern = new RegExp(escapeRegex(query.search), 'i');
    groupedMatch.$or = [{ title: pattern }, { message: pattern }];
  }

  const [result, summary, courses] = await Promise.all([
    Notification.aggregate([
      { $match: initial }, campaignGroup,
      ...(Object.keys(groupedMatch).length ? [{ $match: groupedMatch }] : []),
      { $facet: { notifications: [{ $sort: SORTS[query.sort] ?? SORTS.newest }, { $skip: (page - 1) * limit }, { $limit: limit }, ...relationStages], total: [{ $count: 'value' }] } },
    ]),
    Notification.aggregate([{ $match: campaignMatch }, campaignGroup, { $group: { _id: null, total: { $sum: 1 }, totalRecipients: { $sum: '$recipientCount' }, read: { $sum: '$readCount' }, unread: { $sum: '$unreadCount' } } }, { $project: { _id: 0 } }]),
    Notification.aggregate([{ $match: { ...campaignMatch, course: { $exists: true, $ne: null } } }, { $group: { _id: '$course' } }, { $lookup: { from: Course.collection.name, localField: '_id', foreignField: '_id', as: 'course' } }, { $set: { course: { $arrayElemAt: ['$course', 0] } } }, { $match: { 'course._id': { $exists: true } } }, { $project: { _id: '$course._id', title: '$course.title' } }, { $sort: { title: 1 } }]),
  ]);
  const facet = result[0] ?? { notifications: [], total: [] };
  const total = facet.total[0]?.value ?? 0;
  return { notifications: facet.notifications, pagination: { total, page, pages: Math.ceil(total / limit) || 1, limit }, summary: summary[0] ?? { total: 0, totalRecipients: 0, read: 0, unread: 0 }, courses };
};

export const getAdminNotification = async (id, query = {}) => {
  assertId(id);
  const campaign = new mongoose.Types.ObjectId(id);
  const recipientPage = Math.max(Number.parseInt(query.recipientPage, 10) || 1, 1);
  const recipientLimit = Math.min(Math.max(Number.parseInt(query.recipientLimit, 10) || 20, 1), 50);
  const [notification, counts, recipients, recipientTotal] = await Promise.all([
    Notification.findOne({ campaign }).populate('createdBy', 'name email').populate('course', 'title').lean(),
    Notification.aggregate([{ $match: { campaign } }, { $group: { _id: null, recipientCount: { $sum: 1 }, readCount: { $sum: { $cond: ['$read', 1, 0] } }, unreadCount: { $sum: { $cond: ['$read', 0, 1] } } } }, { $project: { _id: 0 } }]),
    Notification.find({ campaign }).select('user read readAt archived createdAt').populate('user', 'name email avatar').sort({ createdAt: 1, _id: 1 }).skip((recipientPage - 1) * recipientLimit).limit(recipientLimit).lean(),
    Notification.countDocuments({ campaign }),
  ]);
  if (!notification) throw new ApiError(404, 'Notification not found');
  return {
    notification: { _id: notification.campaign, title: notification.title, message: notification.message, type: notification.type, audience: notification.audience, actionUrl: notification.actionUrl, course: notification.course, createdBy: notification.createdBy, createdAt: notification.createdAt, ...(counts[0] ?? { recipientCount: 0, readCount: 0, unreadCount: 0 }) },
    recipients,
    pagination: { total: recipientTotal, page: recipientPage, pages: Math.ceil(recipientTotal / recipientLimit) || 1, limit: recipientLimit },
  };
};

const getRecipientIds = async (input) => {
  if (input.audience === 'allStudents') return User.distinct('_id', { role: 'user', isActive: true });
  if (input.audience === 'specificUser') {
    const user = await User.findOne({ _id: input.userId, role: 'user', isActive: true }).select('_id').lean();
    if (!user) throw new ApiError(404, 'Eligible student not found');
    return [user._id];
  }
  const course = await Course.findById(input.courseId).select('_id').lean();
  if (!course) throw new ApiError(404, 'Course not found');
  const enrolledIds = await CourseEnrollment.distinct('user', { course: course._id });
  return User.distinct('_id', { _id: { $in: enrolledIds }, role: 'user', isActive: true });
};

export const createAdminNotification = async (adminId, input) => {
  const uniqueRecipients = [...new Set((await getRecipientIds(input)).map(String))];
  if (uniqueRecipients.length === 0) throw new ApiError(409, 'No eligible recipients were found.');
  const campaign = new mongoose.Types.ObjectId();
  const documents = uniqueRecipients.map((user) => ({ user, title: input.title, message: input.message, type: input.type, actionUrl: input.actionUrl ?? '', campaign, audience: input.audience, course: input.audience === 'courseStudents' ? input.courseId : undefined, createdBy: adminId, push: { enabled: false, title: input.title, body: input.message, data: { actionUrl: input.actionUrl ?? '' } } }));
  const session = await mongoose.startSession();
  try {
    try {
      await session.withTransaction(() => Notification.insertMany(documents, { session }));
    } catch (error) {
      if (error?.code !== 20 && error?.codeName !== 'IllegalOperation' && !String(error?.message).includes('Transaction numbers are only allowed')) throw error;
      await Notification.deleteMany({ campaign });
      try { await Notification.insertMany(documents, { ordered: true }); } catch (insertError) { await Notification.deleteMany({ campaign }); throw insertError; }
    }
  } finally {
    await session.endSession();
  }
  return { id: campaign, recipientCount: uniqueRecipients.length };
};

export const getAdminNotificationOptions = async (query = {}) => {
  const search = String(query.search ?? '').trim();
  const studentMatch = { role: 'user', isActive: true };
  if (search) { const pattern = new RegExp(escapeRegex(search), 'i'); studentMatch.$or = [{ name: pattern }, { email: pattern }]; }
  const [courses, students] = await Promise.all([
    Course.find({}).select('title').sort({ title: 1 }).lean(),
    User.find(studentMatch).select('name email avatar').sort({ name: 1 }).limit(10).lean(),
  ]);
  return { courses, students };
};
