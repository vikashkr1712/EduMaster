import { z } from 'zod';

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60, 'Name must not exceed 60 characters').optional(),
    email: z.string().trim().toLowerCase().email('Invalid email address').optional(),
    username: z.string().trim().min(3, 'Username must be at least 3 characters').max(30).regex(/^[a-zA-Z0-9_.]+$/, 'Username can only contain letters, numbers, underscores and dots').optional(),
    phone: z.string().trim().max(20).regex(/^$|^[+()\d\s-]{7,20}$/, 'Invalid phone number').optional(),
    bio: z.string().trim().max(500, 'Bio must not exceed 500 characters').optional(),
    location: z.string().trim().max(120, 'Location must not exceed 120 characters').optional(),
    preferences: z.object({
      theme: z.enum(['light', 'dark']).optional(),
      notifications: z.object({ course: z.boolean().optional(), email: z.boolean().optional(), offers: z.boolean().optional() }).strict().optional(),
      loginAlerts: z.boolean().optional(),
    }).strict().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const uploadAvatarSchema = z.object({
  dataUrl: z.string().min(1, 'An image is required').max(3_000_000, 'Image is too large'),
}).strict();

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters').regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/, 'New password must contain at least one letter and one number'),
}).strict().refine((value) => value.currentPassword !== value.newPassword, { message: 'New password must be different', path: ['newPassword'] });
