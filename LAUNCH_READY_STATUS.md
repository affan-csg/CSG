# LAUNCH READINESS STATUS

**Last updated:** 2026-08-27
**Target launch date:** September 1, 2026
**Status:** 🟢 **Every P0/P1 item from the implementation brief is built, migrated, and verified end-to-end against the live database. What's left is business decisions and content ownership, not engineering.**

This file tracks status against the developer implementation brief
(`implementation_plan.docx`). It's a living document — update it as items are
closed, don't leave it as a historical snapshot.

---

## ✅ Done and verified this pass

**Core forms — rebuilt, migrated, and tested against production data:**

- `/get-started` rebuilt as the brief's full 3-step progressive form (§11.1/11.2):
  multi-select skills + Other, number of hires, engagement type, work arrangement,
  conditional location/timezone, target start, top-3 skills, seniority, budget +
  "need guidance" option, region preference, optional JD upload, UTM/referrer/
  source-page hidden capture, Calendly link in the success state (null-hides
  cleanly if unset).
- `/join-our-bench` updated per §12: region field, US work-authorization field
  (shown/required only for US applicants), work-arrangement field, and a
  compensation question that dynamically asks hourly/annual-salary/monthly based
  on region + engagement instead of one fixed "monthly rate" field.
- Four new Supabase migrations (`007`–`010`) written and **successfully applied to
  the live production database**:
  - `007` — fixes a real bug where `cybersecurity-grc` could be selected in the UI
    but was rejected by the database's `CHECK` constraint.
  - `008` — all new `client_requirements` columns for the progressive form, plus
    the `job-descriptions` private Storage bucket.
  - `009` — all new `candidate_applications` columns (region, work authorization,
    work arrangement, typed compensation).
  - `010` — a `seniority` column that `008` should have included but didn't
    (caught and fixed during end-to-end testing, before it reached a real user).
- **Both forms tested with real submissions against the live production database**,
  then independently verified by querying Supabase directly (not just trusting the
  UI's success message), then the test rows and uploaded files were deleted.
  Confirmed correct: multi-skill arrays, `cybersecurity-grc` inserts cleanly now,
  conditional work-authorization/compensation logic, JD upload, UTM capture.

**Content and compliance:**

- No residential address anywhere; correct client list (Verifone, GoodRco,
  Snapdocs, Lilt); corrected direct-hire savings math ($75K–$150K, not $250K+).
- Real Privacy Policy, Candidate Privacy Notice, Terms of Use, and Accessibility
  Statement — none are placeholders. (Terms still worth an actual legal review
  before treating as final — see Open items.)
- Privacy Policy is now linked from all three forms (contact, employer, candidate)
  — previously only the candidate form linked it, which failed the brief's own
  acceptance criterion.
- Fixed a real "eight technical practices" content bug live on the site: six
  places (FAQ copy, a page heading, a stat tile, two meta descriptions, and a
  duplicated specialty list on the candidate page) still said "eight" and omitted
  Cybersecurity & GRC after it became the 9th practice. All fixed; the duplicated
  specialty list was also replaced with the single source of truth
  (`specialtyOptions`) so this can't drift again.
- `public/llms.txt` (AI-crawler-facing site index) was stale and out of sync with
  the rest of the site — fixed the 15-30%→20-30% fee figure, a dead link to the
  deleted `/refund` page, "Blog"→"Insights" naming, "Terms & Conditions"→"Terms of
  Use," and added the two newer legal pages.

**Site-wide fixes:**

- Organization JSON-LD `sameAs` built from the nullable social-profile env-var
  config instead of a hardcoded array.
- Preview-domain (`csg-v2.vercel.app`) noindex via an `X-Robots-Tag` response
  header, keyed off request hostname.
- All 9 expertise pages have 3–5 tailored FAQs.
- Uncited/superlative market stats in `staffing.ts`/`delivery.ts` softened to
  qualified language — not independently source-verified, just no longer stated
  as bare fact (see Open items).
- `/offer-calibration` rebuilt: renamed, static table replaced with an
  interactive role selector, linked from the Resources nav dropdown, routes to
  `/get-started?skill=<role>` instead of duplicating the form.
- **Nav dropdowns are now keyboard-operable**: open on focus (not just hover),
  Escape closes the open dropdown and returns focus to its trigger, focus
  leaving the whole widget closes it. Mobile menu: Escape closes it and returns
  focus to the toggle button, "Request Talent" is now the last focusable item
  (brief requirement), both dropdown toggles expose `aria-expanded`.
- **Site-wide dropdown-visibility bug fixed**: the site never declared
  `color-scheme: dark`, so every native `<select>` popup on every form rendered
  with browser default light-mode colors against light option text — effectively
  invisible. Fixed in `src/styles.css` with `color-scheme: dark` plus explicit
  `<option>` colors, one change covering every form site-wide.
- 164/164 unit tests passing, clean typecheck, 0 lint errors (7 pre-existing
  `react-refresh` warnings remain in vendored shadcn/ui files — cosmetic,
  dev-only, deliberately not touched).

---

## ⏳ Still open — needs your decision, not more engineering

- [ ] **Client-logo proof strip (Verifone/GoodRco/Snapdocs/Lilt) only renders on
      `/case-studies`.** Brief §3 requires it on Home and Our Story too — the
      homepage currently only has a one-line text mention, not the visual
      component. Straightforward to add once you confirm placement.
- [ ] **Section 22 content-approval-gate mechanism was never built.** Logos, the
      90-day guarantee, EOR/payroll language, and compensation benchmarks are all
      hardcoded with no way to hide them if unapproved. Either build the gate
      mechanism, or explicitly decide the current content is already
      CEO-approved as-is and document that decision here instead.
- [ ] **GA4 event contract (brief §18.2)** — deliberately deferred to
      post-production per explicit instruction.
- [ ] **Uncited market stats are softened, not sourced.** Figures in
      `staffing.ts`/`delivery.ts` still have no visible citation/date per role.
      Needs either a real source or further qualification from whoever owns the
      content.
- [ ] **Terms of Use needs an actual legal review** before being treated as
      final — it's real, substantive content now, not a placeholder, but it was
      drafted, not counsel-reviewed.
- [ ] **HubSpot CRM sync does not receive the new form fields** (UTM data,
      engagement type, budget, etc.) — only core contact fields (name, email,
      company, phone) are pushed, since HubSpot would reject unknown custom
      property names unless they're already defined in that portal. Full lead
      detail does reach the notification email and Supabase either way.

**Known non-issues, intentionally not touched:**

- 7 `react-refresh/only-export-components` ESLint warnings in
  `src/components/ui/*.tsx` and `error-boundary.tsx` — standard shadcn/ui
  generated-component pattern, dev-only, no production impact.
- Vite build warning about chunks >500kB after minification — pre-existing,
  would need an app-wide code-splitting pass, out of scope here.

---

## Next steps

1. Decide on the two open items above that need a business/content call (logo
   placement, approval-gate mechanism).
2. Get the Terms of Use in front of counsel.
3. Source or further-qualify the remaining market statistics.
4. Turn on GA4 post-launch per the brief's original hypercare-week plan.
