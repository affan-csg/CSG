-- ============================================================================
-- 009_bench_form_work_auth_compensation.sql
--
-- implementation_plan.docx section 12 requires: a US work-authorization
-- field for US applicants, compensation asked conditionally by region/
-- engagement instead of one universal monthly-USD field, and a remote/
-- hybrid/onsite preference. This adds the columns needed for all three.
--
-- expected_monthly_rate (added in 006) is renamed to compensation_amount —
-- it's the same underlying number, just no longer assumed to always be a
-- monthly rate. compensation_type records which of hourly/annual-salary/
-- monthly the number in compensation_amount actually represents.
--
-- Idempotent — see the note at the top of 001_initial_schema.sql. The
-- rename is guarded so this migration can be re-run safely even after the
-- column has already been renamed once.
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'candidate_applications' AND column_name = 'expected_monthly_rate'
  ) THEN
    ALTER TABLE candidate_applications RENAME COLUMN expected_monthly_rate TO compensation_amount;
  END IF;
END $$;

ALTER TABLE candidate_applications
  ADD COLUMN IF NOT EXISTS compensation_type text,
  ADD COLUMN IF NOT EXISTS region text,
  ADD COLUMN IF NOT EXISTS work_authorization text,
  ADD COLUMN IF NOT EXISTS work_arrangement text;

ALTER TABLE candidate_applications
  DROP CONSTRAINT IF EXISTS candidate_applications_expected_monthly_rate_check;
ALTER TABLE candidate_applications
  DROP CONSTRAINT IF EXISTS candidate_applications_compensation_amount_check;
ALTER TABLE candidate_applications
  ADD CONSTRAINT candidate_applications_compensation_amount_check
  CHECK (compensation_amount IS NULL OR compensation_amount >= 0);

ALTER TABLE candidate_applications
  DROP CONSTRAINT IF EXISTS candidate_applications_compensation_type_check;
ALTER TABLE candidate_applications
  ADD CONSTRAINT candidate_applications_compensation_type_check
  CHECK (compensation_type IS NULL OR compensation_type IN ('hourly','annual-salary','monthly'));

ALTER TABLE candidate_applications
  DROP CONSTRAINT IF EXISTS candidate_applications_region_check;
ALTER TABLE candidate_applications
  ADD CONSTRAINT candidate_applications_region_check
  CHECK (region IS NULL OR region IN ('us','latam','pakistan'));

ALTER TABLE candidate_applications
  DROP CONSTRAINT IF EXISTS candidate_applications_work_authorization_check;
ALTER TABLE candidate_applications
  ADD CONSTRAINT candidate_applications_work_authorization_check
  CHECK (work_authorization IS NULL OR work_authorization IN (
    'us-citizen-or-green-card','authorized-no-sponsorship','requires-sponsorship'
  ));

ALTER TABLE candidate_applications
  DROP CONSTRAINT IF EXISTS candidate_applications_work_arrangement_check;
ALTER TABLE candidate_applications
  ADD CONSTRAINT candidate_applications_work_arrangement_check
  CHECK (work_arrangement IS NULL OR work_arrangement IN ('onsite','hybrid','remote'));
