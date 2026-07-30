import * as contactService from '../services/contact.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const submitMessage = async (req, res) => {
  const message = await contactService.createMessage(req.body);

  const response = new ApiResponse(201, 'Message sent successfully', { message });
  res.status(response.statusCode).json(response);
};
