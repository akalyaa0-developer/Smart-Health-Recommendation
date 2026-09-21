/**
 * Adaptive Feedback Service for IntelWell
 * 
 * Manages user feedback loop (helpful, not helpful, save, skip, rejection reasons)
 * and calculates dynamic category and ingredient weights to personalize future recommendations.
 */

const FEEDBACK_STORAGE_KEY = 'intelwell_feedback_history';

export function getStoredFeedback(userId = 'default') {
  try {
    const raw = localStorage.getItem(`${FEEDBACK_STORAGE_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error loading feedback history', e);
    return [];
  }
}

export function recordFeedback(userId = 'default', feedbackEntry) {
  try {
    const current = getStoredFeedback(userId);
    const updated = [
      {
        id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toISOString(),
        ...feedbackEntry
      },
      ...current
    ];
    localStorage.setItem(`${FEEDBACK_STORAGE_KEY}_${userId}`, JSON.stringify(updated.slice(0, 100)));
    return updated;
  } catch (e) {
    console.error('Error saving feedback', e);
    return [];
  }
}

/**
 * Computes category preference weights based on past feedback.
 * Base weight is 1.0. Helpful raises weight (+0.25), Not Helpful reduces weight (-0.40).
 */
export function computeAdaptiveWeights(feedbackList = []) {
  const categoryWeights = {
    nutrition: 1.0,
    hydration: 1.0,
    activity: 1.0,
    sleep_recovery: 1.0,
    mind_stress: 1.0,
    breakfast: 1.0,
    lunch: 1.0,
    dinner: 1.0,
    snack: 1.0
  };

  const penalizedIngredients = new Set();

  feedbackList.forEach(item => {
    const category = item.category || item.itemType;
    if (category && categoryWeights[category] !== undefined) {
      if (item.feedback === 'helpful') {
        categoryWeights[category] = Math.min(2.0, categoryWeights[category] + 0.2);
      } else if (item.feedback === 'not_helpful' || item.feedback === 'rejected') {
        categoryWeights[category] = Math.max(0.2, categoryWeights[category] - 0.35);
      }
    }

    // Check specific rejection reasons
    if (item.rejectionReason === 'dislike_ingredient' && item.ingredient) {
      penalizedIngredients.add(item.ingredient.toLowerCase());
    }
  });

  return {
    categoryWeights,
    penalizedIngredients: Array.from(penalizedIngredients)
  };
}
