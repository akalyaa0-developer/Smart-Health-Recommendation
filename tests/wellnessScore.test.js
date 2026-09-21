import { describe, it, expect } from 'vitest';
import { calculateWellnessScore } from '../src/services/wellnessScoreCalculator';

describe('Wellness Score Calculator', () => {
  it('calculates score within valid bounds (0 to 100)', () => {
    const assessment = {
      waterLiters: 2.5,
      sleepHours: 8.0,
      sleepQuality: 5,
      activityMinutes: 45,
      mealConsistency: 'balanced'
    };
    const profile = { targetWaterLiters: 2.5 };
    const result = calculateWellnessScore(assessment, profile, 7);

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.score).toBeGreaterThan(85);
  });

  it('penalizes sub-optimal hydration and short sleep duration', () => {
    const lowAssessment = {
      waterLiters: 0.8,
      sleepHours: 4.5,
      sleepQuality: 1,
      activityMinutes: 10,
      mealConsistency: 'irregular'
    };
    const profile = { targetWaterLiters: 3.0 };
    const lowResult = calculateWellnessScore(lowAssessment, profile, 1);

    expect(lowResult.score).toBeLessThan(65);
    expect(lowResult.areasToImprove.length).toBeGreaterThan(0);
  });

  it('includes non-medical disclaimer in output', () => {
    const result = calculateWellnessScore({}, {});
    expect(result.disclaimer).toContain('not a medical assessment');
  });
});
