import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { 
  getUserProfile, 
  saveUserProfile, 
  getDailyAssessments, 
  saveDailyAssessment 
} from '../src/firebase/firestoreService';
import { signUpUser, signInUser } from '../src/firebase/authService';

const storageMap = new Map();
if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = {
    getItem: (k) => storageMap.get(k) || null,
    setItem: (k, v) => storageMap.set(k, String(v)),
    removeItem: (k) => storageMap.delete(k),
    clear: () => storageMap.clear()
  };
}

describe('Security & Data Isolation Tests', () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  it('rejects unauthenticated/empty userId on profile retrieval and save', async () => {
    const profile = await getUserProfile(null);
    expect(profile).toBeNull();

    await expect(saveUserProfile(null, { name: 'Test' })).rejects.toThrow(
      'User ID is required'
    );
  });

  it('rejects unauthenticated/empty userId on assessment retrieval and submission', async () => {
    const assessments = await getDailyAssessments(null);
    expect(assessments).toEqual([]);

    await expect(saveDailyAssessment(null, { energyLevel: 8 })).rejects.toThrow(
      'User ID is required'
    );
  });

  it('validates email and password inputs during authentication', async () => {
    await expect(signUpUser('', 'pass123')).rejects.toThrow('Valid email and password are required.');
    await expect(signUpUser('user@example.com', '')).rejects.toThrow('Valid email and password are required.');
    await expect(signInUser('', 'pass123')).rejects.toThrow('Valid email and password are required.');
    await expect(signInUser('user@example.com', '')).rejects.toThrow('Valid email and password are required.');
  });

  it('verifies firestore.rules prevents IDOR, requires document ownership, and does not allow insecure write rules', () => {
    const rulesPath = path.resolve(__dirname, '../firestore.rules');
    const rulesContent = fs.readFileSync(rulesPath, 'utf8');

    // Verify security helper functions exist
    expect(rulesContent).toContain('function isAuthenticated()');
    expect(rulesContent).toContain('function isOwner(userId)');
    expect(rulesContent).toContain('function isDocOwner()');
    expect(rulesContent).toContain('function isCreatingForSelf()');
    expect(rulesContent).toContain('function isUpdatingForSelf()');

    // Verify users collection isolation
    expect(rulesContent).toContain('match /users/{userId}');
    expect(rulesContent).toMatch(/match \/users\/\{userId\}\s*\{\s*allow read, write: if isOwner\(userId\);/);

    // Verify update requires both existing ownership and incoming consistency (prevents IDOR)
    expect(rulesContent).toContain('allow update: if isUpdatingForSelf();');

    // Verify insecure pattern is eliminated
    expect(rulesContent).not.toContain('allow read, write: if request.auth != null && request.resource.data.userId == request.auth.uid;');

    // Verify no insecure public access exists
    expect(rulesContent).not.toMatch(/allow [^:]+:\s*if\s+true/);

    // Verify default deny
    expect(rulesContent).toContain('match /{document=**}');
    expect(rulesContent).toContain('allow read, write: if false;');
  });

  it('performs static validation of firestore.rules syntax and security guarantees', () => {
    const rulesPath = path.resolve(__dirname, '../firestore.rules');
    const rulesContent = fs.readFileSync(rulesPath, 'utf8');

    // 1. Check rules version and service block
    expect(rulesContent).toMatch(/^rules_version = '2';/);
    expect(rulesContent).toContain('service cloud.firestore');
    expect(rulesContent).toContain('match /databases/{database}/documents');

    // 2. Check balanced braces
    let braceCount = 0;
    for (const char of rulesContent) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      expect(braceCount).toBeGreaterThanOrEqual(0);
    }
    expect(braceCount).toBe(0);

    // 3. Verify all collections explicitly check authentication or owner
    const expectedCollections = [
      'users',
      'healthProfiles',
      'dailyAssessments',
      'recommendationFeedback',
      'savedMeals',
      'groceryLists',
      'trustedContacts',
      'notifications'
    ];

    for (const coll of expectedCollections) {
      expect(rulesContent).toContain(`match /${coll}/`);
    }

    // 4. Verify no open or wild card allow rule exists anywhere
    const lines = rulesContent.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('allow') && !trimmed.includes('if false')) {
        expect(trimmed).toMatch(/if (isOwner|isDocOwner|isCreatingForSelf|isUpdatingForSelf|isAuthenticated)/);
        expect(trimmed).not.toContain('true');
      }
    }
  });
});
