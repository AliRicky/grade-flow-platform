import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle2, MapPin, Bell, FileText, HelpCircle } from 'lucide-react';
import { useCourse } from '../../context/CourseContext';

export const StudentDeadlinesView: React.FC = () => {
  const { assignments, triggerBrowserNotification } = useCourse();

  // Re-render every minute so countdowns stay live
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Published assessments only, upcoming first, then past ones (most recent first)
  const sortedAssignments = useMemo(() => {
    const published = assignments.filter(a => a.status !== 'draft');
    const t = (a: { dueDate: string }) => new Date(a.dueDate).getTime();
    const upcoming = published.filter(a => t(a) > now).sort((a, b) => t(a) - t(b));
    const past = published.filter(a => t(a) <= now).sort((a, b) => t(b) - t(a));
    return [...upcoming, ...past];
  }, [assignments, now]);

  const getCountdown = (dueDateStr: string) => {
    const diffMs = new Date(dueDateStr).getTime() - now;
    if (diffMs <= 0) return { text: 'Closed / Passed', isPast: true };

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;

    if (days > 0) {
      return { text: `${days}d ${remHours}h remaining`, isPast: false, days };
    }
    return { text: `${hours} hours remaining`, isPast: false, days: 0 };
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3B82F6] mb-1">
            <span>Course Deadlines & Schedule</span>
          </div>
          <h1 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-100">
            Upcoming Due Dates & Exam Times
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
            Live countdowns for every published homework and quiz.
          </p>
        </div>

        <button
          onClick={() => triggerBrowserNotification('GradeFlow alerts enabled', 'You will be notified about upcoming deadlines.')}
          className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 rounded-xl transition-colors cursor-pointer self-start md:self-auto"
        >
          <Bell className="w-4 h-4 text-[#3B82F6]" />
          <span>Enable desktop alerts</span>
        </button>
      </div>

      {sortedAssignments.length === 0 && (
        <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-8 text-center text-sm text-zinc-500">
          Nothing is scheduled yet.
        </div>
      )}

      {/* Grid of Deadlines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {sortedAssignments.map(asg => {
          const countdown = getCountdown(asg.dueDate);
          const isUrgent = !countdown.isPast && countdown.days !== undefined && countdown.days < 3;

          return (
            <div
              key={asg.id}
              className={`border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm transition-all ${
                countdown.isPast
                  ? 'border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-[#09090B]/60 opacity-80'
                  : isUrgent
                  ? 'border-amber-400/50 dark:border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/5'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090B]'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-1.5 rounded-lg flex items-center justify-center transition-transform ${
                    asg.type === 'homework'
                      ? 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20'
                      : 'bg-sky-500/10 text-sky-500 border border-sky-500/20'
                  }`}>
                    {asg.type === 'homework' ? <FileText className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
                  </span>
                  <span className="text-xs text-zinc-500 capitalize">{asg.type}</span>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-mono font-bold block ${
                    countdown.isPast
                      ? 'text-zinc-400'
                      : isUrgent
                      ? 'text-amber-500 dark:text-amber-400'
                      : 'text-[#3B82F6]'
                  }`}>
                    {countdown.text}
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                {asg.title}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 line-clamp-2">
                {asg.description}
              </p>

              {asg.examLocation && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 p-2 rounded-xl mb-3 border border-zinc-200 dark:border-zinc-800">
                  <MapPin className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />
                  <span>Exam Venue: <strong>{asg.examLocation}</strong></span>
                </div>
              )}

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>Weight: {asg.weightPercent}%</span>
                <span>Due: {new Date(asg.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
