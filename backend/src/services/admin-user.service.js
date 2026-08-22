import mongoose from 'mongoose';
import User from '../models/User.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import Order from '../models/Order.js';
import Certificate from '../models/Certificate.js';
import QuizAttempt from '../models/QuizAttempt.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Discussion from '../models/Discussion.js';
import StudentNote from '../models/StudentNote.js';
import Notification from '../models/Notification.js';
import Activity from '../models/Activity.js';
import Achievement from '../models/Achievement.js';
import EmailQueue from '../models/EmailQueue.js';
import PlatformSetting from '../models/PlatformSetting.js';
import { ApiError } from '../utils/ApiError.js';

const detailFields = '_id name email avatar username phone bio location role isActive isDemo lastLoginAt stats createdAt updatedAt';
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parseId = (value) => {
  if (!mongoose.isValidObjectId(value)) throw new ApiError(404, 'User not found');
  return new mongoose.Types.ObjectId(value);
};

const requireUser = async (userId) => {
  const user = await User.findById(parseId(userId)).select(detailFields);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

const ensureAnotherActiveAdmin = async (targetId) => {
  const remainingAdmins = await User.countDocuments({
    _id: { $ne: targetId },
    role: 'admin',
    isActive: true,
  });
  if (remainingAdmins === 0) {
    throw new ApiError(409, 'The last active administrator account cannot be removed or disabled.');
  }
};

const countLookup = (from, foreignField, as) => ({
  $lookup: {
    from,
    let: { userId: '$_id' },
    pipeline: [
      { $match: { $expr: { $eq: [`$${foreignField}`, '$$userId'] } } },
      { $count: 'value' },
    ],
    as,
  },
});

export const getAdminUsers = async (query = {}) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, Number.parseInt(query.limit, 10) || 10));
  const match = {};
  const search = String(query.search || '').trim().slice(0, 120);
  if (search) {
    const expression = new RegExp(escapeRegex(search), 'i');
    match.$or = [{ name: expression }, { email: expression }];
  }
  if (['user', 'admin'].includes(query.role)) match.role = query.role;
  if (query.status === 'active') match.isActive = true;
  if (query.status === 'inactive') match.isActive = false;

  const sorts = {
    newest: { createdAt: -1, _id: -1 },
    oldest: { createdAt: 1, _id: 1 },
    nameAsc: { name: 1, _id: 1 },
    nameDesc: { name: -1, _id: 1 },
  };
  const sort = sorts[query.sort] || sorts.newest;

  const [result] = await User.aggregate([
    {
      $facet: {
        users: [
          { $match: match },
          { $sort: sort },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          countLookup(CourseEnrollment.collection.name, 'user', 'enrollmentTotals'),
          countLookup(Order.collection.name, 'user', 'orderTotals'),
          countLookup(Certificate.collection.name, 'user', 'certificateTotals'),
          {
            $project: {
              name: 1,
              email: 1,
              avatar: 1,
              role: 1,
              isActive: 1,
              isDemo: 1,
              createdAt: 1,
              updatedAt: 1,
              enrollmentCount: { $ifNull: [{ $arrayElemAt: ['$enrollmentTotals.value', 0] }, 0] },
              orderCount: { $ifNull: [{ $arrayElemAt: ['$orderTotals.value', 0] }, 0] },
              certificateCount: { $ifNull: [{ $arrayElemAt: ['$certificateTotals.value', 0] }, 0] },
            },
          },
        ],
        filtered: [{ $match: match }, { $count: 'total' }],
        summary: [{
          $group: {
            _id: null,
            total: { $sum: 1 },
            students: { $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] } },
            admins: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } },
            active: { $sum: { $cond: ['$isActive', 1, 0] } },
            inactive: { $sum: { $cond: ['$isActive', 0, 1] } },
          },
        }],
      },
    },
  ]);

  const total = result.filtered[0]?.total || 0;
  const summary = result.summary[0] || { total: 0, students: 0, admins: 0, active: 0, inactive: 0 };
  delete summary._id;
  return {
    users: result.users,
    pagination: { total, page, pages: Math.max(1, Math.ceil(total / limit)), limit },
    summary,
  };
};

export const getAdminUser = async (userId) => {
  const id = parseId(userId);
  const [userRecord, enrollmentSummary, orderCount, certificateCount, quizAttemptCount, assignmentSubmissionCount, authoredDiscussionCount, discussionReplySummary, noteCount, notificationCount, activityCount, achievementCount, emailQueueCount] = await Promise.all([
    User.findById(id).select(`${detailFields} wishlist cart`).lean(),
    CourseEnrollment.aggregate([
      { $match: { user: id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $ne: ['$completedAt', null] }, 1, 0] } },
          averageProgress: { $avg: { $ifNull: ['$percentageCompleted', '$progress'] } },
        },
      },
    ]),
    Order.countDocuments({ user: id }),
    Certificate.countDocuments({ user: id }),
    QuizAttempt.countDocuments({ user: id }),
    AssignmentSubmission.countDocuments({ student: id }),
    Discussion.countDocuments({ author: id }),
    Discussion.aggregate([
      { $unwind: '$replies' },
      { $match: { 'replies.author': id } },
      { $count: 'total' },
    ]),
    StudentNote.countDocuments({ student: id }),
    Notification.countDocuments({ user: id }),
    Activity.countDocuments({ user: id }),
    Achievement.countDocuments({ user: id }),
    EmailQueue.countDocuments({ user: id }),
  ]);
  if (!userRecord) throw new ApiError(404, 'User not found');

  const enrollments = enrollmentSummary[0] || { total: 0, completed: 0, averageProgress: 0 };
  const { wishlist = [], cart = [], ...user } = userRecord;
  return {
    ...user,
    related: {
      enrollmentCount: enrollments.total,
      completedCourseCount: enrollments.completed,
      averageProgress: Math.round(enrollments.averageProgress || 0),
      orderCount,
      certificateCount,
      quizAttemptCount,
      assignmentSubmissionCount,
      discussionCount: authoredDiscussionCount + (discussionReplySummary[0]?.total || 0),
      noteCount,
      notificationCount,
      activityCount,
      achievementCount,
      emailQueueCount,
      wishlistCount: wishlist.length,
      cartCount: cart.length,
    },
  };
};

