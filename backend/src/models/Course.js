import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    sourceId: {
      type: Number,
    },
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
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, 'Short description must not exceed 300 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [5000, 'Description must not exceed 5000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    level: {
      type: String,
      required: [true, 'Level is required'],
      trim: true,
      enum: {
        values: ['Beginner', 'Intermediate', 'Advanced'],
        message: 'Level must be Beginner, Intermediate, or Advanced',
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must not be negative'],
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, 'Discount price must not be negative'],
    },
    oldPrice: {
      type: Number,
      min: [0, 'Old price must not be negative'],
    },
    priceType: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: [0, 'Rating must not be negative'],
      max: [5, 'Rating must not exceed 5'],
    },
    students: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    imageType: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    language: {
      type: String,
      trim: true,
    },
    instructor: {
      type: String,
      required: [true, 'Instructor is required'],
      trim: true,
      minlength: [2, 'Instructor must be at least 2 characters'],
      maxlength: [60, 'Instructor must not exceed 60 characters'],
    },
    hasCertificate: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

courseSchema.methods.toJSON = function () {
  const course = this.toObject();
  delete course.__v;
  return course;
};

const Course = mongoose.model('Course', courseSchema);

export default Course;
