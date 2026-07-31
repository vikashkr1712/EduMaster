import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    sourceId: {
      type: Number,
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Student name must be at least 2 characters'],
      maxlength: [80, 'Student name must not exceed 80 characters'],
    },
    designation: {
      type: String,
      trim: true,
      maxlength: [80, 'Designation must not exceed 80 characters'],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [80, 'Company must not exceed 80 characters'],
    },
    avatar: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must not exceed 5'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [120, 'Title must not exceed 120 characters'],
    },
    review: {
      type: String,
      required: [true, 'Review is required'],
      trim: true,
      minlength: [10, 'Review must be at least 10 characters'],
      maxlength: [2000, 'Review must not exceed 2000 characters'],
    },
    course: {
      type: String,
      trim: true,
      maxlength: [120, 'Course must not exceed 120 characters'],
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

testimonialSchema.index({ isPublished: 1, isFeatured: -1, createdAt: -1 });

testimonialSchema.methods.toJSON = function () {
  const testimonial = this.toObject();
  delete testimonial.__v;
  return testimonial;
};

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
