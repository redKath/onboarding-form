# Bugs found by the E2E suite

Both bugs reproduce on Chromium and WebKit, on a local production build and on the live site. Each has a `test.fail()` test, so the suite stays green; remove `test.fail` when the bug is fixed.

## Bug 1

```
Title: [Work details] Stale "Contract end date is required" error reappears after toggling employment type
Environment: Chromium + WebKit (Playwright), 1280x720, https://onboarding-form-eight-chi.vercel.app/
Steps to reproduce:
  1. Complete Personal info, then on Work details fill every field and pick "Contract".
  2. Leave "Contract end date" empty and click Next. The error "Contract end date is required" shows.
  3. Pick "Full-time". The field and error disappear.
  4. Pick "Contract" again.
Expected: the field is shown empty with no error (it was cleared when hidden).
Actual: "Contract end date is required" is shown again before the user touched the field.
Severity: Low
Evidence: tests/e2e/work-details.spec.ts, "does not show a stale error when switching back to Contract" (test.fail)
```

## Bug 2

```
Title: [Preferences] Stale "Select a preferred office" error reappears after toggling work setup
Environment: Chromium + WebKit (Playwright), 1280x720, https://onboarding-form-eight-chi.vercel.app/
Steps to reproduce:
  1. Complete Personal info and Work details, then on Preferences pick equipment, "Hybrid" or "Onsite", and agree to the policies.
  2. Leave "Preferred office" empty and click Next. The error "Select a preferred office" shows.
  3. Pick "Remote". The office field and error disappear.
  4. Pick "Onsite" again.
Expected: the office field is shown with no error (it was cleared when hidden).
Actual: "Select a preferred office" is shown again before the user touched the field.
Severity: Low
Evidence: tests/e2e/preferences.spec.ts, "does not show a stale error when switching back to Onsite" (test.fail)
```
