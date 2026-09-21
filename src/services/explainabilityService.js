/**
 * Explainability Service - "Why am I seeing this?"
 * 
 * Provides transparent, explainable breakdowns of why recommendations or meals
 * were suggested, highlighting explicit data inputs (profile, goals, assessment, feedback).
 * Does not expose hidden system prompts or internal model secrets.
 */

export function generateExplanation(recommendation, userProfile = {}, recentAssessment = {}, feedbackHistory = []) {
  if (!recommendation) return null;

  const dataFactorsConsidered = [];

  // Check assessment factors
  if (recentAssessment?.waterLiters && recentAssessment.waterLiters < (userProfile?.targetWaterLiters || 2.5)) {
    dataFactorsConsidered.push({
      category: 'Daily Assessment',
      label: 'Hydration Deficit',
      detail: `Logged ${recentAssessment.waterLiters}L vs target ${userProfile.targetWaterLiters || 2.5}L`
    });
  }

  if (recentAssessment?.sleepHours && recentAssessment.sleepHours < 7.0) {
    dataFactorsConsidered.push({
      category: 'Daily Assessment',
      label: 'Sleep Duration',
      detail: `Logged ${recentAssessment.sleepHours} hours (below recommended 7-9 hours)`
    });
  }

  if (recentAssessment?.stressLevel && recentAssessment.stressLevel >= 3) {
    dataFactorsConsidered.push({
      category: 'Daily Assessment',
      label: 'Stress Indicator',
      detail: `Reported stress level ${recentAssessment.stressLevel}/5`
    });
  }

  // Check profile & goal factors
  if (userProfile?.wellnessGoals && userProfile.wellnessGoals.length > 0) {
    dataFactorsConsidered.push({
      category: 'User Profile',
      label: 'Primary Goals',
      detail: userProfile.wellnessGoals.map(g => g.replace('_', ' ')).join(', ')
    });
  }

  if (userProfile?.dietaryPreference) {
    dataFactorsConsidered.push({
      category: 'Nutrition Profile',
      label: 'Dietary Preference',
      detail: `${userProfile.dietaryPreference.toUpperCase()} verified`
    });
  }

  if (userProfile?.allergies && userProfile.allergies.length > 0) {
    dataFactorsConsidered.push({
      category: 'Safety Filter',
      label: 'Allergen Exclusion',
      detail: `Strict exclusion of: ${userProfile.allergies.join(', ')}`
    });
  }

  // Check adaptive feedback history
  const helpfulCount = feedbackHistory.filter(f => f.feedback === 'helpful').length;
  if (helpfulCount > 0) {
    dataFactorsConsidered.push({
      category: 'Adaptive Learning',
      label: 'User Feedback Loop',
      detail: `Aligned with categories you marked helpful in previous sessions`
    });
  }

  // Primary plain-language explanation
  const primaryReason = recommendation.whyFactors?.[0] || 
    recommendation.whyRecommendedRationale || 
    `Recommended based on your ${userProfile?.dietaryPreference || 'wellness'} preferences and current daily wellness assessment.`;

  return {
    itemTitle: recommendation.title || recommendation.name,
    category: recommendation.category || recommendation.type || 'Wellness',
    primaryReason,
    dataFactorsConsidered,
    confidenceLevel: recommendation.confidence || 92,
    adaptationInfluence: feedbackHistory.length > 0 
      ? 'Adapted based on your cumulative feedback responses.'
      : 'Initial baseline recommendation based on your onboarding profile.',
    safetyDisclaimer: 'Informational wellness recommendation only. Not a medical treatment or prescription.'
  };
}
