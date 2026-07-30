import { z } from 'zod';

const serviceFields = {
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
  icon: z.string().trim().url('Icon must be a valid URL'),
  image: z.string().trim().url('Image must be a valid URL'),
  duration: z
    .string()
    .trim()
    .max(60, 'Duration must not exceed 60 characters'),
  features: z.array(
    z
      .string()
      .trim()
      .min(1, 'Features must not be empty')
      .max(150, 'Each feature must not exceed 150 characters')
  ),
  price: z.number().min(0, 'Price must not be negative'),
  discountPrice: z.number().min(0, 'Discount price must not be negative'),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  status: z.enum(['Active', 'Inactive'], {
    errorMap: () => ({ message: 'Status must be Active or Inactive' }),
  }),
  tags: z
    .array(z.string().trim().min(1, 'Tags must not be empty').max(40, 'Each tag must not exceed 40 characters'))
    .max(10, 'Must not exceed 10 tags'),
};

export const createServiceSchema = z
  .object({
    ...serviceFields,
    shortDescription: serviceFields.shortDescription.optional(),
    icon: serviceFields.icon.optional(),
    image: serviceFields.image.optional(),
    duration: serviceFields.duration.optional(),
    features: serviceFields.features.optional(),
    price: serviceFields.price.optional(),
    discountPrice: serviceFields.discountPrice.optional(),
    isFeatured: serviceFields.isFeatured.optional(),
    isPublished: serviceFields.isPublished.optional(),
    status: serviceFields.status.optional(),
    tags: serviceFields.tags.optional(),
  })
  .strict();

export const updateServiceSchema = z
  .object(serviceFields)
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required to update',
  });
