import * as testimonialService from '../services/testimonial.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const isAdmin = (req) => req.user?.role === 'admin';

export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.createTestimonial(req.body);

  const response = new ApiResponse(201, 'Testimonial created successfully', { testimonial });
  res.status(response.statusCode).json(response);
});

export const getTestimonials = asyncHandler(async (req, res) => {
  const { testimonials, pagination } = await testimonialService.getTestimonials(req.query, {
    includeUnpublished: isAdmin(req),
  });

  const response = new ApiResponse(200, 'Testimonials fetched successfully', { testimonials, pagination });
  res.status(response.statusCode).json(response);
});

export const getTestimonialById = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.getTestimonialById(req.params.id, {
    includeUnpublished: isAdmin(req),
  });

  const response = new ApiResponse(200, 'Testimonial fetched successfully', { testimonial });
  res.status(response.statusCode).json(response);
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.updateTestimonial(req.params.id, req.body);

  const response = new ApiResponse(200, 'Testimonial updated successfully', { testimonial });
  res.status(response.statusCode).json(response);
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  await testimonialService.deleteTestimonial(req.params.id);

  const response = new ApiResponse(200, 'Testimonial deleted successfully');
  res.status(response.statusCode).json(response);
});
