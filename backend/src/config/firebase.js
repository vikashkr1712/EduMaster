import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { config } from './env.js';
import { ApiError } from '../utils/ApiError.js';

const FIREBASE_APP_NAME = 'edumaster-google-auth';

const getFirebaseApp = () => {
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = config;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new ApiError(503, 'Google sign-in is not configured. Please try another sign-in method.');
  }

  const existingApp = getApps().find((app) => app.name === FIREBASE_APP_NAME);
  if (existingApp) return getApp(FIREBASE_APP_NAME);

  try {
    return initializeApp({
      credential: cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    }, FIREBASE_APP_NAME);
  } catch {
    throw new ApiError(503, 'Google sign-in is temporarily unavailable. Please try another sign-in method.');
  }
};

export const verifyFirebaseIdToken = async (idToken) => {
  let firebaseApp;
  try {
    firebaseApp = getFirebaseApp();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(503, 'Google sign-in is temporarily unavailable. Please try another sign-in method.');
  }

  try {
    return await getAuth(firebaseApp).verifyIdToken(idToken, true);
  } catch {
    throw new ApiError(401, 'Google sign-in could not be verified. Please sign in again.');
  }
};

