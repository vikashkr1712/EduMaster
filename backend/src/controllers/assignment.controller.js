import * as assignmentService from '../services/assignment.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAssignment = asyncHandler(async (req, res) => { const data = await assignmentService.getAssignment(req.user.id, req.params.lessonId, req.query.courseId); const response = new ApiResponse(200, 'Assignment retrieved successfully', data); res.status(200).json(response); });
export const submitAssignment = asyncHandler(async (req, res) => { const data = await assignmentService.submitAssignment(req.user.id, req.params.assignmentId, req.file, req.body.remarks); const response = new ApiResponse(201, 'Assignment submitted successfully', data); res.status(201).json(response); });
export const getHistory = asyncHandler(async (req, res) => { const data = await assignmentService.getHistory(req.user.id); const response = new ApiResponse(200, 'Assignment history retrieved successfully', data); res.status(200).json(response); });
