import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWellness } from '../../context/WellnessContext';
import { useMeals } from '../../context/MealContext';
import { Card, CardHeader } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ScoreGauge } from '../../components/common/ScoreGauge';
import { getTimeGreeting, formatDate, getDietaryBadgeClass } from '../../utils/formatters';
import { 
  Sparkles, 
  HelpCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Droplets, 
  Moon, 
  Activity, 
  Utensils, 
  CalendarCheck, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  RotateCw, 
  ShoppingCart, 
  MessageSquareHeart, 
  Flame, 
  ShieldCheck,
  Bookmark,
  Share2
} from 'lucide-react';

export function Dashboard({ onOpenAssessment, onNavigate }) {
  const { userProfile } = useAuth();
  const { 
    todayAssessment, 
    wellnessScoreData, 
    recommendations, 
    setExplainItem, 
    quickLogWater, 
    submitFeedback,
    streakDays 
  } = useWellness();
  const { activeMeals, swapMeal, addMealIngredients, toggleSaveMeal, savedMeals } = useMeals();

  const [feedbackSuccessId, setFeedbackSuccessId] = useState(null);
  const [addedGroceryMealId, setAddedGroceryMealId] = useState(null);

  const greeting = getTimeGreeting(userProfile?.name?.split(' ')[0] || 'Friend');
  const targetWater = userProfile?.targetWaterLiters || 2.5;
  const currentWater = todayAssessment?.waterLiters || 0;
  const waterPercent = Math.min(100, Math.round((currentWater / targetWater) * 100));

  const primaryRec = recommendations?.[0];

  const handleQuickFeedback = (rec, type) => {
    submitFeedback(rec, type);
    setFeedbackSuccessId(rec.id);
    setTimeout(() => setFeedbackSuccessId(null), 1800);
  };

  const handleAddMealToGrocery = (meal) => {
    addMealIngredients(meal);
    setAddedGroceryMealId(meal.id);
    setTimeout(() => setAddedGroceryMealId(null), 1800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner & Daily Assessment Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active Goal: {userProfile?.wellnessGoals?.[0]?.replace('_', ' ') || 'Vibrant Vitality'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-white">
            {greeting}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            {todayAssessment 
              ? `Today's check-in recorded! Your body is currently operating at an estimated ${wellnessScoreData.score}/100 wellness balance.`
              : "You haven't completed today's wellness check-in yet. Take 60 seconds to calibrate your daily recommendations."
            }
          </p>
        </div>

        {/* Action Button */}
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            variant="accent"
            size="lg"
            icon={CalendarCheck}
            onClick={onOpenAssessment}
            className="shadow-md"
          >
            {todayAssessment ? 'Update Check-in' : 'Complete Daily Check-in'}
          </Button>
        </div>
      </div>

      {/* 2. Key Metrics Row: Wellness Score + Today's Primary Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Wellness Score Card (4 Cols) */}
        <Card className="lg:col-span-4 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Daily Wellness Score
              </h2>
              <Badge variant="emerald" size="sm">
                {streakDays} Day Streak 🔥
              </Badge>
            </div>

            <ScoreGauge scoreData={wellnessScoreData} />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Transparent inputs</span>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-emerald-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Trends</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>

        {/* Primary Recommendation Card with "Why am I seeing this?" (8 Cols) */}
        <Card className="lg:col-span-8 p-6 flex flex-col justify-between bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 border-emerald-100">
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  Today’s High-Impact Recommendation
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                  {primaryRec?.title || 'Prioritize Hydration & Nervous System Balance'}
                </h3>
              </div>
              <Badge variant="emerald" size="md" icon={Sparkles}>
                {primaryRec?.confidence || 94}% Relevance
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              {primaryRec?.actionText || 'Take a conscious 300ml glass of water with electrolytes before midday.'}
            </p>

            {/* "Why am I seeing this?" Trigger Card */}
            <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Why am I seeing this recommendation?
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {primaryRec?.whyFactors?.[0] || 'Triggered by your latest assessment metrics and dietary goals.'}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setExplainItem(primaryRec)}
                className="shrink-0 font-bold"
              >
                Inspect Data Factors
              </Button>
            </div>
          </div>

          {/* Feedback loop footer */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Was this actionable for you?</span>
            {feedbackSuccessId === primaryRec?.id ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Feedback recorded! Engine adapting...
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  icon={ThumbsUp}
                  onClick={() => handleQuickFeedback(primaryRec, 'helpful')}
                >
                  Helpful
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  icon={ThumbsDown}
                  onClick={() => setExplainItem(primaryRec)}
                >
                  Not Helpful
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* 3. Quick Habit Widgets: Water Tracker, Rest & Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hydration Tracker */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Hydration</h3>
                <p className="text-[11px] text-slate-400">Target: {targetWater}L / day</p>
              </div>
            </div>
            <span className="text-sm font-bold text-sky-600">{currentWater} L</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-3">
            <div 
              className="bg-sky-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${waterPercent}%` }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              icon={Plus}
              onClick={() => quickLogWater(0.25)}
              className="w-full text-xs"
            >
              +250 ml
            </Button>
            <Button
              size="sm"
              variant="secondary"
              icon={Plus}
              onClick={() => quickLogWater(0.5)}
              className="w-full text-xs"
            >
              +500 ml
            </Button>
          </div>
        </Card>

        {/* Rest & Sleep Insight */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Sleep Recovery</h3>
                <p className="text-[11px] text-slate-400">
                  {todayAssessment?.sleepHours ? `${todayAssessment.sleepHours} hrs logged` : 'Target: 8.0 hrs'}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {todayAssessment?.sleepHours && todayAssessment.sleepHours < 7.0
                ? 'Your sleep duration was slightly below target. Avoid late afternoon caffeine to rebuild restorative deep sleep.'
                : 'Optimal recovery logged. Deep restorative cycles promote stable hormone and glucose control.'
              }
            </p>
          </div>
          <div className="pt-2 text-[11px] text-indigo-600 font-semibold">
            Tip: Wind down 45m before bed
          </div>
        </Card>

        {/* Physical Movement */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Movement</h3>
                <p className="text-[11px] text-slate-400">
                  {todayAssessment?.activityMinutes ? `${todayAssessment.activityMinutes} mins active` : 'Target: 30-45 mins'}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Light post-meal walks stimulate skeletal muscle GLUT4 glucose uptake, keeping afternoon energy steady.
            </p>
          </div>
          <div className="pt-2 text-[11px] text-emerald-600 font-semibold">
            Recommendation: 12 min post-lunch stroll
          </div>
        </Card>
      </div>

      {/* 4. Today's Meal Suggestions (Breakfast, Lunch, Dinner, Snack) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Today's Personalized Meals
            </h2>
            <p className="text-xs text-slate-500">
              Calibrated to {userProfile?.dietaryPreference} nutrition with allergen-safe ingredients
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Utensils}
              onClick={() => onNavigate('meals')}
            >
              Open Full Meal Planner
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['breakfast', 'lunch', 'dinner', 'snack'].map(slot => {
            const meal = activeMeals[slot];
            if (!meal) return null;

            const isSaved = savedMeals.some(m => m.id === meal.id);

            return (
              <Card key={slot} className="p-0 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                  <img
                    src={meal.image}
                    alt={meal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-slate-800 shadow-2xs">
                      {slot}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleSaveMeal(meal)}
                    className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-colors ${
                      isSaved ? 'bg-amber-500 text-white' : 'bg-white/90 text-slate-600 hover:text-amber-600'
                    }`}
                    title={isSaved ? 'Saved to Favorites' : 'Save Meal'}
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {meal.title}
                    </h4>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                      {meal.calories} kcal • {meal.proteinGrams}g Protein • {meal.prepTimeMinutes} mins
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {meal.whyRecommendedRationale}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={RotateCw}
                        onClick={() => swapMeal(slot)}
                        className="w-1/2 text-[11px] py-1"
                        title="Swap with another eligible recipe"
                      >
                        Swap
                      </Button>
                      <Button
                        size="sm"
                        variant={addedGroceryMealId === meal.id ? 'primary' : 'outline'}
                        icon={ShoppingCart}
                        onClick={() => handleAddMealToGrocery(meal)}
                        className="w-1/2 text-[11px] py-1 truncate"
                      >
                        {addedGroceryMealId === meal.id ? 'Added!' : '+ Grocery'}
                      </Button>
                    </div>

                    <button
                      onClick={() => setExplainItem(meal)}
                      className="w-full text-center text-[10px] text-slate-400 hover:text-emerald-700 font-medium cursor-pointer"
                    >
                      Why this meal?
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 5. Quick Access Grid (AI Assistant & Trusted Assistance) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Chat with Assistant promo */}
        <div 
          onClick={() => onNavigate('assistant')}
          className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md cursor-pointer hover:shadow-lg transition-all group flex items-center justify-between"
        >
          <div className="space-y-2 max-w-sm">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquareHeart className="w-4 h-4" />
              <span>AI Wellness Companion</span>
            </span>
            <h3 className="text-lg font-bold group-hover:text-emerald-300 transition-colors">
              Have a nutrition or hydration question?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ask about snack ideas, post-workout recovery, or sleep protocols with complete privacy.
            </p>
          </div>
          <ArrowRight className="w-6 h-6 text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0" />
        </div>

        {/* Trusted Contact Assistance Quick Access */}
        <div 
          onClick={() => onNavigate('contacts')}
          className="p-6 rounded-3xl bg-rose-50/70 border border-rose-200 text-rose-900 shadow-xs cursor-pointer hover:shadow-md transition-all group flex items-center justify-between"
        >
          <div className="space-y-2 max-w-sm">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Safety &amp; Trusted Contacts</span>
            </span>
            <h3 className="text-lg font-bold group-hover:text-rose-700 transition-colors">
              User-Controlled Assistance
            </h3>
            <p className="text-xs text-rose-800/80 leading-relaxed">
              Manage your emergency contacts and trigger an explicit status alert if you ever need support.
            </p>
          </div>
          <ArrowRight className="w-6 h-6 text-rose-600 group-hover:translate-x-1 transition-transform shrink-0" />
        </div>
      </div>
    </div>
  );
}
