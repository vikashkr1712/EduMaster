import { z } from 'zod';

export const subscribeSchema = z
  .object({
    email: z.string().trim().toLowerCase().email('Invalid email address'),
  })
  .strict();
