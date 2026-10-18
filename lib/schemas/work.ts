import { z } from "zod";
import { isValidIsoDate, todayIso } from "@/lib/dates";

export const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Operations",
] as const;
export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract"] as const;

export const workSchema = z
  .object({
    jobTitle: z.string().trim().min(1, "Job title is required"),
    department: z.enum(DEPARTMENTS, "Select a department"),
    employmentType: z.enum(EMPLOYMENT_TYPES, "Select an employment type"),
    startDate: z
      .string()
      .min(1, "Start date is required")
      .refine(isValidIsoDate, "Enter a valid date")
      .refine(
        (v) => !isValidIsoDate(v) || v >= todayIso(),
        "Start date can't be in the past",
      ),
    contractEndDate: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.employmentType !== "Contract") return;
    if (!data.contractEndDate) {
      ctx.addIssue({
        code: "custom",
        path: ["contractEndDate"],
        message: "Contract end date is required",
      });
    } else if (!isValidIsoDate(data.contractEndDate)) {
      ctx.addIssue({
        code: "custom",
        path: ["contractEndDate"],
        message: "Enter a valid date",
      });
    } else if (
      isValidIsoDate(data.startDate) &&
      data.contractEndDate <= data.startDate
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["contractEndDate"],
        message: "End date must be after start date",
      });
    }
  });

export type WorkValues = z.infer<typeof workSchema>;
