import * as cartService from '../services/cart.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCart = asyncHandler(async (req, res) => {
  const items = await cartService.getCart(req.user.id);
  const response = new ApiResponse(200, 'Cart retrieved successfully', { items });
  res.status(response.statusCode).json(response);
});

export const addToCart = asyncHandler(async (req, res) => {
  const items = await cartService.addToCart(req.user.id, req.body.courseId);
  const response = new ApiResponse(200, 'Course added to cart', { items });
  res.status(response.statusCode).json(response);
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const items = await cartService.removeFromCart(req.user.id, req.params.courseId);
  const response = new ApiResponse(200, 'Course removed from cart', { items });
  res.status(response.statusCode).json(response);
});

export const clearCart = asyncHandler(async (req, res) => {
  await cartService.clearCart(req.user.id);
  const response = new ApiResponse(200, 'Cart cleared', { items: [] });
  res.status(response.statusCode).json(response);
});
