import React, { useState } from 'react';
import { useMeals } from '../../context/MealContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input, Select } from '../../components/common/Input';
import { 
  ShoppingCart, 
  Check, 
  Trash2, 
  Plus, 
  Share2, 
  CheckCircle2, 
  Copy, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export function SmartGroceryPage({ onNavigateToMeals }) {
  const { 
    groceryList, 
    groupedGrocery, 
    toggleGroceryItem, 
    addCustomGroceryItem, 
    removeGroceryItem, 
    clearCheckedGroceryItems, 
    exportGroceryText,
    addAllTodayMealsToGrocery
  } = useMeals();

  const [customName, setCustomName] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [customUnit, setCustomUnit] = useState('');
  const [customDept, setCustomDept] = useState('Produce');
  const [copied, setCopied] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const totalItems = groceryList.length;
  const checkedItems = groceryList.filter(i => i.checked).length;
  const progressPercent = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;
    addCustomGroceryItem(customName, customAmount, customUnit, customDept);
    setCustomName('');
    setCustomAmount('');
    setCustomUnit('');
    setShowAddForm(false);
  };

  const handleCopyClipboard = () => {
    const text = exportGroceryText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Smart Grocery List
            </h1>
            <Badge variant="emerald" size="sm">
              {totalItems} Items
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ingredients organized by supermarket aisle for fast, frictionless shopping.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="md"
            icon={copied ? CheckCircle2 : Copy}
            onClick={handleCopyClipboard}
          >
            {copied ? 'Copied to Clipboard!' : 'Copy List'}
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            Add Custom Item
          </Button>
        </div>
      </div>

      {/* Progress Bar & Quick Stats */}
      {totalItems > 0 && (
        <Card className="p-4 bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-700">
              Shopping Progress: {checkedItems} of {totalItems} items picked
            </span>
            <span className="font-bold text-emerald-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {checkedItems > 0 && (
            <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={clearCheckedGroceryItems}
                className="text-xs text-rose-600 font-medium hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear {checkedItems} Purchased Items</span>
              </button>
            </div>
          )}
        </Card>
      )}

      {/* Add Custom Item Collapsible Form */}
      {showAddForm && (
        <Card className="p-6 bg-slate-50 border border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
            Add Custom Ingredient or Household Item
          </h3>
          <form onSubmit={handleAddCustom} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <Input
                placeholder="Item name (e.g. Organic Rolled Oats)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                placeholder="Qty (e.g. 1 bag)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />
            </div>
            <div>
              <select
                value={customDept}
                onChange={(e) => setCustomDept(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="Produce">Produce</option>
                <option value="Protein">Protein &amp; Meat</option>
                <option value="Pantry">Pantry &amp; Grains</option>
                <option value="Dairy/Alternatives">Dairy / Plant Milks</option>
                <option value="Seasonings">Seasonings &amp; Oils</option>
                <option value="Other">Other Household</option>
              </select>
            </div>
            <div className="sm:col-span-4 flex justify-end gap-2 pt-2">
              <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" variant="primary">
                Add to List
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Empty State */}
      {totalItems === 0 ? (
        <Card className="p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <ShoppingCart className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Your grocery list is empty</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Generate a supermarket-ready list directly from your personalized meal plan with one click.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <Button
              variant="primary"
              size="md"
              icon={Sparkles}
              onClick={addAllTodayMealsToGrocery}
            >
              Generate from Today's Meals
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={onNavigateToMeals}
            >
              Browse Recipes
            </Button>
          </div>
        </Card>
      ) : (
        /* Department Groups */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedGrocery).map(([department, items]) => {
            if (items.length === 0) return null;
            return (
              <Card key={department} className="p-5 space-y-3 bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{department}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="space-y-2">
                  {items.map(item => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                        item.checked
                          ? 'bg-slate-50/80 border-slate-200 text-slate-400 line-through'
                          : 'bg-white border-slate-100 hover:border-slate-200 text-slate-800'
                      }`}
                    >
                      <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 select-none">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleGroceryItem(item.id)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                        />
                        <div className="truncate">
                          <span className="text-xs font-semibold">{item.name}</span>
                          {item.amount && (
                            <span className="text-[11px] text-slate-400 ml-1.5 font-normal">
                              ({item.amount} {item.unit})
                            </span>
                          )}
                        </div>
                      </label>

                      <button
                        onClick={() => removeGroceryItem(item.id)}
                        className="text-slate-300 hover:text-rose-500 p-1 rounded transition-colors"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
