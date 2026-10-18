import { useId } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { describedBy, type FieldErrorLike } from "./Field";

type CheckboxFieldProps = {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldErrorLike;
};

export function CheckboxField({
  label,
  registration,
  error,
}: CheckboxFieldProps) {
  const id = useId();
  return (
    <div>
      <label className="flex items-start gap-2 py-1 text-base">
        <input
          type="checkbox"
          {...registration}
          aria-invalid={!!error}
          aria-describedby={describedBy({ id, error })}
          className="mt-1 h-4 w-4 accent-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        />
        {label}
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-700">
          {error.message}
        </p>
      )}
    </div>
  );
}
