-- ==============================================================================
-- Grade Flow Platform — Generalized Multi-Course Database Architecture
-- Migration: 00001_generalized_grade_flow.sql
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Security & Identity Functions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT role::text FROM public.users WHERE id = auth.uid()::text LIMIT 1);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_current_student_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT student_id::text FROM public.users WHERE id = auth.uid()::text LIMIT 1);
END;
$$;

-- 3. Core Users / Profiles Table (Synchronized with auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id text PRIMARY KEY,
  full_name text NOT NULL DEFAULT 'User',
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'instructor', 'ta', 'student')),
  student_id text,
  section text DEFAULT 'General',
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger to automatically mirror new auth.users into public.users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, full_name, role, student_id, section, email)
  VALUES (
    NEW.id::text,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NEW.raw_user_meta_data->>'student_id',
    COALESCE(NEW.raw_user_meta_data->>'section', 'General'),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    student_id = EXCLUDED.student_id,
    section = EXCLUDED.section,
    email = EXCLUDED.email,
    updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Multi-Course Architecture: Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,                                       -- e.g. 'CS101'
  title text NOT NULL,                                      -- e.g. 'Introduction to Algorithms & Systems'
  term text NOT NULL DEFAULT 'Fall',                        -- e.g. 'Fall', 'Spring', 'Summer'
  academic_year text NOT NULL DEFAULT '2026-2027',
  grading_scale jsonb NOT NULL DEFAULT '{
    "type": "numeric_9",
    "min_pass": 3.0,
    "max_score": 9.0
  }'::jsonb,
  config jsonb NOT NULL DEFAULT '{
    "allow_student_whatif": true,
    "allow_regrade_appeals": true,
    "regrade_window_days": 7
  }'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Course Memberships (Roles & Section Scoping)
CREATE TABLE IF NOT EXISTS public.course_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('instructor', 'head_ta', 'grader_ta', 'student', 'auditor')),
  section_scope text,                                       -- Nullable: null implies all sections
  permissions jsonb NOT NULL DEFAULT '{
    "can_grade": true,
    "can_export": false,
    "can_manage_roster": false
  }'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_course_membership UNIQUE (user_id, course_id)
);

-- 6. Assessment Categories (Syllabus Weighting & Drop Rules)
CREATE TABLE IF NOT EXISTS public.assessment_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  name text NOT NULL,                                       -- e.g. 'Homework', 'Quizzes', 'Midterm', 'Final'
  weight_percentage numeric NOT NULL CHECK (weight_percentage >= 0 AND weight_percentage <= 100),
  drop_lowest_count integer NOT NULL DEFAULT 0 CHECK (drop_lowest_count >= 0),
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. Assessments (Assignments & Exams)
CREATE TABLE IF NOT EXISTS public.assessments (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  category_id uuid REFERENCES public.assessment_categories(id) ON DELETE SET NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  short_code text,                                          -- e.g. 'HW1', 'Q1'
  type text NOT NULL DEFAULT 'homework' CHECK (type IN ('homework', 'quiz', 'exam', 'project')),
  description text,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,             -- Hierarchical question & subquestion tree
  max_score numeric NOT NULL DEFAULT 100 CHECK (max_score >= 0),
  total_max_score numeric NOT NULL DEFAULT 100,             -- Backward compatibility mirror
  weight_in_category numeric NOT NULL DEFAULT 100 CHECK (weight_in_category >= 0),
  weight_percent numeric DEFAULT 10 CHECK (weight_percent >= 0 AND weight_percent <= 100),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'grading', 'closed')),
  assigned_tas jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_locked boolean NOT NULL DEFAULT false,
  due_date timestamptz,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Backward compatibility view for legacy queries targeting `public.assignments`
CREATE OR REPLACE VIEW public.assignments AS 
SELECT 
  id,
  category_id,
  course_id,
  title,
  short_code,
  type,
  description,
  questions,
  max_score,
  total_max_score,
  weight_in_category,
  weight_percent,
  status,
  assigned_tas,
  is_locked,
  due_date,
  display_order,
  created_at
