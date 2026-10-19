import { useEffect } from "react";
import { RadioGroup } from "@/components/form/OptionGroup";
import { SelectField } from "@/components/form/SelectField";
import { StepNav } from "@/components/form/StepNav";
import { TextField } from "@/components/form/TextField";
import { useStepForm, type StepProps } from "@/components/form/useStepForm";
import {
  DEPARTMENTS,
  EMPLOYMENT_TYPES,
  workSchema,
  type WorkValues,
} from "@/lib/schemas";

export function WorkStep({
  draft,
  onDraft,
  onNext,
  onBack,
}: StepProps<WorkValues>) {
  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
  } = useStepForm(
    workSchema,
    { jobTitle: "", startDate: "", contractEndDate: "", ...draft },
    onDraft,
  );
  const isContract = watch("employmentType") === "Contract";

  // A hidden field must not keep its error for when it is shown again.
  useEffect(() => {
    if (!isContract) clearErrors("contractEndDate");
  }, [isContract, clearErrors]);

  return (
    <form
      onSubmit={handleSubmit((v) =>
        onNext({ ...v, contractEndDate: isContract ? v.contractEndDate : "" }),
      )}
      noValidate
      className="space-y-5"
    >
      <TextField
        label="Job title"
        autoComplete="organization-title"
        registration={register("jobTitle")}
        error={errors.jobTitle}
      />
      <SelectField
        label="Department"
        options={DEPARTMENTS}
        registration={register("department")}
        error={errors.department}
      />
      <RadioGroup
        legend="Employment type"
        options={EMPLOYMENT_TYPES}
        registration={register("employmentType")}
        error={errors.employmentType}
      />
      <TextField
        label="Start date"
        type="date"
        registration={register("startDate")}
        error={errors.startDate}
      />
      {isContract && (
        <TextField
          label="Contract end date"
          type="date"
          registration={register("contractEndDate")}
          error={errors.contractEndDate}
        />
      )}
      <StepNav onBack={onBack} />
    </form>
  );
}
