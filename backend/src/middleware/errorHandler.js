import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors)
        .map(e => e.message)
        .join(', ');
      error = new ApiError(400, message);
    } else if (error.name === 'CastError') {
      error = new ApiError(400, `Invalid ${error.path}`);
    } else if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      error = new ApiError(409, `${field} already exists`);
    } else if (error.name === 'JsonWebTokenError') {
      error = new ApiError(401, 'Invalid token', [], 'TOKEN_INVALID');
    } else if (error.name === 'TokenExpiredError') {
      error = new ApiError(401, 'Token expired', [], 'TOKEN_EXPIRED');
    } else {
      error = new ApiError(500, error.message || 'Internal server error');
    }
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  const details = error.details || [];

  logger.error(`[${statusCode}] ${message}`, err);

  const response = {
    success: false,
    message,
  };

  if (details.length > 0) {
    response.errors = details;
  }

  if (config.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
