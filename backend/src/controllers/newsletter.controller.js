import * as newsletterService from '../services/newsletter.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const subscribe = async (req, res) => {
  const subscriber = await newsletterService.subscribe(req.body);

  const response = new ApiResponse(201, 'Subscribed successfully', { subscriber });
  res.status(response.statusCode).json(response);
};

export const unsubscribe = async (req, res) => {
  await newsletterService.unsubscribe(req.body);

  const response = new ApiResponse(200, 'Unsubscribed successfully');
  res.status(response.statusCode).json(response);
};
