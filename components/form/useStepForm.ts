import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import {
  useForm,
  type DeepPartial,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import type { z } from "zod";

export type StepProps<V> = {
  draft: DeepPartial<V>;
  onDraft: (values: DeepPartial<V>) => void;
  onNext: (values: V) => void;
  onBack?: () => void;
};

// react-hook-form bound to a step schema; every change is mirrored to onDraft.
export function useStepForm<V extends FieldValues>(
  schema: z.ZodType<V, V>,
  draft: DeepPartial<NoInfer<V>>,
  onDraft: (values: DeepPartial<NoInfer<V>>) => void,
): UseFormReturn<V> {
  const form = useForm<V>({
    resolver: zodResolver(schema),
    defaultValues: draft as never,
  });

  const onDraftRef = useRef(onDraft);
  useEffect(() => {
    onDraftRef.current = onDraft;
  });

  const { subscribe } = form;
  useEffect(
    () =>
      subscribe({
        formState: { values: true },
        callback: ({ values }) => onDraftRef.current(values as DeepPartial<V>),
      }),
    [subscribe],
  );

  return form;
}
