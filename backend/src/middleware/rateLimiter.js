import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const rateLimitHandler = (message) => (req, res, next) => {
  next(new ApiError(429, message));
};

export const globalLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  limit: config.RATE_LIMIT_MAX,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: (req) => req.path === '/health',
  handler: rateLimitHandler('Too many requests, please try again later.'),
});

export const authLimiter = rateLimit({
  windowMs: config.AUTH_RATE_LIMIT_WINDOW_MS,
  limit: config.AUTH_RATE_LIMIT_MAX,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: rateLimitHandler('Too many authentication attempts, please try again later.'),
});

export const formLimiter = rateLimit({
  windowMs: config.FORM_RATE_LIMIT_WINDOW_MS,
  limit: config.FORM_RATE_LIMIT_MAX,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: rateLimitHandler('Too many submissions, please try again later.'),
});
