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

export default router;
