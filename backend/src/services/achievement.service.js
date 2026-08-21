import Achievement from '../models/Achievement.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

const ACHIEVEMENTS = {
  FIRST_COURSE: {
    title: 'First Course Completed',
    description: 'Completed your first EduMaster course.',
    badge: '🏆',
  },
  CERTIFIED_LEARNER: {
    title: 'Certified Learner',
    description: 'Earned your first verified EduMaster certificate.',
    badge: '🎓',
  },
  TOP_PERFORMER: {
    title: 'Top Performer',
    description: 'Completed a course with every lesson finished.',
    badge: '⭐',
  },
  SEVEN_DAY_STREAK: {
    title: '7 Day Learning Streak',
    description: 'Learned on seven consecutive days.',
    badge: '🔥',
  },
  FIVE_COURSES: {
    title: '5 Courses Completed',
    description: 'Completed five EduMaster courses.',
    badge: '📚',
  },
};

const hasSevenDayStreak = (dates = []) => {
  const uniqueDays = [...new Set(dates.map((value) => new Date(value).toISOString().slice(0, 10)))].sort();
  let streak = 1;
  for (let index = 1; index < uniqueDays.length; index += 1) {
    const previous = new Date(`${uniqueDays[index - 1]}T00:00:00Z`);
    const current = new Date(`${uniqueDays[index]}T00:00:00Z`);
    streak = (current - previous) / 86400000 === 1 ? streak + 1 : 1;
    if (streak >= 7) return true;
  }
  return uniqueDays.length >= 7 && streak >= 7;
};

const unlock = async (userId, key, courseId = null, session = null) => {
  const definition = ACHIEVEMENTS[key];
  const achievement = await Achievement.findOneAndUpdate(
    { user: userId, key },
    {
      $setOnInsert: {
        title: definition.title,
        description: definition.description,
        badge: definition.badge,
        unlockedAt: new Date(),
        course: courseId,
      },
    },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true, session }
  );
  return achievement;
};

export const unlockCompletionAchievements = async (userId, courseId, session = null) => {
  const completedCourses = await CourseEnrollment.countDocuments({ user: userId, percentageCompleted: 100 }).session(session);
  const user = await User.findById(userId).select('learningActivityDates').session(session);
  if (!user) throw new ApiError(404, 'User not found');

  const keys = ['FIRST_COURSE', 'CERTIFIED_LEARNER', 'TOP_PERFORMER'];
  if (completedCourses >= 5) keys.push('FIVE_COURSES');
  if (hasSevenDayStreak(user.learningActivityDates)) keys.push('SEVEN_DAY_STREAK');

  const achievements = [];
  for (const key of keys) achievements.push(await unlock(userId, key, courseId, session));
  return achievements;
};

export const getAchievements = async (userId) => {
  const achievements = await Achievement.find({ user: userId })
    .sort({ unlockedAt: -1 })
    .populate('course', 'title category imageType')
    .lean();
  return achievements;
};
