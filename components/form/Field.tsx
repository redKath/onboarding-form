import type { ReactNode } from "react";

export type FieldErrorLike = { message?: string };

type MessageProps = { id: string; error?: FieldErrorLike; hint?: string };

export const controlClass = (invalid: boolean) =>
  `block w-full rounded-md border bg-white px-3 py-2 text-base text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
    invalid ? "border-red-600" : "border-zinc-300"
  }`;

// Space-separated ids of the hint/error elements rendered by Field and FieldGroup.
export function describedBy({ id, error, hint }: MessageProps) {
  const ids = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

function Messages({ id, error, hint }: MessageProps) {
  return (
    <>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-zinc-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-700">
          {error.message}
        </p>
      )}
    </>
  );
}

type FieldProps = MessageProps & { label: string; children: ReactNode };

// Label + single control + hint/error.
export function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-zinc-900">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      <Messages id={id} error={error} hint={hint} />
    </div>
  );
}

type FieldGroupProps = MessageProps & { legend: string; children: ReactNode };

// Legend + group of radios/checkboxes + hint/error.
export function FieldGroup({
  id,
  legend,
  error,
  hint,
  children,
}: FieldGroupProps) {
  return (
    <fieldset aria-describedby={describedBy({ id, error, hint })}>
      <legend className="text-sm font-medium text-zinc-900">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">{children}</div>
      <Messages id={id} error={error} hint={hint} />
    </fieldset>
  );
}
