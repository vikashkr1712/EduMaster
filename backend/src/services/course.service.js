import Course from '../models/Course.js';
import { ApiError } from '../utils/ApiError.js';
import { buildCourseCurriculum } from '../utils/courseCurriculum.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import Order from '../models/Order.js';
import Certificate from '../models/Certificate.js';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Discussion from '../models/Discussion.js';
import StudentNote from '../models/StudentNote.js';
import Achievement from '../models/Achievement.js';
import User from '../models/User.js';

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  title: { title: 1 },
  titleAsc: { title: 1 },
  titleDesc: { title: -1 },
  ratingDesc: { rating: -1 },
  priceAsc: { price: 1 },
  priceDesc: { price: -1 },
};

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const generateUniqueSlug = async (title, excludeId = null) => {
  const baseSlug = slugify(title);

  if (!baseSlug) {
    throw new ApiError(400, 'Title must contain alphanumeric characters');
  }

  let slug = baseSlug;
  let counter = 1;

  const conflictQuery = (candidate) =>
    excludeId ? { slug: candidate, _id: { $ne: excludeId } } : { slug: candidate };

  while (await Course.exists(conflictQuery(slug))) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
};

const assertValidPricing = (price, discountPrice) => {
  if (discountPrice != null && price != null && discountPrice > price) {
    throw new ApiError(400, 'Discount price must not exceed price');
  }
};

const isDuplicateSlugError = (error) =>
  error?.code === 11000 && error?.keyPattern?.slug;

export const createCourse = async (data) => {
  assertValidPricing(data.price, data.discountPrice);

  const slug = await generateUniqueSlug(data.title);

  try {
    return await Course.create({ ...data, slug });
  } catch (error) {
    if (isDuplicateSlugError(error)) {
      throw new ApiError(409, 'Course with this slug already exists');
    }
    throw error;
  }
};

export const getCourses = async (query = {}, { includeUnpublished = false } = {}) => {
  const filter = {};

  if (query.search) {
    filter.title = { $regex: escapeRegex(String(query.search).trim()), $options: 'i' };
  }

  if (query.category) {
    filter.category = String(query.category).trim();
  }

  const levels = String(query.levels ?? query.level ?? '')
    .split(',')
    .map((level) => level.trim())
    .filter(Boolean);
  if (levels.length === 1) {
    filter.level = levels[0];
  } else if (levels.length > 1) {
    filter.level = { $in: levels };
  }

  if (query.price === 'free') {
    filter.price = 0;
  } else if (query.price === 'paid') {
    filter.price = { $gt: 0 };
  } else {
    const minPrice = Number(query.minPrice);
    const maxPrice = Number(query.maxPrice);
    if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
      filter.price = {};
      if (!Number.isNaN(minPrice)) filter.price.$gte = minPrice;
      if (!Number.isNaN(maxPrice)) filter.price.$lte = maxPrice;
    }
  }

  const minRating = Number(query.minRating);
  if (!Number.isNaN(minRating)) {
    filter.rating = { $gte: minRating };
  }

  if (query.isFeatured !== undefined) {
    filter.isFeatured = String(query.isFeatured) === 'true';
  }

  if (includeUnpublished) {
    if (query.isPublished !== undefined) {
      filter.isPublished = String(query.isPublished) === 'true';
    }
  } else {
    filter.isPublished = true;
  }

  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const skip = (page - 1) * limit;

  const sort = SORT_OPTIONS[query.sort] || SORT_OPTIONS.newest;

  const [courses, total] = await Promise.all([
    Course.find(filter).sort(sort).skip(skip).limit(limit),
    Course.countDocuments(filter),
  ]);

  return {
    courses,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      limit,
    },
  };
};

export const getCourseBySlug = async (slug, { includeUnpublished = false } = {}) => {
  const filter = { slug: String(slug).toLowerCase().trim() };

  if (!includeUnpublished) {
    filter.isPublished = true;
  }

  const course = await Course.findOne(filter);

  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  if (!course.modules?.length) {
    course.modules = buildCourseCurriculum(course);
    await course.save();
  }

  return course;
};

