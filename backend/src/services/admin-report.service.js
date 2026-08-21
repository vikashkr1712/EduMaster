import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Certificate from '../models/Certificate.js';
import Course from '../models/Course.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import Discussion from '../models/Discussion.js';
import Notification from '../models/Notification.js';
import Order from '../models/Order.js';
import QuizAttempt from '../models/QuizAttempt.js';
import User from '../models/User.js';
import { buildRevenueOrderMatch } from './admin.service.js';

const RANGE_DAYS = { '7d': 7, '30d': 30, '90d': 90 };
const RANGE_LABELS = { '7d': 'Last 7 Days', '30d': 'Last 30 Days', '90d': 'Last 90 Days', all: 'All Time' };
const emptyGroup = (defaults) => ({ ...defaults });
const percent = (part, total) => total > 0 ? Math.round((part / total) * 1000) / 10 : 0;

const getRange = (key) => {
  const end = new Date();
  const days = RANGE_DAYS[key];
  if (!days) return { key: 'all', label: RANGE_LABELS.all, start: null, end };
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - days);
  return { key, label: RANGE_LABELS[key], start, end };
};

const dateMatch = (field, range) => range.start ? { [field]: { $gte: range.start, $lte: range.end } } : {};
const seriesFormat = (range) => range.key === 'all' ? '%Y-%m' : range.key === '90d' ? '%G-W%V' : '%Y-%m-%d';
const seriesFor = (Model, field, range, valueExpression = 1, extraMatch = {}) => Model.aggregate([
  { $match: { ...extraMatch, ...dateMatch(field, range) } },
  { $group: { _id: { $dateToString: { format: seriesFormat(range), date: `$${field}`, timezone: 'UTC' } }, value: { $sum: valueExpression } } },
  { $sort: { _id: 1 } },
  { $project: { _id: 0, label: '$_id', value: { $round: ['$value', 2] } } },
]);

const getOverview = async (range) => {
  const userMatch = dateMatch('createdAt', range);
  const courseMatch = dateMatch('createdAt', range);
  const enrollmentMatch = dateMatch('createdAt', range);
  const orderMatch = dateMatch('createdAt', range);
  const certificateMatch = dateMatch('issueDate', range);
  const quizMatch = { status: 'completed', ...dateMatch('completedAt', range) };
  const submissionMatch = dateMatch('submittedAt', range);
  const discussionMatch = dateMatch('createdAt', range);
  const [users, courses, enrollments, orders, certificates, quizAttempts, assignmentSubmissions, discussions, revenue] = await Promise.all([
    User.countDocuments(userMatch), Course.countDocuments(courseMatch), CourseEnrollment.countDocuments(enrollmentMatch), Order.countDocuments(orderMatch), Certificate.countDocuments(certificateMatch), QuizAttempt.countDocuments(quizMatch), AssignmentSubmission.countDocuments(submissionMatch), Discussion.countDocuments(discussionMatch),
    Order.aggregate([{ $match: buildRevenueOrderMatch(orderMatch.createdAt) }, { $group: { _id: null, value: { $sum: '$amount' } } }]),
  ]);
  return { users, courses, enrollments, orders, revenue: revenue[0]?.value ?? 0, certificates, quizAttempts, assignmentSubmissions, discussions };
};

const getUsers = async (range) => {
  const [result] = await User.aggregate([{ $match: dateMatch('createdAt', range) }, { $group: { _id: null, total: { $sum: 1 }, students: { $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] } }, admins: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } }, enabled: { $sum: { $cond: ['$isActive', 1, 0] } }, disabled: { $sum: { $cond: ['$isActive', 0, 1] } } } }]);
  return result ?? emptyGroup({ total: 0, students: 0, admins: 0, enabled: 0, disabled: 0 });
};

const getOrders = async (range) => {
  const match = dateMatch('createdAt', range);
  const [result] = await Order.aggregate([{ $match: match }, { $group: { _id: null, total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] } }, pending: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] } }, failed: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'failed'] }, 1, 0] } }, refunded: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'refunded'] }, 1, 0] } }, free: { $sum: { $cond: [{ $eq: ['$paymentMethod', 'free'] }, 1, 0] } }, paid: { $sum: { $cond: [{ $and: [{ $eq: ['$paymentStatus', 'completed'] }, { $ne: ['$paymentMethod', 'free'] }, { $gt: ['$amount', 0] }] }, 1, 0] } }, revenue: { $sum: { $cond: [{ $and: [{ $eq: ['$paymentStatus', 'completed'] }, { $ne: ['$paymentMethod', 'free'] }, { $gt: ['$amount', 0] }] }, '$amount', 0] } } } }, { $set: { averagePaidOrderValue: { $cond: [{ $gt: ['$paid', 0] }, { $round: [{ $divide: ['$revenue', '$paid'] }, 2] }, 0] } } }]);
  return result ?? emptyGroup({ total: 0, completed: 0, pending: 0, failed: 0, refunded: 0, free: 0, paid: 0, revenue: 0, averagePaidOrderValue: 0 });
};

