import mongoose from 'mongoose';
import Course from '../models/Course.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import Order from '../models/Order.js';
import OrderCounter from '../models/OrderCounter.js';
import User from '../models/User.js';
import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Discussion from '../models/Discussion.js';
import { buildAssignmentsForCourse } from '../utils/assignmentFactory.js';
import { ApiError } from '../utils/ApiError.js';
import { createEvent } from './notification.service.js';
import { buildCourseCurriculum } from '../utils/courseCurriculum.js';
import { ensureCompletedCertificates } from './certificate.service.js';

const TAX_RATE = 0.18;
const COUPONS = {
  WELCOME20: 20,
  EDU10: 10,
  FIRST50: 50,
};

const resolveCourse = async (value, session) => {
  const id = String(value ?? '').trim();
  let course = mongoose.isValidObjectId(id)
    ? await Course.findById(id).session(session)
    : null;

  if (!course && Number.isInteger(Number(id))) {
    course = await Course.findOne({ sourceId: Number(id) }).session(session);
  }

  if (!course || !course.isPublished) {
    throw new ApiError(404, 'One or more selected courses are unavailable');
  }
  if (!course.modules?.length) {
    course.modules = buildCourseCurriculum(course);
    await course.save({ session });
  }
  return course;
};

const nextOrderNumber = async (session) => {
  const year = new Date().getFullYear();
  const counter = await OrderCounter.findOneAndUpdate(
    { _id: `orders-${year}` },
    { $inc: { sequence: 1 } },
    { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true, session }
  );
  return `EDU-${year}-${String(counter.sequence).padStart(6, '0')}`;
};

const getPricing = (course) => {
  const listedPrice = Number(course.price) || 0;
  const rawDiscount = Number(course.discountPrice);
  const price = Number.isFinite(rawDiscount) && rawDiscount > 0 ? rawDiscount : listedPrice;
  const oldPrice = Number(course.oldPrice);
  const originalPrice = Number.isFinite(oldPrice) && oldPrice > price ? oldPrice : listedPrice;
  return { price, originalPrice };
};

export const createOrder = async (userId, input) => {
  const session = await mongoose.startSession();
  let result;

  try {
    await session.withTransaction(async () => {
      const user = await User.findById(userId).session(session);
      if (!user) throw new ApiError(404, 'User not found');

      const requestedIds = input.courseIds?.length
        ? input.courseIds
        : user.cart.map((item) => String(item.course));
      if (requestedIds.length === 0) throw new ApiError(400, 'Your cart is empty');

      const courses = await Promise.all(requestedIds.map((id) => resolveCourse(id, session)));
      const uniqueCourses = [...new Map(courses.map((course) => [String(course._id), course])).values()];
      const courseIds = uniqueCourses.map((course) => course._id);

      const existingEnrollment = await CourseEnrollment.findOne({
        user: user._id,
        course: { $in: courseIds },
      }).session(session);
      if (existingEnrollment) throw new ApiError(409, 'You are already enrolled in one of these courses');

      const items = uniqueCourses.map((course) => {
        const { price, originalPrice } = getPricing(course);
        return {
          course: course._id,
          title: course.title,
          instructor: course.instructor,
          category: course.category,
          imageType: course.imageType,
          rating: course.rating,
          originalPrice,
          price,
        };
      });

      const originalSubtotal = items.reduce((sum, item) => sum + item.originalPrice, 0);
      const subtotal = items.reduce((sum, item) => sum + item.price, 0);
      const courseDiscount = Math.max(0, originalSubtotal - subtotal);
      const couponCode = input.couponCode?.trim().toUpperCase() || '';
      if (couponCode && !COUPONS[couponCode]) throw new ApiError(400, 'Invalid coupon code');
      const couponDiscount = couponCode ? Math.round(subtotal * COUPONS[couponCode] / 100) : 0;
      const taxableAmount = Math.max(0, subtotal - couponDiscount);
      const tax = Math.round(taxableAmount * TAX_RATE);
      const amount = taxableAmount + tax;

      if (amount > 0 && input.paymentMethod === 'free') {
        throw new ApiError(400, 'A payment method is required for paid courses');
      }
      if (amount === 0 && input.paymentMethod !== 'free') {
        throw new ApiError(400, 'Free enrollments must use the free payment method');
      }

      const orderNumber = await nextOrderNumber(session);
      const [order] = await Order.create([{
        user: user._id,
        courses: courseIds,
        items,
        orderNumber,
        subtotal,
        courseDiscount,
        coupon: couponCode ? { code: couponCode, discount: couponDiscount } : undefined,
        tax,
        amount,
        paymentMethod: input.paymentMethod,
        paymentDetails: input.paymentDetails,
        paymentStatus: 'completed',
        billing: input.billing,
      }], { session });

      const enrollmentDocs = courseIds.map((course) => ({
        user: user._id,
        course,
        order: order._id,
      }));
      await CourseEnrollment.insertMany(enrollmentDocs, { session });

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          $addToSet: { enrolledCourses: { $each: courseIds } },
          $pull: { cart: { course: { $in: courseIds } } },
          $inc: { 'stats.enrolledCourses': courseIds.length },
        },
        { returnDocument: 'after', session, runValidators: true }
      ).select('stats enrolledCourses');

      await Course.updateMany(
        { _id: { $in: courseIds } },
        { $inc: { enrollmentCount: 1 } },
        { session }
      );

      result = { orderId: order._id, user: updatedUser };
    });
  } finally {
    await session.endSession();
  }

  const [order, enrollments] = await Promise.all([
    Order.findById(result.orderId).populate('courses').lean(),
    CourseEnrollment.find({ order: result.orderId }).populate('course').lean(),
  ]);

  const courseTitle = order.items.length === 1 ? order.items[0].title : `${order.items.length} courses`;
  await createEvent({
    userId,
    notification: { title: 'Enrollment confirmed', message: `You are now enrolled in ${courseTitle}.`, type: order.amount > 0 ? 'payment' : 'order', actionUrl: '/profile/orders', metadata: { orderId: order._id } },
    activity: { type: 'order', title: 'Purchased course', message: `Enrolled in ${courseTitle}.`, actionUrl: '/profile/courses', dedupeKey: `order:${order._id}`, metadata: { orderId: order._id } },
    email: { template: 'purchase-successful', payload: { courseTitle, orderNumber: order.orderNumber } },
  });

  return { order, enrollments, user: result.user };
};

