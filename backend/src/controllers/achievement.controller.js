import { getAchievements as getUserAchievements } from '../services/achievement.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAchievements = asyncHandler(async (req, res) => {
  const achievements = await getUserAchievements(req.user.id);
  const response = new ApiResponse(200, 'Achievements retrieved successfully', { achievements });
  res.status(response.statusCode).json(response);
});
