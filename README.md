# Career Source Group — Global Staffing Platform

> Premium staffing and talent delivery platform connecting businesses with expert talent across the US, LATAM (nearshore), and Pakistan (offshore).

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-06B6D4.svg)](https://tailwindcss.com/)

---

## 🚀 Launch Status

**Date:** September 1, 2026
**Status:** ✅ **PRODUCTION READY**

**See:** [LAUNCH_READY_STATUS.md](LAUNCH_READY_STATUS.md) for complete deployment guide.

---

## 🎯 Quick Start

This project uses **pnpm** (pinned in `package.json`).

```bash
# Install dependencies
pnpm install

# Start dev server (http://localhost:8081)
pnpm dev

# Run unit tests
pnpm test

# Run end-to-end tests
pnpm test:e2e

# Type-check
pnpm type-check

# Lint
pnpm lint

# Build for production
pnpm build

# Preview a production build locally
pnpm preview
```

---

## 📋 What We Offer

Career Source Group delivers:

- **10% Direct-Hire Fee** (vs. industry standard 20-30%)
- **Pod Model** for team-based staffing vs. individual placements
- **Three Regional Services:**
  - 🇺🇸 **US** — Direct hire, contract, contract-to-hire
  - 🇲🇽 **LATAM** — Nearshore contract (30-70% cost savings)
  - 🇵🇰 **Pakistan** — Offshore contract (50-70% cost savings)

**One contract. One invoice. One point of contact.**

---

## ✨ Features

- ✅ Responsive design (mobile-first)
- ✅ Interactive forms with validation (Supabase-backed)
- ✅ CRM sync (HubSpot, optional — mirrors leads if configured)
- ✅ Email notifications on submission (Resend, optional)
- ✅ Bot protection (Cloudflare Turnstile)
- ✅ Rate limiting (IP + email based)
- ✅ Server-side error capture with stack recovery for SSR failures
- ✅ Analytics ready (GA4, disabled by default until enabled post-launch)
- ✅ WCAG AA accessibility (Playwright + axe-core checks)
- ✅ SEO optimized (sitemap, structured data, canonical URLs)

---

## 🛠️ Tech Stack

- **Framework:** TanStack Start (React 19, TypeScript)
- **Styling:** Tailwind CSS 4.2
- **Database:** Supabase (PostgreSQL)
- **CRM:** HubSpot (optional sync)
- **Email:** Resend (optional)
- **Bot Protection:** Cloudflare Turnstile
- **Analytics:** Google Analytics 4
- **Build/Server:** Nitro (Vercel preset)
- **Hosting:** Vercel

---

## 📊 Project Structure

```
src/
├── components/        # Reusable React components
├── content/           # Static page/site copy
├── hooks/             # Shared React hooks
├── lib/               # Utilities, analytics, SEO, error capture
│   └── server/        # Server-only helpers (Supabase admin, CRM, notify, rate-limit)
├── server/             # Server middleware
├── routes/            # File-based page routes (TanStack Router)
├── server.ts           # SSR entry — error wrapper & security headers
└── styles.css          # Global styles

public/
├── sitemap.xml         # SEO sitemap
└── robots.txt          # Search engine directives

supabase/
└── migrations/         # Database migrations
```

---

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` (dev) or `.env.production` and fill in. Both are gitignored. See `.env.example` for the full, current list with inline comments — summary below:

```env
# Site
NEXT_PUBLIC_SITE_URL=

# Supabase (required — form storage)
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Resend (optional — staff notification email)
RESEND_API_KEY=
RESEND_FROM_EMAIL=
CONTACT_NOTIFICATION_EMAIL=

# Cloudflare Turnstile (bot protection on forms)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# Calendly (booking iframe)
NEXT_PUBLIC_CALENDLY_URL=

# Analytics (leave disabled until ready)
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_GA4_ID=

# Social links (leave empty to hide the footer icon)
NEXT_PUBLIC_LINKEDIN_URL=
NEXT_PUBLIC_YOUTUBE_URL=
NEXT_PUBLIC_FACEBOOK_URL=
NEXT_PUBLIC_INSTAGRAM_URL=

# CRM sync (optional)
CRM_ENDPOINT_URL=
CRM_API_KEY=

# ATS sync (optional — not wired up yet, no ATS selected)
ATS_ENDPOINT_URL=
ATS_API_KEY=
```

Note: the `NEXT_PUBLIC_` prefix is kept for parity with existing tooling; Vite is configured (`vite.config.ts`) to bake in both `VITE_*` and `NEXT_PUBLIC_*` prefixed vars identically for server and client bundles.

---

## 🚢 Deployment

This app builds via Nitro with the **Vercel** preset (`vite.config.ts`) and ships as a Vercel deployment — there is no standalone `start` script or self-hosted Node server.

1. **Set environment variables** in the Vercel project (mirror `.env.production`).
2. **Push to the connected branch** — Vercel builds and deploys automatically, or run `vercel --prod` locally with the Vercel CLI.
3. **Run Supabase migrations** against the production project (`supabase/migrations/*.sql`) before the first deploy that needs form storage.
4. **Test** — submit a form at `/get-started` and confirm it lands in Supabase (and email/CRM, if configured).
5. **Enable analytics post-launch** by setting `NEXT_PUBLIC_ENABLE_ANALYTICS=true` and redeploying.

**Full checklist:** See [LAUNCH_READY_STATUS.md](LAUNCH_READY_STATUS.md)

---

## ✅ Testing

```bash
pnpm test              # Unit tests (Vitest)
pnpm test:coverage      # Unit tests with coverage
pnpm type-check         # TypeScript
pnpm build               # Production build
pnpm test:e2e            # Playwright e2e tests
pnpm test:a11y            # Accessibility checks (axe-core via Playwright)
pnpm test:all              # lint + type-check + test + test:e2e
```

---

## 🔗 Integrations

| Service              | Purpose                                 | Required?                     |
| -------------------- | --------------------------------------- | ----------------------------- |
| Supabase             | Database + Storage for form submissions | Required                      |
| Cloudflare Turnstile | Bot protection on forms                 | Required                      |
| Resend               | Email notification on submission        | Optional                      |
| HubSpot              | CRM lead sync                           | Optional                      |
| GA4                  | Analytics                               | Optional, disabled by default |

---

## 📄 License

Proprietary — Career Source Group LLC
