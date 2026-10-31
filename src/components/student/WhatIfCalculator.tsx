import React, { useState } from 'react';
import { Calculator, Sparkles, RefreshCw, Award, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';
import { calculateNumericGrade } from '../../utils/grading';

export const WhatIfCalculator: React.FC = () => {
  const { currentUser } = useAuth();
  const { assignments: allAssignments, grades } = useCourse();
  const assignments = React.useMemo(() => allAssignments.filter(a => a.status !== 'draft'), [allAssignments]);

  const studentId = currentUser?.id ?? '';

  // Actual recorded score (out of 9) for an assignment, or null if nothing is graded yet
  const actualScore = (asg: (typeof assignments)[number]): number | null => {
    const g = grades[`${studentId}_${asg.id}`];
    if (!g || Object.keys(g.scores || {}).length === 0) return null;
    let total = 0;
    let any = false;
    const questions = Array.isArray(asg.questions) ? asg.questions : [];
    questions.forEach(q => {
      const sqs = Array.isArray(q.subQuestions) ? q.subQuestions : [];
      const keys = sqs.length > 0
        ? sqs.map(sq => `${q.id}_${sq.id}`)
        : [q.id];
      keys.forEach(k => {
        const v = g.scores[k];
        if (v !== undefined && v !== null) { total += v; any = true; }
      });
    });
    if (!any) return null;
    return asg.totalMaxScore > 0
      ? Math.min(9, Math.round((total / asg.totalMaxScore) * 9 * 10) / 10)
      : Math.min(9, total);
  };

  // Simulated scores (out of 9) — real scores are the starting point, the rest default to 8.0
  const [simulatedScores, setSimulatedScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    assignments.forEach(asg => {
      initial[asg.id] = actualScore(asg) ?? 8.0;
    });
    return initial;
  });

  // Apply a target to every assessment that has no recorded grade (actual scores stay put)
  const applyTarget = (target: number) => {
    setSimulatedScores(prev => {
      const next = { ...prev };
      assignments.forEach(asg => {
        const actual = actualScore(asg);
        next[asg.id] = actual ?? target;
      });
      return next;
    });
  };

  const handleScoreChange = (asgId: string, value: number) => {
    setSimulatedScores(prev => ({
      ...prev,
      [asgId]: Math.min(9, Math.max(0, value)),
    }));
  };

  // Compute final projected course percentage
  let projectedWeightedSum = 0;
  let totalWeight = 0;

  assignments.forEach(asg => {
    const scoreOutOf9 = simulatedScores[asg.id] ?? actualScore(asg) ?? 8.0;
    const ratio = Math.min(1, scoreOutOf9 / 9);
    projectedWeightedSum += ratio * asg.weightPercent;
    totalWeight += asg.weightPercent;
  });

  const projectedPercentage = totalWeight > 0 ? (projectedWeightedSum / totalWeight) * 100 : 0;
  const projectedGrade = calculateNumericGrade(projectedPercentage);
  const projectedScoreOutOf9 = ((projectedPercentage / 100) * 9).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header (Supabase theme) */}
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3B82F6] mb-1">
            <Calculator className="w-4 h-4" />
            <span>Scenario Simulator · Scale 9 Standard (Max: 9.0)</span>
          </div>
          <h1 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-100">
            "What-If" Final Grade Planner
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
            Try hypothetical marks on upcoming quizzes and homework (0.0–9.0) to see which final grade you could reach. Your recorded scores are used as the starting point.
          </p>
        </div>

        {/* Projected Result Callout */}
        <div className="flex items-center justify-between sm:justify-start gap-4 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 sm:min-w-[240px]">
          <div>
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold block">
              Projected Final
            </span>
            <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {projectedScoreOutOf9} <span className="text-xs font-normal text-zinc-400">/ 9.0</span>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">
              ({projectedPercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="border-l border-zinc-200 dark:border-zinc-800 pl-4">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold block">
              Numeric Grade
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-[#3B82F6]">
                Grade {projectedGrade.gradeNumber}
              </span>
              <span className="text-xs text-zinc-400 font-mono">/ 9</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-medium block">
              {projectedGrade.label}
            </span>
          </div>
        </div>
      </div>

      {/* Simulator Inputs Table */}
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Adjust Hypothetical Marks (Scale: 0 – 9.0 · Max: 9)
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => applyTarget(8.1)}
              className="text-xs text-[#3B82F6] hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Aim for Grade 9 (8.1 / 9)</span>
            </button>
            <span className="text-zinc-400 hidden sm:inline">·</span>
            <button
              onClick={() => applyTarget(7.2)}
              className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:underline cursor-pointer"
            >
              Aim for Grade 8 (7.2 / 9)
            </button>
          </div>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {assignments.map(asg => {
            const hasActual = grades[`${studentId}_${asg.id}`];
            const currentVal = simulatedScores[asg.id] ?? actualScore(asg) ?? 8.0;

            return (
              <div
                key={asg.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">
                      {asg.shortCode}
                    </span>
                    <span className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold truncate">
                      {asg.title}
                    </span>
                    {hasActual && (
                      <span className="text-[10px] text-[#3B82F6] font-mono bg-[#3B82F6]/10 px-1.5 py-0.5 rounded border border-[#3B82F6]/20">
                        Actual Recorded
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                    Course Weight: {asg.weightPercent}% · Due: {new Date(asg.dueDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full md:w-auto pt-1 sm:pt-0">
                  {/* Range Slider with Supabase green accent */}
                  <input
                    type="range"
                    min="0"
                    max="9"
                    step="0.1"
                    value={currentVal}
                    onChange={e => handleScoreChange(asg.id, parseFloat(e.target.value))}
                    className="flex-1 sm:flex-initial sm:w-36 accent-[#3B82F6] cursor-pointer h-8"
                  />

                  {/* Direct Number Input */}
                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      type="number"
                      min="0"
                      max="9"
                      step="0.1"
                      value={currentVal}
                      onChange={e => handleScoreChange(asg.id, Number.isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value))}
                      className="w-16 h-10 sm:h-8 px-2 py-1 text-base sm:text-xs font-mono font-bold text-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                    />
                    <span className="text-xs text-zinc-400 font-mono">/ 9.0</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
