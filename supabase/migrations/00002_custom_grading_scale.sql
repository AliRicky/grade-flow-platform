-- =====================================================================================
-- Migration 00002: Dynamic Multi-Scale Course Scoring Architecture
-- Author: Alan Turing (Lead of Software Engineering)
-- Description: Standardizes courses.grading_scale column default to support dynamic,
--              per-course scoring scales (9-pt, 20-pt, 100-pt, 4.0 GPA, custom).
-- =====================================================================================

ALTER TABLE public.courses
ALTER COLUMN grading_scale SET DEFAULT '{
  "type": "numeric",
  "max_score": 9.0,
  "passing_threshold": 4.0,
  "precision": 1,
  "label": "9-Point Scale (Original)"
}'::jsonb;

-- Backfill existing course records if missing passing_threshold or label
UPDATE public.courses
SET grading_scale = jsonb_build_object(
  'type', COALESCE(grading_scale->>'type', 'numeric'),
  'max_score', COALESCE((grading_scale->>'max_score')::numeric, 9.0),
  'passing_threshold', COALESCE((grading_scale->>'passing_threshold')::numeric, (grading_scale->>'min_pass')::numeric, 4.0),
  'precision', COALESCE((grading_scale->>'precision')::integer, 1),
  'label', COALESCE(grading_scale->>'label', '9-Point Scale (Original)')
)
WHERE grading_scale IS NOT NULL;
