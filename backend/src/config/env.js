import 'dotenv/config.js';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().url('Invalid MongoDB URI'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  COOKIE_DOMAIN: z.string().optional(),
  ACCESS_COOKIE_MAX_AGE: z.coerce.number().int().positive().default(900000),
  REFRESH_COOKIE_MAX_AGE: z.coerce.number().int().positive().default(604800000),
  CLIENT_URL: z
    .string()
    .min(1, 'CLIENT_URL is required')
    .refine(
      (value) =>
        value
          .split(',')
          .map((url) => url.trim())
          .filter(Boolean)
          .every((url) => z.string().url().safeParse(url).success),
      'CLIENT_URL must be a URL or comma-separated list of URLs'
    ),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  AUTH_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
  FORM_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(3600000),
  FORM_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  CLOUDINARY_CLOUD_NAME: z.string().trim().optional(),
  CLOUDINARY_API_KEY: z.string().trim().optional(),
  CLOUDINARY_API_SECRET: z.string().trim().optional(),
});

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  const errors = parseResult.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
  console.error('Environment validation failed:\n', errors);
  process.exit(1);
}

export const config = Object.freeze(parseResult.data);
