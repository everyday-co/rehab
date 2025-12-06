import { cn } from "@/lib/utils";

interface ProgressStepsProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressSteps({ current, total, label }: ProgressStepsProps) {
  const steps = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {steps.map((step) => {
          const isActive = step === current;
          const isDone = step < current;
          return (
            <span
              key={step}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-colors",
                isActive && "bg-primary",
                isDone && "bg-primary/60",
                !isActive && !isDone && "bg-muted-foreground/30"
              )}
            />
          );
        })}
      </div>
      <div className="text-sm text-muted-foreground">
        {label ? label : `Step ${current} of ${total}`}
      </div>
    </div>
  );
}

