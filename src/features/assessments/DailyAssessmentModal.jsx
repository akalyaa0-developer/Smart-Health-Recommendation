import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWellness } from '../../context/WellnessContext';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { evaluateEmergencyRisk } from '../../utils/safetyValidator';
import { 
  Zap, 
  Smile, 
  Moon, 
  Droplets, 
  Activity, 
  Utensils, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert,
  PhoneCall
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function DailyAssessmentModal({ isOpen, onClose, onAssessmentSaved }) {
  const { userProfile } = useAuth();
  const { todayAssessment, submitDailyAssessment } = useWellness();

  const [formData, setFormData] = useState({
    energyLevel: todayAssessment?.energyLevel || 7,
    mood: todayAssessment?.mood || 'Energized',
    sleepHours: todayAssessment?.sleepHours || 7.5,
    sleepQuality: todayAssessment?.sleepQuality || 4,
    waterLiters: todayAssessment?.waterLiters || 1.8,
    activityMinutes: todayAssessment?.activityMinutes || 30,
    activityIntensity: todayAssessment?.activityIntensity || 'moderate',
    mealConsistency: todayAssessment?.mealConsistency || 'balanced',
    stressLevel: todayAssessment?.stressLevel || 2,
    notes: todayAssessment?.notes || ''
  });

  const [emergencyAlert, setEmergencyAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleNotesChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, notes: val });

    // Live safety monitor for acute distress keywords
    const risk = evaluateEmergencyRisk(val);
    if (risk.isEmergency) {
      setEmergencyAlert(risk);
    } else {
      setEmergencyAlert(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    await submitDailyAssessment(formData);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.5 } });
    setSubmitting(false);

    if (onAssessmentSaved) onAssessmentSaved();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Daily Wellness Reflection"
      subtitle="Takes 60 seconds. Calibrates today's Wellness Score & recommendations."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Emergency Alert Banner if red flags detected in notes */}
        {emergencyAlert && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-900">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>{emergencyAlert.title}</span>
            </div>
            <p className="leading-relaxed">{emergencyAlert.advisory}</p>
            <div className="pt-1 flex items-center gap-2">
              <a
                href="tel:911"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 911 / Crisis Hotline</span>
              </a>
            </div>
          </div>
        )}

        {/* 1. Energy & Mood */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Energy Level: {formData.energyLevel} / 10</span>
            </label>
            <span className="text-xs font-semibold text-emerald-600">
              {formData.energyLevel >= 8 ? 'High Vitality' : formData.energyLevel >= 5 ? 'Moderate' : 'Low / Fatigued'}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.energyLevel}
            onChange={(e) => setFormData({ ...formData, energyLevel: Number(e.target.value) })}
            className="w-full accent-amber-500 cursor-pointer"
          />

          {/* Mood buttons */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Current Mood State
            </label>
            <div className="grid grid-cols-5 gap-1.5 text-xs">
              {[
                { label: 'Energized', icon: '⚡' },
                { label: 'Calm', icon: '🌿' },
                { label: 'Balanced', icon: '⚖️' },
                { label: 'Fatigued', icon: '🥱' },
                { label: 'Stressed', icon: '🌧️' }
              ].map(m => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setFormData({ ...formData, mood: m.label })}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    formData.mood === m.label
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-base">{m.icon}</span>
                  <span className="text-[10px] mt-0.5 block">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Sleep Duration & Quality */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-indigo-500" />
              <span>Last Night’s Sleep: {formData.sleepHours} hrs</span>
            </label>
            <input
              type="range"
              min="4.0"
              max="11.0"
              step="0.5"
              value={formData.sleepHours}
              onChange={(e) => setFormData({ ...formData, sleepHours: Number(e.target.value) })}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span>Sleep Restfulness Quality</span>
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, sleepQuality: star })}
                  className={`p-2 rounded-lg text-sm border font-bold transition-colors cursor-pointer ${
                    formData.sleepQuality >= star
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  ★
                </button>
              ))}
              <span className="text-xs font-semibold text-slate-600 ml-2">
                {formData.sleepQuality}/5
              </span>
            </div>
          </div>
        </div>

        {/* 3. Hydration & Physical Activity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-500" />
              <span>Water Logged: {formData.waterLiters} L</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="4.5"
              step="0.1"
              value={formData.waterLiters}
              onChange={(e) => setFormData({ ...formData, waterLiters: Number(e.target.value) })}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 mt-0.5">
              Target: {userProfile?.targetWaterLiters || 2.5} Liters
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>Active Movement: {formData.activityMinutes} mins</span>
            </label>
            <input
              type="range"
              min="0"
              max="120"
              step="5"
              value={formData.activityMinutes}
              onChange={(e) => setFormData({ ...formData, activityMinutes: Number(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* 4. Stress Level & Meal Consistency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Stress Level: {formData.stressLevel} / 5</span>
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.stressLevel}
              onChange={(e) => setFormData({ ...formData, stressLevel: Number(e.target.value) })}
              className="w-full accent-rose-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Low (Calm)</span>
              <span>High (Elevated)</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-teal-500" />
              <span>Meal Consistency</span>
            </label>
            <select
              value={formData.mealConsistency}
              onChange={(e) => setFormData({ ...formData, mealConsistency: e.target.value })}
              className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="balanced">Balanced Whole-Foods</option>
              <option value="light">Light Grazing</option>
              <option value="skipped_meal">Skipped a Main Meal</option>
              <option value="irregular">Irregular / High-Sugar</option>
            </select>
          </div>
        </div>

        {/* 5. Notes with live safety evaluation */}
        <div className="pt-3 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Subjective Notes / How are you feeling?
          </label>
          <textarea
            rows="2"
            value={formData.notes}
            onChange={handleNotesChange}
            placeholder="e.g. Mild afternoon energy slump, slept later than usual, felt great after lunch walk."
            className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={submitting}
            icon={CheckCircle2}
          >
            Save Daily Assessment
          </Button>
        </div>
      </form>
    </Modal>
  );
}