FROM public.assessments;

-- Transparent write rules for legacy `assignments` view
CREATE OR REPLACE RULE assignments_insert AS ON INSERT TO public.assignments
DO INSTEAD
  INSERT INTO public.assessments (
    id, category_id, course_id, title, short_code, type, description, 
    questions, max_score, total_max_score, weight_in_category, weight_percent, 
    status, assigned_tas, is_locked, due_date, display_order
  )
  VALUES (
    COALESCE(NEW.id, gen_random_uuid()::text), NEW.category_id, NEW.course_id, 
    NEW.title, NEW.short_code, COALESCE(NEW.type, 'homework'), NEW.description, 
    COALESCE(NEW.questions, '[]'::jsonb), COALESCE(NEW.max_score, NEW.total_max_score, 100), 
    COALESCE(NEW.total_max_score, NEW.max_score, 100), COALESCE(NEW.weight_in_category, 100), 
    COALESCE(NEW.weight_percent, 10), COALESCE(NEW.status, 'active'), 
    COALESCE(NEW.assigned_tas, '[]'::jsonb), COALESCE(NEW.is_locked, false), 
    NEW.due_date, COALESCE(NEW.display_order, 0)
  );

CREATE OR REPLACE RULE assignments_update AS ON UPDATE TO public.assignments
DO INSTEAD
  UPDATE public.assessments SET
    title = NEW.title,
    short_code = NEW.short_code,
    type = NEW.type,
    description = NEW.description,
    questions = NEW.questions,
    max_score = NEW.max_score,
    total_max_score = NEW.total_max_score,
    weight_in_category = NEW.weight_in_category,
    weight_percent = NEW.weight_percent,
    status = NEW.status,
    assigned_tas = NEW.assigned_tas,
    is_locked = NEW.is_locked,
    due_date = NEW.due_date,
    display_order = NEW.display_order
  WHERE id = OLD.id;

CREATE OR REPLACE RULE assignments_delete AS ON DELETE TO public.assignments
DO INSTEAD
  DELETE FROM public.assessments WHERE id = OLD.id;

-- 8. Students Table (Official Course Roster)
CREATE TABLE IF NOT EXISTS public.students (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  student_id_number text NOT NULL,                          -- e.g. 'STU001', '4042019001'
  student_id text,                                          -- Compatibility alias matching student_id_number
  full_name text NOT NULL,
  name text,                                                -- Compatibility alias
  email text,
  section text DEFAULT 'Section A',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_course_student UNIQUE (course_id, student_id_number)
);

-- Trigger to maintain compatibility fields in public.students
CREATE OR REPLACE FUNCTION public.sync_student_aliases()
RETURNS trigger AS $$
BEGIN
  NEW.student_id := COALESCE(NEW.student_id, NEW.student_id_number);
  NEW.student_id_number := COALESCE(NEW.student_id_number, NEW.student_id);
  NEW.name := COALESCE(NEW.name, NEW.full_name);
  NEW.full_name := COALESCE(NEW.full_name, NEW.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_student_aliases ON public.students;
CREATE TRIGGER trg_sync_student_aliases
  BEFORE INSERT OR UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.sync_student_aliases();

-- 9. Grades Table (Student Evaluation Records)
CREATE TABLE IF NOT EXISTS public.grades (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  student_id text NOT NULL,
  assessment_id text NOT NULL,
  assignment_id text,                                       -- Compatibility alias
  score numeric CHECK (score >= 0),
  scores jsonb DEFAULT '{}'::jsonb,                         -- Granular per-part scores
  is_excused boolean NOT NULL DEFAULT false,
  feedback text,
  grader_id text,
  graded_by text,
  graded_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_student_assessment UNIQUE (student_id, assessment_id)
);

-- Trigger to maintain compatibility fields in public.grades
CREATE OR REPLACE FUNCTION public.sync_grade_aliases()
RETURNS trigger AS $$
BEGIN
  NEW.assessment_id := COALESCE(NEW.assessment_id, NEW.assignment_id);
  NEW.assignment_id := COALESCE(NEW.assignment_id, NEW.assessment_id);
  NEW.graded_by := COALESCE(NEW.graded_by, NEW.grader_id);
  NEW.grader_id := COALESCE(NEW.grader_id, NEW.graded_by);
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_grade_aliases ON public.grades;
CREATE TRIGGER trg_sync_grade_aliases
  BEFORE INSERT OR UPDATE ON public.grades
  FOR EACH ROW EXECUTE FUNCTION public.sync_grade_aliases();

-- 10. Grade Audit Logs (Cryptographic-Grade Change Ledger)
CREATE TABLE IF NOT EXISTS public.grade_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_id text,
  student_id text NOT NULL,
  assessment_id text NOT NULL,
  old_score numeric,
  new_score numeric,
  old_scores_breakdown jsonb,
  new_scores_breakdown jsonb,
  changed_by text,
  changed_at timestamptz NOT NULL DEFAULT now(),
  reason text DEFAULT 'Grade modified'
);

