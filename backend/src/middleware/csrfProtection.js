import { timingSafeEqual } from 'node:crypto';
import { ApiError } from '../utils/ApiError.js';

const safeMethods = new Set(['GET', 'HEAD', 'OPTIONS']);
const excludedPaths = new Set(['/auth/register', '/auth/login', '/auth/refresh']);

export const csrfProtection = (req, res, next) => {
  if (safeMethods.has(req.method) || excludedPaths.has(req.path)) return next();
  const cookieToken = req.cookies?.csrfToken;
  const headerToken = req.get('X-CSRF-Token');
  if (!cookieToken || !headerToken) return next(new ApiError(403, 'Security token is missing. Refresh the page and try again.'));
  const cookieBuffer = Buffer.from(cookieToken);
  const headerBuffer = Buffer.from(headerToken);
  if (cookieBuffer.length !== headerBuffer.length || !timingSafeEqual(cookieBuffer, headerBuffer)) return next(new ApiError(403, 'Security token is invalid. Refresh the page and try again.'));
  return next();
};
