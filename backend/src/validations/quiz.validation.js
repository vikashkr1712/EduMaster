import { z } from 'zod';

export const submitQuizSchema = z.object({
  attemptId: z.string().trim().min(1, 'Attempt ID is required'),
  answers: z.array(z.object({
    questionId: z.string().trim().min(1, 'Question ID is required'),
    selectedAnswer: z.number().int().min(0).max(3).nullable(),
  }).strict()).max(100),
}).strict();
