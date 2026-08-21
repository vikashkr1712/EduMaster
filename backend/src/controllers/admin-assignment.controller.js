import * as service from '../services/admin-assignment.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const send = (res, status, message, data = null) => { const response = new ApiResponse(status, message, data); res.status(status).json(response); };
export const getAssignments = asyncHandler(async (req, res) => send(res, 200, 'Admin assignments fetched successfully', await service.getAssignments(req.query)));
export const getOptions = asyncHandler(async (req, res) => send(res, 200, 'Assignment curriculum options fetched successfully', { courses: await service.getOptions() }));
export const getAssignment = asyncHandler(async (req, res) => send(res, 200, 'Admin assignment fetched successfully', { assignment: await service.getAssignment(req.params.id) }));
export const createAssignment = asyncHandler(async (req, res) => send(res, 201, 'Assignment created successfully', { assignment: await service.createAssignment(req.body) }));
export const updateAssignment = asyncHandler(async (req, res) => send(res, 200, 'Assignment updated successfully', { assignment: await service.updateAssignment(req.params.id, req.body) }));
export const deleteAssignment = asyncHandler(async (req, res) => { await service.deleteAssignment(req.params.id); send(res, 200, 'Assignment deleted successfully'); });
export const getSubmissions = asyncHandler(async (req, res) => send(res, 200, 'Assignment submissions fetched successfully', await service.getSubmissions(req.params.id, req.query)));
export const getSubmission = asyncHandler(async (req, res) => send(res, 200, 'Assignment submission fetched successfully', await service.getSubmission(req.params.id, req.params.submissionId)));
export const gradeSubmission = asyncHandler(async (req, res) => send(res, 200, 'Submission graded successfully', { submission: await service.gradeSubmission(req.params.id, req.params.submissionId, req.body) }));
