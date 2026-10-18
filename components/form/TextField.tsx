import { useId, type ComponentProps } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Field, controlClass, describedBy, type FieldErrorLike } from "./Field";

type TextFieldProps = Omit<
  ComponentProps<"input">,
  "id" | "name" | "onChange" | "onBlur" | "ref"
> & {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldErrorLike;
  hint?: string;
};

export function TextField({
  label,
  registration,
  error,
  hint,
  ...inputProps
}: TextFieldProps) {
  const id = useId();
  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <input
        {...inputProps}
        {...registration}
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy({ id, error, hint })}
        className={controlClass(!!error)}
      />
    </Field>
  );
}
