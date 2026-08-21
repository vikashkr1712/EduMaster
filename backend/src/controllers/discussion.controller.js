import * as discussionService from '../services/discussion.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const list = asyncHandler(async (req, res) => { const data = await discussionService.list(req.user.id, req.params.lessonId, req.query.courseId, req.query.sort, Math.max(1, Number(req.query.page) || 1)); res.status(200).json(new ApiResponse(200, 'Discussions retrieved successfully', data)); });
export const create = asyncHandler(async (req, res) => { const data = await discussionService.create(req.user.id, req.body); res.status(201).json(new ApiResponse(201, 'Question posted successfully', data)); });
export const reply = asyncHandler(async (req, res) => { const data = await discussionService.reply(req.user.id, req.params.id, req.body.message); res.status(201).json(new ApiResponse(201, 'Reply posted successfully', data)); });
export const update = asyncHandler(async (req, res) => { const discussion = await discussionService.update(req.user.id, req.params.id, req.body.question); res.status(200).json(new ApiResponse(200, 'Discussion updated successfully', { discussion })); });
export const remove = asyncHandler(async (req, res) => { const data = await discussionService.remove(req.user.id, req.params.id); res.status(200).json(new ApiResponse(200, 'Discussion deleted successfully', data)); });
export const like = asyncHandler(async (req, res) => { const data = await discussionService.toggleLike(req.user.id, req.params.id); res.status(200).json(new ApiResponse(200, data.liked ? 'Discussion liked' : 'Like removed', data)); });
export const replies = asyncHandler(async (req, res) => { const data = await discussionService.listReplies(req.user.id, req.params.id, Math.max(1, Number(req.query.page) || 1)); res.status(200).json(new ApiResponse(200, 'Replies retrieved successfully', data)); });
export const updateReply = asyncHandler(async (req, res) => { const discussion = await discussionService.updateReply(req.user.id, req.params.id, req.params.replyId, req.body.message); res.status(200).json(new ApiResponse(200, 'Reply updated successfully', { discussion })); });
export const removeReply = asyncHandler(async (req, res) => { const discussion = await discussionService.removeReply(req.user.id, req.params.id, req.params.replyId); res.status(200).json(new ApiResponse(200, 'Reply deleted successfully', { discussion })); });
export const likeReply = asyncHandler(async (req, res) => { const data = await discussionService.toggleReplyLike(req.user.id, req.params.id, req.params.replyId); res.status(200).json(new ApiResponse(200, data.liked ? 'Reply liked' : 'Reply like removed', data)); });
