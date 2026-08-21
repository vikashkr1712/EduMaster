import * as notificationService from '../services/notification.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const list = asyncHandler(async (req, res) => res.status(200).json(new ApiResponse(200, 'Notifications retrieved successfully', await notificationService.listNotifications(req.user.id, req.query))));
export const activities = asyncHandler(async (req, res) => res.status(200).json(new ApiResponse(200, 'Activity retrieved successfully', await notificationService.listActivities(req.user.id, req.query))));
export const read = asyncHandler(async (req, res) => res.status(200).json(new ApiResponse(200, 'Notification marked as read', { notification: await notificationService.markRead(req.user.id, req.params.id) })));
export const readAll = asyncHandler(async (req, res) => res.status(200).json(new ApiResponse(200, 'All notifications marked as read', await notificationService.markAllRead(req.user.id))));
export const archive = asyncHandler(async (req, res) => res.status(200).json(new ApiResponse(200, 'Notification archived', { notification: await notificationService.archive(req.user.id, req.params.id) })));
export const remove = asyncHandler(async (req, res) => res.status(200).json(new ApiResponse(200, 'Notification deleted', await notificationService.remove(req.user.id, req.params.id))));
