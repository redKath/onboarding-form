import { useId } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Field, controlClass, describedBy, type FieldErrorLike } from "./Field";

type TextAreaProps = {
  label: string;
  registration: UseFormRegisterReturn;
  length: number;
  limit: number;
  error?: FieldErrorLike;
  hint?: string;
};

export function TextArea({
  label,
  registration,
  length,
  limit,
  error,
  hint,
}: TextAreaProps) {
  const id = useId();
  const over = length > limit;
  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <textarea
        {...registration}
        id={id}
        rows={4}
        aria-invalid={!!error}
        aria-describedby={describedBy({ id, error, hint })}
        className={controlClass(!!error)}
      />
      <p
        className={`mt-1 text-right text-sm ${over ? "font-medium text-red-700" : "text-zinc-500"}`}
      >
        {length}/{limit}
      </p>
    </Field>
  );
}
