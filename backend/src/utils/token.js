import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const signAccessToken = (userId, role) => {
  return jwt.sign(
    { sub: userId, role },
    config.JWT_ACCESS_SECRET,
    { expiresIn: config.JWT_ACCESS_EXPIRES_IN }
  );
};

export const signRefreshToken = (userId) => {
  return jwt.sign(
    { sub: userId, type: 'refresh' },
    config.JWT_REFRESH_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRES_IN }
  );
};

export const verifyToken = (token, type = 'access') => {
  const secret = type === 'access' ? config.JWT_ACCESS_SECRET : config.JWT_REFRESH_SECRET;
  return jwt.verify(token, secret);
};
