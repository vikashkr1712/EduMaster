import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID');
export const adminCertificateListQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
  course: objectId.optional(),
  status: z.enum(['valid', 'revoked']).optional(),
  sort: z.enum(['newest', 'oldest', 'studentAsc', 'studentDesc', 'courseAsc']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});
export const updateAdminCertificateStatusSchema = z.object({ status: z.enum(['valid', 'revoked']) });