const completionExpression = { $or: [{ $ne: ['$completedAt', null] }, { $gte: ['$percentageCompleted', 100] }, { $gte: ['$progress', 100] }] };
const progressExpression = { $max: [{ $ifNull: ['$percentageCompleted', 0] }, { $ifNull: ['$progress', 0] }] };

const getLearning = async (range) => {
  const [result] = await CourseEnrollment.aggregate([{ $match: dateMatch('createdAt', range) }, { $group: { _id: null, enrollments: { $sum: 1 }, completed: { $sum: { $cond: [completionExpression, 1, 0] } }, averageProgress: { $avg: progressExpression } } }, { $set: { inProgress: { $subtract: ['$enrollments', '$completed'] }, completionRate: { $cond: [{ $gt: ['$enrollments', 0] }, { $round: [{ $multiply: [{ $divide: ['$completed', '$enrollments'] }, 100] }, 1] }, 0] }, averageProgress: { $round: [{ $ifNull: ['$averageProgress', 0] }, 1] } } }]);
  return result ?? emptyGroup({ enrollments: 0, completed: 0, inProgress: 0, completionRate: 0, averageProgress: 0 });
};

const getAssessments = async (range) => {
  const quizMatch = { status: 'completed', ...dateMatch('completedAt', range) };
  const submissionMatch = dateMatch('submittedAt', range);
  const assignmentMatch = dateMatch('createdAt', range);
  const [quiz, submissions, assignments] = await Promise.all([
    QuizAttempt.aggregate([{ $match: quizMatch }, { $group: { _id: null, attempts: { $sum: 1 }, passed: { $sum: { $cond: ['$passed', 1, 0] } }, failed: { $sum: { $cond: ['$passed', 0, 1] } }, averageScore: { $avg: '$score' } } }]),
    AssignmentSubmission.aggregate([{ $match: submissionMatch }, { $group: { _id: null, submissions: { $sum: 1 }, reviewed: { $sum: { $cond: [{ $eq: ['$status', 'reviewed'] }, 1, 0] } }, pendingReview: { $sum: { $cond: [{ $eq: ['$status', 'submitted'] }, 1, 0] } }, averageMarks: { $avg: { $cond: [{ $and: [{ $eq: ['$status', 'reviewed'] }, { $ne: ['$marks', null] }] }, '$marks', null] } } } }]),
    Assignment.countDocuments(assignmentMatch),
  ]);
  const quizData = quiz[0] ?? { attempts: 0, passed: 0, failed: 0, averageScore: 0 };
  const submissionData = submissions[0] ?? { submissions: 0, reviewed: 0, pendingReview: 0, averageMarks: 0 };
  return { assignments, ...quizData, passRate: percent(quizData.passed, quizData.attempts), averageScore: Math.round((quizData.averageScore ?? 0) * 10) / 10, ...submissionData, averageMarks: Math.round((submissionData.averageMarks ?? 0) * 10) / 10 };
};

const getCertificates = async (range) => {
  const [result] = await Certificate.aggregate([{ $match: dateMatch('issueDate', range) }, { $group: { _id: null, issued: { $sum: 1 }, valid: { $sum: { $cond: [{ $eq: ['$status', 'valid'] }, 1, 0] } }, revoked: { $sum: { $cond: [{ $eq: ['$status', 'revoked'] }, 1, 0] } }, users: { $addToSet: '$user' }, courses: { $addToSet: '$course' } } }, { $project: { issued: 1, valid: 1, revoked: 1, uniqueUsers: { $size: '$users' }, issuingCourses: { $size: '$courses' } } }]);
  return result ?? emptyGroup({ issued: 0, valid: 0, revoked: 0, uniqueUsers: 0, issuingCourses: 0 });
};

const getCommunity = async (range) => {
  const discussionMatch = dateMatch('createdAt', range);
  const replyDate = range.start ? { $and: [{ $gte: ['$$reply.createdAt', range.start] }, { $lte: ['$$reply.createdAt', range.end] }] } : true;
  const [discussionData, replyData] = await Promise.all([
    Discussion.aggregate([{ $match: discussionMatch }, { $group: { _id: null, discussions: { $sum: 1 }, discussionLikes: { $sum: { $size: { $ifNull: ['$likes', []] } } }, courses: { $addToSet: '$course' } } }, { $project: { discussions: 1, discussionLikes: 1, coursesWithDiscussions: { $size: '$courses' } } }]),
    Discussion.aggregate([{ $project: { replies: { $filter: { input: { $ifNull: ['$replies', []] }, as: 'reply', cond: replyDate } } } }, { $unwind: '$replies' }, { $group: { _id: null, replies: { $sum: 1 }, replyLikes: { $sum: { $size: { $ifNull: ['$replies.likes', []] } } } } }]),
  ]);
  const discussions = discussionData[0] ?? { discussions: 0, discussionLikes: 0, coursesWithDiscussions: 0 };
  const replies = replyData[0] ?? { replies: 0, replyLikes: 0 };
  return { discussions: discussions.discussions, replies: replies.replies, likes: discussions.discussionLikes + replies.replyLikes, coursesWithDiscussions: discussions.coursesWithDiscussions };
};

