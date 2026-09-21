/**
 * Firebase Configuration for IntelWell
 * 
 * Secure configuration loading from environment variables.
 * Features a seamless dual-mode architecture:
 * - If Firebase environment variables are provided, uses real Firebase Authentication & Cloud Firestore.
 * - If running locally without credentials or in Demo Mode, gracefully falls back to local persistence
 *   so the application can be evaluated immediately without errors.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  ...(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    ? { measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID }
    : {})
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes('YOUR_')
);

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app, "default");
    console.info('IntelWell: Connected to Firebase Cloud services.');
  } catch (error) {
    console.warn('IntelWell: Firebase initialization error, activating local demo mode.', error);
  }
} else {
  console.info('IntelWell: Running in local evaluation/demo mode (Firebase credentials not detected).');
}

export { app, auth, db };
