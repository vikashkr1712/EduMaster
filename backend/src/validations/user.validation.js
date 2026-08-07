import { z } from 'zod';

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60, 'Name must not exceed 60 characters').optional(),
    email: z.string().trim().toLowerCase().email('Invalid email address').optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const uploadAvatarSchema = z.object({
  dataUrl: z.string().min(1, 'An image is required').max(3_000_000, 'Image is too large'),
}).strict();
