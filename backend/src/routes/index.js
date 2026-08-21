import { Router } from 'express';
import mongoose from 'mongoose';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import contactRoutes from './contact.routes.js';
import newsletterRoutes from './newsletter.routes.js';
import courseRoutes from './course.routes.js';
import eventRoutes from './event.routes.js';
import serviceRoutes from './service.routes.js';
import testimonialRoutes from './testimonial.routes.js';
import cartRoutes from './cart.routes.js';
import orderRoutes from './order.routes.js';
import learningRoutes from './learning.routes.js';
import certificateRoutes from './certificate.routes.js';
import achievementRoutes from './achievement.routes.js';
import quizRoutes from './quiz.routes.js';
import assignmentRoutes from './assignment.routes.js';
import discussionRoutes from './discussion.routes.js';
import noteRoutes from './note.routes.js';
import notificationRoutes from './notification.routes.js';
import activityRoutes from './activity.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    data: {
      uptime: process.uptime(),
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    },
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/contact', contactRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/courses', courseRoutes);
router.use('/events', eventRoutes);
router.use('/services', serviceRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/learn', learningRoutes);
router.use('/certificates', certificateRoutes);
router.use('/achievements', achievementRoutes);
router.use('/quizzes', quizRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/discussions', discussionRoutes);
router.use('/notes', noteRoutes);
router.use('/notifications', notificationRoutes);
router.use('/activities', activityRoutes);
router.use('/admin', adminRoutes);

export default router;
