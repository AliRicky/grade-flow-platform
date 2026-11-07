/**
 * CSV Export & Import Handler matching university course grading sheets.
 * Standardized on 100% English headers and normalized grading scale.
 */

import { Assignment, StudentAssignmentGrade, User } from '../types';
import {
  calculateStudentAssignmentScore,
  calculateSemesterSummary,
  roundUpToTwoDecimals
} from './grading';

export interface GradeRowData {
  student: User;
  scores: Record<string, number | null>;
  totalScore: number;
  finalScore: number;
}

const csvQuote = (v: string) => `"${String(v).replace(/"/g, '""')}"`;

export function generateCSVContent(
  assignment: Assignment,
  students: User[],
  gradesMap: Record<string, StudentAssignmentGrade>,
  _language: string = 'en'
): string {
  // Collect all score columns from assignment questions and sub-questions
  interface ColumnDef {
    key: string;
    label: string;
    maxScore: number;
    isBonus?: boolean;
  }

  const columns: ColumnDef[] = [];

  const asgQuestions = Array.isArray(assignment?.questions) ? assignment.questions : [];
  asgQuestions.forEach(q => {
    if (q.subQuestions && q.subQuestions.length > 0) {
      q.subQuestions.forEach(sq => {
        columns.push({
          key: `${q.id}_${sq.id}`,
          label: sq.label || `${q.number} (${sq.id})`,
          maxScore: sq.maxScore,
          isBonus: q.isBonus,
        });
      });
    } else {
      columns.push({
        key: `${q.id}`,
        label: `Q${q.number}`,
        maxScore: q.directMaxScore || 0,
        isBonus: q.isBonus,
      });
    }
  });

  const asgScale = assignment.targetScale !== undefined ? assignment.targetScale : 1.0;
  const scaledHeader = `Final Scaled (/${asgScale.toFixed(1)})`;

  const headers = [
    'First Name',
    'Last Name',
    'Student ID',
    ...columns.map(c => csvQuote(c.label)),
    'Bonus Points',
    'Raw Total',
    scaledHeader,
    'Percentage'
  ];

  const rows: string[] = [];
  rows.push(headers.join(','));

  const totalsByCol: Record<string, number> = {};
  const countsByCol: Record<string, number> = {};
  let overallTotalSum = 0;
  let overallFinalSum = 0;
  let gradedCount = 0;

  columns.forEach(c => {
    totalsByCol[c.key] = 0;
    countsByCol[c.key] = 0;
  });

  students.forEach(student => {
    const rawName = student.full_name || (student as any).name || '';
    const nameParts = rawName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const studentGrade = gradesMap[`${student.id}_${assignment.id}`];

    let totalScore = 0;
    let bonusScore = 0;

    const colValues = columns.map(c => {
      const val = studentGrade?.scores?.[c.key];
      if (val !== undefined && val !== null) {
        totalsByCol[c.key] += val;
        countsByCol[c.key] += 1;
        if (c.isBonus) {
          bonusScore += val;
        } else {
          totalScore += val;
        }
        return val.toString();
      }
      return '';
    });

    const calc = calculateStudentAssignmentScore(assignment, studentGrade?.scores);
    const combinedScore = calc.totalEarned;
    const finalScore = calc.displayScore;
    const pct = calc.percentage;

    if (colValues.some(v => v !== '')) {
      gradedCount++;
      overallTotalSum += combinedScore;
      overallFinalSum += calc.exactScore;
    }

    const row = [
      csvQuote(firstName),
      csvQuote(lastName),
      csvQuote(student.studentId || ""),
      ...colValues,
      bonusScore > 0 ? bonusScore.toString() : '0',
      combinedScore.toFixed(2),
      finalScore.toFixed(2),
      `"${pct.toFixed(0)}%"`
    ];

    rows.push(row.join(','));
  });

  // Summary Row (Averages)
  const avgColValues = columns.map(c => {
    const count = countsByCol[c.key];
    if (count > 0) {
      return (totalsByCol[c.key] / count).toFixed(2);
    }
    return '';
  });

  const avgTotal = gradedCount > 0 ? (overallTotalSum / gradedCount).toFixed(2) : '0.00';
  const avgFinal = gradedCount > 0 ? (overallFinalSum / gradedCount).toFixed(2) : '0.00';

  const summaryRow = [
    '"Class Mean"',
    '""',
    '""',
    ...avgColValues,
    '""',
    avgTotal,
    avgFinal,
    '""'
  ];
  rows.push(summaryRow.join(','));

  return rows.join('\n');
}

