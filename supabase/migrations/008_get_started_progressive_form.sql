-- ============================================================================
-- 008_get_started_progressive_form.sql
--
-- Rebuilds /get-started as the brief's 3-step progressive employer form
-- (implementation_plan.docx, section 11.1/11.2). The old client_requirements
-- schema only covered step 1's fields plus a single skill/engagement/basis
-- combination — this adds every field the brief's step 2 and step 3 ask for,
-- plus the UTM/referrer/source-page capture required by section 11.2.
--
-- skill_needed, engagement_type and basis are relaxed to nullable rather
-- than dropped: the brief's new "Role or skill" is a multi-select
-- (skills_needed[]) and "Engagement" is a single field with a different
-- value set (contract/contract-to-hire/full-time/pod/unsure), so the new
-- form no longer populates the old three columns. Existing CHECK
-- constraints on them are unaffected — Postgres treats CHECK as satisfied
-- when the column is NULL, so historical rows and their constraints are
-- untouched.
--
-- company_name is required by the brief and by requirementSchema (the app
-- layer), but is NOT tightened to NOT NULL here — company_name has been
-- nullable since 001_initial_schema.sql and live historical rows already
-- have NULL there, which SET NOT NULL rejects outright (Postgres validates
-- existing data before applying the constraint). Same pattern as seniority
-- and expected_monthly_rate in 006: required in the UI, permissive at the
-- DB level.
--
-- Idempotent (IF NOT EXISTS / IF EXISTS, DROP+re-ADD constraints) — see the
-- note at the top of 001_initial_schema.sql.
-- ============================================================================

ALTER TABLE client_requirements
  ALTER COLUMN skill_needed DROP NOT NULL,
  ALTER COLUMN engagement_type DROP NOT NULL,
  ALTER COLUMN basis DROP NOT NULL;

ALTER TABLE client_requirements
  ADD COLUMN IF NOT EXISTS skills_needed text[],
  ADD COLUMN IF NOT EXISTS skill_other text,
  ADD COLUMN IF NOT EXISTS number_of_hires integer,
  ADD COLUMN IF NOT EXISTS engagement text,
  ADD COLUMN IF NOT EXISTS work_arrangement text,
  ADD COLUMN IF NOT EXISTS location_or_timezone text,
  ADD COLUMN IF NOT EXISTS target_start text,
  ADD COLUMN IF NOT EXISTS top_skills text,
  ADD COLUMN IF NOT EXISTS budget_rate text,
  ADD COLUMN IF NOT EXISTS needs_budget_guidance boolean,
  ADD COLUMN IF NOT EXISTS region_preference text,
  ADD COLUMN IF NOT EXISTS job_description_url text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS referrer text,
  ADD COLUMN IF NOT EXISTS source_page text;

ALTER TABLE client_requirements
  DROP CONSTRAINT IF EXISTS client_requirements_number_of_hires_check;
ALTER TABLE client_requirements
  ADD CONSTRAINT client_requirements_number_of_hires_check
  CHECK (number_of_hires IS NULL OR number_of_hires >= 1);

ALTER TABLE client_requirements
  DROP CONSTRAINT IF EXISTS client_requirements_engagement_check;
ALTER TABLE client_requirements
  ADD CONSTRAINT client_requirements_engagement_check
  CHECK (engagement IS NULL OR engagement IN (
    'contract','contract-to-hire','full-time','pod','unsure'
  ));

ALTER TABLE client_requirements
  DROP CONSTRAINT IF EXISTS client_requirements_work_arrangement_check;
ALTER TABLE client_requirements
  ADD CONSTRAINT client_requirements_work_arrangement_check
  CHECK (work_arrangement IS NULL OR work_arrangement IN ('onsite','hybrid','remote'));

ALTER TABLE client_requirements
  DROP CONSTRAINT IF EXISTS client_requirements_target_start_check;
ALTER TABLE client_requirements
  ADD CONSTRAINT client_requirements_target_start_check
  CHECK (target_start IS NULL OR target_start IN (
    'immediate','2-4-weeks','1-3-months','planning'
  ));

ALTER TABLE client_requirements
  DROP CONSTRAINT IF EXISTS client_requirements_region_preference_check;
ALTER TABLE client_requirements
  ADD CONSTRAINT client_requirements_region_preference_check
  CHECK (region_preference IS NULL OR region_preference IN (
    'us','latam','pakistan','recommend'
  ));

-- Private Storage bucket for optional job-description uploads (step 3).
-- Separate from the "resumes" bucket — different uploader (employer, not
-- candidate) and no reason to mix the two in one access-controlled bucket.
INSERT INTO storage.buckets (id, name, public)
VALUES ('job-descriptions', 'job-descriptions', false)
ON CONFLICT (id) DO NOTHING;
