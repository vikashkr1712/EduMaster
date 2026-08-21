import User from '../models/User.js';
import Course from '../models/Course.js';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';

const populateCart = (query) =>
  query.populate({ path: 'cart.course', model: 'Course' });

const findCourse = async (courseId) => {
  const value = String(courseId ?? '').trim();
  let course = mongoose.isValidObjectId(value) ? await Course.findById(value) : null;
  if (!course && Number.isInteger(Number(value))) {
    course = await Course.findOne({ sourceId: Number(value) });
  }
  if (!course) throw new ApiError(404, 'Course not found');
  return course;
};

const formatCartItems = (user) =>
  user.cart
    .filter((item) => item.course != null)
    .map((item) => ({
      _id: item._id,
      course: item.course,
      price: item.price,
      discountPrice: item.discountPrice,
      addedAt: item.addedAt,
    }));

export const getCart = async (userId) => {
  const user = await populateCart(User.findById(userId));
  if (!user) throw new ApiError(404, 'User not found');
  return formatCartItems(user);
};

export const addToCart = async (userId, courseId) => {
  const course = await findCourse(courseId);

  const price = Number(course.price) || 0;
  const rawDiscount = Number(course.discountPrice);
  const discountPrice = Number.isFinite(rawDiscount) && rawDiscount > 0 ? rawDiscount : 0;
  const effectivePrice = discountPrice > 0 ? discountPrice : price;

  if (effectivePrice === 0 && course.priceType === 'Free') {
    throw new ApiError(400, 'Free courses cannot be added to cart');
  }

  const alreadyInCart = await User.exists({
    _id: userId,
    'cart.course': course._id,
  });

  if (alreadyInCart) {
    throw new ApiError(409, 'Course is already in your cart');
  }

  const user = await populateCart(
    User.findByIdAndUpdate(
      userId,
      {
        $push: {
          cart: {
            course: course._id,
            price,
            discountPrice,
            addedAt: new Date(),
          },
        },
      },
      { new: true }
    )
  );

  if (!user) throw new ApiError(404, 'User not found');
  return formatCartItems(user);
};

export const removeFromCart = async (userId, courseId) => {
  const course = await findCourse(courseId);

  const user = await populateCart(
    User.findByIdAndUpdate(
      userId,
      { $pull: { cart: { course: course._id } } },
      { new: true }
    )
  );

  if (!user) throw new ApiError(404, 'User not found');
  return formatCartItems(user);
};

export const clearCart = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { cart: [] } },
    { new: true }
  );
  if (!user) throw new ApiError(404, 'User not found');
  return [];
};
