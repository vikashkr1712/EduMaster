import * as quizService from '../services/quiz.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getQuizByLesson = asyncHandler(async (req, res) => {
  const data = await quizService.getQuizByLesson(req.user.id, req.params.lessonId, req.query.courseId);
  const response = new ApiResponse(200, 'Quiz retrieved successfully', data);
  res.status(response.statusCode).json(response);
});

export const startQuiz = asyncHandler(async (req, res) => {
  const data = await quizService.startQuiz(req.user.id, req.params.quizId);
  const response = new ApiResponse(data.resumed ? 200 : 201, data.resumed ? 'Quiz attempt resumed' : 'Quiz attempt started', data);
  res.status(response.statusCode).json(response);
});

export const submitQuiz = asyncHandler(async (req, res) => {
  const data = await quizService.submitQuiz(req.user.id, req.params.quizId, req.body);
  const response = new ApiResponse(200, data.attempt.passed ? 'Quiz passed successfully' : 'Quiz submitted', data);
  res.status(response.statusCode).json(response);
});

export const getQuizResult = asyncHandler(async (req, res) => {
  const data = await quizService.getQuizResult(req.user.id, req.params.attemptId);
  const response = new ApiResponse(200, 'Quiz result retrieved successfully', data);
  res.status(response.statusCode).json(response);
});

export const getQuizHistory = asyncHandler(async (req, res) => {
  const data = await quizService.getQuizHistory(req.user.id);
  const response = new ApiResponse(200, 'Quiz history retrieved successfully', data);
  res.status(response.statusCode).json(response);
});