export const updateAdminUser = async (userId, updates) => {
  const user = await User.findByIdAndUpdate(
    parseId(userId),
    { $set: updates },
    { returnDocument: 'after', runValidators: true }
  ).select(detailFields);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const updateAdminUserRole = async (userId, role, actingAdminId) => {
  const user = await requireUser(userId);
  if (String(user._id) === String(actingAdminId) && role !== 'admin') {
    throw new ApiError(409, 'You cannot remove your own administrator role.');
  }
  if (user.role === 'admin' && role !== 'admin') await ensureAnotherActiveAdmin(user._id);
  user.role = role;
  if (role === 'admin') user.isDemo = false;
  await user.save();
  return user;
};

export const updateAdminUserStatus = async (userId, isActive, actingAdminId) => {
  const user = await requireUser(userId);
  if (String(user._id) === String(actingAdminId) && !isActive) {
    throw new ApiError(409, 'You cannot deactivate your own administrator account.');
  }
  if (user.role === 'admin' && user.isActive && !isActive) await ensureAnotherActiveAdmin(user._id);
  user.isActive = isActive;
  await user.save();
  return user;
};

export const updateAdminUserDemoStatus = async (userId, isDemo, actingAdminId) => {
  const user = await requireUser(userId);
  if (String(user._id) === String(actingAdminId)) {
    throw new ApiError(409, 'You cannot mark your own administrator account as a demo account.');
  }
  if (isDemo && user.role !== 'user') {
    throw new ApiError(409, 'Administrator accounts cannot be marked as demo accounts.');
  }
  if (isDemo && user.isActive) {
    throw new ApiError(409, 'Deactivate this account before marking it as a demo account.');
  }
  user.isDemo = isDemo;
  await user.save();
  return user;
};

const remainingUserReferences = async (id) => {
  const references = await Promise.all([
    CourseEnrollment.exists({ user: id }),
    Order.exists({ user: id }),
    Certificate.exists({ user: id }),
    QuizAttempt.exists({ user: id }),
    AssignmentSubmission.exists({ student: id }),
    Discussion.exists({ $or: [{ author: id }, { likes: id }, { 'replies.author': id }, { 'replies.likes': id }] }),
    StudentNote.exists({ student: id }),
    Notification.exists({ $or: [{ user: id }, { createdBy: id }] }),
    Activity.exists({ user: id }),
    Achievement.exists({ user: id }),
    EmailQueue.exists({ user: id }),
    PlatformSetting.exists({ updatedBy: id }),
  ]);
  return references.some(Boolean);
};

export const deleteAdminUser = async (userId, actingAdminId, confirmEmail) => {
  const user = await requireUser(userId);
  if (String(user._id) === String(actingAdminId)) {
    throw new ApiError(409, 'You cannot delete your own administrator account.');
  }
  if (user.role === 'admin') {
    throw new ApiError(409, 'Administrator accounts cannot be permanently deleted. Deactivate or change the role instead.');
  }
  if (!user.isDemo) {
    throw new ApiError(409, 'Permanent deletion is limited to accounts explicitly marked as demo/test users. Deactivate this user instead.');
  }
  if (user.isActive) {
    throw new ApiError(409, 'Deactivate this demo account before permanently deleting it.');
  }
  if (String(confirmEmail || '').trim().toLowerCase() !== user.email.toLowerCase()) {
    throw new ApiError(409, 'The deletion confirmation does not match this demo user.');
  }

  const preview = await getAdminUser(user._id);
  await Promise.all([
    CourseEnrollment.deleteMany({ user: user._id }),
    Order.deleteMany({ user: user._id }),
    Certificate.deleteMany({ user: user._id }),
    QuizAttempt.deleteMany({ user: user._id }),
    AssignmentSubmission.deleteMany({ student: user._id }),
    Discussion.deleteMany({ author: user._id }),
    StudentNote.deleteMany({ student: user._id }),
    Notification.deleteMany({ user: user._id }),
    Activity.deleteMany({ user: user._id }),
    Achievement.deleteMany({ user: user._id }),
    EmailQueue.deleteMany({ user: user._id }),
  ]);
  await Promise.all([
    Discussion.updateMany({ likes: user._id }, { $pull: { likes: user._id } }),
    Discussion.updateMany({ 'replies.author': user._id }, { $pull: { replies: { author: user._id } } }),
    Discussion.updateMany({ 'replies.likes': user._id }, { $pull: { 'replies.$[].likes': user._id } }),
    Notification.updateMany({ createdBy: user._id }, { $set: { createdBy: null } }),
    PlatformSetting.updateMany({ updatedBy: user._id }, { $set: { updatedBy: null } }),
  ]);
  if (await remainingUserReferences(user._id)) {
    throw new ApiError(500, 'Demo cleanup stopped because linked records remain. The user account was preserved.');
  }
  await user.deleteOne();
  return { user, deleted: preview.related };
};
