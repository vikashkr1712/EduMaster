import * as eventService from '../services/event.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const isAdmin = (req) => req.user?.role === 'admin';

export const createEvent = asyncHandler(async (req, res) => {
  const event = await eventService.createEvent(req.body);

  const response = new ApiResponse(201, 'Event created successfully', { event });
  res.status(response.statusCode).json(response);
});

export const getEvents = asyncHandler(async (req, res) => {
  const { events, pagination } = await eventService.getEvents(req.query, {
    includeUnpublished: isAdmin(req),
  });

  const response = new ApiResponse(200, 'Events fetched successfully', { events, pagination });
  res.status(response.statusCode).json(response);
});

export const getEventBySlug = asyncHandler(async (req, res) => {
  const event = await eventService.getEventBySlug(req.params.slug, {
    includeUnpublished: isAdmin(req),
  });

  const response = new ApiResponse(200, 'Event fetched successfully', { event });
  res.status(response.statusCode).json(response);
});

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await eventService.updateEvent(req.params.id, req.body);

  const response = new ApiResponse(200, 'Event updated successfully', { event });
  res.status(response.statusCode).json(response);
});

export const deleteEvent = asyncHandler(async (req, res) => {
  await eventService.deleteEvent(req.params.id);

  const response = new ApiResponse(200, 'Event deleted successfully');
  res.status(response.statusCode).json(response);
});
