import { expect, test } from "../fixtures";
import {
  validPersonal,
  validPreferences,
  validWork,
} from "../fixtures/validData";

test.describe("Preferences", () => {
  test.beforeEach(async ({ onboarding }) => {
    await onboarding.completePersonal(validPersonal);
    await onboarding.completeWork(validWork);
  });

  test("shows required-field errors and focuses the first invalid field", async ({
    onboarding,
  }) => {
    await onboarding.next();

    await onboarding.expectGroupInvalid(
      "Equipment needed",
      "Select at least one item",
    );
    await onboarding.expectGroupInvalid("Work setup", "Select a work setup");
    await onboarding.expectInvalid(
      onboarding.policies,
      "You must agree to the policies",
    );
    await expect(onboarding.equipment("Laptop")).toBeFocused();
    await onboarding.expectStep("Preferences");
  });

  test("requires at least one equipment item", async ({ onboarding }) => {
    await onboarding.fillPreferences({ ...validPreferences, equipment: [] });
    await onboarding.next();
    await onboarding.expectGroupInvalid(
      "Equipment needed",
      "Select at least one item",
    );
  });

  test("clears the equipment error once an item is checked", async ({
    onboarding,
  }) => {
    await onboarding.next();
    await onboarding.expectError("Select at least one item");

    await onboarding.equipment("Headset").check();
    await onboarding.expectNoError("Select at least one item");
  });

  test("requires agreeing to the policies", async ({ onboarding }) => {
    await onboarding.fillPreferences({
      ...validPreferences,
      agreeToPolicies: false,
    });
    await onboarding.next();
    await onboarding.expectInvalid(
      onboarding.policies,
      "You must agree to the policies",
    );
  });

  test.describe("preferred office", () => {
    test("is hidden until a work setup is chosen", async ({ onboarding }) => {
      await expect(onboarding.office).toBeHidden();
    });

    test("is hidden for Remote", async ({ onboarding }) => {
      await onboarding.workSetup("Remote").check();
      await expect(onboarding.office).toBeHidden();
    });

    for (const setup of ["Hybrid", "Onsite"] as const) {
      test(`is required for ${setup}`, async ({ onboarding }) => {
        await onboarding.fillPreferences({
          ...validPreferences,
          workSetup: setup,
          office: undefined,
        });
        await onboarding.next();
        await onboarding.expectInvalid(
          onboarding.office,
          "Select a preferred office",
        );
        await onboarding.expectStep("Preferences");
      });
    }

    test("hides the field and clears its error when switching to Remote", async ({
      onboarding,
    }) => {
      await onboarding.fillPreferences({
        ...validPreferences,
        office: undefined,
      });
      await onboarding.next();
      await onboarding.expectError("Select a preferred office");

      await onboarding.workSetup("Remote").check();
      await expect(onboarding.office).toBeHidden();
      await onboarding.expectNoError("Select a preferred office");
    });

    // https://github.com/redKath/onboarding-form/issues/9
    test.fail(
      "does not show a stale error when switching back to Onsite",
      async ({ onboarding }) => {
        await onboarding.fillPreferences({
          ...validPreferences,
          office: undefined,
        });
        await onboarding.next();
        await onboarding.expectError("Select a preferred office");

        await onboarding.workSetup("Remote").check();
        await onboarding.workSetup("Onsite").check();
        await expect(onboarding.office).toBeVisible();
        await onboarding.expectNoError("Select a preferred office");
      },
    );

    test("can be skipped for Remote", async ({ onboarding }) => {
      await onboarding.fillPreferences({
        ...validPreferences,
        workSetup: "Remote",
        office: undefined,
      });
      await onboarding.next();
      await onboarding.expectStep("Review & submit");
    });
  });

  test.describe("bio", () => {
    test("is optional", async ({ onboarding }) => {
      await onboarding.fillPreferences({ ...validPreferences, bio: "" });
      await onboarding.next();
      await onboarding.expectStep("Review & submit");
    });

    test("updates the character counter as you type", async ({
      onboarding,
    }) => {
      await expect(onboarding.page.getByText("0/300")).toBeVisible();

      await onboarding.bio.fill("Hello");
      await expect(onboarding.page.getByText("5/300")).toBeVisible();

      await onboarding.bio.fill("Hello there");
      await expect(onboarding.page.getByText("11/300")).toBeVisible();
    });

    test("accepts exactly 300 characters", async ({ onboarding }) => {
      await onboarding.fillPreferences({
        ...validPreferences,
        bio: "a".repeat(300),
      });
      await onboarding.next();
      await onboarding.expectStep("Review & submit");
    });

    test("shows error when bio has 301 characters", async ({ onboarding }) => {
      await onboarding.fillPreferences({
        ...validPreferences,
        bio: "a".repeat(301),
      });
      await expect(onboarding.page.getByText("301/300")).toBeVisible();

      await onboarding.next();
      await onboarding.expectInvalid(
        onboarding.bio,
        "Bio must be at most 300 characters",
      );
      await onboarding.expectStep("Preferences");
    });
  });

  test("Back returns to Work details with data intact", async ({
    onboarding,
  }) => {
    await onboarding.back();
    await onboarding.expectStep("Work details");
    await expect(onboarding.jobTitle).toHaveValue(validWork.jobTitle);
  });
});