const getNotifications = async (range) => {
  const [result] = await Notification.aggregate([{ $match: { campaign: { $exists: true, $ne: null }, ...dateMatch('createdAt', range) } }, { $group: { _id: '$campaign', recipients: { $sum: 1 }, read: { $sum: { $cond: ['$read', 1, 0] } }, unread: { $sum: { $cond: ['$read', 0, 1] } } } }, { $group: { _id: null, campaigns: { $sum: 1 }, recipients: { $sum: '$recipients' }, read: { $sum: '$read' }, unread: { $sum: '$unread' } } }]);
  const data = result ?? { campaigns: 0, recipients: 0, read: 0, unread: 0 };
  return { ...data, readRate: percent(data.read, data.recipients) };
};

const getCoursePerformance = (range) => {
  const enrollmentDate = range.start ? [{ $gte: ['$createdAt', range.start] }, { $lte: ['$createdAt', range.end] }] : [];
  const orderDate = range.start ? [{ $gte: ['$createdAt', range.start] }, { $lte: ['$createdAt', range.end] }] : [];
  const certificateDate = range.start ? [{ $gte: ['$issueDate', range.start] }, { $lte: ['$issueDate', range.end] }] : [];
  return Course.aggregate([
    { $lookup: { from: CourseEnrollment.collection.name, let: { courseId: '$_id' }, pipeline: [{ $match: { $expr: { $and: [{ $eq: ['$course', '$$courseId'] }, ...enrollmentDate] } } }, { $group: { _id: null, enrollments: { $sum: 1 }, completed: { $sum: { $cond: [completionExpression, 1, 0] } }, averageProgress: { $avg: progressExpression } } }], as: 'enrollmentMetrics' } },
    { $lookup: { from: Order.collection.name, let: { courseId: '$_id' }, pipeline: [{ $match: { $expr: { $and: [{ $eq: ['$paymentStatus', 'completed'] }, { $ne: ['$paymentMethod', 'free'] }, { $gt: ['$amount', 0] }, ...orderDate] } } }, { $unwind: '$items' }, { $match: { $expr: { $eq: ['$items.course', '$$courseId'] } } }, { $group: { _id: null, revenue: { $sum: '$items.price' } } }], as: 'revenueMetrics' } },
    { $lookup: { from: Certificate.collection.name, let: { courseId: '$_id' }, pipeline: [{ $match: { $expr: { $and: [{ $eq: ['$course', '$$courseId'] }, ...certificateDate] } } }, { $count: 'certificates' }], as: 'certificateMetrics' } },
    { $set: { enrollment: { $arrayElemAt: ['$enrollmentMetrics', 0] }, revenueMetric: { $arrayElemAt: ['$revenueMetrics', 0] }, certificateMetric: { $arrayElemAt: ['$certificateMetrics', 0] } } },
    { $project: { title: 1, enrollments: { $ifNull: ['$enrollment.enrollments', 0] }, completed: { $ifNull: ['$enrollment.completed', 0] }, completionRate: { $cond: [{ $gt: [{ $ifNull: ['$enrollment.enrollments', 0] }, 0] }, { $round: [{ $multiply: [{ $divide: [{ $ifNull: ['$enrollment.completed', 0] }, '$enrollment.enrollments'] }, 100] }, 1] }, 0] }, averageProgress: { $round: [{ $ifNull: ['$enrollment.averageProgress', 0] }, 1] }, revenue: { $ifNull: ['$revenueMetric.revenue', 0] }, certificates: { $ifNull: ['$certificateMetric.certificates', 0] } } },
    { $sort: { enrollments: -1, title: 1 } },
  ]);
};

export const getAdminReport = async (rangeKey = '30d') => {
  const range = getRange(rangeKey);
  const [overview, users, orders, learning, assessments, certificates, community, notifications, coursePerformance, revenueSeries, userSeries, enrollmentSeries] = await Promise.all([
    getOverview(range), getUsers(range), getOrders(range), getLearning(range), getAssessments(range), getCertificates(range), getCommunity(range), getNotifications(range), getCoursePerformance(range),
    seriesFor(Order, 'createdAt', range, '$amount', buildRevenueOrderMatch()),
    seriesFor(User, 'createdAt', range), seriesFor(CourseEnrollment, 'createdAt', range),
  ]);
  return { range: { key: range.key, label: range.label, start: range.start, end: range.end }, generatedAt: new Date(), overview, users, orders, learning, assessments, certificates, community, notifications, coursePerformance, series: { revenue: revenueSeries, users: userSeries, enrollments: enrollmentSeries } };
};
