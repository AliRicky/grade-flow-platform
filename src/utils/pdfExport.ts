/**
 * Academic PDF Export Service using jsPDF and jspdf-autotable
 * Clean Supabase styling: Emerald #3B82F6, Dark #000000 / #09090B, Neutral Zinc
 * Normalized Academic Grading standard across all exports.
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Assignment, StudentAssignmentGrade, User } from '../types';
import { calculateStudentAssignmentScore } from './grading';

// Palette color constants in RGB format (Supabase Theme)
const PALETTE = {
  black: [18, 18, 18] as [number, number, number],
  emerald: [62, 207, 142] as [number, number, number],  // #3B82F6
  headerBg: [24, 24, 27] as [number, number, number],   // Zinc-900
  mist: [244, 244, 245] as [number, number, number],    // Zinc-100
  lightRow: [250, 250, 250] as [number, number, number],
  darkText: [24, 24, 27] as [number, number, number],
  mutedText: [113, 113, 122] as [number, number, number], // Zinc-500
};

/**
 * 1. Export Master Gradebook Matrix PDF (All 5 HWs + 5 Quizzes across all students)
 */
export function exportGradebookMatrixPDF(
  assignments: Assignment[],
  students: User[],
  gradesMap: Record<string, StudentAssignmentGrade>,
  options: {
    courseName?: string;
    instructorName?: string;
    semester?: string;
    includeSignoff?: boolean;
  } = {}
): void {
  const {
    courseName = 'Machine Learning & Optimization',
    instructorName = 'Dr. Kian Rezaei (Lead TA / Instructor)',
    semester = 'Fall 2026',
    includeSignoff = true,
  } = options;

  // A4 Landscape for tabular master gradebook
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Top Decorative Accent Bar (Supabase Emerald #3B82F6)
  doc.setFillColor(...PALETTE.emerald);
  doc.rect(0, 0, pageWidth, 5, 'F');

  // Header Box (Dark Slate Zinc)
  doc.setFillColor(...PALETTE.headerBg);
  doc.rect(0, 5, pageWidth, 55, 'F');

  // Institution / Course Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('UNIVERSITY COURSE MASTER GRADEBOOK', 36, 30);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(212, 212, 216);
  doc.text(`${courseName}  ·  ${semester}`, 36, 46);

  // Metadata Timestamp on right
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.setFontSize(8.5);
  doc.text(`Official Academic Record  ·  Generated: ${dateStr}`, pageWidth - 36, 38, { align: 'right' });

  // Summary Metrics Bar below header
  doc.setFillColor(...PALETTE.mist);
  doc.rect(36, 68, pageWidth - 72, 32, 'F');

  doc.setTextColor(...PALETTE.headerBg);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(`COHORT SUMMARY:`, 46, 88);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...PALETTE.darkText);

  const hwList = assignments.filter(a => a.type === 'homework');
  const quizList = assignments.filter(a => a.type === 'quiz');

  doc.text(
    `Enrolled Students: ${students.length}  |  Assessments: ${hwList.length} Homeworks, ${quizList.length} Quizzes  |  Standard Scale: Normalized Academic Scale  |  Passing: 50%`,
    150,
    88
  );

  // Table Data Assembly
  const tableHeaders = [
    '#',
    'Student ID',
    'Student Name',
    'Sec',
    ...hwList.map(h => `${h.shortCode} (/${(h.targetScale ?? 1.0).toFixed(1)})`),
    ...quizList.map(q => `${q.shortCode} (/${q.targetScale ?? 1.0})`),
    'Course %',
    'Final /5.0',
    'Status',
  ];

  const hwSums: Record<string, number> = {};
  const hwCounts: Record<string, number> = {};
  const quizSums: Record<string, number> = {};
  const quizCounts: Record<string, number> = {};
  let classWeightedSum = 0;
  let activeStudentCount = 0;

  hwList.forEach(h => { hwSums[h.id] = 0; hwCounts[h.id] = 0; });
  quizList.forEach(q => { quizSums[q.id] = 0; quizCounts[q.id] = 0; });

  const tableRows = students.map((student, idx) => {
    let studentWeightedScoreSum = 0;
    let studentWeightSum = 0;

    const hwScores = hwList.map(h => {
      const g = gradesMap[`${student.id}_${h.id}`];
      if (!g || !g.scores || Object.keys(g.scores).length === 0) return '—';
      const calc = calculateStudentAssignmentScore(h, g.scores);
      hwSums[h.id] += calc.exactScore;
      hwCounts[h.id] += 1;
      const ratio = calc.targetScale > 0 ? calc.exactScore / calc.targetScale : 0;
      studentWeightedScoreSum += ratio * h.weightPercent;
      studentWeightSum += h.weightPercent;
      return calc.displayScore.toFixed(1);
    });

    const quizScores = quizList.map(q => {
      const g = gradesMap[`${student.id}_${q.id}`];
      if (!g || !g.scores || Object.keys(g.scores).length === 0) return '—';
      const calc = calculateStudentAssignmentScore(q, g.scores);
      quizSums[q.id] += calc.exactScore;
      quizCounts[q.id] += 1;
      const ratio = calc.targetScale > 0 ? calc.exactScore / calc.targetScale : 0;
      studentWeightedScoreSum += ratio * q.weightPercent;
      studentWeightSum += q.weightPercent;
      return calc.displayScore.toFixed(1);
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
      classWeightedSum += courseTotalPct;
      activeStudentCount += 1;
    }

    return [
      (idx + 1).toString(),
      student.studentId || '—',
      student.full_name || 'Unknown',
      student.section ? student.section.replace('Section ', 'S') : 'S1',
      ...hwScores,
      ...quizScores,
      courseTotalPct > 0 ? `${courseTotalPct.toFixed(1)}%` : '—',
      finalScaled > 0 ? finalScaled.toFixed(2) : '—',
      courseTotalPct > 0 ? performanceStatus : '—',
    ];
  });

  // Calculate Column Averages Summary Row
  const hwAverages = hwList.map(h => {
    const count = hwCounts[h.id];
    return count > 0 ? (hwSums[h.id] / count).toFixed(1) : '—';
  });

  const quizAverages = quizList.map(q => {
    const count = quizCounts[q.id];
    return count > 0 ? (quizSums[q.id] / count).toFixed(1) : '—';
  });

  const overallAvgPct = activeStudentCount > 0 ? classWeightedSum / activeStudentCount : 0;
  const overallAvgScaled = (overallAvgPct / 100) * 5.0;
  const overallAvgStatus =
    overallAvgPct >= 90 ? 'Mastery' :
    overallAvgPct >= 80 ? 'Distinction' :
    overallAvgPct >= 70 ? 'Proficient' :
    overallAvgPct >= 60 ? 'Satisfactory' :
    overallAvgPct >= 50 ? 'Passing' : 'Remediation';

  const averageRow = [
    '',
    'MEAN',
    'Class Arithmetic Average',
    '—',
    ...hwAverages,
    ...quizAverages,
    overallAvgPct > 0 ? `${overallAvgPct.toFixed(1)}%` : '—',
    overallAvgScaled > 0 ? overallAvgScaled.toFixed(2) : '—',
    overallAvgPct > 0 ? overallAvgStatus : '—',
  ];

  tableRows.push(averageRow);

  // Render Table
  autoTable(doc, {
    startY: 108,
    head: [tableHeaders],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: PALETTE.headerBg,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 22, halign: 'center' },
      1: { cellWidth: 58, halign: 'center', fontStyle: 'bold' },
      2: { cellWidth: 105, halign: 'left' },
      3: { cellWidth: 28, halign: 'center' },
      // Assessments
      ...Object.fromEntries(
        Array.from({ length: hwList.length + quizList.length }, (_, i) => [4 + i, { cellWidth: 38, halign: 'center' }])
      ),
      [4 + hwList.length + quizList.length]: { cellWidth: 50, halign: 'center', fontStyle: 'bold' },
      [5 + hwList.length + quizList.length]: { cellWidth: 48, halign: 'center', fontStyle: 'bold', textColor: [62, 207, 142] },
      [6 + hwList.length + quizList.length]: { cellWidth: 45, halign: 'center', fontStyle: 'bold' },
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 3.5,
      textColor: PALETTE.darkText,
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
    },
    alternateRowStyles: {
      fillColor: PALETTE.lightRow,
    },
    didParseCell: (data) => {
      // Highlight the bottom average summary row
      if (data.row.index === tableRows.length - 1) {
        data.cell.styles.fillColor = PALETTE.mist;
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = PALETTE.headerBg;
      }
    },
    margin: { left: 36, right: 36, bottom: 60 },
  });

  // Sign-off verification block
  if (includeSignoff) {
    const finalY = ((doc as any).lastAutoTable?.finalY || 450) + 16;
    if (finalY < pageHeight - 50) {
      doc.setFontSize(8);
      doc.setTextColor(...PALETTE.mutedText);
      doc.text('I hereby certify that the scores recorded above accurately reflect course evaluation rubrics.', 36, finalY);

      doc.setTextColor(...PALETTE.darkText);
      doc.setFont('helvetica', 'bold');
      doc.text(`Authorized by: ${instructorName}`, 36, finalY + 12);

      doc.setFont('helvetica', 'normal');
      doc.text(`Signature: __________________________    Date: ${dateStr}`, pageWidth - 320, finalY + 12);
    }
  }

  // Footer page numbering
  const pageCount = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(...PALETTE.mutedText);
    doc.text(
      `GradeFlow Academic Management System  ·  Page ${i} of ${pageCount}  ·  Confidential Educational Record`,
      pageWidth / 2,
      pageHeight - 14,
      { align: 'center' }
    );
  }

  // Download PDF
  const cleanName = courseName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanName}_Master_Gradebook.pdf`;
  doc.save(filename);
}

/**
 * 2. Export Individual Assessment Report PDF
 */
export function exportAssignmentReportPDF(
  assignment: Assignment,
  students: User[],
  gradesMap: Record<string, StudentAssignmentGrade>,
  options: {
    courseName?: string;
    instructorName?: string;
    semester?: string;
  } = {}
): void {
  const {
    courseName = 'Machine Learning & Optimization',
    instructorName = 'Teaching Assistant Staff',
    semester = 'Fall 2026',
  } = options;

  // Portrait A4 for individual assignment report
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Top Decorative Accent Bar (Supabase Emerald #3B82F6)
  doc.setFillColor(...PALETTE.emerald);
  doc.rect(0, 0, pageWidth, 5, 'F');

  // Header Box (Dark Slate)
  doc.setFillColor(...PALETTE.headerBg);
  doc.rect(0, 5, pageWidth, 60, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`OFFICIAL ASSESSMENT REPORT: ${assignment.shortCode.toUpperCase()}`, 36, 28);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${assignment.title}`, 36, 44);

  doc.setFontSize(8);
  doc.setTextColor(212, 212, 216);
  doc.text(`${courseName}  ·  ${semester}`, 36, 57);

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.text(`Report Date: ${dateStr}`, pageWidth - 36, 38, { align: 'right' });

  // Metadata KPI Card Grid
  const startY = 74;
  doc.setFillColor(...PALETTE.mist);
  doc.rect(36, startY, pageWidth - 72, 40, 'F');

  // Compute Statistics
  let scoreSum = 0;
  let gradedCount = 0;
  let minScore = 9;
  let maxScoreAchieved = 0;

  students.forEach(s => {
    const g = gradesMap[`${s.id}_${assignment.id}`];
    if (g && Object.keys(g.scores || {}).length > 0) {
      let earned = 0;
      let bonus = 0;
      (Array.isArray(assignment?.questions) ? assignment.questions : []).forEach(q => {
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
      const scaled = assignment.totalMaxScore > 0 ? Math.min(9, (raw / assignment.totalMaxScore) * 9) : Math.min(9, raw);
      scoreSum += scaled;
      gradedCount++;
      if (scaled < minScore) minScore = scaled;
      if (scaled > maxScoreAchieved) maxScoreAchieved = scaled;
    }
  });

  const avgScaled = gradedCount > 0 ? (scoreSum / gradedCount).toFixed(2) : '—';
  if (gradedCount === 0) minScore = 0;

  doc.setTextColor(...PALETTE.darkText);
  doc.setFontSize(8);

  const colWidth = (pageWidth - 72) / 4;
  // Box 1
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL MAX POINTS', 46, startY + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(`${assignment.totalMaxScore} pts (${assignment.weightPercent}% Course)`, 46, startY + 28);

  // Box 2
  doc.setFont('helvetica', 'bold');
  doc.text('EVALUATED SUBMISSIONS', 46 + colWidth, startY + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(`${gradedCount} / ${students.length} Students`, 46 + colWidth, startY + 28);

  // Box 3
  const asgScale = assignment.targetScale ?? 1.0;
  doc.setFont('helvetica', 'bold');
  doc.text('CLASS ARITHMETIC MEAN', 46 + colWidth * 2, startY + 15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text(`${avgScaled} / ${asgScale.toFixed(1)} pts`, 46 + colWidth * 2, startY + 28);

  // Box 4
  doc.setTextColor(...PALETTE.darkText);
  doc.setFont('helvetica', 'bold');
  doc.text('RANGE (MIN – MAX)', 46 + colWidth * 3, startY + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(`${minScore.toFixed(1)} – ${maxScoreAchieved.toFixed(1)} pts`, 46 + colWidth * 3, startY + 28);

  // Section 1: Question & Rubric Breakdown Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...PALETTE.headerBg);
  doc.text('1. QUESTION HIERARCHY & RUBRIC SPECIFICATION', 36, startY + 56);

  interface RubricRow {
    part: string;
    topic: string;
    maxPts: string;
    isBonus: boolean;
  }
  const rubricRows: RubricRow[] = [];

  (Array.isArray(assignment?.questions) ? assignment.questions : []).forEach(q => {
    if (q.subQuestions && q.subQuestions.length > 0) {
      q.subQuestions.forEach(sq => {
        rubricRows.push({
          part: sq.label || `${q.number}-${sq.id}`,
          topic: `${q.title} — ${sq.title}`,
          maxPts: `${sq.maxScore} pts`,
          isBonus: !!q.isBonus,
        });
      });
    } else {
      rubricRows.push({
        part: `Q${q.number}`,
        topic: q.title,
        maxPts: `${q.directMaxScore || 10} pts`,
        isBonus: !!q.isBonus,
      });
    }
  });

  autoTable(doc, {
    startY: startY + 63,
    head: [['Part', 'Topic & Derivation Objective', 'Max Marks', 'Type']],
    body: rubricRows.map(r => [
      r.part,
      r.topic,
      r.maxPts,
      r.isBonus ? 'Bonus' : 'Standard',
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: PALETTE.headerBg,
      textColor: [255, 255, 255],
      fontSize: 8,
      cellPadding: 3,
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 3,
      textColor: PALETTE.darkText,
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
    },
    columnStyles: {
      0: { cellWidth: 45, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: 320, halign: 'left' },
      2: { cellWidth: 70, halign: 'center', fontStyle: 'bold' },
      3: { cellWidth: 85, halign: 'center' },
    },
    margin: { left: 36, right: 36 },
  });

  // Section 2: Student Score Breakdown
  const secondTableY = (doc as any).lastAutoTable?.finalY + 16 || 260;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...PALETTE.headerBg);
  doc.text('2. COMPLETE STUDENT GRADE ROSTER', 36, secondTableY);

  const columnsToShow = rubricRows.slice(0, 10);

  const studentHeaders = [
    '#',
    'Student ID',
    'Student Name',
    ...columnsToShow.map(c => c.part),
    'Raw Pts',
    `Score /${asgScale.toFixed(1)}`,
    'Percent',
  ];

  const studentRows = students.map((s, idx) => {
    const g = gradesMap[`${s.id}_${assignment.id}`];

    const scores = columnsToShow.map(col => {
      let val: number | null | undefined = null;
      const asgQuestions = Array.isArray(assignment?.questions) ? assignment.questions : [];
      for (const q of asgQuestions) {
        if (q.subQuestions && q.subQuestions.length > 0) {
          const sq = q.subQuestions.find(sub => (sub.label === col.part || `${q.number}-${sub.id}` === col.part));
          if (sq) {
            val = g?.scores?.[`${q.id}_${sq.id}`];
            break;
          }
        } else if (`Q${q.number}` === col.part || `${q.number}` === col.part) {
          val = g?.scores?.[q.id];
          break;
        }
      }

      if (val !== undefined && val !== null) {
        return val.toString();
      }
      return '—';
    });

    const calc = calculateStudentAssignmentScore(assignment, g?.scores);
    const scaled = calc.displayScore;
    const pct = calc.percentage;

    return [
      (idx + 1).toString(),
      s.studentId || '—',
      s.full_name || 'Unknown',
      ...scores,
      calc.totalEarned > 0 ? calc.totalEarned.toFixed(1) : '—',
      scaled > 0 ? scaled.toFixed(2) : '—',
      pct > 0 ? `${pct.toFixed(0)}%` : '—',
    ];
  });

  autoTable(doc, {
    startY: secondTableY + 8,
    head: [studentHeaders],
    body: studentRows,
    theme: 'grid',
    headStyles: {
      fillColor: PALETTE.headerBg,
      textColor: [255, 255, 255],
      fontSize: 8,
      cellPadding: 3,
      halign: 'center',
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 3,
      textColor: PALETTE.darkText,
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
    },
    alternateRowStyles: {
      fillColor: PALETTE.lightRow,
    },
    columnStyles: {
      0: { cellWidth: 20, halign: 'center' },
      1: { cellWidth: 55, halign: 'center', fontStyle: 'bold' },
      2: { cellWidth: 95, halign: 'left' },
      ...Object.fromEntries(
        Array.from({ length: columnsToShow.length }, (_, i) => [3 + i, { halign: 'center' }])
      ),
      [3 + columnsToShow.length]: { cellWidth: 40, halign: 'center', fontStyle: 'bold' },
      [4 + columnsToShow.length]: { cellWidth: 42, halign: 'center', fontStyle: 'bold', textColor: [62, 207, 142] },
      [5 + columnsToShow.length]: { cellWidth: 40, halign: 'center', fontStyle: 'bold' },
    },
    margin: { left: 36, right: 36, bottom: 50 },
  });

  // Footer page numbering
  const pageCount = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(...PALETTE.mutedText);
    doc.text(
      `GradeFlow Academic Management System  ·  ${assignment.shortCode} Report  ·  Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 14,
      { align: 'center' }
    );
  }

  // Download PDF
  const cleanName = courseName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${cleanName}_${assignment.shortCode}_Official_Report.pdf`;
  doc.save(filename);
}

// Re-export CSV helpers from csv.ts for convenient unified imports
export { generateCSVContent, generateMasterCSVContent, downloadCSV } from './csv';