export const getAdminCourses = async (query = {}) => {
  const filter = {};
  const search = String(query.search ?? '').trim().slice(0, 120);

  if (search) {
    const pattern = { $regex: escapeRegex(search), $options: 'i' };
    filter.$or = [{ title: pattern }, { category: pattern }, { instructor: pattern }];
  }

  if (query.category) filter.category = String(query.category).trim();
  if (query.level) filter.level = String(query.level).trim();
  if (query.status === 'published') filter.isPublished = true;
  if (query.status === 'draft') filter.isPublished = false;
  if (query.price === 'free') filter.price = 0;
  if (query.price === 'paid') filter.price = { $gt: 0 };

  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const skip = (page - 1) * limit;
  const sort = SORT_OPTIONS[query.sort] || SORT_OPTIONS.newest;

  const [courses, total, overviewResult] = await Promise.all([
    Course.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Course.countDocuments(filter),
    Course.aggregate([
      {
        $facet: {
          stats: [{
            $group: {
              _id: null,
              total: { $sum: 1 },
              published: { $sum: { $cond: ['$isPublished', 1, 0] } },
              draft: { $sum: { $cond: ['$isPublished', 0, 1] } },
              free: { $sum: { $cond: [{ $eq: ['$price', 0] }, 1, 0] } },
              paid: { $sum: { $cond: [{ $gt: ['$price', 0] }, 1, 0] } },
            },
          }],
          categories: [
            { $match: { category: { $type: 'string', $ne: '' } } },
            { $group: { _id: '$category' } },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ]),
  ]);

  const overview = overviewResult[0] ?? {};
  const stats = overview.stats?.[0] ?? { total: 0, published: 0, draft: 0, free: 0, paid: 0 };

  return {
    courses,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      limit,
    },
    summary: {
      total: stats.total,
      published: stats.published,
      draft: stats.draft,
      free: stats.free,
      paid: stats.paid,
    },
    categories: (overview.categories ?? []).map((item) => item._id),
  };
};

export const getAdminCourseById = async (id) => {
  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, 'Course not found');
  return course;
};

export const updateCourse = async (id, data) => {
  const course = await Course.findById(id);

  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  assertValidPricing(data.price ?? course.price, data.discountPrice ?? course.discountPrice);

  if (data.title && data.title !== course.title) {
    course.slug = await generateUniqueSlug(data.title, course._id);
  }

  Object.assign(course, data);

  try {
    await course.save();
  } catch (error) {
    if (isDuplicateSlugError(error)) {
      throw new ApiError(409, 'Course with this slug already exists');
    }
    throw error;
  }

  return course;
};

export const toggleCoursePublish = async (id) => {
  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, 'Course not found');

  course.isPublished = !course.isPublished;
  await course.save();
  return course;
};

export const deleteCourse = async (id) => {
  const course = await Course.findById(id);

  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  const dependencyChecks = [
    ['enrollments', CourseEnrollment.exists({ course: course._id })],
    ['orders', Order.exists({ $or: [{ courses: course._id }, { 'items.course': course._id }] })],
    ['certificates', Certificate.exists({ course: course._id })],
    ['quizzes', Quiz.exists({ course: course._id })],
    ['quiz attempts', QuizAttempt.exists({ course: course._id })],
    ['assignments', Assignment.exists({ course: course._id })],
    ['assignment submissions', AssignmentSubmission.exists({ course: course._id })],
    ['discussions', Discussion.exists({ course: course._id })],
    ['student notes', StudentNote.exists({ course: course._id })],
    ['achievements', Achievement.exists({ course: course._id })],
    ['user learning records', User.exists({ enrolledCourses: course._id })],
    ['user carts or wishlists', User.exists({ $or: [{ wishlist: course._id }, { 'cart.course': course._id }] })],
  ];
  const dependencyResults = await Promise.all(dependencyChecks.map(([, check]) => check));
  const dependencies = dependencyChecks
    .filter((_, index) => Boolean(dependencyResults[index]))
    .map(([label]) => label);

  if (dependencies.length > 0) {
    throw new ApiError(
      409,
      `This course cannot be deleted because it has linked ${dependencies.join(', ')}.`
    );
  }

  await course.deleteOne();

  return course;
};
