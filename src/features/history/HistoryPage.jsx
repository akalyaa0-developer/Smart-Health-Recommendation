import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Calendar, ThumbsUp, ThumbsDown, Zap, Droplets, Moon, Activity, Clock } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export function HistoryPage() {
  const { assessments, feedbackHistory } = useWellness();
  const [tab, setTab] = useState('assessments'); // 'assessments' or 'feedback'

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-display">
            Historical Records &amp; Feedback Logs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit your past self-reported assessments and adaptive recommendation interactions.
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setTab('assessments')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === 'assessments'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Assessments ({assessments.length})
          </button>
          <button
            onClick={() => setTab('feedback')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === 'feedback'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Feedback Logs ({feedbackHistory.length})
          </button>
        </div>
      </div>

      {tab === 'assessments' ? (
        <div className="space-y-3">
          {assessments.map(record => (
            <Card key={record.id || record.date} className="p-4 bg-white border border-slate-200 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">{formatDate(record.date)}</span>
                  <Badge variant="emerald" size="sm">
                    Score: {record.wellnessScore || 78}/100
                  </Badge>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  Mood: <strong>{record.mood}</strong> ({record.mealConsistency})
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Energy: {record.energyLevel}/10</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-sky-500" />
                  <span>Water: {record.waterLiters}L</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Sleep: {record.sleepHours}h ({record.sleepQuality}★)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Activity: {record.activityMinutes}m</span>
                </div>
              </div>

              {record.notes && (
                <p className="mt-2 text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                  "{record.notes}"
                </p>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {feedbackHistory.length === 0 ? (
            <Card className="p-8 text-center space-y-2">
              <p className="text-xs text-slate-500">No recommendation feedback recorded yet.</p>
            </Card>
          ) : (
            feedbackHistory.map(item => (
              <Card key={item.id} className="p-4 bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.itemTitle}</span>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">({item.category})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {formatDate(item.timestamp)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.feedback === 'helpful' ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      Helpful (+Weight)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold text-xs flex items-center gap-1">
                      <ThumbsDown className="w-3.5 h-3.5" />
                      Not Helpful (-Weight)
                    </span>
                  )}
                  {item.rejectionReason && (
                    <span className="text-[10px] text-slate-500">
                      Reason: {item.rejectionReason}
                    </span>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
