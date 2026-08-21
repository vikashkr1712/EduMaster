import { z } from 'zod';

const optionalText = (max) => z.string().trim().max(max).optional();

export const createOrderSchema = z.object({
  courseIds: z.array(z.string().trim().min(1)).min(1).max(50).optional(),
  couponCode: z.string().trim().max(30).optional(),
  paymentMethod: z.enum(['card', 'upi', 'netbanking', 'wallet', 'free']),
  paymentDetails: optionalText(80),
  billing: z.object({
    fullName: optionalText(60),
    email: z.string().trim().email('Invalid email address').optional(),
    phone: optionalText(30),
    country: optionalText(60),
    state: optionalText(80),
    city: optionalText(80),
    pincode: optionalText(20),
    address1: optionalText(180),
    address2: optionalText(180),
  }).strict().optional(),
}).strict();
