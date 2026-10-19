import { expect, type Locator, type Page } from "@playwright/test";
import type {
  PersonalData,
  PreferencesData,
  WorkData,
} from "../fixtures/validData";

export const STORAGE_KEY = "onboarding-form:v1";

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export class OnboardingPage {
  // Personal info
  readonly fullName: Locator;
  readonly email: Locator;
  readonly phone: Locator;
  readonly dateOfBirth: Locator;
  // Work details
  readonly jobTitle: Locator;
  readonly department: Locator;
  readonly startDate: Locator;
  readonly contractEndDate: Locator;
  // Preferences
  readonly office: Locator;
  readonly bio: Locator;
  readonly policies: Locator;
  // Shared
  readonly heading: Locator;
  readonly nextButton: Locator;
  readonly backButton: Locator;
  readonly submitButton: Locator;

  constructor(readonly page: Page) {
    this.fullName = page.getByLabel("Full name");
    this.email = page.getByLabel("Email");
    this.phone = page.getByLabel("Phone (optional)");
    this.dateOfBirth = page.getByLabel("Date of birth");

    this.jobTitle = page.getByLabel("Job title");
    this.department = page.getByLabel("Department");
    this.startDate = page.getByLabel("Start date", { exact: true });
    this.contractEndDate = page.getByLabel("Contract end date");

    this.office = page.getByLabel("Preferred office");
    this.bio = page.getByLabel("Short bio (optional)");
    this.policies = page.getByRole("checkbox", {
      name: "I agree to the company policies",
    });

    this.heading = page.getByRole("heading", { level: 2 });
    this.nextButton = page.getByRole("button", { name: "Next", exact: true });
    this.backButton = page.getByRole("button", { name: "Back", exact: true });
    this.submitButton = page.getByRole("button", {
      name: "Submit",
      exact: true,
    });
  }

  async goto() {
    await this.page.goto("/");
    await this.expectStep("Personal info");
  }

  // Locators

  employmentType(type: WorkData["employmentType"]) {
    return this.page.getByRole("radio", { name: type, exact: true });
  }

  workSetup(setup: PreferencesData["workSetup"]) {
    return this.page.getByRole("radio", { name: setup, exact: true });
  }

  equipment(item: PreferencesData["equipment"][number]) {
    return this.page.getByRole("checkbox", { name: item, exact: true });
  }

  stepperButton(title: string) {
    return this.page
      .getByRole("navigation", { name: "Progress" })
      .getByRole("button", { name: title });
  }

  reviewSection(title: string) {
    return this.page.getByRole("region", { name: title, exact: true });
  }

  editButton(title: string) {
    return this.page.getByRole("button", { name: `Edit ${title}` });
  }

  // Actions

  async next() {
    await this.nextButton.click();
  }

  async back() {
    await this.backButton.click();
  }

  async fillPersonal(data: PersonalData) {
    await this.fullName.fill(data.fullName);
    await this.email.fill(data.email);
    await this.phone.fill(data.phone);
    await this.dateOfBirth.fill(data.dateOfBirth);
  }

  async fillWork(data: WorkData) {
    await this.jobTitle.fill(data.jobTitle);
    await this.department.selectOption(data.department);
    await this.employmentType(data.employmentType).check();
    await this.startDate.fill(data.startDate);
    if (data.contractEndDate) {
      await this.contractEndDate.fill(data.contractEndDate);
    }
  }

  async fillPreferences(data: PreferencesData) {
    for (const item of data.equipment) await this.equipment(item).check();
    await this.workSetup(data.workSetup).check();
    if (data.office) await this.office.selectOption(data.office);
    await this.bio.fill(data.bio);
    if (data.agreeToPolicies) await this.policies.check();
  }

  async completePersonal(data: PersonalData) {
    await this.fillPersonal(data);
    await this.next();
    await this.expectStep("Work details");
  }

  async completeWork(data: WorkData) {
    await this.fillWork(data);
    await this.next();
    await this.expectStep("Preferences");
  }

  async completePreferences(data: PreferencesData) {
    await this.fillPreferences(data);
    await this.next();
    await this.expectStep("Review & submit");
  }

  async reachReview(
    personal: PersonalData,
    work: WorkData,
    preferences: PreferencesData,
  ) {
    await this.completePersonal(personal);
    await this.completeWork(work);
    await this.completePreferences(preferences);
  }

  async editSection(title: string) {
    await this.editButton(title).click();
    await this.expectStep(title);
  }

  async startOver() {
    await this.page.getByRole("button", { name: "Start over" }).click();
  }

  // Assertions

  async expectStep(title: string) {
    await expect(this.heading).toHaveText(title);
  }

  async expectError(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async expectNoError(message: string) {
    await expect(this.page.getByText(message)).toHaveCount(0);
  }

  // The control is flagged invalid and its error is its accessible description.
  async expectInvalid(control: Locator, message: string) {
    await expect(control).toHaveAttribute("aria-invalid", "true");
    await expect(control).toHaveAccessibleDescription(
      new RegExp(escapeRegex(message)),
    );
  }

  // Radio/checkbox groups carry the error on their fieldset.
  async expectGroupInvalid(legend: string, message: string) {
    await expect(
      this.page.getByRole("group", { name: legend, exact: true }),
    ).toHaveAccessibleDescription(new RegExp(escapeRegex(message)));
  }

  async expectValid(control: Locator) {
    await expect(control).toHaveAttribute("aria-invalid", "false");
  }

  async storedState(): Promise<string | null> {
    return this.page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
  }
}
