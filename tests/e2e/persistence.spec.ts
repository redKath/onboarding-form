import { expect, test } from "../fixtures";
import { STORAGE_KEY } from "../pages/OnboardingPage";
import {
  validPersonal,
  validPreferences,
  validWork,
} from "../fixtures/validData";

test.describe("Persistence", () => {
  test("restores step and data after reload mid-step", async ({
    onboarding,
  }) => {
    await onboarding.completePersonal(validPersonal);
    await onboarding.jobTitle.fill("Software Engineer");
    await onboarding.department.selectOption("Design");

    await onboarding.page.reload();

    await onboarding.expectStep("Work details");
    await expect(onboarding.jobTitle).toHaveValue("Software Engineer");
    await expect(onboarding.department).toHaveValue("Design");

    await onboarding.back();
    await expect(onboarding.fullName).toHaveValue(validPersonal.fullName);
    await expect(onboarding.email).toHaveValue(validPersonal.email);
  });

  test("restores completed steps after reload", async ({ onboarding }) => {
    await onboarding.completePersonal(validPersonal);
    await onboarding.completeWork(validWork);

    await onboarding.page.reload();

    await onboarding.expectStep("Preferences");
    await onboarding.back();
    await expect(onboarding.jobTitle).toHaveValue(validWork.jobTitle);
    await expect(onboarding.startDate).toHaveValue(validWork.startDate);
  });

  test("keeps completed steps clickable after reload", async ({
    onboarding,
  }) => {
    await onboarding.completePersonal(validPersonal);
    await onboarding.page.reload();

    await onboarding.stepperButton("Personal info").click();
    await onboarding.expectStep("Personal info");
  });

  test("starts fresh after reload when nothing was entered", async ({
    onboarding,
  }) => {
    await onboarding.page.reload();
    await onboarding.expectStep("Personal info");
    expect(await onboarding.storedState()).toBeNull();
  });

  test("shows a fresh form after reload once submitted", async ({
    onboarding,
  }) => {
    await onboarding.reachReview(validPersonal, validWork, validPreferences);
    await onboarding.submitButton.click();
    await onboarding.expectStep("Onboarding complete");
    expect(await onboarding.storedState()).toBeNull();

    await onboarding.page.reload();

    await onboarding.expectStep("Personal info");
    await expect(onboarding.fullName).toHaveValue("");
  });

  test("shows a fresh form after reload following Start over", async ({
    onboarding,
  }) => {
    await onboarding.reachReview(validPersonal, validWork, validPreferences);
    await onboarding.submitButton.click();
    await onboarding.startOver();
    await onboarding.expectStep("Personal info");

    await onboarding.page.reload();

    await onboarding.expectStep("Personal info");
    await expect(onboarding.fullName).toHaveValue("");
  });

  test.describe("corrupted localStorage", () => {
    const corrupted = [
      ["invalid JSON", "{bad json"],
      ["valid JSON of the wrong shape", JSON.stringify({ hello: "world" })],
      [
        "an out-of-range step",
        JSON.stringify({
          current: 99,
          completed: 0,
          drafts: { personal: {}, work: {}, preferences: {} },
        }),
      ],
    ];

    for (const [label, value] of corrupted) {
      test(`loads a fresh form when the saved value is ${label}`, async ({
        onboarding,
      }) => {
        const errors: string[] = [];
        onboarding.page.on("pageerror", (e) => errors.push(e.message));

        await onboarding.page.evaluate(
          ([key, v]) => localStorage.setItem(key, v),
          [STORAGE_KEY, value],
        );
        await onboarding.page.reload();

        await onboarding.expectStep("Personal info");
        await expect(onboarding.fullName).toHaveValue("");
        expect(errors).toEqual([]);

        // The form still works afterwards.
        await onboarding.completePersonal(validPersonal);
      });
    }
  });
});
