import * as courseService from '../services/course.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { saveCourseThumbnail } from '../services/course-thumbnail.service.js';

export const getCourses = asyncHandler(async (req, res) => {
  const result = await courseService.getAdminCourses(req.query);
  const response = new ApiResponse(200, 'Admin courses fetched successfully', result);
  res.status(response.statusCode).json(response);
});

export const getCourse = asyncHandler(async (req, res) => {
  const course = await courseService.getAdminCourseById(req.params.id);
  const response = new ApiResponse(200, 'Admin course fetched successfully', { course });
  res.status(response.statusCode).json(response);
});

export const createCourse = asyncHandler(async (req, res) => {
  const course = await courseService.createCourse(req.body);
  const response = new ApiResponse(201, 'Course created successfully', { course });
  res.status(response.statusCode).json(response);
});

export const uploadCourseThumbnail = asyncHandler(async (req, res) => {
  const thumbnail = await saveCourseThumbnail(req.file);
  const response = new ApiResponse(201, 'Course thumbnail uploaded successfully', { thumbnail });
  res.status(response.statusCode).json(response);
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourse(req.params.id, req.body);
  const response = new ApiResponse(200, 'Course updated successfully', { course });
  res.status(response.statusCode).json(response);
});

export const toggleCoursePublish = asyncHandler(async (req, res) => {
  const course = await courseService.toggleCoursePublish(req.params.id);
  const message = course.isPublished ? 'Course published successfully' : 'Course unpublished successfully';
  const response = new ApiResponse(200, message, { course });
  res.status(response.statusCode).json(response);
});

export const deleteCourse = asyncHandler(async (req, res) => {
  await courseService.deleteCourse(req.params.id);
  const response = new ApiResponse(200, 'Course deleted successfully');
  res.status(response.statusCode).json(response);
});
