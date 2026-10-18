"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DeepPartial } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import type { OnboardingValues } from "@/lib/schemas";
import { STEPS } from "@/lib/steps";
import { PersonalStep } from "./steps/PersonalStep";
import { PreferencesStep } from "./steps/PreferencesStep";
import { WorkStep } from "./steps/WorkStep";
import { Stepper } from "./Stepper";

type Drafts = {
  [K in keyof OnboardingValues]: DeepPartial<OnboardingValues[K]>;
};

export function OnboardingForm() {
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [drafts, setDrafts] = useState<Drafts>({
    personal: {},
    work: {},
    preferences: {},
  });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstRender = useRef(true);

  // Move focus to the step heading on navigation, not on initial load.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
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
