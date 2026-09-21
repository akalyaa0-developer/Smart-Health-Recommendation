import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { isFirebaseConfigured, app, auth, db } from '../src/firebase/config';

describe('Firebase Configuration & Environment Security', () => {
  it('exports core Firebase modules and initializes with the active project', () => {
    expect(typeof isFirebaseConfigured).toBe('boolean');
    expect(isFirebaseConfigured).toBe(true);
    expect(app).not.toBeNull();
    expect(app.options.projectId).toBe('intel-well');
    expect(auth).not.toBeNull();
    expect(db).not.toBeNull();
  });

  it('ensures .gitignore strictly ignores .env and .env.* to prevent credential leaks', () => {
    const gitignorePath = path.resolve(__dirname, '../.gitignore');
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');

    expect(gitignoreContent).toMatch(/^\.env$/m);
    expect(gitignoreContent).toMatch(/^\.env\.\*$/m);
    expect(gitignoreContent).toMatch(/^!\.env\.example$/m);
  });

  it('ensures .env does not expose GEMINI or backend secrets with VITE_ prefix', () => {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      expect(envContent).not.toContain('VITE_GEMINI');
      expect(envContent).not.toContain('VITE_SECRET');
    }
  });

  it('verifies config.js references all expected VITE_FIREBASE_* environment variables', () => {
    const configPath = path.resolve(__dirname, '../src/firebase/config.js');
    const configContent = fs.readFileSync(configPath, 'utf8');

    expect(configContent).toContain('import.meta.env.VITE_FIREBASE_API_KEY');
    expect(configContent).toContain('import.meta.env.VITE_FIREBASE_AUTH_DOMAIN');
    expect(configContent).toContain('import.meta.env.VITE_FIREBASE_PROJECT_ID');
    expect(configContent).toContain('import.meta.env.VITE_FIREBASE_STORAGE_BUCKET');
    expect(configContent).toContain('import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID');
    expect(configContent).toContain('import.meta.env.VITE_FIREBASE_APP_ID');
    expect(configContent).toContain('import.meta.env.VITE_FIREBASE_MEASUREMENT_ID');
  });
});
