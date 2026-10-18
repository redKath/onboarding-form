import { CheckboxField } from "@/components/form/CheckboxField";
import { CheckboxGroup, RadioGroup } from "@/components/form/OptionGroup";
import { SelectField } from "@/components/form/SelectField";
import { StepNav } from "@/components/form/StepNav";
import { TextArea } from "@/components/form/TextArea";
import { useStepForm, type StepProps } from "@/components/form/useStepForm";
import {
  EQUIPMENT,
  OFFICES,
  WORK_SETUPS,
  preferencesSchema,
  type PreferencesValues,
} from "@/lib/schemas";

const BIO_LIMIT = 300;

export function PreferencesStep({
  draft,
  onDraft,
  onNext,
  onBack,
}: StepProps<PreferencesValues>) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useStepForm(
    preferencesSchema,
    { equipment: [], office: "", bio: "", agreeToPolicies: false, ...draft },
    onDraft,
  );
  const needsOffice = ["Hybrid", "Onsite"].includes(watch("workSetup") ?? "");
  const bioLength = (watch("bio") ?? "").length;

  return (
    <form
      onSubmit={handleSubmit((v) =>
        onNext({ ...v, office: needsOffice ? v.office : "" }),
      )}
      noValidate
      className="space-y-5"
    >
      <CheckboxGroup
        legend="Equipment needed"
        options={EQUIPMENT}
        registration={register("equipment")}
        error={errors.equipment}
      />
      <RadioGroup
        legend="Work setup"
        options={WORK_SETUPS}
        registration={register("workSetup")}
        error={errors.workSetup}
      />
      {needsOffice && (
        <SelectField
          label="Preferred office"
          options={OFFICES}
          registration={register("office")}
          error={errors.office}
        />
      )}
      <TextArea
        label="Short bio (optional)"
        registration={register("bio")}
        length={bioLength}
        limit={BIO_LIMIT}
        error={errors.bio}
      />
      <CheckboxField
        label="I agree to the company policies"
        registration={register("agreeToPolicies")}
        error={errors.agreeToPolicies}
      />
      <StepNav onBack={onBack} />
    </form>
  );
}
