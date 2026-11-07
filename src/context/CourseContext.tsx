import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../services/supabaseDatabase';

import {
  Assignment,
  CourseConfig,
  NotificationItem,
  Question,
  RegradeRequest,
  SemesterStudentSummary,
  StudentAssignmentGrade,
  User
} from '../types';
import {
  calculateStudentAssignmentScore,
  calculateSemesterSummary
} from '../utils/grading';

interface CourseContextType {
  assignments: Assignment[];
  grades: Record<string, StudentAssignmentGrade>;
  regrades: RegradeRequest[];
  notifications: NotificationItem[];
  courseConfig: CourseConfig;
  updateCourseConfig: (updates: Partial<CourseConfig>) => void;
  isOnline: boolean;
  offlineQueueCount: number;
  lastSyncTimestamp: number;
  
  createAssignment: (assignment: Omit<Assignment, 'id'>) => Assignment;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  reorderQuestions: (assignmentId: string, questions: Assignment['questions']) => void;

  updateGrade: (
    studentId: string,
    assignmentId: string,
    scoreKey: string,
    value: number | null,
    taName?: string
  ) => void;
  bulkImportGrades: (assignmentId: string, records: { studentId: string; scores: Record<string, number> }[]) => number;
  getStudentGrade: (studentId: string, assignmentId: string) => StudentAssignmentGrade | undefined;
  calculateStudentTotal: (studentId: string, assignmentId: string) => {
    rawTotal: number;
    bonus: number;
    scaledFinal: number;
    maxScore: number;
    denominator: number;
    exactScore: number;
    isOverflow: boolean;
  };
  getSemesterSummary: (students: User[]) => SemesterStudentSummary[];
  
  clearAllGrades: () => Promise<void>;
  resetToFreshCourse: () => Promise<void>;

  submitRegrade: (studentId: string, studentName: string, assignmentId: string, assignmentTitle: string, questionLabel: string, reason: string, currentScore: number, maxScore: number) => { success: boolean; message?: string };
  resolveRegrade: (regradeId: string, status: 'resolved' | 'rejected', taResponse: string, adjustedScore?: number) => void;

  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  sendOverdueReminders: (assignmentId: string, recipientStudentIds: string[]) => Promise<{ sentCount: number; timestamp: string }>;
  triggerBrowserNotification: (title: string, body: string) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

const uid = (prefix: string) => `${prefix}_${Math.random().toString(36).substring(2, 9)}`;

function findScoreKey(asg: Assignment, label: string): { key: string; maxScore: number } | null {
  const questions = Array.isArray(asg?.questions) ? asg.questions : [];
  for (const q of questions) {
    if (Array.isArray(q.subQuestions) && q.subQuestions.length > 0) {
      const sq = q.subQuestions.find(s => s.label === label || s.id === label);
      if (sq) return { key: `${q.id}_${sq.id}`, maxScore: sq.maxScore };
    } else if (`${q.number}` === label) {
      return { key: q.id, maxScore: q.directMaxScore || 0 };
    }
  }
  return null;
}

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [grades, setGrades] = useState<Record<string, StudentAssignmentGrade>>({});
  const [regrades, setRegrades] = useState<RegradeRequest[]>([]);
  const [allNotifications, setAllNotifications] = useState<NotificationItem[]>([]);

