import * as quizService from '../services/admin-quiz.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const send = (res, status, message, data = null) => {
  const response = new ApiResponse(status, message, data);
  res.status(response.statusCode).json(response);
};

export const getQuizzes = asyncHandler(async (req, res) => send(res, 200, 'Admin quizzes fetched successfully', await quizService.getAdminQuizzes(req.query)));
export const getQuizOptions = asyncHandler(async (req, res) => send(res, 200, 'Quiz curriculum options fetched successfully', { courses: await quizService.getAdminQuizOptions() }));
export const getQuiz = asyncHandler(async (req, res) => send(res, 200, 'Admin quiz fetched successfully', { quiz: await quizService.getAdminQuiz(req.params.id) }));
export const createQuiz = asyncHandler(async (req, res) => send(res, 201, 'Quiz created successfully', { quiz: await quizService.createAdminQuiz(req.body) }));
export const updateQuiz = asyncHandler(async (req, res) => send(res, 200, 'Quiz updated successfully', { quiz: await quizService.updateAdminQuiz(req.params.id, req.body) }));
export const deleteQuiz = asyncHandler(async (req, res) => { await quizService.deleteAdminQuiz(req.params.id); send(res, 200, 'Quiz deleted successfully'); });
export const createQuestion = asyncHandler(async (req, res) => send(res, 201, 'Question created successfully', { question: await quizService.createAdminQuizQuestion(req.params.id, req.body) }));
export const updateQuestion = asyncHandler(async (req, res) => send(res, 200, 'Question updated successfully', { question: await quizService.updateAdminQuizQuestion(req.params.id, req.params.questionId, req.body) }));
export const deleteQuestion = asyncHandler(async (req, res) => { await quizService.deleteAdminQuizQuestion(req.params.id, req.params.questionId); send(res, 200, 'Question deleted successfully'); });
export const reorderQuestions = asyncHandler(async (req, res) => send(res, 200, 'Questions reordered successfully', { questions: await quizService.reorderAdminQuizQuestions(req.params.id, req.body.ids) }));