export const getOrder = async (userId, id) => {
  const query = mongoose.isValidObjectId(id)
    ? { _id: id, user: userId }
    : { orderNumber: id, user: userId };
  const order = await Order.findOne(query).populate('courses').lean();
  if (!order) throw new ApiError(404, 'Order not found');
  return order;
};

export const getUserOrders = async (userId) => {
  const [orders, enrollments, user, submissions, discussionActivity] = await Promise.all([
    Order.find({ user: userId }).sort({ createdAt: -1 }).populate('courses').lean(),
    CourseEnrollment.find({ user: userId }).sort({ enrolledAt: -1 }).populate('course').lean(),
    User.findById(userId).select('stats enrolledCourses').lean(),
    AssignmentSubmission.find({ student: userId }).select('course status').lean(),
    Discussion.aggregate([
      { $match: { $or: [{ author: new mongoose.Types.ObjectId(String(userId)) }, { 'replies.author': new mongoose.Types.ObjectId(String(userId)) }] } },
      { $group: { _id: '$course', count: { $sum: 1 } } },
    ]),
  ]);
  if (!user) throw new ApiError(404, 'User not found');
  await ensureCompletedCertificates(userId);
  const refreshedUser = await User.findById(userId).select('stats enrolledCourses').lean();
  const courseIds = enrollments.map((enrollment) => enrollment.course?._id).filter(Boolean);
  const assignmentDefinitions = enrollments.flatMap((enrollment) => enrollment.course ? buildAssignmentsForCourse(enrollment.course) : []);
  if (assignmentDefinitions.length) await Assignment.bulkWrite(assignmentDefinitions.map((assignment) => ({ updateOne: { filter: { course: assignment.course, lessonId: assignment.lessonId }, update: { $setOnInsert: assignment }, upsert: true } })));
  const assignments = await Assignment.find({ course: { $in: courseIds }, isPublished: true }).select('course').lean();
  const activities = {};
  courseIds.forEach((courseId) => { activities[String(courseId)] = { pendingAssignments: 0, submittedAssignments: 0, discussionActivity: 0 }; });
  assignments.forEach((assignment) => { const key = String(assignment.course); if (activities[key]) activities[key].pendingAssignments += 1; });
  submissions.forEach((submission) => { const key = String(submission.course); if (activities[key]) { activities[key].submittedAssignments += 1; activities[key].pendingAssignments = Math.max(0, activities[key].pendingAssignments - 1); } });
  discussionActivity.forEach((item) => { const key = String(item._id); if (activities[key]) activities[key].discussionActivity = item.count; });
  return { orders, enrollments, stats: refreshedUser?.stats || user.stats, activities };
};
