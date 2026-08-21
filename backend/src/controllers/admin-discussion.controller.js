import * as service from '../services/admin-discussion.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDiscussions = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, 'Admin discussions fetched successfully', await service.getDiscussions(req.query)));
});

export const getDiscussion = asyncHandler(async (req, res) => {
  const discussion = await service.getDiscussion(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Admin discussion fetched successfully', { discussion }));
});

export const removeDiscussion = asyncHandler(async (req, res) => {
  const result = await service.deleteDiscussion(req.params.id);
  res.status(200).json(new ApiResponse(200, 'Discussion removed successfully', result));
});

export const removeReply = asyncHandler(async (req, res) => {
  const result = await service.deleteReply(req.params.id, req.params.replyId);
  res.status(200).json(new ApiResponse(200, 'Reply removed successfully', result));
});
