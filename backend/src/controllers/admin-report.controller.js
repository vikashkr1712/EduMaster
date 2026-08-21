import * as service from '../services/admin-report.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getReport = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, 'Admin report fetched successfully', await service.getAdminReport(req.query.range)));
});
