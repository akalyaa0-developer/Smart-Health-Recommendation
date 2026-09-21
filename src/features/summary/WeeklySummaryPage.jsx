import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCw, 
  Calendar, 
  TrendingUp, 
  Target, 
  ShieldCheck,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function WeeklySummaryPage() {
  const { userProfile } = useAuth();
  const { assessments } = useWellness();
  const [generating, setGenerating] = useState(false);

  const handleRefreshSummary = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    }, 1200);
  };

  const name = userProfile?.name?.split(' ')[0] || 'there';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Weekly Personalized AI Summary
            </h1>
            <Badge variant="emerald" size="sm" icon={Sparkles}>
              AI Synthesized
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            7-day holistic evaluation of your lifestyle rhythm, nutritional balance, and habit trajectory.
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          icon={RotateCw}
          loading={generating}
          onClick={handleRefreshSummary}
        >
          Re-Analyze 7 Days
        </Button>
      </div>

      {/* Executive Overview Hero Card */}
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Weekly Cycle Ending Today</span>
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold font-display leading-tight">
            Strong consistency, {name}. Your weekly score climbed +4 points.
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
            Over the past 7 days, your self-reported assessment streak reached 100% adherence. 
            Hydration improved noticeably with afternoon reminders, supporting your goal of 
            sustained daily energy.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-emerald-700/60 max-w-lg text-center">
            <div className="p-2.5 rounded-xl bg-emerald-950/40">
              <span className="text-xs text-emerald-300 font-medium">Weekly Avg</span>
              <p className="text-xl font-bold text-white">82 / 100</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/40">
              <span className="text-xs text-emerald-300 font-medium">Hydration</span>
              <p className="text-xl font-bold text-sky-300">2.4L / day</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/40">
              <span className="text-xs text-emerald-300 font-medium">Avg Sleep</span>
              <p className="text-xl font-bold text-indigo-200">7.4 hrs</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Positive Habits vs Areas for Attention */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Positive Habits */}
        <Card className="p-6 bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Positive Habits Formed This Week</span>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <p className="font-bold text-emerald-900">1. Afternoon Fluid Intake Discipline</p>
              <p className="text-slate-600 mt-1">
                You logged at least 2.2L of water on 6 out of 7 days, avoiding the usual 3:00 PM energy slump.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <p className="font-bold text-emerald-900">2. Balanced Whole-Food Breakfasts</p>
              <p className="text-slate-600 mt-1">
                Incorporated plant-based chia, quinoa, and omega-3s, stabilizing early morning glucose curves.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <p className="font-bold text-emerald-900">3. Daily Self-Reflection Streak</p>
              <p className="text-slate-600 mt-1">
                Completed daily check-ins without skipping, giving the recommendation engine rich calibration data.
              </p>
            </div>
          </div>
        </Card>

        {/* Areas for Attention */}
        <Card className="p-6 bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span>Opportunities for Growth</span>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
              <p className="font-bold text-amber-900">1. Mid-Week Sleep Latency</p>
              <p className="text-slate-600 mt-1">
                On Wednesday and Thursday, sleep dipped to 6.3 hours. Screen time past 10:30 PM was noted as a contributing factor.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
              <p className="font-bold text-amber-900">2. Active Recovery on Rest Days</p>
              <p className="text-slate-600 mt-1">
                Weekend activity fell below 20 minutes. Gentle stretching or a restorative nature walk would support lymphatic circulation.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
              <p className="font-bold text-amber-900">3. Evening Hydration Tapering</p>
              <p className="text-slate-600 mt-1">
                Consuming large fluids within 45 minutes of sleep interrupted deep rest. Shift fluids into midday hours.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Suggested Focus Action Plan for Next Week */}
      <Card className="p-6 sm:p-8 bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Target className="w-5 h-5 text-emerald-600" />
          <span>Recommended Focus Plan for Next Week</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          The IntelWell adaptive engine recommends focusing on these three micro-commitments next week:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase text-emerald-600">Focus 1</span>
            <p className="text-xs font-bold text-slate-800">45-Minute Screen Wind-Down</p>
            <p className="text-[11px] text-slate-500">Switch devices to warm mode by 9:45 PM.</p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase text-sky-600">Focus 2</span>
            <p className="text-xs font-bold text-slate-800">Front-Load Hydration</p>
            <p className="text-[11px] text-slate-500">Reach 1.8L before 3:00 PM daily.</p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase text-indigo-600">Focus 3</span>
            <p className="text-xs font-bold text-slate-800">12-Min Post-Meal Stroll</p>
            <p className="text-[11px] text-slate-500">Gentle walk after your heaviest daily meal.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
