import { Badge } from "@/components/ui/badge";
import { Surface } from "@/components/ui/surface";
import { formatCurrency, formatSqft } from "@/lib/enrichment/merge";
import type { Comp } from "@/lib/enrichment/types";

interface CompsPreviewProps {
  comps: Comp[];
}

export function CompsPreview({ comps }: CompsPreviewProps) {
  if (!comps || comps.length === 0) return null;

  return (
    <Surface className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Comparable sales</p>
          <p className="text-xs text-muted-foreground">Closest and most recent matches</p>
        </div>
        <Badge variant="secondary" className="text-xs">
          {comps.length} comps
        </Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {comps.slice(0, 3).map((comp, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-border/70 bg-card/60 p-3 space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-foreground line-clamp-1">
                  {comp.address}
                </p>
                <p className="text-xs text-muted-foreground">
                  {comp.city}, {comp.state} {comp.zip}
                </p>
              </div>
              {comp.distanceMiles !== undefined && (
                <Badge variant="outline" className="text-[11px]">
                  {comp.distanceMiles.toFixed(1)} mi
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                {formatCurrency(comp.salePrice)}
              </span>
              <span>·</span>
              <span>{formatSqft(comp.sqft)}</span>
              {comp.beds !== undefined && <span>· {comp.beds} bd</span>}
              {comp.baths !== undefined && <span>· {comp.baths} ba</span>}
            </div>
            {comp.soldDate && (
              <p className="text-[11px] text-muted-foreground">Sold {comp.soldDate}</p>
            )}
          </div>
        ))}
      </div>
    </Surface>
  );
}

