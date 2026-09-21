import { describe, it, expect } from 'vitest';
import { generateDailyRecommendations } from '../src/services/recommendationEngine';
import { computeAdaptiveWeights } from '../src/services/adaptiveFeedbackService';

describe('Personalized Recommendation Engine', () => {
  it('strictly excludes meals containing declared allergens', () => {
    const profile = {
      dietaryPreference: 'omnivore',
      allergies: ['shellfish', 'fish'],
      wellnessGoals: ['energy']
    };
    const assessment = { waterLiters: 2.0, sleepHours: 7.5 };
    const { recommendedMeals } = generateDailyRecommendations(profile, assessment, []);

    Object.values(recommendedMeals).forEach(meal => {
      expect(meal.allergens).not.toContain('shellfish');
      expect(meal.allergens).not.toContain('fish');
    });
  });

  it('respects vegan dietary preferences across all meal slots', () => {
    const profile = {
      dietaryPreference: 'vegan',
      allergies: [],
      wellnessGoals: ['gut_health']
    };
    const { recommendedMeals } = generateDailyRecommendations(profile, {}, []);

    Object.values(recommendedMeals).forEach(meal => {
      expect(meal.dietaryTags).toContain('vegan');
      expect(meal.allergens).not.toContain('eggs');
      expect(meal.allergens).not.toContain('dairy');
    });
  });

  it('adapts weights down after negative user feedback', () => {
    const feedback = [
      { category: 'nutrition', feedback: 'not_helpful', rejectionReason: 'too_difficult' },
      { category: 'mind_stress', feedback: 'helpful' }
    ];

    const { categoryWeights } = computeAdaptiveWeights(feedback);
    expect(categoryWeights.nutrition).toBeLessThan(1.0);
    expect(categoryWeights.mind_stress).toBeGreaterThan(1.0);
  });
});
