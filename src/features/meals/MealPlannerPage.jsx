import React, { useState } from 'react';
import { useMeals } from '../../context/MealContext';
import { useWellness } from '../../context/WellnessContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { INITIAL_MEALS } from '../../data/initialMeals';
import { getDietaryBadgeClass } from '../../utils/formatters';
import { 
  Utensils, 
  ShoppingCart, 
  RotateCw, 
  Search, 
  Clock, 
  Flame, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle,
  Bookmark,
  ChevronRight
} from 'lucide-react';

export function MealPlannerPage() {
  const { userProfile } = useAuth();
  const { activeMeals, swapMeal, addMealIngredients, addAllTodayMealsToGrocery, toggleSaveMeal, savedMeals } = useMeals();
  const { setExplainItem } = useWellness();

  const [selectedMealDetail, setSelectedMealDetail] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedGroceryFeedback, setAddedGroceryFeedback] = useState(null);

  const handleAddToGrocery = (meal) => {
    addMealIngredients(meal);
    setAddedGroceryFeedback(meal.id);
    setTimeout(() => setAddedGroceryFeedback(null), 1800);
  };

  const handleAddAll = () => {
    addAllTodayMealsToGrocery();
    setAddedGroceryFeedback('all');
    setTimeout(() => setAddedGroceryFeedback(null), 1800);
  };

  const filteredMeals = INITIAL_MEALS.filter(meal => {
    if (filterType !== 'all' && meal.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = meal.title.toLowerCase().includes(q);
      const matchIng = meal.ingredients.some(i => i.name.toLowerCase().includes(q));
      if (!matchTitle && !matchIng) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Batch Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Adaptive Meal Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Personalized to your {userProfile?.dietaryPreference} dietary profile and daily metabolic requirements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            icon={ShoppingCart}
            onClick={handleAddAll}
          >
            {addedGroceryFeedback === 'all' ? 'Added Today’s Plan!' : 'Add All Meals to Grocery'}
          </Button>
        </div>
      </div>

      {/* Today's Active Plan Bar */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Today's Curated Rotation
            </h2>
          </div>
          <span className="text-xs text-emerald-800 font-medium">
            Allergen-safe &amp; macro-aligned
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['breakfast', 'lunch', 'dinner', 'snack'].map(slot => {
            const meal = activeMeals[slot];
            if (!meal) return null;
            return (
              <div 
                key={slot}
                className="bg-white rounded-2xl p-3 border border-emerald-100 shadow-2xs flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <img src={meal.image} alt={meal.title} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">{slot}</span>
                    <p className="text-xs font-bold text-slate-900 truncate">{meal.title}</p>
                    <p className="text-[11px] text-slate-500">{meal.calories} kcal</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => swapMeal(slot)}
                    className="text-slate-500 hover:text-emerald-700 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Swap</span>
                  </button>
                  <button
                    onClick={() => setSelectedMealDetail(meal)}
                    className="text-emerald-600 hover:underline text-[11px] font-bold cursor-pointer"
                  >
                    Recipe Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
        {/* Type Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Recipes' },
            { id: 'breakfast', label: 'Breakfast' },
            { id: 'lunch', label: 'Lunch' },
            { id: 'dinner', label: 'Dinner' },
            { id: 'snack', label: 'Healthy Snacks' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search recipes or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeals.map(meal => {
          const isSaved = savedMeals.some(m => m.id === meal.id);
          return (
            <Card key={meal.id} className="p-0 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src={meal.image}
                  alt={meal.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-slate-800 shadow-2xs">
                  {meal.type}
                </span>
                <button
                  onClick={() => toggleSaveMeal(meal)}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
                    isSaved ? 'bg-amber-500 text-white' : 'bg-white/90 text-slate-600 hover:text-amber-600'
                  }`}
                  title={isSaved ? 'Saved' : 'Save'}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {meal.dietaryTags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getDietaryBadgeClass(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {meal.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-semibold text-emerald-700">
                      <Flame className="w-3.5 h-3.5 text-emerald-600" />
                      {meal.calories} kcal
                    </span>
                    <span>•</span>
                    <span>{meal.proteinGrams}g Protein</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {meal.prepTimeMinutes}m
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {meal.whyRecommendedRationale}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedMealDetail(meal)}
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Recipe</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <Button
                    size="sm"
                    variant={addedGroceryFeedback === meal.id ? 'primary' : 'outline'}
                    icon={ShoppingCart}
                    onClick={() => handleAddToGrocery(meal)}
                    className="text-xs"
                  >
                    {addedGroceryFeedback === meal.id ? 'Added!' : '+ Grocery'}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recipe Detail Modal */}
      {selectedMealDetail && (
        <Modal
          isOpen={Boolean(selectedMealDetail)}
          onClose={() => setSelectedMealDetail(null)}
          title={selectedMealDetail.title}
          subtitle={`${selectedMealDetail.type.toUpperCase()} • ${selectedMealDetail.prepTimeMinutes} mins prep`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="h-56 w-full rounded-2xl overflow-hidden">
              <img
                src={selectedMealDetail.image}
                alt={selectedMealDetail.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Macros bar */}
            <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs text-slate-400 font-medium">Calories</span>
                <p className="text-sm font-extrabold text-slate-800">{selectedMealDetail.calories}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Protein</span>
                <p className="text-sm font-extrabold text-emerald-600">{selectedMealDetail.proteinGrams}g</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Carbs</span>
                <p className="text-sm font-extrabold text-teal-600">{selectedMealDetail.carbsGrams}g</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Fats</span>
                <p className="text-sm font-extrabold text-amber-600">{selectedMealDetail.fatGrams}g</p>
              </div>
            </div>

            {/* Why Recommended */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs">
              <span className="font-bold text-emerald-900 block mb-1">Why IntelWell Recommended This:</span>
              <p className="text-slate-700 leading-relaxed">{selectedMealDetail.whyRecommendedRationale}</p>
            </div>

            {/* Ingredients */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Ingredients ({selectedMealDetail.ingredients.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedMealDetail.ingredients.map((ing, i) => (
                  <div key={i} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-800 font-medium">{ing.name}</span>
                    <span className="text-slate-500">{ing.amount} {ing.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Preparation Instructions
              </h4>
              <ol className="space-y-2 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
                {selectedMealDetail.instructions.map((step, idx) => (
                  <li key={idx} className="p-1.5">{step}</li>
                ))}
              </ol>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setExplainItem(selectedMealDetail);
                  setSelectedMealDetail(null);
                }}
                className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Explain Why Recommended</span>
              </button>

              <Button
                variant="primary"
                size="md"
                icon={ShoppingCart}
                onClick={() => {
                  handleAddToGrocery(selectedMealDetail);
                  setSelectedMealDetail(null);
                }}
              >
                Add Ingredients to Grocery List
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
