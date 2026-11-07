import React, { useState } from 'react';
import { Calculator, RefreshCw, Award, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';
import { calculateStudentAssignmentScore, roundUpToTwoDecimals } from '../../utils/grading';

export const WhatIfCalculator: React.FC = () => {
  const { currentUser } = useAuth();
  const { assignments: allAssignments, grades, courseConfig } = useCourse();
  const assignments = React.useMemo(() => allAssignments.filter(a => a.status !== 'draft'), [allAssignments]);

  const studentId = currentUser?.id ?? '';
  const semesterScale = courseConfig?.semesterScale || 5.0;

  // Actual recorded score for an assignment, or null if nothing is graded yet
  const actualScore = (asg: (typeof assignments)[number]): number | null => {
    const g = grades[`${studentId}_${asg.id}`];
    if (!g || Object.keys(g.scores || {}).length === 0) return null;
    const calc = calculateStudentAssignmentScore(asg, g.scores);
    return calc.displayScore;
  };

  // Simulated scores — real scores are the starting point, the rest default to targetScale
  const [simulatedScores, setSimulatedScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    assignments.forEach(asg => {
      const asgScale = asg.targetScale ?? 1.0;
      initial[asg.id] = actualScore(asg) ?? asgScale;
    });
    return initial;
  });

  // Apply a target ratio (e.g. 0.95 for 95%) to un-evaluated assignments
  const applyTargetRatio = (ratio: number) => {
    setSimulatedScores(prev => {
      const next = { ...prev };
      assignments.forEach(asg => {
        const actual = actualScore(asg);
        const asgScale = asg.targetScale ?? 1.0;
        next[asg.id] = actual ?? roundUpToTwoDecimals(asgScale * ratio);
      });
      return next;
    });
  };

  const handleScoreChange = (asgId: string, value: number, maxAllowed: number) => {
    setSimulatedScores(prev => ({
      ...prev,
      [asgId]: Math.max(0, Math.min(maxAllowed, value)),
    }));
  };

  // Compute final projected course percentage and projected semester total
  let projectedWeightedRatioSum = 0;
  let totalWeight = 0;

  assignments.forEach(asg => {
    const asgScale = asg.targetScale ?? 1.0;
    const simScore = simulatedScores[asg.id] ?? actualScore(asg) ?? asgScale;
    const ratio = asgScale > 0 ? simScore / asgScale : 0;
    const w = courseConfig?.weightMode === 'weightPercent' && asg.weightPercent > 0 ? asg.weightPercent : 1.0;
    projectedWeightedRatioSum += ratio * w;
    totalWeight += w;
  });

  const projectedRatio = totalWeight > 0 ? projectedWeightedRatioSum / totalWeight : 0;
  const projectedPercentage = projectedRatio * 100;
  const projectedSemesterTotal = roundUpToTwoDecimals(projectedRatio * semesterScale);
  const isOverflow = projectedSemesterTotal > semesterScale;

  const getStatusLabel = (pct: number) => {
    if (pct >= 90) return { label: 'Mastery / Distinction', color: 'text-[#3B82F6]' };
    if (pct >= 80) return { label: 'Excellent', color: 'text-emerald-500' };
    if (pct >= 70) return { label: 'Proficient', color: 'text-teal-500' };
    if (pct >= 60) return { label: 'Satisfactory', color: 'text-sky-500' };
    if (pct >= 50) return { label: 'Passing', color: 'text-amber-500' };
    return { label: 'Remediation Needed', color: 'text-rose-500' };
  };

  const status = getStatusLabel(projectedPercentage);

  return (
    <div className="space-y-6">
      {/* Header (Supabase theme) */}
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3B82F6] mb-1">
            <Calculator className="w-4 h-4" />
            <span>Scenario Simulator · Normalized Semester Scale (Max: {semesterScale.toFixed(1)})</span>
          </div>
          <h1 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-100">
            "What-If" Final Grade Planner
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
            Try hypothetical marks based on assignment target scales to see your projected semester score. Your recorded scores are used as the starting point.
          </p>
        </div>

        {/* Projected Result Callout */}
        <div className="flex items-center justify-between sm:justify-start gap-4 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 sm:min-w-[240px]">
          <div>
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold block">
              Projected Final
            </span>
            <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {projectedSemesterTotal.toFixed(2)}{' '}
              <span className="text-xs font-normal text-zinc-400">/ {semesterScale.toFixed(1)}</span>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">
              ({projectedPercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="border-l border-zinc-200 dark:border-zinc-800 pl-4">
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold block">
              Performance Status
            </span>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-black font-mono ${status.color}`}>
                {projectedPercentage.toFixed(0)}%
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 font-medium block truncate max-w-[130px]">
              {isOverflow ? '+Bonus Overflow' : status.label}
            </span>
          </div>
        </div>
      </div>

      {/* Simulator Inputs Table */}
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Adjust Hypothetical Marks (Normalized Target Scales)
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => applyTargetRatio(0.95)}
              className="text-xs text-[#3B82F6] hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Aim for 95% (Mastery)</span>
            </button>
            <span className="text-zinc-400 hidden sm:inline">·</span>
            <button
              onClick={() => applyTargetRatio(0.85)}
              className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:underline cursor-pointer"
            >
              Aim for 85% (Distinction)
            </button>
          </div>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {assignments.map(asg => {
            const asgScale = asg.targetScale ?? 1.0;
            const hasActual = grades[`${studentId}_${asg.id}`];
            const currentVal = simulatedScores[asg.id] ?? actualScore(asg) ?? asgScale;
            const maxAllowed = roundUpToTwoDecimals(asgScale * 1.5);

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
                    Target Scale: {asgScale.toFixed(1)} pts · Weight: {asg.weightPercent}% · Due: {new Date(asg.dueDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full md:w-auto pt-1 sm:pt-0">
                  {/* Range Slider */}
                  <input
                    type="range"
                    min="0"
                    max={asgScale}
                    step="0.05"
                    value={Math.min(asgScale, currentVal)}
                    onChange={e => handleScoreChange(asg.id, parseFloat(e.target.value), maxAllowed)}
                    className="flex-1 sm:flex-initial sm:w-36 accent-[#3B82F6] cursor-pointer h-8"
                  />

                  {/* Direct Number Input */}
                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      type="number"
                      min="0"
                      max={maxAllowed}
                      step="0.05"
                      value={currentVal}
                      onChange={e => handleScoreChange(asg.id, Number.isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value), maxAllowed)}
                      className="w-16 h-10 sm:h-8 px-2 py-1 text-base sm:text-xs font-mono font-bold text-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                    />
                    <span className="text-xs text-zinc-400 font-mono">/ {asgScale.toFixed(1)}</span>
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
