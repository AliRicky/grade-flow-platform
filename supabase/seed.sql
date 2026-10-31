-- ==============================================================================
-- Grade Flow Platform — Turnkey Demo Seed Fixtures
-- ==============================================================================

-- 1. Create Staff & Student Accounts in auth.users
-- Password for all seed accounts: "DemoPass123!"

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES
-- Teaching Staff
(
  '00000000-0000-0000-0000-000000000000',
  'a1000000-0000-0000-0000-000000000001',
  'authenticated', 'authenticated',
  'instructor@gradeflow.local',
  crypt('DemoPass123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role": "admin", "full_name": "Dr. Ada Lovelace", "student_id": "FACULTY-01", "section": "Course Instructor"}',
  now(), now()
),
(
  '00000000-0000-0000-0000-000000000000',
  'a1000000-0000-0000-0000-000000000002',
  'authenticated', 'authenticated',
  'headta@gradeflow.local',
  crypt('DemoPass123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role": "admin", "full_name": "Alan Turing", "student_id": "TA-HEAD-01", "section": "Lead TA"}',
  now(), now()
),
(
  '00000000-0000-0000-0000-000000000000',
  'a1000000-0000-0000-0000-000000000003',
  'authenticated', 'authenticated',
  'ta@gradeflow.local',
  crypt('DemoPass123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role": "admin", "full_name": "Grace Hopper", "student_id": "TA-GRAD-02", "section": "Grader TA"}',
  now(), now()
),

-- Synthetic Enrolled Students
(
  '00000000-0000-0000-0000-000000000000',
  'b1000000-0000-0000-0000-000000000001',
  'authenticated', 'authenticated',
  'stu1001@gradeflow.local',
  crypt('DemoPass123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role": "student", "full_name": "Alex Rivers", "student_id": "STU1001", "section": "Section A"}',
  now(), now()
),
(
  '00000000-0000-0000-0000-000000000002',
  'b1000000-0000-0000-0000-000000000002',
  'authenticated', 'authenticated',
  'stu1002@gradeflow.local',
  crypt('DemoPass123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role": "student", "full_name": "Jordan Taylor", "student_id": "STU1002", "section": "Section A"}',
  now(), now()
),
(
  '00000000-0000-0000-0000-000000000000',
  'b1000000-0000-0000-0000-000000000003',
  'authenticated', 'authenticated',
  'stu1003@gradeflow.local',
  crypt('DemoPass123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role": "student", "full_name": "Casey Morgan", "student_id": "STU1003", "section": "Section A"}',
  now(), now()
),
(
  '00000000-0000-0000-0000-000000000000',
  'b1000000-0000-0000-0000-000000000004',
  'authenticated', 'authenticated',
  'stu1004@gradeflow.local',
  crypt('DemoPass123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role": "student", "full_name": "Riley Chen", "student_id": "STU1004", "section": "Section B"}',
  now(), now()
),
(
  '00000000-0000-0000-0000-000000000000',
  'b1000000-0000-0000-0000-000000000005',
  'authenticated', 'authenticated',
  'stu1005@gradeflow.local',
  crypt('DemoPass123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role": "student", "full_name": "Taylor Brooks", "student_id": "STU1005", "section": "Section B"}',
  now(), now()
),
(
  '00000000-0000-0000-0000-000000000000',
  'b1000000-0000-0000-0000-000000000006',
  'authenticated', 'authenticated',
  'stu1006@gradeflow.local',
  crypt('DemoPass123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role": "student", "full_name": "Samira Patel", "student_id": "STU1006", "section": "Section B"}',
  now(), now()
),
(
  '00000000-0000-0000-0000-000000000000',
  'b1000000-0000-0000-0000-000000000007',
  'authenticated', 'authenticated',
  'stu1007@gradeflow.local',
  crypt('DemoPass123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role": "student", "full_name": "David Kim", "student_id": "STU1007", "section": "Section C"}',
  now(), now()
),
(
  '00000000-0000-0000-0000-000000000000',
  'b1000000-0000-0000-0000-000000000008',
  'authenticated', 'authenticated',
  'stu1008@gradeflow.local',
  crypt('DemoPass123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role": "student", "full_name": "Elena Rostova", "student_id": "STU1008", "section": "Section C"}',
  now(), now()
)
ON CONFLICT (id) DO NOTHING;

-- 2. Populate public.users Profile Mirror
INSERT INTO public.users (id, full_name, role, student_id, section, email)
VALUES
('a1000000-0000-0000-0000-000000000001', 'Dr. Ada Lovelace', 'admin', 'FACULTY-01', 'Course Instructor', 'instructor@gradeflow.local'),
('a1000000-0000-0000-0000-000000000002', 'Alan Turing', 'admin', 'TA-HEAD-01', 'Lead TA', 'headta@gradeflow.local'),
('a1000000-0000-0000-0000-000000000003', 'Grace Hopper', 'admin', 'TA-GRAD-02', 'Grader TA', 'ta@gradeflow.local'),
('b1000000-0000-0000-0000-000000000001', 'Alex Rivers', 'student', 'STU1001', 'Section A', 'stu1001@gradeflow.local'),
('b1000000-0000-0000-0000-000000000002', 'Jordan Taylor', 'student', 'STU1002', 'Section A', 'stu1002@gradeflow.local'),
('b1000000-0000-0000-0000-000000000003', 'Casey Morgan', 'student', 'STU1003', 'Section A', 'stu1003@gradeflow.local'),
('b1000000-0000-0000-0000-000000000004', 'Riley Chen', 'student', 'STU1004', 'Section B', 'stu1004@gradeflow.local'),
('b1000000-0000-0000-0000-000000000005', 'Taylor Brooks', 'student', 'STU1005', 'Section B', 'stu1005@gradeflow.local'),
('b1000000-0000-0000-0000-000000000006', 'Samira Patel', 'student', 'STU1006', 'Section B', 'stu1006@gradeflow.local'),
('b1000000-0000-0000-0000-000000000007', 'David Kim', 'student', 'STU1007', 'Section C', 'stu1007@gradeflow.local'),
('b1000000-0000-0000-0000-000000000008', 'Elena Rostova', 'student', 'STU1008', 'Section C', 'stu1008@gradeflow.local')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  student_id = EXCLUDED.student_id,
  section = EXCLUDED.section,
  email = EXCLUDED.email;

-- 3. Core Demonstration Course: CS 101
INSERT INTO public.courses (
  id, code, title, term, academic_year, grading_scale, config
)
VALUES (
  'c1010000-0000-0000-0000-000000000001',
  'CS101',
  'CS 101: Introduction to Algorithms & Systems',
  'Fall',
  '2026-2027',
  '{
    "type": "numeric",
    "max_score": 9.0,
    "passing_threshold": 4.0,
    "precision": 1,
    "label": "9-Point Scale (Original)"
  }'::jsonb,
  '{
    "allow_student_whatif": true,
    "allow_regrade_appeals": true,
    "regrade_window_days": 7
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 4. Syllabus Assessment Categories
INSERT INTO public.assessment_categories (
  id, course_id, name, weight_percentage, drop_lowest_count, display_order
)
VALUES
(
  'ca700001-0000-0000-0000-000000000001',
  'c1010000-0000-0000-0000-000000000001',
  'Homework Assignments',
  30, 1, 1
),
(
  'ca700001-0000-0000-0000-000000000002',
  'c1010000-0000-0000-0000-000000000001',
  'Bi-Weekly Quizzes',
  20, 1, 2
),
(
  'ca700001-0000-0000-0000-000000000003',
  'c1010000-0000-0000-0000-000000000001',
  'Midterm Examination',
  25, 0, 3
),
(
  'ca700001-0000-0000-0000-000000000004',
  'c1010000-0000-0000-0000-000000000001',
  'Final Project',
  25, 0, 4
)
ON CONFLICT (id) DO NOTHING;

-- 5. Assessments / Assignments Matrix
INSERT INTO public.assessments (
  id, category_id, course_id, title, short_code, type, description,
  questions, max_score, total_max_score, weight_in_category, weight_percent,
  status, assigned_tas, is_locked, due_date, display_order
)
VALUES
(
  'asg_hw1',
  'ca700001-0000-0000-0000-000000000001',
  'c1010000-0000-0000-0000-000000000001',
  'Homework 1: Algorithm Analysis & Big-O Notation',
  'HW1',
  'homework',
  'Asymptotic bounds, recurrence tree analysis, and loop invariant formal proofs.',
  '[
    {
      "id": "q1",
      "number": 1,
      "title": "Asymptotic Analysis & Growth Orders",
      "subQuestions": [
        {"id": "sq1_a", "label": "1-a", "title": "Big-O and Omega proofs", "maxScore": 5},
        {"id": "sq1_b", "label": "1-b", "title": "Tight Theta bound derivations", "maxScore": 5}
      ]
    },
    {
      "id": "q2",
      "number": 2,
      "title": "Recurrences & Master Theorem",
      "subQuestions": [
        {"id": "sq2_a", "label": "2-a", "title": "Master Theorem cases", "maxScore": 10},
        {"id": "sq2_b", "label": "2-b", "title": "Substitution verification", "maxScore": 10}
      ]
    }
  ]'::jsonb,
  30, 30, 33.33, 10,
  'closed',
  '["a1000000-0000-0000-0000-000000000002"]'::jsonb,
  false,
  now() - interval '14 days',
  1
),
(
  'asg_hw2',
  'ca700001-0000-0000-0000-000000000001',
  'c1010000-0000-0000-0000-000000000001',
  'Homework 2: Divide & Conquer and Sorting Algorithms',
  'HW2',
  'homework',
  'MergeSort, QuickSort partitioning invariants, and linear-time selection.',
  '[
    {
      "id": "q1",
      "number": 1,
      "title": "Divide-and-Conquer Multiplications",
      "subQuestions": [
        {"id": "sq1_a", "label": "1-a", "title": "Karatsuba recursion analysis", "maxScore": 7},
        {"id": "sq1_b", "label": "1-b", "title": "Recurrence resolution", "maxScore": 8}
      ]
    },
    {
      "id": "q2",
      "number": 2,
      "title": "Partition Invariant Correctness",
      "subQuestions": [
        {"id": "sq2_a", "label": "2-a", "title": "Hoare vs Lomuto stability", "maxScore": 8},
        {"id": "sq2_b", "label": "2-b", "title": "Deterministic linear-time select", "maxScore": 7}
      ]
    }
  ]'::jsonb,
  30, 30, 33.33, 10,
  'closed',
  '["a1000000-0000-0000-0000-000000000003"]'::jsonb,
  false,
  now() - interval '7 days',
  2
),
(
  'asg_hw3',
  'ca700001-0000-0000-0000-000000000001',
  'c1010000-0000-0000-0000-000000000001',
  'Homework 3: Graph Traversal & Dynamic Programming',
  'HW3',
  'homework',
  'Breadth-First and Depth-First Search, DAG topological sorting, and Memoization.',
  '[
    {
      "id": "q1",
      "number": 1,
      "title": "Topological Ordering & Strongly Connected Components",
      "subQuestions": [
        {"id": "sq1_a", "label": "1-a", "title": "Tarjan algorithm trace", "maxScore": 10},
        {"id": "sq1_b", "label": "1-b", "title": "Kosaraju proof of correctness", "maxScore": 10}
      ]
    },
    {
      "id": "q2",
      "number": 2,
      "title": "Optimal Substructure & DP Transitions",
      "subQuestions": [
        {"id": "sq2_a", "label": "2-a", "title": "Knapsack memoization matrix", "maxScore": 10},
        {"id": "sq2_b", "label": "2-b", "title": "Space-optimized bottom-up formulation", "maxScore": 10}
      ]
    }
  ]'::jsonb,
  40, 40, 33.34, 10,
  'active',
  '["a1000000-0000-0000-0000-000000000002"]'::jsonb,
  false,
  now() + interval '3 days',
  3
),
(
  'asg_q1',
  'ca700001-0000-0000-0000-000000000002',
  'c1010000-0000-0000-0000-000000000001',
  'Quiz 1: Asymptotic Complexity & Recurrences',
  'Quiz 1',
  'quiz',
  'Timed 30-minute quiz covering Big-O relations and recursion trees.',
  '[
    {
      "id": "q1",
      "number": 1,
      "title": "Asymptotic Rankings",
      "subQuestions": [],
      "directMaxScore": 10
    },
    {
      "id": "q2",
      "number": 2,
      "title": "Recurrence Tree Height Calculation",
      "subQuestions": [],
      "directMaxScore": 10
    }
  ]'::jsonb,
  20, 20, 50, 10,
  'closed',
  '["a1000000-0000-0000-0000-000000000003"]'::jsonb,
  false,
  now() - interval '10 days',
  4
),
(
  'asg_midterm',
  'ca700001-0000-0000-0000-000000000003',
  'c1010000-0000-0000-0000-000000000001',
  'Midterm Exam: Algorithms & Data Structures',
  'Midterm',
  'exam',
  'Comprehensive mid-semester examination covering modules 1 through 6.',
  '[
    {
      "id": "q1",
      "number": 1,
      "title": "Theory & Asymptotics",
      "subQuestions": [
        {"id": "sq1_a", "label": "1-a", "title": "Complexity class separations", "maxScore": 15},
        {"id": "sq1_b", "label": "1-b", "title": "Amortized potential functions", "maxScore": 15}
      ]
    },
    {
      "id": "q2",
      "number": 2,
      "title": "Graph Algorithms & Shortest Paths",
      "subQuestions": [
        {"id": "sq2_a", "label": "2-a", "title": "Dijkstra negative weight counterexample", "maxScore": 15},
        {"id": "sq2_b", "label": "2-b", "title": "Bellman-Ford negative cycle detection", "maxScore": 15}
      ]
    },
    {
      "id": "q3",
      "number": 3,
      "title": "Dynamic Programming System Design",
      "subQuestions": [
        {"id": "sq3_a", "label": "3-a", "title": "State space definition", "maxScore": 20},
        {"id": "sq3_b", "label": "3-b", "title": "Reconstruction algorithm", "maxScore": 20}
      ]
    }
  ]'::jsonb,
  100, 100, 100, 25,
  'grading',
  '["a1000000-0000-0000-0000-000000000002", "a1000000-0000-0000-0000-000000000003"]'::jsonb,
  false,
  now() - interval '2 days',
  5
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  questions = EXCLUDED.questions,
  max_score = EXCLUDED.max_score,
  status = EXCLUDED.status;

-- 6. Course Roster Students
INSERT INTO public.students (
  id, course_id, user_id, student_id_number, student_id, full_name, name, email, section, is_active
)
VALUES
('b1000000-0000-0000-0000-000000000001', 'c1010000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'STU1001', 'STU1001', 'Alex Rivers', 'Alex Rivers', 'stu1001@gradeflow.local', 'Section A', true),
('b1000000-0000-0000-0000-000000000002', 'c1010000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'STU1002', 'STU1002', 'Jordan Taylor', 'Jordan Taylor', 'stu1002@gradeflow.local', 'Section A', true),
('b1000000-0000-0000-0000-000000000003', 'c1010000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000003', 'STU1003', 'STU1003', 'Casey Morgan', 'Casey Morgan', 'stu1003@gradeflow.local', 'Section A', true),
('b1000000-0000-0000-0000-000000000004', 'c1010000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000004', 'STU1004', 'STU1004', 'Riley Chen', 'Riley Chen', 'stu1004@gradeflow.local', 'Section B', true),
('b1000000-0000-0000-0000-000000000005', 'c1010000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000005', 'STU1005', 'STU1005', 'Taylor Brooks', 'Taylor Brooks', 'stu1005@gradeflow.local', 'Section B', true),
('b1000000-0000-0000-0000-000000000006', 'c1010000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000006', 'STU1006', 'STU1006', 'Samira Patel', 'Samira Patel', 'stu1006@gradeflow.local', 'Section B', true),
('b1000000-0000-0000-0000-000000000007', 'c1010000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000007', 'STU1007', 'STU1007', 'David Kim', 'David Kim', 'stu1007@gradeflow.local', 'Section C', true),
('b1000000-0000-0000-0000-000000000008', 'c1010000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000008', 'STU1008', 'STU1008', 'Elena Rostova', 'Elena Rostova', 'stu1008@gradeflow.local', 'Section C', true)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  section = EXCLUDED.section;

-- 7. Course Memberships Mapping
INSERT INTO public.course_memberships (user_id, course_id, role, section_scope)
VALUES
('a1000000-0000-0000-0000-000000000001', 'c1010000-0000-0000-0000-000000000001', 'instructor', null),
('a1000000-0000-0000-0000-000000000002', 'c1010000-0000-0000-0000-000000000001', 'head_ta', null),
('a1000000-0000-0000-0000-000000000003', 'c1010000-0000-0000-0000-000000000001', 'grader_ta', 'Section B'),
('b1000000-0000-0000-0000-000000000001', 'c1010000-0000-0000-0000-000000000001', 'student', 'Section A'),
('b1000000-0000-0000-0000-000000000002', 'c1010000-0000-0000-0000-000000000001', 'student', 'Section A'),
('b1000000-0000-0000-0000-000000000003', 'c1010000-0000-0000-0000-000000000001', 'student', 'Section A'),
('b1000000-0000-0000-0000-000000000004', 'c1010000-0000-0000-0000-000000000001', 'student', 'Section B'),
('b1000000-0000-0000-0000-000000000005', 'c1010000-0000-0000-0000-000000000001', 'student', 'Section B'),
('b1000000-0000-0000-0000-000000000006', 'c1010000-0000-0000-0000-000000000001', 'student', 'Section B'),
('b1000000-0000-0000-0000-000000000007', 'c1010000-0000-0000-0000-000000000001', 'student', 'Section C'),
('b1000000-0000-0000-0000-000000000008', 'c1010000-0000-0000-0000-000000000001', 'student', 'Section C')
ON CONFLICT (user_id, course_id) DO NOTHING;

-- 8. Representative Evaluation Records (Grades)
INSERT INTO public.grades (
  student_id, assessment_id, assignment_id, score, scores, is_excused, feedback, grader_id, graded_by, graded_at
)
VALUES
-- HW1 Grades
('b1000000-0000-0000-0000-000000000001', 'asg_hw1', 'asg_hw1', 29, '{"q1_sq1_a": 5, "q1_sq1_b": 5, "q2_sq2_a": 10, "q2_sq2_b": 9}'::jsonb, false, 'Superb asymptotic proofs and substitution logic.', 'a1000000-0000-0000-0000-000000000002', 'Alan Turing', now() - interval '12 days'),
('b1000000-0000-0000-0000-000000000002', 'asg_hw1', 'asg_hw1', 27, '{"q1_sq1_a": 5, "q1_sq1_b": 4, "q2_sq2_a": 9, "q2_sq2_b": 9}'::jsonb, false, 'Well executed; minor step skipped in theta lower bound.', 'a1000000-0000-0000-0000-000000000002', 'Alan Turing', now() - interval '12 days'),
('b1000000-0000-0000-0000-000000000003', 'asg_hw1', 'asg_hw1', 25, '{"q1_sq1_a": 4, "q1_sq1_b": 4, "q2_sq2_a": 9, "q2_sq2_b": 8}'::jsonb, false, 'Good work overall.', 'a1000000-0000-0000-0000-000000000002', 'Alan Turing', now() - interval '12 days'),
('b1000000-0000-0000-0000-000000000004', 'asg_hw1', 'asg_hw1', 30, '{"q1_sq1_a": 5, "q1_sq1_b": 5, "q2_sq2_a": 10, "q2_sq2_b": 10}'::jsonb, false, 'Flawless proof submission.', 'a1000000-0000-0000-0000-000000000002', 'Alan Turing', now() - interval '12 days'),
('b1000000-0000-0000-0000-000000000005', 'asg_hw1', 'asg_hw1', 22, '{"q1_sq1_a": 3, "q1_sq1_b": 4, "q2_sq2_a": 8, "q2_sq2_b": 7}'::jsonb, false, 'Review master theorem regularity condition.', 'a1000000-0000-0000-0000-000000000002', 'Alan Turing', now() - interval '12 days'),
('b1000000-0000-0000-0000-000000000006', 'asg_hw1', 'asg_hw1', 28, '{"q1_sq1_a": 5, "q1_sq1_b": 5, "q2_sq2_a": 9, "q2_sq2_b": 9}'::jsonb, false, 'Clean presentation and valid inductions.', 'a1000000-0000-0000-0000-000000000002', 'Alan Turing', now() - interval '12 days'),

-- HW2 Grades
('b1000000-0000-0000-0000-000000000001', 'asg_hw2', 'asg_hw2', 28, '{"q1_sq1_a": 7, "q1_sq1_b": 7, "q2_sq2_a": 7, "q2_sq2_b": 7}'::jsonb, false, 'Solid partitioning invariants.', 'a1000000-0000-0000-0000-000000000003', 'Grace Hopper', now() - interval '5 days'),
('b1000000-0000-0000-0000-000000000002', 'asg_hw2', 'asg_hw2', 26, '{"q1_sq1_a": 6, "q1_sq1_b": 7, "q2_sq2_a": 7, "q2_sq2_b": 6}'::jsonb, false, 'Minor index off-by-one in select partition.', 'a1000000-0000-0000-0000-000000000003', 'Grace Hopper', now() - interval '5 days'),
('b1000000-0000-0000-0000-000000000004', 'asg_hw2', 'asg_hw2', 30, '{"q1_sq1_a": 7, "q1_sq1_b": 8, "q2_sq2_a": 8, "q2_sq2_b": 7}'::jsonb, false, 'Exceptional analysis of deterministic select.', 'a1000000-0000-0000-0000-000000000003', 'Grace Hopper', now() - interval '5 days'),

-- Quiz 1 Grades
('b1000000-0000-0000-0000-000000000001', 'asg_q1', 'asg_q1', 19, '{"q1": 10, "q2": 9}'::jsonb, false, 'Strong grasp of tree depth.', 'a1000000-0000-0000-0000-000000000003', 'Grace Hopper', now() - interval '8 days'),
('b1000000-0000-0000-0000-000000000002', 'asg_q1', 'asg_q1', 18, '{"q1": 9, "q2": 9}'::jsonb, false, 'Good effort.', 'a1000000-0000-0000-0000-000000000003', 'Grace Hopper', now() - interval '8 days'),
('b1000000-0000-0000-0000-000000000003', 'asg_q1', 'asg_q1', 17, '{"q1": 8, "q2": 9}'::jsonb, false, 'Double check logarithm base conventions.', 'a1000000-0000-0000-0000-000000000003', 'Grace Hopper', now() - interval '8 days')
ON CONFLICT (student_id, assessment_id) DO UPDATE SET
  score = EXCLUDED.score,
  scores = EXCLUDED.scores,
  feedback = EXCLUDED.feedback,
  graded_by = EXCLUDED.graded_by;

-- 9. Sample Academic Appeal (Regrade Request)
INSERT INTO public.regrades (
  id, student_id, student_name, assignment_id, assignment_title, 
  question_label, current_score, max_score, reason, status, ta_response, adjusted_score, created_at
)
VALUES
(
  'reg_001',
  'b1000000-0000-0000-0000-000000000002',
  'Jordan Taylor',
  'asg_hw1',
  'Homework 1: Algorithm Analysis & Big-O Notation',
  '1-b',
  4, 5,
  'In problem 1-b, the constant c2 was derived on page 3 using the limit definition rather than direct epsilon bounds. Please review the alternative algebraic proof.',
  'pending',
  null, null,
  now() - interval '2 days'
)
ON CONFLICT (id) DO NOTHING;
