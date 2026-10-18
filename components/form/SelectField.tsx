import { useId } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Field, controlClass, describedBy, type FieldErrorLike } from "./Field";

type SelectFieldProps = {
  label: string;
  options: readonly string[];
  registration: UseFormRegisterReturn;
  error?: FieldErrorLike;
  hint?: string;
  placeholder?: string;
};

export function SelectField({
  label,
  options,
  registration,
  error,
  hint,
  placeholder = "Select...",
}: SelectFieldProps) {
  const id = useId();
  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <select
        {...registration}
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy({ id, error, hint })}
        className={controlClass(!!error)}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Field>
  );
}
