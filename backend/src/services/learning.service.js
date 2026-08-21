import mongoose from 'mongoose';
import Course from '../models/Course.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { buildCourseCurriculum } from '../utils/courseCurriculum.js';
import { generateCertificate } from './certificate.service.js';
import { getLessonQuizMap } from './quiz.service.js';

const findCourse = async (value) => {
  const id = String(value ?? '').trim();
  let course = mongoose.isValidObjectId(id) ? await Course.findById(id) : null;
  if (!course && Number.isInteger(Number(id))) course = await Course.findOne({ sourceId: Number(id) });
  if (!course || !course.isPublished) throw new ApiError(404, 'Course not found');

  if (!course.modules?.length) {
    course.modules = buildCourseCurriculum(course);
    await course.save();
  }
  return course;
};

const flattenLessons = (course) => course.modules.flatMap((module) =>
  module.lessons.map((lesson) => ({ module, lesson }))
);

const getLesson = (course, lessonId) => {
  const entry = flattenLessons(course).find(({ lesson }) => lesson.lessonId === lessonId);
  if (!entry) throw new ApiError(404, 'Lesson not found');
  return entry;
};

const getContext = async (userId, courseId) => {
  const course = await findCourse(courseId);
  const enrollment = await CourseEnrollment.findOne({ user: userId, course: course._id });
  if (!enrollment) throw new ApiError(403, 'You must enroll in this course before learning');
  return { course, enrollment };
};

const syncUserStats = async (userId) => {
  const [summary] = await CourseEnrollment.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(String(userId)) } },
    {
      $project: {
        percentageCompleted: 1,
        watchedSeconds: { $sum: '$watchTime.seconds' },
      },
    },
    {
      $group: {
        _id: null,
        averageProgress: { $avg: '$percentageCompleted' },
        watchedSeconds: { $sum: '$watchedSeconds' },
      },
    },
  ]);

  await User.findByIdAndUpdate(userId, {
    $set: {
      'stats.progress': Math.round(summary?.averageProgress || 0),
      'stats.hoursLearned': Math.round(((summary?.watchedSeconds || 0) / 3600) * 100) / 100,
    },
    $addToSet: {
      learningActivityDates: new Date(new Date().setUTCHours(0, 0, 0, 0)),
    },
  });
};

export const getLearningCourse = async (userId, courseId) => {
  const { course, enrollment } = await getContext(userId, courseId);
  const lessons = flattenLessons(course);
  if (!lessons.length) throw new ApiError(404, 'This course has no lessons yet');

  if (!enrollment.currentLesson || !lessons.some(({ lesson }) => lesson.lessonId === enrollment.currentLesson)) {
    enrollment.currentLesson = lessons[0].lesson.lessonId;
    enrollment.currentModule = lessons[0].module.moduleId;
    await enrollment.save();
  }

  const quizzes = await getLessonQuizMap(userId, course);
  return { course, enrollment, quizzes };
};

export const saveCurrentLesson = async (userId, { courseId, lessonId }) => {
  const { course, enrollment } = await getContext(userId, courseId);
  const { module } = getLesson(course, lessonId);
  const watchedAt = new Date();
  enrollment.currentLesson = lessonId;
  enrollment.currentModule = module.moduleId;
  enrollment.lastWatched = watchedAt;
  enrollment.lastWatchedAt = watchedAt;
  await enrollment.save();
  return enrollment;
};

