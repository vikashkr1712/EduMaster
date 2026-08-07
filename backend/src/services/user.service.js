import User from '../models/User.js';
import Course from '../models/Course.js';
import mongoose from 'mongoose';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { ApiError } from '../utils/ApiError.js';

export const getProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};

export const updateProfile = async (userId, updates) => {
  if (updates.email) {
    const existingUser = await User.findOne({ email: updates.email, _id: { $ne: userId } });

    if (existingUser) {
      throw new ApiError(409, 'Email already registered');
    }
  }

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};

const AVATAR_DIRECTORY = path.resolve('uploads', 'avatars');
const AVATAR_MIME_TYPES = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
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

  const extension = AVATAR_MIME_TYPES[mimeType];
  const filename = `${userId}-${randomUUID()}.${extension}`;
  await mkdir(AVATAR_DIRECTORY, { recursive: true });
  await writeFile(path.join(AVATAR_DIRECTORY, filename), image, { flag: 'wx' });

  const user = await User.findByIdAndUpdate(
    userId,
    { avatar: `/uploads/avatars/${filename}` },
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
