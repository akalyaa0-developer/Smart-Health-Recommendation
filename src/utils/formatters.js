/**
 * Formatting and Helper Utilities for IntelWell
 */

export function getTimeGreeting(name) {
  const hour = new Date().getHours();
  let timeStr = 'Good morning';
  if (hour >= 12 && hour < 17) {
    timeStr = 'Good afternoon';
  } else if (hour >= 17 || hour < 4) {
    timeStr = 'Good evening';
  }
  return name ? `${timeStr}, ${name}` : timeStr;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatRelativeDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export function formatMacro(grams, label) {
  return `${grams}g ${label}`;
}

export function getDietaryBadgeClass(tag) {
  const map = {
    'vegan': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'vegetarian': 'bg-teal-50 text-teal-700 border-teal-200',
    'gluten-free': 'bg-amber-50 text-amber-700 border-amber-200',
    'dairy-free': 'bg-sky-50 text-sky-700 border-sky-200',
    'high-protein': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'keto': 'bg-purple-50 text-purple-700 border-purple-200',
    'low-carb': 'bg-blue-50 text-blue-700 border-blue-200',
    'heart-healthy': 'bg-rose-50 text-rose-700 border-rose-200'
  };
  return map[tag?.toLowerCase()] || 'bg-slate-100 text-slate-700 border-slate-200';
}
