import React, { useEffect, useState } from 'react';
import { X, Send, AlertCircle, CheckCircle2, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';
import { Assignment } from '../../types';

interface RegradeModalProps {
  isOpen: boolean;
  assignment: Assignment | null;
  questionLabel: string;
  currentScore: number;
  maxScore: number;
  onClose: () => void;
}

export const RegradeModal: React.FC<RegradeModalProps> = ({
  isOpen,
  assignment,
  questionLabel,
  currentScore,
  maxScore,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const { submitRegrade } = useCourse();

  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) { setReason(''); setError(null); setSubmitted(false); }
  }, [isOpen, assignment?.id, questionLabel]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !assignment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a specific academic explanation for your regrade request.');
      return;
    }

    if (!currentUser) {
      setError('Please sign in to submit an appeal.');
      return;
    }

    const result = submitRegrade(
      currentUser.id,
      currentUser.full_name || 'Unknown',
      assignment.id,
      assignment.title,
      questionLabel,
      reason.trim(),
      currentScore,
      maxScore
    );

    if (!result.success) {
      setError(result.message || 'Could not submit your appeal.');
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReason('');
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Submit regrade appeal"
    >
      <div className="w-full max-w-lg bg-white dark:bg-[#09090B] rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#3B82F6]" />
            <div>
              <h3 className="text-sm font-bold font-display text-zinc-900 dark:text-zinc-100">
                Submit Regrade Appeal Ticket
              </h3>
              <span className="text-xs text-zinc-500">
                {assignment.shortCode} · Question {questionLabel}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg cursor-pointer text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {submitted && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-[#3B82F6] rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Appeal ticket created and routed to TA queue!</span>
            </div>
          )}

          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-zinc-500 block text-[11px]">Assessment Problem</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {assignment.title}
              </span>
            </div>
            <div className="text-right">
              <span className="text-zinc-500 block text-[11px]">Current Score</span>
              <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                {currentScore} / {maxScore} pts
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Justification & Reference
            </label>
            <textarea
              rows={4}
              required
              value={reason}
              onChange={e => { setReason(e.target.value); setError(null); }}
              placeholder="Cite the specific step, equation, or slide that clarifies your derivation..."
              className="w-full p-2.5 text-base sm:text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-3.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitted}
              className="h-10 flex items-center gap-1.5 px-4 text-xs font-semibold text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Appeal to TAs</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
