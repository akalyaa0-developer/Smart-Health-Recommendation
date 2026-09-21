import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { calculateBMI, calculateWaterTarget, calculateCaloricTarget } from '../../utils/biometrics';
import { 
  User, 
  Heart, 
  Utensils, 
  Activity, 
  Moon, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  ShieldCheck,
  Zap,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function OnboardingFlow({ onComplete }) {
  const { currentUser, userProfile, updateProfileData } = useAuth();
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    name: userProfile?.name || currentUser?.displayName || '',
    age: userProfile?.age || 29,
    gender: userProfile?.gender || 'female',
    heightCm: userProfile?.heightCm || 168,
    weightKg: userProfile?.weightKg || 62,
    dietaryPreference: userProfile?.dietaryPreference || 'vegetarian',
    allergies: userProfile?.allergies || [],
    dislikedIngredients: userProfile?.dislikedIngredients || [],
    activityLevel: userProfile?.activityLevel || 'moderate',
    sleepTargetHours: userProfile?.sleepTargetHours || 8.0,
    wellnessGoals: userProfile?.wellnessGoals || ['energy', 'better_sleep'],
    mealFrequency: userProfile?.mealFrequency || '3_meals_1_snack',
    cookingTimePreference: userProfile?.cookingTimePreference || 'quick_30min',
    trustedContacts: userProfile?.trustedContacts || []
  });

  const bmiData = calculateBMI(formData.weightKg, formData.heightCm);
  const waterTarget = calculateWaterTarget(formData.weightKg, formData.activityLevel);

  const toggleArrayItem = (field, value) => {
    setFormData(prev => {
      const current = prev[field] || [];
      const exists = current.includes(value);
      return {
        ...prev,
        [field]: exists ? current.filter(item => item !== value) : [...current, value]
      };
    });
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else handleSubmitFinal();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmitFinal = async () => {
    const caloric = calculateCaloricTarget(
      formData.weightKg, 
      formData.heightCm, 
      formData.age, 
      formData.gender, 
      formData.activityLevel, 
      formData.wellnessGoals[0]
    );

    const payload = {
      ...formData,
      targetWaterLiters: waterTarget,
      estimatedCalories: caloric.calories,
      macroTargets: caloric.macros,
      onboardingCompleted: true
    };

    await updateProfileData(payload);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    onComplete();
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-6">
        {/* Progress Header */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span className="uppercase tracking-wider">Step {step} of 5</span>
            <span className="text-emerald-600 font-bold">
              {step === 1 && 'Biometrics & Baseline'}
              {step === 2 && 'Dietary Preferences & Allergens'}
              {step === 3 && 'Activity & Sleep Cadence'}
              {step === 4 && 'Primary Wellness Goals'}
              {step === 5 && 'Meal Routine & Cooking Style'}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        <Card className="p-8 space-y-6 bg-white border border-slate-200 shadow-xl">
          {/* STEP 1: Biometrics */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Welcome! Let’s personalize your baseline metrics.
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Used solely to calculate individualized hydration and caloric targets.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Preferred Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  required
                />
                <Input
                  label="Age"
                  type="number"
                  min="16"
                  max="100"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  required
                />
                <Input
                  label="Height (cm)"
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                  placeholder="e.g. 170"
                  required
                />
                <Input
                  label="Weight (kg)"
                  type="number"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                  placeholder="e.g. 65"
                  required
                />
              </div>

              {/* Real-time calculated indicators */}
              {bmiData && (
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Calculated BMI Index: </span>
                    <span className="font-bold text-slate-900 text-sm">{bmiData.bmi}</span>
                    <span className="text-slate-400 ml-1">({bmiData.category})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 font-medium">Daily Hydration Baseline: </span>
                    <span className="font-bold text-emerald-700 text-sm">{waterTarget} Liters</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Dietary Preferences & Allergies */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Dietary Preferences &amp; Strict Allergens
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  IntelWell strictly excludes confirmed allergens from all meal plans and grocery lists.
                </p>
              </div>

              {/* Diet selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Primary Dietary Pattern
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'omnivore', label: 'Omnivore', desc: 'All whole foods' },
                    { id: 'vegetarian', label: 'Vegetarian', desc: 'No meat or fish' },
                    { id: 'vegan', label: '100% Plant-Based', desc: 'No animal products' },
                    { id: 'pescatarian', label: 'Pescatarian', desc: 'Vegetarian + seafood' },
                    { id: 'mediterranean', label: 'Mediterranean', desc: 'Olive oil & grains' },
                    { id: 'keto', label: 'Low Carb / Keto', desc: 'Fat & protein focused' }
                  ].map(diet => (
                    <button
                      key={diet.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, dietaryPreference: diet.id })}
                      className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                        formData.dietaryPreference === diet.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <p className="font-bold text-xs">{diet.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{diet.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Strict Allergies */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Strict Allergies to Exclude
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Peanuts', 'Tree Nuts', 'Dairy', 'Gluten', 'Shellfish', 'Eggs', 'Soy', 'Sesame'].map(allergen => {
                    const isSelected = formData.allergies.includes(allergen.toLowerCase());
                    return (
                      <button
                        key={allergen}
                        type="button"
                        onClick={() => toggleArrayItem('allergies', allergen.toLowerCase())}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {isSelected ? '✕ ' : '+ '}{allergen}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Activity & Sleep */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Activity Level &amp; Rest Cadence
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Helps determine post-workout recovery nutrients and sleep wind-down recommendations.
                </p>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Typical Daily Physical Activity
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'sedentary', label: 'Sedentary', desc: 'Mostly sitting at a desk' },
                    { id: 'light', label: 'Lightly Active', desc: 'Daily light walks, 1-2 workouts/week' },
                    { id: 'moderate', label: 'Moderately Active', desc: 'Consistent 3-4 active workouts/week' },
                    { id: 'very_active', label: 'Very Active / Athlete', desc: 'Heavy training, physically demanding job' }
                  ].map(act => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, activityLevel: act.id })}
                      className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                        formData.activityLevel === act.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <p className="font-bold text-xs">{act.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{act.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Sleep */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Sleep Duration: {formData.sleepTargetHours} Hours
                </label>
                <input
                  type="range"
                  min="6.0"
                  max="10.0"
                  step="0.5"
                  value={formData.sleepTargetHours}
                  onChange={(e) => setFormData({ ...formData, sleepTargetHours: Number(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>6.0 hrs</span>
                  <span>8.0 hrs (Recommended)</span>
                  <span>10.0 hrs</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Wellness Goals */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  What are your primary wellness goals?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select 1 to 3 focus areas to calibrate your daily recommendations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { id: 'energy', label: 'Sustained Daily Energy', desc: 'Smooth glucose curves without crashes' },
                  { id: 'better_sleep', label: 'Restful Sleep Recovery', desc: 'Deeper REM and faster sleep onset' },
                  { id: 'muscle_tone', label: 'Muscle Tone & Strength', desc: 'Optimal amino acids and protein synthesis' },
                  { id: 'gut_health', label: 'Gut Microbiome Vitality', desc: 'Prebiotics, probiotics, and fiber' },
                  { id: 'stress_reduction', label: 'Stress & Nervous System Balance', desc: 'Parasympathetic breath and adaptogens' },
                  { id: 'weight_management', label: 'Metabolic & Weight Health', desc: 'Caloric balance with high nutrient density' }
                ].map(goal => {
                  const isSelected = formData.wellnessGoals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => toggleArrayItem('wellnessGoals', goal.id)}
                      className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{goal.label}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">{goal.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Meal Routine & Cooking Style */}
          {step === 5 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Meal Routine &amp; Preparation Style
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  So recommendations fit effortlessly into your work and home schedule.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Cooking Time Availability
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'quick_15min', label: 'Fast & Simple', desc: '10 - 15 minutes max' },
                    { id: 'quick_30min', label: 'Moderate', desc: '20 - 30 minutes' },
                    { id: 'meal_prep', label: 'Batch Meal Prep', desc: 'Cook ahead on weekends' }
                  ].map(time => (
                    <button
                      key={time.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, cookingTimePreference: time.id })}
                      className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                        formData.cookingTimePreference === time.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <p className="font-bold text-xs">{time.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{time.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-xs space-y-2 text-emerald-900">
                <div className="flex items-center gap-2 font-bold">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Ready to Generate Your Personalized Wellness Intelligence</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  IntelWell will build today's Wellness Score baseline, curated meal recommendations, and explainable action plan.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <Button
                variant="secondary"
                size="md"
                icon={ArrowLeft}
                onClick={handleBack}
              >
                Back
              </Button>
            ) : <div />}

            <Button
              variant="primary"
              size="md"
              iconRight={step === 5 ? Sparkles : ArrowRight}
              onClick={handleNext}
            >
              {step === 5 ? 'Launch My Dashboard' : 'Next Step'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
