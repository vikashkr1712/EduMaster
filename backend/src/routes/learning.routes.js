import { Router } from 'express';
import * as learningController from '../controllers/learning.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import {
  bookmarkSchema,
  createNoteSchema,
  currentLessonSchema,
  progressSchema,
  updateNoteSchema,
} from '../validations/learning.validation.js';
import { resourceDownloadSchema } from '../validations/assignment.validation.js';

const router = Router();

router.use(authenticate);
router.patch('/progress', validate(progressSchema), learningController.saveProgress);
router.patch('/current-lesson', validate(currentLessonSchema), learningController.saveCurrentLesson);
router.post('/notes', validate(createNoteSchema), learningController.createNote);
router.patch('/notes/:id', validate(updateNoteSchema), learningController.updateNote);
router.delete('/notes/:id', learningController.deleteNote);
router.post('/bookmark', validate(bookmarkSchema), learningController.setBookmark);
router.post('/resources/download', validate(resourceDownloadSchema), learningController.trackResourceDownload);
router.get('/:courseId', learningController.getLearningCourse);

export default router;
