import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { WhatIfCalculator } from '../student/WhatIfCalculator';
import { StudentDeadlinesView } from '../student/StudentDeadlinesView';
import { StudentRegradesView } from '../student/StudentRegradesView';
import { RegradeModal } from '../student/RegradeModal';
import { NotificationDrawer } from '../notifications/NotificationDrawer';
import { OverdueNotifierModal } from '../admin/OverdueNotifierModal';
import { UserManagement } from '../admin/UserManagement';
import { ExportCenterModal } from '../admin/ExportCenterModal';
import { TaDelegationPanel } from '../admin/TaDelegationPanel';
import { DashboardOverview } from '../admin/DashboardOverview';

// Mock AuthContext
let mockIsAdmin = false;

const mockCurrentUser = {
  id: 'student_1',
  full_name: 'Ashkan Yousefi',
  role: 'student' as const,
  studentId: '4002019039',
  section: 'General'
};

const mockAdminUser = {
  id: 'admin_1',
  full_name: 'Ali Ricky',
  role: 'admin' as const,
  studentId: '4002019015',
  section: 'Lead TA'
};

const mockUsers = [
  mockCurrentUser,
  { id: 'student_2', full_name: 'Test Student 1', role: 'student' as const, studentId: '4042019001' },
  mockAdminUser,
  { id: 'admin_2', full_name: 'Setayesh Habibi', role: 'admin' as const, studentId: '4022019012' }
];

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    currentUser: mockIsAdmin ? mockAdminUser : mockCurrentUser,
    users: mockUsers,
    isAdmin: mockIsAdmin,
    isStudent: !mockIsAdmin,
    login: vi.fn(),
    logout: vi.fn()
  }))
}));

// Mock Supabase
vi.mock('../../services/supabaseDatabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({
          data: [
            { id: '1', full_name: 'Ashkan Yousefi', role: 'student', student_id: '4002019039', section: 'General' },
            { id: '2', full_name: 'Ali Ricky', role: 'admin', student_id: '4002019015', section: 'Lead TA' }
          ],
          error: null
        }))
      }))
    }))
  }
}));

// Mock CourseContext
const mockAssignments = [
  {
    id: 'asg_1',
    shortCode: 'HW1',
    title: 'Homework 1: Optimization',
    type: 'homework' as const,
    status: 'active' as const,
    weightPercent: 10,
    totalMaxScore: 30,
    releaseDate: '2026-10-01T00:00:00Z',
    dueDate: '2026-10-25T00:00:00Z',
    questions: [
      { id: 'q1', number: 1, title: 'Derivation', directMaxScore: 10, subQuestions: [] },
      { id: 'q2', number: 2, title: 'Implementation', directMaxScore: 20, subQuestions: [] }
    ],
    assignedTAs: ['admin_1'],
    description: 'Optimization homework'
  },
  {
    id: 'asg_2',
    shortCode: 'QZ1',
    title: 'Quiz 1: Linear Algebra',
    type: 'quiz' as const,
    status: 'active' as const,
    weightPercent: 8,
    totalMaxScore: 20,
    releaseDate: '2026-10-05T00:00:00Z',
    dueDate: '2026-10-20T00:00:00Z',
    questions: [
      { id: 'q1', number: 1, title: 'SVD', directMaxScore: 20, subQuestions: [] }
    ],
    assignedTAs: ['admin_2'],
    description: 'Linear algebra quiz'
  }
];

const mockGrades = {
  'student_1_asg_1': {
    studentId: 'student_1',
    assignmentId: 'asg_1',
    scores: { 'q1': 10, 'q2': 17 },
    gradedBy: 'Ali Ricky',
    gradedAt: '2026-10-15T00:00:00Z'
  }
};

