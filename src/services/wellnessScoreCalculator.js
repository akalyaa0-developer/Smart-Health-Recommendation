/**
 * Transparent Wellness Score Calculator
 * 
 * Computes a weighted 0-100 lifestyle indicator based on measurable inputs:
 * - Hydration (20%)
 * - Sleep Quality & Duration (25%)
 * - Physical Activity (20%)
 * - Meal Consistency & Nutrition (20%)
 * - Assessment & Habit Consistency (15%)
 * 
 * DISCLAIMER: This score is a wellness tracking indicator and is not a medical assessment.
 */

import { SCORE_WEIGHTS } from '../data/wellnessKnowledge';

export function calculateWellnessScore(assessment = {}, profile = {}, streakDays = 1) {
  // 1. Hydration pillar (target vs logged)
  const targetWater = profile?.targetWaterLiters || 2.5;
  const loggedWater = assessment?.waterLiters || 1.8;
  const hydrationRatio = Math.min(1.2, loggedWater / targetWater);
  const hydrationScore = Math.min(100, Math.round(hydrationRatio * 100));

  // 2. Sleep pillar (7-9 hours ideal, plus subjective quality 1-5)
  const loggedSleep = assessment?.sleepHours || 7.0;
  const sleepQuality = assessment?.sleepQuality || 3;
  let durationScore = 70;
  if (loggedSleep >= 7 && loggedSleep <= 9) durationScore = 100;
  else if (loggedSleep >= 6 && loggedSleep < 7) durationScore = 80;
  else if (loggedSleep > 9 && loggedSleep <= 10) durationScore = 85;
  else if (loggedSleep < 6) durationScore = Math.max(30, Math.round((loggedSleep / 6) * 75));

  const qualityScore = (sleepQuality / 5) * 100;
  const sleepScore = Math.round((durationScore * 0.6) + (qualityScore * 0.4));

  // 3. Activity pillar (target 30-45 mins moderate)
  const loggedActivity = assessment?.activityMinutes || 30;
  const activityScore = Math.min(100, Math.round((loggedActivity / 45) * 100));

  // 4. Nutrition pillar (meal consistency & perceived nutrition)
  let nutritionScore = 80;
  if (assessment?.mealConsistency === 'balanced') nutritionScore = 95;
  else if (assessment?.mealConsistency === 'light') nutritionScore = 85;
  else if (assessment?.mealConsistency === 'skipped_meal') nutritionScore = 65;
  else if (assessment?.mealConsistency === 'irregular') nutritionScore = 60;

  // 5. Consistency pillar (streaks of self-reflection)
  const streakScore = Math.min(100, Math.round(Math.min(streakDays, 7) / 7 * 100));

  // Weighted composite
  const composite = 
    (hydrationScore * SCORE_WEIGHTS.hydration) +
    (sleepScore * SCORE_WEIGHTS.sleep) +
    (activityScore * SCORE_WEIGHTS.activity) +
    (nutritionScore * SCORE_WEIGHTS.nutrition) +
    (streakScore * SCORE_WEIGHTS.consistency);

  const finalScore = Math.min(100, Math.max(10, Math.round(composite)));

  // Detailed breakdown of contributing factors
  const factorBreakdown = [
    {
      pillar: 'Hydration',
      weight: '20%',
      score: hydrationScore,
      value: `${loggedWater}L / ${targetWater}L`,
      status: hydrationScore >= 80 ? 'Optimal' : hydrationScore >= 60 ? 'Moderate' : 'Needs Attention',
      impact: Math.round(hydrationScore * SCORE_WEIGHTS.hydration)
    },
    {
      pillar: 'Sleep & Recovery',
      weight: '25%',
      score: sleepScore,
      value: `${loggedSleep} hrs (${sleepQuality}/5 stars)`,
      status: sleepScore >= 80 ? 'Optimal' : sleepScore >= 60 ? 'Fair' : 'Sub-optimal',
      impact: Math.round(sleepScore * SCORE_WEIGHTS.sleep)
    },
    {
      pillar: 'Physical Activity',
      weight: '20%',
      score: activityScore,
      value: `${loggedActivity} mins active`,
      status: activityScore >= 80 ? 'Strong' : activityScore >= 50 ? 'Moderate' : 'Low',
      impact: Math.round(activityScore * SCORE_WEIGHTS.activity)
    },
    {
      pillar: 'Nutritional Balance',
      weight: '20%',
      score: nutritionScore,
      value: assessment?.mealConsistency || 'Balanced',
      status: nutritionScore >= 80 ? 'Optimal' : 'Variable',
      impact: Math.round(nutritionScore * SCORE_WEIGHTS.nutrition)
    },
    {
      pillar: 'Assessment Streak',
      weight: '15%',
      score: streakScore,
      value: `${streakDays} day streak`,
      status: streakDays >= 5 ? 'Excellent' : 'Building',
      impact: Math.round(streakScore * SCORE_WEIGHTS.consistency)
    }
  ];

  const areasToImprove = [];
  if (hydrationScore < 75) areasToImprove.push('Increase fluid intake earlier in the afternoon.');
  if (sleepScore < 75) areasToImprove.push('Aim for earlier digital wind-down to support restorative sleep duration.');
  if (activityScore < 70) areasToImprove.push('Add a 15-minute brisk walk or light stretching session.');
  if (nutritionScore < 75) areasToImprove.push('Maintain regular meal cadence to avoid energy spikes and drops.');

  return {
    score: finalScore,
    factorBreakdown,
    areasToImprove,
    disclaimer: 'This score is a lifestyle tracking indicator and is not a medical assessment or diagnostic health measurement.'
  };
}
