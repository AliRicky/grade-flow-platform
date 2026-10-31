import { GradingScale } from '../types';

/**
 * Dynamic Scoring & Grading Engine
 * Supports arbitrary, per-course scoring scales (e.g. 9-point scale, 20-point scale,
 * 100-point percentage scale, 4.0 GPA scale, or user-defined custom numeric scales).
 */

export interface NumericGrade {
  gradeNumber: number; // Integer grade or rounded scaled score
  scaledValue: number; // Continuous score out of scale.max_score (e.g. 8.6 / 9.0 or 17.5 / 20.0)
  displayGrade: string; // e.g. "Grade 9" (scale 9) or "18.5 / 20"
  label: string; // e.g. "Mastery / Distinction"
  colorClass: string;
  badgeBg: string;
  isPassing: boolean;
  maxScore: number;
}

export const DEFAULT_GRADING_SCALE: GradingScale = {
  type: 'numeric',
  max_score: 9.0,
  passing_threshold: 4.0,
  precision: 1,
  label: '9-Point Scale (Original)',
};

export const PRESET_GRADING_SCALES: Record<string, GradingScale> = {
  scale_9: {
    type: 'numeric',
    max_score: 9.0,
    passing_threshold: 4.0,
    precision: 1,
    label: '9-Point Scale (Original)',
  },
  scale_20: {
    type: 'numeric',
    max_score: 20.0,
    passing_threshold: 10.0,
    precision: 1,
    label: '20-Point Academic Scale (European / Iranian)',
  },
  scale_100: {
    type: 'numeric',
    max_score: 100.0,
    passing_threshold: 60.0,
    precision: 1,
    label: '100-Point Standard Percentage Scale',
  },
  scale_4: {
    type: 'numeric',
    max_score: 4.0,
    passing_threshold: 2.0,
    precision: 2,
    label: '4.0 GPA Scale',
  },
};

/**
 * Normalizes any persisted JSON grading scale (including legacy migration 00001 format)
 * into a valid, strongly-typed GradingScale instance.
 */
export function normalizeGradingScale(rawScale: any): GradingScale {
  if (!rawScale || typeof rawScale !== 'object') {
    return DEFAULT_GRADING_SCALE;
  }

  const max_score = Number(rawScale.max_score) > 0 ? Number(rawScale.max_score) : 9.0;
  const passing_threshold = Number(rawScale.passing_threshold ?? rawScale.min_pass ?? (max_score * 0.4444));
  const precision = Number.isInteger(rawScale.precision) && rawScale.precision >= 0 ? rawScale.precision : (max_score <= 10 ? 1 : 1);
  const type = rawScale.type === 'letter' || rawScale.type === 'points' ? rawScale.type : 'numeric';
  const label = rawScale.label || `${max_score}-Point Scale`;

  return {
    type,
    max_score,
    passing_threshold: Math.round(passing_threshold * 100) / 100,
    precision,
    label,
    letter_cutoffs: Array.isArray(rawScale.letter_cutoffs) ? rawScale.letter_cutoffs : undefined,
  };
}

/**
 * Calculates grade details, continuous scaled value, qualitative label, badge styling,
 * and passing status for any given percentage under the active course GradingScale.
 */
