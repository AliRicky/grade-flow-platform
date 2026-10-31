import { generateCSVContent } from './csv';
import { Assignment, User, StudentAssignmentGrade } from '../types';

describe('csv utils', () => {
  it('generates basic CSV content correctly', () => {
    const assignment: Assignment = {
      id: 'a1',
      title: 'HW1',
      shortCode: 'HW1',
      type: 'homework',
      description: 'Test HW',
      releaseDate: '2023-01-01',
      dueDate: '2023-01-02',
      status: 'closed',
      assignedTAs: [],
      weightPercent: 10,
      totalMaxScore: 100,
      questions: [
        { id: 'q1', number: 1, title: 'Q1', directMaxScore: 50, isBonus: false, subQuestions: [] },
        { id: 'q2', number: 2, title: 'Q2', directMaxScore: 50, isBonus: false, subQuestions: [] }
      ]
    };

    const students: User[] = [
      { id: 'u1', name: 'John Doe', studentId: '12345', role: 'student' }
    ];

    const gradesMap: Record<string, StudentAssignmentGrade> = {
      'u1_a1': {
        studentId: 'u1',
        assignmentId: 'a1',
        scores: { 'q1': 45, 'q2': 40 }
      }
    };

    const csv = generateCSVContent(assignment, students, gradesMap);
    
    // Check headers
    expect(csv).toContain('First Name,Last Name,Student ID,"Q1","Q2",Bonus Points,Raw Total,Final Scaled (/9.0),Numeric Grade (Scale 9)');
    
    // Check row
    expect(csv).toContain('"John","Doe","12345",45,40,0,85.00,7.65,"Grade 8"');
  });
});
