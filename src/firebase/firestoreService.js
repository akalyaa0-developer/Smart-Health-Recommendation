/**
 * Firestore Database Service for IntelWell
 * 
 * Supports both Cloud Firestore collections and local storage persistence fallback.
 * Isolates data per user ID with secure schema modeling.
 */

import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from './config';

const PREFIX = 'intelwell_db';

// Helper for local storage key
const getLocalKey = (coll, uid) => `${PREFIX}_${coll}_${uid}`;

export async function getUserProfile(userId) {
  if (!userId) return null;

  if (isFirebaseConfigured && db) {
    // Defense-in-depth: only query Firestore if caller matches active session
    if (auth?.currentUser && auth.currentUser.uid !== userId) {
      console.warn('IntelWell Security: Blocked cross-user profile read attempt.');
      return null;
    }

    try {
      const docRef = doc(db, 'healthProfiles', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
    } catch (e) {
      console.warn('Firestore fetch error, reading local fallback', e);
    }
  }

  // Local lookup
  const localKey = getLocalKey('profile', userId);
  const stored = localStorage.getItem(localKey);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }

  return null;
}

export async function saveUserProfile(userId, profileData) {
  if (!userId) {
    throw new Error('User ID is required to save health profile.');
  }

  // Defense-in-depth: only permit saving profile for active authenticated user
  if (isFirebaseConfigured && auth?.currentUser && auth.currentUser.uid !== userId) {
    throw new Error('Unauthorized: Cannot modify profile data for another user.');
  }

  const merged = {
    ...profileData,
    updatedAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'healthProfiles', userId);
      await setDoc(docRef, { ...merged, serverUpdatedAt: serverTimestamp() }, { merge: true });
    } catch (e) {
      console.warn('Firestore save error, saving locally', e);
    }
  }

  // Always update local cache for instant UI reactivity
  localStorage.setItem(getLocalKey('profile', userId), JSON.stringify(merged));
  return merged;
}

export async function getDailyAssessments(userId, daysLimit = 30) {
  if (!userId) return [];

  if (isFirebaseConfigured && db) {
    if (auth?.currentUser && auth.currentUser.uid !== userId) {
      console.warn('IntelWell Security: Blocked cross-user assessment read attempt.');
      return [];
    }

    try {
      const collRef = collection(db, 'dailyAssessments');
      const q = query(
        collRef, 
        where('userId', '==', userId), 
        orderBy('date', 'desc'), 
        limit(daysLimit)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('Firestore assessment fetch error, reading local', e);
    }
  }

  const localKey = getLocalKey('assessments', userId);
  const stored = localStorage.getItem(localKey);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
  }

  return [];
}

export async function saveDailyAssessment(userId, assessmentData) {
  if (!userId) {
    throw new Error('User ID is required to record assessment.');
  }

  if (isFirebaseConfigured && auth?.currentUser && auth.currentUser.uid !== userId) {
    throw new Error('Unauthorized: Cannot submit assessment for another user.');
  }

  const newRecord = {
    ...assessmentData,
    userId,
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && db) {
    try {
      const collRef = collection(db, 'dailyAssessments');
      await addDoc(collRef, { ...newRecord, serverCreatedAt: serverTimestamp() });
    } catch (e) {
      console.warn('Firestore save error, saving locally', e);
    }
  }

  const localKey = getLocalKey('assessments', userId);
  const existing = await getDailyAssessments(userId);
  // Replace today's assessment if already exists for same date, or prepend
  const filtered = existing.filter(a => a.date !== assessmentData.date);
  const updated = [newRecord, ...filtered];
  localStorage.setItem(localKey, JSON.stringify(updated));
  return updated;
}

