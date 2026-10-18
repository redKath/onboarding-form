import { z } from "zod";

export const EQUIPMENT = ["Laptop", "Monitor", "Headset", "Keyboard"] as const;
export const WORK_SETUPS = ["Remote", "Hybrid", "Onsite"] as const;
export const OFFICES = ["Lisbon", "Austin", "Singapore"] as const;

export const preferencesSchema = z
  .object({
    equipment: z.array(z.enum(EQUIPMENT)).min(1, "Select at least one item"),
    workSetup: z.enum(WORK_SETUPS, "Select a work setup"),
    // "" until the user picks an office; only required for Hybrid/Onsite.
    office: z.union([z.enum(OFFICES), z.literal("")]),
    bio: z.string().max(300, "Bio must be at most 300 characters"),
    agreeToPolicies: z
      .boolean()
      .refine((v) => v, "You must agree to the policies"),
  })
  .superRefine((data, ctx) => {
    if (data.workSetup !== "Remote" && data.office === "") {
      ctx.addIssue({
        code: "custom",
        path: ["office"],
        message: "Select a preferred office",
      });
    }
  });

export type PreferencesValues = z.infer<typeof preferencesSchema>;
