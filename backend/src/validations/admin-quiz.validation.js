import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID');
const trimmed = (min, max, label) => z.string().trim().min(min, `${label} is required`).max(max, `${label} is too long`);

export const adminQuizQuestionSchema = z.object({
  question: trimmed(1, 1000, 'Question'),
  options: z.array(trimmed(1, 500, 'Option')).length(4, 'Each question must have exactly four options'),
  correctAnswer: z.coerce.number().int().min(0).max(3),
  explanation: trimmed(1, 1500, 'Explanation'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).default('Medium'),
}).superRefine((value, context) => {
  const normalized = value.options.map((option) => option.toLocaleLowerCase());
  if (new Set(normalized).size !== normalized.length) {
    context.addIssue({ code: 'custom', path: ['options'], message: 'Question options must be unique' });
  }
});

const quizFields = {
  course: objectId,
  moduleId: trimmed(1, 160, 'Module'),
  lessonId: trimmed(1, 160, 'Lesson'),
  title: trimmed(1, 160, 'Quiz title'),
  passingMarks: z.coerce.number().int().min(1).max(100),
  timeLimit: z.coerce.number().int().min(1).max(180),
  isPublished: z.boolean(),
};

export const createAdminQuizSchema = z.object({
  ...quizFields,
  isPublished: quizFields.isPublished.default(true),
  questions: z.array(adminQuizQuestionSchema).max(100, 'A quiz cannot have more than 100 questions').default([]),
}).superRefine((value, context) => {
  if (value.isPublished && value.questions.length === 0) {
    context.addIssue({ code: 'custom', path: ['questions'], message: 'A published quiz must have at least one question' });
  }
});

export const updateAdminQuizSchema = z.object({
  course: quizFields.course.optional(),
  moduleId: quizFields.moduleId.optional(),
  lessonId: quizFields.lessonId.optional(),
  title: quizFields.title.optional(),
  passingMarks: quizFields.passingMarks.optional(),
  timeLimit: quizFields.timeLimit.optional(),
  isPublished: quizFields.isPublished.optional(),
}).refine((value) => Object.keys(value).length > 0, 'At least one field is required');

export const updateAdminQuizQuestionSchema = z.object({
  question: trimmed(1, 1000, 'Question').optional(),
  options: z.array(trimmed(1, 500, 'Option')).length(4, 'Each question must have exactly four options').optional(),
  correctAnswer: z.coerce.number().int().min(0).max(3).optional(),
  explanation: trimmed(1, 1500, 'Explanation').optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
}).superRefine((value, context) => {
  if (Object.keys(value).length === 0) {
    context.addIssue({ code: 'custom', message: 'At least one field is required' });
  }
  if (value.options) {
    const normalized = value.options.map((option) => option.toLocaleLowerCase());
    if (new Set(normalized).size !== normalized.length) {
      context.addIssue({ code: 'custom', path: ['options'], message: 'Question options must be unique' });
    }
  }
});

export const reorderAdminQuizQuestionsSchema = z.object({
  ids: z.array(objectId).min(1, 'Question order is required').max(100),
});

export const adminQuizListQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
  course: objectId.optional(),
  status: z.enum(['published', 'draft']).optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  attempts: z.enum(['with', 'without']).optional(),
  sort: z.enum(['newest', 'oldest', 'titleAsc', 'titleDesc', 'questionsAsc', 'questionsDesc']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});
