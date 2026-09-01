import mongoose from 'mongoose';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { calculatePriceSummary } from '../utils/pricing.js';

const withSession = (query, session) => (session ? query.session(session) : query);

const resolveCourse = async (value, session) => {
  const id = String(value ?? '').trim();
  let course = mongoose.isValidObjectId(id)
    ? await withSession(Course.findById(id), session)
    : null;

  if (!course && Number.isInteger(Number(id))) {
    course = await withSession(Course.findOne({ sourceId: Number(id) }), session);
  }

  if (!course || !course.isPublished) {
    throw new ApiError(404, 'One or more selected courses are unavailable');
  }
  return course;
};

export const getAuthoritativePricing = async ({ userId, courseIds, couponCode, session = null }) => {
  let requestedIds = Array.isArray(courseIds) ? courseIds : [];

  if (requestedIds.length === 0) {
    const user = await withSession(User.findById(userId).select('cart.course'), session);
    if (!user) throw new ApiError(404, 'User not found');
    requestedIds = user.cart.map((item) => String(item.course));
  }

  if (requestedIds.length === 0) throw new ApiError(400, 'Your cart is empty');

  const resolved = await Promise.all(requestedIds.map((id) => resolveCourse(id, session)));
  const courses = [...new Map(resolved.map((course) => [String(course._id), course])).values()];

  try {
    return { courses, pricing: calculatePriceSummary(courses, couponCode) };
  } catch (error) {
    if (error?.code === 'COUPON_INVALID') {
      throw new ApiError(400, error.message, [], 'COUPON_INVALID');
    }
    throw error;
  }
};
