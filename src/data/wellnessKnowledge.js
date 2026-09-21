/**
 * Wellness Knowledge Base & Recommendation Factor Templates
 */

export const SCORE_WEIGHTS = {
  hydration: 0.20,
  sleep: 0.25,
  activity: 0.20,
  nutrition: 0.20,
  consistency: 0.15
};

export const WELLNESS_RECOMMENDATION_TEMPLATES = [
  {
    id: 'rec-hydration-deficit',
    category: 'hydration',
    title: 'Cellular Re-Hydration Protocol',
    headline: 'Increase midday fluid intake with mineral electrolyte boost',
    triggerCondition: (assessment, profile) => {
      const target = profile?.targetWaterLiters || 2.5;
      return assessment?.waterLiters && assessment.waterLiters < (target * 0.7);
    },
    whyFactors: [
      'Recent logged water intake was below your individualized target.',
      'Mild dehydration is clinically correlated with fatigue and cognitive fog.',
      'Active goal alignment: Sustained Daily Energy.'
    ],
    confidence: 94,
    actionText: 'Drink a 300ml glass of water with a pinch of Celtic sea salt or fresh lemon slice before 2:00 PM.'
  },
  {
    id: 'rec-sleep-debt',
    category: 'sleep_recovery',
    title: 'Sleep Hygiene & Adenosine Optimization',
    headline: 'Incorporate 15-minute digital wind-down prior to bed',
    triggerCondition: (assessment, profile) => {
      return (assessment?.sleepHours && assessment.sleepHours < 6.8) || (assessment?.sleepQuality && assessment.sleepQuality <= 2);
    },
    whyFactors: [
      'Sleep duration logged under 7 hours or low restorative quality rating.',
      'Recent sleep debt reduces cellular insulin sensitivity and recovery.',
      'Goal alignment: Restorative Sleep & Nervous System Balance.'
    ],
    confidence: 92,
    actionText: 'Dim overhead lighting 45 minutes before sleep and switch mobile devices to warm night mode.'
  },
  {
    id: 'rec-stress-reduction',
    category: 'mind_stress',
    title: 'Parasympathetic Reset (Box Breathing)',
    headline: 'Take a 4-minute physiological pause to modulate cortisol',
    triggerCondition: (assessment) => {
      return assessment?.stressLevel && assessment.stressLevel >= 4;
    },
    whyFactors: [
      'Self-reported stress level scored 4 or 5 out of 5 in your latest assessment.',
      'Elevated sympathetic tone limits digestive enzyme production.',
      'Adaptive preference: Mindfulness techniques accepted.'
    ],
    confidence: 89,
    actionText: 'Practice 4-4-4-4 box breathing (inhale 4s, hold 4s, exhale 4s, hold 4s) for 4 cycles.'
  },
  {
    id: 'rec-movement-boost',
    category: 'activity',
    title: 'Post-Meal Glycemic Walk',
    headline: 'Take a brief 10 to 15-minute gentle stroll after your main meal',
    triggerCondition: (assessment, profile) => {
      return (assessment?.activityMinutes !== undefined && assessment.activityMinutes < 20) || profile?.activityLevel === 'sedentary';
    },
    whyFactors: [
      'Activity logged below 25 minutes today.',
      'Light postprandial movement activates GLUT4 glucose transporters without taxing the body.',
      'Aligns with sustained daytime alertness and digestion.'
    ],
    confidence: 88,
    actionText: 'Step away from screens for a 12-minute brisk walk outside or around your living space.'
  },
  {
    id: 'rec-polyphenol-nutrition',
    category: 'nutrition',
    title: 'Microbial Diversity & Prebiotic Fuel',
    headline: 'Introduce colorful plant polyphenols into tonight’s meal',
    triggerCondition: (assessment, profile) => {
      return profile?.wellnessGoals?.includes('gut_health') || assessment?.mealConsistency === 'irregular';
    },
    whyFactors: [
      'Active wellness goal prioritized gut microbiome diversity.',
      'Recent meal consistency noted irregular meal timing.',
      'Dark berries, leafy greens, and purple vegetables feed beneficial Akkermansia microbes.'
    ],
    confidence: 95,
    actionText: 'Include at least two colors of non-starchy vegetables or berries in your upcoming dinner or snack.'
  }
];
