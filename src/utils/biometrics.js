/**
 * Biometrics and Nutritional Calculations for IntelWell
 */

export function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const rounded = Math.round(bmi * 10) / 10;

  let category = 'Normal';
  let badgeColor = 'emerald';
  if (rounded < 18.5) {
    category = 'Underweight';
    badgeColor = 'amber';
  } else if (rounded >= 25 && rounded < 30) {
    category = 'Overweight';
    badgeColor = 'amber';
  } else if (rounded >= 30) {
    category = 'Obese';
    badgeColor = 'rose';
  }

  return { bmi: rounded, category, badgeColor };
}

/**
 * Calculates daily hydration target in Liters.
 * Base: ~35ml per kg + 350ml per 30 minutes of moderate/vigorous activity.
 */
export function calculateWaterTarget(weightKg, activityLevel = 'moderate') {
  const baseWeight = weightKg || 70;
  let baseMl = baseWeight * 35;

  if (activityLevel === 'sedentary') baseMl += 0;
  else if (activityLevel === 'light') baseMl += 300;
  else if (activityLevel === 'moderate') baseMl += 500;
  else if (activityLevel === 'very_active') baseMl += 800;

  // Round to nearest 100ml and convert to liters
  const liters = Math.round((baseMl / 1000) * 10) / 10;
  return Math.max(2.0, Math.min(liters, 4.0)); // Cap between 2.0L and 4.0L
}

/**
 * Calculates estimated Basal Metabolic Rate and target daily calories.
 */
export function calculateCaloricTarget(weightKg = 70, heightCm = 175, age = 30, gender = 'female', activityLevel = 'moderate', goal = 'energy') {
  // Mifflin-St Jeor Equation
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725
  };

  const tdee = bmr * (activityMultipliers[activityLevel] || 1.4);

  let targetCalories = tdee;
  if (goal === 'weight_management' || goal === 'weight_loss') {
    targetCalories = tdee * 0.85; // moderate deficit
  } else if (goal === 'muscle_tone') {
    targetCalories = tdee * 1.1; // slight surplus
  }

  const calories = Math.round(targetCalories);

  // Macro distribution estimates
  let proteinRatio = 0.25;
  let carbsRatio = 0.50;
  let fatRatio = 0.25;

  if (goal === 'muscle_tone') {
    proteinRatio = 0.30;
    carbsRatio = 0.45;
    fatRatio = 0.25;
  } else if (goal === 'energy') {
    proteinRatio = 0.25;
    carbsRatio = 0.50;
    fatRatio = 0.25;
  }

  const proteinGrams = Math.round((calories * proteinRatio) / 4);
  const carbsGrams = Math.round((calories * carbsRatio) / 4);
  const fatGrams = Math.round((calories * fatRatio) / 9);

  return {
    calories,
    macros: {
      protein: proteinGrams,
      carbs: carbsGrams,
      fat: fatGrams
    }
  };
}