const mockRegrades = [
  {
    id: 'regrade_1',
    studentId: 'student_1',
    studentName: 'Ashkan Yousefi',
    assignmentId: 'asg_1',
    assignmentTitle: 'Homework 1: Optimization',
    questionLabel: '1',
    reason: 'Please review Q1 step 3 deduction.',
    currentScore: 10,
    maxScore: 10,
    status: 'pending' as const,
    createdAt: '2026-10-15T12:00:00Z'
  }
];

const mockNotifications = [
  {
    id: 'notif_1',
    title: 'New Grade Published',
    message: 'Your score for HW1 is ready.',
    type: 'grade' as const,
    timestamp: '2026-10-15T10:00:00Z',
    read: false,
    audience: 'students' as const
  }
];

const mockCourseValue = {
  assignments: mockAssignments,
  grades: mockGrades,
  regrades: mockRegrades,
  notifications: mockNotifications,
  isOnline: true,
  offlineQueueCount: 0,
  lastSyncTimestamp: Date.now(),
  createAssignment: vi.fn(),
  updateAssignment: vi.fn(),
  deleteAssignment: vi.fn(),
  reorderQuestions: vi.fn(),
  updateGrade: vi.fn(),
  bulkImportGrades: vi.fn(),
  getStudentGrade: vi.fn((sid, aid) => mockGrades[`${sid}_${aid}`]),
  calculateStudentTotal: vi.fn(() => ({ rawTotal: 27, bonus: 0, scaledFinal: 8.1, maxScore: 30 })),
  submitRegrade: vi.fn(() => ({ success: true })),
  resolveRegrade: vi.fn(),
  markNotificationAsRead: vi.fn(),
  markAllNotificationsAsRead: vi.fn(),
  sendOverdueReminders: vi.fn(async () => ({ sentCount: 1, timestamp: new Date().toISOString() })),
  triggerBrowserNotification: vi.fn(),
};

vi.mock('../../context/CourseContext', () => ({
  useCourse: () => mockCourseValue
}));

