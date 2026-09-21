import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { generateExplanation } from '../../services/explainabilityService';
import { useAuth } from '../../context/AuthContext';
import { useWellness } from '../../context/WellnessContext';
import { 
  HelpCircle, 
  CheckCircle2, 
  SlidersHorizontal, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

export function ExplainModal({ isOpen, onClose, item }) {
  const { userProfile } = useAuth();
  const { recentAssessment, feedbackHistory, submitFeedback } = useWellness();
  const [feedbackSent, setFeedbackSent] = useState(null);
  const [showReasonBox, setShowReasonBox] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('not_relevant');

  if (!item) return null;

  const explanation = generateExplanation(item, userProfile, recentAssessment, feedbackHistory);

  const handleFeedback = (type) => {
    if (type === 'not_helpful') {
      setShowReasonBox(true);
    } else {
      submitFeedback(item, 'helpful');
      setFeedbackSent('helpful');
      setTimeout(() => {
        onClose();
        setFeedbackSent(null);
      }, 1500);
    }
  };

  const handleConfirmRejection = () => {
    submitFeedback(item, 'not_helpful', rejectionReason);
    setFeedbackSent('not_helpful');
    setShowReasonBox(false);
    setTimeout(() => {
      onClose();
      setFeedbackSent(null);
    }, 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Why am I seeing this recommendation?"
      subtitle="Transparent breakdown of the factors powering this suggestion"
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        {/* Recommendation Header Card */}
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                {explanation.category}
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">
                {explanation.itemTitle}
              </h4>
            </div>
            <Badge variant="emerald" size="sm" icon={Sparkles}>
              {explanation.confidenceLevel}% Match
            </Badge>
          </div>
          <p className="text-xs text-slate-700 mt-2 leading-relaxed font-medium">
            "{explanation.primaryReason}"
          </p>
        </div>

        {/* Data Factors Considered */}
        <div>
          <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
            <span>Data Factors Considered</span>
          </h5>
          <div className="space-y-2">
            {explanation.dataFactorsConsidered.map((factor, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold text-slate-800">{factor.label}: </span>
                  <span className="text-slate-600">{factor.detail}</span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide shrink-0">
                  {factor.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Adaptive Note */}
        <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Adaptive Engine Learning:</p>
            <p className="text-[11px] text-amber-800 mt-0.5">
              {explanation.adaptationInfluence} As you mark recommendations as helpful or not helpful, IntelWell refines future suggestions.
            </p>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="pt-3 border-t border-slate-100">
          {feedbackSent ? (
            <div className="p-3 rounded-xl bg-emerald-100/70 text-emerald-800 text-center text-xs font-semibold">
              Thank you! Your feedback will adapt future recommendations.
            </div>
          ) : showReasonBox ? (
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <p className="text-xs font-semibold text-slate-700">
                Help us adapt: Why wasn't this helpful?
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'not_relevant', label: 'Not relevant to me' },
                  { id: 'too_difficult', label: 'Too difficult / complex' },
                  { id: 'dislike_ingredient', label: 'Dislike ingredient' },
                  { id: 'already_do_this', label: 'Already do this habit' }
                ].map((reason) => (
                  <button
                    key={reason.id}
                    type="button"
                    onClick={() => setRejectionReason(reason.id)}
                    className={`px-3 py-2 text-left rounded-lg border text-xs transition-all ${
                      rejectionReason === reason.id 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-semibold' 
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {reason.label}
                  </button>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="ghost" onClick={() => setShowReasonBox(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" onClick={handleConfirmRejection}>
                  Submit &amp; Adapt
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Was this recommendation helpful?</span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  icon={ThumbsUp}
                  onClick={() => handleFeedback('helpful')}
                >
                  Helpful
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  icon={ThumbsDown}
                  onClick={() => handleFeedback('not_helpful')}
                >
                  Not Helpful
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Safety Disclaimer */}
        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{explanation.safetyDisclaimer}</span>
        </div>
      </div>
    </Modal>
  );
}
