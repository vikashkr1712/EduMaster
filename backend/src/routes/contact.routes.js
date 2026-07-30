import { Router } from 'express';
import * as contactController from '../controllers/contact.controller.js';
import { validate } from '../middleware/validate.js';
import { formLimiter } from '../middleware/rateLimiter.js';
import { contactSchema } from '../validations/contact.validation.js';

const router = Router();

router.post('/', formLimiter, validate(contactSchema), contactController.submitMessage);

export default router;
