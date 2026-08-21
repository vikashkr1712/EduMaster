import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID');

export const adminDiscussionListQuerySchema = z.object({
  search: z.string().trim().max(160).optional(),
  course: objectId.optional(),
  replies: z.enum(['has', 'none']).optional(),
  sort: z.enum(['newest', 'oldest', 'mostReplies', 'mostLiked']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});
