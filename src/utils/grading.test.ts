import { describe, it, expect } from 'vitest';
import { calculateNumericGrade, getNumericGradeScaleBreakdown } from './grading';

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

  describe('Dynamic Multi-Scale Grading (Scale of 20 - European/French/Iranian Standard)', () => {
    const scale20: import('../types').GradingScale = {
      type: 'numeric',
      max_score: 20.0,
      passing_threshold: 10.0,
      precision: 1,
      label: '20-Point Scale',
    };

    it('correctly scales 100% to 20.0 and marks as passing', () => {
      const res = calculateNumericGrade(100, scale20);
      expect(res.maxScore).toBe(20.0);
      expect(res.scaledValue).toBe(20.0);
      expect(res.displayGrade).toBe('20.0 / 20');
      expect(res.isPassing).toBe(true);
      expect(res.label).toBe('Mastery / Distinction');
    });

    it('correctly scales 85% to 17.0 and marks as passing Excellent', () => {
      const res = calculateNumericGrade(85, scale20);
      expect(res.scaledValue).toBe(17.0);
      expect(res.displayGrade).toBe('17.0 / 20');
      expect(res.isPassing).toBe(true);
      expect(res.label).toBe('Excellent');
    });

    it('correctly identifies exact passing boundary at 50% (10.0 / 20)', () => {
      const res = calculateNumericGrade(50, scale20);
      expect(res.scaledValue).toBe(10.0);
      expect(res.isPassing).toBe(true);
      expect(res.label).toBe('Satisfactory');
    });

    it('correctly detects failing status below 10.0 threshold at 45% (9.0 / 20)', () => {
      const res = calculateNumericGrade(45, scale20);
      expect(res.scaledValue).toBe(9.0);
      expect(res.isPassing).toBe(false);
      expect(res.label).toBe('Marginal');
    });

    it('correctly handles low scores at 25% (5.0 / 20)', () => {
      const res = calculateNumericGrade(25, scale20);
      expect(res.scaledValue).toBe(5.0);
      expect(res.isPassing).toBe(false);
      expect(res.label).toBe('Basic');
    });
  });

  describe('Dynamic Multi-Scale Grading (Scale of 100 - US Standard Percentage)', () => {
    const scale100: import('../types').GradingScale = {
      type: 'numeric',
      max_score: 100.0,
      passing_threshold: 60.0,
      precision: 1,
      label: '100-Point Percentage Scale',
    };

    it('correctly outputs 100.0 for 100%', () => {
      const res = calculateNumericGrade(100, scale100);
      expect(res.scaledValue).toBe(100.0);
      expect(res.displayGrade).toBe('100.0 / 100');
      expect(res.isPassing).toBe(true);
    });

    it('correctly outputs 75.0 for 75%', () => {
      const res = calculateNumericGrade(75, scale100);
      expect(res.scaledValue).toBe(75.0);
      expect(res.isPassing).toBe(true);
      expect(res.label).toBe('Proficient');
    });

    it('dynamically switches passing at 60.0 threshold', () => {
      const passRes = calculateNumericGrade(60, scale100);
      expect(passRes.scaledValue).toBe(60.0);
      expect(passRes.isPassing).toBe(true);

      const failRes = calculateNumericGrade(59.9, scale100);
      expect(failRes.scaledValue).toBe(59.9);
      expect(failRes.isPassing).toBe(false);
    });
  });

  describe('Arbitrary Custom Numeric Scales & Precision', () => {
    it('supports custom 50-point scale with 25 passing threshold', () => {
      const scale50: import('../types').GradingScale = {
        type: 'numeric',
        max_score: 50,
        passing_threshold: 25,
        precision: 1,
      };

      const res80 = calculateNumericGrade(80, scale50);
      expect(res80.scaledValue).toBe(40.0);
      expect(res80.isPassing).toBe(true);

      const res48 = calculateNumericGrade(48, scale50);
      expect(res48.scaledValue).toBe(24.0);
      expect(res48.isPassing).toBe(false);
    });

    it('supports 4.0 GPA scale with 2 decimal places', () => {
      const gpaScale: import('../types').GradingScale = {
        type: 'numeric',
        max_score: 4.0,
        passing_threshold: 2.0,
        precision: 2,
      };

      const res = calculateNumericGrade(87.5, gpaScale);
      expect(res.scaledValue).toBe(3.5);
      expect(res.displayGrade).toBe('3.50 / 4');
      expect(res.isPassing).toBe(true);
    });
  });
});
