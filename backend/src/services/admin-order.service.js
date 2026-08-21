import mongoose from 'mongoose';
import Order from '../models/Order.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import { ApiError } from '../utils/ApiError.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const objectId = (value, message) => {
  if (!mongoose.isValidObjectId(value)) throw new ApiError(404, message);
  return new mongoose.Types.ObjectId(value);
};
const paginationFrom = (query) => ({
  page: Math.max(1, Number.parseInt(query.page, 10) || 1),
  limit: Math.min(50, Math.max(1, Number.parseInt(query.limit, 10) || 10)),
});

export const getAdminOrders = async (query = {}) => {
  const { page, limit } = paginationFrom(query);
  const conditions = [];
  const search = String(query.search || '').trim().slice(0, 120);
  if (search) {
    const expression = new RegExp(escapeRegex(search), 'i');
    conditions.push({
      $or: [
        { orderNumber: expression },
        { 'student.name': expression },
        { 'student.email': expression },
        { 'items.title': expression },
      ],
    });
  }
  if (['pending', 'completed', 'failed', 'refunded'].includes(query.paymentStatus)) conditions.push({ paymentStatus: query.paymentStatus });
  if (['card', 'upi', 'netbanking', 'wallet', 'free'].includes(query.paymentMethod)) conditions.push({ paymentMethod: query.paymentMethod });
  if (query.price === 'free') conditions.push({ amount: 0 });
  if (query.price === 'paid') conditions.push({ amount: { $gt: 0 } });
  const match = conditions.length ? { $and: conditions } : {};
  const sorts = {
    newest: { createdAt: -1, _id: -1 },
    oldest: { createdAt: 1, _id: 1 },
    amountDesc: { amount: -1, createdAt: -1 },
    amountAsc: { amount: 1, createdAt: -1 },
  };
  const sort = sorts[query.sort] || sorts.newest;

  const [result] = await Order.aggregate([
    { $lookup: { from: User.collection.name, localField: 'user', foreignField: '_id', as: 'student' } },
    { $unwind: { path: '$student', preserveNullAndEmptyArrays: true } },
    {
      $facet: {
        orders: [
          { $match: match },
          { $sort: sort },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: CourseEnrollment.collection.name,
              let: { orderId: '$_id' },
              pipeline: [{ $match: { $expr: { $eq: ['$order', '$$orderId'] } } }, { $count: 'value' }],
              as: 'enrollmentTotals',
            },
          },
          {
            $project: {
              orderNumber: 1,
              student: { _id: '$student._id', name: '$student.name', email: '$student.email', avatar: '$student.avatar' },
              courseCount: { $size: { $ifNull: ['$items', []] } },
              courseTitle: { $arrayElemAt: ['$items.title', 0] },
              amount: 1,
              paymentMethod: 1,
              paymentStatus: 1,
              createdAt: 1,
              enrollmentCount: { $ifNull: [{ $arrayElemAt: ['$enrollmentTotals.value', 0] }, 0] },
            },
          },
        ],
        filtered: [{ $match: match }, { $count: 'total' }],
        summary: [{
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] } },
            pending: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] } },
            free: { $sum: { $cond: [{ $eq: ['$amount', 0] }, 1, 0] } },
            revenue: {
              $sum: {
                $cond: [
                  { $and: [{ $eq: ['$paymentStatus', 'completed'] }, { $ne: ['$paymentMethod', 'free'] }, { $gt: ['$amount', 0] }] },
                  '$amount',
                  0,
                ],
              },
            },
          },
        }],
      },
    },
  ]);

  const total = result.filtered[0]?.total || 0;
  const summary = result.summary[0] || { total: 0, completed: 0, pending: 0, free: 0, revenue: 0 };
  delete summary._id;
  return { orders: result.orders, pagination: { total, page, pages: Math.max(1, Math.ceil(total / limit)), limit }, summary };
};

export const getAdminOrder = async (value) => {
  const identifier = String(value || '').trim();
  const filter = mongoose.isValidObjectId(identifier) ? { _id: identifier } : { orderNumber: identifier };
  const order = await Order.findOne(filter)
    .select('_id user courses items orderNumber subtotal courseDiscount coupon tax amount paymentMethod paymentStatus createdAt updatedAt')
    .populate('user', '_id name email avatar')
    .populate('courses', '_id title slug instructor thumbnail')
    .lean();
  if (!order) throw new ApiError(404, 'Order not found');
  const enrollments = await CourseEnrollment.find({ order: order._id })
    .select('_id course progress percentageCompleted completedAt enrolledAt')
    .populate('course', '_id title slug')
    .lean();
  return { order, enrollments };
};

const progressExpression = { $max: [{ $ifNull: ['$percentageCompleted', 0] }, { $ifNull: ['$progress', 0] }] };
const completedExpression = { $or: [{ $ne: ['$completedAt', null] }, { $gte: ['$progressValue', 100] }] };

