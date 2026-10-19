import { expect, test } from "../fixtures";
import { isoBirthDate, validPersonal } from "../fixtures/validData";

test.describe("Personal info", () => {
  test("shows required-field errors and focuses the first invalid field", async ({
    onboarding,
  }) => {
    await onboarding.next();

    await onboarding.expectInvalid(
      onboarding.fullName,
      "Full name must be at least 2 characters",
    );
    await onboarding.expectInvalid(onboarding.email, "Email is required");
    await onboarding.expectInvalid(
      onboarding.dateOfBirth,
      "Date of birth is required",
    );
    await onboarding.expectValid(onboarding.phone);
    await expect(onboarding.fullName).toBeFocused();
    await onboarding.expectStep("Personal info");
  });

  test.describe("full name", () => {
    test("shows error when name has 1 character", async ({ onboarding }) => {
      await onboarding.fullName.fill("A");
      await onboarding.next();
      await onboarding.expectError("Full name must be at least 2 characters");
    });

    test("shows error when name has 81 characters", async ({ onboarding }) => {
      await onboarding.fullName.fill("a".repeat(81));
      await onboarding.next();
      await onboarding.expectError("Full name must be at most 80 characters");
    });

    test("accepts names of exactly 2 and 80 characters", async ({
      onboarding,
    }) => {
      await onboarding.fullName.fill("Al");
      await onboarding.next();
      await onboarding.expectNoError("Full name must be at least 2 characters");

      await onboarding.fullName.fill("a".repeat(80));
      await onboarding.next();
      await onboarding.expectNoError("Full name must be at most 80 characters");
    });
  });

  test.describe("email", () => {
    for (const bad of [
      "plainaddress",
      "missing-domain@",
      "@missing-local.com",
      "no-tld@example",
      "two@@example.com",
    ]) {
      test(`shows error for invalid email "${bad}"`, async ({ onboarding }) => {
        await onboarding.email.fill(bad);
        await onboarding.next();
        await onboarding.expectInvalid(
          onboarding.email,
          "Enter a valid email address",
        );
      });
    }

    test("accepts a valid email", async ({ onboarding }) => {
      await onboarding.email.fill("ada.lovelace+test@example.co.uk");
      await onboarding.next();
      await onboarding.expectValid(onboarding.email);
    });
  });

  test.describe("phone", () => {
    test("is optional", async ({ onboarding }) => {
      await onboarding.fillPersonal({ ...validPersonal, phone: "" });
      await onboarding.next();
      await onboarding.expectStep("Work details");
    });

    test("rejects letters", async ({ onboarding }) => {
      await onboarding.phone.fill("555-CALL-NOW");
      await onboarding.next();
      await onboarding.expectInvalid(
        onboarding.phone,
        "Use digits, spaces and + only",
      );
    });

    for (const [label, value] of [
      ["fewer than 7 digits", "123456"],
      ["more than 15 digits", "1234567890123456"],
    ]) {
      test(`shows error when phone has ${label}`, async ({ onboarding }) => {
        await onboarding.phone.fill(value);
        await onboarding.next();
        await onboarding.expectInvalid(
          onboarding.phone,
          "Phone must have 7–15 digits",
        );
      });
    }

    for (const value of ["1234567", "123456789012345", "+63 912 345 6789"]) {
      test(`accepts phone "${value}"`, async ({ onboarding }) => {
        await onboarding.fillPersonal({ ...validPersonal, phone: value });
        await onboarding.next();
        await onboarding.expectStep("Work details");
      });
    }
  });

  test.describe("date of birth", () => {
    test("rejects someone who turns 18 tomorrow", async ({ onboarding }) => {
      await onboarding.dateOfBirth.fill(isoBirthDate(18, 1));
      await onboarding.next();
      await onboarding.expectInvalid(
        onboarding.dateOfBirth,
        "You must be at least 18",
      );
    });

    test("accepts someone who turns 18 today", async ({ onboarding }) => {
      await onboarding.fillPersonal({
        ...validPersonal,
        dateOfBirth: isoBirthDate(18),
      });
      await onboarding.next();
      await onboarding.expectStep("Work details");
    });
  });

  test("clears an error once the field is corrected", async ({
    onboarding,
  }) => {
    await onboarding.next();
    await onboarding.expectError("Email is required");

    await onboarding.email.fill("ada@example.com");
    await onboarding.expectNoError("Email is required");
    await onboarding.expectValid(onboarding.email);
  });
});
