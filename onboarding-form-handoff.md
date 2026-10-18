# Project Handoff: Multi-Step Onboarding Form

**Purpose:** A portfolio project for a Next.js/React frontend job. It needs to show multi-step forms, client-side validation with Zod, clean typed components, responsive Tailwind UI, and a GitHub PR workflow with Vercel previews.
**Repo name:** `onboarding-form` (new public repo under github.com/redKath)
**Deploy:** Vercel (connected to the repo, so every PR gets a preview link)

## Stack
- Next.js (latest, App Router) + TypeScript (strict)
- Tailwind CSS
- react-hook-form + Zod (`@hookform/resolvers/zod`)
- No backend, no database. All data stays client-side.

## Workflow (important: this is part of what's being showcased)
- `main` stays deployable. Do every feature on a branch, with a PR into `main`.
- Suggested PR sequence (one PR each, small and focused):
  1. `chore/setup`: scaffold, Tailwind, ESLint, Prettier, folder structure, README stub
  2. `feat/schemas`: Zod schemas and inferred types for every step
  3. `feat/stepper-shell`: step layout, progress bar, back/next navigation
  4. `feat/steps`: the four step components with validation
  5. `feat/persistence`: save progress to localStorage
  6. `feat/review-submit`: review step, edit links, success screen
  7. `docs/readme`: final README with screenshots and links
- **Kat does all git operations herself.** Don't run `git commit`, `git push`, create branches, or open/merge PRs.
- Work through the milestones in order. When a milestone is done and `npm run build` and `npm run lint` pass, **stop and give Kat**:
  1. The branch name to create (e.g. `feat/schemas`)
  2. A conventional commit message, with a subject line ≤ 72 chars and a short body listing the changes. If the milestone is big, suggest 2–3 commits and list which files go in each.
  3. A PR title and description (what changed, how to test it). Leave a placeholder line for the Vercel preview link.
- Then wait for Kat to confirm she's pushed and merged before starting the next milestone.

## Form spec

### Step 1: Personal info
- Full name (required, 2–80 chars)
- Email (required, valid email)
- Phone (optional; if filled, digits/spaces/+ only, 7–15 digits)
- Date of birth (required; must be 18+)

### Step 2: Work details
- Job title (required)
- Department (required select: Engineering, Design, Marketing, Sales, Operations)
- Employment type (required radio: Full-time, Part-time, Contract)
- Start date (required; today or later)
- If Contract: contract end date (required, after start date). Use a conditional Zod refinement.

### Step 3: Preferences
- Equipment needed (checkbox group: Laptop, Monitor, Headset, Keyboard; at least one)
- Work setup (radio: Remote, Hybrid, Onsite)
- If Hybrid or Onsite: preferred office (required select of 3 fictional offices)
- Short bio (optional, max 300 chars, live character counter)
- Agree to policies (required checkbox)

### Step 4: Review & submit
- Read-only summary grouped by step, with an "Edit" link per group that jumps back to that step
- Submit runs a full-schema validation, then shows a success screen with the final validated JSON (pretty-printed, copyable) and a "Start over" button that clears state and localStorage

## Behavior requirements
- Validate the current step before "Next" is allowed. Show inline error messages under each field.
- Focus the first invalid field when validation fails.
- Progress bar shows the current step, with clickable steps only for those already completed.
- Persist form state and current step to localStorage, restore on refresh, and clear on submit or "Start over". Wrap storage access in try/catch.
- Accessible: labels tied to inputs, `aria-invalid` and `aria-describedby` for errors, keyboard navigable, visible focus states.
- Responsive: comfortable at 375px phone width up to desktop. No horizontal scroll.

## Code quality
- One Zod schema per step, combined into a full schema; types come from `z.infer`, never written twice.
- Reusable field components (TextField, SelectField, RadioGroup, CheckboxGroup, TextArea) that take react-hook-form props, with no duplication across steps.
- Suggested structure: `app/`, `components/form/`, `components/ui/`, `lib/schemas/`, `lib/storage.ts`.
- No `any`. ESLint passes with zero warnings.

## README
- One-line description, live Vercel link, screenshot or GIF
- Stack list
- Features: per-step Zod validation, conditional fields, persistence, review/edit, accessibility
- How to run locally
- Note: "Built with Claude Code; all code reviewed and tested manually."

## Done when
- [ ] All 7 milestones done, each handed to Kat with a branch name, commit message(s), and PR description
- [ ] Production Vercel URL works, and every validation rule above is tested by hand (including the conditional fields)
- [ ] Refresh mid-form restores progress; submit and start over clear it
- [ ] Looks good at 375px, 768px, and desktop
- [ ] `npm run build` and `npm run lint` pass
- [ ] README complete; give Kat the live URL and repo URL
