import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  Database,
  Send,
  Users,
  LogOut,
  Shield,
  ExternalLink,
  RotateCcw,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';

interface MobileMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onOpenExportHub?: () => void;
  onOpenGoogleSheetsModal?: () => void;
  onOpenOverdue?: () => void;
}

export const MobileMoreSheet: React.FC<MobileMoreSheetProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenExportHub,
  onOpenGoogleSheetsModal,
  onOpenOverdue,
}) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const { resetToFreshCourse } = useCourse();
  const [isResetConfirming, setIsResetConfirming] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  const handleAction = (cb?: () => void) => {
    if (cb) cb();
    onClose();
  };

  const handleResetCourse = async () => {
    setIsResetting(true);
    try {
      await resetToFreshCourse();
      setIsResetConfirming(false);
      onClose();
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="More Options"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg bg-white dark:bg-[#09090B] rounded-t-3xl border-t border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] space-y-4 max-h-[90vh] overflow-y-auto touch-pan-y"
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto" />

            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold font-display text-zinc-900 dark:text-zinc-100">
                  Staff Tools & Utilities
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Access administrative and export tools.
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close sheet"
                className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Confirmation Banner for Fresh Reset */}
            {isResetConfirming && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      Confirm Fresh Course Reset?
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                      This will wipe all recorded student grades and cached records in the database, resetting the gradebook to a fresh, clean slate.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleResetCourse}
                    disabled={isResetting}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isResetting ? 'Resetting...' : 'Yes, Clear All Grades'}</span>
                  </button>
                  <button
                    onClick={() => setIsResetConfirming(false)}
                    disabled={isResetting}
                    className="py-2.5 px-4 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Grid of Actions */}
            <div className="grid grid-cols-1 gap-2 pt-1">
              {isAdmin && (
                <button
                  onClick={() => setIsResetConfirming(true)}
                  className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 transition-all cursor-pointer text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <span>Reset to Fresh Course</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                        Fresh App
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      Clear all entered grades and cache for a clean slate
                    </div>
                  </div>
                </button>
              )}
            {isAdmin && onOpenExportHub && (
              <button
                onClick={() => handleAction(onOpenExportHub)}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/70 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800/80 transition-all cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-[#3B82F6] flex items-center justify-center shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Export Center
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    Generate Master PDF reports and CSV score sheets
                  </div>
                </div>
              </button>
            )}

            {isAdmin && onOpenGoogleSheetsModal && (
              <button
                onClick={() => handleAction(onOpenGoogleSheetsModal)}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/70 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800/80 transition-all cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Supabase Database
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    Manage cloud database sync and remote tables
                  </div>
                </div>
              </button>
            )}

            {isAdmin && onOpenOverdue && (
              <button
                onClick={() => handleAction(onOpenOverdue)}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/70 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800/80 transition-all cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <Send className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Reminders & Overdue
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    Notify students missing homework submissions
                  </div>
                </div>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => handleAction(() => onNavigate('user-management'))}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/70 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800/80 transition-all cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    User Management
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    Manage students, TAs, credentials, and sections
                  </div>
                </div>
              </button>
            )}

            {currentUser && (
              <button
                onClick={() => handleAction(logout)}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer text-left mt-2"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                  <LogOut className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                    Sign Out
                  </div>
                  <div className="text-xs text-rose-500/70 truncate">
                    Signed in as {currentUser.full_name}
                  </div>
                </div>
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
};