  const [courseConfig, setCourseConfig] = useState<CourseConfig>(() => {
    try {
      const saved = localStorage.getItem('gradeflow_course_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      semesterScale: 5.0,
      weightMode: 'equal',
      roundingRule: 'ceil2',
      scaleMode: 'cumulative',
    };
  });

  const updateCourseConfig = (updates: Partial<CourseConfig>) => {
    setCourseConfig(prev => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('gradeflow_course_config', JSON.stringify(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  // Keep compatibility fields
  const isOnline = true;
  const offlineQueueCount = 0;
  const lastSyncTimestamp = Date.now();

  const notifications = useMemo(() => {
    const isStaff = currentUser?.role === 'admin';
    return allNotifications.filter(n => {
      if (n.userId && n.userId !== 'all') return n.userId === currentUser?.id;
      if (!n.audience || n.audience === 'all') return true;
      return n.audience === (isStaff ? 'staff' : 'students');
    });
  }, [allNotifications, currentUser]);

  const pushNotification = (notif: NotificationItem) => {
    setAllNotifications(prev => (prev.some(n => n.id === notif.id) ? prev : [notif, ...prev]));
  };

  useEffect(() => {
    if (!currentUser) {
      setAssignments([]);
      setGrades({});
      setRegrades([]);
      return;
    }

    const fetchData = async () => {
      try {
        const [
          { data: assignmentsData },
          { data: gradesData },
          { data: regradesData }
        ] = await Promise.all([
          supabase.from('assignments').select('*'),
          supabase.from('grades').select('*'),
          supabase.from('regrades').select('*')
        ]);

        if (assignmentsData) {
          setAssignments(assignmentsData.map(row => {
            const rawQ = row.questions;
            const normalizedQuestions: Question[] = Array.isArray(rawQ)
              ? rawQ
              : rawQ && typeof rawQ === 'object'
              ? Object.entries(rawQ).map(([key, val]: [string, any], idx) => ({
                  id: key,
                  number: idx + 1,
                  title: `Problem ${idx + 1}`,
                  directMaxScore: typeof val === 'object' ? (val.max_score ?? val.directMaxScore ?? 10) : Number(val) || 10,
                  subQuestions: Array.isArray(val?.subQuestions) ? val.subQuestions : []
                }))
              : [];

            const parsedWeight = parseFloat(row.weight_percent);
            const parsedTotal = parseFloat(row.total_max_score);
            const parsedTargetScale = parseFloat(row.target_scale);

            return {
              id: row.id,
              shortCode: row.short_code,
              title: row.title,
              type: row.type,
              releaseDate: row.due_date || new Date().toISOString(),
              dueDate: row.due_date || new Date().toISOString(),
              weightPercent: Number.isFinite(parsedWeight) ? parsedWeight : 0,
              targetScale: Number.isFinite(parsedTargetScale) ? parsedTargetScale : 1.0,
              status: row.status,
              totalMaxScore: Number.isFinite(parsedTotal) ? parsedTotal : 0,
              assignedTAs: [],
              questions: normalizedQuestions,
              description: '',
            };
          }));
        }

        if (gradesData) {
          const gMap: Record<string, StudentAssignmentGrade> = {};
          gradesData.forEach(row => {
            gMap[`${row.student_id}_${row.assignment_id}`] = {
              studentId: row.student_id,
              assignmentId: row.assignment_id,
              scores: row.scores || {},
              gradedBy: row.graded_by,
              gradedAt: row.graded_at,
            };
          });
          setGrades(gMap);
        }

        if (regradesData) {
          setRegrades(regradesData.map(row => ({
            id: row.id,
            studentId: row.student_id,
            studentName: row.student_name,
            assignmentId: row.assignment_id,
            assignmentTitle: row.assignment_title,
            questionLabel: row.question_label,
            currentScore: parseFloat(row.current_score),
            maxScore: parseFloat(row.max_score),
            reason: row.reason,
            status: row.status as any,
            taResponse: row.ta_response,
            createdAt: row.created_at,
          })));
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    fetchData();

    const channel = supabase.channel('course-data')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assignments' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'grades' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'regrades' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  const createAssignment = (assignmentData: Omit<Assignment, 'id'>): Assignment => {
    const normalizedQuestions = Array.isArray(assignmentData.questions) ? assignmentData.questions : [];
    const newAsg: Assignment = {
      ...assignmentData,
      id: uid('asg'),
      questions: normalizedQuestions,
      weightPercent: Number.isFinite(Number(assignmentData.weightPercent)) ? Number(assignmentData.weightPercent) : 0,
      targetScale: Number.isFinite(Number(assignmentData.targetScale)) ? Number(assignmentData.targetScale) : 1.0,
      totalMaxScore: Number.isFinite(Number(assignmentData.totalMaxScore)) ? Number(assignmentData.totalMaxScore) : 0,
    };
    setAssignments(prev => [newAsg, ...prev]);
    
    supabase.from('assignments').insert({
      id: newAsg.id, short_code: newAsg.shortCode, title: newAsg.title, type: newAsg.type,
      due_date: newAsg.dueDate || new Date().toISOString(), weight_percent: newAsg.weightPercent,
      status: newAsg.status, total_max_score: newAsg.totalMaxScore, questions: newAsg.questions
    }).then(undefined, console.error);

    if (newAsg.status !== 'draft') {
      pushNotification({
        id: uid('notif'), title: `New Assignment Published: ${newAsg.title}`,
        message: `${newAsg.shortCode} is now active.`,
        type: 'deadline', timestamp: new Date().toISOString(), read: false,
        assignmentId: newAsg.id, audience: 'students',
      });
    }

    return newAsg;
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(prev => {
        const next = prev.map(a => (a.id === id ? { ...a, ...updates } : a));
        const updated = next.find(a => a.id === id);
        if(updated) {
          supabase.from('assignments').update({
            short_code: updated.shortCode, title: updated.title, type: updated.type,
            due_date: updated.dueDate || new Date().toISOString(), weight_percent: updated.weightPercent,
            status: updated.status, total_max_score: updated.totalMaxScore, questions: updated.questions
          }).eq('id', id).then(undefined, console.error);
        }
        return next;
    });
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
    supabase.from('assignments').delete().eq('id', id).then(undefined, console.error);
  };

  const reorderQuestions = (assignmentId: string, questions: Assignment['questions']) => {
    updateAssignment(assignmentId, { questions: Array.isArray(questions) ? questions : [] });
  };

  const updateGrade = (studentId: string, assignmentId: string, scoreKey: string, value: number | null, taName = 'TA Staff') => {
    const gradeKey = `${studentId}_${assignmentId}`;
    setGrades(prev => {
      const existing = prev[gradeKey] || { studentId, assignmentId, scores: {} };
      const updatedGrade = { ...existing, scores: { ...existing.scores, [scoreKey]: value }, gradedBy: taName, gradedAt: new Date().toISOString() };
      
      supabase.from('grades').upsert({
        student_id: studentId, assignment_id: assignmentId,
        scores: updatedGrade.scores, graded_by: updatedGrade.gradedBy, graded_at: updatedGrade.gradedAt
      }).then(undefined, console.error);
      
      return { ...prev, [gradeKey]: updatedGrade };
    });
  };

  const bulkImportGrades = (assignmentId: string, records: { studentId: string; scores: Record<string, number> }[]): number => {
    setGrades(prev => {
      const next = { ...prev };
      const dbRecords = records.map(rec => {
        const gradeKey = `${rec.studentId}_${assignmentId}`;
        const existing = next[gradeKey] || { studentId: rec.studentId, assignmentId, scores: {} };
        const updatedGrade = { ...existing, scores: { ...existing.scores, ...rec.scores }, gradedBy: 'CSV Import', gradedAt: new Date().toISOString() };
        next[gradeKey] = updatedGrade;
        return {
          student_id: rec.studentId, assignment_id: assignmentId,
          scores: updatedGrade.scores, graded_by: updatedGrade.gradedBy, graded_at: updatedGrade.gradedAt
        };
      });
      supabase.from('grades').upsert(dbRecords).then(undefined, console.error);
      return next;
    });
    return records.length;
  };

  const getStudentGrade = (studentId: string, assignmentId: string) => grades[`${studentId}_${assignmentId}`];

  const calculateStudentTotal = (studentId: string, assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    const grade = grades[`${studentId}_${assignmentId}`];

    if (!assignment) {
      return {
        rawTotal: 0,
        bonus: 0,
        scaledFinal: 0,
        maxScore: 0,
        denominator: 0,
        exactScore: 0,
        isOverflow: false,
      };
    }

    const calc = calculateStudentAssignmentScore(assignment, grade?.scores);
    return {
      rawTotal: calc.standardEarned,
      bonus: calc.bonusEarned,
      scaledFinal: calc.displayScore,
      maxScore: calc.targetScale,
      denominator: calc.standardDenominator,
      exactScore: calc.exactScore,
      isOverflow: calc.isOverflow,
    };
  };

  const getSemesterSummary = (students: User[]): SemesterStudentSummary[] => {
    return calculateSemesterSummary({
      assignments,
      students,
      grades,
      semesterScale: courseConfig.semesterScale,
      weightMode: courseConfig.weightMode,
      scaleMode: courseConfig.scaleMode,
    });
  };

  const clearAllGrades = async () => {
    setGrades({});
    try {
      await supabase.from('grades').delete().neq('assignment_id', 'non_existent');
      try {
        localStorage.removeItem('gradeflow_cached_grades');
      } catch (e) {
        // ignore
      }
      pushNotification({
        id: uid('notif'),
        title: 'Grades Cleared',
        message: 'All recorded grades have been reset. Gradebook is now fresh.',
        type: 'system',
        timestamp: new Date().toISOString(),
        read: false,
        audience: 'all',
      });
    } catch (err) {
      console.error('Failed to clear grades in database:', err);
    }
  };

  const resetToFreshCourse = async () => {
    setGrades({});
    setRegrades([]);
    try {
      await Promise.all([
        supabase.from('grades').delete().neq('assignment_id', 'non_existent'),
        supabase.from('regrades').delete().neq('id', 'non_existent'),
      ]);
      try {
        localStorage.removeItem('gradeflow_cached_grades');
      } catch (e) {
        // ignore
      }
      pushNotification({
        id: uid('notif'),
        title: 'Course Reset to Fresh State',
        message: 'All grades and regrade appeals have been cleared. Application is fresh.',
        type: 'system',
        timestamp: new Date().toISOString(),
        read: false,
        audience: 'all',
      });
    } catch (err) {
      console.error('Failed to reset course in database:', err);
    }
  };

  const submitRegrade: CourseContextType['submitRegrade'] = (studentId, studentName, assignmentId, assignmentTitle, questionLabel, reason, currentScore, maxScore) => {
    const duplicate = regrades.some(r => r.studentId === studentId && r.assignmentId === assignmentId && r.questionLabel === questionLabel && r.status === 'pending');
    if (duplicate) return { success: false, message: 'You already have a pending appeal for this question.' };

    const newRegrade: RegradeRequest = {
      id: uid('regrade'), studentId, studentName, assignmentId, assignmentTitle, questionLabel,
      reason, currentScore, maxScore, status: 'pending', createdAt: new Date().toISOString(),
    };

    setRegrades(prev => [newRegrade, ...prev]);

    supabase.from('regrades').insert({
      id: newRegrade.id, student_id: newRegrade.studentId, student_name: newRegrade.studentName,
      assignment_id: newRegrade.assignmentId, assignment_title: newRegrade.assignmentTitle,
      question_label: newRegrade.questionLabel, current_score: newRegrade.currentScore, max_score: newRegrade.maxScore,
      reason: newRegrade.reason, status: newRegrade.status, created_at: newRegrade.createdAt
    }).then(undefined, console.error);

    return { success: true };
  };

  const resolveRegrade = (regradeId: string, status: 'resolved' | 'rejected', taResponse: string, adjustedScore?: number) => {
    setRegrades(prev => {
      const target = prev.find(r => r.id === regradeId);
      if (!target || target.status !== 'pending') return prev;

      let appliedScore: number | undefined;
      if (status === 'resolved' && adjustedScore !== undefined && !Number.isNaN(adjustedScore)) {
        const asg = assignments.find(a => a.id === target.assignmentId);
        const match = asg ? findScoreKey(asg, target.questionLabel) : null;
        const clamped = Math.max(0, adjustedScore);
        if (match && clamped !== target.currentScore) {
           updateGrade(target.studentId, target.assignmentId, match.key, clamped, 'Regrade Review');
        }
        appliedScore = clamped;
      }

      const updated = { ...target, status, taResponse, adjustedScore: appliedScore, resolvedAt: new Date().toISOString() };
      supabase.from('regrades').update({ status, ta_response: taResponse }).eq('id', regradeId).then(undefined, console.error);
      return prev.map(r => r.id === regradeId ? updated : r);
    });
  };

  const markNotificationAsRead = (id: string) => setAllNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  const markAllNotificationsAsRead = () => {
    const visibleIds = new Set(notifications.map(n => n.id));
    setAllNotifications(prev => prev.map(n => (visibleIds.has(n.id) ? { ...n, read: true } : n)));
  };
  const sendOverdueReminders = async (assignmentId: string, recipientStudentIds: string[]) => ({ sentCount: recipientStudentIds.length, timestamp: new Date().toISOString() });
  const triggerBrowserNotification = (title: string, body: string) => {};

  const contextValue = useMemo(() => ({
    assignments, grades, regrades, notifications, courseConfig, updateCourseConfig, isOnline, offlineQueueCount, lastSyncTimestamp,
    createAssignment, updateAssignment, deleteAssignment, reorderQuestions,
    updateGrade, bulkImportGrades, getStudentGrade, calculateStudentTotal, getSemesterSummary,
    clearAllGrades, resetToFreshCourse,
    submitRegrade, resolveRegrade, markNotificationAsRead, markAllNotificationsAsRead,
    sendOverdueReminders, triggerBrowserNotification
  }), [assignments, grades, regrades, notifications, courseConfig, isOnline, offlineQueueCount, lastSyncTimestamp]);

  return <CourseContext.Provider value={contextValue}>{children}</CourseContext.Provider>;
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) throw new Error('useCourse must be used within a CourseProvider');
  return context;
};
