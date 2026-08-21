import { z } from 'zod';

export const discussionSchema = z.object({
  courseId: z.string().trim().min(1, 'Course ID is required'),
  lessonId: z.string().trim().min(1, 'Lesson ID is required'),
  question: z.string().trim().min(3, 'Question must be at least 3 characters').max(3000),
}).strict();

export const updateDiscussionSchema = z.object({ question: z.string().trim().min(3).max(3000) }).strict();
export const replySchema = z.object({ message: z.string().trim().min(1, 'Reply cannot be empty').max(3000) }).strict();
export const noteSchema = z.object({
  courseId: z.string().trim().min(1, 'Course ID is required'),
  lessonId: z.string().trim().min(1, 'Lesson ID is required'),
  title: z.string().trim().min(1, 'Title is required').max(160),
  content: z.string().trim().min(1, 'Note cannot be empty').max(5000),
}).strict();
export const updateNoteSchema = z.object({ title: z.string().trim().min(1).max(160), content: z.string().trim().min(1).max(5000) }).strict();
export const resourceDownloadSchema = z.object({ courseId: z.string().trim().min(1), lessonId: z.string().trim().min(1), resourceId: z.string().trim().min(1) }).strict();
