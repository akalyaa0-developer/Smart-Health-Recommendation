/**
 * Smart Grocery List Service for IntelWell
 * 
 * Aggregates ingredients from recommended meals and weekly plans,
 * organizes by supermarket aisle/department, and manages purchase state.
 */

const GROCERY_STORAGE_KEY = 'intelwell_grocery_list';

export function getStoredGroceryList(userId = 'default') {
  try {
    const raw = localStorage.getItem(`${GROCERY_STORAGE_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error loading grocery list', e);
    return [];
  }
}

export function saveGroceryList(userId = 'default', list) {
  try {
    localStorage.setItem(`${GROCERY_STORAGE_KEY}_${userId}`, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving grocery list', e);
  }
}

export function addMealToGroceryList(currentList = [], meal) {
  if (!meal || !meal.ingredients) return currentList;

  const updatedList = [...currentList];

  meal.ingredients.forEach(ingredient => {
    // Check if item already exists by name
    const existingIndex = updatedList.findIndex(
      item => item.name.toLowerCase() === ingredient.name.toLowerCase()
    );

    if (existingIndex > -1) {
      // If units match, combine quantities
      const existing = updatedList[existingIndex];
      if (existing.unit === ingredient.unit && typeof existing.amount === 'number') {
        updatedList[existingIndex] = {
          ...existing,
          amount: Math.round((existing.amount + ingredient.amount) * 10) / 10,
          sourceMeals: Array.from(new Set([...(existing.sourceMeals || []), meal.title]))
        };
      } else {
        updatedList[existingIndex] = {
          ...existing,
          sourceMeals: Array.from(new Set([...(existing.sourceMeals || []), meal.title]))
        };
      }
    } else {
      updatedList.push({
        id: `grocery-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        department: ingredient.department || 'Pantry',
        checked: false,
        sourceMeals: [meal.title]
      });
    }
  });

  return updatedList;
}

export function groupGroceryByDepartment(groceryList = []) {
  const departments = ['Produce', 'Protein', 'Pantry', 'Dairy/Alternatives', 'Seasonings', 'Other'];
  const grouped = {};

  departments.forEach(dept => {
    grouped[dept] = [];
  });

  groceryList.forEach(item => {
    const dept = item.department || 'Other';
    if (!grouped[dept]) grouped[dept] = [];
    grouped[dept].push(item);
  });

  return grouped;
}

export function formatGroceryListForExport(groceryList = []) {
  const grouped = groupGroceryByDepartment(groceryList);
  let text = `IntelWell Smart Grocery List\nGenerated: ${new Date().toLocaleDateString()}\n-------------------------------------\n\n`;

  Object.entries(grouped).forEach(([dept, items]) => {
    if (items.length > 0) {
      text += `[${dept.toUpperCase()}]\n`;
      items.forEach(item => {
        const checkMark = item.checked ? '[x]' : '[ ]';
        const amountStr = item.amount ? `${item.amount} ${item.unit || ''} ` : '';
        text += `${checkMark} ${amountStr}${item.name}\n`;
      });
      text += '\n';
    }
  });

  return text;
}
