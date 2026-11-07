/**
 * Proportional Normalized Grading Engine
 *
 * Implements:
 * 1. roundUpToTwoDecimals with IEEE-754 precision defense (ceil toward +inf to favor students: 2.13453 -> 2.14).
 * 2. Auto-calculated denominator summing standard (non-bonus) questions only.
 * 3. Uncapped bonus overflow allowing assignment scores and semester totals to exceed nominal scales (e.g. 1.09 / 1.0, 5.40 / 5.0).
 * 4. Customizable assignment scales (targetScale, e.g. 1.0 or 3.0) and customizable semester total target scale (e.g. 5, 6, 9, 20).
 * 5. Exact floating-point math maintained across intermediate steps.
 */

import {
  Assignment,
  StudentAssignmentCalculation,
  StudentAssignmentGrade,
  StudentScoreMap,
  SemesterStudentSummary,
  User,
} from '../types';

/**
 * Rounds a number up to two decimal places (ceil toward positive infinity),
 * defending against IEEE-754 floating point representation artifacts.
 * E.g., 2.13453 -> 2.14, 0.1 + 0.2 -> 0.30, 4.7333... -> 4.74.
 */
export function roundUpToTwoDecimals(val: number): number {
  if (!Number.isFinite(val)) return 0;
  const scaled = val * 100;
  const roundedScaled = Math.round(scaled);
  // Defend against IEEE-754 floating point imprecision (e.g., 0.1 + 0.2 = 0.30000000000000004 or 1.0000000000000002)
  if (Math.abs(scaled - roundedScaled) < 1e-8) {
    return roundedScaled / 100;
  }
  return Math.ceil(scaled) / 100;
}

/**
 * Automatically calculates the denominator for an assignment:
 * sums all standard (non-bonus) question and subquestion maximum points.
 * Bonus question points are strictly excluded from the denominator.
 */
export function calculateAssignmentDenominator(assignment: Assignment): number {
  let standardTotal = 0;
  const questions = Array.isArray(assignment?.questions) ? assignment.questions : [];
  questions.forEach(q => {
    if (q.isBonus) return; // Bonus question points are excluded from the denominator
    if (Array.isArray(q.subQuestions) && q.subQuestions.length > 0) {
      q.subQuestions.forEach(sq => {
        if (!sq.isBonus) {
          standardTotal += Number(sq.maxScore) || 0;
        }
      });
    } else {
      standardTotal += Number(q.directMaxScore) || 0;
    }
  });

  // If computed standard total is greater than 0, return it
  if (standardTotal > 0) return standardTotal;
  // Fallback to totalMaxScore if positive, else default 1 to prevent division by zero
  return Number(assignment?.totalMaxScore) > 0 ? Number(assignment.totalMaxScore) : 1;
}

/**
 * Calculates a student's score on a single assignment using the proportional formula:
 * Score = ((standardEarned + bonusEarned) / standardDenominator) * targetScale
 *
 * Exact floating-point math is preserved, and displayScore is rounded up to 2 decimal places.
 * Uncapped bonus points allow exactScore and displayScore to exceed targetScale.
 */
export function calculateStudentAssignmentScore(
  assignment: Assignment,
  scores?: StudentScoreMap
): StudentAssignmentCalculation {
  let standardEarned = 0;
  let bonusEarned = 0;

  const questions = Array.isArray(assignment?.questions) ? assignment.questions : [];
  questions.forEach(q => {
    if (Array.isArray(q.subQuestions) && q.subQuestions.length > 0) {
      q.subQuestions.forEach(sq => {
        const val = scores?.[`${q.id}_${sq.id}`];
        if (val !== undefined && val !== null && Number.isFinite(Number(val))) {
          const numVal = Number(val);
          if (q.isBonus || sq.isBonus) {
            bonusEarned += numVal;
          } else {
            standardEarned += numVal;
          }
        }
      });
    } else {
      const val = scores?.[q.id];
      if (val !== undefined && val !== null && Number.isFinite(Number(val))) {
        const numVal = Number(val);
        if (q.isBonus) {
          bonusEarned += numVal;
        } else {
          standardEarned += numVal;
        }
      }
    }
  });

  const totalEarned = standardEarned + bonusEarned;
  const standardDenominator = calculateAssignmentDenominator(assignment);
  const targetScale = Number.isFinite(Number(assignment?.targetScale)) && Number(assignment.targetScale) > 0
    ? Number(assignment.targetScale)
    : 1.0;

  // Exact floating-point calculation without artificial clamping
  const exactScore = (totalEarned / standardDenominator) * targetScale;
  const displayScore = roundUpToTwoDecimals(exactScore);
  const percentage = standardDenominator > 0 ? (totalEarned / standardDenominator) * 100 : 0;
  const isOverflow = exactScore > targetScale;

  return {
    standardEarned,
    bonusEarned,
    totalEarned,
    standardDenominator,
    targetScale,
    exactScore,
    displayScore,
    percentage,
    isOverflow,
  };
}

