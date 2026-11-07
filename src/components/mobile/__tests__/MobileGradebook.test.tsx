import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { MobileHeader } from '../MobileHeader';
import { MobileBottomNav } from '../MobileBottomNav';
import { MobileMoreSheet } from '../MobileMoreSheet';
import { MobileGradebook } from '../MobileGradebook';
import { MobileGradingDrawer } from '../MobileGradingDrawer';

// Mock contexts
const mockUpdateGrade = vi.fn();

const mockCurrentUser = {
  id: 'admin_1',
  full_name: 'Alan Turing',
  role: 'admin' as const,
  studentId: 'TA001',
  section: 'Engineering'
};

const mockStudents = [
  { id: 'stu_1', full_name: 'Ada Lovelace', role: 'student' as const, studentId: 'CS001', section: 'Section A' },
  { id: 'stu_2', full_name: 'Grace Hopper', role: 'student' as const, studentId: 'CS002', section: 'Section B' }
];

const mockAssignment = {
  id: 'asg_1',
  shortCode: 'HW1',
  title: 'Homework 1: Fundamentals',
  type: 'homework' as const,
  status: 'active' as const,
  weightPercent: 10,
  totalMaxScore: 20,
  releaseDate: '2026-10-01T00:00:00Z',
  dueDate: '2026-10-25T00:00:00Z',
  questions: [
    {
      id: 'q1',
      number: 1,
      title: 'Logic Gates',
      isBonus: false,
      directMaxScore: 10,
      subQuestions: []
    },
    {
      id: 'q2',
      number: 2,
      title: 'Turing Machines',
      isBonus: false,
      directMaxScore: undefined,
      subQuestions: [
        { id: 'sq1', label: '2-a', title: 'State Transitions', maxScore: 5 },
        { id: 'sq2', label: '2-b', title: 'Halting Problem', maxScore: 5 }
      ]
    }
  ],
  assignedTAs: ['admin_1'],
  description: 'First assignment'
};

const mockGrades: Record<string, any> = {
  'stu_1_asg_1': {
    studentId: 'stu_1',
    assignmentId: 'asg_1',
    scores: {
      'q1': 9,
      'q2_sq1': 4.5,
      'q2_sq2': 4.5
    }
  }
};

vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    currentUser: mockCurrentUser,
    users: [mockCurrentUser, ...mockStudents],
    isAdmin: true,
    isStudent: false,
    login: vi.fn(),
    logout: vi.fn()
  }))
}));

vi.mock('../../../context/CourseContext', () => ({
  useCourse: vi.fn(() => ({
    assignments: [mockAssignment],
    grades: mockGrades,
    regrades: [
      { id: 'reg_1', status: 'pending', studentId: 'stu_1', assignmentTitle: 'HW1', questionLabel: '1' }
    ],
    notifications: [
      { id: 'n1', title: 'New Submission', message: 'Ada submitted HW1', read: false, type: 'grade' }
    ],
    isOnline: true,
    updateGrade: mockUpdateGrade,
  }))
}));

vi.mock('../../../context/ThemeContext', () => ({
  useTheme: vi.fn(() => ({
    isDark: true,
    toggleTheme: vi.fn()
  }))
}));

