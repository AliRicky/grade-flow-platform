import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Award,
  CheckCircle2,
  Minus,
  Plus,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useCourse } from '../../context/CourseContext';
import { useAuth } from '../../context/AuthContext';
import { Assignment, User, Question, SubQuestion } from '../../types';
import { calculateNumericGrade } from '../../utils/grading';

interface MobileGradingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  student: User | null;
  assignment: Assignment;
  onNextStudent?: () => void;
  onPrevStudent?: () => void;
  hasNextStudent?: boolean;
  hasPrevStudent?: boolean;
  currentIndex?: number;
  totalStudents?: number;
}

interface QuestionItem {
  key: string;
  label: string;
  title: string;
  maxScore: number;
  isBonus?: boolean;
}

export const MobileGradingDrawer: React.FC<MobileGradingDrawerProps> = ({
  isOpen,
  onClose,
  student,
  assignment,
  onNextStudent,
  onPrevStudent,
  hasNextStudent = false,
  hasPrevStudent = false,
  currentIndex = 0,
  totalStudents = 1,
}) => {
  const { grades, updateGrade } = useCourse();
  const { currentUser } = useAuth();

  // Extract all grading items for this assignment
  const items = useMemo<QuestionItem[]>(() => {
    const list: QuestionItem[] = [];
    const questions = Array.isArray(assignment?.questions) ? assignment.questions : [];

    questions.forEach(q => {
      const sqs = Array.isArray(q.subQuestions) ? q.subQuestions : [];
      if (sqs.length > 0) {
        sqs.forEach(sq => {
          list.push({
            key: `${q.id}_${sq.id}`,
            label: sq.label || `Q${q.number}`,
            title: sq.title || `Part ${sq.label}`,
            maxScore: sq.maxScore,
            isBonus: q.isBonus,
          });
        });
      } else {
        list.push({
          key: q.id,
          label: `Q${q.number}`,
          title: q.title || `Question ${q.number}`,
          maxScore: q.directMaxScore || 10,
          isBonus: q.isBonus,
        });
      }
    });

    return list;
  }, [assignment]);

  useEffect(() => {
    if (isOpen && student) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen, student]);

  const studentGrade = student ? grades[`${student.id}_${assignment.id}`] : undefined;
  const scores = studentGrade?.scores || {};

  // Calculate student live totals
  let rowTotal = 0;
  let rowBonus = 0;
  let gradedCount = 0;

  items.forEach(item => {
    const val = scores[item.key];
    if (val !== undefined && val !== null) {
      gradedCount++;
      if (item.isBonus) rowBonus += val;
      else rowTotal += val;
    }
  });

  const rawSum = rowTotal + rowBonus;
  const scaledScore = assignment.totalMaxScore > 0
    ? Math.min(9, (rawSum / assignment.totalMaxScore) * 9)
    : Math.min(9, rawSum);
  const percentage = (scaledScore / 9) * 100;
  const numericGrade = calculateNumericGrade(percentage);

  const handleScoreChange = (itemKey: string, newVal: number | null, maxScore: number, isBonus?: boolean) => {
    if (!student) return;
    if (newVal === null) {
      updateGrade(student.id, assignment.id, itemKey, null, currentUser?.full_name);
      return;
    }
    const maxAllowed = isBonus ? maxScore + 5 : maxScore;
    const clamped = Math.max(0, Math.min(maxAllowed, newVal));
    updateGrade(student.id, assignment.id, itemKey, clamped, currentUser?.full_name);
  };

  const handleStep = (itemKey: string, delta: number, maxScore: number, isBonus?: boolean) => {
    const current = scores[itemKey] ?? 0;
    const nextVal = Math.round((current + delta) * 10) / 10;
    handleScoreChange(itemKey, nextVal, maxScore, isBonus);
  };

  return (
    <AnimatePresence>
      {isOpen && student && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Grading for ${student.full_name}`}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg bg-white dark:bg-[#09090B] rounded-t-3xl border-t border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[92dvh] max-h-[92vh] overflow-hidden"
          >
          {/* Grab Handle */}
          <div className="pt-3 pb-1 cursor-grab">
            <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto" />
          </div>

          {/* Student Header */}
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#3B82F6]/20 to-[#3B82F6]/5 text-[#3B82F6] flex items-center justify-center font-mono font-bold text-sm border border-[#3B82F6]/20 shrink-0">
                {student.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold font-display text-zinc-900 dark:text-zinc-100 truncate">
                  {student.full_name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  <span>ID: {student.studentId || student.id.slice(0, 8)}</span>
                  <span>·</span>
                  <span>{student.section || 'General'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close grading sheet"
              className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Live Score Summary Ribbon */}
          <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#3B82F6]" />
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {assignment.shortCode} Final Score
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-mono">
                {rawSum.toFixed(1)} / {assignment.totalMaxScore}p
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">
                {scaledScore.toFixed(2)} / 9.0
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-zinc-900 text-white dark:bg-zinc-800 dark:text-zinc-100">
                Grade {numericGrade.gradeNumber}
              </span>
            </div>
          </div>

          {/* Scrollable Questions List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 touch-pan-y overscroll-contain">
            {items.map(item => {
              const currentVal = scores[item.key];
              const isGraded = currentVal !== undefined && currentVal !== null;

              return (
                <div
                  key={item.key}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isGraded
                      ? 'bg-white dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 shadow-2xs'
                      : 'bg-zinc-50/70 dark:bg-zinc-900/30 border-dashed border-zinc-300 dark:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                        {item.label}
                      </span>
                      <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">
                        {item.title}
                      </span>
                      {item.isBonus && (
                        <span className="text-[10px] font-semibold text-[#3B82F6] bg-[#3B82F6]/10 px-1.5 py-0.5 rounded">
                          Bonus
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-mono text-zinc-500 shrink-0">
                      Max: {item.maxScore}p
                    </span>
                  </div>

                  {/* Touch Stepper & Direct Input */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    {/* Stepper Controls (Minimum 48px touch targets) */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStep(item.key, -0.5, item.maxScore, item.isBonus)}
                        disabled={(currentVal ?? 0) <= 0}
                        aria-label={`Decrease score for ${item.label}`}
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer font-bold text-base shadow-2xs"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <div className="relative">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max={item.maxScore + (item.isBonus ? 5 : 0)}
                          inputMode="decimal"
                          value={currentVal !== undefined && currentVal !== null ? currentVal : ''}
                          placeholder="—"
                          onChange={e => {
                            const val = e.target.value === '' ? null : parseFloat(e.target.value);
                            handleScoreChange(item.key, val, item.maxScore, item.isBonus);
                          }}
                          className="w-16 h-12 text-center font-mono text-base font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 focus:border-[#3B82F6]"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStep(item.key, 0.5, item.maxScore, item.isBonus)}
                        disabled={(currentVal ?? 0) >= item.maxScore + (item.isBonus ? 5 : 0)}
                        aria-label={`Increase score for ${item.label}`}
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer font-bold text-base shadow-2xs"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick Preset Chips */}
                    <div className="flex items-center gap-1 overflow-x-auto">
                      <button
                        type="button"
                        onClick={() => handleScoreChange(item.key, 0, item.maxScore, item.isBonus)}
                        className="h-9 px-2.5 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                      >
                        0
                      </button>
                      <button
                        type="button"
                        onClick={() => handleScoreChange(item.key, item.maxScore / 2, item.maxScore, item.isBonus)}
                        className="h-9 px-2.5 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                      >
                        Half
                      </button>
                      <button
                        type="button"
                        onClick={() => handleScoreChange(item.key, item.maxScore, item.maxScore, item.isBonus)}
                        className="h-9 px-2.5 rounded-lg text-xs font-semibold bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/20 transition-colors cursor-pointer"
                      >
                        Full
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Sequential Student Navigation Footer */}
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onPrevStudent}
              disabled={!hasPrevStudent}
              className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-[0.98] cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="text-center px-2">
              <div className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
                {currentIndex + 1} / {totalStudents}
              </div>
              <div className="text-[10px] text-zinc-400 font-medium">
                Students
              </div>
            </div>

            <button
              type="button"
              onClick={onNextStudent}
              disabled={!hasNextStudent}
              className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-[#3B82F6] text-white text-xs font-bold hover:bg-[#2563EB] disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-[0.98] cursor-pointer shadow-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
};
