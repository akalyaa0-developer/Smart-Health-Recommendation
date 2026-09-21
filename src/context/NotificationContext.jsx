/**
 * Notification & Reminders Context for IntelWell
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid || currentUser?.id || null;

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (userId) {
      try {
        const stored = localStorage.getItem(`intelwell_notifications_${userId}`);
        setNotifications(stored ? JSON.parse(stored) : []);
      } catch {
        setNotifications([]);
      }
    } else {
      setNotifications([]);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      try {
        localStorage.setItem(`intelwell_notifications_${userId}`, JSON.stringify(notifications));
      } catch (e) {
        console.error(e);
      }
    }
  }, [notifications, userId]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    if (!userId) return;
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    if (!userId) return;
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    if (!userId) return;
    setNotifications([]);
  };

  const addNotification = (notif) => {
    if (!userId) return;
    const newEntry = {
      id: `notif-${Date.now()}`,
      time: 'Just now',
      read: false,
      ...notif
    };
    setNotifications(prev => [newEntry, ...prev]);
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    addNotification
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
