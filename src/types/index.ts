export type Role = 'admin' | 'student';

export interface User {
  id: string;
  full_name: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  studentId?: string; // e.g. 40110293 or 4002019015
  username?: string;
  avatar?: string;
  section?: string; // e.g. "The Lead Teaching Assistant"
  passwordHash?: string;
  salt?: string;
  rawPassword?: string;
  provider?: 'google'; // account created via Google sign-in (no local password)
}

export interface SubQuestion {
  id: string;
  label: string; // e.g. "1-a", "1 (I)", "Part a"
  title: string; // e.g. "Gradient Descent derivation"
  maxScore: number;
  description?: string;
  assignedTaId?: string;
  isBonus?: boolean; // Bonus part
}

export interface Question {
  id: string;
  number: number; // 1, 2, 3...
  title: string;
  isBonus?: boolean; // Bonus credit problem
  subQuestions: SubQuestion[];
  // If subQuestions is empty, it's a single question with direct maxScore
  directMaxScore?: number;
}

export type AssignmentType = 'homework' | 'quiz';
export type AssignmentStatus = 'active' | 'grading' | 'closed' | 'draft';

export interface Assignment {
  id: string;
  type: AssignmentType;
  title: string; // e.g. "Homework 1: Linear Regression & Optimization"
  shortCode: string; // e.g. "HW1", "Quiz 1"
  description: string;
  releaseDate: string; // ISO string
  dueDate: string; // ISO string
  weightPercent: number; // e.g. 8% of total grade
  targetScale?: number; // Target score scale (e.g. 1.0 or 3.0), defaults to 1.0
  status: AssignmentStatus;
  questions: Question[];
  totalMaxScore: number;
  assignedTAs: string[]; // TA user IDs
  submissionCount?: number;
  averageScore?: number;
  examLocation?: string; // for quizzes
}

export interface StudentScoreMap {
  // Key format: `${questionId}_${subQuestionId}` or `${questionId}` for direct question
  [itemKey: string]: number | null;
}

export interface StudentAssignmentGrade {
  studentId: string;
  assignmentId: string;
  scores: StudentScoreMap;
  feedback?: string;
  gradedBy?: string; // TA id or name
  gradedAt?: string;
  isLate?: boolean;
  latePenaltyPercent?: number;
  regradeRequested?: boolean;
  regradeReason?: string;
  regradeStatus?: 'pending' | 'approved' | 'rejected';
}

export interface NotificationItem {
  id: string;
  userId?: string; // or 'all'
  title: string;
  message: string;
  type: 'deadline' | 'grade' | 'regrade' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  assignmentId?: string;
  /** Who should see this notification. Missing = everyone (legacy items). */
  audience?: 'staff' | 'students' | 'all';
}

export interface RegradeRequest {
  id: string;
  studentId: string;
  studentName: string;
  assignmentId: string;
  assignmentTitle: string;
  questionLabel: string;
  reason: string;
  currentScore: number;
  maxScore: number;
  status: 'pending' | 'resolved' | 'rejected';
  taResponse?: string;
  adjustedScore?: number; // set when a TA changes the score while resolving
  resolvedAt?: string;
  createdAt: string;
}

export interface CourseStats {
  totalStudents: number;
  activeAssignments: number;
  averageClassScore: number;
  gradingProgress: number; // percentage
  pendingRegrades: number;
}

export interface CourseConfig {
  semesterScale: number; // e.g. 5.0, 6.0, 9.0, 10.0, 20.0 (default 5.0)
  weightMode: 'equal' | 'weightPercent';
  roundingRule: 'ceil2'; // ceiling to 2 decimals
  scaleMode?: 'cumulative' | 'proportional';
}

export interface StudentAssignmentCalculation {
  standardEarned: number;
  bonusEarned: number;
  totalEarned: number;
  standardDenominator: number;
  targetScale: number;
  exactScore: number;
  displayScore: number;
  percentage: number;
  isOverflow: boolean;
}

export interface SemesterStudentSummary {
  studentId: string;
  studentName: string;
  studentNumber: string;
  section?: string;
  assignmentScores: Record<string, StudentAssignmentCalculation>;
  exactSemesterTotal: number;
  displaySemesterTotal: number;
  semesterScale: number;
  isSemesterOverflow: boolean;
}
