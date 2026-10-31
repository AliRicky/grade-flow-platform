import React, { useEffect, useState } from 'react';
import {
  X,
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertCircle,
  Printer,
  Sparkles,
  Layers,
  FileDown,
  Copy
} from 'lucide-react';
import { useCourse } from '../../context/CourseContext';
import { useAuth } from '../../context/AuthContext';
import { Assignment } from '../../types';
import {
  exportGradebookMatrixPDF,
  exportAssignmentReportPDF,
  generateCSVContent,
  downloadCSV,
  generateMasterCSVContent
} from '../../utils/pdfExport';

interface ExportCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAssignmentId?: string;
}

export const ExportCenterModal: React.FC<ExportCenterModalProps> = ({
  isOpen,
  onClose,
  defaultAssignmentId,
}) => {
  const { assignments, grades } = useCourse();
  const { currentUser, users } = useAuth();

  const students = users.filter(u => u.role === 'student');

  // Export Mode: 'master' for entire course gradebook, or 'assignment' for single
  const [exportScope, setExportScope] = useState<'master' | 'assignment'>(
    defaultAssignmentId ? 'assignment' : 'master'
  );
  const [selectedAsgId, setSelectedAsgId] = useState<string>(
    defaultAssignmentId || assignments[0]?.id || ''
  );
  const [format, setFormat] = useState<'pdf' | 'csv'>('pdf');
  const [includeSignoff, setIncludeSignoff] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCSV, setCopiedCSV] = useState<boolean>(false);

  // The modal stays mounted, so re-sync its selection every time it opens
  useEffect(() => {
    if (!isOpen) return;
    setExportScope(defaultAssignmentId ? 'assignment' : 'master');
    setSelectedAsgId(defaultAssignmentId || assignments[0]?.id || '');
    setSuccessMessage(null);
    setErrorMessage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, defaultAssignmentId]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedAssignment = assignments.find(a => a.id === selectedAsgId) || assignments[0];

  const handleCopyCSV = () => {
    try {
      let csv = '';
      if (exportScope === 'master') {
        csv = generateMasterCSVContent(assignments, students, grades);
      } else if (selectedAssignment) {
        csv = generateCSVContent(selectedAssignment, students, grades, 'en');
      }
      navigator.clipboard.writeText(csv);
      setCopiedCSV(true);
      setSuccessMessage('CSV table data copied to clipboard! You can paste directly into Excel or Google Sheets.');
      setTimeout(() => setCopiedCSV(false), 3000);
    } catch (err) {
      setErrorMessage('Could not copy CSV data to clipboard.');
    }
  };

  const handleExecuteExport = () => {
    setIsExporting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      if (exportScope === 'master') {
        // Master Gradebook
        if (format === 'pdf') {
          exportGradebookMatrixPDF(assignments, students, grades, {
            courseName: 'Introduction to Algorithms & Systems',
            instructorName: currentUser?.full_name || 'Lead TA Staff',
            semester: 'Fall 2026',
            includeSignoff,
          });
          setSuccessMessage('Official Course Master Gradebook PDF successfully downloaded!');
        } else {
          const csv = generateMasterCSVContent(assignments, students, grades);
          downloadCSV('Master_Gradebook_Matrix.csv', csv);
          setSuccessMessage('Master Gradebook CSV successfully downloaded!');
        }
      } else {
        // Individual assessment
        if (!selectedAssignment) {
          throw new Error('Please select an assessment to export.');
        }
        if (format === 'pdf') {
          exportAssignmentReportPDF(selectedAssignment, students, grades, {
            courseName: 'Introduction to Algorithms & Systems',
            instructorName: currentUser?.full_name || 'TA Staff',
            semester: 'Fall 2026',
          });
          setSuccessMessage(`${selectedAssignment.shortCode} Official Report PDF downloaded!`);
        } else {
          const csv = generateCSVContent(selectedAssignment, students, grades, 'en');
          const fname = `${selectedAssignment.shortCode}_Scores_English.csv`;
          downloadCSV(fname, csv);
          setSuccessMessage(`${selectedAssignment.shortCode} CSV score sheet downloaded!`);
        }
      }
    } catch (err) {
      console.error('Export error:', err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to trigger download. If blocked by browser permissions, use Browser Print or Copy CSV.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleQuickPrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Export center"
    >
      <div className="w-full max-w-xl bg-white dark:bg-[#09090B] rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 transition-colors">
        
        {/* Header (Supabase theme) */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#151515] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/30 text-[#3B82F6] flex items-center justify-center font-bold">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-zinc-900 dark:text-zinc-100">
                Export Gradebook & Assessment Reports
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Generate official PDF academic records or CSV data files for university archiving.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {successMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-[#3B82F6] rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#3B82F6]" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Scope Selection (Master Course Gradebook vs Individual Assessment) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
              1. Select Export Scope
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExportScope('master')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  exportScope === 'master'
                    ? 'border-[#3B82F6] bg-[#3B82F6]/10 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="w-7 h-7 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Layers className="w-4 h-4 text-[#3B82F6]" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    Master Gradebook
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight block mt-0.5">
                    Full class matrix with all 5 HWs, 5 Quizzes & 9-point scale course totals
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setExportScope('assignment')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  exportScope === 'assignment'
                    ? 'border-[#3B82F6] bg-[#3B82F6]/10 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="w-7 h-7 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4 text-[#3B82F6]" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    Individual Assessment
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight block mt-0.5">
                    Granular breakdown of questions, subparts & difficulty statistics
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Assessment Picker (Only if Individual is chosen) */}
          {exportScope === 'assignment' && (
            <div className="bg-zinc-50 dark:bg-zinc-900 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Select Assessment to Export:
              </label>
              <select
                value={selectedAsgId}
                onChange={e => setSelectedAsgId(e.target.value)}
                className="w-full h-11 text-base sm:text-xs font-medium bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
              >
                <optgroup label="Homework Assignments (5)">
                  {assignments.filter(a => a.type === 'homework').map(a => (
                    <option key={a.id} value={a.id}>
                      {a.shortCode}: {a.title} ({(Array.isArray(a.questions) ? a.questions.length : 0)} questions · {a.totalMaxScore} pts)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Quizzes (5)">
                  {assignments.filter(a => a.type === 'quiz').map(a => (
                    <option key={a.id} value={a.id}>
                      {a.shortCode}: {a.title} ({(Array.isArray(a.questions) ? a.questions.length : 0)} questions · {a.totalMaxScore} pts)
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          )}

          {/* 2. Format Selection (PDF vs CSV) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-2">
              2. Choose File Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                  format === 'pdf'
                    ? 'border-[#3B82F6] bg-[#3B82F6]/10 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-[#3B82F6] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    PDF Document (.pdf)
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Official formatted report with statistics
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                  format === 'csv'
                    ? 'border-[#3B82F6] bg-[#3B82F6]/10 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-[#3B82F6] flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    CSV Spreadsheet (.csv)
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Excel & university LMS importable
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Verification Checkbox */}
          {format === 'pdf' && (
            <div className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSignoff}
                  onChange={e => setIncludeSignoff(e.target.checked)}
                  className="rounded border-zinc-300 dark:border-zinc-700 text-[#3B82F6] focus:ring-[#3B82F6]"
                />
                <span className="text-zinc-700 dark:text-zinc-300 text-[11px]">
                  Include Official Verification & TA Signature certification block
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-zinc-50 dark:bg-[#151515] border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleQuickPrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            title="Open browser print dialog"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Browser Print</span>
          </button>

          <div className="flex items-center gap-2">
            {format === 'csv' && (
              <button
                type="button"
                onClick={handleCopyCSV}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                title="Copy raw CSV tabular data directly to clipboard"
              >
                <Copy className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>{copiedCSV ? 'Copied!' : 'Copy CSV Data'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleExecuteExport}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-black bg-[#3B82F6] hover:bg-[#2563EB] rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <FileDown className="w-4 h-4 text-black" />
              <span>
                {isExporting
                  ? 'Generating Export...'
                  : `Download ${format.toUpperCase()} (${exportScope === 'master' ? 'All 10 Tasks' : (selectedAssignment?.shortCode || 'Task')})`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
