import { Button } from "@/components/ui/Button";

type StepNavProps = { onBack?: () => void };

export function StepNav({ onBack }: StepNavProps) {
  return (
    <div className="mt-8 flex justify-between gap-3">
      <Button variant="secondary" disabled={!onBack} onClick={onBack}>
        Back
      </Button>
      <Button type="submit">Next</Button>
    </div>
  );
}
