import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema, quoteOrderSchema } from '../validations/order.validation.js';

const router = Router();

router.use(authenticate);
router.post('/quote', validate(quoteOrderSchema), orderController.quoteOrder);
router.post('/', validate(createOrderSchema), orderController.createOrder);
router.get('/user', orderController.getUserOrders);
router.get('/:id', orderController.getOrder);

export default router;
