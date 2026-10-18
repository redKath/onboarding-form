import type { DeepPartial } from "react-hook-form";
import { z } from "zod";
import { STEPS } from "@/lib/steps";
import type { OnboardingValues } from "@/lib/schemas";

export type Drafts = {
  [K in keyof OnboardingValues]: DeepPartial<OnboardingValues[K]>;
};

export type SavedState = {
  current: number;
  completed: number;
  drafts: Drafts;
};

const KEY = "onboarding-form:v1";

// Only the shape is checked; field values are re-validated by each step's schema on Next.
const draftShape = z.record(z.string(), z.unknown());
const savedShape = z.object({
  current: z
    .number()
    .int()
    .min(0)
    .max(STEPS.length - 1),
  completed: z
    .number()
    .int()
    .min(0)
    .max(STEPS.length - 1),
  drafts: z.object({
    personal: draftShape,
    work: draftShape,
    preferences: draftShape,
  }),
});

export function readRaw(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function parseState(raw: string | null): SavedState | null {
  if (!raw) return null;
  try {
    const parsed = savedShape.safeParse(JSON.parse(raw));
    return parsed.success ? (parsed.data as SavedState) : null;
  } catch {
    return null;
  }
}

export function saveState(state: SavedState): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable or full: progress just isn't persisted.
  }
}

export function clearState(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}
