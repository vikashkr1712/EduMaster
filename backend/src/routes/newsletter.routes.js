import { Router } from 'express';
import * as newsletterController from '../controllers/newsletter.controller.js';
import { validate } from '../middleware/validate.js';
import { formLimiter } from '../middleware/rateLimiter.js';
import { subscribeSchema } from '../validations/newsletter.validation.js';

const router = Router();

router.post('/subscribe', formLimiter, validate(subscribeSchema), newsletterController.subscribe);
router.post('/unsubscribe', formLimiter, validate(subscribeSchema), newsletterController.unsubscribe);

export default router;
