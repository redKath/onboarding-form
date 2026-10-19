import { expect, test } from "../fixtures";
import {
  validContractWork,
  validPersonal,
  validPreferences,
  validWork,
} from "../fixtures/validData";

test.describe("Review & submit", () => {
  test.beforeEach(async ({ onboarding }) => {
    await onboarding.reachReview(validPersonal, validWork, validPreferences);
  });

  test("summarises the entered values grouped by step", async ({
    onboarding,
  }) => {
    const personal = onboarding.reviewSection("Personal info");
    await expect(personal).toContainText(validPersonal.fullName);
    await expect(personal).toContainText(validPersonal.email);
    await expect(personal).toContainText(validPersonal.phone);
    await expect(personal).toContainText(validPersonal.dateOfBirth);

    const work = onboarding.reviewSection("Work details");
    await expect(work).toContainText(validWork.jobTitle);
    await expect(work).toContainText(validWork.department);
    await expect(work).toContainText(validWork.employmentType);
    await expect(work).toContainText(validWork.startDate);
    await expect(work).not.toContainText("Contract end date");

    const preferences = onboarding.reviewSection("Preferences");
    await expect(preferences).toContainText("Laptop, Monitor");
    await expect(preferences).toContainText("Hybrid");
    await expect(preferences).toContainText("Lisbon");
    await expect(preferences).toContainText(validPreferences.bio);
    await expect(preferences).toContainText("Agreed");
  });

  test("shows an em dash for empty optional fields", async ({ onboarding }) => {
    await onboarding.editSection("Personal info");
    await onboarding.phone.fill("");
    await onboarding.next();
    await onboarding.next();
    await onboarding.next();
    await onboarding.expectStep("Review & submit");

    // Values in order: name, email, phone, date of birth.
    await expect(
      onboarding.reviewSection("Personal info").getByRole("definition").nth(2),
    ).toHaveText("—");
  });

  test("Back returns to Preferences", async ({ onboarding }) => {
    await onboarding.back();
    await onboarding.expectStep("Preferences");
  });

  test.describe("Edit buttons", () => {
    test("Edit Personal info opens step 1 with data intact", async ({
      onboarding,
    }) => {
      await onboarding.editSection("Personal info");
      await expect(onboarding.fullName).toHaveValue(validPersonal.fullName);
      await expect(onboarding.email).toHaveValue(validPersonal.email);
      await expect(onboarding.phone).toHaveValue(validPersonal.phone);
      await expect(onboarding.dateOfBirth).toHaveValue(
        validPersonal.dateOfBirth,
      );
    });

    test("Edit Work details opens step 2 with data intact", async ({
      onboarding,
    }) => {
      await onboarding.editSection("Work details");
      await expect(onboarding.jobTitle).toHaveValue(validWork.jobTitle);
      await expect(onboarding.department).toHaveValue(validWork.department);
      await expect(onboarding.employmentType("Full-time")).toBeChecked();
      await expect(onboarding.startDate).toHaveValue(validWork.startDate);
    });

    test("Edit Preferences opens step 3 with data intact", async ({
      onboarding,
    }) => {
      await onboarding.editSection("Preferences");
      await expect(onboarding.equipment("Laptop")).toBeChecked();
      await expect(onboarding.equipment("Monitor")).toBeChecked();
      await expect(onboarding.equipment("Headset")).not.toBeChecked();
      await expect(onboarding.workSetup("Hybrid")).toBeChecked();
      await expect(onboarding.office).toHaveValue("Lisbon");
      await expect(onboarding.bio).toHaveValue(validPreferences.bio);
      await expect(onboarding.policies).toBeChecked();
    });

    test("edits show up when returning to the review", async ({
      onboarding,
    }) => {
      await onboarding.editSection("Work details");
      await onboarding.jobTitle.fill("Staff Engineer");
      await onboarding.next();
      await onboarding.next();
      await onboarding.expectStep("Review & submit");

      await expect(onboarding.reviewSection("Work details")).toContainText(
        "Staff Engineer",
      );
    });
  });

  test.describe("submit", () => {
    test("shows the success screen with JSON matching the entered data", async ({
      onboarding,
    }) => {
      await onboarding.submitButton.click();

      await onboarding.expectStep("Onboarding complete");
      const text = await onboarding.page
        .getByLabel("Submitted data as JSON")
        .textContent();
      const submitted: unknown = JSON.parse(text ?? "");
      expect(submitted).toEqual({
        personal: validPersonal,
        work: { ...validWork, contractEndDate: "" },
        preferences: validPreferences,
      });
    });

    test("includes the contract end date for Contract and no office for Remote", async ({
      onboarding,
    }) => {
      await onboarding.editSection("Work details");
      await onboarding.fillWork(validContractWork);
      await onboarding.next();
      await onboarding.workSetup("Remote").check();
      await onboarding.next();
      await onboarding.submitButton.click();

      const text = await onboarding.page
        .getByLabel("Submitted data as JSON")
        .textContent();
      const submitted: unknown = JSON.parse(text ?? "");
      expect(submitted).toMatchObject({
        work: {
          employmentType: "Contract",
          contractEndDate: validContractWork.contractEndDate,
        },
        preferences: { workSetup: "Remote", office: "" },
      });
    });

    test("blocks submit and lists problems when saved data is incomplete", async ({
      onboarding,
    }) => {
      await onboarding.page.evaluate(() => {
        localStorage.setItem(
          "onboarding-form:v1",
          JSON.stringify({
            current: 3,
            completed: 3,
            drafts: { personal: { fullName: "A" }, work: {}, preferences: {} },
          }),
        );
      });
      await onboarding.page.reload();
      await onboarding.expectStep("Review & submit");

      await onboarding.submitButton.click();

      const alert = onboarding.page
        .getByRole("alert")
        .filter({ hasText: "Fix these before submitting" });
      await expect(alert).toContainText("Fix these before submitting:");
      await expect(alert).toContainText(
        "Personal info: Full name must be at least 2 characters",
      );
      await onboarding.expectStep("Review & submit");
    });
  });

  test("Start over resets to an empty step 1 and clears localStorage", async ({
    onboarding,
  }) => {
    await onboarding.submitButton.click();
    await onboarding.expectStep("Onboarding complete");

    await onboarding.startOver();

    await onboarding.expectStep("Personal info");
    await expect(onboarding.fullName).toHaveValue("");
    await expect(onboarding.email).toHaveValue("");
    await expect(onboarding.phone).toHaveValue("");
    await expect(onboarding.dateOfBirth).toHaveValue("");
    expect(await onboarding.storedState()).toBeNull();
  });
});
