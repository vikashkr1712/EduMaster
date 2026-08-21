import { z } from 'zod';
import { NOTIFICATION_TYPES } from '../models/Notification.js';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID');
const audience = z.enum(['allStudents', 'specificUser', 'courseStudents']);

export const adminNotificationListQuerySchema = z.object({
  search: z.string().trim().max(160).optional(),
  audience: audience.optional(),
  type: z.enum(NOTIFICATION_TYPES).optional(),
  course: objectId.optional(),
  sort: z.enum(['newest', 'oldest', 'titleAsc']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export const adminNotificationDetailQuerySchema = z.object({
  recipientPage: z.coerce.number().int().min(1).optional(),
  recipientLimit: z.coerce.number().int().min(1).max(50).optional(),
});

export const adminNotificationOptionsQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
});

export const createAdminNotificationSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(120),
  message: z.string().trim().min(3, 'Message must be at least 3 characters').max(500),
  type: z.enum(NOTIFICATION_TYPES),
  audience,
  userId: objectId.optional(),
  courseId: objectId.optional(),
  actionUrl: z.string().trim().max(500).refine((value) => !value || (value.startsWith('/') && !value.startsWith('//')), 'Action URL must be an internal path').optional(),
}).strict().superRefine((value, context) => {
  if (value.audience === 'specificUser' && !value.userId) context.addIssue({ code: 'custom', path: ['userId'], message: 'Select a student' });
  if (value.audience === 'courseStudents' && !value.courseId) context.addIssue({ code: 'custom', path: ['courseId'], message: 'Select a course' });
});
