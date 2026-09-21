/**
 * Authentication Context for IntelWell
 * 
 * Provides authenticated user state, login, signup, logout,
 * and profile management.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signUpUser, 
  signInUser, 
  signOutUser, 
  resetUserPassword, 
  subscribeToAuthChanges 
} from '../firebase/authService';
import { getUserProfile, saveUserProfile } from '../firebase/firestoreService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      if (user) {
        setCurrentUser(user);
        const profile = await getUserProfile(user.uid || user.id);
        setUserProfile(profile);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const user = await signInUser(email, password);
      setCurrentUser(user);
      const profile = await getUserProfile(user.uid || user.id);
      setUserProfile(profile);
      return user;
    } catch (err) {
      setError(err.message || 'Failed to sign in.');
      throw err;
    }
  };

  const signup = async (email, password, displayName) => {
    setError(null);
    try {
      const user = await signUpUser(email, password, displayName);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.message || 'Failed to create account.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      setUserProfile(null);
    } catch (err) {
      setError(err.message || 'Failed to log out.');
    }
  };

  const resetPassword = async (email) => {
    return resetUserPassword(email);
  };

  const updateProfileData = async (updatedFields) => {
    if (!currentUser) return;
    const uid = currentUser.uid || currentUser.id;
    const merged = { ...userProfile, ...updatedFields };
    const saved = await saveUserProfile(uid, merged);
    setUserProfile(saved);
    return saved;
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    login,
    signup,
    logout,
    resetPassword,
    updateProfileData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
