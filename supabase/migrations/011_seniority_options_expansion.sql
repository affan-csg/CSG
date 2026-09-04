-- ============================================================================
-- 011_seniority_options_expansion.sql
--
-- seniorityOptions (src/lib/forms.ts) expanded from 5 values
-- (junior, mid-level, senior, lead, principal) to 10, replacing "lead" with
-- "staff-lead" and adding intern/manager/director/vp/c-level. This updates
-- the CHECK constraints on both tables that reference it
-- (candidate_applications from 006, client_requirements from 010) to match.
--
-- Idempotent — see the note at the top of 001_initial_schema.sql.
-- ============================================================================

ALTER TABLE candidate_applications
  DROP CONSTRAINT IF EXISTS candidate_applications_seniority_check;
ALTER TABLE candidate_applications
  ADD CONSTRAINT candidate_applications_seniority_check
  CHECK (seniority IS NULL OR seniority IN
    ('intern','junior','mid-level','senior','staff-lead','principal','manager','director','vp','c-level'));

ALTER TABLE client_requirements
  DROP CONSTRAINT IF EXISTS client_requirements_seniority_check;
ALTER TABLE client_requirements
  ADD CONSTRAINT client_requirements_seniority_check
  CHECK (seniority IS NULL OR seniority IN
    ('intern','junior','mid-level','senior','staff-lead','principal','manager','director','vp','c-level'));
