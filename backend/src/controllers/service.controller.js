import * as serviceService from '../services/service.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const isAdmin = (req) => req.user?.role === 'admin';

export const createService = asyncHandler(async (req, res) => {
  const service = await serviceService.createService(req.body);

  const response = new ApiResponse(201, 'Service created successfully', { service });
  res.status(response.statusCode).json(response);
});

export const getServices = asyncHandler(async (req, res) => {
  const { services, pagination } = await serviceService.getServices(req.query, {
    includeUnpublished: isAdmin(req),
  });

  const response = new ApiResponse(200, 'Services fetched successfully', { services, pagination });
  res.status(response.statusCode).json(response);
});

export const getServiceBySlug = asyncHandler(async (req, res) => {
  const service = await serviceService.getServiceBySlug(req.params.slug, {
    includeUnpublished: isAdmin(req),
  });

  const response = new ApiResponse(200, 'Service fetched successfully', { service });
  res.status(response.statusCode).json(response);
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await serviceService.updateService(req.params.id, req.body);

  const response = new ApiResponse(200, 'Service updated successfully', { service });
  res.status(response.statusCode).json(response);
});

export const deleteService = asyncHandler(async (req, res) => {
  await serviceService.deleteService(req.params.id);

  const response = new ApiResponse(200, 'Service deleted successfully');
  res.status(response.statusCode).json(response);
});
