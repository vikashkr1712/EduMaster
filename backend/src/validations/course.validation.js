import { z } from 'zod';

const isThumbnailReference = (value) => {
  if (value === '') return true;
  if (/^\/uploads\/course-thumbnails\/[A-Za-z0-9._-]+$/.test(value)) return true;
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

const isMeaningfulLanguage = (value) => (
  value === '' || /^(?=(?:.*\p{L}){2})[\p{L}\p{M} .()/-]+$/u.test(value)
);

const isMeaningfulDuration = (value) => (
  value === ''
  || /^self[- ]paced$/i.test(value)
  || (/^[A-Za-z0-9 .-]+$/.test(value)
    && /[1-9]\d*(?:\.\d+)?\s*(?:minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mos?|mo)\b/i.test(value))
);

const courseFields = {
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title must not exceed 120 characters'),
  shortDescription: z
    .string()
    .trim()
    .max(300, 'Short description must not exceed 300 characters'),
  description: z
    .string()
    .trim()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  category: z
    .string()
    .trim()
    .min(2, 'Category must be at least 2 characters')
    .max(60, 'Category must not exceed 60 characters'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
    errorMap: () => ({ message: 'Level must be Beginner, Intermediate, or Advanced' }),
  }),
  price: z.number().min(0, 'Price must not be negative'),
  discountPrice: z.number().min(0, 'Discount price must not be negative'),
  thumbnail: z
    .string()
    .trim()
    .max(2048, 'Thumbnail reference must not exceed 2048 characters')
    .refine(isThumbnailReference, 'Thumbnail must be a valid HTTP/HTTPS URL or uploaded image reference'),
  duration: z
    .string()
    .trim()
    .max(60, 'Duration must not exceed 60 characters')
    .refine(isMeaningfulDuration, 'Use a duration such as 12 hours, 24h 30m, 6 weeks, or 45 minutes'),
  language: z
    .string()
    .trim()
    .max(40, 'Language must not exceed 40 characters')
    .refine(isMeaningfulLanguage, 'Language must be a meaningful name such as English, Hindi, or Spanish'),
  instructor: z
    .string()
    .trim()
    .min(2, 'Instructor must be at least 2 characters')
    .max(60, 'Instructor must not exceed 60 characters'),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  hasCertificate: z.boolean(),
};

export const createCourseSchema = z
  .object({
    ...courseFields,
    shortDescription: courseFields.shortDescription.optional(),
    discountPrice: courseFields.discountPrice.optional(),
    thumbnail: courseFields.thumbnail.optional(),
    duration: courseFields.duration.optional(),
    language: courseFields.language.optional(),
    isFeatured: courseFields.isFeatured.optional(),
    isPublished: courseFields.isPublished.optional(),
    hasCertificate: courseFields.hasCertificate.optional(),
  })
  .strict();

export const updateCourseSchema = z
  .object(courseFields)
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required to update',
  });
