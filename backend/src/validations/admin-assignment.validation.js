import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID');
const text = (max, label) => z.string().trim().min(1, `${label} is required`).max(max, `${label} is too long`);
const attachmentSchema = z.object({
  title: text(200, 'Attachment title'),
  url: z.string().trim().min(1, 'Attachment URL is required').max(2000).refine((url) => /^https?:\/\//i.test(url) || url.startsWith('/'), 'Attachment URL must be HTTP, HTTPS, or an application path'),
  type: z.string().trim().min(1).max(80).default('External Link'),
});

const fields = {
  course: objectId,
  moduleId: text(160, 'Module'),
  lessonId: text(160, 'Lesson'),
  title: text(180, 'Assignment title'),
  description: text(2000, 'Description'),
  instructions: text(5000, 'Instructions'),
  dueDate: z.coerce.date(),
  maxMarks: z.coerce.number().int().min(1).max(1000),
  attachments: z.array(attachmentSchema).max(20).default([]),
  isPublished: z.boolean(),
};

export const createAdminAssignmentSchema = z.object({ ...fields, attachments: fields.attachments.default([]), isPublished: fields.isPublished.default(true) });
export const updateAdminAssignmentSchema = z.object(Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, value.optional()]))).refine((value) => Object.keys(value).length > 0, 'At least one field is required');

export const adminAssignmentListQuerySchema = z.object({
  search: z.string().trim().max(120).optional(), course: objectId.optional(), status: z.enum(['published', 'draft']).optional(), submissions: z.enum(['with', 'without']).optional(), due: z.enum(['upcoming', 'past']).optional(),
  sort: z.enum(['newest', 'oldest', 'titleAsc', 'titleDesc', 'dueAsc', 'dueDesc', 'submissionsDesc']).optional(), page: z.coerce.number().int().min(1).optional(), limit: z.coerce.number().int().min(1).max(50).optional(),
});

export const adminSubmissionListQuerySchema = z.object({
  search: z.string().trim().max(120).optional(), status: z.enum(['submitted', 'reviewed']).optional(), sort: z.enum(['newest', 'oldest', 'studentAsc', 'marksAsc', 'marksDesc']).optional(), page: z.coerce.number().int().min(1).optional(), limit: z.coerce.number().int().min(1).max(50).optional(),
});

export const gradeAdminSubmissionSchema = z.object({ marks: z.coerce.number().min(0).max(1000), remarks: z.string().trim().max(2000).default('') });
