import { expect, test } from "../fixtures";
import {
  isoDate,
  validContractWork,
  validPersonal,
  validWork,
} from "../fixtures/validData";

test.describe("Work details", () => {
  test.beforeEach(async ({ onboarding }) => {
    await onboarding.completePersonal(validPersonal);
  });

  test("shows required-field errors and focuses the first invalid field", async ({
    onboarding,
  }) => {
    await onboarding.next();

    await onboarding.expectInvalid(
      onboarding.jobTitle,
      "Job title is required",
    );
    await onboarding.expectInvalid(
      onboarding.department,
      "Select a department",
    );
    await onboarding.expectGroupInvalid(
      "Employment type",
      "Select an employment type",
    );
    await onboarding.expectInvalid(
      onboarding.startDate,
      "Start date is required",
    );
    await expect(onboarding.jobTitle).toBeFocused();
    await onboarding.expectStep("Work details");
  });

  test("shows error when job title is only whitespace", async ({
    onboarding,
  }) => {
    await onboarding.jobTitle.fill("   ");
    await onboarding.next();
    await onboarding.expectInvalid(
      onboarding.jobTitle,
      "Job title is required",
    );
  });

  test("lists every department", async ({ onboarding }) => {
    await test
      .expect(onboarding.department.getByRole("option"))
      .toHaveText([
        "Select...",
        "Engineering",
        "Design",
        "Marketing",
        "Sales",
        "Operations",
      ]);
  });

  test.describe("start date", () => {
    test("shows error when start date is in the past", async ({
      onboarding,
    }) => {
      await onboarding.fillWork({ ...validWork, startDate: isoDate(-1) });
      await onboarding.next();
      await onboarding.expectInvalid(
        onboarding.startDate,
        "Start date can't be in the past",
      );
    });

    test("accepts today as the start date", async ({ onboarding }) => {
      await onboarding.fillWork({ ...validWork, startDate: isoDate(0) });
      await onboarding.next();
      await onboarding.expectStep("Preferences");
    });
  });

  test.describe("contract end date", () => {
    for (const type of ["Full-time", "Part-time"] as const) {
      test(`is hidden for ${type}`, async ({ onboarding }) => {
        await onboarding.employmentType(type).check();
        await expect(onboarding.contractEndDate).toBeHidden();
      });
    }

    test("is shown and required for Contract", async ({ onboarding }) => {
      await onboarding.fillWork({ ...validWork, employmentType: "Contract" });
      await onboarding.next();

      await onboarding.expectInvalid(
        onboarding.contractEndDate,
        "Contract end date is required",
      );
      await onboarding.expectStep("Work details");
    });

    test("shows error when end date equals start date", async ({
      onboarding,
    }) => {
      await onboarding.fillWork({
        ...validContractWork,
        contractEndDate: validContractWork.startDate,
      });
      await onboarding.next();
      await onboarding.expectInvalid(
        onboarding.contractEndDate,
        "End date must be after start date",
      );
    });

    test("shows error when end date is before start date", async ({
      onboarding,
    }) => {
      await onboarding.fillWork({
        ...validContractWork,
        contractEndDate: isoDate(1),
      });
      await onboarding.next();
      await onboarding.expectInvalid(
        onboarding.contractEndDate,
        "End date must be after start date",
      );
    });

    test("accepts an end date after the start date", async ({ onboarding }) => {
      await onboarding.fillWork(validContractWork);
      await onboarding.next();
      await onboarding.expectStep("Preferences");
    });

    test("hides the field and clears its error when switching to Full-time", async ({
      onboarding,
    }) => {
      await onboarding.fillWork({ ...validWork, employmentType: "Contract" });
      await onboarding.next();
      await onboarding.expectError("Contract end date is required");

      await onboarding.employmentType("Full-time").check();
      await expect(onboarding.contractEndDate).toBeHidden();
      await onboarding.expectNoError("Contract end date is required");
    });

    test("does not show a stale error when switching back to Contract", async ({
      onboarding,
    }) => {
      await onboarding.fillWork({ ...validWork, employmentType: "Contract" });
      await onboarding.next();
      await onboarding.expectError("Contract end date is required");

      await onboarding.employmentType("Full-time").check();
      await onboarding.employmentType("Contract").check();
      await expect(onboarding.contractEndDate).toBeVisible();
      await onboarding.expectNoError("Contract end date is required");
    });

    test("is not kept when switching from Contract to Full-time and continuing", async ({
      onboarding,
    }) => {
      await onboarding.fillWork(validContractWork);
      await onboarding.employmentType("Full-time").check();
      await onboarding.next();
      await onboarding.expectStep("Preferences");

      await onboarding.back();
      await onboarding.employmentType("Contract").check();
      await expect(onboarding.contractEndDate).toHaveValue("");
    });
  });

  test("Back returns to Personal info", async ({ onboarding }) => {
    await onboarding.back();
    await onboarding.expectStep("Personal info");
  });
});
