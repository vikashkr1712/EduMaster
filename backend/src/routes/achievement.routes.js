import { Router } from 'express';
import { getAchievements } from '../controllers/achievement.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);
router.get('/', getAchievements);

export default router;
