import { ApiError } from '../utils/ApiError.js';
import { verifyToken } from '../utils/token.js';
import User from '../models/User.js';

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

export const authenticate = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return next(new ApiError(401, 'Authentication required', [], 'TOKEN_MISSING'));
  }

  try {
    const decoded = verifyToken(token, 'access');

    if (!decoded.sub) {
      return next(new ApiError(401, 'Invalid token', [], 'TOKEN_INVALID'));
    }

    const user = await User.findById(decoded.sub).select('_id role isActive').lean();

    if (!user || !user.isActive) {
      return next(new ApiError(401, 'Authentication required', [], 'TOKEN_INVALID'));
    }

    // Authorization always uses the current database role. The role in an
    // access token can be stale after an account is promoted or demoted.
    req.user = { id: user._id.toString(), role: user.role };
    return next();
  } catch (error) {
    return next(error);
  }
};
