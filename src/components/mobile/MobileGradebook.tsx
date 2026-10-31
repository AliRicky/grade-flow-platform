import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  Upload,
  Download,
  Database,
  Plus
} from 'lucide-react';
import { useCourse } from '../../context/CourseContext';
import { useAuth } from '../../context/AuthContext';
import { Assignment, User } from '../../types';
import { calculateNumericGrade } from '../../utils/grading';
import { MobileGradingDrawer } from './MobileGradingDrawer';

interface MobileGradebookProps {
  initialAssignmentId?: string;
  onNavigateToBuilder?: (asgId: string) => void;
  onOpenExportHub?: (asgId?: string) => void;
  onOpenGoogleSheetsModal?: () => void;
}

export const MobileGradebook: React.FC<MobileGradebookProps> = ({
  initialAssignmentId,
  onNavigateToBuilder,
  onOpenExportHub,
  onOpenGoogleSheetsModal,
}) => {
  const { assignments, grades } = useCourse();
  const { users } = useAuth();

  const students = useMemo(() => users.filter(u => u.role === 'student'), [users]);

  // Selected Assignment
  const [selectedAsgId, setSelectedAsgId] = useState<string>(() => {
    return initialAssignmentId || assignments[0]?.id || '';
  });

  const currentAssignment = useMemo(() => {
    return assignments.find(a => a.id === selectedAsgId) || assignments[0];
  }, [assignments, selectedAsgId]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'graded' | 'ungraded'>('all');

  // Drawer State
  const [activeStudentIndex, setActiveStudentIndex] = useState<number | null>(null);

  // Extract Question Keys
  const questionKeys = useMemo(() => {
    if (!currentAssignment) return [];
    const keys: { key: string; maxScore: number; isBonus?: boolean }[] = [];
    const questions = Array.isArray(currentAssignment.questions) ? currentAssignment.questions : [];

    questions.forEach(q => {
      const sqs = Array.isArray(q.subQuestions) ? q.subQuestions : [];
      if (sqs.length > 0) {
        sqs.forEach(sq => {
          keys.push({ key: `${q.id}_${sq.id}`, maxScore: sq.maxScore, isBonus: q.isBonus });
        });
      } else {
        keys.push({ key: q.id, maxScore: q.directMaxScore || 10, isBonus: q.isBonus });
      }
    });

    return keys;
  }, [currentAssignment]);

  // Precompute student summary metrics
  const studentMetrics = useMemo(() => {
    if (!currentAssignment) return new Map();

    const map = new Map<string, {
      rawTotal: number;
      scaledFinal: number;
      gradedParts: number;
      isFullyGraded: boolean;
      hasAnyGrade: boolean;
      numericGrade: ReturnType<typeof calculateNumericGrade>;
    }>();

    students.forEach(s => {
      const g = grades[`${s.id}_${currentAssignment.id}`];
      let rawTotal = 0;
      let rawBonus = 0;
      let gradedParts = 0;

      questionKeys.forEach(qk => {
        const val = g?.scores?.[qk.key];
        if (val !== undefined && val !== null) {
          gradedParts++;
          if (qk.isBonus) rawBonus += val;
          else rawTotal += val;
        }
      });

      const rawSum = rawTotal + rawBonus;
      const scaled = currentAssignment.totalMaxScore > 0
        ? Math.min(9, (rawSum / currentAssignment.totalMaxScore) * 9)
        : Math.min(9, rawSum);
      const pct = (scaled / 9) * 100;

      map.set(s.id, {
        rawTotal: rawSum,
        scaledFinal: scaled,
        gradedParts,
        isFullyGraded: questionKeys.length > 0 && gradedParts >= questionKeys.filter(k => !k.isBonus).length,
        hasAnyGrade: gradedParts > 0,
        numericGrade: calculateNumericGrade(pct),
      });
    });

    return map;
  }, [students, grades, currentAssignment, questionKeys]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        s.full_name.toLowerCase().includes(query) ||
        (s.studentId && s.studentId.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      const m = studentMetrics.get(s.id);
      if (statusFilter === 'graded') return m?.hasAnyGrade;
      if (statusFilter === 'ungraded') return !m?.hasAnyGrade;

      return true;
    });
  }, [students, searchQuery, statusFilter, studentMetrics]);

  // Class Overview Stats
  const classStats = useMemo(() => {
    if (!currentAssignment || students.length === 0) return { avgScaled: '—', gradedCount: 0 };

    let totalScaled = 0;
    let gradedCount = 0;

    students.forEach(s => {
      const m = studentMetrics.get(s.id);
      if (m && m.hasAnyGrade) {
        gradedCount++;
        totalScaled += m.scaledFinal;
      }
    });

    const avgScaled = gradedCount > 0 ? (totalScaled / gradedCount).toFixed(2) : '—';
    return { avgScaled, gradedCount };
  }, [students, studentMetrics, currentAssignment]);

  if (!currentAssignment) {
    return (
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center text-sm text-zinc-500">
        No assessments available. Create one to begin grading.
      </div>
    );
  }

  const activeStudent = activeStudentIndex !== null ? filteredStudents[activeStudentIndex] : null;

  return (
    <div className="space-y-4 pb-6 touch-pan-y">
      {/* Assessment Horizontal Picker */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar touch-pan-x overscroll-contain">
        {assignments.map(a => {
          const isSelected = a.id === selectedAsgId;
          return (
            <button
              key={a.id}
              onClick={() => setSelectedAsgId(a.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-2xs ${
                isSelected
                  ? 'bg-zinc-900 text-white dark:bg-[#3B82F6] dark:text-black shadow-xs'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
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

      {/* Assessment Header Card */}
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-2xs">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3B82F6]">
              Active Assessment
            </span>
            <h2 className="text-base font-bold font-display text-zinc-900 dark:text-zinc-100 truncate mt-0.5">
              {currentAssignment.title}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              <span>{questionKeys.length} Questions</span>
              <span>·</span>
              <span>Max {currentAssignment.totalMaxScore} pts (Scale 9.0)</span>
            </div>
          </div>

          {/* Average Badge */}
          <div className="text-right shrink-0">
            <div className="text-sm font-mono font-bold text-[#3B82F6]">
              {classStats.avgScaled} <span className="text-[10px] text-zinc-400">/ 9.0</span>
            </div>
            <div className="text-[10px] text-zinc-500 font-medium">
              Class Average
            </div>
          </div>
        </div>

        {/* Completion Progress Bar */}
        <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-zinc-500 dark:text-zinc-400">Grading Progress</span>
            <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
              {classStats.gradedCount} / {students.length} students
            </span>
          </div>
          <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3B82F6] rounded-full transition-all duration-300"
              style={{
                width: `${students.length > 0 ? (classStats.gradedCount / students.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Search & Status Filter Controls */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search student or ID..."
            className="w-full h-11 pl-9 pr-3 text-base sm:text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 focus:border-[#3B82F6]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shrink-0">
          {(['all', 'graded', 'ungraded'] as const).map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`h-9 px-2.5 sm:px-3 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer flex items-center justify-center ${
                statusFilter === f
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Student Cards Stream */}
      <div className="space-y-2.5">
        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs text-zinc-400">
            No students found matching your criteria.
          </div>
        ) : (
          filteredStudents.map((student, idx) => {
            const metrics = studentMetrics.get(student.id);
            const isGraded = metrics?.hasAnyGrade;

            return (
              <div
                key={student.id}
                onClick={() => setActiveStudentIndex(idx)}
                className="p-3.5 bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 hover:border-[#3B82F6]/50 active:bg-zinc-100 dark:active:bg-zinc-800/80 rounded-2xl shadow-2xs transition-colors cursor-pointer flex items-center justify-between gap-3 touch-pan-y"
              >
                {/* Student Avatar + Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    isGraded
                      ? 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                  }`}>
                    {student.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {student.full_name}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      {student.studentId || student.id.slice(0, 8)} · {student.section || 'General'}
                    </div>
                  </div>
                </div>

                {/* Score & Navigation Right Side */}
                <div className="flex items-center gap-2.5 shrink-0">
                  {isGraded ? (
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-[#3B82F6]">
                        {metrics.scaledFinal.toFixed(2)} <span className="text-[10px] text-zinc-400">/ 9.0</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-medium">
                        Grade {metrics.numericGrade.gradeNumber}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                      Not Graded
                    </span>
                  )}

                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Mobile Grading Drawer */}
      <MobileGradingDrawer
        isOpen={activeStudentIndex !== null}
        onClose={() => setActiveStudentIndex(null)}
        student={activeStudent}
        assignment={currentAssignment}
        onNextStudent={() => {
          if (activeStudentIndex !== null && activeStudentIndex < filteredStudents.length - 1) {
            setActiveStudentIndex(activeStudentIndex + 1);
          }
        }}
        onPrevStudent={() => {
          if (activeStudentIndex !== null && activeStudentIndex > 0) {
            setActiveStudentIndex(activeStudentIndex - 1);
          }
        }}
        hasNextStudent={activeStudentIndex !== null && activeStudentIndex < filteredStudents.length - 1}
        hasPrevStudent={activeStudentIndex !== null && activeStudentIndex > 0}
        currentIndex={activeStudentIndex ?? 0}
        totalStudents={filteredStudents.length}
      />
    </div>
  );
};
