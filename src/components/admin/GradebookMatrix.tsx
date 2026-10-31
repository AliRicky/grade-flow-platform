import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Download,
  Upload,
  FileSpreadsheet,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  RefreshCw,
  Plus,
  Trash2,
  Settings,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  ExternalLink,
  Award,
  Database,
  Sliders,
} from 'lucide-react';
import { useCourse } from '../../context/CourseContext';
import { useAuth } from '../../context/AuthContext';
import { Assignment, Question, SubQuestion, User } from '../../types';
import { generateCSVContent, downloadCSV } from '../../utils/csv';
import { exportAssignmentReportPDF } from '../../utils/pdfExport';
import { calculateNumericGrade, DEFAULT_GRADING_SCALE } from '../../utils/grading';
import { GradingScaleModal } from './GradingScaleModal';

interface GradebookMatrixProps {
  initialAssignmentId?: string;
  onNavigateToBuilder?: (asgId: string) => void;
  onOpenExportHub?: (asgId?: string) => void;
  onOpenGoogleSheetsModal?: () => void;
}

interface ColumnDef {
  key: string;
  label: string;
  subLabel: string;
  maxScore: number;
  isBonus?: boolean;
}

const GradeCell = React.memo(({
  student, col, cellScore, isJustUpdated, isZero, sIdx, cIdx, handleScoreChange, handleKeyDown, setActiveCell
}: any) => {
  const [localVal, setLocalVal] = useState<string>(cellScore !== undefined && cellScore !== null ? String(cellScore) : '');

  // Sync with prop if it changes from outside
  useEffect(() => {
    setLocalVal(cellScore !== undefined && cellScore !== null ? String(cellScore) : '');
  }, [cellScore]);

  const onBlur = () => {
    setActiveCell(null);
    if (localVal !== (cellScore !== undefined && cellScore !== null ? String(cellScore) : '')) {
      handleScoreChange(student.id, col.key, localVal, col.maxScore);
    }
  };

  return (
    <td
      className={`p-1 text-center border-r border-zinc-100 dark:border-zinc-800 transition-colors ${
        isJustUpdated
          ? 'bg-[#3B82F6]/20'
          : col.isBonus
          ? 'bg-[#3B82F6]/5'
          : ''
      }`}
    >
      <input
        id={`cell_${student.id}_${col.key}`}
        type="number"
        step="0.5"
        min="0"
        max={col.maxScore + 5}
        value={localVal}
        placeholder="—"
        onChange={e => setLocalVal(e.target.value)}
        onFocus={() => setActiveCell({ studentId: student.id, colKey: col.key })}
        onBlur={onBlur}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.currentTarget.blur(); // Trigger save
          }
          handleKeyDown(e, sIdx, cIdx, student.id, col.key);
        }}
        className={`w-full py-1 px-0.5 text-center font-mono text-xs rounded transition-all focus:outline-none focus:ring-1 focus:ring-[#3B82F6] focus:bg-white dark:focus:bg-zinc-900 ${
          localVal !== ''
            ? isZero
              ? 'text-rose-500 font-semibold'
              : 'text-zinc-900 dark:text-zinc-100 font-medium'
            : 'text-zinc-400 bg-transparent'
        }`}
      />
    </td>
  );
});