/**
 * Generate Master Gradebook CSV across all 5 HWs and 5 Quizzes
 */
export function generateMasterCSVContent(
  assignments: Assignment[],
  students: User[],
  gradesMap: Record<string, StudentAssignmentGrade>,
  _language: string = 'en'
): string {
  const hwList = assignments.filter(a => a.type === 'homework');
  const quizList = assignments.filter(a => a.type === 'quiz');

  const headers = [
    'First Name',
    'Last Name',
    'Student ID',
    'Section',
    ...hwList.map(h => `${h.shortCode} (/${(h.targetScale ?? 1.0).toFixed(1)})`),
    ...quizList.map(q => `${q.shortCode} (/${q.targetScale ?? 1.0})`),
    'Course Total (%)',
    'Final Scaled (/5.0)',
    'Performance Status'
  ];

  const rows: string[] = [];
  rows.push(headers.join(','));

  const hwSums: Record<string, number> = {};
  const hwCounts: Record<string, number> = {};
  const quizSums: Record<string, number> = {};
  const quizCounts: Record<string, number> = {};
  let classCourseTotalSum = 0;
  let studentsEvaluated = 0;

  hwList.forEach(h => { hwSums[h.id] = 0; hwCounts[h.id] = 0; });
  quizList.forEach(q => { quizSums[q.id] = 0; quizCounts[q.id] = 0; });

  students.forEach(student => {
    const nameParts = (student.full_name || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    let studentWeightedScoreSum = 0;
    let studentWeightSum = 0;

    const hwScores = hwList.map(h => {
      const g = gradesMap[`${student.id}_${h.id}`];
      if (!g || !g.scores || Object.keys(g.scores).length === 0) return '';
      const calc = calculateStudentAssignmentScore(h, g.scores);
      hwSums[h.id] += calc.exactScore;
      hwCounts[h.id] += 1;

      const ratio = calc.targetScale > 0 ? calc.exactScore / calc.targetScale : 0;
      studentWeightedScoreSum += ratio * h.weightPercent;
      studentWeightSum += h.weightPercent;

      return calc.displayScore.toFixed(2);
    });

    const quizScores = quizList.map(q => {
      const g = gradesMap[`${student.id}_${q.id}`];
      if (!g || !g.scores || Object.keys(g.scores).length === 0) return '';
      const calc = calculateStudentAssignmentScore(q, g.scores);
      quizSums[q.id] += calc.exactScore;
      quizCounts[q.id] += 1;

      const ratio = calc.targetScale > 0 ? calc.exactScore / calc.targetScale : 0;
      studentWeightedScoreSum += ratio * q.weightPercent;
      studentWeightSum += q.weightPercent;

      return calc.displayScore.toFixed(2);
    });

    const courseTotalPct = studentWeightSum > 0 ? (studentWeightedScoreSum / studentWeightSum) * 100 : 0;
    const finalScaled = (courseTotalPct / 100) * 5.0;
    const performanceStatus =
      courseTotalPct >= 90 ? 'Mastery' :
      courseTotalPct >= 80 ? 'Distinction' :
      courseTotalPct >= 70 ? 'Proficient' :
      courseTotalPct >= 60 ? 'Satisfactory' :
      courseTotalPct >= 50 ? 'Passing' : 'Remediation';

    if (studentWeightSum > 0) {
      classCourseTotalSum += courseTotalPct;
      studentsEvaluated += 1;
    }

    const row = [
      csvQuote(firstName),
      csvQuote(lastName),
      csvQuote(student.studentId || ""),
      csvQuote(student.section || "S1"),
      ...hwScores,
      ...quizScores,
      courseTotalPct.toFixed(2),
      finalScaled.toFixed(2),
      csvQuote(performanceStatus)
    ];

    rows.push(row.join(','));
  });

  // Summary Row (Class Averages)
  const hwAverages = hwList.map(h => {
    const count = hwCounts[h.id];
    return count > 0 ? (hwSums[h.id] / count).toFixed(2) : '';
  });

  const quizAverages = quizList.map(q => {
    const count = quizCounts[q.id];
    return count > 0 ? (quizSums[q.id] / count).toFixed(2) : '';
  });

  const avgCourseTotal = studentsEvaluated > 0 ? (classCourseTotalSum / studentsEvaluated).toFixed(2) : '0.00';
  const avgFinalScaled = (parseFloat(avgCourseTotal) / 100 * 5.0).toFixed(2);
  const avgStatus =
    parseFloat(avgCourseTotal) >= 90 ? 'Mastery' :
    parseFloat(avgCourseTotal) >= 80 ? 'Distinction' :
    parseFloat(avgCourseTotal) >= 70 ? 'Proficient' :
    parseFloat(avgCourseTotal) >= 60 ? 'Satisfactory' :
    parseFloat(avgCourseTotal) >= 50 ? 'Passing' : 'Remediation';

  const summaryRow = [
    '"Class Mean"',
    '""',
    '""',
    '""',
    ...hwAverages,
    ...quizAverages,
    avgCourseTotal,
    avgFinalScaled,
    csvQuote(avgStatus)
  ];

  rows.push(summaryRow.join(','));

  return rows.join('\n');
}

export function generateSemesterSummaryCSV(
  assignments: Assignment[],
  students: User[],
  gradesMap: Record<string, StudentAssignmentGrade>,
  options: { semesterScale?: number; weightMode?: 'equal' | 'weightPercent'; scaleMode?: 'cumulative' | 'proportional'; language?: 'en' | 'fa' } = {}
): string {
  const { semesterScale = 5.0, weightMode = 'equal', scaleMode = 'cumulative', language = 'en' } = options;
  const summary = calculateSemesterSummary({
    assignments,
    students,
    grades: gradesMap,
    semesterScale,
    weightMode,
    scaleMode,
  });

  const isFa = language === 'fa';
  const headers = isFa
    ? ['"نام"', '"نام خانوادگی"', '"شماره دانشجویی"', ...assignments.map(a => `"${a.shortCode}"`), `"نمره نهایی ( ${semesterScale} نمره )"`]
    : ['"First Name"', '"Last Name"', '"Student ID"', ...assignments.map(a => `"${a.shortCode}"`), `"Semester Total (Scale ${semesterScale})"`];

  const rows = [headers.join(',')];

  summary.forEach(s => {
    const parts = s.studentName.split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';
    const asgCols = assignments.map(a => {
      const score = s.assignmentScores[a.id];
      return score ? `"${score.displayScore.toFixed(2)}"` : '"0.00"';
    });
    rows.push([
      csvQuote(firstName),
      csvQuote(lastName),
      csvQuote(s.studentNumber),
      ...asgCols,
      `"${s.displaySemesterTotal.toFixed(2)}"`,
    ].join(','));
  });

  return rows.join('\n');
}

export function downloadCSV(filename: string, content: string): void {
  // Prepend UTF-8 BOM so spreadsheet viewers render characters cleanly
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Delay revocation so asynchronous browser download has time to complete
  setTimeout(() => {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  }, 40000);
}
