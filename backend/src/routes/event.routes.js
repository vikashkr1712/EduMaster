import { Router } from 'express';
import * as eventController from '../controllers/event.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { createEventSchema, updateEventSchema } from '../validations/event.validation.js';

const router = Router();

router.get('/', eventController.getEvents);
router.get('/:slug', eventController.getEventBySlug);

router.post('/', authenticate, authorize('admin'), validate(createEventSchema), eventController.createEvent);
router.patch('/:id', authenticate, authorize('admin'), validate(updateEventSchema), eventController.updateEvent);
router.delete('/:id', authenticate, authorize('admin'), eventController.deleteEvent);

export default router;
