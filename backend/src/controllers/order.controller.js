import * as orderService from '../services/order.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createOrder = asyncHandler(async (req, res) => {
  const data = await orderService.createOrder(req.user.id, req.body);
  const response = new ApiResponse(201, 'Order completed and enrollment created', data);
  res.status(response.statusCode).json(response);
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrder(req.user.id, req.params.id);
  const response = new ApiResponse(200, 'Order retrieved successfully', { order });
  res.status(response.statusCode).json(response);
});

export const getUserOrders = asyncHandler(async (req, res) => {
  const data = await orderService.getUserOrders(req.user.id);
  const response = new ApiResponse(200, 'Orders and enrollments retrieved successfully', data);
  res.status(response.statusCode).json(response);
});
