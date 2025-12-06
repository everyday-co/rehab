import { Loader2, Home, CheckCircle2, Clock, Image as ImageIcon } from "lucide-react";
import { Surface } from "@/components/ui/surface";
import { cn } from "@/lib/utils";

type StepStatus = "pending" | "loading" | "complete";

interface EnrichmentLoadingProps {
  steps?: Array<{ label: string; status: StepStatus }>;
  hint?: string;
}

export function EnrichmentLoading({
  steps = [
    { label: "Validating address", status: "complete" },
    { label: "Fetching property records", status: "loading" },
    { label: "Checking listing data", status: "pending" },
    { label: "Loading photos", status: "pending" },
  ],
  hint = "This usually takes 3–5 seconds",
}: EnrichmentLoadingProps) {
  return (
    <Surface className="flex flex-col items-center gap-6 bg-card/60">
      <div className="relative mt-2">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <Home className="h-10 w-10 text-primary animate-pulse" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-primary bg-background">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className="text-lg font-semibold tracking-tight text-foreground">Finding your property…</p>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>

      <div className="w-full space-y-2">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={cn(
              "flex items-center gap-3 rounded-lg border border-border/70 px-3 py-2.5",
              step.status === "complete" && "bg-emerald-50/60 border-emerald-200 text-emerald-900",
              step.status === "loading" && "bg-primary/5 border-primary/30",
              step.status === "pending" && "bg-muted/40"
            )}
          >
            {step.status === "complete" && <CheckCircle2 className="h-4 w-4" />}
            {step.status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
            {step.status === "pending" && <Clock className="h-4 w-4" />}
            <span className="text-sm font-medium">{step.label}</span>
          </div>
        ))}
      </div>
    </Surface>
  );
}

