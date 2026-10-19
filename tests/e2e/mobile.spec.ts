import type { Page } from "@playwright/test";
import { expect, test } from "../fixtures";
import {
  validPersonal,
  validPreferences,
  validWork,
} from "../fixtures/validData";

async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
}

test.describe("Mobile", () => {
  test("completes the happy path without horizontal scroll", async ({
    onboarding,
  }) => {
    await expectNoHorizontalScroll(onboarding.page);

    await onboarding.completePersonal(validPersonal);
    await expectNoHorizontalScroll(onboarding.page);

    await onboarding.completeWork(validWork);
    await expectNoHorizontalScroll(onboarding.page);

    await onboarding.completePreferences(validPreferences);
    await expectNoHorizontalScroll(onboarding.page);

    await onboarding.submitButton.click();
    await onboarding.expectStep("Onboarding complete");
    await expectNoHorizontalScroll(onboarding.page);
  });

  test("keeps validation errors inside the viewport", async ({
    onboarding,
  }) => {
    await onboarding.next();
    await onboarding.expectError("Email is required");
    await expectNoHorizontalScroll(onboarding.page);
  });
});
