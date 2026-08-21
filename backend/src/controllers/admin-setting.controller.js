import * as service from '../services/admin-setting.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getSettings = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, 'Platform settings fetched successfully', await service.getAdminSettings()));
});

export const updateSettings = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, 'Platform settings updated successfully', await service.updateAdminSettings(req.body, req.user.id)));
});
