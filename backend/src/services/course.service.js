import Course from '../models/Course.js';
import { ApiError } from '../utils/ApiError.js';

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  title: { title: 1 },
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

  if (query.level) {
    filter.level = String(query.level).trim();
  }

  const minPrice = Number(query.minPrice);
  const maxPrice = Number(query.maxPrice);
  if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
    filter.price = {};
    if (!Number.isNaN(minPrice)) filter.price.$gte = minPrice;
    if (!Number.isNaN(maxPrice)) filter.price.$lte = maxPrice;
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

export const deleteCourse = async (id) => {
  const course = await Course.findByIdAndDelete(id);

  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  return course;
};
