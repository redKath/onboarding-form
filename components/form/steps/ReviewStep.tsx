import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { onboardingSchema, type OnboardingValues } from "@/lib/schemas";
import { STEPS } from "@/lib/steps";
import type { Drafts } from "@/lib/storage";

type Row = [label: string, value: string];

const GROUPS = ["personal", "work", "preferences"] as const;

const show = (v: unknown) =>
  v === undefined || v === null || v === "" ? "—" : String(v);

function summarize({ personal: p, work: w, preferences: f }: Drafts) {
  const contract: Row[] =
    w.employmentType === "Contract"
      ? [["Contract end date", show(w.contractEndDate)]]
      : [];
  const office: Row[] =
    f.workSetup && f.workSetup !== "Remote"
      ? [["Preferred office", show(f.office)]]
      : [];

  return {
    personal: [
      ["Full name", show(p.fullName)],
      ["Email", show(p.email)],
      ["Phone", show(p.phone)],
      ["Date of birth", show(p.dateOfBirth)],
    ],
    work: [
      ["Job title", show(w.jobTitle)],
      ["Department", show(w.department)],
      ["Employment type", show(w.employmentType)],
      ["Start date", show(w.startDate)],
      ...contract,
    ],
    preferences: [
      ["Equipment", show(f.equipment?.join(", "))],
      ["Work setup", show(f.workSetup)],
      ...office,
      ["Bio", show(f.bio)],
      ["Policies", f.agreeToPolicies ? "Agreed" : "—"],
    ],
  } satisfies Record<(typeof GROUPS)[number], Row[]>;
}

type ReviewStepProps = {
  drafts: Drafts;
  onEdit: (step: number) => void;
  onSubmit: (values: OnboardingValues) => void;
  onBack: () => void;
};

export function ReviewStep({
  drafts,
  onEdit,
  onSubmit,
  onBack,
}: ReviewStepProps) {
  const [attempted, setAttempted] = useState(false);
  const parsed = onboardingSchema.safeParse(drafts);
  const rows = summarize(drafts);

  function submit() {
    if (parsed.success) onSubmit(parsed.data);
    else setAttempted(true);
  }

  return (
    <div className="space-y-6">
      {attempted && !parsed.success && (
        <div
          role="alert"
          className="rounded-md border border-red-600 bg-red-50 p-4 text-sm text-red-800"
        >
          <p className="font-medium">Fix these before submitting:</p>
          <ul className="mt-2 list-disc pl-5">
            {parsed.error.issues.map((issue, i) => (
              <li key={i}>
                {STEPS[GROUPS.indexOf(issue.path[0] as (typeof GROUPS)[number])]
                  ?.title ?? "Form"}
                : {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {GROUPS.map((group, step) => (
        <section key={group} aria-labelledby={`review-${group}`}>
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
            <h3 id={`review-${group}`} className="font-semibold">
              {STEPS[step].title}
            </h3>
            <Button
              variant="secondary"
              className="px-3 py-1"
              aria-label={`Edit ${STEPS[step].title}`}
              onClick={() => onEdit(step)}
            >
              Edit
            </Button>
          </div>
          <dl className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-[10rem_1fr]">
            {rows[group].map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="text-sm text-zinc-500">{label}</dt>
                <dd className="break-words">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      <div className="mt-8 flex justify-between gap-3">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={submit}>Submit</Button>
      </div>
    </div>
  );
}
