import { Router } from 'express';
import * as quizController from '../controllers/quiz.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { submitQuizSchema } from '../validations/quiz.validation.js';

const router = Router();
router.use(authenticate);
router.get('/history', quizController.getQuizHistory);
router.get('/result/:attemptId', quizController.getQuizResult);
router.post('/:quizId/start', quizController.startQuiz);
router.post('/:quizId/submit', validate(submitQuizSchema), quizController.submitQuiz);
router.get('/:lessonId', quizController.getQuizByLesson);
export default router;
