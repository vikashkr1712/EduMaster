import { Router } from 'express';
import * as testimonialController from '../controllers/testimonial.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { createTestimonialSchema, updateTestimonialSchema } from '../validations/testimonial.validation.js';

const router = Router();

router.get('/', testimonialController.getTestimonials);
router.get('/:id', testimonialController.getTestimonialById);

router.post('/', authenticate, authorize('admin'), validate(createTestimonialSchema), testimonialController.createTestimonial);
router.patch('/:id', authenticate, authorize('admin'), validate(updateTestimonialSchema), testimonialController.updateTestimonial);
router.delete('/:id', authenticate, authorize('admin'), testimonialController.deleteTestimonial);

export default router;
