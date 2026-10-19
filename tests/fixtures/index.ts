import { test as base } from "@playwright/test";
import { OnboardingPage } from "../pages/OnboardingPage";

// Each test gets a fresh browser context, so localStorage always starts empty.
export const test = base.extend<{ onboarding: OnboardingPage }>({
  onboarding: async ({ page }, run) => {
    const onboarding = new OnboardingPage(page);
    await onboarding.goto();
    await run(onboarding);
  },
});

export { expect } from "@playwright/test";
