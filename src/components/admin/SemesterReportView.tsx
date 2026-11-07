import React, { useState, useMemo, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Copy,
  Search,
  Award,
  CheckCircle2,
  Sliders,
  Layers,
  Users
} from 'lucide-react';
import { useCourse } from '../../context/CourseContext';
import { useAuth } from '../../context/AuthContext';
import {
  calculateStudentAssignmentScore,
  calculateSemesterSummary,
  calculateAssignmentDenominator,
  roundUpToTwoDecimals
} from '../../utils/grading';
import { downloadCSV } from '../../utils/csv';
import { Assignment, User } from '../../types';

export const SemesterReportView: React.FC = () => {
  const {
    assignments: dbAssignments,
    grades: dbGrades,
    courseConfig,
    updateCourseConfig,
  } = useCourse();
  const { users } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('final-scores');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // View operates strictly on active database data (real students and real assessments)
  const activeAssignments: Assignment[] = dbAssignments;
  const activeGrades = dbGrades;
  const activeStudents: User[] = useMemo(
    () => users.filter(u => u.role === 'student'),
    [users]
  );

  // Sum of assignment solid scores (e.g. 1.0 + 1.0 + 3.0 = 5.0)
  const totalAssignmentTargetScore = useMemo(() => {
    return activeAssignments.reduce((acc, a) => {
      const s = Number(a.targetScale);
      return acc + (Number.isFinite(s) && s > 0 ? s : 1.0);
    }, 0);
  }, [activeAssignments]);

  // Semester Target Scale (from courseConfig or defaults to sum of solid scores / 5.0)
  const semesterScale = courseConfig.semesterScale ?? (totalAssignmentTargetScore > 0 ? totalAssignmentTargetScore : 5.0);

  const [scaleInputStr, setScaleInputStr] = useState<string>(() => String(semesterScale));

  useEffect(() => {
    if (courseConfig.semesterScale !== undefined) {
      setScaleInputStr(String(courseConfig.semesterScale));
    } else if (totalAssignmentTargetScore > 0) {
      setScaleInputStr(String(totalAssignmentTargetScore));
    }
  }, [courseConfig.semesterScale, totalAssignmentTargetScore]);

  // Compute semester summary for all active students using solid assignment scores
  const semesterSummary = useMemo(() => {
    return calculateSemesterSummary({
      assignments: activeAssignments,
      students: activeStudents,
      grades: activeGrades,
      semesterScale,
      scaleMode: courseConfig.scaleMode,
    });
  }, [activeAssignments, activeStudents, activeGrades, semesterScale, courseConfig.scaleMode]);

  // Filtered students by search
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return semesterSummary;
    const q = searchQuery.toLowerCase();
    return semesterSummary.filter(
      s => s.studentName.toLowerCase().includes(q) || s.studentNumber.toLowerCase().includes(q)
    );
  }, [semesterSummary, searchQuery]);

  // Current assessment if activeTab is an assignment
  const currentAssignment = useMemo(() => {
    if (activeTab === 'final-scores') return null;
    return activeAssignments.find(a => a.id === activeTab || a.shortCode.toLowerCase() === activeTab.toLowerCase());
  }, [activeTab, activeAssignments]);

  // Copy table data to clipboard (TSV for Excel paste)
  const handleCopyTable = () => {
    let tsv = '';
    if (activeTab === 'final-scores') {
      const header = [
        'Row',
        'First Name',
        'Last Name',
        'Student ID',
        ...activeAssignments.map(a => `${a.shortCode} (Score: ${a.targetScale ?? 1.0})`),
        `Final Total (${semesterScale})`
      ];
      tsv += header.join('\t') + '\n';
      filteredStudents.forEach((s, idx) => {
        const parts = s.studentName.split(' ');
        const row = [
          idx + 1,
          parts[0] || '',
          parts.slice(1).join(' ') || '',
          s.studentNumber,
          ...activeAssignments.map(a => (s.assignmentScores[a.id]?.displayScore ?? 0).toFixed(2)),
          s.displaySemesterTotal.toFixed(2),
        ];
        tsv += row.join('\t') + '\n';
      });
    } else if (currentAssignment) {
      const qCols = (currentAssignment.questions || []).map(q => q.title);
      const header = ['Row', 'Student Name', 'Student ID', ...qCols, 'Sum Points', `Final Score (${currentAssignment.targetScale ?? 1.0})`];
      tsv += header.join('\t') + '\n';
      filteredStudents.forEach((s, idx) => {
        const g = activeGrades[`${s.studentId}_${currentAssignment.id}`];
        const calc = calculateStudentAssignmentScore(currentAssignment, g?.scores);
        const qScores = (currentAssignment.questions || []).map(q => {
          const val = g?.scores?.[q.id];
          return val !== undefined && val !== null ? val : '0';
        });
        const row = [
          idx + 1,
          s.studentName,
          s.studentNumber,
          ...qScores,
          calc.totalEarned,
          calc.displayScore.toFixed(2),
        ];
        tsv += row.join('\t') + '\n';
      });
    }

    navigator.clipboard.writeText(tsv);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Export current table to CSV
  const handleExportCSV = () => {
    if (activeTab === 'final-scores') {
      const header = [
        '"Name"',
        '"Family Name"',
        '"Student ID"',
        ...activeAssignments.map(a => `"${a.shortCode} (Score: ${a.targetScale ?? 1.0})"`),
        `"Final Total (${semesterScale} pts)"`
      ];
      const rows = [header.join(',')];
      filteredStudents.forEach(s => {
        const parts = s.studentName.split(' ');
        const row = [
          `"${parts[0] || ''}"`,
          `"${parts.slice(1).join(' ') || ''}"`,
          `"${s.studentNumber}"`,
          ...activeAssignments.map(a => `"${(s.assignmentScores[a.id]?.displayScore ?? 0).toFixed(2)}"`),
          `"${s.displaySemesterTotal.toFixed(2)}"`,
        ];
        rows.push(row.join(','));
      });
      downloadCSV(`Semester_Summary_Report_Scale_${semesterScale}.csv`, rows.join('\n'));
    } else if (currentAssignment) {
      const qCols = (currentAssignment.questions || []).map(q => `"${q.title}"`);
      const header = ['"Student Name"', '"Student ID"', ...qCols, '"Total Points"', `"Final Score (${currentAssignment.targetScale ?? 1.0})"`];
      const rows = [header.join(',')];
      filteredStudents.forEach(s => {
        const g = activeGrades[`${s.studentId}_${currentAssignment.id}`];
        const calc = calculateStudentAssignmentScore(currentAssignment, g?.scores);
        const qScores = (currentAssignment.questions || []).map(q => {
          const val = g?.scores?.[q.id];
          return val !== undefined && val !== null ? `"${val}"` : '"0"';
        });
        const row = [
          `"${s.studentName}"`,
          `"${s.studentNumber}"`,
          ...qScores,
          `"${calc.totalEarned}"`,
          `"${calc.displayScore.toFixed(2)}"`,
        ];
        rows.push(row.join(','));
      });
      downloadCSV(`${currentAssignment.shortCode}_Report.csv`, rows.join('\n'));
    }
  };

  // Export complete report to CSV
  const handleExportAll = () => {
    const sections: string[] = [];

    // Semester Summary Matrix
    sections.push('=== SEMESTER SUMMARY MATRIX ===');
    const summaryHeader = [
      '"First Name"',
      '"Last Name"',
      '"Student ID"',
      ...activeAssignments.map(a => `"${a.shortCode} (Score: ${a.targetScale ?? 1.0})"`),
      `"Semester Total (${semesterScale})"`
    ];
    sections.push(summaryHeader.join(','));
    semesterSummary.forEach(s => {
      const parts = s.studentName.split(' ');
      sections.push([
        `"${parts[0] || ''}"`,
        `"${parts.slice(1).join(' ') || ''}"`,
        `"${s.studentNumber}"`,
        ...activeAssignments.map(a => `"${(s.assignmentScores[a.id]?.displayScore ?? 0).toFixed(2)}"`),
        `"${s.displaySemesterTotal.toFixed(2)}"`,
      ].join(','));
    });
    sections.push('\n');

    // Individual Assessment Breakdowns
    activeAssignments.forEach(asg => {
      sections.push(`=== ${asg.shortCode}: ${asg.title || asg.shortCode} BREAKDOWN ===`);
      const qCols = (asg.questions || []).map(q => `"${q.title}"`);
      sections.push(['"Student Name"', '"Student ID"', ...qCols, '"Sum Points"', `"Final Score (${asg.targetScale ?? 1.0})"`].join(','));
      semesterSummary.forEach(s => {
        const g = activeGrades[`${s.studentId}_${asg.id}`];
        const calc = calculateStudentAssignmentScore(asg, g?.scores);
        const qScores = (asg.questions || []).map(q => {
          const val = g?.scores?.[q.id];
          return val !== undefined && val !== null ? `"${val}"` : '"0"';
        });
        sections.push([
          `"${s.studentName}"`,
          `"${s.studentNumber}"`,
          ...qScores,
          `"${calc.totalEarned}"`,
          `"${calc.displayScore.toFixed(2)}"`,
        ].join(','));
      });
      sections.push('\n');
    });

    downloadCSV('Semester_Grade_Report.csv', sections.join('\n'));
  };

  // Calculate Averages for the Final Scores table
  const finalScoreAverages = useMemo(() => {
    if (filteredStudents.length === 0) return { asgAverages: {} as Record<string, string>, overallAverage: '0.00' };
    const asgSums: Record<string, number> = {};
    activeAssignments.forEach(a => { asgSums[a.id] = 0; });
    let totalSum = 0;

    filteredStudents.forEach(s => {
      activeAssignments.forEach(a => {
        asgSums[a.id] += s.assignmentScores[a.id]?.exactScore ?? 0;
      });
      totalSum += s.exactSemesterTotal;
    });

    const asgAverages: Record<string, string> = {};
    activeAssignments.forEach(a => {
      asgAverages[a.id] = roundUpToTwoDecimals(asgSums[a.id] / filteredStudents.length).toFixed(2);
    });
    const overallAverage = roundUpToTwoDecimals(totalSum / filteredStudents.length).toFixed(2);

    return { asgAverages, overallAverage };
  }, [filteredStudents, activeAssignments]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">
              <Award className="w-4 h-4" />
              <span>Official Semester Grade Summary</span>
            </div>
            <h1 className="text-2xl font-bold font-display text-zinc-900 dark:text-zinc-100">
              End-of-Semester Performance Matrix
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl">
              Cumulative grade evaluation based on solid assignment scores across active enrolled students.
            </p>
          </div>
        </div>

        {/* Configuration Bar: Semester Target Scale only */}
        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center shrink-0">
              <Sliders className="w-4 h-4 text-[#3B82F6]" />
            </div>
            <div>
              <label htmlFor="semester-scale-input" className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                Semester Target Scale
              </label>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Cumulative progress: <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">{totalAssignmentTargetScore.toFixed(1)} / {semesterScale} pts assigned</span>
                {courseConfig.scaleMode === 'proportional' ? (
                  <span className="text-[#3B82F6] ml-1.5 font-medium">· Scaled proportionally to {semesterScale}</span>
                ) : totalAssignmentTargetScore >= semesterScale ? (
                  <span className="text-emerald-600 dark:text-emerald-400 ml-1.5 font-medium">· Complete</span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 ml-1.5 font-medium">· Cumulative solid score</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Mode Selector Toggle: Cumulative vs Proportional */}
            <div className="flex items-center p-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 text-[11px]">
              <button
                type="button"
                onClick={() => updateCourseConfig({ scaleMode: 'cumulative' })}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  courseConfig.scaleMode !== 'proportional'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs font-bold'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="Cumulative solid score accumulation (Default): students accumulate points towards semester target scale as assignments are completed."
              >
                Cumulative
              </button>
              <button
                type="button"
                onClick={() => updateCourseConfig({ scaleMode: 'proportional' })}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  courseConfig.scaleMode === 'proportional'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-xs font-bold'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="Proportional scaling: scales earned score up to target scale based on assigned assignments."
              >
                Proportional
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="semester-scale-input"
                type="number"
                step="0.5"
                min="0.5"
                value={scaleInputStr}
                onChange={e => {
                  const raw = e.target.value;
                  setScaleInputStr(raw);
                  const parsed = parseFloat(raw);
                  if (Number.isFinite(parsed) && parsed > 0) {
                    updateCourseConfig({ semesterScale: parsed });
                  }
                }}
                onBlur={() => {
                  const parsed = parseFloat(scaleInputStr);
                  if (!Number.isFinite(parsed) || parsed <= 0) {
                    const fallback = totalAssignmentTargetScore > 0 ? totalAssignmentTargetScore : 5.0;
                    setScaleInputStr(String(fallback));
                    updateCourseConfig({ semesterScale: fallback });
                  }
                }}
                className="w-24 px-3 py-1.5 text-xs font-mono font-bold text-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
                placeholder="e.g. 5"
              />
              <span className="text-xs font-mono font-medium text-zinc-400">pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Tab Navigation & Action Hub */}
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Scrollable Tab Strip for All Active Assessments */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar touch-pan-x">
            <button
              onClick={() => setActiveTab('final-scores')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'final-scores'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-[#3B82F6] shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Final Scores (Semester Summary)</span>
            </button>

            {activeAssignments.map(asg => {
              const isSelected = activeTab === asg.id || activeTab === asg.shortCode.toLowerCase();
              return (
                <button
                  key={asg.id}
                  onClick={() => setActiveTab(asg.id)}
                  className={`px-3 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-[#3B82F6] shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  {asg.shortCode}
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search student or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6] w-44"
              />
            </div>

            <button
              onClick={handleCopyTable}
              className="px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              title="Copy table to clipboard as TSV for pasting directly into Excel"
            >
              {copiedNotification ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedNotification ? 'Copied!' : 'Copy TSV'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              title="Export current view to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleExportAll}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="Export complete semester report"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Empty States for zero assessments or students */}
        {activeAssignments.length === 0 ? (
          <div className="p-12 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
            <Layers className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">No Assessments Created Yet</h3>
            <p className="text-xs text-zinc-500 mt-1">Create assignments or quizzes to generate semester reports.</p>
          </div>
        ) : activeStudents.length === 0 ? (
          <div className="p-12 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
            <Users className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">No Students Enrolled</h3>
            <p className="text-xs text-zinc-500 mt-1">Upload a student roster to populate performance data.</p>
          </div>
        ) : (
          /* Table Content Area */
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto max-h-[620px] relative">
              {activeTab === 'final-scores' ? (
                /* TAB: Final Semester Summary Matrix */
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-zinc-900 text-white sticky top-0 z-20 font-medium">
                    <tr>
                      <th className="py-2.5 px-3 border-b border-r border-zinc-800 sticky left-0 z-30 bg-zinc-900 w-10 text-center">
                        #
                      </th>
                      <th className="py-2.5 px-3 border-b border-r border-zinc-800 sticky left-10 z-30 bg-zinc-900 min-w-[140px]">
                        Student Name
                      </th>
                      <th className="py-2.5 px-3 border-b border-r border-zinc-800 sticky left-[180px] z-30 bg-zinc-900 min-w-[100px] font-mono">
                        Student ID
                      </th>
                      {activeAssignments.map(asg => (
                        <th
                          key={asg.id}
                          className="py-2.5 px-3 text-center border-b border-r border-zinc-800 font-mono min-w-[75px]"
                          title={`${asg.title} (Score: ${asg.targetScale ?? 1.0})`}
                        >
                          <div>{asg.shortCode}</div>
                          <div className="text-[10px] text-zinc-400 font-normal">Score: {asg.targetScale ?? 1.0}</div>
                        </th>
                      ))}
                      <th className="py-2.5 px-4 text-center border-b border-zinc-800 bg-[#3B82F6]/20 text-[#3B82F6] font-mono font-bold min-w-[120px] sticky right-0 z-20">
                        <div>Final Total</div>
                        <div className="text-[10px] text-zinc-400 font-normal">/ {semesterScale}</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 bg-white dark:bg-[#09090B]">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={activeAssignments.length + 4} className="py-12 text-center text-zinc-400">
                          No students found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((s, idx) => {
                        return (
                          <tr
                            key={s.studentId}
                            className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group"
                          >
                            {/* Row # */}
                            <td className="py-2 px-3 text-center text-zinc-400 border-r border-zinc-100 dark:border-zinc-800 sticky left-0 z-10 bg-white dark:bg-[#09090B] group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800/60 font-mono text-[11px]">
                              {idx + 1}
                            </td>

                            {/* Student Name */}
                            <td className="py-2 px-3 font-medium text-zinc-900 dark:text-zinc-100 border-r border-zinc-100 dark:border-zinc-800 sticky left-10 z-10 bg-white dark:bg-[#09090B] group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800/60 whitespace-nowrap">
                              {s.studentName}
                            </td>

                            {/* Student ID */}
                            <td className="py-2 px-3 font-mono text-zinc-600 dark:text-zinc-400 border-r border-zinc-100 dark:border-zinc-800 sticky left-[180px] z-10 bg-white dark:bg-[#09090B] group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800/60 whitespace-nowrap text-[11px]">
                              {s.studentNumber}
                            </td>

                            {/* Assignment Scores */}
                            {activeAssignments.map(asg => {
                              const asgScore = s.assignmentScores[asg.id];
                              const display = asgScore ? asgScore.displayScore.toFixed(2) : '—';
                              const isOverflow = asgScore?.isOverflow;

                              return (
                                <td
                                  key={asg.id}
                                  className="py-2 px-3 text-center font-mono border-r border-zinc-100 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                                >
                                  <span className={isOverflow ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                                    {display}
                                  </span>
                                </td>
                              );
                            })}

                            {/* Final Semester Score */}
                            <td className="py-2 px-4 text-center font-mono font-black border-l border-zinc-200 dark:border-zinc-800 bg-[#3B82F6]/5 text-[#3B82F6] sticky right-0 z-10 group-hover:bg-[#3B82F6]/10">
                              <div className="flex items-center justify-center gap-1.5">
                                <span className="text-sm">{s.displaySemesterTotal.toFixed(2)}</span>
                                {s.isSemesterOverflow && (
                                  <span
                                    className="text-[9px] px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                                    title={`Bonus overflow: Exceeds ${semesterScale} target scale!`}
                                  >
                                    +Bonus
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}

                    {/* Summary Row (Averages) */}
                    <tr className="bg-zinc-100 dark:bg-zinc-900 font-semibold text-zinc-900 dark:text-zinc-100 border-t-2 border-zinc-300 dark:border-zinc-700 sticky bottom-0 z-20">
                      <td className="py-2.5 px-3 text-center border-r border-zinc-200 dark:border-zinc-800 sticky left-0 z-30 bg-zinc-100 dark:bg-zinc-900">
                        —
                      </td>
                      <td className="py-2.5 px-3 border-r border-zinc-200 dark:border-zinc-800 sticky left-10 z-30 bg-zinc-100 dark:bg-zinc-900">
                        Class Mean
                      </td>
                      <td className="py-2.5 px-3 border-r border-zinc-200 dark:border-zinc-800 sticky left-[180px] z-30 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 font-mono text-[11px]">
                        {filteredStudents.length} Students
                      </td>
                      {activeAssignments.map(asg => (
                        <td
                          key={asg.id}
                          className="py-2.5 px-3 text-center font-mono text-zinc-900 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800"
                        >
                          {finalScoreAverages.asgAverages[asg.id] ?? '—'}
                        </td>
                      ))}
                      <td className="py-2.5 px-4 text-center font-mono font-black text-[#3B82F6] bg-[#3B82F6]/15 border-l border-zinc-300 dark:border-zinc-700 sticky right-0 z-20">
                        {finalScoreAverages.overallAverage}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : currentAssignment ? (
                /* TAB: Individual Assessment Detailed Question Breakdown */
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-zinc-900 text-white sticky top-0 z-20 font-medium">
                    <tr>
                      <th className="py-2.5 px-3 border-b border-r border-zinc-800 sticky left-0 z-30 bg-zinc-900 w-10 text-center">
                        #
                      </th>
                      <th className="py-2.5 px-3 border-b border-r border-zinc-800 sticky left-10 z-30 bg-zinc-900 min-w-[140px]">
                        Student Name
                      </th>
                      <th className="py-2.5 px-3 border-b border-r border-zinc-800 sticky left-[180px] z-30 bg-zinc-900 min-w-[100px] font-mono">
                        Student ID
                      </th>
                      {(currentAssignment.questions || []).map(q => (
                        <th
                          key={q.id}
                          className={`py-2.5 px-3 text-center border-b border-r border-zinc-800 font-mono min-w-[65px] ${
                            q.isBonus ? 'bg-amber-500/10 text-amber-400' : ''
                          }`}
                        >
                          <div className="truncate max-w-[90px]">{q.title}</div>
                          <div className="text-[10px] text-zinc-400 font-normal">
                            /{q.directMaxScore}p {q.isBonus && <span className="font-bold text-amber-400">(Bonus)</span>}
                          </div>
                        </th>
                      ))}
                      <th className="py-2.5 px-3 text-center border-b border-r border-zinc-800 font-mono font-bold min-w-[80px]">
                        <div>Sum Points</div>
                        <div className="text-[10px] text-zinc-400 font-normal">Total Points</div>
                      </th>
                      <th className="py-2.5 px-3 text-center border-b border-zinc-800 bg-[#3B82F6]/20 text-[#3B82F6] font-mono font-bold min-w-[100px] sticky right-0 z-20">
                        <div>Score /{currentAssignment.targetScale ?? 1.0}</div>
                        <div className="text-[10px] text-zinc-400 font-normal">Final Score</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 bg-white dark:bg-[#09090B]">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={(currentAssignment.questions || []).length + 5} className="py-12 text-center text-zinc-400">
                          No students found.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((s, idx) => {
                        const grade = activeGrades[`${s.studentId}_${currentAssignment.id}`];
                        const calc = calculateStudentAssignmentScore(currentAssignment, grade?.scores);

                        return (
                          <tr
                            key={s.studentId}
                            className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group"
                          >
                            <td className="py-2 px-3 text-center text-zinc-400 border-r border-zinc-100 dark:border-zinc-800 sticky left-0 z-10 bg-white dark:bg-[#09090B] group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800/60 font-mono text-[11px]">
                              {idx + 1}
                            </td>
                            <td className="py-2 px-3 font-medium text-zinc-900 dark:text-zinc-100 border-r border-zinc-100 dark:border-zinc-800 sticky left-10 z-10 bg-white dark:bg-[#09090B] group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800/60 whitespace-nowrap">
                              {s.studentName}
                            </td>
                            <td className="py-2 px-3 font-mono text-zinc-600 dark:text-zinc-400 border-r border-zinc-100 dark:border-zinc-800 sticky left-[180px] z-10 bg-white dark:bg-[#09090B] group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800/60 whitespace-nowrap text-[11px]">
                              {s.studentNumber}
                            </td>
                            {(currentAssignment.questions || []).map(q => {
                              const val = grade?.scores?.[q.id];
                              return (
                                <td
                                  key={q.id}
                                  className={`py-2 px-3 text-center font-mono border-r border-zinc-100 dark:border-zinc-800 ${
                                    q.isBonus ? 'bg-amber-500/5 text-amber-600 dark:text-amber-400 font-semibold' : 'text-zinc-700 dark:text-zinc-300'
                                  }`}
                                >
                                  {val !== undefined && val !== null ? val : '—'}
                                </td>
                              );
                            })}
                            <td className="py-2 px-3 text-center font-mono font-bold text-zinc-900 dark:text-zinc-100 border-r border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                              {calc.totalEarned.toFixed(1)}
                            </td>
                            <td className="py-2 px-3 text-center font-mono font-bold border-l border-zinc-200 dark:border-zinc-800 bg-[#3B82F6]/5 text-[#3B82F6] sticky right-0 z-10 group-hover:bg-[#3B82F6]/10">
                              <div className="flex items-center justify-center gap-1">
                                <span>{calc.displayScore.toFixed(2)}</span>
                                {calc.isOverflow && (
                                  <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                                    +Bonus
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
