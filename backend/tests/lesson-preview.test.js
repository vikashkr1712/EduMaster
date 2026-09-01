import assert from 'node:assert/strict';
import test from 'node:test';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo;
let Course;
let curriculumService;
let normalizeYouTubeVideoId;

test.before(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongo.getUri();
  ({ default: Course } = await import('../src/models/Course.js'));
  curriculumService = await import('../src/services/admin-curriculum.service.js');
  ({ normalizeYouTubeVideoId } = await import('../src/utils/youtube.js'));
  await mongoose.connect(process.env.MONGO_URI);
});

test.after(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});

test.beforeEach(async () => {
  await Course.deleteMany({});
});

test('normalizes full, short, embed, and existing YouTube video IDs', () => {
  const id = 'dQw4w9WgXcQ';
  assert.equal(normalizeYouTubeVideoId(id), id);
  assert.equal(normalizeYouTubeVideoId(`https://www.youtube.com/watch?v=${id}&feature=share`), id);
  assert.equal(normalizeYouTubeVideoId(`https://youtu.be/${id}?si=qa`), id);
  assert.equal(normalizeYouTubeVideoId(`https://youtube.com/embed/${id}`), id);
  assert.throws(() => normalizeYouTubeVideoId('invalid'), /valid YouTube URL/);
});

test('persists lesson thumbnails while preserving normalized student-player video data', async () => {
  const course = await Course.create({
    title: 'Lesson Preview QA', slug: 'lesson-preview-qa', description: 'Temporary lesson preview validation course.',
    category: 'Development', level: 'Beginner', price: 0, instructor: 'QA Instructor', isPublished: true,
    modules: [],
  });
  const moduleResult = await curriculumService.createModule(course._id, { title: 'QA Module' });
  const moduleId = moduleResult.module.moduleId;
  const firstVideoId = 'dQw4w9WgXcQ';
  const created = await curriculumService.createLesson(course._id, moduleId, {
    title: 'QA Lesson', duration: '12:00', videoProvider: 'YouTube',
    videoId: `https://www.youtube.com/watch?v=${firstVideoId}`,
    thumbnail: `https://i.ytimg.com/vi/${firstVideoId}/hqdefault.jpg`, resources: [],
  });
  assert.equal(created.lesson.videoId, firstVideoId);
  assert.equal(created.lesson.thumbnail, `https://i.ytimg.com/vi/${firstVideoId}/hqdefault.jpg`);

  const secondVideoId = 'M7lc1UVf-VE';
  const updated = await curriculumService.updateLesson(course._id, moduleId, created.lesson.lessonId, {
    videoId: `https://youtu.be/${secondVideoId}`,
    thumbnail: '/uploads/course-thumbnails/qa-lesson.webp',
  });
  assert.equal(updated.lesson.videoId, secondVideoId);
  assert.equal(updated.lesson.thumbnail, '/uploads/course-thumbnails/qa-lesson.webp');

  const persisted = await curriculumService.getCurriculum(course._id);
  assert.equal(persisted.modules[0].lessons[0].videoId, secondVideoId);
  assert.equal(persisted.modules[0].lessons[0].thumbnail, '/uploads/course-thumbnails/qa-lesson.webp');

  const cleared = await curriculumService.updateLesson(course._id, moduleId, created.lesson.lessonId, { thumbnail: '' });
  assert.equal(cleared.lesson.thumbnail, undefined);
});
