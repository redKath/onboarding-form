// Dates are "YYYY-MM-DD" strings, as produced by <input type="date">.
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const d = new Date(`${value}T00:00:00`);
  return !Number.isNaN(d.getTime()) && toIsoDate(d) === value;
}

export function toIsoDate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function todayIso(): string {
  return toIsoDate(new Date());
}

// Latest birth date that is still 18 or older today.
export function adultCutoffIso(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return toIsoDate(d);
}
