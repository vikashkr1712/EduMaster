import { Router } from 'express';
import * as courseController from '../controllers/course.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { createCourseSchema, updateCourseSchema } from '../validations/course.validation.js';

const router = Router();

router.get('/', courseController.getCourses);
router.get('/:slug', courseController.getCourseBySlug);

router.post('/', authenticate, authorize('admin'), validate(createCourseSchema), courseController.createCourse);
router.patch('/:id', authenticate, authorize('admin'), validate(updateCourseSchema), courseController.updateCourse);
router.delete('/:id', authenticate, authorize('admin'), courseController.deleteCourse);

export default router;
