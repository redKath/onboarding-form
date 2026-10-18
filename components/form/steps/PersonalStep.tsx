import { StepNav } from "@/components/form/StepNav";
import { TextField } from "@/components/form/TextField";
import { useStepForm, type StepProps } from "@/components/form/useStepForm";
import { personalSchema, type PersonalValues } from "@/lib/schemas";

const DEFAULTS: PersonalValues = {
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
};

export function PersonalStep({
  draft,
  onDraft,
  onNext,
  onBack,
}: StepProps<PersonalValues>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useStepForm(personalSchema, { ...DEFAULTS, ...draft }, onDraft);

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-5">
      <TextField
        label="Full name"
        autoComplete="name"
        registration={register("fullName")}
        error={errors.fullName}
      />
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        registration={register("email")}
        error={errors.email}
      />
      <TextField
        label="Phone (optional)"
        type="tel"
        autoComplete="tel"
        hint="Digits, spaces and + only"
        registration={register("phone")}
        error={errors.phone}
      />
      <TextField
        label="Date of birth"
        type="date"
        autoComplete="bday"
        registration={register("dateOfBirth")}
        error={errors.dateOfBirth}
      />
      <StepNav onBack={onBack} />
    </form>
  );
}
