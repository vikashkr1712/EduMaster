import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { signAccessToken, signRefreshToken, verifyToken } from '../utils/token.js';
import { createEvent } from './notification.service.js';
import { getEffectivePlatformSettings } from './admin-setting.service.js';

export const register = async ({ name, email, password }) => {
  const { registrationEnabled } = await getEffectivePlatformSettings();
  if (!registrationEnabled) {
    throw new ApiError(403, 'New account registration is temporarily disabled.');
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }

  const user = await User.create({ name, email, password });

  await createEvent({
    userId: user._id,
    notification: { title: 'Welcome to EduMaster', message: 'Your account is ready. Choose a course and start learning.', type: 'system', actionUrl: '/courses' },
    activity: { type: 'account', title: 'Joined EduMaster', message: 'Created your EduMaster learning account.', actionUrl: '/courses', dedupeKey: 'account-created' },
    email: { template: 'welcome' },
  });

  const accessToken = signAccessToken(user._id.toString(), user.role);
  const refreshToken = signRefreshToken(user._id.toString());

  return { user, accessToken, refreshToken };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is inactive');
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const accessToken = signAccessToken(user._id.toString(), user.role);
  const refreshToken = signRefreshToken(user._id.toString());

  return { user, accessToken, refreshToken };
};

export const refresh = async (token) => {
  if (!token) {
    throw new ApiError(401, 'Refresh token required', [], 'TOKEN_MISSING');
  }

  const decoded = verifyToken(token, 'refresh');

  if (decoded.type !== 'refresh' || !decoded.sub) {
    throw new ApiError(401, 'Invalid token', [], 'TOKEN_INVALID');
  }

  const user = await User.findById(decoded.sub);

  if (!user || !user.isActive) {
    throw new ApiError(401, 'Invalid token', [], 'TOKEN_INVALID');
  }

  const accessToken = signAccessToken(user._id.toString(), user.role);
  const refreshToken = signRefreshToken(user._id.toString());

  return { user, accessToken, refreshToken };
};

export const restoreSession = async ({ accessToken, refreshToken }) => {
  if (accessToken) {
    try {
      const decoded = verifyToken(accessToken, 'access');
      const user = decoded.sub ? await User.findById(decoded.sub) : null;

      if (user?.isActive) {
        return { user, accessToken: null, refreshToken: null };
      }
    } catch {
      // An expired/invalid access token can still be restored by a valid
      // refresh cookie below.
    }
  }

  if (!refreshToken) return { user: null, accessToken: null, refreshToken: null };

  try {
    return await refresh(refreshToken);
  } catch (error) {
    if (error?.statusCode === 401 || ['JsonWebTokenError', 'TokenExpiredError'].includes(error?.name)) {
      return { user: null, accessToken: null, refreshToken: null };
    }
    throw error;
  }
};
