import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../src/models/User.js';
import { login, loginWithGoogleIdentity, register, restoreSession } from '../src/services/auth.service.js';

let mongoServer;

const googleIdentity = (overrides = {}) => ({
  uid: 'google-uid-1',
  email: 'student@example.com',
  name: 'Google Student',
  picture: 'https://example.com/avatar.png',
  email_verified: true,
  firebase: { sign_in_provider: 'google.com' },
  ...overrides,
});

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  await User.syncIndexes();
});

beforeEach(async () => {
  await Promise.all(Object.values(mongoose.connection.collections).map((collection) => collection.deleteMany({})));
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test('creates a new Google account as an active student and issues EduMaster tokens', async () => {
  const result = await loginWithGoogleIdentity(googleIdentity());
  const storedUser = await User.findById(result.user._id).select('+password');

  assert.equal(storedUser.role, 'user');
  assert.equal(storedUser.isActive, true);
  assert.equal(storedUser.authProvider, 'google');
  assert.equal(storedUser.firebaseUid, 'google-uid-1');
  assert.equal(storedUser.password, undefined);
  assert.equal(typeof result.accessToken, 'string');
  assert.equal(typeof result.refreshToken, 'string');
});

test('reuses the same Google user without creating a duplicate', async () => {
  const first = await loginWithGoogleIdentity(googleIdentity());
  const second = await loginWithGoogleIdentity(googleIdentity());

  assert.equal(first.user._id.toString(), second.user._id.toString());
  assert.equal(await User.countDocuments({ email: 'student@example.com' }), 1);
});

test('links an existing password student by email and preserves their data and password login', async () => {
  const courseId = new mongoose.Types.ObjectId();
  const existing = await User.create({
    name: 'Existing Student',
    email: 'student@example.com',
    password: 'Password123',
    avatar: 'https://example.com/original.png',
    wishlist: [courseId],
    enrolledCourses: [courseId],
    stats: { enrolledCourses: 1, progress: 42 },
  });

  const googleResult = await loginWithGoogleIdentity(googleIdentity({ name: 'Different Name' }));
  const storedUser = await User.findById(existing._id);
  const passwordResult = await login({ email: 'student@example.com', password: 'Password123' });

  assert.equal(googleResult.user._id.toString(), existing._id.toString());
  assert.equal(passwordResult.user._id.toString(), existing._id.toString());
  assert.equal(storedUser.name, 'Existing Student');
  assert.equal(storedUser.avatar, 'https://example.com/original.png');
  assert.equal(storedUser.role, 'user');
  assert.equal(storedUser.authProvider, 'local');
  assert.equal(storedUser.wishlist[0].toString(), courseId.toString());
  assert.equal(storedUser.enrolledCourses[0].toString(), courseId.toString());
  assert.equal(storedUser.stats.progress, 42);
});

test('preserves an existing admin role when linking Google by email', async () => {
  const admin = await User.create({
    name: 'Existing Admin',
    email: 'admin@example.com',
    password: 'Password123',
    role: 'admin',
  });

  const result = await loginWithGoogleIdentity(googleIdentity({ uid: 'admin-google-uid', email: 'ADMIN@example.com' }));

  assert.equal(result.user._id.toString(), admin._id.toString());
  assert.equal(result.user.role, 'admin');
});

test('denies an inactive existing user', async () => {
  await User.create({
    name: 'Inactive Student',
    email: 'student@example.com',
    password: 'Password123',
    isActive: false,
  });

  await assert.rejects(
    loginWithGoogleIdentity(googleIdentity()),
    (error) => error.statusCode === 403 && error.message === 'Account is inactive'
  );
});

test('denies an email already linked to a different Google identity', async () => {
  await User.create({
    name: 'Linked Student',
    email: 'student@example.com',
    authProvider: 'google',
    firebaseUid: 'different-google-uid',
  });

  await assert.rejects(
    loginWithGoogleIdentity(googleIdentity()),
    (error) => error.statusCode === 409
  );
  assert.equal(await User.countDocuments({ email: 'student@example.com' }), 1);
});

test('rejects unverified email and non-Google Firebase providers', async () => {
  await assert.rejects(
    loginWithGoogleIdentity(googleIdentity({ email_verified: false })),
    (error) => error.statusCode === 401
  );
  await assert.rejects(
    loginWithGoogleIdentity(googleIdentity({ firebase: { sign_in_provider: 'password' } })),
    (error) => error.statusCode === 401
  );
});

test('preserves email/password signup, login, and EduMaster session restoration', async () => {
  const registered = await register({
    name: 'Password Student',
    email: 'password@example.com',
    password: 'Password123',
  });
  const loggedIn = await login({ email: 'password@example.com', password: 'Password123' });
  const restored = await restoreSession({
    accessToken: loggedIn.accessToken,
    refreshToken: loggedIn.refreshToken,
  });

  assert.equal(registered.user._id.toString(), loggedIn.user._id.toString());
  assert.equal(restored.user._id.toString(), registered.user._id.toString());
  assert.equal(restored.user.role, 'user');
});
