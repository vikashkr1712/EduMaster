import { z } from 'zod';

export const updateAdminSettingsSchema = z.object({
  platformName: z.string().trim().min(2, 'Platform name must be at least 2 characters').max(60, 'Platform name must not exceed 60 characters'),
  platformDescription: z.string().trim().max(300, 'Platform description must not exceed 300 characters'),
  supportEmail: z.string().trim().toLowerCase().email('Enter a valid support email').max(254),
  supportPhone: z.string().trim().max(30, 'Support phone must not exceed 30 characters').regex(/^[+\d][\d\s()+.-]*$|^$/, 'Enter a valid support phone'),
  registrationEnabled: z.boolean(),
}).strict();
