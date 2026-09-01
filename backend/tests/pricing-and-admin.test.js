import assert from 'node:assert/strict';
import { test } from 'node:test';
import { authorize } from '../src/middleware/authorize.js';
import { canonicalizeCourseCategory, COURSE_CATEGORIES } from '../src/utils/courseCategories.js';
import { calculatePriceSummary } from '../src/utils/pricing.js';

const course = (overrides = {}) => ({
  _id: '68a88490832e561579f755a2',
  title: 'Pricing Test Course',
  instructor: 'EduMaster',
  category: 'Development',
  price: 4999,
  discountPrice: 0,
  oldPrice: 4999,
  ...overrides,
});

test('calculates course, coupon, tax, and final pricing once on the backend', () => {
  const pricing = calculatePriceSummary([
    course({ discountPrice: 4499 }),
  ], 'edu10');

  assert.equal(pricing.originalPrice, 4999);
  assert.equal(pricing.courseDiscount, 500);
  assert.equal(pricing.subtotal, 4499);
  assert.equal(pricing.couponCode, 'EDU10');
  assert.equal(pricing.couponDiscount, 450);
  assert.equal(pricing.taxableAmount, 4049);
  assert.equal(pricing.tax, 729);
  assert.equal(pricing.finalPrice, 4778);
});

test('keeps no-coupon pricing identical and rejects unknown coupon codes', () => {
  const pricing = calculatePriceSummary([course()]);
  assert.equal(pricing.couponCode, null);
  assert.equal(pricing.couponDiscount, 0);
  assert.equal(pricing.tax, 900);
  assert.equal(pricing.finalPrice, 5899);
  assert.throws(() => calculatePriceSummary([course()], 'expired-code'), { code: 'COUPON_INVALID' });
});

test('uses the catalog taxonomy and normalizes category casing', () => {
  assert.deepEqual(COURSE_CATEGORIES, [
    'Development', 'Data Science', 'Design', 'Business', 'Marketing',
    'IT & Software', 'Personal Development',
  ]);
  assert.equal(canonicalizeCourseCategory(' data science '), 'Data Science');
  assert.equal(canonicalizeCourseCategory('unknown'), null);
});

test('allows admins and continues to deny students at Admin middleware', () => {
  let continued = false;
  authorize('admin')({ user: { role: 'admin' } }, {}, () => { continued = true; });
  assert.equal(continued, true);

  assert.throws(
    () => authorize('admin')({ user: { role: 'user' } }, {}, () => {}),
    (error) => error.statusCode === 403 && error.code === 'ROLE_FORBIDDEN'
  );
});
