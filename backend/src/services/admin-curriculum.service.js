import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import Assignment from '../models/Assignment.js';
import Course from '../models/Course.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import Discussion from '../models/Discussion.js';
import Quiz from '../models/Quiz.js';
import StudentNote from '../models/StudentNote.js';
import { ApiError } from '../utils/ApiError.js';

const findCourse = async (courseId) => {
  if (!mongoose.isValidObjectId(courseId)) throw new ApiError(404, 'Course not found');
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, 'Course not found');
  return course;
};

const findModule = (course, moduleId) => {
  const courseModule = course.modules.find((item) => item.moduleId === moduleId);
  if (!courseModule) throw new ApiError(404, 'Module not found');
  return courseModule;
};

const findLesson = (courseModule, lessonId) => {
  const lesson = courseModule.lessons.find((item) => item.lessonId === lessonId);
  if (!lesson) throw new ApiError(404, 'Lesson not found');
  return lesson;
};

const createStableId = (prefix) => `${prefix}-${randomUUID()}`;

const normalizeYouTubeVideoId = (value) => {
  const input = String(value ?? '').trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(input)) return input;

  let parsed;
  try {
    parsed = new URL(input);
  } catch {
    throw new ApiError(400, 'Enter a valid YouTube URL or 11-character video ID');
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
  let videoId = '';
  if (host === 'youtu.be') videoId = parsed.pathname.split('/').filter(Boolean)[0] || '';
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    videoId = parsed.searchParams.get('v') || '';
    if (!videoId) {
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (['embed', 'shorts', 'live'].includes(parts[0])) videoId = parts[1] || '';
    }
  }

  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
    throw new ApiError(400, 'Enter a valid YouTube URL or 11-character video ID');
  }
  return videoId;
};

const serializeCurriculum = (course) => ({
  course: {
    _id: course._id,
    title: course.title,
    slug: course.slug,
    isPublished: course.isPublished,
    updatedAt: course.updatedAt,
  },
  modules: course.modules,
  summary: {
    modules: course.modules.length,
    lessons: course.modules.reduce((total, courseModule) => total + courseModule.lessons.length, 0),
  },
});

const normalizeResources = (resources = [], existingResources = []) => {
  const existingIds = new Set(existingResources.map((resource) => resource.resourceId));
  const used = new Set();
  return resources.map((resource) => {
    const requestedId = String(resource.resourceId ?? '').trim();
    const resourceId = requestedId && existingIds.has(requestedId)
      ? requestedId
      : createStableId('resource');
    if (used.has(resourceId)) throw new ApiError(400, 'Resource IDs must be unique');
    used.add(resourceId);
    return {
      resourceId,
      title: resource.title,
      type: resource.type,
      url: resource.url,
      size: resource.size || undefined,
    };
  });
};

const saveCurriculum = async (course) => {
  course.markModified('modules');
  await course.save();
};

const hasLessonReferences = async (courseId, lessonIds) => {
  if (lessonIds.length === 0) return false;
  const enrollmentPaths = [
    'currentLesson',
    'completedLessons',
    'bookmarks',
    'quizReadyLessons',
    'watchTime.lessonId',
    'notes.lessonId',
  ];
  const enrollmentFilter = {
    course: courseId,
    $or: enrollmentPaths.map((path) => ({ [path]: { $in: lessonIds } })),
  };
  const relatedFilter = { course: courseId, lessonId: { $in: lessonIds } };
  const references = await Promise.all([
    CourseEnrollment.exists(enrollmentFilter),
    Quiz.exists(relatedFilter),
    Assignment.exists(relatedFilter),
    Discussion.exists(relatedFilter),
    StudentNote.exists(relatedFilter),
  ]);
  return references.some(Boolean);
};

export const getCurriculum = async (courseId) => serializeCurriculum(await findCourse(courseId));

export const createModule = async (courseId, data) => {
  const course = await findCourse(courseId);
  const courseModule = { moduleId: createStableId('module'), title: data.title, lessons: [] };
  course.modules.push(courseModule);
  await saveCurriculum(course);
  return { module: course.modules.at(-1), curriculum: serializeCurriculum(course) };
};

export const updateModule = async (courseId, moduleId, data) => {
  const course = await findCourse(courseId);
  const courseModule = findModule(course, moduleId);
  courseModule.title = data.title;
  await saveCurriculum(course);
  return { module: courseModule, curriculum: serializeCurriculum(course) };
};

