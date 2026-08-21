import * as noteService from '../services/note.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const list = asyncHandler(async (req, res) => { const notes = await noteService.list(req.user.id, req.params.lessonId, req.query.courseId, req.query.search); res.status(200).json(new ApiResponse(200, 'Notes retrieved successfully', { notes })); });
export const create = asyncHandler(async (req, res) => { const data = await noteService.create(req.user.id, req.body); res.status(201).json(new ApiResponse(201, 'Note saved successfully', data)); });
export const update = asyncHandler(async (req, res) => { const note = await noteService.update(req.user.id, req.params.id, req.body); res.status(200).json(new ApiResponse(200, 'Note updated successfully', { note })); });
export const remove = asyncHandler(async (req, res) => { const data = await noteService.remove(req.user.id, req.params.id); res.status(200).json(new ApiResponse(200, 'Note deleted successfully', data)); });
