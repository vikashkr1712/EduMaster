import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    instructor: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    imageType: { type: String, trim: true },
    rating: { type: Number, min: 0, max: 5 },
    originalPrice: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const billingSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    country: { type: String, trim: true },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    pincode: { type: String, trim: true },
    address1: { type: String, trim: true },
    address2: { type: String, trim: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    }],
    items: {
      type: [orderItemSchema],
      validate: [(items) => items.length > 0, 'An order must contain at least one course'],
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    subtotal: { type: Number, required: true, min: 0 },
    courseDiscount: { type: Number, default: 0, min: 0 },
    coupon: {
      code: { type: String, trim: true, uppercase: true },
      discount: { type: Number, default: 0, min: 0 },
    },
    tax: { type: Number, default: 0, min: 0 },
    amount: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['card', 'upi', 'netbanking', 'wallet', 'free'],
    },
    paymentDetails: { type: String, trim: true, maxlength: 80 },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'completed',
      index: true,
    },
    billing: billingSchema,
  },
  { timestamps: true }
);

orderSchema.methods.toJSON = function () {
  const order = this.toObject();
  delete order.__v;
  return order;
};

const Order = mongoose.model('Order', orderSchema);

export default Order;
