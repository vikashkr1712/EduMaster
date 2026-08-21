import * as userService from '../services/user.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getProfile = async (req, res) => {
  const user = await userService.getProfile(req.user.id);

  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    data: { user },
  });
};

export const updateProfile = async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { user },
  });
};

export const uploadAvatar = async (req, res) => {
  const user = await userService.uploadAvatar(req.user.id, req.body.dataUrl);

  res.status(200).json({
    success: true,
    message: 'Profile photo updated successfully',
    data: { user },
  });
};

export const changePassword = asyncHandler(async (req, res) => {
  await userService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
  res.status(200).json(new ApiResponse(200, 'Password changed successfully'));
});

export const getWishlist = asyncHandler(async (req, res) => {
  const courses = await userService.getWishlist(req.user.id);
  const response = new ApiResponse(200, 'Wishlist retrieved successfully', { courses });
  res.status(response.statusCode).json(response);
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const courses = await userService.addToWishlist(req.user.id, req.body.courseId);
  const response = new ApiResponse(200, 'Course added to wishlist', { courses });
  res.status(response.statusCode).json(response);
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const courses = await userService.removeFromWishlist(req.user.id, req.params.courseId);
  const response = new ApiResponse(200, 'Course removed from wishlist', { courses });
  res.status(response.statusCode).json(response);
});
