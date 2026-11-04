import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area
} from 'recharts';
import {
  AlertTriangle,
  Award,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Lightbulb,
  CheckCircle2,
  ChevronDown,
  Filter,
  Users,
  Layers,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { useCourse } from '../../context/CourseContext';
import { DEFAULT_GRADING_SCALE } from '../../utils/grading';
import { useAuth } from '../../context/AuthContext';
import { Assignment, Question, SubQuestion } from '../../types';

export const AnalyticsDashboard: React.FC = () => {
  const { assignments, grades, gradingScale: rawScale } = useCourse();
  const gradingScale = rawScale || DEFAULT_GRADING_SCALE;
  const { users } = useAuth();

  const students = useMemo(() => users.filter(u => u.role === 'student'), [users]);

  // Selected assignment for deep-dive struggle analysis
  const [selectedAsgId, setSelectedAsgId] = useState<string>(() => {
    return assignments[0]?.id || '';
  });

  const [activeMetricTab, setActiveMetricTab] = useState<'distribution' | 'struggle' | 'trends'>('distribution');

  const currentAssignment = useMemo(() => {
    return assignments.find(a => a.id === selectedAsgId) || assignments[0];
  }, [assignments, selectedAsgId]);

  // 1. Calculate Score Distribution for Selected Assessment (out of 9, max 9)
  const distributionData = useMemo(() => {
    if (!currentAssignment) {
      return {
        buckets: [] as Array<{ range: string; label: string; count: number; min: number; max: number; color: string; description: string }>,
        classAverage: 0,
        gradedStudentsCount: 0,
      };
    }

    const m = gradingScale.max_score;
    const p = gradingScale.precision ?? 1;
    const pass = gradingScale.passing_threshold;

    const buckets = m === 9 ? [
      { range: '< 4.5', label: 'Struggle (<4.5)', count: 0, min: 0, max: 4.5, color: '#EF4444', description: 'Requires intervention' },
      { range: '4.5–5.3', label: 'Satisfactory (G5)', count: 0, min: 4.5, max: 5.4, color: '#FBBF24', description: 'Satisfactory baseline' },
      { range: '5.4–6.2', label: 'Good (G6)', count: 0, min: 5.4, max: 6.3, color: '#38BDF8', description: 'Competent execution' },
      { range: '6.3–7.1', label: 'Proficient (G7)', count: 0, min: 6.3, max: 7.2, color: '#2DD4BF', description: 'Solid comprehension' },
      { range: '7.2–8.0', label: 'Distinction (G8)', count: 0, min: 7.2, max: 8.1, color: '#10B981', description: 'Comprehensive domain understanding' },
      { range: '8.1–9.0', label: 'Mastery (G9)', count: 0, min: 8.1, max: 9.01, color: '#3B82F6', description: 'Exemplary mastery (Top Band)' },
    ] : [
      { range: `< ${pass.toFixed(p)}`, label: `At Risk (<${pass.toFixed(p)})`, count: 0, min: 0, max: pass, color: '#EF4444', description: 'Requires intervention' },
      { range: `${pass.toFixed(p)}–${(m * 0.6).toFixed(p)}`, label: 'Passing', count: 0, min: pass, max: m * 0.6, color: '#FBBF24', description: 'Baseline pass attainment' },
      { range: `${(m * 0.6).toFixed(p)}–${(m * 0.7).toFixed(p)}`, label: 'Good', count: 0, min: m * 0.6, max: m * 0.7, color: '#38BDF8', description: 'Competent execution' },
      { range: `${(m * 0.7).toFixed(p)}–${(m * 0.8).toFixed(p)}`, label: 'Proficient', count: 0, min: m * 0.7, max: m * 0.8, color: '#2DD4BF', description: 'Solid comprehension' },
      { range: `${(m * 0.8).toFixed(p)}–${(m * 0.9).toFixed(p)}`, label: 'Distinction', count: 0, min: m * 0.8, max: m * 0.9, color: '#10B981', description: 'Comprehensive domain understanding' },
      { range: `${(m * 0.9).toFixed(p)}–${m.toFixed(p)}`, label: 'Mastery', count: 0, min: m * 0.9, max: m + 0.01, color: '#3B82F6', description: 'Exemplary mastery (Top Band)' },
    ];

    let totalScoreSum = 0;
    let gradedStudentsCount = 0;

    students.forEach(student => {
      const studentGrade = grades[`${student.id}_${currentAssignment.id}`];
      if (!studentGrade) return;

      let earned = 0;
      let bonus = 0;
      let hasAnyScore = false;

      const questions = Array.isArray(currentAssignment?.questions) ? currentAssignment.questions : [];
      questions.forEach(q => {
        if (q.subQuestions && q.subQuestions.length > 0) {
          q.subQuestions.forEach(sq => {
            const v = studentGrade.scores?.[`${q.id}_${sq.id}`];
            if (v !== undefined && v !== null) {
              hasAnyScore = true;
              if (q.isBonus) bonus += v;
              else earned += v;
            }
          });
        } else {
          const v = studentGrade.scores?.[q.id];
          if (v !== undefined && v !== null) {
            hasAnyScore = true;
            if (q.isBonus) bonus += v;
            else earned += v;
          }
        }
      });

      if (hasAnyScore) {
        gradedStudentsCount++;
        const raw = earned + bonus;
        const scaled = currentAssignment.totalMaxScore > 0
          ? Math.min(m, Math.round(((raw / currentAssignment.totalMaxScore) * m) * 100) / 100)
          : Math.min(m, raw);

        totalScoreSum += scaled;

        for (const bucket of buckets) {
          if (scaled >= bucket.min && (scaled < bucket.max || (bucket.max >= m && scaled <= m + 0.01))) {
            bucket.count++;
            break;
          }
        }
      }
    });

    const classAverage = gradedStudentsCount > 0 ? totalScoreSum / gradedStudentsCount : 0;

    return {
      buckets,
      classAverage,
      gradedStudentsCount,
    };
  }, [currentAssignment, students, grades, gradingScale]);

  // 2. Calculate Question-by-Question Difficulty & Struggle Points
  const questionStruggleData = useMemo(() => {
    if (!currentAssignment) return [];

    interface StruggleItem {
      id: string;
      label: string;
      title: string;
      maxScore: number;
      avgScore: number;
      percentage: number;
      strugglingStudentsCount: number; // scored < 70% of max
      avgDeduction: number;
      isBonus?: boolean;
      status: 'high_struggle' | 'moderate_struggle' | 'mastered' | 'unassessed';
      gradedCount: number;
    }

    const items: StruggleItem[] = [];

    const questions = Array.isArray(currentAssignment?.questions) ? currentAssignment.questions : [];
    questions.forEach(q => {
      if (q.subQuestions && q.subQuestions.length > 0) {
        q.subQuestions.forEach(sq => {
          let scoreSum = 0;
          let count = 0;
          let strugglingCount = 0;

          students.forEach(s => {
            const val = grades[`${s.id}_${currentAssignment.id}`]?.scores?.[`${q.id}_${sq.id}`];
            if (val !== undefined && val !== null) {
              scoreSum += val;
              count++;
              if (sq.maxScore > 0 && (val / sq.maxScore) < 0.70) {
                strugglingCount++;
              }
            }
          });

          // Strictly unassessed when no student grades are recorded
          const avg = count > 0 ? scoreSum / count : 0;
          const pct = count > 0 && sq.maxScore > 0 ? (avg / sq.maxScore) * 100 : 0;
          const status = count === 0
            ? 'unassessed'
            : pct < 65
            ? 'high_struggle'
            : pct < 80
            ? 'moderate_struggle'
            : 'mastered';

          items.push({
            id: `${q.id}_${sq.id}`,
            label: sq.label || `${q.number}-${sq.id}`,
            title: sq.title,
            maxScore: sq.maxScore,
            avgScore: Math.round(avg * 10) / 10,
            percentage: Math.round(pct),
            strugglingStudentsCount: strugglingCount,
            avgDeduction: count > 0 ? Math.round((sq.maxScore - avg) * 10) / 10 : 0,
            isBonus: q.isBonus,
            status,
            gradedCount: count,
          });
        });
      } else {
        let scoreSum = 0;
        let count = 0;
        let strugglingCount = 0;
        const max = q.directMaxScore || 10;

        students.forEach(s => {
          const val = grades[`${s.id}_${currentAssignment.id}`]?.scores?.[q.id];
          if (val !== undefined && val !== null) {
            scoreSum += val;
            count++;
            if (max > 0 && (val / max) < 0.70) {
              strugglingCount++;
            }
          }
        });

        // Strictly unassessed when no student grades are recorded
        const avg = count > 0 ? scoreSum / count : 0;
        const pct = count > 0 && max > 0 ? (avg / max) * 100 : 0;
        const status = count === 0
          ? 'unassessed'
          : pct < 65
          ? 'high_struggle'
          : pct < 80
          ? 'moderate_struggle'
          : 'mastered';

        items.push({
          id: q.id,
          label: `Q${q.number}`,
          title: q.title,
          maxScore: max,
          avgScore: Math.round(avg * 10) / 10,
          percentage: Math.round(pct),
          strugglingStudentsCount: strugglingCount,
          avgDeduction: count > 0 ? Math.round((max - avg) * 10) / 10 : 0,
          isBonus: q.isBonus,
          status,
          gradedCount: count,
        });
      }
    });

    // Sort by lowest percentage to surface struggle points first (evaluated questions first)
    return items.sort((a, b) => {
      if (a.gradedCount > 0 && b.gradedCount === 0) return -1;
      if (a.gradedCount === 0 && b.gradedCount > 0) return 1;
      return a.percentage - b.percentage;
    });
  }, [currentAssignment, students, grades, gradingScale]);

  // 3. Trends across all 5 Homeworks and 5 Quizzes
  const assessmentTrendsData = useMemo(() => {
    return assignments.map(asg => {
      let sum = 0;
      let count = 0;

      students.forEach(s => {
        const studentGrade = grades[`${s.id}_${asg.id}`];
        if (!studentGrade) return;

        let total = 0;
        let has = false;

        const asgQuestions = Array.isArray(asg?.questions) ? asg.questions : [];
        asgQuestions.forEach(q => {
          if (q.subQuestions && q.subQuestions.length > 0) {
            q.subQuestions.forEach(sq => {
              const v = studentGrade.scores?.[`${q.id}_${sq.id}`];
              if (v !== undefined && v !== null) {
                total += v;
                has = true;
              }
            });
          } else {
            const v = studentGrade.scores?.[q.id];
            if (v !== undefined && v !== null) {
              total += v;
              has = true;
            }
          }
        });

        if (has && asg.totalMaxScore > 0) {
          sum += (total / asg.totalMaxScore) * 100;
          count++;
        }
      });

      const avgPercent = count > 0 ? Math.round(sum / count) : 0;

      return {
        code: asg.shortCode,
        title: asg.title,
        type: asg.type,
        average: avgPercent,
        benchmark: 80, // Target mastery threshold
        status: asg.status,
      };
    });
  }, [assignments, students, grades]);

  // Top struggle points for AI/pedagogical recommendations (strictly requires evaluated student struggles)
  const topStruggles = useMemo(() => {
    return questionStruggleData
      .filter(q => !q.isBonus && q.gradedCount > 0 && q.strugglingStudentsCount > 0 && q.percentage < 80)
      .slice(0, 3);
  }, [questionStruggleData]);

  // Aggregate count of questions requiring intervention
  const struggleQuestionsCount = useMemo(() => {
    return questionStruggleData.filter(q => q.status === 'high_struggle').length;
  }, [questionStruggleData]);

  const moderateStruggleCount = useMemo(() => {
    return questionStruggleData.filter(q => q.status === 'moderate_struggle').length;
  }, [questionStruggleData]);

  // Custom Recharts Dark Tooltip
  const CustomScoreTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-zinc-900/95 dark:bg-[#09090B]/95 border border-zinc-700/80 dark:border-zinc-800 text-zinc-100 p-3 rounded-xl shadow-xl backdrop-blur-md text-xs transition-all duration-150">
          <div className="font-semibold text-zinc-200 mb-1 flex items-center justify-between gap-3">
            <span>Score Bracket: {data.range}</span>
            <span className="font-mono font-bold text-[#3B82F6]">{data.count} Students</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-tight">
            {data.description}
          </p>
          <div className="mt-2 pt-2 border-t border-zinc-800 flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>Class Share:</span>
            <span>{Math.round((data.count / (students.length || 1)) * 100)}% of cohort</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomStruggleTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-zinc-900/95 dark:bg-[#09090B]/95 border border-zinc-700/80 dark:border-zinc-800 text-zinc-100 p-3 rounded-xl shadow-xl backdrop-blur-md text-xs max-w-xs transition-all duration-150">
          <div className="font-bold text-zinc-200 text-sm mb-0.5">
            {data.label}: {data.title}
          </div>
          <div className="flex items-center gap-2 text-xs font-mono mb-2">
            <span className={data.percentage < 65 ? 'text-rose-400 font-bold' : data.percentage < 80 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
              Average: {data.avgScore} / {data.maxScore} pts ({data.percentage}%)
            </span>
          </div>
          <div className="text-[11px] text-zinc-300 space-y-1 bg-zinc-800/60 p-2 rounded border border-zinc-700/40">
            <div className="flex justify-between">
              <span className="text-zinc-400">Students with Deductions:</span>
              <span className="font-mono font-semibold text-rose-300">{data.strugglingStudentsCount} / {students.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Average Lost Points:</span>
              <span className="font-mono text-amber-300">-{data.avgDeduction} pts</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (assignments.length === 0) {
    return (
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-sm">
        <BarChart3 className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No Analytics Available</h3>
        <p className="text-sm text-zinc-500 mt-2">Publish assignments and record grades to generate class analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3B82F6] mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Class Performance & Struggle Diagnostics</span>
          </div>
          <h2 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-100">
            Assignment Analytics & Struggle Index
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
            Statistical breakdown of class score distributions, question difficulty hierarchies, and concept struggle points across {assignments.length} assessment{assignments.length === 1 ? '' : 's'}.
          </p>
        </div>

        {/* Assessment Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedAsgId}
              onChange={e => setSelectedAsgId(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl pl-3 pr-8 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 cursor-pointer transition-colors duration-150"
            >
              <optgroup label={`Homework Assignments (${assignments.filter(a => a.type === 'homework').length})`}>
                {assignments.filter(a => a.type === 'homework').map(a => (
                  <option key={a.id} value={a.id}>
                    {a.shortCode}: {a.title}
                  </option>
                ))}
              </optgroup>
              <optgroup label={`Quizzes (${assignments.filter(a => a.type === 'quiz').length})`}>
                {assignments.filter(a => a.type === 'quiz').map(a => (
                  <option key={a.id} value={a.id}>
                    {a.shortCode}: {a.title}
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1 border border-zinc-200 dark:border-zinc-800 p-0.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveMetricTab('distribution')}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                activeMetricTab === 'distribution'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Distribution
            </button>
            <button
              onClick={() => setActiveMetricTab('struggle')}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                activeMetricTab === 'struggle'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Struggles ({struggleQuestionsCount + moderateStruggleCount})
            </button>
            <button
              onClick={() => setActiveMetricTab('trends')}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                activeMetricTab === 'trends'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Trends
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm transition-all duration-150 hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] sm:text-xs font-medium">Class Mean</span>
            <Award className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {distributionData.classAverage.toFixed(2)}{' '}
            <span className="text-[10px] sm:text-xs font-normal text-zinc-400">/ 9.0</span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono">
            {distributionData.gradedStudentsCount > 0
              ? `${Math.round((distributionData.classAverage / 9) * 100)}% overall mastery`
              : 'No scores entered'}
          </div>
        </div>

        <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm transition-all duration-150 hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] sm:text-xs font-medium">Struggles</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
            {struggleQuestionsCount}
          </div>
          <div className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            {distributionData.gradedStudentsCount > 0 ? 'Questions <65% avg' : 'No evaluations yet'}
          </div>
        </div>

        <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm transition-all duration-150 hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] sm:text-xs font-medium">Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {questionStruggleData.filter(q => q.status === 'mastered').length}
          </div>
          <div className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            {distributionData.gradedStudentsCount > 0 ? 'Questions >80% rate' : 'No evaluations yet'}
          </div>
        </div>

        <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm transition-all duration-150 hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] sm:text-xs font-medium">Graded</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {distributionData.gradedStudentsCount} / {students.length}
          </div>
          <div className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            {students.length > 0
              ? `${Math.round((distributionData.gradedStudentsCount / students.length) * 100)}% evaluated`
              : '0% evaluated'}
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Selected Visualization */}
        <div className="lg:col-span-2 bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs transition-all duration-200 overflow-hidden">
          {activeMetricTab === 'distribution' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
                <div>
                  <h3 className="text-sm font-bold font-display text-zinc-900 dark:text-zinc-100">
                    Grade Distribution Curve: {currentAssignment?.shortCode}
                  </h3>
                  <span className="text-xs text-zinc-500">
                    Histogram of cohort scores scaled out of 9.0 (Scale of 9)
                  </span>
                </div>
                <div className="text-xs font-mono text-zinc-500 flex items-center gap-2 mt-1 sm:mt-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] inline-block" />
                  <span>Mean: {distributionData.classAverage.toFixed(2)}/9.0</span>
                </div>
              </div>

              <div className="h-64 sm:h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={distributionData.buckets} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} opacity={0.4} />
                    <XAxis
                      dataKey="range"
                      tick={{ fill: '#A1A1AA', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                      axisLine={{ stroke: '#3F3F46' }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: '#A1A1AA', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                      axisLine={{ stroke: '#3F3F46' }}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomScoreTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
                    {distributionData.gradedStudentsCount > 0 && (
                      <ReferenceLine
                        x={
                          distributionData.classAverage >= 8.1 ? '8.1–9.0' :
                          distributionData.classAverage >= 7.2 ? '7.2–8.0' :
                          distributionData.classAverage >= 6.3 ? '6.3–7.1' :
                          distributionData.classAverage >= 5.4 ? '5.4–6.2' :
                          distributionData.classAverage >= 4.5 ? '4.5–5.3' : '< 4.5'
                        }
                        stroke="#3B82F6"
                        strokeDasharray="4 4"
                        label={{ value: `Mean (${distributionData.classAverage.toFixed(1)})`, fill: '#3B82F6', fontSize: 11, position: 'top' }}
                      />
                    )}
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={56} animationDuration={600}>
                      {distributionData.buckets.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} opacity={0.88} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <span>Total Graded: {distributionData.gradedStudentsCount} Students</span>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> &lt;4.5 Struggle
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> 4.5–5.3 Passing
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-teal-400" /> 7.2–8.0 Strong
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#3B82F6]" /> 8.1–9.0 Mastery
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeMetricTab === 'struggle' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold font-display text-zinc-900 dark:text-zinc-100">
                    Question Difficulty Hierarchy & Deduction Points
                  </h3>
                  <span className="text-xs text-zinc-500">
                    Average student score percentage on each nested subquestion
                  </span>
                </div>
                <span className="text-xs font-mono text-zinc-400">
                  Sorted by Lowest Score First
                </span>
              </div>

              {distributionData.gradedStudentsCount === 0 ? (
                <div className="h-72 w-full flex flex-col items-center justify-center p-6 text-center rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-dashed border-zinc-200 dark:border-zinc-800">
                  <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
                    <AlertTriangle className="w-5 h-5 text-zinc-400" />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No Grades Recorded Yet</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mt-1">
                    No evaluations have been entered for this assessment. Enter scores in the Gradebook to generate difficulty diagnostics.
                  </p>
                </div>
              ) : (
                <>
                  <div className="h-80 w-full min-w-0 overflow-y-auto">
                    <ResponsiveContainer width="100%" height={Math.max(280, questionStruggleData.length * 36)} minWidth={0}>
                      <BarChart
                        layout="vertical"
                        data={questionStruggleData}
                        margin={{ top: 5, right: 30, left: 25, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272A" horizontal={false} opacity={0.4} />
                        <XAxis
                          type="number"
                          domain={[0, 100]}
                          unit="%"
                          tick={{ fill: '#A1A1AA', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                          axisLine={{ stroke: '#3F3F46' }}
                        />
                        <YAxis
                          dataKey="label"
                          type="category"
                          tick={{ fill: '#D4D4D8', fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 600 }}
                          axisLine={{ stroke: '#3F3F46' }}
                          width={60}
                        />
                        <Tooltip content={<CustomStruggleTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
                        <ReferenceLine x={70} stroke="#EF4444" strokeDasharray="3 3" label={{ value: 'Struggle Threshold (70%)', fill: '#EF4444', fontSize: 10, position: 'insideTopRight' }} />
                        <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={18} animationDuration={600}>
                          {questionStruggleData.map((entry, index) => {
                            const fill = entry.status === 'unassessed' ? '#71717A' : entry.percentage < 65 ? '#EF4444' : entry.percentage < 80 ? '#F59E0B' : '#10B981';
                            return <Cell key={`cell-struggle-${index}`} fill={fill} opacity={0.9} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Hover over any question bar to view prompt details and deduction counts</span>
                    <span className="font-mono text-rose-400">Red: &lt;65% · Amber: 65-80% · Green: &gt;80%</span>
                  </div>
                </>
              )}
            </div>
          )}

          {activeMetricTab === 'trends' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold font-display text-zinc-900 dark:text-zinc-100">
                    Course Performance Trajectory (HW1–HW5 & Quiz 1–Quiz 5)
                  </h3>
                  <span className="text-xs text-zinc-500">
                    Cohort mean scores plotted against course mastery target (80%)
                  </span>
                </div>
              </div>

              <div className="h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={assessmentTrendsData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} opacity={0.4} />
                    <XAxis
                      dataKey="code"
                      tick={{ fill: '#A1A1AA', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                      axisLine={{ stroke: '#3F3F46' }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      unit="%"
                      tick={{ fill: '#A1A1AA', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                      axisLine={{ stroke: '#3F3F46' }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18191E', borderColor: '#27272A', borderRadius: 8, fontSize: 12 }}
                      itemStyle={{ color: '#E4E4E7' }}
                    />
                    <ReferenceLine y={80} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Target 80%', fill: '#10B981', fontSize: 10 }} />
                    <Area
                      type="monotone"
                      dataKey="average"
                      name="Class Average %"
                      stroke="#6366F1"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorAvg)"
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
                <span>Green line marks target threshold (80%)</span>
                <span>Includes past closed and currently grading assessments</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Top Struggle Insights & TA Intervention Recommendations */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs transition-all duration-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
              <Lightbulb className="w-4 h-4" />
              <span>Diagnostic Recommendations</span>
            </div>
            <h3 className="text-sm font-bold font-display text-zinc-900 dark:text-zinc-100 mb-2">
              Identified Struggle Concepts
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Metadata analysis highlights questions with the highest error frequency for TA recitation focus:
            </p>

            <div className="space-y-2.5">
              {topStruggles.length === 0 ? (
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
                  {distributionData.gradedStudentsCount === 0
                    ? 'No evaluations recorded for this assessment yet. Enter grades in the Gradebook to view struggle diagnostics.'
                    : 'No critical struggle points identified on this assessment. High mastery across evaluated questions!'}
                </div>
              ) : (
                topStruggles.map((struggle, idx) => (
                  <div
                    key={struggle.id}
                    className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        <span className="text-rose-500">#{idx + 1}</span>
                        <span>{struggle.label}</span>
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-rose-500 dark:text-rose-400">
                        {struggle.percentage}% Avg
                      </span>
                    </div>

                    <div className="text-xs text-zinc-700 dark:text-zinc-300 font-medium mb-1 line-clamp-1">
                      {struggle.title}
                    </div>

                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between font-mono">
                      <span>{struggle.strugglingStudentsCount} students lost points</span>
                      <span>Avg -{struggle.avgDeduction}p</span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-zinc-200/80 dark:border-zinc-800 text-[11px] text-[#3B82F6]">
                      → Action: Review derivation in next TA session
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Stats Summary Box */}
          <div className="bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm text-xs space-y-2">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1">
              Assessment Metadata
            </span>
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Selected Scope:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">{currentAssignment?.shortCode} ({(Array.isArray(currentAssignment?.questions) ? currentAssignment.questions.length : 0)} Questions)</span>
            </div>
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Total Question Subparts:</span>
              <span className="font-mono text-zinc-900 dark:text-zinc-200">{questionStruggleData.length} parts</span>
            </div>
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Total Standard Points:</span>
              <span className="font-mono text-zinc-900 dark:text-zinc-200">{currentAssignment?.totalMaxScore} pts</span>
            </div>
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Cohort Success Rate:</span>
              <span className="font-mono text-emerald-500 font-semibold">{distributionData.classAverage > 0 && gradingScale.max_score > 0 ? `${Math.round((distributionData.classAverage / gradingScale.max_score) * 100)}%` : '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
