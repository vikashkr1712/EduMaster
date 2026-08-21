import * as learningService from '../services/learning.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getLearningCourse = asyncHandler(async (req, res) => {
  const data = await learningService.getLearningCourse(req.user.id, req.params.courseId);
  const response = new ApiResponse(200, 'Learning course retrieved successfully', data);
  res.status(response.statusCode).json(response);
});

export const saveProgress = asyncHandler(async (req, res) => {
  const data = await learningService.saveProgress(req.user.id, req.body);
  const response = new ApiResponse(200, data.certificateGenerated ? 'Course completed and certificate generated' : 'Lesson progress saved', data);
  res.status(response.statusCode).json(response);
});

export const saveCurrentLesson = asyncHandler(async (req, res) => {
  const enrollment = await learningService.saveCurrentLesson(req.user.id, req.body);
  const response = new ApiResponse(200, 'Current lesson saved', { enrollment });
  res.status(response.statusCode).json(response);
});

export const createNote = asyncHandler(async (req, res) => {
  const note = await learningService.createNote(req.user.id, req.body);
  const response = new ApiResponse(201, 'Note created', { note });
  res.status(response.statusCode).json(response);
});

export const updateNote = asyncHandler(async (req, res) => {
  const note = await learningService.updateNote(req.user.id, req.params.id, req.body);
  const response = new ApiResponse(200, 'Note updated', { note });
  res.status(response.statusCode).json(response);
});

export const deleteNote = asyncHandler(async (req, res) => {
  const data = await learningService.deleteNote(req.user.id, req.params.id, req.query.courseId);
  const response = new ApiResponse(200, 'Note deleted', data);
  res.status(response.statusCode).json(response);
});

export const setBookmark = asyncHandler(async (req, res) => {
  const data = await learningService.setBookmark(req.user.id, req.body);
  const response = new ApiResponse(200, data.bookmarked ? 'Lesson bookmarked' : 'Bookmark removed', data);
  res.status(response.statusCode).json(response);
});

export const trackResourceDownload = asyncHandler(async (req, res) => {
  const data = await learningService.trackResourceDownload(req.user.id, req.body);
  const response = new ApiResponse(200, 'Resource download recorded', data);
  res.status(response.statusCode).json(response);
});
