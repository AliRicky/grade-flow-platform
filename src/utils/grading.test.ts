import { describe, it, expect } from 'vitest';
import {
  calculateNumericGrade,
  getNumericGradeScaleBreakdown,
  roundUpToTwoDecimals,
  calculateAssignmentDenominator,
  calculateStudentAssignmentScore,
  calculateSemesterSummary
} from './grading';
import {
  PROFESSOR_STUDENTS,
  PROFESSOR_ASSIGNMENTS,
  PROFESSOR_GRADES,
  PROFESSOR_FINAL_SHEET_TRUTH
} from '../data/professorSemesterData';
import { Assignment } from '../types';

describe('Numeric Grading System (Scale of 9) Exhaustive Suite', () => {
  describe('Grade 9: Mastery / Distinction (90% - 100%+)', () => {
    it('handles perfect 100%', () => {
      const res = calculateNumericGrade(100);
      expect(res.gradeNumber).toBe(9);
      expect(res.scaledValue).toBe(9.0);
      expect(res.label).toBe('Mastery / Distinction');
    });

    it('handles lower bound of Grade 9 exactly at 90%', () => {
      const res = calculateNumericGrade(90);
      expect(res.gradeNumber).toBe(9);
      expect(res.scaledValue).toBe(8.1);
      expect(res.label).toBe('Mastery / Distinction');
    });

    it('clamps scores above 100% from bonus points gracefully', () => {
      const res = calculateNumericGrade(115);
      expect(res.gradeNumber).toBe(9);
      expect(res.scaledValue).toBe(9.0);
      expect(res.label).toBe('Mastery / Distinction');
    });
  });

  describe('Grade 8: Excellent (80% - 89.9%)', () => {
    it('handles upper boundary just below Grade 9 at 89.9%', () => {
      const res = calculateNumericGrade(89.9);
      expect(res.gradeNumber).toBe(8);
      expect(res.scaledValue).toBe(8.1);
      expect(res.label).toBe('Excellent');
    });

    it('handles mid-range at 85%', () => {
      const res = calculateNumericGrade(85);
      expect(res.gradeNumber).toBe(8);
      expect(res.scaledValue).toBe(7.7);
    });

    it('handles exact lower boundary at 80%', () => {
      const res = calculateNumericGrade(80);
      expect(res.gradeNumber).toBe(8);
      expect(res.scaledValue).toBe(7.2);
    });
  });

  describe('Grade 7: Proficient (70% - 79.9%)', () => {
    it('handles 75%', () => {
      const res = calculateNumericGrade(75);
      expect(res.gradeNumber).toBe(7);
      expect(res.scaledValue).toBe(6.8);
      expect(res.label).toBe('Proficient');
    });

    it('handles exact lower boundary at 70%', () => {
      const res = calculateNumericGrade(70);
      expect(res.gradeNumber).toBe(7);
      expect(res.scaledValue).toBe(6.3);
    });
  });

  describe('Grade 6: Good (60% - 69.9%)', () => {
    it('handles 65%', () => {
      const res = calculateNumericGrade(65);
      expect(res.gradeNumber).toBe(6);
      expect(res.scaledValue).toBe(5.9);
      expect(res.label).toBe('Good');
    });

    it('handles exact lower boundary at 60%', () => {
      const res = calculateNumericGrade(60);
      expect(res.gradeNumber).toBe(6);
      expect(res.scaledValue).toBe(5.4);
    });
  });

  describe('Grade 5: Satisfactory (50% - 59.9%)', () => {
    it('handles 55%', () => {
      const res = calculateNumericGrade(55);
      expect(res.gradeNumber).toBe(5);
      expect(res.scaledValue).toBe(5.0);
      expect(res.label).toBe('Satisfactory');
    });

    it('handles exact lower boundary at 50%', () => {
      const res = calculateNumericGrade(50);
      expect(res.gradeNumber).toBe(5);
      expect(res.scaledValue).toBe(4.5);
    });
  });

  describe('Grade 4: Passing (40% - 49.9%)', () => {
    it('handles 45%', () => {
      const res = calculateNumericGrade(45);
      expect(res.gradeNumber).toBe(4);
      expect(res.scaledValue).toBe(4.1);
      expect(res.label).toBe('Passing');
    });

    it('handles exact minimum passing threshold at 40%', () => {
      const res = calculateNumericGrade(40);
      expect(res.gradeNumber).toBe(4);
      expect(res.scaledValue).toBe(3.6);
    });
  });

  describe('Grade 3: Marginal (30% - 39.9%)', () => {
    it('handles 35%', () => {
      const res = calculateNumericGrade(35);
      expect(res.gradeNumber).toBe(3);
      expect(res.scaledValue).toBe(3.2);
      expect(res.label).toBe('Marginal');
    });
  });

  describe('Grade 2: Basic (20% - 29.9%)', () => {
    it('handles 25%', () => {
      const res = calculateNumericGrade(25);
      expect(res.gradeNumber).toBe(2);
      expect(res.scaledValue).toBe(2.3);
      expect(res.label).toBe('Basic');
    });
  });

  describe('Grade 1: Minimal (< 20%)', () => {
    it('handles 15%', () => {
      const res = calculateNumericGrade(15);
      expect(res.gradeNumber).toBe(1);
      expect(res.scaledValue).toBe(1.3); // 15/100 * 9 = 1.35 -> float 1.3
      expect(res.label).toBe('Minimal');
    });

    it('handles 0% floor', () => {
      const res = calculateNumericGrade(0);
      expect(res.gradeNumber).toBe(1);
      expect(res.scaledValue).toBe(0.0);
      expect(res.label).toBe('Minimal');
    });

    it('clamps negative inputs to 0%', () => {
      const res = calculateNumericGrade(-10);
      expect(res.gradeNumber).toBe(1);
      expect(res.scaledValue).toBe(0.0);
    });
  });

  describe('Breakdown Schema & Completeness', () => {
    it('returns all 9 tiers with range and description', () => {
      const breakdown = getNumericGradeScaleBreakdown();
      expect(breakdown).toHaveLength(9);
      expect(breakdown[0].grade).toBe(9);
      expect(breakdown[8].grade).toBe(1);
    });
  });

  describe('Margaret Hamilton Verification: Proportional Normalized Engine Core', () => {
    describe('1. IEEE-754 Precision Defense & roundUpToTwoDecimals', () => {
      it('properly rounds up towards higher number as commanded (2.13453 -> 2.14)', () => {
        expect(roundUpToTwoDecimals(2.13453)).toBe(2.14);
      });

      it('defends against IEEE-754 precision creep on exact fractions (0.1 + 0.2 -> 0.30, not 0.31)', () => {
        expect(roundUpToTwoDecimals(0.1 + 0.2)).toBe(0.3);
      });

      it('does not over-ceil already clean 2-decimal numbers (2.1300000000000001 -> 2.13)', () => {
        expect(roundUpToTwoDecimals(2.13)).toBe(2.13);
        expect(roundUpToTwoDecimals(2.1300000000000001)).toBe(2.13);
      });

      it('ceils micro-differences correctly (2.130001 -> 2.14)', () => {
        expect(roundUpToTwoDecimals(2.130001)).toBe(2.14);
      });

      it('evaluates Professor semester average (8.52 / 9) * 5 = 4.73333... -> 4.74', () => {
        const val = (8.52 / 9) * 5;
        expect(roundUpToTwoDecimals(val)).toBe(4.74);
      });

      it('handles boundary and non-finite numbers safely', () => {
        expect(roundUpToTwoDecimals(0)).toBe(0);
        expect(roundUpToTwoDecimals(1.0)).toBe(1.0);
        expect(roundUpToTwoDecimals(NaN)).toBe(0);
        expect(roundUpToTwoDecimals(Infinity)).toBe(0);
      });
    });

    describe('2. Auto-Calculated Denominator (Standard Questions Only)', () => {
      it('sums only standard questions and excludes bonus questions from denominator', () => {
        const dummyAsg: Assignment = {
          id: 'asg_test',
          type: 'homework',
          title: 'Test HW',
          shortCode: 'THW',
          description: '',
          releaseDate: '',
          dueDate: '',
          weightPercent: 10,
          status: 'closed',
          totalMaxScore: 100, // legacy fallback
          assignedTAs: [],
          questions: [
            { id: 'q1', number: 1, title: 'Q1', directMaxScore: 40, subQuestions: [] },
            { id: 'q2', number: 2, title: 'Q2', directMaxScore: 60, subQuestions: [] },
            { id: 'q_bonus', number: 3, title: 'Bonus Q', directMaxScore: 20, subQuestions: [], isBonus: true }
          ]
        };

        const denom = calculateAssignmentDenominator(dummyAsg);
        expect(denom).toBe(100); // 40 + 60, excluding the 20 bonus points!
      });

      it('correctly handles multi-part subquestions in auto-denominator', () => {
        const dummyAsg: Assignment = {
          id: 'asg_multi',
          type: 'homework',
          title: 'Multipart HW',
          shortCode: 'MHW',
          description: '',
          releaseDate: '',
          dueDate: '',
          weightPercent: 10,
          status: 'closed',
          totalMaxScore: 0,
          assignedTAs: [],
          questions: [
            {
              id: 'q1',
              number: 1,
              title: 'Problem 1',
              subQuestions: [
                { id: 'sq1', label: '1-a', title: 'Part A', maxScore: 15 },
                { id: 'sq2', label: '1-b', title: 'Part B', maxScore: 25 },
              ]
            },
            {
              id: 'q2',
              number: 2,
              title: 'Problem 2 (Bonus)',
              isBonus: true,
              subQuestions: [
                { id: 'sq3', label: '2-a', title: 'Part A', maxScore: 20 },
              ]
            }
          ]
        };

        expect(calculateAssignmentDenominator(dummyAsg)).toBe(40); // 15 + 25
      });
    });

    describe('3. Uncapped Bonus Overflow & Proportional Scoring', () => {
      it('allows score to legitimately exceed 1.0 when bonus points are earned', () => {
        const asg: Assignment = {
          id: 'asg_hw1',
          type: 'homework',
          title: 'HW1',
          shortCode: 'HW1',
          description: '',
          releaseDate: '',
          dueDate: '',
          weightPercent: 10,
          targetScale: 1.0,
          totalMaxScore: 600,
          assignedTAs: [],
          questions: [
            { id: 'q1', number: 1, title: 'Standard Q', directMaxScore: 600, subQuestions: [] },
            { id: 'q_bonus', number: 2, title: 'Bonus', directMaxScore: 60, subQuestions: [], isBonus: true },
          ]
        };

        // Student achieves perfect on standard + half on bonus
        const scores = {
          q1: 600,
          q_bonus: 30,
        };

        const result = calculateStudentAssignmentScore(asg, scores);
        expect(result.standardEarned).toBe(600);
        expect(result.bonusEarned).toBe(30);
        expect(result.totalEarned).toBe(630);
        expect(result.standardDenominator).toBe(600);
        expect(result.exactScore).toBe(1.05);
        expect(result.displayScore).toBe(1.05);
        expect(result.isOverflow).toBe(true);
      });

      it('scales score correctly with custom assignment multiplier (e.g. scale of 3)', () => {
        const asg: Assignment = {
          id: 'asg_scaled',
          type: 'homework',
          title: 'Scaled HW',
          shortCode: 'SHW',
          description: '',
          releaseDate: '',
          dueDate: '',
          weightPercent: 10,
          targetScale: 3.0, // Professor specified scale of 3
          totalMaxScore: 100,
          assignedTAs: [],
          questions: [
            { id: 'q1', number: 1, title: 'Standard Q', directMaxScore: 100, subQuestions: [] },
            { id: 'q_bonus', number: 2, title: 'Bonus', directMaxScore: 20, subQuestions: [], isBonus: true },
          ]
        };

        // Student scores 80 standard + 10 bonus = 90 / 100 * 3.0 = 2.70
        const scores = { q1: 80, q_bonus: 10 };
        const result = calculateStudentAssignmentScore(asg, scores);
        expect(result.exactScore).toBe(2.7);
        expect(result.displayScore).toBe(2.7);
        expect(result.targetScale).toBe(3.0);

        // Student with overflow: 100 standard + 20 bonus = 120 / 100 * 3.0 = 3.60
        const overflowScores = { q1: 100, q_bonus: 20 };
        const overflowResult = calculateStudentAssignmentScore(asg, overflowScores);
        expect(overflowResult.exactScore).toBeCloseTo(3.6, 5);
        expect(overflowResult.displayScore).toBe(3.6);
        expect(overflowResult.isOverflow).toBe(true);
      });
    });

    describe('4. Semester Multi-Assignment Aggregation & Target Scale Configurations', () => {
      it('supports customizable semester target scales: 5.0, 6.0, 9.0, 20.0 (proportional scaling)', () => {
        const summary5 = calculateSemesterSummary({
          assignments: PROFESSOR_ASSIGNMENTS,
          students: PROFESSOR_STUDENTS,
          grades: PROFESSOR_GRADES,
          semesterScale: 5.0,
          weightMode: 'equal',
          scaleMode: 'proportional',
        });

        const summary20 = calculateSemesterSummary({
          assignments: PROFESSOR_ASSIGNMENTS,
          students: PROFESSOR_STUDENTS,
          grades: PROFESSOR_GRADES,
          semesterScale: 20.0,
          weightMode: 'equal',
          scaleMode: 'proportional',
        });

        expect(summary5).toHaveLength(29);
        expect(summary20).toHaveLength(29);

        // For any student, scale 20 score is 4x scale 5 score prior to rounding
        summary5.forEach((s5, idx) => {
          const s20 = summary20[idx];
          expect(s20.exactSemesterTotal).toBeCloseTo(s5.exactSemesterTotal * 4, 5);
        });
      });

      it('verifies high-achieving bonus overflow students exceed semester nominal target', () => {
        const summary = calculateSemesterSummary({
          assignments: PROFESSOR_ASSIGNMENTS,
          students: PROFESSOR_STUDENTS,
          grades: PROFESSOR_GRADES,
          semesterScale: 5.0,
          weightMode: 'equal',
          scaleMode: 'proportional',
        });

        // Find Student 14 (ID 4032019016) and Student 17 (ID 4032019020)
        const pouria = summary.find(s => s.studentNumber === '4032019016');
        const fatemeh = summary.find(s => s.studentNumber === '4032019020');
        const kasra = summary.find(s => s.studentNumber === '4032019022');
        const nafiseh = summary.find(s => s.studentNumber === '4032019032');

        expect(pouria).toBeDefined();
        expect(pouria!.displaySemesterTotal).toBeGreaterThan(5.0);
        expect(pouria!.isSemesterOverflow).toBe(true);

        expect(fatemeh).toBeDefined();
        expect(fatemeh!.displaySemesterTotal).toBeGreaterThan(5.0);
        expect(fatemeh!.isSemesterOverflow).toBe(true);

        expect(kasra).toBeDefined();
        expect(kasra!.displaySemesterTotal).toBeGreaterThan(5.0);
        expect(kasra!.isSemesterOverflow).toBe(true);

        expect(nafiseh).toBeDefined();
        expect(nafiseh!.displaySemesterTotal).toBeGreaterThan(5.0);
        expect(nafiseh!.isSemesterOverflow).toBe(true);
      });
    });

    describe('5. Complete Forensic Verification against Professor 10-Table Ground Truth', () => {
      it('matches all 29 students final semester scores when aggregated from Sheet 10 assignment scores', () => {
        PROFESSOR_FINAL_SHEET_TRUTH.forEach(truth => {
          const scores = Object.values(truth.assignmentScores);
          const sumScores = scores.reduce((acc, v) => acc + v, 0);
          const exact = (sumScores / 9.0) * 5.0;
          const display = roundUpToTwoDecimals(exact);

          const diff = Math.abs(display - truth.excelFinalScore);
          expect(diff).toBeLessThanOrEqual(0.02);
        });
      });

      it('matches 26 regular students from raw question scores, and documents forensic manual override exceptions', () => {
        const summary = calculateSemesterSummary({
          assignments: PROFESSOR_ASSIGNMENTS,
          students: PROFESSOR_STUDENTS,
          grades: PROFESSOR_GRADES,
          semesterScale: 5.0,
          weightMode: 'equal',
          scaleMode: 'proportional',
        });

        expect(summary).toHaveLength(PROFESSOR_FINAL_SHEET_TRUTH.length);

        PROFESSOR_FINAL_SHEET_TRUTH.forEach(truth => {
          const calcStudent = summary.find(s => s.studentNumber === truth.studentNumber);
          expect(calcStudent).toBeDefined();

          if (truth.studentNumber === '4012019005') {
            // Student 03: TA applied 60% late penalty on HW5 (*0.4 -> 0.45) and manual overrides in Sheet 10 (HW1=0.8, HW2=0.8)
            // Raw question calculations yield 0.84 (HW5=1.13, Q4=0.38) vs Sheet 10 override total 1.35
            expect(calcStudent!.displaySemesterTotal).toBe(0.84);
            expect(truth.excelFinalScore).toBe(1.35);
          } else if (truth.studentNumber === '4043333073') {
            // Student 13: TA applied 30% late penalty on HW5 (*0.7 -> 0.66) and manual overrides in Sheet 10 (HW1=0.8, HW2=0.8)
            // Raw question calculations yield 1.47 (HW4=0.71, HW5=0.94, Q3=0.25, Q4=0.75) vs Sheet 10 override total 2.20
            expect(calcStudent!.displaySemesterTotal).toBe(1.47);
            expect(truth.excelFinalScore).toBe(2.2);
          } else if (truth.studentNumber === '4002019042') {
            // Fatemeh Hooshjan: TA entered manual offline credits in Sheet 10 (HW1=0.5, HW2=0.4 -> 0.9/9*5 = +0.50 pts)
            // Raw question calculations yield 2.07 vs Sheet 10 override total 2.56
            expect(calcStudent!.displaySemesterTotal).toBe(2.07);
            expect(truth.excelFinalScore).toBe(2.56);
          } else {
            const diff = calcStudent!.displaySemesterTotal - truth.excelFinalScore;
            const cleanDiff = Math.round(diff * 100) / 100;
            // Diff is within [-0.03, +0.05], allowing slight positive variance for uncapped bonus questions
            // (e.g., Student 14 who scored 135/120 on Q1 with 15 bonus points, yielding 5.44 vs 5.40)
            expect(cleanDiff).toBeGreaterThanOrEqual(-0.03);
            expect(cleanDiff).toBeLessThanOrEqual(0.05);
          }
        });
      });

      it('verifies TA late penalty formulas (Student 03: 540/480*0.40 -> 0.45, Student 13: 450/480*0.70 -> 0.66)', () => {
        const mahanLate = roundUpToTwoDecimals((540 / 480) * 0.40);
        expect(mahanLate).toBe(0.45);

        const armitaLate = roundUpToTwoDecimals((450 / 480) * 0.70);
        expect(armitaLate).toBe(0.66);
      });
    });

    describe('6. Solid Assignment Score Semantics & Direct Sum Verification', () => {
      it('calculates direct solid sum when assignments have varied solid scores (1.0, 1.0, 3.0 = 5.0)', () => {
        const asgList: Assignment[] = [
          {
            id: 'asg_hw1',
            type: 'homework',
            title: 'HW1',
            shortCode: 'HW1',
            description: '',
            releaseDate: '',
            dueDate: '',
            weightPercent: 0,
            targetScale: 1.0,
            totalMaxScore: 100,
            assignedTAs: [],
            questions: [{ id: 'q1', number: 1, title: 'Q1', directMaxScore: 100, subQuestions: [] }]
          },
          {
            id: 'asg_hw2',
            type: 'homework',
            title: 'HW2',
            shortCode: 'HW2',
            description: '',
            releaseDate: '',
            dueDate: '',
            weightPercent: 0,
            targetScale: 1.0,
            totalMaxScore: 100,
            assignedTAs: [],
            questions: [{ id: 'q1', number: 1, title: 'Q1', directMaxScore: 100, subQuestions: [] }]
          },
          {
            id: 'asg_quiz',
            type: 'quiz',
            title: 'Quiz 1',
            shortCode: 'Q1',
            description: '',
            releaseDate: '',
            dueDate: '',
            weightPercent: 0,
            targetScale: 3.0,
            totalMaxScore: 100,
            assignedTAs: [],
            questions: [{ id: 'q1', number: 1, title: 'Q1', directMaxScore: 100, subQuestions: [] }]
          }
        ];

        const testStudent: User = {
          id: 'stu_1',
          email: 'student@uni.edu',
          full_name: 'Sara Rad',
          role: 'student',
          studentId: '403100200',
        };

        // Student scores 100% on HW1 (1.0/1.0), 50% on HW2 (0.5/1.0), and 80% on Quiz (2.4/3.0)
        // Solid scores: 1.0 + 0.5 + 2.4 = 3.9 out of total capacity 5.0
        const grades = {
          'stu_1_asg_hw1': { assignmentId: 'asg_hw1', studentId: 'stu_1', scores: { q1: 100 }, gradedBy: 'ta', gradedAt: '' },
          'stu_1_asg_hw2': { assignmentId: 'asg_hw2', studentId: 'stu_1', scores: { q1: 50 }, gradedBy: 'ta', gradedAt: '' },
          'stu_1_asg_quiz': { assignmentId: 'asg_quiz', studentId: 'stu_1', scores: { q1: 80 }, gradedBy: 'ta', gradedAt: '' },
        };

        // Case 1: Direct solid score sum when semesterScale equals 5.0 (sum of target scores)
        const summaryDirect = calculateSemesterSummary({
          assignments: asgList,
          students: [testStudent],
          grades,
          semesterScale: 5.0,
        });

        expect(summaryDirect[0].assignmentScores['asg_hw1'].exactScore).toBe(1.0);
        expect(summaryDirect[0].assignmentScores['asg_hw2'].exactScore).toBe(0.5);
        expect(summaryDirect[0].assignmentScores['asg_quiz'].exactScore).toBeCloseTo(2.4, 5);
        expect(summaryDirect[0].assignmentScores['asg_quiz'].displayScore).toBe(2.4);
        expect(summaryDirect[0].exactSemesterTotal).toBeCloseTo(3.9, 5);
        expect(summaryDirect[0].displaySemesterTotal).toBe(3.9);

        // Case 2: Proportional scaling when professor sets Semester Target Scale to 20.0 with scaleMode: 'proportional'
        // (3.9 / 5.0) * 20.0 = 15.60
        const summaryScaled = calculateSemesterSummary({
          assignments: asgList,
          students: [testStudent],
          grades,
          semesterScale: 20.0,
          scaleMode: 'proportional',
        });

        expect(summaryScaled[0].exactSemesterTotal).toBeCloseTo(15.6, 5);
        expect(summaryScaled[0].displaySemesterTotal).toBe(15.6);
      });
    });

    describe('7. Cumulative Semester Progress (Professor Ground Truth & Reyhane Darbandi Scenario)', () => {
      it('calculates cumulative solid score when only HW1 is assigned: 1.0 out of 9 yields 1.00 (NOT 9.00)', () => {
        const hw1: Assignment = {
          id: 'asg_hw1',
          type: 'homework',
          title: 'HW1 Assessment',
          shortCode: 'HW1',
          description: '',
          releaseDate: '',
          dueDate: '',
          weightPercent: 0,
          targetScale: 1.0,
          totalMaxScore: 100,
          assignedTAs: [],
          questions: [{ id: 'q1', number: 1, title: 'Q1', directMaxScore: 100, subQuestions: [] }],
        };

        const reyhane: User = {
          id: 'stu_reyhane',
          email: 'reyhane@uni.edu',
          full_name: 'Reyhane Darbandi',
          role: 'student',
          studentId: '4032019003',
        };

        // Reyhane scored 100% on HW1 (1.00 solid points)
        const grades = {
          'stu_reyhane_asg_hw1': {
            assignmentId: 'asg_hw1',
            studentId: 'stu_reyhane',
            scores: { q1: 100 },
            gradedBy: 'ta',
            gradedAt: '',
          },
        };

        // Semester target scale is 9
        const summary = calculateSemesterSummary({
          assignments: [hw1],
          students: [reyhane],
          grades,
          semesterScale: 9.0,
        });

        expect(summary).toHaveLength(1);
        const stuSummary = summary[0];
        expect(stuSummary.assignmentScores['asg_hw1'].exactScore).toBe(1.0);
        expect(stuSummary.assignmentScores['asg_hw1'].displayScore).toBe(1.0);
        // CRITICAL: Final total MUST be 1.00 out of 9, NOT artificially scaled up to 9.00!
        expect(stuSummary.exactSemesterTotal).toBe(1.0);
        expect(stuSummary.displaySemesterTotal).toBe(1.0);
        expect(stuSummary.semesterScale).toBe(9.0);
        expect(stuSummary.isSemesterOverflow).toBe(false);
      });

      it('accumulates scores progressively as more assignments are assigned (HW1 -> HW2 -> HW3)', () => {
        const hw1: Assignment = {
          id: 'asg_hw1',
          type: 'homework',
          title: 'HW1',
          shortCode: 'HW1',
          description: '',
          releaseDate: '',
          dueDate: '',
          weightPercent: 0,
          targetScale: 1.0,
          totalMaxScore: 100,
          assignedTAs: [],
          questions: [{ id: 'q1', number: 1, title: 'Q1', directMaxScore: 100, subQuestions: [] }],
        };

        const hw2: Assignment = {
          id: 'asg_hw2',
          type: 'homework',
          title: 'HW2',
          shortCode: 'HW2',
          description: '',
          releaseDate: '',
          dueDate: '',
          weightPercent: 0,
          targetScale: 1.0,
          totalMaxScore: 100,
          assignedTAs: [],
          questions: [{ id: 'q1', number: 1, title: 'Q1', directMaxScore: 100, subQuestions: [] }],
        };

        const hw3: Assignment = {
          id: 'asg_hw3',
          type: 'homework',
          title: 'HW3',
          shortCode: 'HW3',
          description: '',
          releaseDate: '',
          dueDate: '',
          weightPercent: 0,
          targetScale: 1.0,
          totalMaxScore: 100,
          assignedTAs: [],
          questions: [{ id: 'q1', number: 1, title: 'Q1', directMaxScore: 100, subQuestions: [] }],
        };

        const reyhane: User = {
          id: 'stu_reyhane',
          email: 'reyhane@uni.edu',
          full_name: 'Reyhane Darbandi',
          role: 'student',
          studentId: '4032019003',
        };

        const grades = {
          'stu_reyhane_asg_hw1': { assignmentId: 'asg_hw1', studentId: 'stu_reyhane', scores: { q1: 100 }, gradedBy: 'ta', gradedAt: '' },
          'stu_reyhane_asg_hw2': { assignmentId: 'asg_hw2', studentId: 'stu_reyhane', scores: { q1: 100 }, gradedBy: 'ta', gradedAt: '' },
          'stu_reyhane_asg_hw3': { assignmentId: 'asg_hw3', studentId: 'stu_reyhane', scores: { q1: 85 }, gradedBy: 'ta', gradedAt: '' },
        };

        // Step 1: After HW1
        const s1 = calculateSemesterSummary({
          assignments: [hw1],
          students: [reyhane],
          grades,
          semesterScale: 9.0,
        });
        expect(s1[0].displaySemesterTotal).toBe(1.0);

        // Step 2: After HW2 (1.0 + 1.0 = 2.0)
        const s2 = calculateSemesterSummary({
          assignments: [hw1, hw2],
          students: [reyhane],
          grades,
          semesterScale: 9.0,
        });
        expect(s2[0].displaySemesterTotal).toBe(2.0);

        // Step 3: After HW3 (1.0 + 1.0 + 0.85 = 2.85)
        const s3 = calculateSemesterSummary({
          assignments: [hw1, hw2, hw3],
          students: [reyhane],
          grades,
          semesterScale: 9.0,
        });
        expect(s3[0].displaySemesterTotal).toBe(2.85);
      });

      it('correctly handles bonus points during cumulative accumulation', () => {
        const hw1: Assignment = {
          id: 'asg_hw1',
          type: 'homework',
          title: 'HW1',
          shortCode: 'HW1',
          description: '',
          releaseDate: '',
          dueDate: '',
          weightPercent: 0,
          targetScale: 1.0,
          totalMaxScore: 100,
          assignedTAs: [],
          questions: [
            { id: 'q1', number: 1, title: 'Q1', directMaxScore: 100, subQuestions: [] },
            { id: 'q_bonus', number: 2, title: 'Bonus', directMaxScore: 20, subQuestions: [], isBonus: true },
          ],
        };

        const reyhane: User = {
          id: 'stu_reyhane',
          email: 'reyhane@uni.edu',
          full_name: 'Reyhane Darbandi',
          role: 'student',
          studentId: '4032019003',
        };

        // Reyhane scored 100 standard + 20 bonus = 120 / 100 * 1.0 = 1.20 pts
        const grades = {
          'stu_reyhane_asg_hw1': {
            assignmentId: 'asg_hw1',
            studentId: 'stu_reyhane',
            scores: { q1: 100, q_bonus: 20 },
            gradedBy: 'ta',
            gradedAt: '',
          },
        };

        const summary = calculateSemesterSummary({
          assignments: [hw1],
          students: [reyhane],
          grades,
          semesterScale: 9.0,
        });

        expect(summary[0].assignmentScores['asg_hw1'].exactScore).toBe(1.2);
        expect(summary[0].assignmentScores['asg_hw1'].displayScore).toBe(1.2);
        expect(summary[0].assignmentScores['asg_hw1'].isOverflow).toBe(true);
        expect(summary[0].displaySemesterTotal).toBe(1.2);
      });
    });
  });
});
