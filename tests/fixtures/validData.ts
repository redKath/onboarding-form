export type PersonalData = {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
};

export type WorkData = {
  jobTitle: string;
  department: "Engineering" | "Design" | "Marketing" | "Sales" | "Operations";
  employmentType: "Full-time" | "Part-time" | "Contract";
  startDate: string;
  contractEndDate?: string;
};

export type PreferencesData = {
  equipment: Array<"Laptop" | "Monitor" | "Headset" | "Keyboard">;
  workSetup: "Remote" | "Hybrid" | "Onsite";
  office?: "Lisbon" | "Austin" | "Singapore";
  bio: string;
  agreeToPolicies: boolean;
};

// "YYYY-MM-DD" in local time, `days` from today (negative = past).
export function isoDate(days = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toIso(d);
}

// Birth date for someone who turns `years` old today, shifted by `days`.
export function isoBirthDate(years: number, days = 0): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  d.setDate(d.getDate() + days);
  return toIso(d);
}

function toIso(d: Date): string {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export const validPersonal: PersonalData = {
  fullName: "Ada Lovelace",
  email: "ada@example.com",
  phone: "+63 912 345 6789",
  dateOfBirth: "1990-05-15",
};

export const validWork: WorkData = {
  jobTitle: "Software Engineer",
  department: "Engineering",
  employmentType: "Full-time",
  startDate: isoDate(7),
};

export const validContractWork: WorkData = {
  ...validWork,
  employmentType: "Contract",
  contractEndDate: isoDate(37),
};

export const validPreferences: PreferencesData = {
  equipment: ["Laptop", "Monitor"],
  workSetup: "Hybrid",
  office: "Lisbon",
  bio: "Excited to join the team.",
  agreeToPolicies: true,
};
