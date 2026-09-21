/**
 * Meal & Smart Grocery List Context for IntelWell
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useWellness } from './WellnessContext';
import { getAlternativeMeal } from '../services/recommendationEngine';
import { 
  getStoredGroceryList, 
  saveGroceryList, 
  addMealToGroceryList, 
  groupGroceryByDepartment, 
  formatGroceryListForExport 
} from '../services/groceryService';

const MealContext = createContext(null);

export function MealProvider({ children }) {
  const { currentUser, userProfile } = useAuth();
  const { recommendedMeals: initialRecommendedMeals } = useWellness();
  const [activeMeals, setActiveMeals] = useState({});
  const [savedMeals, setSavedMeals] = useState([]);
  const [groceryList, setGroceryList] = useState([]);

  const userId = currentUser?.uid || currentUser?.id || null;

  // Synchronize initial recommended meals
  useEffect(() => {
    if (initialRecommendedMeals) {
      setActiveMeals(initialRecommendedMeals);
    }
  }, [initialRecommendedMeals]);

  // Load grocery list & saved meals
  useEffect(() => {
    if (userId) {
      const storedGrocery = getStoredGroceryList(userId);
      setGroceryList(storedGrocery);

      try {
        const storedSaved = localStorage.getItem(`intelwell_saved_meals_${userId}`);
        if (storedSaved) setSavedMeals(JSON.parse(storedSaved));
        else setSavedMeals([]);
      } catch (e) {
        console.error(e);
        setSavedMeals([]);
      }
    } else {
      setGroceryList([]);
      setSavedMeals([]);
    }
  }, [userId]);

  // Swap a meal slot
  const swapMeal = (mealType) => {
    const currentMeal = activeMeals[mealType];
    const alternative = getAlternativeMeal(mealType, currentMeal?.id, userProfile);
    setActiveMeals(prev => ({
      ...prev,
      [mealType]: alternative
    }));
    return alternative;
  };

  // Save / favorite a meal
  const toggleSaveMeal = (meal) => {
    if (!userId) return;
    const isSaved = savedMeals.some(m => m.id === meal.id);
    let updated;
    if (isSaved) {
      updated = savedMeals.filter(m => m.id !== meal.id);
    } else {
      updated = [meal, ...savedMeals];
    }
    setSavedMeals(updated);
    try {
      localStorage.setItem(`intelwell_saved_meals_${userId}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Add meal ingredients to grocery list
  const addMealIngredients = (meal) => {
    if (!userId) return;
    const updated = addMealToGroceryList(groceryList, meal);
    setGroceryList(updated);
    saveGroceryList(userId, updated);
  };

  // Add all today's meals to grocery list
  const addAllTodayMealsToGrocery = () => {
    if (!userId) return;
    let current = [...groceryList];
    Object.values(activeMeals).forEach(meal => {
      if (meal) {
        current = addMealToGroceryList(current, meal);
      }
    });
    setGroceryList(current);
    saveGroceryList(userId, current);
  };

  // Toggle item checked in grocery list
  const toggleGroceryItem = (itemId) => {
    if (!userId) return;
    const updated = groceryList.map(item => {
      if (item.id === itemId) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    setGroceryList(updated);
    saveGroceryList(userId, updated);
  };

  // Add custom manual item to grocery list
  const addCustomGroceryItem = (name, amount, unit, department = 'Other') => {
    if (!userId || !name || !name.trim()) return;
    const newItem = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      amount: amount || '',
      unit: unit || '',
      department: department || 'Other',
      checked: false,
      sourceMeals: ['Custom Entry']
    };
    const updated = [newItem, ...groceryList];
    setGroceryList(updated);
    saveGroceryList(userId, updated);
  };

  // Delete item from grocery list
  const removeGroceryItem = (itemId) => {
    if (!userId) return;
    const updated = groceryList.filter(item => item.id !== itemId);
    setGroceryList(updated);
    saveGroceryList(userId, updated);
  };

  // Clear all checked items
  const clearCheckedGroceryItems = () => {
    if (!userId) return;
    const updated = groceryList.filter(item => !item.checked);
    setGroceryList(updated);
    saveGroceryList(userId, updated);
  };

  // Export list string
  const exportGroceryText = () => {
    return formatGroceryListForExport(groceryList);
  };

  const groupedGrocery = groupGroceryByDepartment(groceryList);

  const value = {
    activeMeals,
    savedMeals,
    groceryList,
    groupedGrocery,
    swapMeal,
    toggleSaveMeal,
    addMealIngredients,
    addAllTodayMealsToGrocery,
    toggleGroceryItem,
    addCustomGroceryItem,
    removeGroceryItem,
    clearCheckedGroceryItems,
    exportGroceryText
  };

  return <MealContext.Provider value={value}>{children}</MealContext.Provider>;
}

export function useMeals() {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error('useMeals must be used within a MealProvider');
  }
  return context;
}