-- PostgreSQL Audit Trigger: Capture every single score mutation
CREATE OR REPLACE FUNCTION public.log_grade_audit()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'UPDATE') THEN
    IF (OLD.score IS DISTINCT FROM NEW.score OR OLD.scores IS DISTINCT FROM NEW.scores) THEN
      INSERT INTO public.grade_audit_logs (
        grade_id, student_id, assessment_id, 
        old_score, new_score, 
        old_scores_breakdown, new_scores_breakdown, 
        changed_by, changed_at, reason
      )
      VALUES (
        NEW.id, NEW.student_id, NEW.assessment_id,
        OLD.score, NEW.score,
        OLD.scores, NEW.scores,
        COALESCE(auth.uid()::text, NEW.graded_by, 'system'),
        now(),
        'Score revision'
      );
    END IF;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO public.grade_audit_logs (
      grade_id, student_id, assessment_id, 
      old_score, new_score, 
      old_scores_breakdown, new_scores_breakdown, 
      changed_by, changed_at, reason
    )
    VALUES (
      NEW.id, NEW.student_id, NEW.assessment_id,
      NULL, NEW.score,
      NULL, NEW.scores,
      COALESCE(auth.uid()::text, NEW.graded_by, 'system'),
      now(),
      'Initial grade entry'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_grade_audit ON public.grades;
CREATE TRIGGER trg_grade_audit
  AFTER INSERT OR UPDATE ON public.grades
  FOR EACH ROW EXECUTE FUNCTION public.log_grade_audit();

-- 11. Regrade Requests & Academic Appeals
CREATE TABLE IF NOT EXISTS public.regrades (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  student_id text NOT NULL,
  student_name text NOT NULL,
  assignment_id text NOT NULL,
  assignment_title text NOT NULL,
  question_label text NOT NULL,
  current_score numeric NOT NULL,
  max_score numeric NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'rejected')),
  ta_response text,
  adjusted_score numeric,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 12. High-Performance Query Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_course_memberships_course ON public.course_memberships(course_id);
CREATE INDEX IF NOT EXISTS idx_course_memberships_user ON public.course_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_categories_course ON public.assessment_categories(course_id);
CREATE INDEX IF NOT EXISTS idx_assessments_course ON public.assessments(course_id);
CREATE INDEX IF NOT EXISTS idx_assessments_category ON public.assessments(category_id);
CREATE INDEX IF NOT EXISTS idx_students_course ON public.students(course_id);
CREATE INDEX IF NOT EXISTS idx_students_id_num ON public.students(student_id_number);
CREATE INDEX IF NOT EXISTS idx_grades_student ON public.grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_assessment ON public.grades(assessment_id);
CREATE INDEX IF NOT EXISTS idx_grade_audit_student ON public.grade_audit_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_grade_audit_assessment ON public.grade_audit_logs(assessment_id);
CREATE INDEX IF NOT EXISTS idx_regrades_student ON public.regrades(student_id);
CREATE INDEX IF NOT EXISTS idx_regrades_assignment ON public.regrades(assignment_id);
CREATE INDEX IF NOT EXISTS idx_regrades_status ON public.regrades(status);

