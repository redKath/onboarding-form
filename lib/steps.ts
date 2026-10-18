export const STEPS = [
  { id: "personal", title: "Personal info" },
  { id: "work", title: "Work details" },
  { id: "preferences", title: "Preferences" },
  { id: "review", title: "Review & submit" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];
