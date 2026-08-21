import * as adminOrderService from '../services/admin-order.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getOrders = asyncHandler(async (req, res) => {
  const data = await adminOrderService.getAdminOrders(req.query);
  const response = new ApiResponse(200, 'Orders retrieved successfully', data);
  res.status(response.statusCode).json(response);
});

export const getOrder = asyncHandler(async (req, res) => {
  const data = await adminOrderService.getAdminOrder(req.params.id);
  const response = new ApiResponse(200, 'Order retrieved successfully', data);
  res.status(response.statusCode).json(response);
});

export const getEnrollments = asyncHandler(async (req, res) => {
  const data = await adminOrderService.getAdminEnrollments(req.query);
  const response = new ApiResponse(200, 'Enrollments retrieved successfully', data);
  res.status(response.statusCode).json(response);
});

export const getEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await adminOrderService.getAdminEnrollment(req.params.id);
  const response = new ApiResponse(200, 'Enrollment retrieved successfully', { enrollment });
  res.status(response.statusCode).json(response);
});
