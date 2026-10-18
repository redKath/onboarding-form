"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { STEPS } from "@/lib/steps";
import { Stepper } from "./Stepper";

export function OnboardingForm() {
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState(0);
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

  const isLast = current === STEPS.length - 1;

  function next() {
    setCompleted((c) => Math.max(c, current + 1));
    setCurrent((c) => Math.min(c + 1, STEPS.length - 1));
  }

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
          className="mt-1 text-xl font-semibold outline-none"
        >
          {STEPS[current].title}
        </h2>

        <div className="mt-6 text-zinc-600">
          Fields for this step are added in the next PR.
        </div>

        <div className="mt-8 flex justify-between gap-3">
          <Button
            variant="secondary"
            disabled={current === 0}
            onClick={() => setCurrent((c) => Math.max(c - 1, 0))}
          >
            Back
          </Button>
          {!isLast && <Button onClick={next}>Next</Button>}
        </div>
      </section>
    </div>
  );
}