/**
 * Calculates the complete semester summary for all students across all assignments.
 *
 * Solid Score Semantic:
 * - Each assignment contributes its solid score: exactScore_i (scaled to targetScale_i, e.g. 1.0 or 3.0).
 * - Total assignment solid score capacity assigned so far: totalAssignmentTargetScore = sum(targetScale_i).
 * - Sum of student's earned solid scores: sumEarnedScores = sum(exactScore_i).
 * - By default (scaleMode = 'cumulative'):
 *     exactSemesterTotal = sumEarnedScores (direct cumulative solid score sum).
 *     Scores accumulate cumulatively towards semesterScale as assignments are completed across the term.
 *     Final Total = roundUpToTwoDecimals(sum(earnedAssignmentScore_i)).
 * - If scaleMode === 'proportional':
 *     exactSemesterTotal = (sumEarnedScores / totalAssignmentTargetScore) * semesterScale.
 * - If weightMode === 'weightPercent' (and weightSum > 0):
 *     exactSemesterTotal = (weightedRatioSum / weightSum) * semesterScale.
 * - Display semester total: displaySemesterTotal = roundUpToTwoDecimals(exactSemesterTotal).
 * - Fully uncapped: students with bonus points legitimately exceed target scales.
 */
export function calculateSemesterSummary(params: {
  assignments: Assignment[];
  students: User[];
  grades: Record<string, StudentAssignmentGrade>;
  semesterScale?: number;
  weightMode?: 'equal' | 'weightPercent';
  scaleMode?: 'cumulative' | 'proportional';
}): SemesterStudentSummary[] {
  const {
    assignments,
    students,
    grades,
    semesterScale,
    weightMode = 'equal',
    scaleMode = 'cumulative',
  } = params;

  if (!Array.isArray(students) || students.length === 0) return [];

  // Total solid score capacity across all assignments (e.g. HW1: 1.0 + HW2: 1.0 + Q1: 3.0 = 5.0)
  const totalAssignmentTargetScore = assignments.reduce(
    (acc, asg) => acc + (Number.isFinite(Number(asg?.targetScale)) && Number(asg.targetScale) > 0 ? Number(asg.targetScale) : 1.0),
    0
  );

  // Semester target scale (from user input or default to totalAssignmentTargetScore or 5.0)
  const targetScaleNum = Number.isFinite(Number(semesterScale)) && Number(semesterScale)! > 0
    ? Number(semesterScale)
    : (totalAssignmentTargetScore > 0 ? totalAssignmentTargetScore : 5.0);

  return students.map(student => {
    const assignmentScores: Record<string, StudentAssignmentCalculation> = {};
    let sumEarnedScores = 0;
    let weightedRatioSum = 0;
    let weightSum = 0;

    assignments.forEach(asg => {
      const g = grades[`${student.id}_${asg.id}`];
      const calc = calculateStudentAssignmentScore(asg, g?.scores);
      assignmentScores[asg.id] = calc;
      sumEarnedScores += calc.exactScore;

      if (weightMode === 'weightPercent' && asg.weightPercent > 0) {
        const normalizedRatio = calc.targetScale > 0 ? calc.exactScore / calc.targetScale : 0;
        weightedRatioSum += normalizedRatio * asg.weightPercent;
        weightSum += asg.weightPercent;
      }
    });

    let exactSemesterTotal = sumEarnedScores;
    if (weightMode === 'weightPercent' && weightSum > 0) {
      const overallRatio = weightedRatioSum / weightSum;
      exactSemesterTotal = overallRatio * targetScaleNum;
    } else if (scaleMode === 'proportional') {
      // Proportional scaling explicitly requested
      if (totalAssignmentTargetScore > 0) {
        exactSemesterTotal = (sumEarnedScores / totalAssignmentTargetScore) * targetScaleNum;
      } else {
        exactSemesterTotal = sumEarnedScores;
      }
    } else {
      // Cumulative solid score accumulation (Default):
      // Each assignment directly contributes its solid score towards the semester target scale.
      // Final Total = sum(earnedAssignmentScore_i)
      exactSemesterTotal = sumEarnedScores;
    }

    const displaySemesterTotal = roundUpToTwoDecimals(exactSemesterTotal);
    const isSemesterOverflow = exactSemesterTotal > targetScaleNum;

    return {
      studentId: student.id,
      studentName: student.full_name || 'Unknown',
      studentNumber: student.studentId || '',
      section: student.section,
      assignmentScores,
      exactSemesterTotal,
      displaySemesterTotal,
      semesterScale: targetScaleNum,
      isSemesterOverflow,
    };
  });
}

/**
 * Backward compatibility:
 * Numeric Grading System (Scale of 9 / percentage breakdown)
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