-- 13. Comprehensive Row Level Security (RLS) Protocol
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grade_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regrades ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies cleanly
DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- Policies for public.users
CREATE POLICY "users_read_all" ON public.users 
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "users_self_update" ON public.users 
  FOR UPDATE TO authenticated USING (id = auth.uid()::text) WITH CHECK (id = auth.uid()::text);

CREATE POLICY "users_admin_manage" ON public.users 
  FOR ALL TO authenticated USING (public.get_current_user_role() IN ('admin', 'instructor'));

-- Policies for public.courses
CREATE POLICY "courses_read_all" ON public.courses 
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "courses_admin_manage" ON public.courses 
  FOR ALL TO authenticated USING (public.get_current_user_role() IN ('admin', 'instructor'));

-- Policies for public.course_memberships
CREATE POLICY "memberships_read" ON public.course_memberships 
  FOR SELECT TO authenticated USING (
    user_id = auth.uid() OR public.get_current_user_role() IN ('admin', 'instructor', 'ta')
  );

CREATE POLICY "memberships_admin_manage" ON public.course_memberships 
  FOR ALL TO authenticated USING (public.get_current_user_role() IN ('admin', 'instructor'));

-- Policies for public.assessment_categories
CREATE POLICY "categories_read_all" ON public.assessment_categories 
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "categories_admin_manage" ON public.assessment_categories 
  FOR ALL TO authenticated USING (public.get_current_user_role() IN ('admin', 'instructor'));

-- Policies for public.assessments
CREATE POLICY "assessments_read_all" ON public.assessments 
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "assessments_admin_manage" ON public.assessments 
  FOR ALL TO authenticated USING (public.get_current_user_role() IN ('admin', 'instructor', 'ta'));

-- Policies for public.students
CREATE POLICY "students_read_self_or_staff" ON public.students 
  FOR SELECT TO authenticated USING (
    student_id_number = public.get_current_student_id() 
    OR student_id = public.get_current_student_id()
    OR public.get_current_user_role() IN ('admin', 'instructor', 'ta')
  );

CREATE POLICY "students_admin_manage" ON public.students 
  FOR ALL TO authenticated USING (public.get_current_user_role() IN ('admin', 'instructor'));

-- Policies for public.grades
CREATE POLICY "grades_read_self_or_staff" ON public.grades 
  FOR SELECT TO authenticated USING (
    student_id = public.get_current_student_id()
    OR public.get_current_user_role() IN ('admin', 'instructor', 'ta')
  );

CREATE POLICY "grades_staff_manage" ON public.grades 
  FOR ALL TO authenticated USING (public.get_current_user_role() IN ('admin', 'instructor', 'ta'));

-- Policies for public.grade_audit_logs
CREATE POLICY "audit_read_self_or_staff" ON public.grade_audit_logs 
  FOR SELECT TO authenticated USING (
    student_id = public.get_current_student_id()
    OR public.get_current_user_role() IN ('admin', 'instructor', 'ta')
  );

CREATE POLICY "audit_admin_manage" ON public.grade_audit_logs 
  FOR ALL TO authenticated USING (public.get_current_user_role() IN ('admin', 'instructor'));

-- Policies for public.regrades
CREATE POLICY "regrades_read_self_or_staff" ON public.regrades 
  FOR SELECT TO authenticated USING (
    student_id = public.get_current_student_id()
    OR public.get_current_user_role() IN ('admin', 'instructor', 'ta')
  );

CREATE POLICY "regrades_student_insert" ON public.regrades 
  FOR INSERT TO authenticated WITH CHECK (
    student_id = public.get_current_student_id()
  );

CREATE POLICY "regrades_staff_manage" ON public.regrades 
  FOR ALL TO authenticated USING (public.get_current_user_role() IN ('admin', 'instructor', 'ta'));
