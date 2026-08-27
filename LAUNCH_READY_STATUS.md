# LAUNCH READINESS STATUS

**Last updated:** 2026-08-27
**Target launch date:** September 1, 2026
**Status:** 🟡 **Most of the implementation brief is done. A short list of items — one of them a live bug — should be resolved before cutover.**

This file tracks status against the developer implementation brief
(`implementation_plan.docx`). It's a living document — update it as items are
closed, don't leave it as a historical snapshot.

---

## 🔴 Known live bug — fix before launch

- **`cybersecurity-grc` specialty value is not in the database's `CHECK` constraint.**
  `src/lib/forms.ts` offers "Cybersecurity / GRC" as a selectable specialty on the
  candidate form, the requirement form, and the offer-calibration page's CTA — but
  `supabase/migrations/005_specialty_slugs.sql` only allows the legacy value `'grc'`
  for `client_requirements.skill_needed` and `candidate_applications.specialty`.
  Any real submission with that value will pass frontend/zod validation and then
  **fail at the database insert**. Needs a new migration (`007_*.sql`, additive —
  widen the `CHECK` constraint, same pattern as `005`) written and run against the
  live Supabase project before this code reaches production.

---

## ✅ Done this pass

- Non-negotiable P0 content: no residential address anywhere, correct client list
  (Verifone, GoodRco, Snapdocs, Lilt) everywhere, corrected direct-hire savings math
  ($75K–$150K across five $150K hires, not $250K+), Cybersecurity & GRC wired into
  nav/footer/sitemap/forms.
- Real Privacy Policy, Candidate Privacy Notice, Terms of Use, and a new
  Accessibility Statement — none are placeholders anymore. (Still worth an actual
  legal review of the Terms before treating it as final.)
- Organization JSON-LD `sameAs` now built from the nullable social-profile env-var
  config instead of a hardcoded array.
- Preview-domain (`csg-v2.vercel.app`) noindex via an `X-Robots-Tag` response
  header, keyed off request hostname — no Vercel env plumbing needed.
- All 9 expertise pages have 3–5 tailored FAQs (previously empty).
- Uncited/superlative market stats across `staffing.ts` and `delivery.ts` softened
  to qualified language ("typically," "based on current market postings," etc.) —
  not independently source-verified, just no longer stated as bare fact.
- `/offer-calibration` rebuilt: renamed to "Global Talent Cost & Delivery
  Comparison," static table replaced with an interactive role selector + instant
  region comparison, linked from the Resources nav dropdown. Links out to
  `/get-started?skill=<role>` instead of duplicating the requirement form.
- 147/147 unit tests passing, clean typecheck, 0 lint errors (7 pre-existing
  react-refresh warnings remain in vendored shadcn/ui files — see below).

---

## ⏳ Still open

**Needs a feature build (not done):**

- [ ] `/get-started` — still a flat single-step form, not the brief's 3-step
      progressive schema (hires count, work arrangement, timezone, start date,
      top-3 skills, seniority, budget, region preference, JD upload). No
      UTM/referrer capture. No conversion event fires on server success. Building
      this needs a new Supabase migration too (most of those fields have no column
      to land in today).
- [ ] Candidate form (`/join-our-bench`) — missing a US work-authorization field,
      and compensation is one universal field instead of conditional by
      region/engagement.
- [ ] GA4 event contract (brief §18.2) — deliberately deferred to post-production.

**Needs a content/business decision (not done):**

- [ ] The uncited-stats softening above is a stopgap, not a fix — figures still
      have no visible source/date per role. Needs either a real citation or
      further softening from whoever owns the content.

**Known non-issues, intentionally not touched:**

- 7 `react-refresh/only-export-components` ESLint warnings in
  `src/components/ui/*.tsx` and `error-boundary.tsx` — standard shadcn/ui
  generated-component pattern, dev-only, no production impact. Fixing means
  splitting well-established shared UI primitives into extra files for no
  functional gain; left alone deliberately.
- Vite build warning about chunks >500kB after minification — pre-existing,
  would need an app-wide code-splitting pass to address, out of scope here.

---

## Next steps

1. Write and run the `007_*.sql` migration for the `cybersecurity-grc` bug above.
2. Decide whether the `/get-started` and candidate-form feature builds happen
   before or after the Sept 1 date, given they need new DB columns.
3. Get the Terms of Use in front of counsel.
4. Source or further-qualify the remaining market statistics.
