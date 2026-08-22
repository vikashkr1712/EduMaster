import { z } from 'zod';

export const updateAdminUserSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60, 'Name must not exceed 60 characters').optional(),
  phone: z.string().trim().max(20, 'Phone must not exceed 20 characters').regex(/^$|^[+()\d\s-]{7,20}$/, 'Invalid phone number').optional(),
  bio: z.string().trim().max(500, 'Bio must not exceed 500 characters').optional(),
  location: z.string().trim().max(120, 'Location must not exceed 120 characters').optional(),
}).strict().refine((value) => Object.keys(value).length > 0, {
  message: 'At least one editable profile field must be provided',
});

export const updateAdminUserRoleSchema = z.object({
  role: z.enum(['user', 'admin'], { message: 'Role must be user or admin' }),
}).strict();

export const updateAdminUserStatusSchema = z.object({
  isActive: z.boolean(),
}).strict();

export const updateAdminUserDemoStatusSchema = z.object({
  isDemo: z.boolean(),
}).strict();

export const deleteAdminDemoUserSchema = z.object({
  confirmEmail: z.string().trim().email('Enter the user email to confirm permanent deletion'),
}).strict();
