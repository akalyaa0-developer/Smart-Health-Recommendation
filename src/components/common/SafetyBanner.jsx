import React, { useState } from 'react';
import { ShieldAlert, Info, X, PhoneCall } from 'lucide-react';
import { MEDICAL_DISCLAIMER } from '../../utils/safetyValidator';

export function SafetyBanner({ emergencyAlert = null, onDismissEmergency }) {
  const [minimized, setMinimized] = useState(false);

  // If there is an active emergency red-flag alert detected
  if (emergencyAlert?.isEmergency) {
    return (
      <div className="bg-rose-600 text-white px-4 py-3 shadow-lg transition-all animate-pulse-subtle">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-700/80 rounded-xl shrink-0">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-wide">
                {emergencyAlert.title || 'Immediate Medical Attention Recommended'}
              </p>
              <p className="text-xs text-rose-100 mt-0.5 max-w-2xl">
                {emergencyAlert.advisory}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="tel:911"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-rose-700 rounded-lg text-xs font-bold hover:bg-rose-50 transition-colors shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 911 / Emergency</span>
            </a>
            {onDismissEmergency && (
              <button
                onClick={onDismissEmergency}
                className="p-1.5 text-rose-200 hover:text-white rounded-lg hover:bg-rose-700/50"
                aria-label="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (minimized) {
    return (
      <div className="bg-slate-100/90 border-b border-slate-200 text-slate-600 text-[11px] px-4 py-1 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Info className="w-3 h-3 text-slate-500" />
          <span>IntelWell provides non-medical wellness &amp; nutrition recommendations.</span>
        </span>
        <button 
          onClick={() => setMinimized(false)}
          className="text-slate-500 hover:text-slate-800 underline ml-2"
        >
          View safety details
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Medical Disclaimer" className="bg-emerald-950/90 text-emerald-100 border-b border-emerald-800/50 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <p className="line-clamp-1 md:line-clamp-none text-[11px] md:text-xs text-emerald-200">
            <span className="font-semibold text-emerald-300">Safety Notice:</span> {MEDICAL_DISCLAIMER}
          </p>
        </div>
        <button
          onClick={() => setMinimized(true)}
          className="text-emerald-400 hover:text-white p-1 rounded transition-colors shrink-0"
          aria-label="Minimize disclaimer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
