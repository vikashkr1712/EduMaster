import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/, 'Password must contain at least one letter and one number');

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60, 'Name must not exceed 60 characters'),
    email: z.string().trim().toLowerCase().email('Invalid email address'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z
  .object({
    email: z.string().trim().toLowerCase().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  })
  .strict();
