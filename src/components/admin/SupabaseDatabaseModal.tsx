import React, { useState } from 'react';
import { X, Database, CheckCircle2, Sparkles, RotateCcw, AlertTriangle } from 'lucide-react';
import { useCourse } from '../../context/CourseContext';

interface SupabaseDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseDatabaseModal: React.FC<SupabaseDatabaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isOnline, clearAllGrades } = useCourse();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [clearedSuccess, setClearedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleClearGrades = async () => {
    setIsClearing(true);
    try {
      await clearAllGrades();
      setClearedSuccess(true);
      setIsConfirming(false);
      setTimeout(() => setClearedSuccess(false), 3000);
    } catch (err) {
      console.error('Clear grades error:', err);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 flex items-center justify-center text-[#3ECF8E]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Supabase Database Connection
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#3ECF8E]/10 text-[#3ECF8E] font-semibold border border-[#3ECF8E]/20">
                  Live
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Connected securely to Postgres via Realtime WebSocket
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="p-4 rounded-2xl border border-[#3ECF8E]/30 bg-[#3ECF8E]/5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#3ECF8E] animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {isOnline ? 'Realtime Subscriptions Active' : 'Offline'}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">
                  All updates to assignments, grades, and regrades are automatically synchronized in real-time. 
                  No manual push required. Role-level security ensures isolated access.
                </div>
              </div>
            </div>
          </div>

          {/* Fresh Slate Reset Action */}
          <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    Gradebook Reset & Fresh Slate
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                  Purge all recorded student grades in the cloud database and wipe local caches to start completely fresh.
                </div>
              </div>
              {!isConfirming && (
                <button
                  onClick={() => setIsConfirming(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold transition-colors cursor-pointer shrink-0"
                >
                  Clear Grades
                </button>
              )}
            </div>

            {clearedSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>All grades successfully cleared! Fresh app state active.</span>
              </div>
            )}

            {isConfirming && (
              <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-amber-500/40 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Are you sure? This deletes all grades for all students.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearGrades}
                    disabled={isClearing}
                    className="flex-1 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isClearing ? 'Clearing...' : 'Confirm Clear'}
                  </button>
                  <button
                    onClick={() => setIsConfirming(false)}
                    disabled={isClearing}
                    className="py-2 px-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#000000] border border-zinc-200/70 dark:border-zinc-800/80 text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1.5 font-mono">
            <div className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1 font-sans">
              <Database className="w-3.5 h-3.5 text-[#3ECF8E]" />
              <span>Database Schema Specifications</span>
            </div>
            <div>• <strong className="text-zinc-700 dark:text-zinc-300">Grades:</strong> Relational grades table with JSONB sub-questions</div>
            <div>• <strong className="text-zinc-700 dark:text-zinc-300">Assignments:</strong> UUID IDs, nested JSONB trees</div>
            <div>• <strong className="text-zinc-700 dark:text-zinc-300">Users:</strong> Synced auth profiles with roles</div>
          </div>
        </div>
      </div>
    </div>
  );
};
