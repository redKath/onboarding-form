import { z } from "zod";
import { adultCutoffIso, isValidIsoDate } from "@/lib/dates";

export const personalSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name must be at most 80 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email address")),
  phone: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /^[\d\s+]+$/.test(v),
      "Use digits, spaces and + only",
    )
    .refine((v) => {
      const digits = v.replace(/\D/g, "").length;
      return v === "" || (digits >= 7 && digits <= 15);
    }, "Phone must have 7–15 digits"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine(isValidIsoDate, "Enter a valid date")
    .refine(
      (v) => !isValidIsoDate(v) || v <= adultCutoffIso(),
      "You must be at least 18",
    ),
});

export type PersonalValues = z.infer<typeof personalSchema>;
