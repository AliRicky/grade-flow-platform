import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import fs from 'fs';
import path from 'path';

import { MobileGradebook } from '../MobileGradebook';
import { MobileGradingDrawer } from '../MobileGradingDrawer';
import { MobileMoreSheet } from '../MobileMoreSheet';
import { useCourse } from '../../../context/CourseContext';
import { useAuth } from '../../../context/AuthContext';

// Mocks
const mockUpdateGrade = vi.fn();
const mockResetToFreshCourse = vi.fn();
const mockClearAllGrades = vi.fn();
const mockLogout = vi.fn();

const mockAdminUser = {
  id: 'admin_1',
  full_name: 'Grace Hopper',
  role: 'admin' as const,
  studentId: 'TA001',
  section: 'QA Operations',
};

const mockStudents = [
  { id: 'stu_1', full_name: 'Ada Lovelace', role: 'student' as const, studentId: 'CS001', section: 'Sec A' },
  { id: 'stu_2', full_name: 'Margaret Hamilton', role: 'student' as const, studentId: 'CS002', section: 'Sec B' },
];

const mockAssignment = {
  id: 'asg_1',
  shortCode: 'HW1',
  title: 'Homework 1: Fundamentals',
  type: 'homework' as const,
  status: 'active' as const,
  weightPercent: 15,
  totalMaxScore: 20,
  releaseDate: '2026-10-01T00:00:00Z',
  dueDate: '2026-10-25T00:00:00Z',
  questions: [
    {
      id: 'q1',
      number: 1,
      title: 'Logic Circuits',
      isBonus: false,
      directMaxScore: 10,
      subQuestions: [],
    },
    {
      id: 'q2',
      number: 2,
      title: 'State Machines',
      isBonus: false,
      directMaxScore: 10,
      subQuestions: [],
    },
  ],
  assignedTAs: ['admin_1'],
  description: 'First assignment',
};

vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../../context/CourseContext', () => ({
  useCourse: vi.fn(),
}));

