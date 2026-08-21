import Service from '../models/Service.js';
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

  while (await Service.exists(conflictQuery(slug))) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
};

const isDuplicateSlugError = (error) =>
  error?.code === 11000 && error?.keyPattern?.slug;

const assertValidPricing = (price, discountPrice) => {
  if (discountPrice != null && price != null && discountPrice > price) {
    throw new ApiError(400, 'Discount price must not exceed price');
  }
};

export const createService = async (data) => {
  assertValidPricing(data.price, data.discountPrice);

  const slug = await generateUniqueSlug(data.title);

  try {
    return await Service.create({ ...data, slug });
  } catch (error) {
    if (isDuplicateSlugError(error)) {
      throw new ApiError(409, 'Service with this slug already exists');
    }
    throw error;
  }
};

export const getServices = async (query = {}, { includeUnpublished = false } = {}) => {
  const filter = {};

  if (query.search) {
    filter.title = { $regex: escapeRegex(String(query.search).trim()), $options: 'i' };
  }

  if (query.category) {
    filter.category = String(query.category).trim();
  }

  if (query.status) {
    filter.status = String(query.status).trim();
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

  const [services, total] = await Promise.all([
    Service.find(filter).sort(sort).skip(skip).limit(limit),
    Service.countDocuments(filter),
  ]);

  return {
    services,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      limit,
    },
  };
};

export const getServiceBySlug = async (slug, { includeUnpublished = false } = {}) => {
  const filter = { slug: String(slug).toLowerCase().trim() };

  if (!includeUnpublished) {
    filter.isPublished = true;
  }

  const service = await Service.findOne(filter);

  if (!service) {
    throw new ApiError(404, 'Service not found');
  }

  return service;
};

export const updateService = async (id, data) => {
  const service = await Service.findById(id);

  if (!service) {
    throw new ApiError(404, 'Service not found');
  }

  assertValidPricing(data.price ?? service.price, data.discountPrice ?? service.discountPrice);

  if (data.title && data.title !== service.title) {
    service.slug = await generateUniqueSlug(data.title, service._id);
  }

  Object.assign(service, data);

  try {
    await service.save();
  } catch (error) {
    if (isDuplicateSlugError(error)) {
      throw new ApiError(409, 'Service with this slug already exists');
    }
    throw error;
  }

  return service;
};

export const deleteService = async (id) => {
  const service = await Service.findByIdAndDelete(id);

  if (!service) {
    throw new ApiError(404, 'Service not found');
  }

  return service;
};
