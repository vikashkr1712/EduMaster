import multer from 'multer';
import path from 'node:path';
import { ApiError } from '../utils/ApiError.js';

export const MAX_COURSE_THUMBNAIL_SIZE = 5 * 1024 * 1024;

const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_COURSE_THUMBNAIL_SIZE, files: 1 },
  fileFilter(req, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.has(extension) || !allowedMimeTypes.has(file.mimetype)) {
      return callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'thumbnail'));
    }
    return callback(null, true);
  },
});

export const courseThumbnailUpload = (req, res, next) => {
  uploader.single('thumbnail')(req, res, (error) => {
    if (!error) return next();
    if (error.code === 'LIMIT_FILE_SIZE') return next(new ApiError(400, 'Course thumbnail must be 5 MB or smaller'));
    return next(new ApiError(400, 'Course thumbnail must be a JPG, JPEG, PNG, or WebP image'));
  });
};
