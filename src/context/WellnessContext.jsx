/**
 * Wellness Context for IntelWell
 * 
 * Manages daily assessments, transparent wellness score calculation,
 * active recommendations, explainability triggers, and adaptive feedback.
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { getDailyAssessments, saveDailyAssessment } from '../firebase/firestoreService';
import { calculateWellnessScore } from '../services/wellnessScoreCalculator';
import { generateDailyRecommendations } from '../services/recommendationEngine';
import { getStoredFeedback, recordFeedback } from '../services/adaptiveFeedbackService';

const WellnessContext = createContext(null);

export function WellnessProvider({ children }) {
  const { currentUser, userProfile } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [explainItem, setExplainItem] = useState(null); // For "Why am I seeing this?" modal

  const userId = currentUser?.uid || currentUser?.id || null;
  const todayStr = new Date().toISOString().split('T')[0];

  // Load historical assessments and feedback on user change
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      if (userId) {
        const history = await getDailyAssessments(userId);
        setAssessments(history);
        const fb = getStoredFeedback(userId);
        setFeedbackHistory(fb);
      } else {
        setAssessments([]);
        setFeedbackHistory([]);
      }
      setLoading(false);
    }
    loadData();
  }, [userId]);

  // Today's assessment (if any)
  const todayAssessment = useMemo(() => {
    return assessments.find(a => a.date === todayStr) || null;
  }, [assessments, todayStr]);

  // Most recent assessment for personalization
  const recentAssessment = useMemo(() => {
    return assessments[0] || null;
  }, [assessments]);

  // Assessment streak count (consecutive days)
  const streakDays = useMemo(() => {
    if (!assessments || assessments.length === 0) return 1;
    let count = 0;
    const sorted = [...assessments].sort((a, b) => new Date(b.date) - new Date(a.date));
    let checkDate = new Date();
    
    for (const record of sorted) {
      const recDate = new Date(record.date);
      const diffDays = Math.floor((checkDate - recDate) / (1000 * 60 * 60 * 24));
      if (diffDays <= 1) {
        count++;
        checkDate = recDate;
      } else {
        break;
      }
    }
    return Math.max(1, count);
  }, [assessments]);

  // Calculate composite Wellness Score
  const wellnessScoreData = useMemo(() => {
    return calculateWellnessScore(recentAssessment, userProfile, streakDays);
  }, [recentAssessment, userProfile, streakDays]);

  // Generate personalized & adaptive recommendations
  const recommendationsData = useMemo(() => {
    return generateDailyRecommendations(userProfile, recentAssessment, feedbackHistory);
  }, [userProfile, recentAssessment, feedbackHistory]);

  // Submit today's daily assessment
  const submitDailyAssessment = async (assessmentPayload) => {
    if (!userId) return null;
    const record = {
      ...assessmentPayload,
      date: todayStr
    };
    const updated = await saveDailyAssessment(userId, record);
    setAssessments(updated);
    return record;
  };

  // Quick log water (+ml)
  const quickLogWater = async (amountLiters = 0.25) => {
    if (!userId) return;
    const currentLogged = todayAssessment?.waterLiters || 0;
    const newTotal = Math.round((currentLogged + amountLiters) * 100) / 100;

    const baseRecord = todayAssessment || {
      date: todayStr,
      energyLevel: 7,
      mood: 'Balanced',
      sleepHours: 7.0,
      sleepQuality: 4,
      activityMinutes: 30,
      mealConsistency: 'balanced',
      stressLevel: 2,
      notes: ''
    };

    const updatedRecord = {
      ...baseRecord,
      waterLiters: newTotal
    };

    await submitDailyAssessment(updatedRecord);
  };

  // Submit recommendation feedback (👍, 👎, save, skip, rejection reasons)
  const submitFeedback = (item, feedbackType, rejectionReason = null, ingredient = null) => {
    if (!userId) return;
    const entry = {
      itemId: item.id || item.title,
      itemTitle: item.title || item.name,
      category: item.category || item.type,
      feedback: feedbackType, // 'helpful', 'not_helpful', 'saved', 'skipped'
      rejectionReason,
      ingredient
    };
    const updatedFb = recordFeedback(userId, entry);
    setFeedbackHistory(updatedFb);
  };

  const value = {
    assessments,
    todayAssessment,
    recentAssessment,
    streakDays,
    wellnessScoreData,
    recommendations: recommendationsData.primaryRecommendations,
    secondaryRecommendations: recommendationsData.secondaryRecommendations,
    recommendedMeals: recommendationsData.recommendedMeals,
    loading,
    explainItem,
    setExplainItem,
    feedbackHistory,
    submitDailyAssessment,
    quickLogWater,
    submitFeedback
  };

  return <WellnessContext.Provider value={value}>{children}</WellnessContext.Provider>;
}

export function useWellness() {
  const context = useContext(WellnessContext);
  if (!context) {
    throw new Error('useWellness must be used within a WellnessProvider');
  }
  return context;
}
