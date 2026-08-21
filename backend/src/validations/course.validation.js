import { z } from 'zod';

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
    .refine((value) => value === '' || z.string().url().safeParse(value).success, 'Thumbnail must be a valid URL'),
  duration: z
    .string()
    .trim()
    .max(60, 'Duration must not exceed 60 characters'),
  language: z
    .string()
    .trim()
    .max(40, 'Language must not exceed 40 characters'),
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
