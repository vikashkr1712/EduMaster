import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
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
    icon: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
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
    duration: {
      type: String,
      trim: true,
      maxlength: [60, 'Duration must not exceed 60 characters'],
    },
    features: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      trim: true,
      enum: {
        values: ['Active', 'Inactive'],
        message: 'Status must be Active or Inactive',
      },
      default: 'Active',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

serviceSchema.index({ category: 1, isPublished: 1 });

serviceSchema.methods.toJSON = function () {
  const service = this.toObject();
  delete service.__v;
  return service;
};

const Service = mongoose.model('Service', serviceSchema);

export default Service;
