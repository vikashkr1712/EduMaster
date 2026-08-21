import { z } from 'zod';

const courseLessonFields = {
  courseId: z.string().trim().min(1, 'Course ID is required'),
  lessonId: z.string().trim().min(1, 'Lesson ID is required'),
};

export const progressSchema = z.object({
  ...courseLessonFields,
  watchTimeSeconds: z.number().int().min(0).max(86400).optional(),
  completed: z.boolean().optional(),
}).strict();

export const currentLessonSchema = z.object(courseLessonFields).strict();

export const createNoteSchema = z.object({
  ...courseLessonFields,
  content: z.string().trim().min(1, 'Note cannot be empty').max(3000),
}).strict();

export const updateNoteSchema = z.object({
  courseId: z.string().trim().min(1, 'Course ID is required'),
  content: z.string().trim().min(1, 'Note cannot be empty').max(3000),
}).strict();

export const bookmarkSchema = z.object({
  ...courseLessonFields,
  bookmarked: z.boolean().optional(),
}).strict();
