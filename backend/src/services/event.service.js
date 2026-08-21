import Event from '../models/Event.js';
import { ApiError } from '../utils/ApiError.js';

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;

const SORT_OPTIONS = {
  startDate: { startDate: 1 },
  startDateDesc: { startDate: -1 },
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

  while (await Event.exists(conflictQuery(slug))) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
};

const isDuplicateSlugError = (error) =>
  error?.code === 11000 && error?.keyPattern?.slug;

const assertBusinessRules = ({ price, discountPrice, startDate, endDate, mode, meetingLink, location }) => {
  if (discountPrice != null && price != null && discountPrice > price) {
    throw new ApiError(400, 'Discount price must not exceed price');
  }

  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    throw new ApiError(400, 'End date must not be before start date');
  }

  if (mode === 'Online' && !meetingLink) {
    throw new ApiError(400, 'Online events require a meeting link');
  }

  if (mode === 'Offline' && !location) {
    throw new ApiError(400, 'Offline events require a location');
  }
};

export const createEvent = async (data) => {
  assertBusinessRules(data);

  const slug = await generateUniqueSlug(data.title);

  try {
    return await Event.create({ ...data, slug });
  } catch (error) {
    if (isDuplicateSlugError(error)) {
      throw new ApiError(409, 'Event with this slug already exists');
    }
    throw error;
  }
};

export const getEvents = async (query = {}, { includeUnpublished = false } = {}) => {
  const filter = {};

  if (query.search) {
    filter.title = { $regex: escapeRegex(String(query.search).trim()), $options: 'i' };
  }

  if (query.category) {
    filter.category = String(query.category).trim();
  }

  if (query.mode) {
    filter.mode = String(query.mode).trim();
  }

  if (query.status) {
    filter.status = String(query.status).trim();
  }

  const from = new Date(query.from);
  const to = new Date(query.to);
  if (!Number.isNaN(from.getTime()) || !Number.isNaN(to.getTime())) {
    filter.startDate = {};
    if (!Number.isNaN(from.getTime())) filter.startDate.$gte = from;
    if (!Number.isNaN(to.getTime())) filter.startDate.$lte = to;
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

  const sort = SORT_OPTIONS[query.sort] || SORT_OPTIONS.startDate;

  const [events, total] = await Promise.all([
    Event.find(filter).sort(sort).skip(skip).limit(limit),
    Event.countDocuments(filter),
  ]);

  return {
    events,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      limit,
    },
  };
};

export const getEventBySlug = async (slug, { includeUnpublished = false } = {}) => {
  const filter = { slug: String(slug).toLowerCase().trim() };

  if (!includeUnpublished) {
    filter.isPublished = true;
  }

  const event = await Event.findOne(filter);

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  return event;
};

export const updateEvent = async (id, data) => {
  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  assertBusinessRules({
    price: data.price ?? event.price,
    discountPrice: data.discountPrice ?? event.discountPrice,
    startDate: data.startDate ?? event.startDate,
    endDate: data.endDate ?? event.endDate,
    mode: data.mode ?? event.mode,
    meetingLink: data.meetingLink ?? event.meetingLink,
    location: data.location ?? event.location,
  });

  if (data.title && data.title !== event.title) {
    event.slug = await generateUniqueSlug(data.title, event._id);
  }

  Object.assign(event, data);

  try {
    await event.save();
  } catch (error) {
    if (isDuplicateSlugError(error)) {
      throw new ApiError(409, 'Event with this slug already exists');
    }
    throw error;
  }

  return event;
};

export const deleteEvent = async (id) => {
  const event = await Event.findByIdAndDelete(id);

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  return event;
};
