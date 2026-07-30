import Message from '../models/Message.js';

export const createMessage = async ({ name, email, subject, message }) => {
  return Message.create({ name, email, subject, message });
};
