import Testimonial from '../models/Testimonial.js';
import { ApiError } from '../utils/ApiError.js';

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  ratingDesc: { rating: -1 },
  ratingAsc: { rating: 1 },
  studentName: { studentName: 1 },
};

export const createTestimonial = async (data) => {
  return Testimonial.create(data);
};

export const getTestimonials = async (query = {}, { includeUnpublished = false } = {}) => {
  const filter = {};

  if (query.search) {
    filter.studentName = { $regex: escapeRegex(String(query.search).trim()), $options: 'i' };
  }

  const rating = parseInt(query.rating, 10);
  if (!Number.isNaN(rating)) {
    filter.rating = rating;
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

  const [testimonials, total] = await Promise.all([
    Testimonial.find(filter).sort(sort).skip(skip).limit(limit),
    Testimonial.countDocuments(filter),
  ]);

  return {
    testimonials,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      limit,
    },
  };
};

export const getTestimonialById = async (id, { includeUnpublished = false } = {}) => {
  const filter = { _id: id };

  if (!includeUnpublished) {
    filter.isPublished = true;
  }

  const testimonial = await Testimonial.findOne(filter);

  if (!testimonial) {
    throw new ApiError(404, 'Testimonial not found');
  }

  return testimonial;
};

export const updateTestimonial = async (id, data) => {
  const testimonial = await Testimonial.findById(id);

  if (!testimonial) {
    throw new ApiError(404, 'Testimonial not found');
  }

  Object.assign(testimonial, data);
  await testimonial.save();

  return testimonial;
};

export const deleteTestimonial = async (id) => {
  const testimonial = await Testimonial.findByIdAndDelete(id);

  if (!testimonial) {
    throw new ApiError(404, 'Testimonial not found');
  }

  return testimonial;
};
