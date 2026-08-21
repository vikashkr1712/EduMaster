import User from '../models/User.js';
import Course from '../models/Course.js';
import mongoose from 'mongoose';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ApiError } from '../utils/ApiError.js';
import { createEvent } from './notification.service.js';

const LEGACY_AVATAR_DIRECTORY = path.resolve('uploads', 'avatars');
const legacyAvatarMimeTypes = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };

const migrateLegacyAvatar = async (user) => {
  if (!user?.avatar?.startsWith('/uploads/avatars/')) return user;
  const filename = path.basename(user.avatar);
  const mimeType = legacyAvatarMimeTypes[path.extname(filename).toLowerCase()];
  if (!mimeType) return user;
  try {
    const image = await readFile(path.join(LEGACY_AVATAR_DIRECTORY, filename));
    user.avatar = `data:${mimeType};base64,${image.toString('base64')}`;
    await user.save();
  } catch {
    // A previous serverless instance may already have discarded the file.
    // The frontend's SVG fallback remains visible until the user re-uploads it.
  }
  return user;
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return migrateLegacyAvatar(user);
};

export const updateProfile = async (userId, updates) => {
  if (updates.email) {
    const existingUser = await User.findOne({ email: updates.email, _id: { $ne: userId } });

    if (existingUser) {
      throw new ApiError(409, 'Email already registered');
    }
  }
  if (updates.username) {
    const existingUsername = await User.findOne({ username: updates.username, _id: { $ne: userId } });
    if (existingUsername) throw new ApiError(409, 'Username is already in use');
  }

  const updateDocument = { ...updates };
  if (updates.preferences) {
    delete updateDocument.preferences;
    if (updates.preferences.theme !== undefined) updateDocument['preferences.theme'] = updates.preferences.theme;
    if (updates.preferences.loginAlerts !== undefined) updateDocument['preferences.loginAlerts'] = updates.preferences.loginAlerts;
    Object.entries(updates.preferences.notifications || {}).forEach(([key, value]) => { updateDocument[`preferences.notifications.${key}`] = value; });
  }
  const user = await User.findByIdAndUpdate(userId, { $set: updateDocument }, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user || !await user.comparePassword(currentPassword)) throw new ApiError(400, 'Current password is incorrect');
  user.password = newPassword;
  await user.save();
  await createEvent({
    userId,
    notification: { title: 'Password changed', message: 'Your EduMaster password was changed successfully.', type: 'system', actionUrl: '/profile/settings' },
    activity: { type: 'account', title: 'Changed password', message: 'Updated account security credentials.', actionUrl: '/profile/settings' },
    email: { template: 'password-changed' },
  });
};

const avatarDataUrlPattern = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+={0,2})$/i;

const imageHasExpectedSignature = (buffer, mimeType) => {
  if (mimeType === 'image/png') return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (mimeType === 'image/jpeg') return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (mimeType === 'image/webp') return buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP';
  return false;
};

export const uploadAvatar = async (userId, dataUrl) => {
  const match = avatarDataUrlPattern.exec(dataUrl);
  if (!match) throw new ApiError(400, 'Please upload a PNG, JPG, JPEG or WebP image');

  const mimeType = match[1].toLowerCase();
  const image = Buffer.from(match[2], 'base64');
  if (!image.length || image.length > 2 * 1024 * 1024) {
    throw new ApiError(400, 'Image must be no larger than 2 MB');
  }
  if (!imageHasExpectedSignature(image, mimeType)) {
    throw new ApiError(400, 'The uploaded file does not match its image type');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    // Serverless deployments do not preserve local uploads between requests.
    // Keeping the validated image in MongoDB makes the same avatar URL portable
    // across localhost, preview deployments and production instances.
    { avatar: dataUrl },
    { new: true, runValidators: true }
  );
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

const populateWishlist = (query) => query.populate('wishlist');

const getWishlistUser = async (userId) => {
  const user = await populateWishlist(User.findById(userId));
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

const findCourse = async (courseId) => {
  const value = String(courseId ?? '').trim();
  let course = mongoose.isValidObjectId(value) ? await Course.findById(value) : null;
  if (!course && Number.isInteger(Number(value))) {
    course = await Course.findOne({ sourceId: Number(value) });
  }
  if (!course) throw new ApiError(404, 'Course not found');
  return course;
};

export const getWishlist = async (userId) => {
  const user = await getWishlistUser(userId);
  return user.wishlist;
};

export const addToWishlist = async (userId, courseId) => {
  const course = await findCourse(courseId);
  const user = await populateWishlist(User.findByIdAndUpdate(
    userId,
    { $addToSet: { wishlist: course._id } },
    { new: true }
  ));
  if (!user) throw new ApiError(404, 'User not found');
  return user.wishlist;
};

export const removeFromWishlist = async (userId, courseId) => {
  const course = await findCourse(courseId);
  const user = await populateWishlist(User.findByIdAndUpdate(
    userId,
    { $pull: { wishlist: course._id } },
    { new: true }
  ));
  if (!user) throw new ApiError(404, 'User not found');
  return user.wishlist;
};
