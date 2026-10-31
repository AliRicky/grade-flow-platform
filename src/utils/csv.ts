/**
 * CSV Export & Import Handler matching university course grading sheets.
 * Standardized on 100% English headers and 9-point numeric grading scale.
 */

import { Assignment, StudentAssignmentGrade, User } from '../types';
import { calculateNumericGrade } from './grading';

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

  const headers = [
    'First Name',
    'Last Name',
    'Student ID',
    ...columns.map(c => csvQuote(c.label)),
    'Bonus Points',
    'Raw Total',
    'Final Scaled (/9.0)',
    'Numeric Grade (Scale 9)'
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

    const combinedScore = totalScore + bonusScore;
    const finalOutOf9 = assignment.totalMaxScore > 0
      ? Math.min(9, (combinedScore / assignment.totalMaxScore) * 9)
      : Math.min(9, combinedScore);

    const pct = assignment.totalMaxScore > 0 ? (combinedScore / assignment.totalMaxScore) * 100 : 0;
    const numericGrade = calculateNumericGrade(pct);

    if (colValues.some(v => v !== '')) {
      gradedCount++;
      overallTotalSum += combinedScore;
      overallFinalSum += finalOutOf9;
    }

    const row = [
      csvQuote(firstName),
      csvQuote(lastName),
      csvQuote(student.studentId || ""),
      ...colValues,
      bonusScore > 0 ? bonusScore.toString() : '0',
      combinedScore.toFixed(2),
      finalOutOf9.toFixed(2),
      `"Grade ${numericGrade.gradeNumber}"`
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
    ...hwList.map(h => `${h.shortCode} (/9)`),
    ...quizList.map(q => `${q.shortCode} (/9)`),
    'Course Total (%)',
    'Final Scaled (/9.0)',
    'Numeric Grade (Scale 9)'
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
      let earned = 0;
      let bonus = 0;
      (Array.isArray(h.questions) ? h.questions : []).forEach(q => {
        if (q.subQuestions && q.subQuestions.length > 0) {
          q.subQuestions.forEach(sq => {
            const v = g.scores[`${q.id}_${sq.id}`];
            if (v !== undefined && v !== null) {
              if (q.isBonus) bonus += v;
              else earned += v;
            }
          });
        } else {
          const v = g.scores[q.id];
          if (v !== undefined && v !== null) {
            if (q.isBonus) bonus += v;
            else earned += v;
          }
        }
      });

      const raw = earned + bonus;
      const scaled = h.totalMaxScore > 0 ? Math.min(9, (raw / h.totalMaxScore) * 9) : Math.min(9, raw);
      hwSums[h.id] += scaled;
      hwCounts[h.id] += 1;

      studentWeightedScoreSum += (scaled / 9) * h.weightPercent;
      studentWeightSum += h.weightPercent;

      return scaled.toFixed(2);
    });

    const quizScores = quizList.map(q => {
      const g = gradesMap[`${student.id}_${q.id}`];
      if (!g || !g.scores || Object.keys(g.scores).length === 0) return '';
      let earned = 0;
      let bonus = 0;
      (Array.isArray(q.questions) ? q.questions : []).forEach(ques => {
        if (ques.subQuestions && ques.subQuestions.length > 0) {
          ques.subQuestions.forEach(sq => {
            const v = g.scores[`${ques.id}_${sq.id}`];
            if (v !== undefined && v !== null) {
              if (ques.isBonus) bonus += v;
              else earned += v;
            }
          });
        } else {
          const v = g.scores[ques.id];
          if (v !== undefined && v !== null) {
            if (ques.isBonus) bonus += v;
            else earned += v;
          }
        }
      });

      const raw = earned + bonus;
      const scaled = q.totalMaxScore > 0 ? Math.min(9, (raw / q.totalMaxScore) * 9) : Math.min(9, raw);
      quizSums[q.id] += scaled;
      quizCounts[q.id] += 1;

      studentWeightedScoreSum += (scaled / 9) * q.weightPercent;
      studentWeightSum += q.weightPercent;

      return scaled.toFixed(2);
    });

    const courseTotalPct = studentWeightSum > 0 ? (studentWeightedScoreSum / studentWeightSum) * 100 : 0;
    const finalScaled9 = Math.min(9, (courseTotalPct / 100) * 9);

    if (studentWeightSum > 0) {
      classCourseTotalSum += courseTotalPct;
      studentsEvaluated += 1;
    }

    const numericGrade = calculateNumericGrade(courseTotalPct);

    const row = [
      csvQuote(firstName),
      csvQuote(lastName),
      csvQuote(student.studentId || ""),
      csvQuote(student.section || "S1"),
      ...hwScores,
      ...quizScores,
      courseTotalPct.toFixed(2),
      finalScaled9.toFixed(2),
      `"Grade ${numericGrade.gradeNumber}"`
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
  const avgFinalScaled = (parseFloat(avgCourseTotal) / 100 * 9).toFixed(2);
  const avgNumericGrade = calculateNumericGrade(parseFloat(avgCourseTotal));

  const summaryRow = [
    '"Class Mean"',
    '""',
    '""',
    '""',
    ...hwAverages,
    ...quizAverages,
    avgCourseTotal,
    avgFinalScaled,
    `"Grade ${avgNumericGrade.gradeNumber}"`
  ];

  rows.push(summaryRow.join(','));

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
