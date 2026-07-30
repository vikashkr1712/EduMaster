import * as courseService from '../services/course.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createCourse = asyncHandler(async (req, res) => {
  const course = await courseService.createCourse(req.body);

  const response = new ApiResponse(201, 'Course created successfully', { course });
  res.status(response.statusCode).json(response);
});

const isAdmin = (req) => req.user?.role === 'admin';

export const getCourses = asyncHandler(async (req, res) => {
  const { courses, pagination } = await courseService.getCourses(req.query, {
    includeUnpublished: isAdmin(req),
  });

  const response = new ApiResponse(200, 'Courses fetched successfully', { courses, pagination });
  res.status(response.statusCode).json(response);
});

export const getCourseBySlug = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseBySlug(req.params.slug, {
    includeUnpublished: isAdmin(req),
  });

  const response = new ApiResponse(200, 'Course fetched successfully', { course });
  res.status(response.statusCode).json(response);
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourse(req.params.id, req.body);

  const response = new ApiResponse(200, 'Course updated successfully', { course });
  res.status(response.statusCode).json(response);
});

export const deleteCourse = asyncHandler(async (req, res) => {
  await courseService.deleteCourse(req.params.id);

  const response = new ApiResponse(200, 'Course deleted successfully');
  res.status(response.statusCode).json(response);
});
