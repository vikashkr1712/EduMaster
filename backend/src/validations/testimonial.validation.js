import { z } from 'zod';

const testimonialFields = {
  studentName: z
    .string()
    .trim()
    .min(2, 'Student name must be at least 2 characters')
    .max(80, 'Student name must not exceed 80 characters'),
  designation: z
    .string()
    .trim()
    .max(80, 'Designation must not exceed 80 characters'),
  company: z
    .string()
    .trim()
    .max(80, 'Company must not exceed 80 characters'),
  avatar: z.string().trim().url('Avatar must be a valid URL'),
  rating: z
    .number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must not exceed 5'),
  title: z
    .string()
    .trim()
    .max(120, 'Title must not exceed 120 characters'),
  review: z
    .string()
    .trim()
    .min(10, 'Review must be at least 10 characters')
    .max(2000, 'Review must not exceed 2000 characters'),
  course: z
    .string()
    .trim()
    .max(120, 'Course must not exceed 120 characters'),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
};

export const createTestimonialSchema = z
  .object({
    ...testimonialFields,
    designation: testimonialFields.designation.optional(),
    company: testimonialFields.company.optional(),
    avatar: testimonialFields.avatar.optional(),
    title: testimonialFields.title.optional(),
    course: testimonialFields.course.optional(),
    isFeatured: testimonialFields.isFeatured.optional(),
    isPublished: testimonialFields.isPublished.optional(),
  })
  .strict();

export const updateTestimonialSchema = z
  .object(testimonialFields)
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required to update',
  });