describe('Mobile Ergonomic Suite Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. MobileHeader renders branding, staff badge, notifications count, and user initial', () => {
    render(
      <MobileHeader
        onOpenNotifications={vi.fn()}
        onOpenAuth={vi.fn()}
      />
    );

    expect(screen.getByText('GradeFlow')).toBeInTheDocument();
    expect(screen.getByText('Staff')).toBeInTheDocument();
    expect(screen.getByText('· Alan')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // 1 unread notification
  });

  it('2. MobileBottomNav renders thumb navigation tabs with appeal badge and navigates on tap', () => {
    const handleNavigate = vi.fn();
    const handleOpenMore = vi.fn();

    render(
      <MobileBottomNav
        activeView="gradebook"
        onNavigate={handleNavigate}
        onOpenMore={handleOpenMore}
      />
    );

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Gradebook')).toBeInTheDocument();
    expect(screen.getByText('Assign')).toBeInTheDocument();
    expect(screen.getByText('TA Team')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();

    // Verify appeal badge
    expect(screen.getByText('1')).toBeInTheDocument(); // pending appeal

    // Click Overview tab
    fireEvent.click(screen.getByText('Overview'));
    expect(handleNavigate).toHaveBeenCalledWith('overview');

    // Click More action
    fireEvent.click(screen.getByText('More'));
    expect(handleOpenMore).toHaveBeenCalled();
  });

  it('3. MobileMoreSheet displays administrative tools and fires callbacks', () => {
    const handleNavigate = vi.fn();
    const handleOpenExportHub = vi.fn();
    const handleOpenGoogleSheets = vi.fn();
    const handleOpenOverdue = vi.fn();

    render(
      <MobileMoreSheet
        isOpen={true}
        onClose={vi.fn()}
        onNavigate={handleNavigate}
        onOpenExportHub={handleOpenExportHub}
        onOpenGoogleSheetsModal={handleOpenGoogleSheets}
        onOpenOverdue={handleOpenOverdue}
      />
    );

    expect(screen.getByText('Staff Tools & Utilities')).toBeInTheDocument();
    expect(screen.getByText('Export Center')).toBeInTheDocument();
    expect(screen.getByText('Supabase Database')).toBeInTheDocument();
    expect(screen.getByText('Reminders & Overdue')).toBeInTheDocument();
    expect(screen.getByText('User Management')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Export Center'));
    expect(handleOpenExportHub).toHaveBeenCalled();
  });

  it('4. MobileGradebook renders student cards and allows searching', () => {
    render(<MobileGradebook initialAssignmentId="asg_1" />);

    // Renders active assessment card
    expect(screen.getByText('Homework 1: Fundamentals')).toBeInTheDocument();

    // Renders student cards
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('Grace Hopper')).toBeInTheDocument();

    // Search filter test
    const searchInput = screen.getByPlaceholderText('Search student or ID...');
    fireEvent.change(searchInput, { target: { value: 'Grace' } });

    expect(screen.getByText('Grace Hopper')).toBeInTheDocument();
    expect(screen.queryByText('Ada Lovelace')).not.toBeInTheDocument();
  });

  it('5. MobileGradingDrawer provides 48px touch steppers, preset chips, and updates grades', () => {
    const handleNext = vi.fn();
    const handlePrev = vi.fn();

    render(
      <MobileGradingDrawer
        isOpen={true}
        onClose={vi.fn()}
        student={mockStudents[0]}
        assignment={mockAssignment}
        onNextStudent={handleNext}
        onPrevStudent={handlePrev}
        hasNextStudent={true}
        hasPrevStudent={false}
        currentIndex={0}
        totalStudents={2}
      />
    );

    // Student identity
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText(/CS001/)).toBeInTheDocument();

    // Questions rendered
    expect(screen.getByText('Logic Gates')).toBeInTheDocument();
    expect(screen.getByText('State Transitions')).toBeInTheDocument();

    // Test stepper button
    const increaseBtns = screen.getAllByLabelText(/Increase score/i);
    expect(increaseBtns.length).toBeGreaterThan(0);

    fireEvent.click(increaseBtns[0]);
    expect(mockUpdateGrade).toHaveBeenCalledWith(
      'stu_1',
      'asg_1',
      'q1',
      9.5,
      'Alan Turing'
    );

    // Test quick preset chip "Full"
    const fullChips = screen.getAllByText('Full');
    fireEvent.click(fullChips[0]);
    expect(mockUpdateGrade).toHaveBeenCalledWith(
      'stu_1',
      'asg_1',
      'q1',
      10,
      'Alan Turing'
    );

    // Test Next Student button
    const nextBtn = screen.getByText('Next');
    fireEvent.click(nextBtn);
    expect(handleNext).toHaveBeenCalled();
  });
});
