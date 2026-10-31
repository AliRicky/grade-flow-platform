import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  AlertTriangle,
  Calendar,
  Layers,
  BarChart3,
  Download,
  FileSpreadsheet,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';
import { AnalyticsDashboard } from './AnalyticsDashboard';

interface DashboardOverviewProps {
  onNavigate: (view: string, asgId?: string) => void;
  onOpenOverdueModal: (asgId?: string) => void;
  onOpenExportHub?: (asgId?: string) => void;
  onOpenGoogleSheetsModal?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigate,
  onOpenOverdueModal,
  onOpenExportHub,
  onOpenGoogleSheetsModal,
}) => {
  const { users, currentUser } = useAuth();
  const { assignments, grades, regrades } = useCourse();

  const students = users.filter(u => u.role === 'student');
  const activeAssignments = assignments.filter(a => a.status === 'active' || a.status === 'grading');
  const pendingRegrades = regrades.filter(r => r.status === 'pending');
  const hwCount = assignments.filter(a => a.type === 'homework').length;
  const quizCount = assignments.filter(a => a.type === 'quiz').length;

  // Grading progress: filled score cells / expected score cells for assessments that have opened
  const gradingProgress = React.useMemo(() => {
    let expected = 0;
    let filled = 0;
    assignments
      .filter(a => a.status === 'grading' || a.status === 'closed')
      .forEach(asg => {
        const keys = (Array.isArray(asg.questions) ? asg.questions : []).flatMap(q =>
          q.subQuestions && q.subQuestions.length > 0 ? q.subQuestions.map(sq => `${q.id}_${sq.id}`) : [q.id]
        );
        students.forEach(stu => {
          const g = grades[`${stu.id}_${asg.id}`];
          keys.forEach(k => {
            expected++;
            const v = g?.scores?.[k];
            if (v !== undefined && v !== null) filled++;
          });
        });
      });
    return expected > 0 ? Math.round((filled / expected) * 100) : 0;
  }, [assignments, students, grades]);

  // Pending appeals first, most recent first
  const queue = [...regrades]
    .sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (b.status === 'pending' && a.status !== 'pending') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 3);

  // Next upcoming deadline
  const upcomingSorted = [...assignments]
    .filter(a => new Date(a.dueDate).getTime() > Date.now())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const nextUpcoming = upcomingSorted[0];

  const calculateDaysLeft = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Past Due';
    if (days === 0) return 'Due Today';
    if (days === 1) return 'Due Tomorrow';
    return `Due in ${days} days`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Welcome Banner (Bionis Style) */}
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-5 sm:gap-6 transition-all duration-150 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay dark:mix-blend-normal" style={{ backgroundImage: "url('/assets/haikei-wave.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3B82F6] mb-2">
            <span>Course Dashboard</span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span className="font-mono text-zinc-400">Scale: Max 9.0</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-zinc-100 tracking-tight">
            Welcome back, {currentUser?.full_name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {hwCount === 0 && quizCount === 0 ? (
              'No assignments created yet. All final scores will be scaled out of 9.0.'
            ) : (
              `Managing ${hwCount} homework assignment${hwCount === 1 ? '' : 's'} and ${quizCount} quiz${quizCount === 1 ? '' : 'zes'}. All final scores are scaled out of 9.0.`
            )}
          </p>
        </div>

        {/* Action Button Strip with Clear Visual Hierarchy */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 relative z-10 shrink-0 w-full xl:w-auto">
          {onOpenGoogleSheetsModal && (
            <button
              onClick={onOpenGoogleSheetsModal}
              className="h-11 sm:h-10 inline-flex items-center justify-center gap-2 px-3 sm:px-3.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xs transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
              title="Manage Supabase Database Sync & Tables"
            >
              <Database className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Supabase DB</span>
            </button>
          )}

          {onOpenExportHub && (
            <button
              onClick={() => onOpenExportHub()}
              className="h-11 sm:h-10 inline-flex items-center justify-center gap-2 px-3 sm:px-3.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xs transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
              title="Download Master Gradebook or Assignment Reports as PDF or CSV"
            >
              <Download className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
              <span>Export</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('builder')}
            className="h-11 sm:h-10 inline-flex items-center justify-center gap-2 px-3 sm:px-3.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xs transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
            title="Create and configure course assignments"
          >
            <Layers className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
            <span>Assignments</span>
          </button>

          <button
            onClick={() => onNavigate('gradebook')}
            className="h-11 sm:h-10 inline-flex items-center justify-center gap-2 px-3 sm:px-4 text-xs font-semibold text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
            title="Open Master Gradebook Matrix"
          >
            <span>Gradebook</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>

        {/* KPI cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4"
      >
        {[
          { label: 'Students', value: students.length, hint: 'enrolled', icon: Users, onClick: undefined as (() => void) | undefined },
          { label: 'Open assessments', value: activeAssignments.length, hint: 'active or grading', icon: FileText, onClick: () => onNavigate('builder') },
          { label: 'Grading progress', value: `${gradingProgress}%`, hint: 'scores entered', icon: CheckCircle2, onClick: () => onNavigate('gradebook') },
          { label: 'Pending appeals', value: pendingRegrades.length, hint: pendingRegrades.length ? 'need a response' : 'all clear', icon: AlertTriangle, onClick: () => onNavigate('delegation') },
        ].map(card => {
          const Icon = card.icon;
          const Tag = card.onClick ? motion.button : motion.div;
          return (
            <Tag
              key={card.label}
              variants={itemVariants}
              {...(card.onClick ? { onClick: card.onClick } : {})}
              className={`group relative text-left bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm transition-all duration-200 overflow-hidden ${
                card.onClick ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 active:scale-[0.98]' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Icon className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                </div>
                {card.onClick && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-200">
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                  </div>
                )}
              </div>
              <div className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-zinc-100">{card.value}</div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mt-0.5 sm:mt-1 truncate">{card.label}</div>
              <div className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 line-clamp-1">{card.hint}</div>
            </Tag>
          );
        })}
      </motion.div>

      {/* Recharts Analytics Visualization Dashboard */}
      <AnalyticsDashboard />

            {/* Middle Row: Next Deadline & Regrade Queue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Next Deadline Spotlight */}
          {nextUpcoming && (
            <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm transition-all duration-150">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 uppercase tracking-wider mb-2">
                <Clock className="w-4 h-4" />
                <span>Next Approaching Deadline</span>
              </div>
              <h3 className="text-sm font-bold font-display text-zinc-900 dark:text-zinc-100">
                {nextUpcoming.shortCode}: {nextUpcoming.title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {calculateDaysLeft(nextUpcoming.dueDate)} · {new Date(nextUpcoming.dueDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
              {nextUpcoming.examLocation && (
                <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/80 p-2 rounded border border-zinc-200 dark:border-zinc-700">
                  Location: <strong>{nextUpcoming.examLocation}</strong>
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-mono">Weight: {nextUpcoming.weightPercent}%</span>
                <button
                  onClick={() => onOpenOverdueModal(nextUpcoming.id)}
                  className="text-xs font-semibold text-[#3B82F6] hover:underline transition-colors duration-150 cursor-pointer"
                >
                  Send Student Alert →
                </button>
              </div>
            </div>
          )}

          
        {/* Pending Regrades Appeal Box */}
          <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm transition-all duration-150">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-zinc-500">
                Regrade Appeals Queue
              </h3>
              <span className="text-xs font-mono text-[#3B82F6]">
                {pendingRegrades.length} pending
              </span>
            </div>

            <div className="space-y-2">
              {queue.length === 0 && (
                <p className="text-xs text-zinc-400 text-center py-4">No appeals yet.</p>
              )}
              {queue.map(r => (
                <div
                  key={r.id}
                  className="p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-xs transition-colors duration-150"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {r.studentName}
                    </span>
                    <span className={`text-[10px] font-mono capitalize ${
                      r.status === 'pending' ? 'text-amber-500' : 'text-[#3B82F6]'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="text-zinc-500 text-[11px] mb-1">
                    {r.assignmentTitle} · Question <strong>{r.questionLabel}</strong> ({r.currentScore}/{r.maxScore}p)
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-300 italic text-[11px] line-clamp-2">
                    "{r.reason}"
                  </p>
                </div>
              ))}
            </div>

          </div>
        
      </div>

      {/* Bottom Row: Full-width Assessments Table & Mobile Cards */}
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden transition-all duration-150">
        <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold font-display text-zinc-900 dark:text-zinc-100">
              Course Assessments
            </h2>
            <span className="text-xs text-zinc-500">
              Real-time grading status and deadline synchronization
            </span>
          </div>
          <button
            onClick={() => onOpenOverdueModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-950/60 rounded-lg transition-all duration-150 cursor-pointer border border-amber-200 dark:border-amber-800/60 shrink-0"
          >
            <Send className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Send Overdue Reminders</span>
            <span className="sm:hidden">Reminders</span>
          </button>
        </div>

        {/* Mobile View: High-Touch Compact Assessment Cards */}
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 md:hidden">
          {assignments.map(asg => {
            const subQuestionsCount = (Array.isArray(asg.questions) ? asg.questions : []).reduce(
              (sum, q) => sum + (q.subQuestions?.length || 1),
              0
            );

            return (
              <div key={asg.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                        {asg.shortCode}
                      </span>
                      <span className="text-[11px] capitalize text-zinc-500 font-medium">
                        {asg.type} · {asg.weightPercent}% weight
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1 truncate">
                      {asg.title}
                    </h3>
                  </div>

                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0 ${
                    asg.status === 'active'
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : asg.status === 'grading'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : asg.status === 'closed'
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                      : 'bg-sky-500/10 text-sky-500'
                  }`}>
                    {asg.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  <span>{(Array.isArray(asg.questions) ? asg.questions : []).length} Qs ({subQuestionsCount} parts)</span>
                  <span>Due {new Date(asg.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })} ({calculateDaysLeft(asg.dueDate)})</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onNavigate('gradebook', asg.id)}
                    className="flex-1 h-11 flex items-center justify-center gap-1.5 px-3 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    <span>Open Grade Sheet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('builder', asg.id)}
                    className="h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer active:scale-[0.98]"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Full Data Table (Untouched on Desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 font-semibold border-b border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="py-2.5 px-4">Assessment</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Questions & Subparts</th>
                <th className="py-2.5 px-3 font-mono">Due Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {assignments.map(asg => {
                const subQuestionsCount = (Array.isArray(asg.questions) ? asg.questions : []).reduce(
                  (sum, q) => sum + (q.subQuestions?.length || 1),
                  0
                );

                return (
                  <tr key={asg.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors duration-150">
                    <td className="py-4 px-5">
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
                        {asg.shortCode}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate max-w-xs">
                        {asg.title}
                      </div>
                    </td>

                    <td className="py-3 px-3 capitalize text-zinc-600 dark:text-zinc-400">
                      {asg.type}
                    </td>

                    <td className="py-3 px-3 font-mono text-zinc-600 dark:text-zinc-400">
                      {(Array.isArray(asg.questions) ? asg.questions : []).length} Qs ({subQuestionsCount} parts)
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                      {new Date(asg.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      <div className="text-[10px] text-zinc-400 font-mono">
                        {calculateDaysLeft(asg.dueDate)}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`text-[11px] font-medium capitalize ${
                        asg.status === 'active'
                          ? 'text-[#3B82F6]'
                          : asg.status === 'grading'
                          ? 'text-amber-500 dark:text-amber-400'
                          : asg.status === 'closed'
                          ? 'text-zinc-500'
                          : 'text-sky-400'
                      }`}>
                        {asg.status}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={() => onNavigate('gradebook', asg.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#3B82F6] hover:underline transition-colors duration-150 cursor-pointer"
                      >
                        Grade Sheet
                      </button>
                      <button
                        onClick={() => onNavigate('builder', asg.id)}
                        className="px-2 py-1 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 ml-1 transition-colors duration-150 cursor-pointer"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
