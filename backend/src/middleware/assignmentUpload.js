import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { randomUUID } from 'node:crypto';

const destination = path.resolve('uploads', 'assignments');
fs.mkdirSync(destination, { recursive: true });
const allowedExtensions = new Set(['.pdf', '.doc', '.docx', '.zip']);
const allowedMimeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
  'application/x-zip-compressed',
]);

export const assignmentUpload = multer({
  storage: multer.diskStorage({
    destination,
    filename(req, file, callback) {
      callback(null, `${Date.now()}-${randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024, files: 1 },
  fileFilter(req, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.has(extension) || !allowedMimeTypes.has(file.mimetype)) return callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'solution'));
    return callback(null, true);
  },
});
