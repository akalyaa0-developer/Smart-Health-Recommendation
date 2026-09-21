import React from 'react';
import { ShieldCheck, Heart, ExternalLink, PhoneCall } from 'lucide-react';
import { MEDICAL_DISCLAIMER } from '../../utils/safetyValidator';

export function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-base">
                IW
              </div>
              <span className="text-lg font-bold text-white tracking-tight">IntelWell</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              IntelWell delivers adaptive, explainable nutrition and wellness recommendations. 
              Our recommendation architecture synthesizes personal goals, daily biological rhythms, 
              and continuous feedback to cultivate sustainable vitality.
            </p>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 max-w-lg">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-300 leading-normal">
                  <strong className="text-white">Medical Notice:</strong> {MEDICAL_DISCLAIMER}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-emerald-400 transition-colors">
                  Personalized Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('meals')} className="hover:text-emerald-400 transition-colors">
                  Adaptive Meal Planner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('grocery')} className="hover:text-emerald-400 transition-colors">
                  Smart Grocery List
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('assistant')} className="hover:text-emerald-400 transition-colors">
                  AI Wellness Companion
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('analytics')} className="hover:text-emerald-400 transition-colors">
                  Wellness Analytics &amp; Trends
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency & Safety Resources */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Urgent &amp; Safety Care
            </h4>
            <div className="space-y-2.5 text-[11px]">
              <p className="text-slate-400">
                If you are experiencing acute medical distress or pain, seek immediate emergency help:
              </p>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 space-y-1">
                <div className="flex items-center justify-between text-rose-400 font-semibold">
                  <span>Emergency Services (US)</span>
                  <a href="tel:911" className="hover:underline">911</a>
                </div>
                <div className="flex items-center justify-between text-indigo-400 font-semibold">
                  <span>Crisis &amp; Suicide Lifeline</span>
                  <a href="tel:988" className="hover:underline">988</a>
                </div>
                <div className="flex items-center justify-between text-teal-400 font-semibold">
                  <span>EU/UK Emergency</span>
                  <a href="tel:112" className="hover:underline">112 / 999</a>
                </div>
              </div>
              <p className="text-[10px] text-slate-500">
                The trusted contact feature remains user-initiated and does not replace emergency dispatchers.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} IntelWell Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Human Vitality
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
