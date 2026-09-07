import User from '../models/User.js';
import Course from '../models/Course.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import Order from '../models/Order.js';
import Certificate from '../models/Certificate.js';
import { avatarReferenceExpression } from '../utils/avatar.js';

const RECENT_LIMIT = 10;

export const buildRevenueOrderMatch = (createdAt) => ({
  paymentStatus: 'completed',
  paymentMethod: { $ne: 'free' },
  amount: { $gt: 0 },
  ...(createdAt ? { createdAt } : {}),
});

export const getDashboard = async () => {
  const [
    userResult,
    courses,
    enrollments,
    orderResult,
    certificates,
  ] = await Promise.all([
    User.aggregate([
      { $project: { name: 1, email: 1, role: 1, createdAt: 1, avatar: avatarReferenceExpression() } },
      {
        $facet: {
          count: [{ $count: 'value' }],
          recent: [
            { $sort: { createdAt: -1, _id: -1 } },
            { $limit: RECENT_LIMIT },
            { $project: { name: 1, email: 1, role: 1, createdAt: 1, avatar: 1 } },
          ],
        },
      },
    ]),
    Course.countDocuments(),
    CourseEnrollment.countDocuments(),
    Order.aggregate([{
      $facet: {
        summary: [{
          $group: {
            _id: null,
            total: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$paymentStatus', 'completed'] },
                      { $ne: ['$paymentMethod', 'free'] },
                      { $gt: ['$amount', 0] },
                    ],
                  },
                  '$amount',
                  0,
                ],
              },
            },
          },
        }],
        recent: [
          { $sort: { createdAt: -1, _id: -1 } },
          { $limit: RECENT_LIMIT },
          {
            $lookup: {
              from: User.collection.name,
              localField: 'user',
              foreignField: '_id',
              pipeline: [{ $project: { name: 1, email: 1, avatar: avatarReferenceExpression() } }],
              as: 'student',
            },
          },
          { $unwind: { path: '$student', preserveNullAndEmptyArrays: true } },
          {
            $project: {
              orderNumber: 1,
              student: 1,
              course: { $arrayElemAt: ['$items.title', 0] },
              amount: 1,
              status: '$paymentStatus',
              createdAt: 1,
            },
          },
        ],
      },
    }]),
    Certificate.countDocuments(),
  ]);

  const users = userResult[0]?.count[0]?.value ?? 0;
  const recentUsers = userResult[0]?.recent ?? [];
  const orderSummary = orderResult[0]?.summary[0] ?? { total: 0, revenue: 0 };
  const recentOrders = orderResult[0]?.recent ?? [];

  return {
    stats: {
      users,
      courses,
      enrollments,
      orders: orderSummary.total,
      revenue: orderSummary.revenue,
      certificates,
    },
    recentUsers,
    recentOrders,
  };
};
