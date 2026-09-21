import React from 'react';
import { ShieldCheck, TrendingUp, Info } from 'lucide-react';

export function ScoreGauge({ scoreData, size = 'md', onExplain }) {
  const score = scoreData?.score || 78;
  const factors = scoreData?.factorBreakdown || [];

  // Gauge SVG calculations
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = 'text-emerald-500';
  let strokeHex = '#10B981';
  let scoreLabel = 'Optimal Balance';

  if (score < 60) {
    colorClass = 'text-amber-500';
    strokeHex = '#F59E0B';
    scoreLabel = 'Needs Attention';
  } else if (score < 80) {
    colorClass = 'text-teal-500';
    strokeHex = '#14B8A6';
    scoreLabel = 'Good Balance';
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90 transition-all duration-1000 ease-out"
        >
          {/* Background Track */}
          <circle
            stroke="#E2E8F0"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress Arc */}
          <circle
            stroke={strokeHex}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Number */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight text-slate-800">
            {score}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            / 100
          </span>
        </div>
      </div>

      <div className="mt-2.5 text-center">
        <span className={`inline-flex items-center gap-1 text-xs font-bold ${colorClass}`}>
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{scoreLabel}</span>
        </span>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Based on 5 self-reported daily lifestyle inputs
        </p>
      </div>

      {/* Mini Factor Progress Bars */}
      <div className="w-full mt-4 space-y-2 pt-3 border-t border-slate-100">
        {factors.map((factor, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium truncate max-w-[120px]">
              {factor.pillar}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${factor.score}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 w-8 text-right">
                {factor.score}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3.5 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
        <Info className="w-3 h-3 text-slate-400 shrink-0" />
        <span>Non-medical wellness tracking indicator</span>
      </div>
    </div>
  );
}
