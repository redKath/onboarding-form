import { useId } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { FieldGroup, type FieldErrorLike } from "./Field";

type OptionGroupProps = {
  legend: string;
  options: readonly string[];
  registration: UseFormRegisterReturn;
  error?: FieldErrorLike;
  hint?: string;
};

function OptionGroup({
  type,
  legend,
  options,
  registration,
  error,
  hint,
}: OptionGroupProps & { type: "radio" | "checkbox" }) {
  const id = useId();
  return (
    <FieldGroup id={id} legend={legend} error={error} hint={hint}>
      {options.map((o) => (
        <label key={o} className="flex items-center gap-2 py-1 text-base">
          <input
            type={type}
            value={o}
            {...registration}
            aria-invalid={!!error}
            className="h-4 w-4 accent-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          />
          {o}
        </label>
      ))}
    </FieldGroup>
  );
}

export function RadioGroup(props: OptionGroupProps) {
  return <OptionGroup type="radio" {...props} />;
}

export function CheckboxGroup(props: OptionGroupProps) {
  return <OptionGroup type="checkbox" {...props} />;
}
