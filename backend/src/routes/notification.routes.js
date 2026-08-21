import { Router } from 'express';
import * as controller from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { notificationListSchema } from '../validations/notification.validation.js';

const router = Router();
router.use(authenticate);
router.get('/', validate(notificationListSchema, 'query'), controller.list);
router.patch('/read-all', controller.readAll);
router.patch('/read/:id', controller.read);
router.patch('/archive/:id', controller.archive);
router.delete('/:id', controller.remove);
export default router;
