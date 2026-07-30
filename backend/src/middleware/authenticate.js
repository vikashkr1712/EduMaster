import { ApiError } from '../utils/ApiError.js';
import { verifyToken } from '../utils/token.js';

const extractToken = (req) => {
  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }

  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    return header.slice(7).trim();
  }

  return null;
};

export const authenticate = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return next(new ApiError(401, 'Authentication required', [], 'TOKEN_MISSING'));
  }

  try {
    const decoded = verifyToken(token, 'access');

    if (!decoded.sub) {
      return next(new ApiError(401, 'Invalid token', [], 'TOKEN_INVALID'));
    }

    req.user = { id: decoded.sub, role: decoded.role };
    return next();
  } catch (error) {
    return next(error);
  }
};
