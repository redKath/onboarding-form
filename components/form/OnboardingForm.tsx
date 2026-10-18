"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Button } from "@/components/ui/Button";
import { STEPS } from "@/lib/steps";
import {
  parseState,
  readRaw,
  saveState,
  type Drafts,
  type SavedState,
} from "@/lib/storage";
import { PersonalStep } from "./steps/PersonalStep";
import { PreferencesStep } from "./steps/PreferencesStep";
import { WorkStep } from "./steps/WorkStep";
import { Stepper } from "./Stepper";

const noopSubscribe = () => () => {};

export function OnboardingForm() {
  // Server snapshot is undefined, so saved progress is only read on the client without a hydration mismatch.
  const raw = useSyncExternalStore(noopSubscribe, readRaw, () => undefined);
  if (raw === undefined) {
    return (
      <p aria-busy="true" className="text-zinc-500">
        Loading...
      </p>
    );
  }
  return <Wizard initial={parseState(raw)} />;
}

function Wizard({ initial }: { initial: SavedState | null }) {
  const [current, setCurrent] = useState(initial?.current ?? 0);
  const [completed, setCompleted] = useState(initial?.completed ?? 0);
  const [drafts, setDrafts] = useState<Drafts>(
    initial?.drafts ?? { personal: {}, work: {}, preferences: {} },
  );
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prevStep = useRef(current);

  useEffect(() => {
    saveState({ current, completed, drafts });
  }, [current, completed, drafts]);

  // Move focus to the step heading when the step changes, not on initial load or restore.
  useEffect(() => {
    if (prevStep.current === current) return;
    prevStep.current = current;
    headingRef.current?.focus();
  }, [current]);

  const setDraft = useCallback(
    <K extends keyof Drafts>(key: K, value: Drafts[K]) =>
      setDrafts((d) => ({ ...d, [key]: value })),
    [],
  );

  function next<K extends keyof Drafts>(key: K, values: Drafts[K]) {
    setDraft(key, values);
    setCompleted((c) => Math.max(c, current + 1));
    setCurrent(current + 1);
  }

  const back = current > 0 ? () => setCurrent(current - 1) : undefined;

  return (
    <div className="space-y-8">
      <Stepper current={current} completed={completed} onSelect={setCurrent} />

      <section
        aria-labelledby="step-heading"
        className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <p className="text-sm text-zinc-500">
          Step {current + 1} of {STEPS.length}
        </p>
        <h2
          id="step-heading"
          ref={headingRef}
          tabIndex={-1}
          className="mt-1 mb-6 text-xl font-semibold outline-none"
        >
          {STEPS[current].title}
        </h2>

        {current === 0 && (
          <PersonalStep
            draft={drafts.personal}
            onDraft={(v) => setDraft("personal", v)}
            onNext={(v) => next("personal", v)}
          />
        )}
        {current === 1 && (
          <WorkStep
            draft={drafts.work}
            onDraft={(v) => setDraft("work", v)}
            onNext={(v) => next("work", v)}
            onBack={back}
          />
        )}
        {current === 2 && (
          <PreferencesStep
            draft={drafts.preferences}
            onDraft={(v) => setDraft("preferences", v)}
            onNext={(v) => next("preferences", v)}
            onBack={back}
          />
        )}
        {current === 3 && (
          <>
            <p className="text-zinc-600">Review is added in a later PR.</p>
            <div className="mt-8">
              <Button variant="secondary" onClick={back}>
                Back
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
