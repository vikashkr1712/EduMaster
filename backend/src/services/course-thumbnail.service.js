import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { ApiError } from '../utils/ApiError.js';
import { config } from '../config/env.js';

const destination = path.resolve('uploads', 'course-thumbnails');
const maxFileSize = 5 * 1024 * 1024;
const extensions = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const hasValidSignature = (buffer, mimeType) => {
  if (mimeType === 'image/jpeg') return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (mimeType === 'image/png') return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (mimeType === 'image/webp') return buffer.length >= 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  return false;
};

const hasCloudinaryConfig = Boolean(
  config.CLOUDINARY_CLOUD_NAME && config.CLOUDINARY_API_KEY && config.CLOUDINARY_API_SECRET
);

const uploadToCloudinary = async (file) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'edumaster/course-thumbnails';
  const signature = createHash('sha1')
    .update(`folder=${folder}&timestamp=${timestamp}${config.CLOUDINARY_API_SECRET}`)
    .digest('hex');
  const body = new FormData();
  body.append('file', new Blob([file.buffer], { type: file.mimetype }), file.originalname);
  body.append('api_key', config.CLOUDINARY_API_KEY);
  body.append('timestamp', String(timestamp));
  body.append('folder', folder);
  body.append('signature', signature);

  let response;
  try {
    response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(config.CLOUDINARY_CLOUD_NAME)}/image/upload`, {
      method: 'POST',
      body,
    });
  } catch {
    throw new ApiError(502, 'Persistent thumbnail storage is currently unavailable');
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.secure_url) {
    throw new ApiError(502, result?.error?.message || 'Persistent thumbnail storage rejected the upload');
  }
  return result.secure_url;
};

export const saveCourseThumbnail = async (file) => {
  if (!file) throw new ApiError(400, 'Select a course thumbnail to upload');
  if (!Buffer.isBuffer(file.buffer)) throw new ApiError(400, 'The uploaded thumbnail could not be read');
  if (file.size > maxFileSize || file.buffer.length > maxFileSize) throw new ApiError(400, 'Course thumbnail must be 5 MB or smaller');
  if (!extensions[file.mimetype] || !hasValidSignature(file.buffer, file.mimetype)) {
    throw new ApiError(400, 'The uploaded file does not match a supported image type');
  }

  if (hasCloudinaryConfig) return uploadToCloudinary(file);
  if (config.NODE_ENV === 'production') {
    throw new ApiError(503, 'Course thumbnail storage is not configured');
  }

  await fs.mkdir(destination, { recursive: true });
  const filename = `${Date.now()}-${randomUUID()}${extensions[file.mimetype]}`;
  await fs.writeFile(path.join(destination, filename), file.buffer, { flag: 'wx' });
  return `/uploads/course-thumbnails/${filename}`;
};
