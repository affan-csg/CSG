-- ============================================================================
-- 012_region_preference_options.sql
--
-- regionPreferenceOptions (src/lib/forms.ts) dropped "recommend" ("Recommend
-- a region for me") — the /get-started step 3 dropdown now offers only
-- US, LATAM, and Pakistan. Updates the CHECK constraint from
-- 008_get_started_progressive_form.sql to match.
--
-- Postgres validates existing rows when a CHECK constraint is (re-)added, so
-- any historical row already holding 'recommend' is nulled out first —
-- otherwise this migration would fail outright on a database with live
-- submissions. Same concern 008's own header flags for company_name.
--
-- Idempotent — see the note at the top of 001_initial_schema.sql.
-- ============================================================================

UPDATE client_requirements
  SET region_preference = NULL
  WHERE region_preference = 'recommend';

ALTER TABLE client_requirements
  DROP CONSTRAINT IF EXISTS client_requirements_region_preference_check;
ALTER TABLE client_requirements
  ADD CONSTRAINT client_requirements_region_preference_check
  CHECK (region_preference IS NULL OR region_preference IN (
    'us','latam','pakistan'
  ));
