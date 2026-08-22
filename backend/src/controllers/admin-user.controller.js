import * as adminUserService from '../services/admin-user.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUsers = asyncHandler(async (req, res) => {
  const data = await adminUserService.getAdminUsers(req.query);
  const response = new ApiResponse(200, 'Users retrieved successfully', data);
  res.status(response.statusCode).json(response);
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await adminUserService.getAdminUser(req.params.id);
  const response = new ApiResponse(200, 'User retrieved successfully', { user });
  res.status(response.statusCode).json(response);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await adminUserService.updateAdminUser(req.params.id, req.body);
  const response = new ApiResponse(200, 'User updated successfully', { user });
  res.status(response.statusCode).json(response);
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await adminUserService.updateAdminUserRole(req.params.id, req.body.role, req.user.id);
  const response = new ApiResponse(200, 'User role updated successfully', { user });
  res.status(response.statusCode).json(response);
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await adminUserService.updateAdminUserStatus(req.params.id, req.body.isActive, req.user.id);
  const response = new ApiResponse(200, 'User status updated successfully', { user });
  res.status(response.statusCode).json(response);
});

export const updateUserDemoStatus = asyncHandler(async (req, res) => {
  const user = await adminUserService.updateAdminUserDemoStatus(req.params.id, req.body.isDemo, req.user.id);
  const response = new ApiResponse(200, 'User demo status updated successfully', { user });
  res.status(response.statusCode).json(response);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const result = await adminUserService.deleteAdminUser(req.params.id, req.user.id, req.body.confirmEmail);
  const response = new ApiResponse(200, 'Demo user and related test data deleted successfully', result);
  res.status(response.statusCode).json(response);
});
