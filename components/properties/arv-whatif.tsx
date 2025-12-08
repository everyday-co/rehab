import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Surface } from "@/components/ui/surface";
import { formatCurrency } from "@/lib/enrichment/merge";
import type { ARVSuggestion, Comp } from "@/lib/enrichment/types";

interface ArvWhatIfProps {
  arv: ARVSuggestion;
  comps: Comp[];
  onAccept?: (range: { low: number; mid: number; high: number; stressPct: number }) => void;
}

export function ArvWhatIf({ arv, comps, onAccept }: ArvWhatIfProps) {
  const [stressPct, setStressPct] = useState(0);

  const stressed = useMemo(() => {
    if (!stressPct) return arv;
    const factorLow = 1 - stressPct;
    const factorHigh = 1 + stressPct;
    const low = Math.round(arv.low * factorLow);
    const high = Math.round(arv.high * factorHigh);
    const mid = Math.round(((low + high) / 2 / 1000)) * 1000;
    return { ...arv, low, mid, high, stressPct };
  }, [arv, stressPct]);

  const compPpsf = useMemo(() => {
    const ppsf = comps
      .filter((c) => c.salePrice && c.sqft)
      .map((c) => c.salePrice / c.sqft);
    if (ppsf.length === 0) return null;
    const avg = ppsf.reduce((a, b) => a + b, 0) / ppsf.length;
    return Math.round(avg);
  }, [comps]);

  return (
    <Surface className="mt-3 space-y-3 bg-white/70" padding="md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">What-if / Stress Test</p>
          <p className="text-xs text-muted-foreground">Adjust ARV with a stress band</p>
        </div>
        <Badge variant="secondary" className="text-[11px]">
          {Math.round(stressPct * 100)}% band
        </Badge>
      </div>

      <div className="space-y-2">
        <Slider
          value={[stressPct * 100]}
          min={0}
          max={15}
          step={1}
          onValueChange={([val]) => setStressPct(val / 100)}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>±15%</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <BandCard label="Low" value={stressed.low} />
        <BandCard label="Mid" value={stressed.mid} />
        <BandCard label="High" value={stressed.high} />
      </div>

      {compPpsf && (
        <p className="text-xs text-muted-foreground">
          Avg comps PPSF: ${compPpsf} · Suggested PPSF: ${arv.pricePerSqftRange.avg}
        </p>
      )}

      {onAccept && (
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            onClick={() =>
              onAccept({
                low: stressed.low,
                mid: stressed.mid,
                high: stressed.high,
                stressPct,
              })
            }
          >
            Apply band
          </Button>
        </div>
      )}
    </Surface>
  );
}

function BandCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border/80 bg-muted/40 p-3">
      <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{formatCurrency(value)}</p>
    </div>
  );
}

