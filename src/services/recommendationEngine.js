/**
 * Modular Personalized Recommendation Engine for IntelWell
 * 
 * Synthesizes:
 * - User Profile & Biometrics
 * - Wellness Goals
 * - Dietary Preferences & Strict Allergen Exclusions
 * - Daily Assessment Telemetry (Hydration deficit, sleep duration, stress)
 * - Adaptive Feedback Weights (boosts helpful categories, reduces rejected ones)
 */

import { WELLNESS_RECOMMENDATION_TEMPLATES } from '../data/wellnessKnowledge';
import { INITIAL_MEALS } from '../data/initialMeals';
import { computeAdaptiveWeights } from './adaptiveFeedbackService';

export function generateDailyRecommendations(userProfile = {}, recentAssessment = {}, feedbackHistory = []) {
  const { categoryWeights, penalizedIngredients } = computeAdaptiveWeights(feedbackHistory);

  // 1. Evaluate wellness recommendation templates
  const scoredRecommendations = WELLNESS_RECOMMENDATION_TEMPLATES.map(template => {
    let score = template.confidence || 85;

    // Evaluate dynamic trigger condition
    const isTriggered = template.triggerCondition(recentAssessment, userProfile);
    if (isTriggered) {
      score += 25;
    }

    // Apply adaptive category weight
    const catWeight = categoryWeights[template.category] || 1.0;
    score = score * catWeight;

    // Check goals alignment
    if (userProfile?.wellnessGoals) {
      if (template.category === 'mind_stress' && userProfile.wellnessGoals.includes('stress_reduction')) score += 15;
      if (template.category === 'sleep_recovery' && userProfile.wellnessGoals.includes('better_sleep')) score += 15;
      if (template.category === 'hydration' && userProfile.wellnessGoals.includes('energy')) score += 10;
      if (template.category === 'activity' && userProfile.wellnessGoals.includes('muscle_tone')) score += 15;
    }

    return {
      ...template,
      computedScore: Math.round(score),
      isUrgent: isTriggered && (template.category === 'hydration' || template.category === 'mind_stress')
    };
  });

  // Sort descending by computed relevance score
  const sortedRecs = scoredRecommendations.sort((a, b) => b.computedScore - a.computedScore);

  // 2. Select personalized meals based on dietary criteria and allergen exclusion
  const userAllergies = (userProfile?.allergies || []).map(a => a.toLowerCase());
  const userDiet = (userProfile?.dietaryPreference || 'omnivore').toLowerCase();
  const userGoals = userProfile?.wellnessGoals || [];

  const eligibleMeals = INITIAL_MEALS.filter(meal => {
    // Strict allergen exclusion
    const hasAllergen = meal.allergens.some(allergen => userAllergies.includes(allergen.toLowerCase()));
    if (hasAllergen) return false;

    // Penalized ingredients from rejection feedback
    const hasPenalizedIngredient = meal.ingredients.some(ing => 
      penalizedIngredients.some(penalized => ing.name.toLowerCase().includes(penalized))
    );
    if (hasPenalizedIngredient) return false;

    // Dietary preference filtering
    if (userDiet === 'vegan' && !meal.dietaryTags.includes('vegan')) return false;
    if (userDiet === 'vegetarian' && !meal.dietaryTags.includes('vegetarian') && !meal.dietaryTags.includes('vegan')) return false;
    if (userDiet === 'keto' && !meal.dietaryTags.includes('keto') && meal.carbsGrams > 30) return false;
    if (userDiet === 'gluten-free' && !meal.dietaryTags.includes('gluten-free')) return false;

    return true;
  });

  // Pick best meal for each category (breakfast, lunch, dinner, snack)
  const mealSlots = ['breakfast', 'lunch', 'dinner', 'snack'];
  const recommendedMeals = {};

  mealSlots.forEach(slot => {
    const candidates = eligibleMeals.filter(m => m.type === slot);
    if (candidates.length === 0) {
      // Fallback to any safe meal of that type
      recommendedMeals[slot] = INITIAL_MEALS.find(m => m.type === slot) || INITIAL_MEALS[0];
      return;
    }

    // Score candidates by goal match
    const rankedCandidates = candidates.map(candidate => {
      let candidateScore = 100;
      candidate.suitableGoals.forEach(g => {
        if (userGoals.includes(g)) candidateScore += 20;
      });
      return { candidate, score: candidateScore };
    }).sort((a, b) => b.score - a.score);

    recommendedMeals[slot] = rankedCandidates[0].candidate;
  });

  return {
    primaryRecommendations: sortedRecs.slice(0, 3),
    secondaryRecommendations: sortedRecs.slice(3),
    recommendedMeals,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Returns an alternative meal for swapping a slot
 */
export function getAlternativeMeal(mealType, currentMealId, userProfile = {}) {
  const userAllergies = (userProfile?.allergies || []).map(a => a.toLowerCase());
  const userDiet = (userProfile?.dietaryPreference || 'omnivore').toLowerCase();

  const alternatives = INITIAL_MEALS.filter(meal => {
    if (meal.type !== mealType) return false;
    if (meal.id === currentMealId) return false;

    // Allergen check
    const hasAllergen = meal.allergens.some(a => userAllergies.includes(a.toLowerCase()));
    if (hasAllergen) return false;

    // Diet check
    if (userDiet === 'vegan' && !meal.dietaryTags.includes('vegan')) return false;
    if (userDiet === 'vegetarian' && !meal.dietaryTags.includes('vegetarian') && !meal.dietaryTags.includes('vegan')) return false;

    return true;
  });

  if (alternatives.length > 0) {
    const randomIndex = Math.floor(Math.random() * alternatives.length);
    return alternatives[randomIndex];
  }

  return INITIAL_MEALS.find(m => m.type === mealType && m.id !== currentMealId) || INITIAL_MEALS[0];
}
