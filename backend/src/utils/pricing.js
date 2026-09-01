export const TAX_RATE = 0.18;

export const COURSE_COUPONS = Object.freeze({
  WELCOME20: 20,
  EDU10: 10,
  FIRST50: 50,
});

const money = (value) => Math.round((Number(value) || 0) * 100) / 100;

export const normalizeCouponCode = (value) => String(value ?? '').trim().toUpperCase();

export const getCoursePricing = (course) => {
  const listedPrice = Math.max(0, Number(course?.price) || 0);
  const rawDiscountPrice = Number(course?.discountPrice);
  const price = Number.isFinite(rawDiscountPrice) && rawDiscountPrice > 0
    ? Math.min(rawDiscountPrice, listedPrice)
    : listedPrice;
  const oldPrice = Number(course?.oldPrice);
  const originalPrice = Number.isFinite(oldPrice) && oldPrice > price ? oldPrice : listedPrice;
  return { price: money(price), originalPrice: money(originalPrice) };
};

export const calculatePriceSummary = (courses, couponCode = '') => {
  const normalizedCouponCode = normalizeCouponCode(couponCode);
  const couponPercent = normalizedCouponCode ? COURSE_COUPONS[normalizedCouponCode] : 0;

  if (normalizedCouponCode && !couponPercent) {
    const error = new Error('Invalid or expired coupon code');
    error.code = 'COUPON_INVALID';
    throw error;
  }

  const items = courses.map((course) => {
    const { price, originalPrice } = getCoursePricing(course);
    return {
      course: course._id,
      title: course.title,
      instructor: course.instructor,
      category: course.category,
      imageType: course.imageType,
      rating: course.rating,
      originalPrice,
      price,
    };
  });
  const originalPrice = money(items.reduce((total, item) => total + item.originalPrice, 0));
  const subtotal = money(items.reduce((total, item) => total + item.price, 0));
  const courseDiscount = money(Math.max(0, originalPrice - subtotal));
  const couponDiscount = normalizedCouponCode
    ? money(Math.round(subtotal * couponPercent / 100))
    : 0;
  const taxableAmount = money(Math.max(0, subtotal - couponDiscount));
  const tax = money(Math.round(taxableAmount * TAX_RATE));
  const finalPrice = money(taxableAmount + tax);

  return {
    items,
    originalPrice,
    originalSubtotal: originalPrice,
    courseDiscount,
    subtotal,
    couponCode: normalizedCouponCode || null,
    couponDiscount,
    taxableAmount,
    tax,
    finalPrice,
  };
};