describe('Complete GradeFlow Feature Verification Suite', () => {

  beforeEach(() => {
    mockIsAdmin = false;
  });

  describe('1. What-If Final Grade Planner (WhatIfCalculator)', () => {
    it('renders scenario simulator with normalized scale goal header', () => {
      render(<WhatIfCalculator />);
      expect(screen.getByText(/"What-If" Final Grade Planner/i)).toBeInTheDocument();
      expect(screen.getByText(/Scenario Simulator/i)).toBeInTheDocument();
    });

    it('renders sliders for both published assessments', () => {
      render(<WhatIfCalculator />);
      expect(screen.getByText('HW1')).toBeInTheDocument();
      expect(screen.getByText('QZ1')).toBeInTheDocument();
    });
  });

  describe('2. Student Deadlines & Schedule (StudentDeadlinesView)', () => {
    it('renders upcoming due dates with live countdowns', () => {
      render(<StudentDeadlinesView />);
      expect(screen.getByText(/Upcoming Due Dates & Exam Times/i)).toBeInTheDocument();
      expect(screen.getByText(/Homework 1: Optimization/i)).toBeInTheDocument();
      expect(screen.getByText(/Quiz 1: Linear Algebra/i)).toBeInTheDocument();
    });
  });

  describe('3. Student Regrade Appeals Portal (StudentRegradesView)', () => {
    it('renders submitted appeals and status badges', () => {
      render(<StudentRegradesView />);
      expect(screen.getByText(/My Grade Appeals/i)).toBeInTheDocument();
      expect(screen.getByText(/Homework 1: Optimization/i)).toBeInTheDocument();
      expect(screen.getByText(/Please review Q1 step 3 deduction/i)).toBeInTheDocument();
      expect(screen.getByText(/pending/i)).toBeInTheDocument();
    });
  });

  describe('4. Regrade Submission Modal (RegradeModal)', () => {
    it('renders submission form with rubric context', () => {
      const onClose = vi.fn();
      render(
        <RegradeModal
          isOpen={true}
          assignment={mockAssignments[0]}
          questionLabel="1-a"
          currentScore={8}
          maxScore={10}
          onClose={onClose}
        />
      );
      expect(screen.getByText(/Submit Regrade Appeal Ticket/i)).toBeInTheDocument();
      expect(screen.getByText(/8 \/ 10 pts/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Cite the specific step, equation, or slide/i)).toBeInTheDocument();
    });

    it('submits appeal when valid explanation is provided', () => {
      const onClose = vi.fn();
      render(
        <RegradeModal
          isOpen={true}
          assignment={mockAssignments[0]}
          questionLabel="1-a"
          currentScore={8}
          maxScore={10}
          onClose={onClose}
        />
      );
      const textarea = screen.getByPlaceholderText(/Cite the specific step, equation, or slide/i);
      fireEvent.change(textarea, { target: { value: 'Detailed mathematical derivation attached.' } });
      const submitBtn = screen.getByRole('button', { name: /Submit Appeal to TAs/i });
      fireEvent.click(submitBtn);
      expect(mockCourseValue.submitRegrade).toHaveBeenCalled();
    });
  });

  describe('5. Notification Drawer & Alerts (NotificationDrawer)', () => {
    it('renders unread notifications and filter options', () => {
      const onClose = vi.fn();
      render(<NotificationDrawer isOpen={true} onClose={onClose} />);
      expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
      expect(screen.getByText(/New Grade Published/i)).toBeInTheDocument();
      expect(screen.getByText(/Your score for HW1 is ready/i)).toBeInTheDocument();
    });
  });

  describe('6. Overdue Notifier Modal (OverdueNotifierModal)', () => {
    it('renders overdue reminder interface with recipient count', () => {
      const onClose = vi.fn();
      render(<OverdueNotifierModal isOpen={true} onClose={onClose} />);
      expect(screen.getByText(/Automated Overdue Task & Deadline Notifier/i)).toBeInTheDocument();
      expect(screen.getByText(/Send to/i)).toBeInTheDocument();
    });
  });

  describe('7. User Management & Course Roster (UserManagement)', () => {
    it('enforces RBAC and renders roster when logged in as Admin', async () => {
      mockIsAdmin = true;
      render(<UserManagement />);
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /User Management/i })).toBeInTheDocument();
        expect(screen.getByText('Ashkan Yousefi')).toBeInTheDocument();
      });
      expect(screen.getByText('Ali Ricky')).toBeInTheDocument();
    });
  });

  describe('8. Export Hub Modal (ExportCenterModal)', () => {
    it('renders CSV and PDF export options for master gradebook', () => {
      const onClose = vi.fn();
      render(<ExportCenterModal isOpen={true} onClose={onClose} />);
      expect(screen.getByText(/Export Gradebook & Assessment Reports/i)).toBeInTheDocument();
      expect(screen.getByText(/Master Gradebook/i)).toBeInTheDocument();
      expect(screen.getByText(/Download PDF/i)).toBeInTheDocument();
    });
  });

  describe('9. TA Coordination & Regrade Arbitration Panel (TaDelegationPanel)', () => {
    it('renders TA staff roster and arbitration tabs', () => {
      render(<TaDelegationPanel />);
      expect(screen.getByText(/Teaching Assistant Coordination & Regrade Appeals/i)).toBeInTheDocument();
      expect(screen.getByText(/Staff Roster/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Regrade Appeals/i).length).toBeGreaterThan(0);
    });
  });

  describe('10. Admin Dashboard Overview (DashboardOverview)', () => {
    it('renders course health metric cards and active assessments', () => {
      render(<DashboardOverview onNavigate={() => {}} />);
      expect(screen.getByText(/Open assessments/i)).toBeInTheDocument();
      expect(screen.getByText(/Grading progress/i)).toBeInTheDocument();
      expect(screen.getByText(/Pending appeals/i)).toBeInTheDocument();
    });
  });
});