export const saveProgress = async (userId, { courseId, lessonId, watchTimeSeconds, completed }) => {
  const { course, enrollment } = await getContext(userId, courseId);
  const { module } = getLesson(course, lessonId);
  const watchedAt = new Date();

  enrollment.currentLesson = lessonId;
  enrollment.currentModule = module.moduleId;
  enrollment.lastWatched = watchedAt;
  enrollment.lastWatchedAt = watchedAt;

  if (Number.isFinite(watchTimeSeconds)) {
    const watchEntry = enrollment.watchTime.find((entry) => entry.lessonId === lessonId);
    if (watchEntry) watchEntry.seconds = Math.max(watchEntry.seconds, watchTimeSeconds);
    else enrollment.watchTime.push({ lessonId, seconds: watchTimeSeconds });
  }

  let requiredQuiz = null;
  if (completed) {
    const quizMap = await getLessonQuizMap(userId, course);
    requiredQuiz = quizMap[lessonId] || null;
    if (requiredQuiz && !requiredQuiz.passed) {
      if (!enrollment.quizReadyLessons.includes(lessonId)) enrollment.quizReadyLessons.push(lessonId);
    } else if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }
  }

  const completedSet = new Set(enrollment.completedLessons);
  enrollment.completedModules = course.modules
    .filter((courseModule) => courseModule.lessons.length > 0
      && courseModule.lessons.every((lesson) => completedSet.has(lesson.lessonId)))
    .map((courseModule) => courseModule.moduleId);

  const lessonCount = flattenLessons(course).length;
  const percentage = lessonCount > 0 ? Math.round((completedSet.size / lessonCount) * 100) : 0;
  enrollment.percentageCompleted = percentage;
  enrollment.progress = percentage;
  if (percentage === 100 && !enrollment.completedAt) enrollment.completedAt = watchedAt;
  await enrollment.save();
  await syncUserStats(userId);
  const completion = percentage === 100
    ? await generateCertificate(userId, course._id)
    : null;
  return {
    enrollment,
    certificate: completion?.certificate || null,
    certificateGenerated: Boolean(completion?.generated),
    achievements: completion?.achievements || [],
    stats: completion?.stats || null,
    quizRequired: Boolean(requiredQuiz && !requiredQuiz.passed),
    quiz: requiredQuiz,
  };
};

export const createNote = async (userId, { courseId, lessonId, content }) => {
  const { course, enrollment } = await getContext(userId, courseId);
  getLesson(course, lessonId);
  enrollment.notes.push({ lessonId, content });
  await enrollment.save();
  return enrollment.notes.at(-1);
};

export const updateNote = async (userId, noteId, { courseId, content }) => {
  const { enrollment } = await getContext(userId, courseId);
  const note = enrollment.notes.id(noteId);
  if (!note) throw new ApiError(404, 'Note not found');
  note.content = content;
  note.updatedAt = new Date();
  await enrollment.save();
  return note;
};

export const deleteNote = async (userId, noteId, courseId) => {
  const { enrollment } = await getContext(userId, courseId);
  const note = enrollment.notes.id(noteId);
  if (!note) throw new ApiError(404, 'Note not found');
  note.deleteOne();
  await enrollment.save();
  return { noteId };
};

export const setBookmark = async (userId, { courseId, lessonId, bookmarked }) => {
  const { course, enrollment } = await getContext(userId, courseId);
  getLesson(course, lessonId);
  const alreadyBookmarked = enrollment.bookmarks.includes(lessonId);
  const nextBookmarked = bookmarked ?? !alreadyBookmarked;
  if (nextBookmarked && !alreadyBookmarked) enrollment.bookmarks.push(lessonId);
  if (!nextBookmarked && alreadyBookmarked) {
    enrollment.bookmarks = enrollment.bookmarks.filter((id) => id !== lessonId);
  }
  await enrollment.save();
  return { lessonId, bookmarked: nextBookmarked, bookmarks: enrollment.bookmarks };
};

export const trackResourceDownload = async (userId, { courseId, lessonId, resourceId }) => {
  const { course } = await getContext(userId, courseId);
  const { lesson } = getLesson(course, lessonId);
  const resource = lesson.resources.find((item) => item.resourceId === resourceId);
  if (!resource) throw new ApiError(404, 'Resource not found');
  const user = await User.findByIdAndUpdate(userId, { $inc: { 'stats.downloads': 1 } }, { returnDocument: 'after' }).select('stats').lean();
  return { resource, stats: user.stats };
};
