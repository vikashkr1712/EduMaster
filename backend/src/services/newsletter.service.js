import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import { ApiError } from '../utils/ApiError.js';

export const subscribe = async ({ email }) => {
  const existing = await NewsletterSubscriber.findOne({ email });

  if (existing) {
    if (existing.isSubscribed) {
      throw new ApiError(409, 'Email is already subscribed');
    }

    existing.isSubscribed = true;
    existing.subscribedAt = new Date();
    existing.unsubscribedAt = undefined;
    await existing.save();
    return existing;
  }

  return NewsletterSubscriber.create({ email });
};

export const unsubscribe = async ({ email }) => {
  const subscriber = await NewsletterSubscriber.findOne({ email });

  if (!subscriber || !subscriber.isSubscribed) {
    throw new ApiError(404, 'Email is not subscribed');
  }

  subscriber.isSubscribed = false;
  subscriber.unsubscribedAt = new Date();
  await subscriber.save();
  return subscriber;
};
