import { z } from 'zod';

const eventFields = {
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title must not exceed 120 characters'),
  shortDescription: z
    .string()
    .trim()
    .max(300, 'Short description must not exceed 300 characters'),
  description: z
    .string()
    .trim()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  category: z
    .string()
    .trim()
    .min(2, 'Category must be at least 2 characters')
    .max(60, 'Category must not exceed 60 characters'),
  mode: z.enum(['Online', 'Offline', 'Hybrid'], {
    errorMap: () => ({ message: 'Mode must be Online, Offline, or Hybrid' }),
  }),
  location: z
    .string()
    .trim()
    .max(200, 'Location must not exceed 200 characters'),
  meetingLink: z.string().trim().url('Meeting link must be a valid URL'),
  speaker: z
    .string()
    .trim()
    .min(2, 'Speaker must be at least 2 characters')
    .max(60, 'Speaker must not exceed 60 characters'),
  thumbnail: z.string().trim().url('Thumbnail must be a valid URL'),
  banner: z.string().trim().url('Banner must be a valid URL'),
  startDate: z.coerce.date({
    errorMap: () => ({ message: 'Start date must be a valid date' }),
  }),
  endDate: z.coerce.date({
    errorMap: () => ({ message: 'End date must be a valid date' }),
  }),
  startTime: z
    .string()
    .trim()
    .max(20, 'Start time must not exceed 20 characters'),
  endTime: z
    .string()
    .trim()
    .max(20, 'End time must not exceed 20 characters'),
  capacity: z.number().int('Capacity must be an integer').min(1, 'Capacity must be at least 1'),
  price: z.number().min(0, 'Price must not be negative'),
  discountPrice: z.number().min(0, 'Discount price must not be negative'),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  tags: z
    .array(z.string().trim().min(1, 'Tags must not be empty').max(40, 'Each tag must not exceed 40 characters'))
    .max(10, 'Must not exceed 10 tags'),
  status: z.enum(['Upcoming', 'Ongoing', 'Completed', 'Cancelled'], {
    errorMap: () => ({ message: 'Status must be Upcoming, Ongoing, Completed, or Cancelled' }),
  }),
};

export const createEventSchema = z
  .object({
    ...eventFields,
    shortDescription: eventFields.shortDescription.optional(),
    location: eventFields.location.optional(),
    meetingLink: eventFields.meetingLink.optional(),
    thumbnail: eventFields.thumbnail.optional(),
    banner: eventFields.banner.optional(),
    endDate: eventFields.endDate.optional(),
    startTime: eventFields.startTime.optional(),
    endTime: eventFields.endTime.optional(),
    capacity: eventFields.capacity.optional(),
    price: eventFields.price.optional(),
    discountPrice: eventFields.discountPrice.optional(),
    isFeatured: eventFields.isFeatured.optional(),
    isPublished: eventFields.isPublished.optional(),
    tags: eventFields.tags.optional(),
    status: eventFields.status.optional(),
  })
  .strict();

export const updateEventSchema = z
  .object(eventFields)
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required to update',
  });
