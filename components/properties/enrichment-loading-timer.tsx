import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Surface } from "@/components/ui/surface";

interface EnrichmentLoadingTimerProps {
  hint?: string;
  timeoutSeconds?: number;
}

export function EnrichmentLoadingTimer({ hint = "This usually takes 3–5 seconds", timeoutSeconds = 8 }: EnrichmentLoadingTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const started = Date.now();
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - started) / 1000));
    }, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <Surface className="flex items-center gap-3 bg-card/70">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <div className="text-sm">
        <p className="font-medium">Enriching property data…</p>
        <p className="text-muted-foreground">
          {hint} · Elapsed: {elapsed}s{timeoutSeconds ? ` · Timeout: ${timeoutSeconds}s` : ""}
        </p>
      </div>
    </Surface>
  );
}

