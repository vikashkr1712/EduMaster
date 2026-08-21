import { Router } from 'express';
import { activities } from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { activityListSchema } from '../validations/notification.validation.js';

const router = Router();
router.get('/', authenticate, validate(activityListSchema, 'query'), activities);
export default router;