export const deleteModule = async (courseId, moduleId) => {
  const course = await findCourse(courseId);
  const courseModule = findModule(course, moduleId);
  const lessonIds = courseModule.lessons.map((lesson) => lesson.lessonId);
  const directEnrollmentReference = await CourseEnrollment.exists({
    course: course._id,
    $or: [{ currentModule: moduleId }, { completedModules: moduleId }],
  });
  const authoredReference = await Promise.all([
    Quiz.exists({ course: course._id, moduleId }),
    Assignment.exists({ course: course._id, moduleId }),
  ]);
  if (directEnrollmentReference || authoredReference.some(Boolean) || await hasLessonReferences(course._id, lessonIds)) {
    throw new ApiError(409, 'This module cannot be deleted because learner progress or linked learning records reference it.');
  }
  course.modules = course.modules.filter((item) => item.moduleId !== moduleId);
  await saveCurriculum(course);
  return { moduleId, curriculum: serializeCurriculum(course) };
};

export const reorderModules = async (courseId, ids) => {
  const course = await findCourse(courseId);
  const currentIds = course.modules.map((courseModule) => courseModule.moduleId);
  if (ids.length !== currentIds.length || new Set(ids).size !== ids.length || ids.some((id) => !currentIds.includes(id))) {
    throw new ApiError(400, 'Module order must contain every module ID exactly once');
  }
  const byId = new Map(course.modules.map((courseModule) => [courseModule.moduleId, courseModule]));
  course.modules = ids.map((id) => byId.get(id));
  await saveCurriculum(course);
  return serializeCurriculum(course);
};

export const createLesson = async (courseId, moduleId, data) => {
  const course = await findCourse(courseId);
  const courseModule = findModule(course, moduleId);
  const lesson = {
    lessonId: createStableId('lesson'),
    title: data.title,
    duration: data.duration,
    videoId: normalizeYouTubeVideoId(data.videoId),
    videoProvider: data.videoProvider || 'YouTube',
    publishedAt: new Date(),
    resources: normalizeResources(data.resources),
  };
  courseModule.lessons.push(lesson);
  await saveCurriculum(course);
  return { lesson: courseModule.lessons.at(-1), curriculum: serializeCurriculum(course) };
};

export const updateLesson = async (courseId, moduleId, lessonId, data) => {
  const course = await findCourse(courseId);
  const courseModule = findModule(course, moduleId);
  const lesson = findLesson(courseModule, lessonId);
  if (data.title !== undefined) lesson.title = data.title;
  if (data.duration !== undefined) lesson.duration = data.duration;
  if (data.videoId !== undefined) lesson.videoId = normalizeYouTubeVideoId(data.videoId);
  if (data.videoProvider !== undefined) lesson.videoProvider = data.videoProvider || 'YouTube';
  if (data.resources !== undefined) lesson.resources = normalizeResources(data.resources, lesson.resources);
  await saveCurriculum(course);
  return { lesson, curriculum: serializeCurriculum(course) };
};

export const deleteLesson = async (courseId, moduleId, lessonId) => {
  const course = await findCourse(courseId);
  const courseModule = findModule(course, moduleId);
  findLesson(courseModule, lessonId);
  if (await hasLessonReferences(course._id, [lessonId])) {
    throw new ApiError(409, 'This lesson cannot be deleted because learner progress or linked learning records reference it.');
  }
  courseModule.lessons = courseModule.lessons.filter((lesson) => lesson.lessonId !== lessonId);
  await saveCurriculum(course);
  return { lessonId, curriculum: serializeCurriculum(course) };
};

export const reorderLessons = async (courseId, moduleId, ids) => {
  const course = await findCourse(courseId);
  const courseModule = findModule(course, moduleId);
  const currentIds = courseModule.lessons.map((lesson) => lesson.lessonId);
  if (ids.length !== currentIds.length || new Set(ids).size !== ids.length || ids.some((id) => !currentIds.includes(id))) {
    throw new ApiError(400, 'Lesson order must contain every lesson ID exactly once');
  }
  const byId = new Map(courseModule.lessons.map((lesson) => [lesson.lessonId, lesson]));
  courseModule.lessons = ids.map((id) => byId.get(id));
  await saveCurriculum(course);
  return serializeCurriculum(course);
};
