import User from '../models/User.js';
import Course from '../models/Course.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import Order from '../models/Order.js';
import Certificate from '../models/Certificate.js';

const RECENT_LIMIT = 5;

export const buildRevenueOrderMatch = (createdAt) => ({
  paymentStatus: 'completed',
  paymentMethod: { $ne: 'free' },
  amount: { $gt: 0 },
  ...(createdAt ? { createdAt } : {}),
});

export const getDashboard = async () => {
  const [
    users,
    courses,
    enrollments,
    orders,
    certificates,
    revenueResult,
    recentUsers,
    recentOrders,
  ] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    CourseEnrollment.countDocuments(),
    Order.countDocuments(),
    Certificate.countDocuments(),
    Order.aggregate([
      {
        $match: buildRevenueOrderMatch(),
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    User.find()
      .select('name email avatar role createdAt')
      .sort({ createdAt: -1 })
      .limit(RECENT_LIMIT)
      .lean(),
    Order.find()
      .select('orderNumber user items amount paymentStatus createdAt')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(RECENT_LIMIT)
      .lean(),
  ]);

  return {
    stats: {
      users,
      courses,
      enrollments,
      orders,
      revenue: revenueResult[0]?.total ?? 0,
      certificates,
    },
    recentUsers,
    recentOrders: recentOrders.map((order) => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      student: order.user,
      course: order.items[0]?.title ?? null,
      amount: order.amount,
      status: order.paymentStatus,
      createdAt: order.createdAt,
    })),
  };
};
