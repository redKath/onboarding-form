import { z } from "zod";
import { personalSchema } from "./personal";
import { preferencesSchema } from "./preferences";
import { workSchema } from "./work";

export * from "./personal";
export * from "./preferences";
export * from "./work";

export const onboardingSchema = z.object({
  personal: personalSchema,
  work: workSchema,
  preferences: preferencesSchema,
});

export type OnboardingValues = z.infer<typeof onboardingSchema>;
