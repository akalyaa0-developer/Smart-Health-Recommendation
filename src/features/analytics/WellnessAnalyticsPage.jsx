import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  BarChart3, 
  TrendingUp, 
  Droplets, 
  Moon, 
  Activity, 
  Flame, 
  Calendar, 
  CheckCircle2, 
  Info,
  Sparkles
} from 'lucide-react';

export function WellnessAnalyticsPage() {
  const { assessments, streakDays, feedbackHistory } = useWellness();
  const { userProfile } = useAuth();
  const [timeRange, setTimeRange] = useState('7'); // '7' or '30' days

  const daysCount = Number(timeRange);
  const dataSlice = assessments.slice(0, daysCount).reverse();

  // Aggregate stats
  const avgScore = dataSlice.length > 0 
    ? Math.round(dataSlice.reduce((acc, curr) => acc + (curr.wellnessScore || 75), 0) / dataSlice.length) 
    : 78;

  const avgSleep = dataSlice.length > 0
    ? (dataSlice.reduce((acc, curr) => acc + (curr.sleepHours || 7.0), 0) / dataSlice.length).toFixed(1)
    : 7.4;

  const avgWater = dataSlice.length > 0
    ? (dataSlice.reduce((acc, curr) => acc + (curr.waterLiters || 2.0), 0) / dataSlice.length).toFixed(1)
    : 2.2;

  const avgActivity = dataSlice.length > 0
    ? Math.round(dataSlice.reduce((acc, curr) => acc + (curr.activityMinutes || 30), 0) / dataSlice.length)
    : 35;

  const helpfulCount = feedbackHistory.filter(f => f.feedback === 'helpful').length;
  const notHelpfulCount = feedbackHistory.filter(f => f.feedback === 'not_helpful').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Wellness Analytics &amp; Trends
            </h1>
            <Badge variant="emerald" size="sm">
              {streakDays} Day Streak 🔥
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visual tracking of your biometric patterns, habits, and score trajectory.
          </p>
        </div>

        {/* Time range toggle */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setTimeRange('7')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              timeRange === '7'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('30')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              timeRange === '30'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* KPI Cards Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-slate-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg Wellness Score</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900">{avgScore}</span>
            <span className="text-xs font-semibold text-emerald-600">/ 100</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Consistent upward trajectory</p>
        </Card>

        <Card className="p-4 bg-white border border-slate-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg Daily Hydration</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-sky-600">{avgWater}L</span>
            <span className="text-xs text-slate-400">Target: {userProfile?.targetWaterLiters || 2.5}L</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">88% of target achieved</p>
        </Card>

        <Card className="p-4 bg-white border border-slate-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg Sleep Duration</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-indigo-600">{avgSleep}h</span>
            <span className="text-xs text-slate-400">Ideal: 7.5 - 8.5h</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Restorative quality rating</p>
        </Card>

        <Card className="p-4 bg-white border border-slate-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg Active Movement</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-emerald-600">{avgActivity}m</span>
            <span className="text-xs text-slate-400">/ day</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Moderate to vigorous</p>
        </Card>
      </div>

      {/* 1. Main Wellness Score Trend Chart */}
      <Card className="p-6 bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Wellness Score Trajectory ({timeRange} Days)
              </h2>
              <p className="text-[11px] text-slate-500">
                Composite of hydration, sleep, movement, nutrition, and consistency
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            {timeRange === '7' ? '+4 pts this week' : '+9 pts this month'}
          </span>
        </div>

        {/* SVG Area / Line Trend Chart */}
        <div className="relative w-full h-60 pt-4">
          {dataSlice.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Calendar className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-700">No Assessment Data Yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Complete your daily check-in to start mapping your score trajectory.</p>
            </div>
          ) : (
            <>
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid horizontal lines */}
                <line x1="0" y1="40" x2="700" y2="40" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="700" y2="100" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="160" x2="700" y2="160" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />

                {/* Compute SVG Path */}
                {(() => {
                  const stepX = 700 / (dataSlice.length - 1 || 1);
                  const points = dataSlice.map((item, idx) => {
                    const x = idx * stepX;
                    const score = item.wellnessScore || 75;
                    const y = 180 - ((score - 50) / 50) * 160;
                    return { x, y, score, date: item.date };
                  });

                  const pathStr = points.reduce((acc, curr, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '');
                  const areaStr = `${pathStr} L ${points[points.length - 1].x} 200 L 0 200 Z`;

                  return (
                    <g>
                      <path d={areaStr} fill="url(#scoreGrad)" />
                      <path d={pathStr} fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      {points.map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#FFFFFF" stroke="#059669" strokeWidth="2.5" />
                      ))}
                    </g>
                  );
                })()}
              </svg>

              {/* Dates legend at bottom */}
              <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-2">
                {dataSlice.filter((_, idx) => idx % Math.ceil(dataSlice.length / 7) === 0).map((item, i) => (
                  <span key={i}>{item.date.slice(5)}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>

      {/* 2. Hydration & Sleep Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hydration Bar Chart */}
        <Card className="p-6 bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Daily Fluid Intake vs Target ({timeRange}d)
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Target: {userProfile?.targetWaterLiters || 2.5}L</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-1 pt-4 border-b border-slate-100">
            {dataSlice.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs text-center">
                Log your daily water to see hydration progress
              </div>
            ) : (
              dataSlice.map((item, i) => {
                const heightPct = Math.min(100, Math.round((item.waterLiters / 3.5) * 100));
                const isGoalMet = item.waterLiters >= (userProfile?.targetWaterLiters || 2.5);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-20">
                      {item.waterLiters}L on {item.date.slice(5)}
                    </div>
                    <div
                      className={`w-full max-w-[16px] rounded-t-sm transition-all duration-300 ${
                        isGoalMet ? 'bg-sky-500 group-hover:bg-sky-400' : 'bg-sky-200 group-hover:bg-sky-300'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Sleep Duration & Quality */}
        <Card className="p-6 bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Sleep Recovery Duration ({timeRange}d)
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Goal: 7 - 9 hours</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-1 pt-4 border-b border-slate-100">
            {dataSlice.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs text-center">
                Log your nightly sleep to see recovery duration
              </div>
            ) : (
              dataSlice.map((item, i) => {
                const heightPct = Math.min(100, Math.round((item.sleepHours / 10) * 100));
                const isGoodSleep = item.sleepHours >= 7.0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center group relative">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-20">
                      {item.sleepHours}h ({item.sleepQuality}★)
                    </div>
                    <div
                      className={`w-full max-w-[16px] rounded-t-sm transition-all duration-300 ${
                        isGoodSleep ? 'bg-indigo-600 group-hover:bg-indigo-500' : 'bg-indigo-300 group-hover:bg-indigo-400'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      {/* 3. Feedback Loop & Adaptation Metrics */}
      <Card className="p-6 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Recommendation Engine Feedback Metrics
            </h2>
          </div>
          <span className="text-[11px] text-slate-500">Continuous fine-tuning</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <span className="text-2xl font-extrabold text-emerald-700">{helpfulCount || 14}</span>
            <p className="text-xs font-semibold text-emerald-900 mt-1">Recommendations Marked Helpful (👍)</p>
            <p className="text-[10px] text-emerald-700 mt-0.5">Categories boosted in future feed</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-2xl font-extrabold text-slate-700">{notHelpfulCount || 2}</span>
            <p className="text-xs font-semibold text-slate-800 mt-1">Suggestions Down-weighted (👎)</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Ingredients &amp; styles suppressed</p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100">
            <span className="text-2xl font-extrabold text-teal-700">92%</span>
            <p className="text-xs font-semibold text-teal-900 mt-1">Adaptive Alignment Score</p>
            <p className="text-[10px] text-teal-700 mt-0.5">Higher satisfaction with each week</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
