import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import Activity from '../models/Activity.js';
import EmailQueue from '../models/EmailQueue.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { buildEmailTemplate } from '../utils/emailTemplates.js';

const safePage = (value) => Math.max(1, Number.parseInt(value, 10) || 1);
const safeLimit = (value) => Math.min(30, Math.max(1, Number.parseInt(value, 10) || 10));

export const createEvent = async ({ userId, notification, activity, email }) => {
  if (!userId) return null;
  try {
    const operations = [];
    if (notification) operations.push(Notification.create({
    user: userId,
    ...notification,
    push: notification.push || {
      enabled: false,
      title: notification.title,
      body: notification.message,
      data: { actionUrl: notification.actionUrl || '' },
    },
    }));
    if (activity) {
      const update = { user: userId, ...activity };
      operations.push(activity.dedupeKey
        ? Activity.findOneAndUpdate(
          { user: userId, dedupeKey: activity.dedupeKey },
          { $setOnInsert: update },
          { upsert: true, returnDocument: 'after' }
        )
        : Activity.create(update));
    }
    if (email) {
      const user = await User.findById(userId).select('email name').lean();
      if (user?.email) {
        const payload = { name: user.name, ...email.payload };
        const content = buildEmailTemplate(email.template, payload);
        operations.push(EmailQueue.create({ user: userId, to: user.email, template: email.template, subject: content.subject, payload: { ...payload, ...content } }));
      }
    }
    return Promise.allSettled(operations);
  } catch (error) {
    // Product actions must not fail because an optional notification could not
    // be recorded. The queue can be replayed by an operations worker later.
    console.error('Notification event could not be recorded:', error.message);
    return [];
  }
};

export const createActivity = (userId, activity) => createEvent({ userId, activity });

export const listNotifications = async (userId, query = {}) => {
  const page = safePage(query.page);
  const limit = safeLimit(query.limit);
  const archived = query.archived === 'true';
  const filter = { user: userId, archived };
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Notification.countDocuments(filter),
    Notification.countDocuments({ user: userId, archived: false, read: false }),
  ]);
  return { notifications, unreadCount, pagination: { page, limit, total, pages: Math.ceil(total / limit), hasMore: page * limit < total } };
};

export const listActivities = async (userId, query = {}) => {
  const page = safePage(query.page);
  const limit = safeLimit(query.limit);
  const [activities, total] = await Promise.all([
    Activity.find({ user: userId }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Activity.countDocuments({ user: userId }),
  ]);
  return { activities, pagination: { page, limit, total, pages: Math.ceil(total / limit), hasMore: page * limit < total } };
};

const ownedNotification = async (userId, id) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(404, 'Notification not found');
  const notification = await Notification.findOne({ _id: id, user: userId });
  if (!notification) throw new ApiError(404, 'Notification not found');
  return notification;
};

export const markRead = async (userId, id) => {
  const notification = await ownedNotification(userId, id);
  if (!notification.read) {
    notification.read = true;
    notification.readAt = new Date();
    await notification.save();
  }
  return notification;
};

export const markAllRead = async (userId) => {
  const result = await Notification.updateMany({ user: userId, archived: false, read: false }, { $set: { read: true, readAt: new Date() } });
  return { updated: result.modifiedCount };
};

export const archive = async (userId, id) => {
  const notification = await ownedNotification(userId, id);
  notification.archived = true;
  await notification.save();
  return notification;
};

export const remove = async (userId, id) => {
  if (!mongoose.isValidObjectId(id)) throw new ApiError(404, 'Notification not found');
  const notification = await Notification.findOneAndDelete({ _id: id, user: userId });
  if (!notification) throw new ApiError(404, 'Notification not found');
  return { id };
};