export function calculateNumericGrade(
  percentage: number,
  scale: GradingScale = DEFAULT_GRADING_SCALE
): NumericGrade {
  const activeScale = normalizeGradingScale(scale);
  const clampedPct = Math.max(0, Math.min(100, percentage));
  const precision = activeScale.precision ?? 1;
  const factor = Math.pow(10, precision);

  const scaled = (clampedPct / 100) * activeScale.max_score;
  const scaledValue = Math.round(scaled * factor) / factor;
  const isPassing = scaled >= activeScale.passing_threshold;

  // Backwards compatibility for original 9-point scale
  if (activeScale.max_score === 9) {
    let gradeNumber = 1;
    let label = 'Minimal';
    let colorClass = 'text-rose-400';
    let badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';

    if (clampedPct >= 90) {
      gradeNumber = 9;
      label = 'Mastery / Distinction';
      colorClass = 'text-[#3B82F6]';
      badgeBg = 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20';
    } else if (clampedPct >= 80) {
      gradeNumber = 8;
      label = 'Excellent';
      colorClass = 'text-emerald-400';
      badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    } else if (clampedPct >= 70) {
      gradeNumber = 7;
      label = 'Proficient';
      colorClass = 'text-teal-400';
      badgeBg = 'bg-teal-500/10 text-teal-400 border-teal-500/20';
    } else if (clampedPct >= 60) {
      gradeNumber = 6;
      label = 'Good';
      colorClass = 'text-sky-400';
      badgeBg = 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    } else if (clampedPct >= 50) {
      gradeNumber = 5;
      label = 'Satisfactory';
      colorClass = 'text-amber-400';
      badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    } else if (clampedPct >= 40) {
      gradeNumber = 4;
      label = 'Passing';
      colorClass = 'text-orange-400';
      badgeBg = 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    } else if (clampedPct >= 30) {
      gradeNumber = 3;
      label = 'Marginal';
      colorClass = 'text-rose-300';
      badgeBg = 'bg-rose-500/10 text-rose-300 border-rose-500/20';
    } else if (clampedPct >= 20) {
      gradeNumber = 2;
      label = 'Basic';
      colorClass = 'text-rose-400';
      badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    } else {
      gradeNumber = 1;
      label = 'Minimal';
      colorClass = 'text-rose-500';
      badgeBg = 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    }

    return {
      gradeNumber,
      scaledValue,
      displayGrade: `Grade ${gradeNumber}`,
      label,
      colorClass,
      badgeBg,
      isPassing,
      maxScore: 9.0,
    };
  }

  // Generalized multi-scale evaluation for customized courses (20-point, 100-point, 4.0, custom)
  const passPercent = (activeScale.passing_threshold / activeScale.max_score) * 100;
  let label = 'Minimal';
  let colorClass = 'text-rose-400';
  let badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';

  if (clampedPct >= 90) {
    label = 'Mastery / Distinction';
    colorClass = 'text-[#3B82F6]';
    badgeBg = 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20';
  } else if (clampedPct >= 80) {
    label = 'Excellent';
    colorClass = 'text-emerald-400';
    badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (clampedPct >= 70) {
    label = 'Proficient';
    colorClass = 'text-teal-400';
    badgeBg = 'bg-teal-500/10 text-teal-400 border-teal-500/20';
  } else if (clampedPct >= 60) {
    label = 'Good';
    colorClass = 'text-sky-400';
    badgeBg = 'bg-sky-500/10 text-sky-400 border-sky-500/20';
  } else if (clampedPct >= 50) {
    label = 'Satisfactory';
    colorClass = 'text-amber-400';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  } else if (clampedPct >= passPercent) {
    label = 'Passing';
    colorClass = 'text-orange-400';
    badgeBg = 'bg-orange-500/10 text-orange-400 border-orange-500/20';
  } else if (clampedPct >= passPercent * 0.75) {
    label = 'Marginal';
    colorClass = 'text-rose-300';
    badgeBg = 'bg-rose-500/10 text-rose-300 border-rose-500/20';
  } else if (clampedPct >= passPercent * 0.5) {
    label = 'Basic';
    colorClass = 'text-rose-400';
    badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  } else {
    label = 'Minimal';
    colorClass = 'text-rose-500';
    badgeBg = 'bg-rose-500/10 text-rose-500 border-rose-500/20';
  }

  const gradeNumber = Math.round(scaledValue);
  const displayGrade = `${scaledValue.toFixed(precision)} / ${activeScale.max_score}`;

  return {
    gradeNumber,
    scaledValue,
    displayGrade,
    label,
    colorClass,
    badgeBg,
    isPassing,
    maxScore: activeScale.max_score,
  };
}

/**
 * Scales a raw points score out of totalMaxScore into the course's active grading scale.
 */
export function scaleRawScore(
  rawScore: number,
  totalMaxScore: number,
  scale: GradingScale = DEFAULT_GRADING_SCALE
): number {
  const activeScale = normalizeGradingScale(scale);
  if (totalMaxScore <= 0) return Math.min(activeScale.max_score, rawScore);
  const precision = activeScale.precision ?? 1;
  const factor = Math.pow(10, precision);
  const rawScaled = (rawScore / totalMaxScore) * activeScale.max_score;
  return Math.min(activeScale.max_score, Math.round(rawScaled * factor) / factor);
}

export function getNumericGradeScaleBreakdown(scale: GradingScale = DEFAULT_GRADING_SCALE) {
  const activeScale = normalizeGradingScale(scale);
  if (activeScale.max_score === 9) {
    return [
      { grade: 9, range: '90 – 100%', label: 'Mastery / Distinction', desc: 'Highest standard attainment' },
      { grade: 8, range: '80 – 89%', label: 'Excellent', desc: 'Comprehensive domain understanding' },
      { grade: 7, range: '70 – 79%', label: 'Proficient', desc: 'Solid analytical comprehension' },
      { grade: 6, range: '60 – 69%', label: 'Good', desc: 'Competent execution on core concepts' },
      { grade: 5, range: '50 – 59%', label: 'Satisfactory', desc: 'Satisfactory baseline attainment' },
      { grade: 4, range: '40 – 49%', label: 'Passing', desc: 'Minimum passing criteria' },
      { grade: 3, range: '30 – 39%', label: 'Marginal', desc: 'Substantial concept remediation needed' },
      { grade: 2, range: '20 – 29%', label: 'Basic', desc: 'Significant deficits' },
      { grade: 1, range: '< 20%', label: 'Minimal', desc: 'Incomplete submissions' },
    ];
  }

  const m = activeScale.max_score;
  const p = activeScale.precision ?? 1;
  const pass = activeScale.passing_threshold;

  return [
    { grade: m, range: `90 – 100% (${(m * 0.9).toFixed(p)} – ${m})`, label: 'Mastery / Distinction', desc: 'Highest standard attainment' },
    { grade: Math.round(m * 0.8), range: `80 – 89% (${(m * 0.8).toFixed(p)} – ${(m * 0.89).toFixed(p)})`, label: 'Excellent', desc: 'Comprehensive domain understanding' },
    { grade: Math.round(m * 0.7), range: `70 – 79% (${(m * 0.7).toFixed(p)} – ${(m * 0.79).toFixed(p)})`, label: 'Proficient', desc: 'Solid analytical comprehension' },
    { grade: Math.round(m * 0.6), range: `60 – 69% (${(m * 0.6).toFixed(p)} – ${(m * 0.69).toFixed(p)})`, label: 'Good', desc: 'Competent execution on core concepts' },
    { grade: pass, range: `Passing threshold: ≥ ${pass.toFixed(p)} pts`, label: 'Passing', desc: `Official passing threshold (≥ ${(pass / m * 100).toFixed(0)}%)` },
    { grade: 0, range: `< ${pass.toFixed(p)} pts`, label: 'At-Risk / Needs Remediation', desc: 'Below passing threshold' },
  ];
}

