import React from 'react';
import { MessageSquare, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';

export const StudentRegradesView: React.FC = () => {
  const { currentUser } = useAuth();
  const { regrades } = useCourse();

  const studentId = currentUser?.id ?? '';
  const myRegrades = regrades.filter(r => r.studentId === studentId);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3B82F6] mb-1">
          <MessageSquare className="w-4 h-4" />
          <span>Regrade Appeals & Inquiries</span>
        </div>
        <h1 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-100">
          My Grade Appeals ({myRegrades.length})
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
          Track the status of your regrade requests. Teaching Assistants review your solutions against the grading rubric and provide explanatory feedback.
        </p>
      </div>

      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden">
        {myRegrades.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 text-xs">
            You have not submitted any regrade appeals yet. You can submit appeals directly from your "My Scores" tab.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {myRegrades.map(r => (
              <div key={r.id} className="p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      {r.assignmentTitle}
                    </span>
                    <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300">
                      Problem {r.questionLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize flex items-center gap-1 ${
                      r.status === 'resolved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : r.status === 'rejected'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {r.status === 'resolved' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                       r.status === 'rejected' ? <XCircle className="w-3.5 h-3.5" /> :
                       <Clock className="w-3.5 h-3.5" />}
                      <span>{r.status === 'resolved' ? 'approved' : r.status}</span>
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl text-xs border border-zinc-200 dark:border-zinc-800">
                  <span className="text-[11px] font-semibold text-zinc-500 block mb-1">
                    Your Appeal Justification:
                  </span>
                  <p className="text-zinc-700 dark:text-zinc-300 italic">"{r.reason}"</p>
                </div>

                {r.status === 'resolved' && r.adjustedScore !== undefined && (
                  <div className="text-xs font-mono text-[#3B82F6]">
                    Score updated: {r.currentScore} → {r.adjustedScore} / {r.maxScore}
                  </div>
                )}

                {r.taResponse ? (
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-800/90 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700">
                    <span className="text-[11px] font-semibold text-[#3B82F6] block mb-1">
                      TA Official Response:
                    </span>
                    <p className="text-zinc-800 dark:text-zinc-200">{r.taResponse}</p>
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-400 italic">
                    Under review by TA grading team. You will receive a notification when resolved.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
