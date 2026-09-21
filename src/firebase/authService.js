/**
 * Authentication Service for IntelWell
 * 
 * Supports production Firebase Authentication with local persistence fallback.
 */

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './config';

const LOCAL_USER_KEY = 'intelwell_active_user';

export async function signUpUser(email, password, displayName) {
  const cleanEmail = email?.trim().toLowerCase();
  if (!cleanEmail || !password) {
    throw new Error('Valid email and password are required.');
  }

  if (isFirebaseConfigured) {
    if (!auth) {
      throw new Error('Firebase Authentication is not available. Check configuration.');
    }
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName: displayName.trim() });
    }
    return userCredential.user;
  }

  // Local fallback mode only when Firebase credentials are not provided
  const localUser = {
    uid: `user-${Date.now()}`,
    email: cleanEmail,
    displayName: displayName?.trim() || cleanEmail.split('@')[0]
  };
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
  return localUser;
}

export async function signInUser(email, password) {
  const cleanEmail = email?.trim().toLowerCase();
  if (!cleanEmail || !password) {
    throw new Error('Valid email and password are required.');
  }

  if (isFirebaseConfigured) {
    if (!auth) {
      throw new Error('Firebase Authentication is not available. Check configuration.');
    }
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    return userCredential.user;
  }

  // Local evaluation mode
  const localUser = {
    uid: `user-${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
    email: cleanEmail,
    displayName: cleanEmail.split('@')[0]
  };
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
  return localUser;
}

export async function signOutUser() {
  if (isFirebaseConfigured) {
    if (auth) {
      await signOut(auth);
    }
  }
  localStorage.removeItem(LOCAL_USER_KEY);
}

export async function resetUserPassword(email) {
  const cleanEmail = email?.trim().toLowerCase();
  if (!cleanEmail) {
    throw new Error('Email address is required.');
  }

  if (isFirebaseConfigured) {
    if (!auth) {
      throw new Error('Firebase Authentication is not available. Check configuration.');
    }
    await sendPasswordResetEmail(auth, cleanEmail);
    return true;
  }
  // Local simulated password reset
  return true;
}

export function subscribeToAuthChanges(callback) {
  if (isFirebaseConfigured) {
    if (auth) {
      return onAuthStateChanged(auth, callback);
    }
    callback(null);
    return () => {};
  }

  // Local persistence: load previously signed-in user or null
  const raw = localStorage.getItem(LOCAL_USER_KEY);
  if (raw) {
    try {
      callback(JSON.parse(raw));
    } catch {
      callback(null);
    }
  } else {
    // Unauthenticated by default
    callback(null);
  }

  return () => {};
}

