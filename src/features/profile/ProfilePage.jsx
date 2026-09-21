import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWellness } from '../../context/WellnessContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { calculateBMI, calculateWaterTarget } from '../../utils/biometrics';
import { 
  User, 
  Heart, 
  Utensils, 
  Bell, 
  ShieldCheck, 
  Download, 
  LogOut, 
  CheckCircle2,
  Lock,
  Sparkles
} from 'lucide-react';

export function ProfilePage({ onSignOut }) {
  const { userProfile, updateProfileData, logout, currentUser } = useAuth();
  const { assessments, feedbackHistory } = useWellness();

  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    age: userProfile?.age || 30,
    gender: userProfile?.gender || 'female',
    heightCm: userProfile?.heightCm || 170,
    weightKg: userProfile?.weightKg || 65,
    dietaryPreference: userProfile?.dietaryPreference || 'vegetarian',
    allergies: userProfile?.allergies || [],
    activityLevel: userProfile?.activityLevel || 'moderate',
    wellnessGoals: userProfile?.wellnessGoals || ['energy'],
    targetWaterLiters: userProfile?.targetWaterLiters || 2.5
  });

  const [notificationSettings, setNotificationSettings] = useState(
    userProfile?.notificationPreferences || {
      hydration: true,
      meals: true,
      assessment: true,
      weeklySummary: true
    }
  );

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const bmiData = calculateBMI(formData.weightKg, formData.heightCm);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const newWater = calculateWaterTarget(formData.weightKg, formData.activityLevel);

    await updateProfileData({
      ...formData,
      targetWaterLiters: newWater,
      notificationPreferences: notificationSettings
    });

    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const toggleAllergy = (allergen) => {
    const lower = allergen.toLowerCase();
    const current = formData.allergies || [];
    const exists = current.includes(lower);
    setFormData({
      ...formData,
      allergies: exists ? current.filter(a => a !== lower) : [...current, lower]
    });
  };

  const toggleGoal = (goalId) => {
    const current = formData.wellnessGoals || [];
    const exists = current.includes(goalId);
    setFormData({
      ...formData,
      wellnessGoals: exists ? current.filter(g => g !== goalId) : [...current, goalId]
    });
  };

  const handleExportData = () => {
    const exportBlob = {
      exportedAt: new Date().toISOString(),
      user: {
        id: currentUser?.uid,
        email: currentUser?.email,
        profile: formData
      },
      assessmentsCount: assessments.length,
      assessments,
      feedbackHistory
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportBlob, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `intelwell_health_data_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Profile &amp; Settings
            </h1>
            <Badge variant="emerald" size="sm">
              Private
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your biometric baselines, active wellness goals, and privacy permissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            icon={Download}
            onClick={handleExportData}
          >
            Export My Data (JSON)
          </Button>
          <Button
            variant="ghost"
            size="md"
            icon={LogOut}
            onClick={() => {
              logout();
              onSignOut();
            }}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Profile changes saved successfully! Future recommendations are calibrated.</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* 1. Biometrics Card */}
        <Card className="p-6 bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-600" />
              <span>Biometric Baselines</span>
            </h2>
            {bmiData && (
              <span className="text-xs text-slate-500">
                BMI: <strong>{bmiData.bmi}</strong> ({bmiData.category})
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
              required
            />
            <Input
              label="Height (cm)"
              type="number"
              value={formData.heightCm}
              onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
              required
            />
            <Input
              label="Weight (kg)"
              type="number"
              value={formData.weightKg}
              onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
              required
            />
          </div>
        </Card>

        {/* 2. Dietary Pattern & Allergens */}
        <Card className="p-6 bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-emerald-600" />
              <span>Dietary Framework &amp; Strict Allergens</span>
            </h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Dietary Preference
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'mediterranean', 'keto'].map(diet => (
                <button
                  key={diet}
                  type="button"
                  onClick={() => setFormData({ ...formData, dietaryPreference: diet })}
                  className={`p-2.5 rounded-xl border text-left capitalize font-semibold transition-all cursor-pointer ${
                    formData.dietaryPreference === diet
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Strict Allergens to Exclude
            </label>
            <div className="flex flex-wrap gap-2">
              {['peanuts', 'tree nuts', 'dairy', 'gluten', 'shellfish', 'eggs', 'soy', 'sesame'].map(allergen => {
                const isSelected = formData.allergies.includes(allergen.toLowerCase());
                return (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => toggleAllergy(allergen)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {isSelected ? '✕ ' : '+ '}{allergen}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* 3. Wellness Goals */}
        <Card className="p-6 bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-emerald-600" />
              <span>Active Wellness Goals</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              { id: 'energy', label: 'Sustained Daily Energy' },
              { id: 'better_sleep', label: 'Restful Sleep Recovery' },
              { id: 'muscle_tone', label: 'Muscle Tone & Strength' },
              { id: 'gut_health', label: 'Gut Microbiome Vitality' },
              { id: 'stress_reduction', label: 'Stress & Nervous System Balance' },
              { id: 'weight_management', label: 'Metabolic & Weight Health' }
            ].map(goal => {
              const isSelected = formData.wellnessGoals.includes(goal.id);
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-3 rounded-xl border text-left font-semibold transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span>{goal.label}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </Card>

        {/* 4. Notification Settings */}
        <Card className="p-6 bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-emerald-600" />
              <span>In-App Reminders &amp; Notification Controls</span>
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { id: 'hydration', label: 'Midday Hydration Prompts', desc: 'Alerts when water intake falls behind daily target' },
              { id: 'assessment', label: 'Daily Assessment Reflection', desc: 'Gentle evening reminder to record daily vitality telemetry' },
              { id: 'meals', label: 'Meal Preparation Reminders', desc: 'Notifies when recommended meals are ready to prep' },
              { id: 'weeklySummary', label: 'Weekly AI Summary Ready', desc: 'Alerts when your 7-day executive summary is published' }
            ].map(notif => (
              <div key={notif.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50">
                <div>
                  <p className="font-bold text-slate-800">{notif.label}</p>
                  <p className="text-[11px] text-slate-500">{notif.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(notificationSettings[notif.id])}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    [notif.id]: e.target.checked
                  })}
                  className="w-4 h-4 accent-emerald-600 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={saving}
            icon={CheckCircle2}
            className="shadow-md"
          >
            Save All Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