export const getAdminEnrollments = async (query = {}) => {
  const { page, limit } = paginationFrom(query);
  const conditions = [];
  const search = String(query.search || '').trim().slice(0, 120);
  if (search) {
    const expression = new RegExp(escapeRegex(search), 'i');
    conditions.push({ $or: [{ 'student.name': expression }, { 'student.email': expression }, { 'course.title': expression }, { 'order.orderNumber': expression }] });
  }
  if (query.progress === 'notStarted') conditions.push({ progressValue: 0 });
  if (query.progress === 'active') conditions.push({ progressValue: { $gt: 0, $lt: 100 } });
  if (query.progress === 'complete') conditions.push({ progressValue: { $gte: 100 } });
  if (query.completion === 'completed') conditions.push({ $or: [{ completedAt: { $ne: null } }, { progressValue: { $gte: 100 } }] });
  if (query.completion === 'inProgress') conditions.push({ completedAt: null, progressValue: { $lt: 100 } });
  const match = conditions.length ? { $and: conditions } : {};
  const sorts = {
    newest: { enrolledAt: -1, _id: -1 },
    oldest: { enrolledAt: 1, _id: 1 },
    progressDesc: { progressValue: -1, enrolledAt: -1 },
    progressAsc: { progressValue: 1, enrolledAt: -1 },
  };
  const sort = sorts[query.sort] || sorts.newest;

  const [result] = await CourseEnrollment.aggregate([
    { $addFields: { progressValue: progressExpression } },
    { $lookup: { from: User.collection.name, localField: 'user', foreignField: '_id', as: 'student' } },
    { $unwind: { path: '$student', preserveNullAndEmptyArrays: true } },
    { $lookup: { from: Course.collection.name, localField: 'course', foreignField: '_id', as: 'course' } },
    { $unwind: { path: '$course', preserveNullAndEmptyArrays: true } },
    { $lookup: { from: Order.collection.name, localField: 'order', foreignField: '_id', as: 'order' } },
    { $unwind: { path: '$order', preserveNullAndEmptyArrays: true } },
    {
      $facet: {
        enrollments: [
          { $match: match },
          { $sort: sort },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $project: {
              student: { _id: '$student._id', name: '$student.name', email: '$student.email', avatar: '$student.avatar' },
              course: { _id: '$course._id', title: '$course.title', slug: '$course.slug', instructor: '$course.instructor' },
              order: { _id: '$order._id', orderNumber: '$order.orderNumber' },
              progress: '$progressValue',
              currentLesson: 1,
              completedLessonCount: { $size: { $ifNull: ['$completedLessons', []] } },
              enrolledAt: 1,
              completedAt: 1,
              isCompleted: completedExpression,
            },
          },
        ],
        filtered: [{ $match: match }, { $count: 'total' }],
        summary: [{
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: { $sum: { $cond: [completedExpression, 1, 0] } },
            inProgress: { $sum: { $cond: [completedExpression, 0, 1] } },
            averageProgress: { $avg: '$progressValue' },
          },
        }],
      },
    },
  ]);

  const total = result.filtered[0]?.total || 0;
  const summary = result.summary[0] || { total: 0, completed: 0, inProgress: 0, averageProgress: 0 };
  delete summary._id;
  summary.averageProgress = Math.round(summary.averageProgress || 0);
  return { enrollments: result.enrollments, pagination: { total, page, pages: Math.max(1, Math.ceil(total / limit)), limit }, summary };
};

export const getAdminEnrollment = async (value) => {
  const id = objectId(value, 'Enrollment not found');
  const enrollment = await CourseEnrollment.findById(id)
    .select('_id user course order progress percentageCompleted currentLesson currentModule completedLessons completedModules watchTime bookmarks quizReadyLessons enrolledAt completedAt lastWatched lastWatchedAt createdAt updatedAt')
    .populate('user', '_id name email avatar')
    .populate('course', '_id title slug instructor thumbnail modules.moduleId modules.lessons.lessonId')
    .populate('order', '_id orderNumber paymentStatus paymentMethod amount')
    .lean();
  if (!enrollment) throw new ApiError(404, 'Enrollment not found');

  const course = enrollment.course;
  const totalLessons = course?.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0;
  const totalWatchSeconds = enrollment.watchTime?.reduce((total, item) => total + (Number(item.seconds) || 0), 0) || 0;
  const progress = Math.max(Number(enrollment.percentageCompleted) || 0, Number(enrollment.progress) || 0);
  return {
    ...enrollment,
    course: course ? { _id: course._id, title: course.title, slug: course.slug, instructor: course.instructor, thumbnail: course.thumbnail } : null,
    effectiveProgress: progress,
    isCompleted: Boolean(enrollment.completedAt || progress >= 100),
    learningSummary: {
      completedLessonCount: enrollment.completedLessons?.length || 0,
      totalLessonCount: totalLessons,
      completedModuleCount: enrollment.completedModules?.length || 0,
      totalWatchSeconds,
      bookmarkCount: enrollment.bookmarks?.length || 0,
      quizReadyLessonCount: enrollment.quizReadyLessons?.length || 0,
    },
  };
};
