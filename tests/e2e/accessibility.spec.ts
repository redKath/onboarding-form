import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, test } from "../fixtures";
import {
  validPersonal,
  validPreferences,
  validWork,
} from "../fixtures/validData";

// Fails on serious/critical axe violations, listing each with its failing nodes.
async function expectNoSeriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  const blocking = violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map(
      (v) =>
        `${v.impact} ${v.id}: ${v.help}\n  ${v.nodes.map((n) => n.target.join(" ")).join("\n  ")}`,
    );
  expect(blocking).toEqual([]);
}

test.describe("Accessibility (axe)", () => {
  test("Personal info step has no serious violations", async ({
    onboarding,
  }) => {
    await expectNoSeriousViolations(onboarding.page);
  });

  test("Personal info step with validation errors has no serious violations", async ({
    onboarding,
  }) => {
    await onboarding.next();
    await onboarding.expectError("Email is required");
    await expectNoSeriousViolations(onboarding.page);
  });

  test("Work details step has no serious violations", async ({
    onboarding,
  }) => {
    await onboarding.completePersonal(validPersonal);
    await expectNoSeriousViolations(onboarding.page);
  });

  test("Preferences step has no serious violations", async ({ onboarding }) => {
    await onboarding.completePersonal(validPersonal);
    await onboarding.completeWork(validWork);
    await expectNoSeriousViolations(onboarding.page);
  });

  test("Preferences step with validation errors has no serious violations", async ({
    onboarding,
  }) => {
    await onboarding.completePersonal(validPersonal);
    await onboarding.completeWork(validWork);
    await onboarding.next();
    await onboarding.expectError("Select a work setup");
    await expectNoSeriousViolations(onboarding.page);
  });

  test("Review step has no serious violations", async ({ onboarding }) => {
    await onboarding.reachReview(validPersonal, validWork, validPreferences);
    await expectNoSeriousViolations(onboarding.page);
  });

  test("Success screen has no serious violations", async ({ onboarding }) => {
    await onboarding.reachReview(validPersonal, validWork, validPreferences);
    await onboarding.submitButton.click();
    await onboarding.expectStep("Onboarding complete");
    await expectNoSeriousViolations(onboarding.page);
  });
});
