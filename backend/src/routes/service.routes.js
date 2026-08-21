import { Router } from 'express';
import * as serviceController from '../controllers/service.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { createServiceSchema, updateServiceSchema } from '../validations/service.validation.js';

const router = Router();

router.get('/', serviceController.getServices);
router.get('/:slug', serviceController.getServiceBySlug);

router.post('/', authenticate, authorize('admin'), validate(createServiceSchema), serviceController.createService);
router.patch('/:id', authenticate, authorize('admin'), validate(updateServiceSchema), serviceController.updateService);
router.delete('/:id', authenticate, authorize('admin'), serviceController.deleteService);

export default router;
