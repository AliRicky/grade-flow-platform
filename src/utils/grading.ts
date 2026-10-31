/**
 * Numeric Grading System (Scale of 9)
 * Replaces traditional letter grades (A, B, C...) with a standardized 9-point numeric grading scale,
 * where 9 represents the highest distinction (Mastery).
 */

export interface NumericGrade {
  gradeNumber: number; // Integer grade from 1 to 9 (9 is top)
  scaledValue: number; // Continuous score out of 9.0 (e.g. 8.6 / 9.0)
  displayGrade: string; // e.g. "Grade 9" or "9"
  label: string; // e.g. "Distinction / Mastery"
  colorClass: string;
  badgeBg: string;
}

export function calculateNumericGrade(percentage: number): NumericGrade {
  const clampedPct = Math.max(0, Math.min(100, percentage));
  const scaled = (clampedPct / 100) * 9;
  // Use Math.round to avoid floating point precision issues with toFixed
  const scaledValue = Math.round(scaled * 10) / 10;

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
  };
}

export function getNumericGradeScaleBreakdown() {
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
