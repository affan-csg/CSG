-- ============================================================================
-- 010_get_started_seniority_column.sql
--
-- 008_get_started_progressive_form.sql was missing the seniority column.
-- requirementSchema, db-types.ts and the insert in form-actions.ts already
-- treat client_requirements.seniority as required (step 3 of the brief's
-- progressive form, section 11.1) — the column itself was never added,
-- which surfaced as a PostgREST PGRST204 "column not found in schema
-- cache" error on every /get-started submission. This adds it.
--
-- Idempotent — see the note at the top of 001_initial_schema.sql.
-- ============================================================================

ALTER TABLE client_requirements
  ADD COLUMN IF NOT EXISTS seniority text;

ALTER TABLE client_requirements
  DROP CONSTRAINT IF EXISTS client_requirements_seniority_check;
ALTER TABLE client_requirements
  ADD CONSTRAINT client_requirements_seniority_check
  CHECK (seniority IS NULL OR seniority IN ('junior','mid-level','senior','lead','principal'));
