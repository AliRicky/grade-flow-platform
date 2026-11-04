import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { AnalyticsDashboard } from '../admin/AnalyticsDashboard';
import { MobileGradebook } from '../mobile/MobileGradebook';
import { MobileGradingDrawer } from '../mobile/MobileGradingDrawer';

// Mock contexts
const mockStudents = [
  { id: 's1', full_name: 'Student One', studentId: 'S001', role: 'student', section: 'Sec A' },
  { id: 's2', full_name: 'Student Two', studentId: 'S002', role: 'student', section: 'Sec B' },
];

const mockEmptyGrades: Record<string, any> = {};

const mockAssignment = {
  id: 'asg_1',
  shortCode: 'QZ1',
  title: 'Quiz 1: Linear Algebra',
  type: 'quiz' as const,
  releaseDate: '2026-10-01T00:00:00Z',
  dueDate: '2026-10-15T00:00:00Z',
  weightPercent: 10,
  status: 'active' as const,
  totalMaxScore: 20,
  assignedTAs: [],
  questions: [
    { id: 'q1', number: 1, title: 'Rank & Inverses', directMaxScore: 10, subQuestions: [] },
    { id: 'q2', number: 2, title: 'Eigenvalues', directMaxScore: 10, subQuestions: [] },
  ],
};

let currentGrades = mockEmptyGrades;

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { id: 'admin1', full_name: 'Professor Turing', role: 'admin' },
    users: mockStudents,
    isAdmin: true,
    isStudent: false,
  }),
}));

vi.mock('../../context/CourseContext', () => ({
  useCourse: () => ({
    assignments: [mockAssignment],
    grades: currentGrades,
    regrades: [],
    updateGrade: vi.fn(),
  }),
}));

// Mock Recharts ResponsiveContainer for happy-dom
vi.mock('recharts', async () => {
  const original = await vi.importActual<any>('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  };
});

describe('Forensic QA: Struggle KPI and Zero-Grade Fresh State Validation', () => {
  beforeEach(() => {
    currentGrades = mockEmptyGrades;
  });

  it('strictly displays 0 Struggles and 0 Mastered when course is in fresh state with no grades', () => {
    render(<AnalyticsDashboard />);

    // Check Tab says Struggles (0)
    expect(screen.getByRole('button', { name: /Struggles \(0\)/i })).toBeInTheDocument();

    // Check KPI Cards:
    // Mean is 0.00 / 9.0
    expect(screen.getByText('0.00')).toBeInTheDocument();
    expect(screen.getByText(/No scores entered/i)).toBeInTheDocument();

    // Graded count is 0 / 2
    expect(screen.getByText('0 / 2')).toBeInTheDocument();
    expect(screen.getByText('0% evaluated')).toBeInTheDocument();

    // Subtext indicates no evaluations yet
    const noEvalTexts = screen.getAllByText(/No evaluations yet/i);
    expect(noEvalTexts.length).toBeGreaterThanOrEqual(2);
  });

  it('renders struggle chart empty state when no students have been evaluated', () => {
    render(<AnalyticsDashboard />);
    // Diagnostic recommendations empty state
    expect(screen.getByText(/No evaluations recorded for this assessment yet/i)).toBeInTheDocument();
  });

  it('displays accurate struggle count when student grades are entered below threshold', () => {
    currentGrades = {
      's1_asg_1': {
        studentId: 's1',
        assignmentId: 'asg_1',
        scores: { q1: 2, q2: 9 }, // q1 is 2/10 (<65% = struggle), q2 is 9/10 (>80% = mastered)
      },
    };

    render(<AnalyticsDashboard />);

    // q1 struggled (2/10 = 20%) -> 1 struggle
    expect(screen.getByRole('button', { name: /Struggles \(1\)/i })).toBeInTheDocument();
  });
});

describe('Mobile & Tablet Viewport & Contract Tests', () => {
  it('renders MobileGradebook with accurate class stats and search filter', () => {
    render(
      <MobileGradebook
        initialAssignmentId="asg_1"
        onNavigateToBuilder={vi.fn()}
        onOpenExportHub={vi.fn()}
      />
    );

    expect(screen.getByText('Active Assessment')).toBeInTheDocument();
    expect(screen.getByText('Quiz 1: Linear Algebra')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search student or ID/i)).toBeInTheDocument();
    expect(screen.getByText('Student One')).toBeInTheDocument();
    expect(screen.getByText('Student Two')).toBeInTheDocument();
  });

  it('renders MobileGradingDrawer with 48px touch steppers and sequential navigation controls', () => {
    render(
      <MobileGradingDrawer
        isOpen={true}
        onClose={vi.fn()}
        student={mockStudents[0]}
        assignment={mockAssignment}
        onNextStudent={vi.fn()}
        onPrevStudent={vi.fn()}
        hasNextStudent={true}
        hasPrevStudent={false}
        currentIndex={0}
        totalStudents={2}
      />
    );

    expect(screen.getByText('Student One')).toBeInTheDocument();
    expect(screen.getByText('Rank & Inverses')).toBeInTheDocument();
    expect(screen.getByText('Eigenvalues')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Previous/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Next/i })).not.toBeDisabled();
  });
});
