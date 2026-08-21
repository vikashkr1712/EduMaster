import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseEnrollment', required: true },
    certificateNumber: { type: String, required: true, unique: true, index: true },
    verificationCode: { type: String, required: true, unique: true, index: true },
    issueDate: { type: Date, required: true, default: Date.now },
    completionDate: { type: Date, required: true },
    certificateUrl: { type: String, required: true, trim: true },
    pdfUrl: { type: String, required: true, trim: true },
    status: { type: String, enum: ['valid', 'revoked'], default: 'valid', index: true },
  },
  { timestamps: true }
);

certificateSchema.index({ user: 1, course: 1 }, { unique: true });

certificateSchema.methods.toJSON = function () {
  const certificate = this.toObject();
  delete certificate.__v;
  return certificate;
};

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;
