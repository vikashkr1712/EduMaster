import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name must not exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    password: {
      type: String,
      required() {
        return this.authProvider !== 'google';
      },
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
      validate: {
        validator(value) {
          return /^(?=.*[a-zA-Z])(?=.*\d).+$/.test(value);
        },
        message: 'Password must contain at least one letter and one number',
      },
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Role must be either user or admin',
      },
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
    },
    avatar: {
      type: String,
      trim: true,
      default: null,
    },
    firebaseUid: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    username: { type: String, trim: true, minlength: 3, maxlength: 30 },
    phone: { type: String, trim: true, maxlength: 20, default: '' },
    bio: { type: String, trim: true, maxlength: 500, default: '' },
    location: { type: String, trim: true, maxlength: 120, default: '' },
    preferences: {
      theme: { type: String, enum: ['light', 'dark'], default: 'light' },
      notifications: {
        course: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        offers: { type: Boolean, default: false },
      },
      loginAlerts: { type: Boolean, default: true },
    },
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    }],
    cart: [{
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
      },
      price: { type: Number, required: true },
      discountPrice: { type: Number, default: 0 },
      addedAt: { type: Date, default: Date.now },
    }],
    enrolledCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    }],
    stats: {
      enrolledCourses: { type: Number, default: 0, min: 0 },
      certificates: { type: Number, default: 0, min: 0 },
      hoursLearned: { type: Number, default: 0, min: 0 },
      progress: { type: Number, default: 0, min: 0, max: 100 },
      completedCourses: { type: Number, default: 0, min: 0 },
      achievements: { type: Number, default: 0, min: 0 },
      quizzesAttempted: { type: Number, default: 0, min: 0 },
      averageQuizScore: { type: Number, default: 0, min: 0, max: 100 },
      passedQuizzes: { type: Number, default: 0, min: 0 },
      bestQuizScore: { type: Number, default: 0, min: 0, max: 100 },
      assignmentsSubmitted: { type: Number, default: 0, min: 0 },
      discussionPosts: { type: Number, default: 0, min: 0 },
      notesCreated: { type: Number, default: 0, min: 0 },
      downloads: { type: Number, default: 0, min: 0 },
    },
    learningActivityDates: { type: [Date], default: [] },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(config.BCRYPT_SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  // Keep large database-backed avatars out of JSON responses. The versioned
  // image endpoint lets profile photos load independently and be browser-cached
  // instead of blocking session restoration with a megabyte-sized payload.
  if (typeof user.avatar === 'string' && user.avatar.startsWith('data:image/')) {
    const version = user.updatedAt instanceof Date ? `?v=${user.updatedAt.getTime()}` : '';
    user.avatar = `/api/v1/users/${user._id}/avatar${version}`;
  }
  delete user.password;
  delete user.firebaseUid;
  delete user.__v;
  return user;
};

userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);

export default User;
