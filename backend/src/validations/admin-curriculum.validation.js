import { z } from 'zod';

const title = z.string().trim().min(1, 'Title is required').max(120, 'Title must not exceed 120 characters');
const duration = z.string().trim().regex(/^\d{1,3}:[0-5]\d$/, 'Duration must use minutes:seconds, for example 12:30');
const resourceType = z.enum(['PDF', 'ZIP', 'Source Code', 'Slides', 'Assignment']);
const webUrl = z.string().trim().url('Resource URL must be valid').refine(
  (value) => {
    try { return ['http:', 'https:'].includes(new URL(value).protocol); }
    catch { return false; }
  },
  'Resource URL must use HTTP or HTTPS'
);

const resourceSchema = z.object({
  resourceId: z.string().trim().max(120).optional(),
  title,
  type: resourceType,
  url: webUrl,
  size: z.string().trim().max(80, 'Resource size label must not exceed 80 characters').optional(),
}).strict();

export const createAdminModuleSchema = z.object({ title }).strict();

export const updateAdminModuleSchema = z.object({ title }).strict();

const lessonFields = {
  title,
  duration,
  videoId: z.string().trim().min(1, 'YouTube video is required').max(250, 'YouTube value is too long'),
  videoProvider: z.string().trim().max(100, 'Video provider must not exceed 100 characters').optional(),
  resources: z.array(resourceSchema).max(20, 'A lesson can contain at most 20 resources').optional(),
};

export const createAdminLessonSchema = z.object(lessonFields).strict();

export const updateAdminLessonSchema = z.object(lessonFields).partial().strict().refine(
  (data) => Object.keys(data).length > 0,
  'At least one lesson field is required'
);

export const reorderAdminCurriculumSchema = z.object({
  ids: z.array(z.string().trim().min(1)).min(1, 'At least one ID is required'),
}).strict();
