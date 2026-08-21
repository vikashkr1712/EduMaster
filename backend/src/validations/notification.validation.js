import { z } from 'zod';

export const notificationListSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(30).default(10),
  archived: z.enum(['true', 'false']).default('false'),
}).strict();

export const activityListSchema = notificationListSchema.omit({ archived: true });
