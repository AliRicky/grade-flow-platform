-- Migration: 20261105130000_student_grades_roster_view.sql
-- Resolves foreign key mapping mismatch between Supabase Auth UUID (users.id) in grades
-- and Academic Student ID (users.student_id) in submissions and Telegram students table.

CREATE OR REPLACE VIEW public.v_student_grades_roster AS
SELECT 
    u.id AS user_id,
    u.student_id,
    u.full_name AS student_name,
    u.role,
    u.section,
    g.assignment_id,
    a.short_code AS assignment_code,
    a.title AS assignment_title,
    a.total_max_score,
    g.scores,
    g.graded_by,
    g.graded_at,
    sub.file_name AS submission_file_name,
    sub.submitted_at AS submission_time,
    sub.edit_count AS submission_edits,
    sub.message_id AS submission_archive_message_id,
    s.chat_id AS telegram_chat_id,
    s.registered_at AS telegram_registered_at
FROM public.users u
LEFT JOIN public.students s ON s.student_id = u.student_id
LEFT JOIN public.grades g ON g.student_id = u.id
LEFT JOIN public.assignments a ON a.id = g.assignment_id
LEFT JOIN public.submissions sub ON sub.student_id = u.student_id AND (
    (a.short_code = 'HW1' AND sub.hw_num = 1) OR
    (a.short_code = 'HW2' AND sub.hw_num = 2) OR
    (a.short_code = 'HW3' AND sub.hw_num = 3) OR
    (a.short_code = 'HW4' AND sub.hw_num = 4) OR
    (a.short_code = 'HW5' AND sub.hw_num = 5)
);

-- Grant access on the unified view
GRANT SELECT ON public.v_student_grades_roster TO authenticated, anon, service_role;
