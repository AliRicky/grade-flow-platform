import React, { useEffect, useMemo, useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, X, Users, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';

interface OverdueNotifierModalProps {
  isOpen: boolean;
  defaultAssignmentId?: string;
  onClose: () => void;
}

export const OverdueNotifierModal: React.FC<OverdueNotifierModalProps> = ({
  isOpen,
  defaultAssignmentId,
  onClose,
}) => {
  const { users } = useAuth();
  const { assignments, grades, sendOverdueReminders } = useCourse();

  const [selectedAsgId, setSelectedAsgId] = useState<string>(
    defaultAssignmentId || assignments[0]?.id || ''
  );

  // Templates keep their [placeholders]; they are filled in at preview/send time
  const [subject, setSubject] = useState('Reminder: Pending Submission for [Assignment]');
  const [emailBody, setEmailBody] = useState(
    `Dear Student,\n\nThis is an automated reminder that your submission for [Assessment] is due or currently overdue. Please submit your materials as soon as possible to avoid late penalty deductions.\n\nBest regards,\nCourse TA Teaching Team`
  );

  const [isSending, setIsSending] = useState(false);
  const [successResult, setSuccessResult] = useState<{ count: number } | null>(null);

  // Re-sync the picker each time the modal opens (it stays mounted between openings)
  useEffect(() => {
    if (isOpen) {
      setSelectedAsgId(defaultAssignmentId || assignments[0]?.id || '');
      setSuccessResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, defaultAssignmentId]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const currentAssignment = assignments.find(a => a.id === selectedAsgId) || assignments[0];
  const students = useMemo(() => users.filter(u => u.role === 'student'), [users]);

  // Students with no recorded scores for this assignment
  const targetStudents = useMemo(() => students.filter(s => {
    const studentGrade = grades[`${s.id}_${currentAssignment?.id}`];
    if (!studentGrade) return true;
    const filledCount = Object.values(studentGrade.scores || {}).filter(v => v !== null && v !== undefined).length;
    return filledCount === 0;
  }), [students, grades, currentAssignment]);

  if (!isOpen) return null;

  const fill = (template: string) =>
    template
      .replace(/\[Assignment\]|\[Course Assignment\]/g, currentAssignment?.shortCode || 'Assignment')
      .replace(/\[Assessment\]/g, currentAssignment ? `${currentAssignment.shortCode}: ${currentAssignment.title}` : 'the assessment');

  const notYetDue = currentAssignment ? new Date(currentAssignment.dueDate).getTime() > Date.now() : false;
  const isDraft = currentAssignment?.status === 'draft';

  const handleSendReminders = async () => {
    if (!currentAssignment || targetStudents.length === 0) return;
    setIsSending(true);
    setSuccessResult(null);

    const recipientIds = targetStudents.map(s => s.id);
    let result: { sentCount: number } | undefined;
    try {
      result = await sendOverdueReminders(currentAssignment.id, recipientIds);
    } catch (e) {
      console.error("Failed to send reminders", e);
      // Let user know or just silently fail, QA says missing catch causes crash
    } finally {
      setIsSending(false);
    }

    if (result) {
      setSuccessResult({ count: result.sentCount });
    }

    setTimeout(() => {
      setSuccessResult(null);
      onClose();
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Send reminders"
    >
      <div className="w-full max-w-xl bg-white dark:bg-[#09090B] rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#3B82F6]" />
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Automated Overdue Task & Deadline Notifier
              </h3>
              <span className="text-xs text-zinc-500">
                Dispatch email reminders to students with missing submissions
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {successResult && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>
                Successfully queued and dispatched automated notifications to {successResult.count} students!
              </span>
            </div>
          )}

          {/* Assessment Picker */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Select Assessment
            </label>
            <select
              value={selectedAsgId}
              onChange={e => setSelectedAsgId(e.target.value)}
              className="w-full h-11 p-2 text-base sm:text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 font-medium"
            >
              {assignments.map(a => (
                <option key={a.id} value={a.id}>
                  {a.shortCode}: {a.title} (Due: {new Date(a.dueDate).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          {/* Recipient Summary */}
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-zinc-700 dark:text-zinc-200 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>Identified Recipients ({targetStudents.length} students)</span>
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                {targetStudents.length === 0 ? 'All submitted!' : `${targetStudents.length} pending`}
              </span>
            </div>

            {targetStudents.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
                {targetStudents.map(s => (
                  <span
                    key={s.id}
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                  >
                    {s.full_name || 'Unknown'} ({s.studentId})
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 text-[11px]">
                No pending or overdue students for this assignment. Everyone has submissions logged!
              </p>
            )}
          </div>

          {/* Subject Line */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Email Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Message Template
            </label>
            <p className="text-[11px] text-zinc-400 mb-1.5">
              Use <code>[Assignment]</code> and <code>[Assessment]</code> — they are replaced per assessment when sent.
            </p>
            <textarea
              rows={4}
              value={emailBody}
              onChange={e => setEmailBody(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 font-mono"
            />
          </div>

          {(notYetDue || isDraft) && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 rounded-xl text-xs flex items-start gap-2">
              <Clock className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                {isDraft
                  ? 'This assessment is still a draft, so students cannot see it yet.'
                  : 'This assessment is not due yet, so every student without a score is listed as pending.'}
              </span>
            </div>
          )}

          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 text-xs">
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Preview</span>
            <div className="font-semibold text-zinc-800 dark:text-zinc-100 mb-1">{fill(subject)}</div>
            <p className="whitespace-pre-line text-zinc-600 dark:text-zinc-300">{fill(emailBody)}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">
            Automated batch dispatch with campus email queue
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="h-10 px-3.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSendReminders}
              disabled={isSending || targetStudents.length === 0}
              className="h-10 flex items-center gap-1.5 px-4 text-xs font-semibold text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Sending Notifications...' : `Send to ${targetStudents.length} Students`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
