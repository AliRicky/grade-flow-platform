import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Save,
  Copy,
  Layers,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  FileQuestion,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  AlertCircle
} from 'lucide-react';
import { useCourse } from '../../context/CourseContext';
import { Assignment, Question, SubQuestion } from '../../types';

/** ISO (UTC) string -> value for <input type="datetime-local"> in the user's local time */
const toLocalInput = (iso?: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** datetime-local value (local time) -> ISO string */
const fromLocalInput = (value: string): string => {
  const d = value ? new Date(value) : new Date();
  return (isNaN(d.getTime()) ? new Date() : d).toISOString();
};

const relabel = (questions: Question[]): Question[] =>
  questions.map((q, idx) => {
    const number = idx + 1;
    return {
      ...q,
      number,
      subQuestions: (q.subQuestions || []).map((sq, i) => ({
        ...sq,
        // Only rewrite auto-generated labels like "3-a"; leave custom labels alone
        label: /^\d+-[a-z]$/i.test(sq.label || '') ? `${number}-${String.fromCharCode(97 + (i % 26))}` : sq.label,
      })),
    };
  });

interface AssignmentBuilderProps {
  initialAssignmentId?: string;
  onSaved?: () => void;
}

export const AssignmentBuilder: React.FC<AssignmentBuilderProps> = ({
  initialAssignmentId,
  onSaved,
}) => {
  const { assignments, updateAssignment, createAssignment, deleteAssignment } = useCourse();

  // Selected assignment to edit
  const [selectedId, setSelectedId] = useState<string>(() => {
    return initialAssignmentId || assignments[0]?.id || '';
  });

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Form states for the selected assignment
  const [title, setTitle] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [type, setType] = useState<'homework' | 'quiz'>('homework');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [weightPercent, setWeightPercent] = useState(8);
  const [targetScale, setTargetScale] = useState(1.0);
  const [status, setStatus] = useState<Assignment['status']>('active');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [draggedQIndex, setDraggedQIndex] = useState<number | null>(null);

  // Load selected assignment into form
  useEffect(() => {
    setFormError(null);
    setConfirmDelete(false);

    if (isCreatingNew) {
      const nextNumber = assignments.filter(a => a.type === 'homework').length + 1;
      const due = new Date();
      due.setDate(due.getDate() + 10);
      setTitle('');
      setShortCode(`HW${nextNumber}`);
      setType('homework');
      setDescription('');
      setReleaseDate(toLocalInput(new Date().toISOString()));
      setDueDate(toLocalInput(due.toISOString()));
      setWeightPercent(8);
      setTargetScale(1.0);
      setStatus('draft');
      setQuestions([
        {
          id: 'q_' + Math.random().toString(36).substring(2, 9),
          number: 1,
          title: 'Problem 1',
          directMaxScore: 10,
          subQuestions: [],
        },
      ]);
      return;
    }

    const current = assignments.find(a => a.id === selectedId) || assignments[0];
    if (current) {
      setTitle(current.title);
      setShortCode(current.shortCode);
      setType(current.type);
      setDescription(current.description);
      setReleaseDate(toLocalInput(current.releaseDate));
      setDueDate(toLocalInput(current.dueDate));
      setWeightPercent(current.weightPercent);
      setTargetScale(current.targetScale ?? 1.0);
      setStatus(current.status);
      setQuestions(JSON.parse(JSON.stringify(Array.isArray(current.questions) ? current.questions : [])));
    }
    // Deliberately NOT depending on `assignments`: a background sync from another tab
    // must not wipe the edits currently being typed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, isCreatingNew]);

  // Compute total points dynamically
  const { totalStandardPoints, totalBonusPoints } = React.useMemo(() => {
    let standard = 0;
    let bonus = 0;

    questions.forEach(q => {
      let qPoints = 0;
      if (q.subQuestions && q.subQuestions.length > 0) {
        qPoints = q.subQuestions.reduce((sum, sq) => sum + (sq.maxScore || 0), 0);
      } else {
        qPoints = q.directMaxScore || 0;
      }

      if (q.isBonus) {
        bonus += qPoints;
      } else {
        standard += qPoints;
      }
    });

    return { totalStandardPoints: standard, totalBonusPoints: bonus };
  }, [questions]);

  // Question manipulation
  const addQuestion = (isMultipart: boolean, isBonus = false) => {
    const nextNum = questions.length + 1;
    const newQId = 'q_' + Math.random().toString(36).substring(2, 9);

    const newQuestion: Question = {
      id: newQId,
      number: nextNum,
      title: isBonus ? `Bonus Problem` : `Problem ${nextNum}`,
      isBonus,
      subQuestions: isMultipart
        ? [
            { id: 'sq_' + Math.random().toString(36).substring(2, 7), label: `${nextNum}-a`, title: 'Part A', maxScore: 5 },
            { id: 'sq_' + Math.random().toString(36).substring(2, 7), label: `${nextNum}-b`, title: 'Part B', maxScore: 5 },
          ]
        : [],
      directMaxScore: isMultipart ? undefined : 10,
    };

    setQuestions(prev => [...prev, newQuestion]);
  };

  const removeQuestion = (qIndex: number) => {
    setQuestions(prev => {
      // Re-number remaining questions (and their auto-generated sub-part labels)
      return relabel(prev.filter((_, i) => i !== qIndex));
    });
  };

  const updateQuestionTitle = (qIndex: number, newTitle: string) => {
    setQuestions(prev => prev.map((q, i) => i === qIndex ? { ...q, title: newTitle } : q));
  };

  const toggleQuestionBonus = (qIndex: number) => {
    setQuestions(prev => prev.map((q, i) => i === qIndex ? { ...q, isBonus: !q.isBonus } : q));
  };

  const updateDirectMaxScore = (qIndex: number, score: number) => {
    setQuestions(prev => prev.map((q, i) => i === qIndex ? { ...q, directMaxScore: score } : q));
  };

  // Convert between single and multipart question
  const toggleMultipart = (qIndex: number) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIndex) return q;
      if (q.subQuestions && q.subQuestions.length > 0) {
        // Convert to single
        const total = q.subQuestions.reduce((acc, sq) => acc + sq.maxScore, 0);
        return {
          ...q,
          subQuestions: [],
          directMaxScore: total || 10,
        };
      } else {
        // Convert to multipart
        const half = (q.directMaxScore || 10) / 2;
        return {
          ...q,
          directMaxScore: undefined,
          subQuestions: [
            { id: 'sq_' + Math.random().toString(36).substring(2, 7), label: `${q.number}-a`, title: 'Part A', maxScore: half },
            { id: 'sq_' + Math.random().toString(36).substring(2, 7), label: `${q.number}-b`, title: 'Part B', maxScore: half },
          ]
        };
      }
    }));
  };

  // Subquestion actions
  const addSubQuestion = (qIndex: number) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIndex) return q;
      const count = q.subQuestions.length;
      const subLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
      const nextLetter = subLabels[count] || `${count + 1}`;
      const newSq: SubQuestion = {
        id: 'sq_' + Math.random().toString(36).substring(2, 7),
        label: `${q.number}-${nextLetter}`,
        title: `Part ${nextLetter.toUpperCase()}`,
        maxScore: 5,
      };
      return {
        ...q,
        subQuestions: [...q.subQuestions, newSq],
      };
    }));
  };

  const removeSubQuestion = (qIndex: number, sqIndex: number) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIndex) return q;
      return {
        ...q,
        subQuestions: q.subQuestions.filter((_, idx) => idx !== sqIndex),
      };
    }));
  };

  const updateSubQuestion = (qIndex: number, sqIndex: number, updates: Partial<SubQuestion>) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIndex) return q;
      const updatedSqs = q.subQuestions.map((sq, idx) => idx === sqIndex ? { ...sq, ...updates } : sq);
      return {
        ...q,
        subQuestions: updatedSqs,
      };
    }));
  };

  // Drag and Drop & Ordering
  const moveQuestion = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= questions.length) return;
    setQuestions(prev => {
      const items = [...prev];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      return relabel(items);
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedQIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedQIndex === null || draggedQIndex === index) return;
    moveQuestion(draggedQIndex, index);
    setDraggedQIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedQIndex(null);
  };

  // Save changes
  const handleSave = () => {
    const problems: string[] = [];
    if (!title.trim()) problems.push('Please enter an assessment title.');
    if (!shortCode.trim()) problems.push('Please enter a short code (e.g. HW1).');
    if (!(weightPercent > 0 && weightPercent <= 100)) problems.push('Weight must be between 1 and 100.');
    if (questions.length === 0) problems.push('Add at least one question.');
    if (totalStandardPoints <= 0) problems.push('The assessment needs a total of more than 0 non-bonus points.');
    if (releaseDate && dueDate && new Date(dueDate) < new Date(releaseDate)) {
      problems.push('The due date cannot be before the release date.');
    }
    if (questions.some(q => q.subQuestions.length === 0 && !(q.directMaxScore && q.directMaxScore > 0))) {
      problems.push('Every question needs a max score greater than 0.');
    }
    if (problems.length > 0) {
      setFormError(problems[0]);
      return;
    }
    setFormError(null);

    const payload = {
      title: title.trim(),
      shortCode: shortCode.trim(),
      type,
      description,
      releaseDate: fromLocalInput(releaseDate),
      dueDate: fromLocalInput(dueDate),
      weightPercent,
      targetScale: Number.isFinite(targetScale) && targetScale > 0 ? targetScale : 1.0,
      status,
      questions,
      totalMaxScore: totalStandardPoints,
    };

    if (isCreatingNew) {
      const created = createAssignment({
        ...payload,
        assignedTAs: [],
        submissionCount: 0,
      });
      setIsCreatingNew(false);
      setSelectedId(created.id);
    } else {
      updateAssignment(selectedId, payload);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
    if (onSaved) onSaved();
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000);
      return;
    }
    const remaining = assignments.filter(a => a.id !== selectedId);
    deleteAssignment(selectedId);
    setConfirmDelete(false);
    setSelectedId(remaining[0]?.id || '');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Selector & Action Bar */}
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2.5">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider whitespace-nowrap">
              Select Assessment:
            </span>
            <select
              value={isCreatingNew ? 'new' : selectedId}
              onChange={e => {
                if (e.target.value === 'new') {
                  setIsCreatingNew(true);
                } else {
                  setIsCreatingNew(false);
                  setSelectedId(e.target.value);
                }
              }}
              className="w-full sm:w-auto bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold rounded-xl px-3 py-2.5 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
            >
              <optgroup label={`Homework Assignments (${assignments.filter(a => a.type === 'homework').length})`}>
                {assignments.filter(a => a.type === 'homework').map(a => (
                  <option key={a.id} value={a.id}>
                    {a.shortCode}: {a.title} ({(Array.isArray(a.questions) ? a.questions.length : 0)} Questions)
                  </option>
                ))}
              </optgroup>
              <optgroup label={`Quizzes (${assignments.filter(a => a.type === 'quiz').length})`}>
                {assignments.filter(a => a.type === 'quiz').map(a => (
                  <option key={a.id} value={a.id}>
                    {a.shortCode}: {a.title} ({(Array.isArray(a.questions) ? a.questions.length : 0)} Questions)
                  </option>
                ))}
              </optgroup>
              <option value="new">+ Create New Assignment / Quiz</option>
            </select>

            <button
              onClick={() => setIsCreatingNew(true)}
              className="h-10 sm:h-auto flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-[#3B82F6] bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 rounded-xl transition-colors cursor-pointer border border-[#3B82F6]/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Assessment</span>
            </button>
          </div>

          {/* Save Button */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 md:pt-0">
            {savedSuccess && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 w-full sm:w-auto">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved & Synchronized!</span>
              </span>
            )}
            {!isCreatingNew && assignments.length > 1 && (
              <button
                onClick={handleDelete}
                className={`h-11 sm:h-auto flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
                  confirmDelete
                    ? 'text-white bg-rose-600 border-rose-600 hover:bg-rose-700'
                    : 'text-rose-500 border-rose-500/30 hover:bg-rose-500/10'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmDelete ? 'Confirm' : 'Delete'}</span>
              </button>
            )}
            <button
              onClick={handleSave}
              className="h-11 sm:h-auto flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#3B82F6] hover:bg-[#2563EB] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      {formError && (
        <div role="alert" className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Basic Configuration Card */}
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">
          Assessment Properties
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Short Code
            </label>
            <input
              type="text"
              value={shortCode}
              onChange={e => setShortCode(e.target.value)}
              placeholder="e.g. HW1 or Quiz 1"
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Assessment Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Assignment Topic"
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={e => setType(e.target.value as 'homework' | 'quiz')}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
            >
              <option value="homework">Homework Assignment</option>
              <option value="quiz">Timed Quiz / In-Class Exam</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Release Date & Time
            </label>
            <input
              type="datetime-local"
              value={releaseDate}
              onChange={e => setReleaseDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Due Date & Time
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Weight in Final Course Grade (%)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={weightPercent}
              onChange={e => setWeightPercent(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Target Scale / Multiplier (e.g. 1.0 or 3.0)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={targetScale}
              onChange={e => setTargetScale(parseFloat(e.target.value) || 1.0)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as Assignment['status'])}
              className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
            >
              <option value="draft">Draft (hidden from students)</option>
              <option value="active">Active (open for submissions)</option>
              <option value="grading">Grading in progress</option>
              <option value="closed">Closed (grades final)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Instructions / Scope Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Outline coverage, guidelines, formatting requirements..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
          />
        </div>
      </div>

      {/* Dynamic Question & Subquestion Hierarchy Builder */}
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Questions & Sub-Questions Structure
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Drag questions to reorder · Add nested parts (e.g. 1-a, 1-b, 2-a, 2-b, 2-c) · Mark bonus problems.
            </p>
          </div>

          {/* Points summary pills */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-zinc-600 dark:text-zinc-400">
              Standard: <strong>{totalStandardPoints} pts</strong>
            </span>
            {totalBonusPoints > 0 && (
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                + Bonus: <strong>{totalBonusPoints} pts</strong>
              </span>
            )}
          </div>
        </div>

        {/* Question cards list */}
        <div className="space-y-3">
          {questions.map((question, qIdx) => {
            const hasSubQuestions = question.subQuestions && question.subQuestions.length > 0;
            const qPoints = hasSubQuestions
              ? question.subQuestions.reduce((sum, sq) => sum + sq.maxScore, 0)
              : question.directMaxScore || 0;

            return (
              <div
                key={question.id}
                draggable
                onDragStart={e => handleDragStart(e, qIdx)}
                onDragOver={e => handleDragOver(e, qIdx)}
                onDragEnd={handleDragEnd}
                className={`border rounded-3xl p-5 transition-all ${
                  draggedQIndex === qIdx
                    ? 'opacity-40 border-[#3B82F6] border-dashed bg-[#3B82F6]/10'
                    : question.isBonus
                    ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/10'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090B]'
                }`}
              >
                {/* Question Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {/* Drag Handle */}
                    <div
                      className="cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded shrink-0"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>

                    {/* Question Number Badge */}
                    <div className="w-6 h-6 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-mono font-bold text-xs text-zinc-700 dark:text-zinc-300 shrink-0">
                      {question.number}
                    </div>

                    {/* Question Title Input */}
                    <input
                      type="text"
                      value={question.title}
                      onChange={e => updateQuestionTitle(qIdx, e.target.value)}
                      placeholder={`Question ${question.number} Title...`}
                      className="flex-1 min-w-0 px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30"
                    />
                  </div>

                  {/* Right side controls */}
                  <div className="flex flex-wrap items-center justify-between sm:justify-end gap-1.5 pl-8 sm:pl-0">
                    <div className="flex items-center gap-1.5">
                      {/* Bonus Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleQuestionBonus(qIdx)}
                        className={`px-2 py-1 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
                          question.isBonus
                            ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-semibold'
                            : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 bg-zinc-100 dark:bg-zinc-800'
                        }`}
                        title="Toggle Bonus Question"
                      >
                        {question.isBonus ? 'Bonus' : 'Regular'}
                      </button>

                      {/* Multipart switch */}
                      <button
                        type="button"
                        onClick={() => toggleMultipart(qIdx)}
                        className="px-2 py-1 text-[11px] font-medium text-[#3B82F6] bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 border border-[#3B82F6]/20 rounded-lg transition-colors cursor-pointer"
                      >
                        {hasSubQuestions ? 'Multipart' : 'Single Point'}
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Reorder Buttons (Accessibility & Mobile) */}
                      <button
                        type="button"
                        disabled={qIdx === 0}
                        onClick={() => moveQuestion(qIdx, qIdx - 1)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={qIdx === questions.length - 1}
                        onClick={() => moveQuestion(qIdx, qIdx + 1)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Question */}
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIdx)}
                        className="p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Question Body: Single or Nested Sub-questions */}
                {!hasSubQuestions ? (
                  <div className="flex flex-wrap items-center gap-3 pl-2 sm:pl-8">
                    <label className="text-xs text-zinc-500 dark:text-zinc-400">
                      Total Max Score for Q{question.number}:
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={question.directMaxScore || 0}
                        onChange={e => updateDirectMaxScore(qIdx, parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-xs font-mono text-center rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                      />
                      <span className="text-xs text-zinc-400 font-mono">pts</span>
                    </div>
                  </div>
                ) : (
                  <div className="pl-2 sm:pl-8 space-y-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
                      <span>Nested Sub-Questions (Dynamic Parts)</span>
                      <span className="font-mono text-zinc-600 dark:text-zinc-300">
                        Subtotal: {qPoints} pts
                      </span>
                    </div>

                    {/* Subquestion items */}
                    <div className="space-y-1.5">
                      {question.subQuestions.map((sq, sqIdx) => (
                        <div
                          key={sq.id}
                          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 sm:p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {/* Part label (e.g. 1-a or 1 (I)) */}
                            <input
                              type="text"
                              value={sq.label}
                              onChange={e => updateSubQuestion(qIdx, sqIdx, { label: e.target.value })}
                              placeholder="1-a"
                              className="w-16 px-2 py-1.5 sm:py-1 text-xs font-mono font-semibold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6] text-center shrink-0"
                            />

                            {/* Part description / topic */}
                            <input
                              type="text"
                              value={sq.title}
                              onChange={e => updateSubQuestion(qIdx, sqIdx, { title: e.target.value })}
                              placeholder="Part title or prompt..."
                              className="flex-1 min-w-0 px-2.5 py-1.5 sm:py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 shrink-0">
                            {/* Max points */}
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min="0.5"
                                step="0.5"
                                value={sq.maxScore}
                                onChange={e => updateSubQuestion(qIdx, sqIdx, { maxScore: parseFloat(e.target.value) || 0 })}
                                className="w-16 px-2 py-1.5 sm:py-1 text-xs font-mono text-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
                              />
                              <span className="text-xs text-zinc-400 font-mono">pts</span>
                            </div>

                            {/* Delete Subquestion */}
                            <button
                              type="button"
                              onClick={() => removeSubQuestion(qIdx, sqIdx)}
                              className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                              title="Remove sub-part"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Part Button */}
                    <button
                      type="button"
                      onClick={() => addSubQuestion(qIdx)}
                      className="mt-2 text-xs font-medium text-[#3B82F6] hover:text-[#2563EB] flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Sub-Question (e.g. {question.number}-{['a','b','c','d','e'][question.subQuestions.length] || 'part'})</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Add Question Buttons */}
        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => addQuestion(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#3B82F6] bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 border border-[#3B82F6]/20 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Multipart Question (1-a, 1-b...)</span>
          </button>

          <button
            type="button"
            onClick={() => addQuestion(false)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Single Question</span>
          </button>

          <button
            type="button"
            onClick={() => addQuestion(false, true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 rounded-xl transition-colors cursor-pointer ml-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Add Bonus Problem</span>
          </button>
        </div>
      </div>
    </div>
  );
};
