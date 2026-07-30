import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [120, 'Title must not exceed 120 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [5000, 'Description must not exceed 5000 characters'],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, 'Short description must not exceed 300 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      trim: true,
      enum: {
        values: ['Online', 'Offline', 'Hybrid'],
        message: 'Mode must be Online, Offline, or Hybrid',
      },
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Location must not exceed 200 characters'],
    },
    meetingLink: {
      type: String,
      trim: true,
    },
    speaker: {
      type: String,
      required: [true, 'Speaker is required'],
      trim: true,
      minlength: [2, 'Speaker must be at least 2 characters'],
      maxlength: [60, 'Speaker must not exceed 60 characters'],
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    banner: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      validate: {
        validator(value) {
          return !value || !this.startDate || value >= this.startDate;
        },
        message: 'End date must not be before start date',
      },
    },
    startTime: {
      type: String,
      trim: true,
      maxlength: [20, 'Start time must not exceed 20 characters'],
    },
    endTime: {
      type: String,
      trim: true,
      maxlength: [20, 'End time must not exceed 20 characters'],
    },
    capacity: {
      type: Number,
      min: [1, 'Capacity must be at least 1'],
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: [0, 'Registered count must not be negative'],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price must not be negative'],
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, 'Discount price must not be negative'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      trim: true,
      enum: {
        values: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
        message: 'Status must be Upcoming, Ongoing, Completed, or Cancelled',
      },
      default: 'Upcoming',
    },
  },
  { timestamps: true }
);

eventSchema.index({ startDate: 1, isPublished: 1 });
eventSchema.index({ category: 1 });

eventSchema.methods.toJSON = function () {
  const event = this.toObject();
  delete event.__v;
  return event;
};

const Event = mongoose.model('Event', eventSchema);

export default Event;
