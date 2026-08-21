import * as curriculumService from '../services/admin-curriculum.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const send = (res, statusCode, message, data) => {
  const response = new ApiResponse(statusCode, message, data);
  res.status(response.statusCode).json(response);
};

export const getCurriculum = asyncHandler(async (req, res) => {
  send(res, 200, 'Curriculum retrieved successfully', await curriculumService.getCurriculum(req.params.courseId));
});

export const createModule = asyncHandler(async (req, res) => {
  send(res, 201, 'Module created successfully', await curriculumService.createModule(req.params.courseId, req.body));
});

export const updateModule = asyncHandler(async (req, res) => {
  send(res, 200, 'Module updated successfully', await curriculumService.updateModule(req.params.courseId, req.params.moduleId, req.body));
});

export const deleteModule = asyncHandler(async (req, res) => {
  send(res, 200, 'Module deleted successfully', await curriculumService.deleteModule(req.params.courseId, req.params.moduleId));
});

export const reorderModules = asyncHandler(async (req, res) => {
  send(res, 200, 'Modules reordered successfully', await curriculumService.reorderModules(req.params.courseId, req.body.ids));
});

export const createLesson = asyncHandler(async (req, res) => {
  send(res, 201, 'Lesson created successfully', await curriculumService.createLesson(req.params.courseId, req.params.moduleId, req.body));
});

export const updateLesson = asyncHandler(async (req, res) => {
  send(res, 200, 'Lesson updated successfully', await curriculumService.updateLesson(req.params.courseId, req.params.moduleId, req.params.lessonId, req.body));
});

export const deleteLesson = asyncHandler(async (req, res) => {
  send(res, 200, 'Lesson deleted successfully', await curriculumService.deleteLesson(req.params.courseId, req.params.moduleId, req.params.lessonId));
});

export const reorderLessons = asyncHandler(async (req, res) => {
  send(res, 200, 'Lessons reordered successfully', await curriculumService.reorderLessons(req.params.courseId, req.params.moduleId, req.body.ids));
});
