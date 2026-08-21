import { z } from 'zod';

export const addToCartSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
});

export const removeFromCartSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
});

export const moveToWishlistSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
});
