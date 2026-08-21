import * as service from '../services/admin-notification.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getNotifications = asyncHandler(async (req, res) => res.status(200).json(new ApiResponse(200, 'Admin notifications fetched successfully', await service.getAdminNotifications(req.query))));
export const getNotification = asyncHandler(async (req, res) => res.status(200).json(new ApiResponse(200, 'Admin notification fetched successfully', await service.getAdminNotification(req.params.id, req.query))));
export const getOptions = asyncHandler(async (req, res) => res.status(200).json(new ApiResponse(200, 'Notification options fetched successfully', await service.getAdminNotificationOptions(req.query))));
export const createNotification = asyncHandler(async (req, res) => {
  const result = await service.createAdminNotification(req.user.id, req.body);
  res.status(201).json(new ApiResponse(201, `Notification created for ${result.recipientCount} ${result.recipientCount === 1 ? 'student' : 'students'}.`, result));
});