export const GradebookMatrix: React.FC<GradebookMatrixProps> = ({
  initialAssignmentId,
  onNavigateToBuilder,
  onOpenExportHub,
  onOpenGoogleSheetsModal,
}) => {
  const { assignments, grades, updateGrade, bulkImportGrades, gradingScale: rawScale } = useCourse();
  const gradingScale = rawScale || DEFAULT_GRADING_SCALE;
  const { users, currentUser } = useAuth();

  // Active assessment selected
  const [selectedAsgId, setSelectedAsgId] = useState<string>(
    initialAssignmentId && assignments.some(a => a.id === initialAssignmentId)
      ? initialAssignmentId
      : assignments[0]?.id || ''
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [justUpdatedKey, setJustUpdatedKey] = useState<string | null>(null);
  const [activeCell, setActiveCell] = useState<{ studentId: string; colKey: string } | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isScaleModalOpen, setIsScaleModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    if (isExportMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExportMenuOpen]);

  const students = useMemo(() => {
    return users.filter(u => u.role === 'student');
  }, [users]);

  const currentAssignment = useMemo(() => {
    return assignments.find(a => a.id === selectedAsgId) || assignments[0];
  }, [assignments, selectedAsgId]);

  // Handle Export CSV
  const handleExportCSV = () => {
    if (!currentAssignment) return;
    const csvData = generateCSVContent(currentAssignment, students, grades, 'en');
    const filename = `${currentAssignment.shortCode}_Grades_English.csv`;
    downloadCSV(filename, csvData);
  };

  // Quick export individual PDF report
  const handleExportPDF = () => {
    if (!currentAssignment) return;
    exportAssignmentReportPDF(currentAssignment, students, grades, {
      instructorName: currentUser?.full_name || 'TA Staff',
    });
  };

  // Flatten nested questions into matrix columns
  const columns: ColumnDef[] = useMemo(() => {
    if (!currentAssignment) return [];
    const cols: ColumnDef[] = [];

    const questions = Array.isArray(currentAssignment.questions) ? currentAssignment.questions : [];
    questions.forEach(q => {
      const subQuestions = Array.isArray(q.subQuestions) ? q.subQuestions : [];
      if (subQuestions.length > 0) {
        subQuestions.forEach(sq => {
          cols.push({
            key: `${q.id}_${sq.id}`,
            label: sq.label || `${q.number}-${sq.id}`,
            subLabel: sq.title,
            maxScore: sq.maxScore,
            isBonus: q.isBonus,
          });
        });
      } else {
        cols.push({
          key: q.id,
          label: `Q${q.number}`,
          subLabel: q.title,
          maxScore: q.directMaxScore || 0,
          isBonus: q.isBonus,
        });
      }
    });

    return cols;
  }, [currentAssignment]);

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase().trim();
    return students.filter(s =>
      (s.full_name || '').toLowerCase().includes(q) ||
      (s.studentId && s.studentId.includes(q)) ||
      (s.section && s.section.toLowerCase().includes(q))
    );
  }, [students, searchQuery]);

  // Virtualization logic
  const [scrollTop, setScrollTop] = useState(0);
  const ROW_HEIGHT = 44;
  const OVERSCAN = 10;
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const endIndex = Math.min(filteredStudents.length, startIndex + Math.ceil(640 / ROW_HEIGHT) + 2 * OVERSCAN);
  const visibleStudents = filteredStudents.slice(startIndex, endIndex);
  const topPadding = startIndex * ROW_HEIGHT;
  const bottomPadding = Math.max(0, (filteredStudents.length - endIndex) * ROW_HEIGHT);

  // Handle cell edit
  const handleScoreChange = (
    studentId: string,
    colKey: string,
    rawVal: string,
    maxScore: number
  ) => {
    if (!currentAssignment) return;
    const val = rawVal.trim() === '' ? null : parseFloat(rawVal);
    if (val !== null && (isNaN(val) || val < 0 || val > maxScore + 5)) {
      return;
    }

    updateGrade(
      studentId,
      currentAssignment.id,
      colKey,
      val,
      currentUser?.full_name || 'TA Staff'
    );

    const cellKey = `${studentId}_${colKey}`;
    setJustUpdatedKey(cellKey);
    setTimeout(() => {
      setJustUpdatedKey(null);
    }, 800);
  };

  // Keyboard navigation across cells
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    sIdx: number,
    cIdx: number,
    studentId: string,
    colKey: string
  ) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextStudent = filteredStudents[sIdx + 1];
      if (nextStudent) {
        const nextId = `cell_${nextStudent.id}_${colKey}`;
        document.getElementById(nextId)?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevStudent = filteredStudents[sIdx - 1];
      if (prevStudent) {
        const prevId = `cell_${prevStudent.id}_${colKey}`;
        document.getElementById(prevId)?.focus();
      }
    } else if (e.key === 'ArrowRight' && (e.currentTarget.selectionEnd === e.currentTarget.value.length)) {
      const nextCol = columns[cIdx + 1];
      if (nextCol) {
        const nextId = `cell_${studentId}_${nextCol.key}`;
        document.getElementById(nextId)?.focus();
      }
    } else if (e.key === 'ArrowLeft' && (e.currentTarget.selectionStart === 0)) {
      const prevCol = columns[cIdx - 1];
      if (prevCol) {
        const prevId = `cell_${studentId}_${prevCol.key}`;
        document.getElementById(prevId)?.focus();
      }
    }
  };

  // CSV Import logic
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setImportText(text);
        setIsImportModalOpen(true);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Minimal RFC-4180 style line parser (handles quoted commas and escaped quotes)
  const parseCsvLine = (line: string): string[] => {
    const out: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') inQuotes = false;
        else cur += ch;
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        out.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    out.push(cur.trim());
    return out;
  };

  const executeImport = () => {
    if (!currentAssignment) return;
    try {
      const text = importText.replace(/^\uFEFF/, '').trim();
      if (!text) {
        setImportStatus('Please provide CSV content to import.');
        return;
      }

      const lines = text.split(/\r?\n/).filter(l => l.trim());
      if (lines.length < 2) {
        setImportStatus('CSV must contain a header line and at least one student data row.');
        return;
      }

      const headerLine = parseCsvLine(lines[0]);
      const norm = (h: string) => h.toLowerCase().replace(/\s+/g, '');
      const idCol = headerLine.findIndex(h => norm(h) === 'studentid');
      if (idCol === -1) {
        setImportStatus('Could not find a "Student ID" column in the header row.');
        return;
      }

      const recordsToImport: { studentId: string; scores: Record<string, number> }[] = [];
      let skipped = 0;

      lines.slice(1).forEach(line => {
        const parts = parseCsvLine(line);
        const stuIdVal = parts[idCol];
        const student = stuIdVal ? students.find(s => s.studentId === stuIdVal || s.id === stuIdVal) : undefined;
        if (!student) { skipped++; return; }

        const mappedScores: Record<string, number> = {};
        headerLine.forEach((headerLabel, idx) => {
          const valStr = parts[idx];
          if (!valStr || isNaN(Number(valStr))) return;
          const col = columns.find(c => norm(c.label) === norm(headerLabel));
          if (col) mappedScores[col.key] = Number(valStr);
        });

        if (Object.keys(mappedScores).length > 0) {
          recordsToImport.push({ studentId: student.id, scores: mappedScores });
        } else {
          skipped++;
        }
      });

      if (recordsToImport.length === 0) {
        setImportStatus('No matching students or score columns were found. Check the Student ID and column headers.');
        return;
      }

      bulkImportGrades(currentAssignment.id, recordsToImport);
      setImportStatus(
        `Updated scores for ${recordsToImport.length} student${recordsToImport.length === 1 ? '' : 's'}` +
        (skipped ? ` (${skipped} row${skipped === 1 ? '' : 's'} skipped).` : '.')
      );
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportStatus(null);
        setImportText('');
      }, 1600);
    } catch (err: unknown) {
      setImportStatus('Failed to parse CSV: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Calculate bottom row statistics (Averages)
  const columnAverages = useMemo(() => {
    if (!currentAssignment) {
      return { columns: {} as Record<string, string>, avgTotal: '—', avgFinal: '—', avgGrade9: '—', activeCount: 0 };
    }
    const sums: Record<string, number> = {};
    const counts: Record<string, number> = {};
    let totalScoreSum = 0;
    let finalScoreSum = 0;
    let studentWithGradesCount = 0;

    columns.forEach(c => {
      sums[c.key] = 0;
      counts[c.key] = 0;
    });

    students.forEach(s => {
      const grade = grades[`${s.id}_${currentAssignment.id}`];
      let rowTotal = 0;
      let rowBonus = 0;
      let hasAnyGrade = false;

      columns.forEach(c => {
        const val = grade?.scores?.[c.key];
        if (val !== undefined && val !== null) {
          sums[c.key] += val;
          counts[c.key] += 1;
          hasAnyGrade = true;
          if (c.isBonus) {
            rowBonus += val;
          } else {
            rowTotal += val;
          }
        }
      });

      if (hasAnyGrade) {
        studentWithGradesCount++;
        const rowRaw = rowTotal + rowBonus;
        totalScoreSum += rowRaw;
        const scaled = currentAssignment.totalMaxScore > 0
          ? Math.min(gradingScale.max_score, (rowRaw / currentAssignment.totalMaxScore) * gradingScale.max_score)
          : Math.min(gradingScale.max_score, rowRaw);
        finalScoreSum += scaled;
      }
    });

    const averagesMap: Record<string, string> = {};
    columns.forEach(c => {
      const cnt = counts[c.key];
      averagesMap[c.key] = cnt > 0 ? (sums[c.key] / cnt).toFixed(1) : '—';
    });

    const avgTotal = studentWithGradesCount > 0 ? (totalScoreSum / studentWithGradesCount).toFixed(1) : '—';
    const avgFinal = studentWithGradesCount > 0 ? (finalScoreSum / studentWithGradesCount).toFixed(2) : '—';
    const avgPct = studentWithGradesCount > 0 && gradingScale.max_score > 0 ? (parseFloat(avgFinal) / gradingScale.max_score) * 100 : 0;
    const avgGradeObj = calculateNumericGrade(avgPct, gradingScale);

    return {
      columns: averagesMap,
      avgTotal,
      avgFinal,
      avgGrade9: gradingScale.max_score === 9 ? `Grade ${avgGradeObj.gradeNumber}` : avgGradeObj.displayGrade,
      activeCount: studentWithGradesCount,
    };
  }, [students, columns, grades, currentAssignment, gradingScale]);

  if (!currentAssignment) {
    return (
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 text-center text-sm text-zinc-500">
        No assignments yet. Create one in the Assignments tab to start grading.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Controls Toolbar (Supabase theme) */}
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Assessment Tab Selector */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {assignments.map(a => {
              const isSelected = a.id === selectedAsgId;
              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedAsgId(a.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    isSelected
                      ? 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-[#3B82F6] shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <span>{a.shortCode}</span>
                  <span className="text-[10px] opacity-75">
                    ({a.type === 'homework' ? 'HW' : 'Quiz'})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action Toolbar with Dieter Rams Minimalist Refinement */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input - Perfectly Centered Icon */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search student or ID..."
                className="h-9 pl-9 pr-3 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 focus:border-[#3B82F6] transition-all w-44 sm:w-52"
              />
            </div>

            {/* Scoring Scale Button */}
            <button
              onClick={() => setIsScaleModalOpen(true)}
              className="h-9 inline-flex items-center justify-center gap-2 px-3 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xs transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
              title="Configure Course Scoring & Grading Scale"
            >
              <Sliders className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />
              <span>Scale: Max {gradingScale.max_score}</span>
            </button>

            {/* Supabase Database Sync Button */}
            {onOpenGoogleSheetsModal && (
              <button
                onClick={onOpenGoogleSheetsModal}
                className="h-9 inline-flex items-center justify-center gap-2 px-3 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xs transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
                title="Manage Supabase Database Sync & Tables"
              >
                <Database className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Supabase DB</span>
              </button>
            )}

            {/* Hidden file input for import */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileImport}
              className="hidden"
            />

            {/* Import CSV Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="h-9 inline-flex items-center justify-center gap-2 px-3 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xs transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
              title="Import student scores from CSV file"
            >
              <Upload className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
              <span>Import CSV</span>
            </button>

            {/* Unified Export Dropdown Hub */}
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setIsExportMenuOpen(prev => !prev)}
                className={`h-9 inline-flex items-center justify-center gap-2 px-3.5 text-xs font-semibold rounded-xl transition-all active:scale-[0.98] cursor-pointer shadow-2xs whitespace-nowrap ${
                  isExportMenuOpen
                    ? 'bg-[#3B82F6] text-white border border-[#3B82F6]'
                    : 'bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800'
                }`}
                title="Export grades as CSV, PDF report, or open Export Hub"
              >
                <Download className={`w-3.5 h-3.5 shrink-0 ${isExportMenuOpen ? 'text-white' : 'text-[#3B82F6]'}`} />
                <span>Export</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isExportMenuOpen ? 'rotate-180 text-white' : 'text-zinc-400'}`} />
              </button>

              {isExportMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2.5 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Assessment Exports
                  </div>
                  <button
                    onClick={() => {
                      handleExportCSV();
                      setIsExportMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors group cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Export CSV</div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Current assessment score sheet</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      handleExportPDF();
                      setIsExportMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors group cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Export PDF Report</div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Formatted summary & stats</div>
                    </div>
                  </button>

                  {onOpenExportHub && (
                    <>
                      <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />
                      <button
                        onClick={() => {
                          onOpenExportHub(currentAssignment.id);
                          setIsExportMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors group cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-[#3B82F6]/10 flex items-center justify-center shrink-0">
                          <Download className="w-3.5 h-3.5 text-[#3B82F6]" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Open Export Hub...</div>
                          <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Master gradebook & all class reports</div>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informational Sub-header */}
        <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-3">
            <span>
              <strong className="text-zinc-900 dark:text-zinc-100">{currentAssignment.title}</strong>
            </span>
            <span>·</span>
            <span>Total Columns: {columns.length} question parts</span>
            <span>·</span>
            <button
              onClick={() => setIsScaleModalOpen(true)}
              className="font-mono hover:text-[#3B82F6] underline decoration-dotted transition-colors cursor-pointer"
              title="Click to change scoring scale"
            >
              Scale: 0 – {gradingScale.max_score.toFixed(gradingScale.precision ?? 1)} pts (Pass: {gradingScale.passing_threshold})
            </button>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
            <span>Tip: Click any cell to grade · Press <kbd className="px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded">Enter</kbd> to move down</span>
          </div>
        </div>
      </div>

      {/* Main Gradebook Matrix Spreadsheet Table (Supabase Theme) */}
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden transition-colors">
        <div className="overflow-auto max-h-[640px]" onScroll={e => setScrollTop((e.target as HTMLDivElement).scrollTop)}>
          <table className="w-full text-left text-xs border-collapse">
            
            {/* Table Header */}
            <thead className="bg-zinc-900 text-zinc-100 sticky top-0 z-20 shadow-xs border-b border-zinc-800">
              <tr>
                {/* Fixed Student Info Columns */}
                <th className="py-2.5 px-3 font-semibold border-b border-r border-zinc-800 sticky left-0 z-30 bg-zinc-900 min-w-[130px]">
                  Student Name
                </th>
                <th className="py-2.5 px-3 font-semibold border-b border-r border-zinc-800 sticky left-[130px] z-30 bg-zinc-900 min-w-[100px] font-mono">
                  Student ID
                </th>

                {/* Dynamic Question / Subquestion Columns */}
                {columns.map(col => (
                  <th
                    key={col.key}
                    className={`py-2 px-2 text-center border-b border-r border-zinc-800 min-w-[65px] ${
                      col.isBonus ? 'bg-zinc-800/80 text-[#3B82F6]' : 'bg-zinc-900 text-zinc-200'
                    }`}
                  >
                    <div className="font-mono font-bold">{col.label}</div>
                    <div className="text-[10px] text-zinc-400 font-mono font-normal">
                      /{col.maxScore}p {col.isBonus && <span className="text-[#3B82F6] font-semibold">(Bonus)</span>}
                    </div>
                  </th>
                ))}

                {/* Computed Columns */}
                <th className="py-2.5 px-3 text-center font-bold border-b border-r border-zinc-800 bg-zinc-900 min-w-[70px] font-mono">
                  Raw Total
                </th>
                <th className="py-2.5 px-3 text-center font-bold border-b border-r border-zinc-800 bg-zinc-900 text-[#3B82F6] min-w-[75px] font-mono">
                  Score /{gradingScale.max_score.toFixed(gradingScale.precision ?? 1)}
                </th>
                <th className="py-2.5 px-3 text-center font-bold border-b border-zinc-800 bg-zinc-900 text-[#3B82F6] min-w-[75px] font-mono">
                  {gradingScale.max_score === 9 ? 'Scale 9' : `Scale ${gradingScale.max_score}`}
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 bg-white dark:bg-[#09090B]">

              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 5} className="py-8 text-center text-zinc-400">
                    No students match the search filter.
                  </td>
                </tr>
              ) : (
                <>
                  {topPadding > 0 && <tr style={{ height: topPadding }}><td colSpan={columns.length + 5}></td></tr>}
                  {visibleStudents.map((student, sIdx) => {
                    const actualSIdx = startIndex + sIdx;
                    const studentGrade = grades[`${student.id}_${currentAssignment.id}`];
                    let rowTotal = 0;
                    let rowBonus = 0;

                    // Precompute totals
                    columns.forEach(c => {
                      const val = studentGrade?.scores?.[c.key];
                      if (val !== undefined && val !== null) {
                        if (c.isBonus) {
                          rowBonus += val;
                        } else {
                          rowTotal += val;
                        }
                      }
                    });

                    const combined = rowTotal + rowBonus;
                    const finalScore = currentAssignment.totalMaxScore > 0
                      ? Math.min(gradingScale.max_score, Math.round(((combined / currentAssignment.totalMaxScore) * gradingScale.max_score) * 100) / 100)
                      : Math.min(gradingScale.max_score, combined);

                    const pct = currentAssignment.totalMaxScore > 0 ? (combined / currentAssignment.totalMaxScore) * 100 : 0;
                    const numericGrade = calculateNumericGrade(pct, gradingScale);

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors group"
                        style={{ height: ROW_HEIGHT }}
                      >
                        {/* Pinned Student Name */}
                        <td className="py-2 px-3 font-medium text-zinc-900 dark:text-zinc-100 border-r border-zinc-100 dark:border-zinc-800 sticky left-0 z-10 bg-white dark:bg-[#09090B] group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800/60 transition-colors whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-[10px] flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-300 shrink-0">
                              {(student.full_name || 'U').charAt(0)}
                            </div>
                            <span className="truncate max-w-[110px]">{student.full_name || 'Unknown'}</span>
                          </div>
                        </td>

                        {/* Pinned Student ID */}
                        <td className="py-2 px-3 font-mono text-[11px] text-zinc-600 dark:text-zinc-400 border-r border-zinc-100 dark:border-zinc-800 sticky left-[130px] z-10 bg-white dark:bg-[#09090B] group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800/60 transition-colors whitespace-nowrap">
                          {student.studentId}
                        </td>

                        {/* Dynamic Editable Score Cells */}
                        {columns.map((col, cIdx) => {
                          const cellScore = studentGrade?.scores?.[col.key];
                          const cellKey = `${student.id}_${col.key}`;
                          const isJustUpdated = justUpdatedKey === cellKey;
                          const isZero = cellScore === 0;

                          return (
                            <GradeCell
                              key={col.key}
                              student={student}
                              col={col}
                              cellScore={cellScore}
                              isJustUpdated={isJustUpdated}
                              isZero={isZero}
                              sIdx={actualSIdx}
                              cIdx={cIdx}
                              handleScoreChange={handleScoreChange}
                              handleKeyDown={handleKeyDown}
                              setActiveCell={setActiveCell}
                            />
                          );
                        })}

                        {/* Row Total Score */}
                        <td className="py-2 px-3 text-center font-mono font-semibold text-zinc-800 dark:text-zinc-200 border-r border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                          {combined > 0 ? combined.toFixed(1) : '0.0'}
                        </td>

                        {/* Row final scaled score */}
                        <td className="py-2 px-3 text-center font-mono font-bold border-r border-zinc-100 dark:border-zinc-800 bg-[#3B82F6]/5 text-[#3B82F6]">
                          {finalScore.toFixed(2)}
                        </td>

                        {/* Row Numeric Grade */}
                        <td className="py-2 px-3 text-center font-mono font-bold bg-[#3B82F6]/10 text-[#3B82F6]">
                          {gradingScale.max_score === 9 ? `Grade ${numericGrade.gradeNumber}` : numericGrade.displayGrade}
                        </td>
                      </tr>
                    );
                  })}
                  {bottomPadding > 0 && <tr style={{ height: bottomPadding }}><td colSpan={columns.length + 5}></td></tr>}
                </>
              )}

              {/* Bottom Averages Row */}
              <tr className="bg-zinc-100 dark:bg-zinc-900 font-semibold text-zinc-900 dark:text-zinc-100 border-t-2 border-zinc-300 dark:border-zinc-700 sticky bottom-0 z-20">
                <td className="py-2.5 px-3 border-r border-zinc-200 dark:border-zinc-800 sticky left-0 z-30 bg-zinc-100 dark:bg-zinc-900">
                  Class Averages
                </td>
                <td className="py-2.5 px-3 border-r border-zinc-200 dark:border-zinc-800 sticky left-[130px] z-30 bg-zinc-100 dark:bg-zinc-900 text-[11px] text-zinc-500 font-mono">
                  {columnAverages.activeCount} active
                </td>

                {columns.map(col => (
                  <td
                    key={col.key}
                    className="py-2 px-1 text-center font-mono text-xs border-r border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                  >
                    {columnAverages.columns[col.key]}
                  </td>
                ))}

                <td className="py-2.5 px-3 text-center font-mono font-bold text-zinc-900 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-800">
                  {columnAverages.avgTotal}
                </td>

                <td className="py-2.5 px-3 text-center font-mono font-extrabold text-[#3B82F6] bg-[#3B82F6]/10 border-r border-zinc-200 dark:border-zinc-800">
                  {columnAverages.avgFinal}
                </td>

                <td className="py-2.5 px-3 text-center font-mono font-extrabold text-[#3B82F6] bg-[#3B82F6]/15">
                  {columnAverages.avgGrade9}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Import Modal */}
      {isImportModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onMouseDown={e => { if (e.target === e.currentTarget) { setIsImportModalOpen(false); setImportStatus(null); } }}
          role="dialog"
          aria-modal="true"
          aria-label="Import grades from CSV"
        >
          <div className="w-full max-w-lg bg-white dark:bg-[#09090B] rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#3B82F6]" />
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-display">
                  Bulk Import Grades from CSV
                </h3>
              </div>
              <button
                onClick={() => { setIsImportModalOpen(false); setImportStatus(null); }}
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                Cancel
              </button>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                You can upload or paste a CSV with Student IDs and score columns. Matches English headers (<code>Student ID, 1-a, 1-b, Q1...</code>).
              </p>

              {importStatus && (
                <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-200 rounded-xl">
                  {importStatus}
                </div>
              )}

              <textarea
                rows={8}
                value={importText}
                onChange={e => setImportText(e.target.value)}
                placeholder="Paste CSV text here..."
                className="w-full p-2.5 text-xs font-mono rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={executeImport}
                  className="px-4 py-1.5 text-xs font-semibold text-black bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg transition-colors shadow-xs"
                >
                  Parse & Apply Scores
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Grading Scale Settings Modal */}
      <GradingScaleModal
        isOpen={isScaleModalOpen}
        onClose={() => setIsScaleModalOpen(false)}
      />
    </div>
  );
};
