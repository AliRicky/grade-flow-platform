import React, { useState } from 'react';
import { 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Shield, 
  BookOpen, 
  MessageSquare,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';

export const TaDelegationPanel: React.FC = () => {
  const { users } = useAuth();
  const { assignments, grades, regrades, resolveRegrade } = useCourse();

  const [activeTab, setActiveTab] = useState<'team' | 'appeals'>('team');
  const [appealFilter, setAppealFilter] = useState<'all' | 'pending' | 'resolved' | 'rejected'>('all');
  const [selectedRegradeId, setSelectedRegradeId] = useState<string | null>(null);
  const [taResponseNote, setTaResponseNote] = useState('');
  const [adjustedScoreInput, setAdjustedScoreInput] = useState<string>('');
  const [appealError, setAppealError] = useState<string | null>(null);

  // Teaching staff users (admins or TAs)
  const staffUsers = users.filter(u => u.role === 'admin' || (u.role as string) === 'ta');

  // Compute grading statistics per staff member
  const staffStats = staffUsers.map(staff => {
    let totalGradedParts = 0;
    const staffNameLower = (staff.full_name || (staff as any).name || '').trim().toLowerCase();

    Object.values(grades).forEach(gradeEntry => {
      const gradedByLower = (gradeEntry.gradedBy || '').trim().toLowerCase();
      if (gradedByLower && (gradedByLower === staffNameLower || gradedByLower.includes(staffNameLower) || staffNameLower.includes(gradedByLower))) {
        const count = Object.values(gradeEntry.scores || {}).filter(v => v !== null && v !== undefined).length;
        totalGradedParts += count;
      }
    });

    const assignedCount = assignments.filter(a => Array.isArray(a.assignedTAs) && a.assignedTAs.includes(staff.id)).length;

    return {
      staff,
      displayName: staff.full_name || (staff as any).name || 'TA Staff',
      totalGradedParts,
      assignedCount,
    };
  });

  const pendingCount = regrades.filter(r => r.status === 'pending').length;

  const filteredRegrades = regrades.filter(r => {
    if (appealFilter === 'all') return true;
    return r.status === appealFilter;
  });

  const selectedRegrade = regrades.find(r => r.id === selectedRegradeId) || null;
  const isReadOnly = !!selectedRegrade && selectedRegrade.status !== 'pending';

  const handleOpenAppeal = (regradeId: string) => {
    const regrade = regrades.find(r => r.id === regradeId);
    if (regrade) {
      setAppealError(null);
      setSelectedRegradeId(regradeId);
      setTaResponseNote(regrade.taResponse || '');
      setAdjustedScoreInput(regrade.currentScore.toString());
    }
  };

  const handleResolveAppeal = (status: 'resolved' | 'rejected') => {
    if (!selectedRegrade || isReadOnly) return;
    let scoreVal: number | undefined;

    if (status === 'resolved') {
      if (!adjustedScoreInput.trim()) {
        setAppealError('Please provide an adjusted score, or maintain the original score.');
        return;
      }
      scoreVal = parseFloat(adjustedScoreInput);
      if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > selectedRegrade.maxScore) {
        setAppealError(`Adjusted score must be between 0 and ${selectedRegrade.maxScore} points.`);
        return;
      }
    }

    setAppealError(null);
    resolveRegrade(
      selectedRegrade.id, 
      status, 
      taResponseNote.trim() || (status === 'resolved' ? 'Score adjusted upon rubric re-evaluation' : 'Original rubric evaluation maintained'), 
      scoreVal
    );

    setSelectedRegradeId(null);
    setTaResponseNote('');
    setAdjustedScoreInput('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-150">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3B82F6] mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Course Staff Portal</span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span className="font-mono text-zinc-400">Coordination & Arbitration</span>
          </div>
          <h1 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-100">
            Teaching Assistant Coordination & Regrade Appeals
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
            Monitor TA grading throughput, track assessment responsibility assignments, and adjudicate formal student regrade appeals.
          </p>
        </div>

        {/* Navigation Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'team'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Staff Roster ({staffUsers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('appeals')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'appeals'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Regrade Appeals</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-amber-500 text-white rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'team' ? (
        <div className="space-y-6">
          {/* Staff Workload Cards Grid */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-xs font-bold font-display uppercase tracking-wider text-zinc-500">
                Instructional Staff Throughput
              </h2>
              <span className="text-xs font-mono text-zinc-400">
                {staffUsers.length} active TA{staffUsers.length === 1 ? '' : 's'} / Admins
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffStats.length === 0 ? (
                <div className="col-span-full p-8 text-center text-xs text-zinc-400 bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                  No instructional staff profiles found.
                </div>
              ) : (
                staffStats.map(({ staff, displayName, totalGradedParts, assignedCount }) => (
                  <div
                    key={staff.id}
                    className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 flex items-center justify-center font-bold text-[#3B82F6] text-sm shrink-0">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {displayName}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                          <span className="capitalize">{staff.role}</span>
                          {staff.studentId && <span>· ID: {staff.studentId}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-4 bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-0.5 text-[11px]">
                        Role Assignment / Section:
                      </span>
                      <span className="line-clamp-1">{staff.section || 'General TA & Grading Staff'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs border-t border-zinc-100 dark:border-zinc-800/80 pt-3">
                      <div>
                        <span className="text-zinc-400 block text-[10px] font-semibold uppercase tracking-wider">
                          Graded Answers
                        </span>
                        <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-lg">
                          {totalGradedParts}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[10px] font-semibold uppercase tracking-wider">
                          Assigned Sets
                        </span>
                        <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-lg">
                          {assignedCount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Assessment Delegation Hierarchy Table */}
          <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-display">
                  Assessment Delegation & Rubric Scope
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Overview of course deliverables, question subparts, and assigned graders.
                </p>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                {assignments.length} Total Assessments
              </span>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {assignments.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-400">
                  No assessments configured yet.
                </div>
              ) : (
                assignments.map(asg => {
                  const questionsList = Array.isArray(asg.questions) ? asg.questions : [];
                  const subQuestionsCount = questionsList.reduce((acc, q) => acc + (Array.isArray(q.subQuestions) ? q.subQuestions.length : 0), 0);

                  return (
                    <div key={asg.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 text-xs font-bold font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg">
                            {asg.shortCode}
                          </span>
                          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                            {asg.title}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full capitalize ${
                            asg.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : asg.status === 'grading'
                              ? 'bg-[#3B82F6]/10 text-[#3B82F6]'
                              : asg.status === 'closed'
                              ? 'bg-zinc-500/10 text-zinc-400'
                              : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {asg.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400 font-mono mt-1">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {questionsList.length} problems ({subQuestionsCount} parts)
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            {asg.totalMaxScore} pts ({asg.weightPercent}% weight)
                          </span>
                          {asg.dueDate && (
                            <>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Due {new Date(asg.dueDate).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                          Grading Staff:
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {staffUsers.length === 0 ? (
                            <span className="text-xs text-zinc-400">None</span>
                          ) : (
                            staffUsers.map(staff => {
                              const isAssigned = Array.isArray(asg.assignedTAs) && asg.assignedTAs.includes(staff.id);
                              const firstName = (staff.full_name || (staff as any).name || 'TA').split(' ')[0];

                              return (
                                <span
                                  key={staff.id}
                                  className={`px-2.5 py-1 text-xs rounded-xl font-medium border transition-colors ${
                                    isAssigned
                                      ? 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30 font-semibold'
                                      : 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 border-zinc-200 dark:border-zinc-800'
                                  }`}
                                  title={`${staff.full_name || (staff as any).name || 'TA'} (${isAssigned ? 'Assigned' : 'Available'})`}
                                >
                                  {firstName}
                                </span>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Regrade Appeals & Score Adjustment Tickets */
        <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-display">
                Student Regrade Appeals & Arbitration Queue
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Review student dispute submissions, examine reasons, and record official TA adjustments.
              </p>
            </div>

            {/* Appeal Status Filters */}
            <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/50 self-start sm:self-auto text-xs">
              {(['all', 'pending', 'resolved', 'rejected'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setAppealFilter(tab)}
                  className={`px-3 py-1.5 rounded-xl capitalize font-semibold transition-all cursor-pointer ${
                    appealFilter === tab
                      ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {tab}
                  {tab === 'pending' && pendingCount > 0 && ` (${pendingCount})`}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {filteredRegrades.length === 0 ? (
              <div className="p-12 text-center text-xs text-zinc-400">
                No {appealFilter === 'all' ? '' : appealFilter} regrade appeals found.
              </div>
            ) : (
              filteredRegrades.map(r => (
                <div key={r.id} className="p-5 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                          {r.studentName}
                        </span>
                        <span className="text-xs text-zinc-400">·</span>
                        <span className="text-xs text-[#3B82F6] font-semibold">
                          {r.assignmentTitle} [Question {r.questionLabel}]
                        </span>
                        <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full capitalize flex items-center gap-1 ${
                          r.status === 'resolved'
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : r.status === 'rejected'
                            ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                          {r.status === 'resolved' && <CheckCircle2 className="w-3 h-3" />}
                          {r.status === 'rejected' && <XCircle className="w-3 h-3" />}
                          {r.status === 'pending' && <Clock className="w-3 h-3" />}
                          <span>{r.status}</span>
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono mt-1">
                        Current Score: <span className="text-zinc-900 dark:text-zinc-200 font-semibold">{r.currentScore}</span> / {r.maxScore} pts · Submitted {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenAppeal(r.id)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer self-start ${
                        r.status === 'pending'
                          ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-xs'
                          : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      {r.status === 'pending' ? 'Review & Adjudicate' : 'View TA Decision'}
                    </button>
                  </div>

                  {/* Student Reason */}
                  <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl text-xs text-zinc-700 dark:text-zinc-300 mb-2 border border-zinc-100 dark:border-zinc-800">
                    <span className="font-semibold block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                      Student Reason:
                    </span>
                    <p className="italic leading-relaxed">"{r.reason}"</p>
                  </div>

                  {/* TA Response if present */}
                  {r.taResponse && (
                    <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl text-xs text-emerald-900 dark:text-emerald-200 border border-emerald-100 dark:border-emerald-900/40">
                      <span className="font-semibold block text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
                        Official TA Response & Action:
                      </span>
                      <p className="leading-relaxed">{r.taResponse}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Regrade Arbitration Modal */}
      {selectedRegradeId && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onMouseDown={e => { if (e.target === e.currentTarget) setSelectedRegradeId(null); }}
          role="dialog"
          aria-modal="true"
          aria-label="Resolve regrade appeal"
        >
          <div className="w-full max-w-lg bg-white dark:bg-[#09090B] rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-display">
                  {isReadOnly ? 'Arbitrated Regrade Decision' : 'Adjudicate Regrade Appeal'}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {selectedRegrade?.studentName} · {selectedRegrade?.assignmentTitle} [Q{selectedRegrade?.questionLabel}]
                </p>
              </div>
              <button
                onClick={() => setSelectedRegradeId(null)}
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Context Box */}
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-xs space-y-1.5">
              <div className="flex justify-between text-zinc-500">
                <span>Recorded Score:</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedRegrade?.currentScore} / {selectedRegrade?.maxScore} pts
                </span>
              </div>
              <div className="pt-1.5 border-t border-zinc-200/50 dark:border-zinc-800">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block mb-0.5">
                  Student Argument:
                </span>
                <p className="italic text-zinc-700 dark:text-zinc-300">
                  "{selectedRegrade?.reason}"
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Adjusted Score {selectedRegrade ? `(0 – ${selectedRegrade.maxScore} pts)` : ''}
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max={selectedRegrade?.maxScore}
                disabled={isReadOnly}
                value={adjustedScoreInput}
                onChange={e => setAdjustedScoreInput(e.target.value)}
                className="w-36 px-3.5 py-2 text-xs font-mono rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Official TA Feedback to Student
              </label>
              <textarea
                rows={4}
                value={taResponseNote}
                disabled={isReadOnly}
                onChange={e => setTaResponseNote(e.target.value)}
                placeholder="Explain the scoring rubric decision or document score correction..."
                className="w-full p-3 text-xs rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 disabled:opacity-60 resize-none"
              />
            </div>

            {appealError && (
              <div role="alert" className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{appealError}</span>
              </div>
            )}

            {isReadOnly ? (
              <div className="flex justify-end pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => setSelectedRegradeId(null)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => handleResolveAppeal('rejected')}
                  className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                >
                  Maintain Score (Reject)
                </button>
                <button
                  type="button"
                  onClick={() => handleResolveAppeal('resolved')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Approve & Update Score
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
