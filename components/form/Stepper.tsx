import { STEPS } from "@/lib/steps";

type StepperProps = {
  current: number;
  completed: number;
  onSelect: (index: number) => void;
};

// `completed` = number of finished steps; only those steps are clickable.
export function Stepper({ current, completed, onSelect }: StepperProps) {
  const percent = ((current + 1) / STEPS.length) * 100;

  return (
    <nav aria-label="Progress">
      <div
        role="progressbar"
        aria-label="Form progress"
        aria-valuemin={1}
        aria-valuemax={STEPS.length}
        aria-valuenow={current + 1}
        aria-valuetext={`Step ${current + 1} of ${STEPS.length}: ${STEPS[current].title}`}
        className="h-2 overflow-hidden rounded-full bg-zinc-200"
      >
        <div
          className="h-full rounded-full bg-indigo-600 transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ol className="mt-4 flex justify-between gap-2">
        {STEPS.map((step, i) => {
          const isCurrent = i === current;
          const isDone = i < completed;
          const circle = isCurrent
            ? "bg-indigo-600 text-white"
            : isDone
              ? "bg-indigo-100 text-indigo-700"
              : "bg-zinc-100 text-zinc-500";

          return (
            <li key={step.id} className="flex-1">
              <button
                type="button"
                disabled={!isDone && !isCurrent}
                aria-current={isCurrent ? "step" : undefined}
                onClick={() => onSelect(i)}
                className="flex w-full flex-col items-center gap-1 rounded-md p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 enabled:cursor-pointer disabled:cursor-not-allowed"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${circle}`}
                >
                  {isDone && !isCurrent ? "✓" : i + 1}
                </span>
                <span
                  className={`hidden text-center text-xs sm:block ${isCurrent ? "font-semibold text-zinc-900" : "text-zinc-500"}`}
                >
                  {step.title}
                </span>
                <span className="sr-only sm:hidden">{step.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
