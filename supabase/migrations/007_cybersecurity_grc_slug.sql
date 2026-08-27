-- ============================================================================
-- 007_cybersecurity_grc_slug.sql
--
-- specialtyOptions (src/lib/forms.ts) added "cybersecurity-grc" as the
-- selectable value for the Cybersecurity & GRC practice, replacing the old
-- generic "grc" option in the UI. The CHECK constraints added in
-- 005_specialty_slugs.sql never learned about it — they still only allow
-- the legacy 'grc' value. A real submission with skill_needed/specialty =
-- 'cybersecurity-grc' passes frontend and zod validation and then fails at
-- the database insert.
--
-- Widening as a pure superset, same reasoning as 005: 'grc' is kept (not
-- dropped) for the same historical-row reason documented there — dropping
-- it would make Postgres re-validate the CHECK constraint against existing
-- rows and reject any that still have 'grc'.
--
-- Idempotent (DROP ... IF EXISTS then re-ADD) — see the note at the top of
-- 001_initial_schema.sql.
-- ============================================================================

ALTER TABLE client_requirements
  DROP CONSTRAINT IF EXISTS client_requirements_skill_needed_check;

ALTER TABLE client_requirements
  ADD CONSTRAINT client_requirements_skill_needed_check
  CHECK (skill_needed IN (
    'ai-ml','mlops','data','devops','devsecops','cloud','software-dev','product','cybersecurity-grc','grc'
  ));

ALTER TABLE candidate_applications
  DROP CONSTRAINT IF EXISTS candidate_applications_specialty_check;

ALTER TABLE candidate_applications
  ADD CONSTRAINT candidate_applications_specialty_check
  CHECK (specialty IN (
    'ai-ml','mlops','data','devops','devsecops','cloud','software-dev','product','cybersecurity-grc','grc'
  ));
