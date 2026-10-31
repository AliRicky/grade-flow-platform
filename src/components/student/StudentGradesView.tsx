import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';
import { Assignment } from '../../types';
import { calculateNumericGrade, DEFAULT_GRADING_SCALE } from '../../utils/grading';

interface StudentGradesViewProps {
  onRequestRegrade: (assignment: Assignment, questionLabel: string, currentScore: number, maxScore: number) => void;
}

export const StudentGradesView: React.FC<StudentGradesViewProps> = ({ onRequestRegrade }) => {
  const { currentUser } = useAuth();
  const { assignments: allAssignments, grades, gradingScale: rawScale } = useCourse();
  const gradingScale = rawScale || DEFAULT_GRADING_SCALE;

  // Students never see drafts
  const assignments = React.useMemo(() => allAssignments.filter(a => a.status !== 'draft'), [allAssignments]);

  // Expanded assignment cards (first one open by default)
  const [expandedAsgIds, setExpandedAsgIds] = useState<string[]>(() => (assignments[0] ? [assignments[0].id] : []));
  const [typeFilter, setTypeFilter] = useState<'all' | 'homework' | 'quiz'>('all');

  const studentId = currentUser?.id ?? '';

  const toggleExpand = (id: string) => {
    setExpandedAsgIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredAssignments = assignments.filter(a => {
    if (typeFilter === 'all') return true;
    return a.type === typeFilter;
  });

  const { cumulativePercentage, numericGrade, totalWeightEvaluated } = React.useMemo(() => {
    let totalWeightedEarned = 0;
    let totalWeightEvaluated = 0;

    assignments.forEach(asg => {
      const studentGrade = grades[`${studentId}_${asg.id}`];
      if (studentGrade && Object.keys(studentGrade.scores || {}).length > 0) {
        let earned = 0;
        let bonus = 0;

        const questions = Array.isArray(asg.questions) ? asg.questions : [];
        questions.forEach(q => {
          const sqs = Array.isArray(q.subQuestions) ? q.subQuestions : [];
          if (sqs.length > 0) {
            sqs.forEach(sq => {
              const val = studentGrade.scores[`${q.id}_${sq.id}`];
              if (val !== undefined && val !== null) {
                if (q.isBonus) bonus += val;
                else earned += val;
              }
            });
          } else {
            const val = studentGrade.scores[q.id];
            if (val !== undefined && val !== null) {
              if (q.isBonus) bonus += val;
              else earned += val;
            }
          }
        });

        const totalRaw = earned + bonus;
        const pct = asg.totalMaxScore > 0 ? (totalRaw / asg.totalMaxScore) : 0;
        totalWeightedEarned += pct * asg.weightPercent;
        totalWeightEvaluated += asg.weightPercent;
      }
    });

    const cumulativePercentage = totalWeightEvaluated > 0
      ? (totalWeightedEarned / totalWeightEvaluated) * 100
      : 0;

    const numericGrade = calculateNumericGrade(cumulativePercentage, gradingScale);

    return { cumulativePercentage, numericGrade, totalWeightEvaluated };
  }, [assignments, grades, studentId, gradingScale]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Student Overview Header (Bionis themed) */}
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay dark:mix-blend-normal" style={{ backgroundImage: "url('/assets/haikei-wave.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3B82F6] mb-1 sm:mb-2">
            <Award className="w-4 h-4" />
            <span>Academic Performance · {gradingScale.label || `${gradingScale.max_score}-Point Scale`}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-zinc-100">
            {currentUser?.full_name || 'Student Grade Portal'}
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-zinc-500 font-mono mt-1">
            <span>ID: {currentUser?.studentId || '—'}</span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span>Sec: {currentUser?.section || '—'}</span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span>Scale: 0 – {gradingScale.max_score}</span>
          </div>
        </div>

        {/* Grade summary pill cards */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 sm:gap-4 relative z-10">
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-center sm:min-w-[110px]">
            <span className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">Weighted Score</span>
            <span className="text-base sm:text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {totalWeightEvaluated > 0 ? `${cumulativePercentage.toFixed(1)}%` : '—'}
            </span>
          </div>

          <div className="bg-[#3B82F6]/10 border border-[#3B82F6]/30 rounded-xl p-3 text-center sm:min-w-[130px]">
            <span className="text-[10px] sm:text-[11px] text-[#3B82F6] block font-medium">Numeric Grade</span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-xl sm:text-2xl font-black font-mono text-[#3B82F6]">
                {totalWeightEvaluated > 0 ? (gradingScale.max_score === 9 ? numericGrade.gradeNumber : numericGrade.scaledValue.toFixed(gradingScale.precision ?? 1)) : '—'}
              </span>
              <span className="text-xs text-zinc-400 font-mono">/ {gradingScale.max_score}</span>
            </div>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5 font-medium truncate">
              {totalWeightEvaluated > 0 ? numericGrade.label : 'Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar touch-pan-x overscroll-contain">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              typeFilter === 'all'
                ? 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-[#3B82F6]'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
            }`}
          >
            All ({assignments.length})
          </button>
          <button
            onClick={() => setTypeFilter('homework')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              typeFilter === 'homework'
                ? 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-[#3B82F6]'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
            }`}
          >
            HW ({assignments.filter(a => a.type === 'homework').length})
          </button>
          <button
            onClick={() => setTypeFilter('quiz')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              typeFilter === 'quiz'
                ? 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-[#3B82F6]'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
            }`}
          >
            Quizzes ({assignments.filter(a => a.type === 'quiz').length})
          </button>
        </div>

        <button
          onClick={() => {
            if (filteredAssignments.length > 0 && filteredAssignments.every(a => expandedAsgIds.includes(a.id))) {
              setExpandedAsgIds([]);
            } else {
              setExpandedAsgIds(filteredAssignments.map(a => a.id));
            }
          }}
          className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer"
        >
          {filteredAssignments.length > 0 && filteredAssignments.every(a => expandedAsgIds.includes(a.id)) ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 && (
          <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 text-center text-sm text-zinc-500">
            No assessments have been published yet.
          </div>
        )}
        {filteredAssignments.map(asg => {
          const studentGrade = grades[`${studentId}_${asg.id}`];
          const isExpanded = expandedAsgIds.includes(asg.id);

          // Calculate assignment total scores
          let totalEarned = 0;
          let bonusEarned = 0;
          let answeredCount = 0;

          const questions = Array.isArray(asg.questions) ? asg.questions : [];
          questions.forEach(q => {
            const sqs = Array.isArray(q.subQuestions) ? q.subQuestions : [];
            if (sqs.length > 0) {
              sqs.forEach(sq => {
                const val = studentGrade?.scores?.[`${q.id}_${sq.id}`];
                if (val !== undefined && val !== null) {
                  answeredCount++;
                  if (q.isBonus) bonusEarned += val;
                  else totalEarned += val;
                }
              });
            } else {
              const val = studentGrade?.scores?.[q.id];
              if (val !== undefined && val !== null) {
                answeredCount++;
                if (q.isBonus) bonusEarned += val;
                else totalEarned += val;
              }
            }
          });

          const totalRaw = totalEarned + bonusEarned;
          const scaledScore = asg.totalMaxScore > 0
            ? Math.min(gradingScale.max_score, Math.round(((totalRaw / asg.totalMaxScore) * gradingScale.max_score) * 100) / 100)
            : Math.min(gradingScale.max_score, totalRaw);
          
          const asgPercentage = asg.totalMaxScore > 0 ? (totalRaw / asg.totalMaxScore) * 100 : 0;
          const asgNumericGrade = calculateNumericGrade(asgPercentage, gradingScale);

          const isGraded = studentGrade && answeredCount > 0;

          return (
            <div
              key={asg.id}
              className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden transition-all"
            >
              {/* Card Header */}
              <div
                onClick={() => toggleExpand(asg.id)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleExpand(asg.id); } }}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 min-h-[88px] cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-transform ${
                    asg.type === 'homework'
                      ? 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20'
                      : 'bg-sky-500/10 text-sky-500 border border-sky-500/20'
                  }`}>
                    {asg.type === 'homework' ? <FileText className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {asg.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mt-0.5">
                      <span className="capitalize">{asg.type}</span>
                      <span>·</span>
                      <span className="font-mono">Weight: {asg.weightPercent}%</span>
                      <span>·</span>
                      <span>Due: {new Date(asg.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                {/* Score & Numeric Grade Pill */}
                <div className="flex items-center gap-4 self-end md:self-center">
                  {isGraded ? (
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <div className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">
                          {scaledScore.toFixed(2)} <span className="text-xs text-zinc-400">/ {gradingScale.max_score.toFixed(gradingScale.precision ?? 1)}</span>
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono">
                          Raw: {totalRaw.toFixed(1)} / {asg.totalMaxScore} pts
                          {bonusEarned > 0 && <span className="text-[#3B82F6] font-medium"> (+{bonusEarned} bonus)</span>}
                        </div>
                      </div>

                      <div className="px-2.5 py-1 rounded bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-center font-mono">
                        <span className="text-[10px] text-zinc-400 block uppercase font-medium">
                          {gradingScale.max_score === 9 ? 'Scale 9' : `Scale ${gradingScale.max_score}`}
                        </span>
                        <span className="text-xs font-bold text-[#3B82F6]">
                          {gradingScale.max_score === 9 ? `Grade ${asgNumericGrade.gradeNumber}` : asgNumericGrade.displayGrade}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-400 font-mono italic">
                      {asg.status === 'closed' ? 'Pending TA Evaluation' : 'Not yet graded'}
                    </span>
                  )}

                  <div className="p-1 rounded-lg text-zinc-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Detailed Breakdown */}
              {isExpanded && (
                <div className="border-t border-zinc-100 dark:border-zinc-800 p-5 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-4">
                  
                  {studentGrade?.feedback && (
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-zinc-200">
                      <span className="font-semibold block text-[11px] text-[#3B82F6] mb-0.5">
                        TA General Feedback (Graded by {studentGrade.gradedBy || 'TA Staff'}):
                      </span>
                      <p>{studentGrade.feedback}</p>
                    </div>
                  )}

                  {/* Subquestion Score List & Table */}
                  <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs">
                    {/* Mobile Card-Based Problem List */}
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 md:hidden">
                      {(Array.isArray(asg.questions) ? asg.questions : []).map(q => {
                        const sqs = Array.isArray(q.subQuestions) ? q.subQuestions : [];
                        if (sqs.length > 0) {
                          return sqs.map(sq => {
                            const scoreVal = studentGrade?.scores?.[`${q.id}_${sq.id}`];
                            return (
                              <div key={`${q.id}_${sq.id}`} className="p-3.5 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                                      {sq.label || `${q.number}-${sq.id}`}
                                    </span>
                                    <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-1">
                                      {sq.title}
                                    </h4>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <div className="font-mono font-bold text-xs">
                                      {scoreVal !== undefined && scoreVal !== null ? (
                                        <span className={scoreVal === sq.maxScore ? 'text-[#3B82F6]' : 'text-zinc-900 dark:text-zinc-100'}>
                                          {scoreVal} <span className="text-[10px] text-zinc-400 font-normal">/ {sq.maxScore}p</span>
                                        </span>
                                      ) : (
                                        <span className="text-zinc-400 font-normal">— / {sq.maxScore}p</span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-zinc-400 block">Max: {sq.maxScore} pts</span>
                                  </div>
                                </div>

                                {scoreVal !== undefined && scoreVal !== null && (
                                  <div className="pt-1 flex justify-end">
                                    <button
                                      onClick={() => onRequestRegrade(asg, sq.label, scoreVal, sq.maxScore)}
                                      className="h-9 px-3 text-xs font-semibold text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-[#3B82F6]/20"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                      <span>Request Appeal</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          });
                        } else {
                          const scoreVal = studentGrade?.scores?.[q.id];
                          return (
                            <div key={q.id} className="p-3.5 space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                                    Problem {q.number} {q.isBonus && <span className="text-[#3B82F6] text-[10px] font-semibold">(Bonus)</span>}
                                  </span>
                                  <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-1">
                                    {q.title}
                                  </h4>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="font-mono font-bold text-xs">
                                    {scoreVal !== undefined && scoreVal !== null ? (
                                      <span className={scoreVal === q.directMaxScore ? 'text-[#3B82F6]' : 'text-zinc-900 dark:text-zinc-100'}>
                                        {scoreVal} <span className="text-[10px] text-zinc-400 font-normal">/ {q.directMaxScore || 0}p</span>
                                      </span>
                                    ) : (
                                      <span className="text-zinc-400 font-normal">— / {q.directMaxScore || 0}p</span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-zinc-400 block">Max: {q.directMaxScore || 0} pts</span>
                                </div>
                              </div>

                              {scoreVal !== undefined && scoreVal !== null && (
                                <div className="pt-1 flex justify-end">
                                  <button
                                    onClick={() => onRequestRegrade(asg, `${q.number}`, scoreVal, q.directMaxScore || 0)}
                                    className="h-9 px-3 text-xs font-semibold text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-[#3B82F6]/20"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>Request Appeal</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        }
                      })}
                    </div>

                    {/* Desktop Subquestion Score Table */}
                    <table className="w-full text-left text-xs hidden md:table">
                      <thead className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold border-b border-zinc-200 dark:border-zinc-700">
                        <tr>
                          <th className="py-2.5 px-4">Problem / Sub-Part</th>
                          <th className="py-2.5 px-3">Description</th>
                          <th className="py-2.5 px-3 text-center">Max Score</th>
                          <th className="py-2.5 px-3 text-center font-mono">Your Score</th>
                          <th className="py-2.5 px-4 text-right">Appeal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {(Array.isArray(asg.questions) ? asg.questions : []).map(q => {
                          const sqs = Array.isArray(q.subQuestions) ? q.subQuestions : [];
                          if (sqs.length > 0) {
                            return sqs.map(sq => {
                              const scoreVal = studentGrade?.scores?.[`${q.id}_${sq.id}`];
                              return (
                                <tr key={`${q.id}_${sq.id}`} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40">
                                  <td className="py-2.5 px-4 font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                                    {sq.label || `${q.number}-${sq.id}`}
                                  </td>
                                  <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-300">
                                    {sq.title}
                                  </td>
                                  <td className="py-2.5 px-3 text-center font-mono text-zinc-500">
                                    {sq.maxScore} pts
                                  </td>
                                  <td className="py-2.5 px-3 text-center font-mono font-bold">
                                    {scoreVal !== undefined && scoreVal !== null ? (
                                      <span className={scoreVal === sq.maxScore ? 'text-[#3B82F6]' : 'text-zinc-900 dark:text-zinc-100'}>
                                        {scoreVal}
                                      </span>
                                    ) : (
                                      <span className="text-zinc-400 font-normal">—</span>
                                    )}
                                  </td>
                                  <td className="py-2.5 px-4 text-right">
                                    {scoreVal !== undefined && scoreVal !== null && (
                                      <button
                                        onClick={() => onRequestRegrade(asg, sq.label, scoreVal, sq.maxScore)}
                                        className="text-[11px] text-[#3B82F6] hover:underline cursor-pointer font-medium"
                                      >
                                        Appeal
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            });
                          } else {
                            const scoreVal = studentGrade?.scores?.[q.id];
                            return (
                              <tr key={q.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40">
                                <td className="py-2.5 px-4 font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                                  Problem {q.number} {q.isBonus && <span className="text-[#3B82F6] text-[10px] font-semibold">(Bonus)</span>}
                                </td>
                                <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-300">
                                  {q.title}
                                </td>
                                <td className="py-2.5 px-3 text-center font-mono text-zinc-500">
                                  {q.directMaxScore || 0} pts
                                </td>
                                <td className="py-2.5 px-3 text-center font-mono font-bold">
                                  {scoreVal !== undefined && scoreVal !== null ? (
                                    <span className={scoreVal === q.directMaxScore ? 'text-[#3B82F6]' : 'text-zinc-900 dark:text-zinc-100'}>
                                      {scoreVal}
                                    </span>
                                  ) : (
                                    <span className="text-zinc-400 font-normal">—</span>
                                  )}
                                </td>
                                <td className="py-2.5 px-4 text-right">
                                  {scoreVal !== undefined && scoreVal !== null && (
                                    <button
                                      onClick={() => onRequestRegrade(asg, `${q.number}`, scoreVal, q.directMaxScore || 0)}
                                      className="text-[11px] text-[#3B82F6] hover:underline cursor-pointer font-medium"
                                    >
                                      Appeal
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          }
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
