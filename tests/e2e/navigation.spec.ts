import { expect, test } from "../fixtures";
import {
  validPersonal,
  validPreferences,
  validWork,
} from "../fixtures/validData";

test.describe("Navigation", () => {
  test("Back is disabled on the first step", async ({ onboarding }) => {
    await expect(onboarding.backButton).toBeDisabled();
  });

  test("Back keeps entered data", async ({ onboarding }) => {
    await onboarding.completePersonal(validPersonal);
    await onboarding.completeWork(validWork);
    await onboarding.fillPreferences(validPreferences);

    await onboarding.back();
    await onboarding.expectStep("Work details");
    await expect(onboarding.jobTitle).toHaveValue(validWork.jobTitle);

    await onboarding.back();
    await onboarding.expectStep("Personal info");
    await expect(onboarding.fullName).toHaveValue(validPersonal.fullName);

    await onboarding.next();
    await onboarding.next();
    await expect(onboarding.equipment("Laptop")).toBeChecked();
    await expect(onboarding.bio).toHaveValue(validPreferences.bio);
  });

  test("Back does not require the current step to be valid", async ({
    onboarding,
  }) => {
    await onboarding.completePersonal(validPersonal);
    await onboarding.jobTitle.fill("Half-filled");
    await onboarding.back();
    await onboarding.expectStep("Personal info");
  });

  test.describe("progress bar", () => {
    test("reflects the current step", async ({ onboarding }) => {
      const progress = onboarding.page.getByRole("progressbar");
      await expect(progress).toHaveAttribute("aria-valuenow", "1");
      await expect(progress).toHaveAttribute(
        "aria-valuetext",
        "Step 1 of 4: Personal info",
      );

      await onboarding.completePersonal(validPersonal);
      await expect(progress).toHaveAttribute("aria-valuenow", "2");
      await expect(onboarding.page.getByText("Step 2 of 4")).toBeVisible();
    });

    test("future steps are not clickable", async ({ onboarding }) => {
      await expect(onboarding.stepperButton("Personal info")).toBeEnabled();
      for (const title of ["Work details", "Preferences", "Review & submit"]) {
        await expect(onboarding.stepperButton(title)).toBeDisabled();
      }
    });

    test("completed steps are clickable and keep their data", async ({
      onboarding,
    }) => {
      await onboarding.completePersonal(validPersonal);
      await onboarding.completeWork(validWork);

      await onboarding.stepperButton("Personal info").click();
      await onboarding.expectStep("Personal info");
      await expect(onboarding.email).toHaveValue(validPersonal.email);

      await onboarding.stepperButton("Work details").click();
      await onboarding.expectStep("Work details");
      await expect(onboarding.jobTitle).toHaveValue(validWork.jobTitle);
    });

    test("marks the current step with aria-current", async ({ onboarding }) => {
      await onboarding.completePersonal(validPersonal);
      await expect(onboarding.stepperButton("Work details")).toHaveAttribute(
        "aria-current",
        "step",
      );
      await expect(
        onboarding.stepperButton("Personal info"),
      ).not.toHaveAttribute("aria-current");
    });
  });

  test("moves focus to the step heading when the step changes", async ({
    onboarding,
  }) => {
    await onboarding.completePersonal(validPersonal);
    await expect(onboarding.heading).toBeFocused();
  });

  test("completes the whole form using only the keyboard", async ({
    onboarding,
    browserName,
  }) => {
    // WebKit's date input and select don't take keyboard entry the same way.
    test.skip(
      browserName !== "chromium",
      "keyboard flow is verified on Chromium",
    );
    const { page } = onboarding;

    async function tabTo(target: ReturnType<typeof page.locator>) {
      for (let i = 0; i < 15; i++) {
        if (await target.evaluate((el) => el === document.activeElement)) {
          return;
        }
        await page.keyboard.press("Tab");
      }
      await expect(target).toBeFocused();
    }

    // Step 1
    await tabTo(onboarding.fullName);
    await page.keyboard.type("Grace Hopper");
    await tabTo(onboarding.email);
    await page.keyboard.type("grace@example.com");
    await tabTo(onboarding.dateOfBirth);
    await page.keyboard.type("12091906");
    await tabTo(onboarding.nextButton);
    await page.keyboard.press("Enter");
    await onboarding.expectStep("Work details");

    // Step 2
    await tabTo(onboarding.jobTitle);
    await page.keyboard.type("Rear Admiral");
    await tabTo(onboarding.department);
    await page.keyboard.type("Engineering");
    await tabTo(onboarding.employmentType("Full-time"));
    await page.keyboard.press("Space");
    await tabTo(onboarding.startDate);
    await page.keyboard.type("12312099");
    await tabTo(onboarding.nextButton);
    await page.keyboard.press("Enter");
    await onboarding.expectStep("Preferences");

    // Step 3
    await tabTo(onboarding.equipment("Laptop"));
    await page.keyboard.press("Space");
    await tabTo(onboarding.workSetup("Remote"));
    await page.keyboard.press("Space");
    await tabTo(onboarding.policies);
    await page.keyboard.press("Space");
    await tabTo(onboarding.nextButton);
    await page.keyboard.press("Enter");
    await onboarding.expectStep("Review & submit");

    // Step 4
    await tabTo(onboarding.submitButton);
    await page.keyboard.press("Enter");
    await onboarding.expectStep("Onboarding complete");
    await expect(page.getByLabel("Submitted data as JSON")).toContainText(
      "grace@example.com",
    );
  });
});
