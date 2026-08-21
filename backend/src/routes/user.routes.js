import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { updateProfileSchema, uploadAvatarSchema, changePasswordSchema } from '../validations/user.validation.js';

const router = Router();

router.get('/profile', authenticate, userController.getProfile);
router.patch('/profile', authenticate, validate(updateProfileSchema), userController.updateProfile);
router.patch('/profile/avatar', authenticate, validate(uploadAvatarSchema), userController.uploadAvatar);
router.patch('/password', authenticate, validate(changePasswordSchema), userController.changePassword);
router.get('/wishlist', authenticate, userController.getWishlist);
router.post('/wishlist', authenticate, userController.addToWishlist);
router.delete('/wishlist/:courseId', authenticate, userController.removeFromWishlist);

export default router;
