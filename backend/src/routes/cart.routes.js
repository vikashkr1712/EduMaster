import { Router } from 'express';
import * as cartController from '../controllers/cart.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { addToCartSchema, moveToWishlistSchema } from '../validations/cart.validation.js';

const router = Router();

router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/', validate(addToCartSchema), cartController.addToCart);
router.delete('/:courseId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;
