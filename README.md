# Onboarding Form

[![E2E](https://github.com/redKath/onboarding-form/actions/workflows/e2e.yml/badge.svg)](https://github.com/redKath/onboarding-form/actions/workflows/e2e.yml)

A multi-step employee onboarding form with per-step Zod validation, conditional fields, saved progress and a review screen.

**Live:** https://onboarding-form-git-main-kats-projects-576abbd6.vercel.app/
**Repo:** https://github.com/redKath/onboarding-form

![Onboarding form, step 1 of 4](docs/screenshot.png)

## Stack

- Next.js (App Router) + TypeScript (strict)
- Tailwind CSS
- react-hook-form + Zod (`@hookform/resolvers/zod`)
- ESLint + Prettier
- Playwright (E2E) + axe-core (accessibility)
- No backend or database: all data stays in the browser

## Features

- **Per-step Zod validation:** one schema per step, combined into a full schema; types come from `z.infer`. Inline errors, and focus moves to the first invalid field.
- **Conditional fields:** contract end date (Contract only, must be after the start date) and preferred office (Hybrid or Onsite).
- **Persistence:** progress and current step are saved to `localStorage`, restored on refresh, and cleared on submit or "Start over".
- **Review and edit:** read-only summary grouped by step with an Edit link per group, a full-schema check on submit, and a copyable JSON result.
- **Accessibility:** labels tied to inputs, `aria-invalid` and `aria-describedby` for errors, keyboard navigation, visible focus states.
- **Responsive:** works from 375px phones to desktop.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Other scripts: `npm run build`, `npm run lint`, `npm run format`.

## Testing

End-to-end tests with Playwright run against a production build on desktop Chromium, desktop WebKit and a mobile viewport (Pixel 7). Specs use a page object (`tests/pages/OnboardingPage.ts`) and accessible locators.

**Covered**

- **Personal info:** required, name length, email formats, phone rules, 18+ boundary, `aria-invalid` / `aria-describedby`, focus on first invalid field
- **Work details:** required fields, start date, conditional contract end date
- **Preferences:** equipment, conditional office, bio counter and limit, policies
- **Review & submit:** grouped summary, Edit buttons, success JSON, Start over
- **Persistence:** reload restore, reset after submit, corrupted `localStorage`
- **Navigation:** Back keeps data, progress bar, keyboard-only happy path
- **Accessibility:** axe scan on every step and the success screen (fails on serious/critical)
- **Mobile:** happy path with no horizontal scroll

Known bugs are kept as `test.fail()` tests that link to their GitHub issue.

**Run**

```bash
npx playwright install        # first time only
npm run test:e2e              # builds and starts the app, then runs all projects
npm run test:e2e:ui           # UI mode
npm run test:e2e:report       # open the last HTML report

# against a deployed site
BASE_URL=https://onboarding-form-eight-chi.vercel.app npm run test:e2e
```

CI runs the suite on every pull request and push to `main` (`.github/workflows/e2e.yml`).

## Project structure

```
app/                  Next.js App Router entry
components/form/      Stepper, field components, step forms, review and success screens
components/ui/        Shared UI primitives
lib/schemas/          Zod schemas per step and the combined schema
lib/storage.ts        localStorage load/save/clear
tests/                Playwright specs, page object and fixtures
```

Built with Claude Code; all code reviewed and tested manually.
