import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { OnboardingValues } from "@/lib/schemas";

type SuccessScreenProps = { values: OnboardingValues; onReset: () => void };

export function SuccessScreen({ values, onReset }: SuccessScreenProps) {
  const [copied, setCopied] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const json = JSON.stringify(values, null, 2);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the JSON stays selectable in the block below.
    }
  }

  return (
    <section
      aria-labelledby="success-heading"
      className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <h2
        id="success-heading"
        ref={headingRef}
        tabIndex={-1}
        className="text-xl font-semibold outline-none"
      >
        Onboarding complete
      </h2>
      <p className="mt-1 text-zinc-600">Here is the validated data.</p>

      <pre
        tabIndex={0}
        aria-label="Submitted data as JSON"
        className="mt-4 max-h-96 overflow-auto rounded-md bg-zinc-900 p-4 text-sm text-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {json}
      </pre>

      <div className="mt-6 flex flex-wrap justify-between gap-3">
        <Button variant="secondary" onClick={copy}>
          {copied ? "Copied!" : "Copy JSON"}
        </Button>
        <Button onClick={onReset}>Start over</Button>
      </div>
      <p role="status" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </p>
    </section>
  );
}
