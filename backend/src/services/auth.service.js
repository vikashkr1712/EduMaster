import User from '../models/User.js';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { signAccessToken, signRefreshToken, verifyToken } from '../utils/token.js';
import { createEvent } from './notification.service.js';
import { getEffectivePlatformSettings } from './admin-setting.service.js';
import { verifyFirebaseIdToken } from '../config/firebase.js';

const createSession = (user) => ({
  user,
  accessToken: signAccessToken(user._id.toString(), user.role),
  refreshToken: signRefreshToken(user._id.toString()),
});

const getSessionUser = async (userId) => {
  const [user] = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(String(userId)) } },
    {
      $project: {
        name: 1,
        email: 1,
        username: 1,
        phone: 1,
        bio: 1,
        location: 1,
        role: 1,
        isActive: 1,
        isDemo: 1,
        lastLoginAt: 1,
        preferences: 1,
        enrolledCourses: 1,
        stats: 1,
        createdAt: 1,
        updatedAt: 1,
        avatar: {
          $cond: [
            { $regexMatch: { input: { $ifNull: ['$avatar', ''] }, regex: /^data:image\//i } },
            {
              $concat: [
                '/api/v1/users/',
                { $toString: '$_id' },
                '/avatar?v=',
                { $toString: { $ifNull: [{ $toLong: '$updatedAt' }, 0] } },
              ],
            },
            '$avatar',
          ],
        },
      },
    },
  ]);
  return user ?? null;
};

const getGoogleProfileName = (name, email) => {
  const providedName = typeof name === 'string' ? name.trim() : '';
  if (providedName.length >= 2) return providedName.slice(0, 60);

  const emailName = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
  return (emailName.length >= 2 ? emailName : 'Google User').slice(0, 60);
};

const getGoogleAvatar = (picture) => {
  if (typeof picture !== 'string' || !picture.trim()) return null;
  try {
    const url = new URL(picture);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
};

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

  return createSession(user);
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password -avatar -cart -wishlist -learningActivityDates');

  if (!user?.password) {
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

  return createSession(await getSessionUser(user._id));
};

export const loginWithGoogleIdentity = async (identity) => {
  const uid = typeof identity?.uid === 'string' ? identity.uid.trim() : '';
  const email = typeof identity?.email === 'string' ? identity.email.trim().toLowerCase() : '';
  const signInProvider = identity?.firebase?.sign_in_provider;

  if (!uid || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, 'A valid Google email address is required.');
  }
  if (identity.email_verified !== true) {
    throw new ApiError(401, 'Your Google email address must be verified.');
  }
  if (signInProvider !== 'google.com') {
    throw new ApiError(401, 'Please use Google to sign in.');
  }

  const [userByEmail, userByFirebaseUid] = await Promise.all([
    User.findOne({ email }),
    User.findOne({ firebaseUid: uid }),
  ]);

  if (userByFirebaseUid && userByFirebaseUid.email !== email) {
    throw new ApiError(409, 'This Google account is already linked to another EduMaster account.');
  }
  if (userByEmail && userByFirebaseUid && !userByEmail._id.equals(userByFirebaseUid._id)) {
    throw new ApiError(409, 'This email is already linked to another Google account.');
  }

  let user = userByEmail || userByFirebaseUid;

  if (user) {
    if (!user.isActive) throw new ApiError(403, 'Account is inactive');
    if (user.firebaseUid && user.firebaseUid !== uid) {
      throw new ApiError(409, 'This email is already linked to another Google account.');
    }

    if (!user.firebaseUid) user.firebaseUid = uid;
    if (!user.avatar) user.avatar = getGoogleAvatar(identity.picture);
    user.lastLoginAt = new Date();

    try {
      await user.save({ validateBeforeSave: false });
    } catch (error) {
      if (error?.code === 11000) {
        throw new ApiError(409, 'This Google account is already linked to another EduMaster account.');
      }
      throw error;
    }

    return createSession(user);
  }

  const { registrationEnabled } = await getEffectivePlatformSettings();
  if (!registrationEnabled) {
    throw new ApiError(403, 'New account registration is temporarily disabled.');
  }

  try {
    user = await User.create({
      name: getGoogleProfileName(identity.name, email),
      email,
      avatar: getGoogleAvatar(identity.picture),
      firebaseUid: uid,
      authProvider: 'google',
      role: 'user',
      isActive: true,
      lastLoginAt: new Date(),
    });
  } catch (error) {
    if (error?.code !== 11000) throw error;

    const concurrentUser = await User.findOne({ email });
    if (!concurrentUser || (concurrentUser.firebaseUid && concurrentUser.firebaseUid !== uid)) {
      throw new ApiError(409, 'This Google account could not be linked safely.');
    }
    if (!concurrentUser.isActive) throw new ApiError(403, 'Account is inactive');
    if (!concurrentUser.firebaseUid) {
      concurrentUser.firebaseUid = uid;
      await concurrentUser.save({ validateBeforeSave: false });
    }
    user = concurrentUser;
  }

  await createEvent({
    userId: user._id,
    notification: { title: 'Welcome to EduMaster', message: 'Your account is ready. Choose a course and start learning.', type: 'system', actionUrl: '/courses' },
    activity: { type: 'account', title: 'Joined EduMaster', message: 'Created your EduMaster learning account.', actionUrl: '/courses', dedupeKey: 'account-created' },
    email: { template: 'welcome' },
  });

  return createSession(user);
};

export const googleLogin = async ({ idToken }) => {
  const identity = await verifyFirebaseIdToken(idToken);
  return loginWithGoogleIdentity(identity);
};

export const refresh = async (token) => {
  if (!token) {
    throw new ApiError(401, 'Refresh token required', [], 'TOKEN_MISSING');
  }

  const decoded = verifyToken(token, 'refresh');

  if (decoded.type !== 'refresh' || !decoded.sub) {
    throw new ApiError(401, 'Invalid token', [], 'TOKEN_INVALID');
  }

  const user = await getSessionUser(decoded.sub);

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
      const user = decoded.sub ? await getSessionUser(decoded.sub) : null;

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