describe('Mobile Forensic & Quality Assurance Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = '';

    (useAuth as any).mockReturnValue({
      currentUser: mockAdminUser,
      users: [mockAdminUser, ...mockStudents],
      isAdmin: true,
      isStudent: false,
      logout: mockLogout,
    });

    (useCourse as any).mockReturnValue({
      assignments: [mockAssignment],
      grades: {},
      regrades: [],
      notifications: [],
      isOnline: true,
      updateGrade: mockUpdateGrade,
      resetToFreshCourse: mockResetToFreshCourse,
      clearAllGrades: mockClearAllGrades,
    });
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  describe('1. Single-Finger Scrolling & Viewport Engine Verification', () => {
    it('verifies index.html does not restrict single-finger scrolling with maximum-scale or user-scalable=no', () => {
      const indexHtmlPath = path.resolve(__dirname, '../../../../index.html');
      const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

      expect(htmlContent).toContain('name="viewport"');
      expect(htmlContent).not.toContain('user-scalable=no');
      expect(htmlContent).not.toContain('maximum-scale=1.0');
      expect(htmlContent).toContain('viewport-fit=cover');
    });

    it('verifies index.css sets touch-action: pan-y and overflow-x: clip on html, body, and root', () => {
      const indexCssPath = path.resolve(__dirname, '../../../index.css');
      const cssContent = fs.readFileSync(indexCssPath, 'utf8');

      expect(cssContent).toContain('touch-action: pan-y');
      expect(cssContent).toContain('overflow-x: clip');
      expect(cssContent).toContain('-webkit-overflow-scrolling: touch');
      expect(cssContent).not.toContain('overscroll-behavior-y: none');
    });

    it('verifies MobileGradebook container has touch-pan-y and horizontal picker has touch-pan-x', () => {
      const { container } = render(<MobileGradebook />);

      const rootWrapper = container.firstElementChild as HTMLElement;
      expect(rootWrapper.className).toContain('touch-pan-y');

      const horizontalPicker = container.querySelector('.overflow-x-auto') as HTMLElement;
      expect(horizontalPicker).toBeTruthy();
      expect(horizontalPicker.className).toContain('touch-pan-x');
      expect(horizontalPicker.className).toContain('overscroll-contain');
    });
  });

  describe('2. Fresh New App State Contract (Zero Pre-populated Dummy Grades)', () => {
    it('renders with all students ungraded, 0% progress, and dash average when starting fresh', () => {
      render(<MobileGradebook />);

      // Class Average should be uncalculated dash
      expect(screen.getByText('—')).toBeInTheDocument();
      expect(screen.getByText('Class Average')).toBeInTheDocument();

      // Progress bar should state 0 / 2 students
      expect(screen.getByText('0 / 2 students')).toBeInTheDocument();

      // All students should have "Not Graded" badge
      const notGradedBadges = screen.getAllByText('Not Graded');
      expect(notGradedBadges).toHaveLength(2);

      // Student names are present
      expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
      expect(screen.getByText('Margaret Hamilton')).toBeInTheDocument();
    });

    it('opens MobileGradingDrawer with fresh placeholder inputs when student has no grades', () => {
      render(
        <MobileGradingDrawer
          isOpen={true}
          onClose={vi.fn()}
          student={mockStudents[0]}
          assignment={mockAssignment}
        />
      );

      expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
      expect(screen.getByText('0.00 / 9.0')).toBeInTheDocument();

      // Both inputs should be empty placeholders
      const numberInputs = screen.getAllByPlaceholderText('—');
      expect(numberInputs).toHaveLength(2);
      numberInputs.forEach(input => {
        expect((input as HTMLInputElement).value).toBe('');
      });
    });
  });

  describe('3. Cache Clearing & Fresh Slate Reset Execution', () => {
    it('provides a prominent "Reset to Fresh Course" button in MobileMoreSheet that asks confirmation', async () => {
      render(
        <MobileMoreSheet
          isOpen={true}
          onClose={vi.fn()}
          onNavigate={vi.fn()}
        />
      );

      const resetBtn = screen.getByText('Reset to Fresh Course');
      expect(resetBtn).toBeInTheDocument();
      expect(screen.getByText('Fresh App')).toBeInTheDocument();

      // Click to trigger confirmation
      fireEvent.click(resetBtn);

      expect(screen.getByText('Confirm Fresh Course Reset?')).toBeInTheDocument();
      const confirmBtn = screen.getByText('Yes, Clear All Grades');
      expect(confirmBtn).toBeInTheDocument();

      // Click confirm
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(mockResetToFreshCourse).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('4. Mobile UI Stability & Drawer Lifecycles', () => {
    it('locks document.body.style.overflow to hidden when drawer opens, and restores on close', () => {
      const { unmount } = render(
        <MobileGradingDrawer
          isOpen={true}
          onClose={vi.fn()}
          student={mockStudents[0]}
          assignment={mockAssignment}
        />
      );

      expect(document.body.style.overflow).toBe('hidden');

      unmount();
      expect(document.body.style.overflow).toBe('');
    });

    it('locks document.body.style.overflow to hidden when MobileMoreSheet opens, and restores on close', () => {
      const { unmount } = render(
        <MobileMoreSheet
          isOpen={true}
          onClose={vi.fn()}
          onNavigate={vi.fn()}
        />
      );

      expect(document.body.style.overflow).toBe('hidden');

      unmount();
      expect(document.body.style.overflow).toBe('');
    });

    it('provides accessible 48px steppers and updates score accurately via updateGrade', () => {
      render(
        <MobileGradingDrawer
          isOpen={true}
          onClose={vi.fn()}
          student={mockStudents[0]}
          assignment={mockAssignment}
        />
      );

      const increaseBtn = screen.getByLabelText('Increase score for Q1');
      expect(increaseBtn.className).toContain('w-12 h-12');

      fireEvent.click(increaseBtn);

      expect(mockUpdateGrade).toHaveBeenCalledWith(
        'stu_1',
        'asg_1',
        'q1',
        0.5,
        'Grace Hopper'
      );
    });

    it('navigates seamlessly between students with Next and Previous buttons', () => {
      const onNext = vi.fn();
      const onPrev = vi.fn();

      render(
        <MobileGradingDrawer
          isOpen={true}
          onClose={vi.fn()}
          student={mockStudents[0]}
          assignment={mockAssignment}
          onNextStudent={onNext}
          onPrevStudent={onPrev}
          hasNextStudent={true}
          hasPrevStudent={false}
          currentIndex={0}
          totalStudents={2}
        />
      );

      expect(screen.getByText('1 / 2')).toBeInTheDocument();

      const nextBtn = screen.getByRole('button', { name: /Next/i });
      expect(nextBtn).toBeEnabled();
      fireEvent.click(nextBtn);
      expect(onNext).toHaveBeenCalledTimes(1);

      const prevBtn = screen.getByRole('button', { name: /Previous/i });
      expect(prevBtn).toBeDisabled();
    });
  });
});
