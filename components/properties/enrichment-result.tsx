import { Badge } from "@/components/ui/badge";
import { Surface } from "@/components/ui/surface";
import { cn } from "@/lib/utils";
import { EnrichmentResult } from "@/lib/enrichment/types";
import { formatCurrency, formatSqft } from "@/lib/enrichment/merge";
import { Check, Image as ImageIcon } from "lucide-react";
import { CompsPreview } from "./comps-preview";
import { ArvWhatIf } from "./arv-whatif";

interface EnrichmentResultProps {
  result: EnrichmentResult;
  onAccept: () => void;
  onEdit: () => void;
  onRerun?: () => void;
}

function Stat({ label, value }: { label: string; value?: string | number }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function SourceBadge({
  label,
  status,
}: {
  label: string;
  status: "success" | "partial" | "failed" | "skipped";
}) {
  const variants: Record<typeof status, string> = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    partial: "bg-amber-50 text-amber-700 border-amber-200",
    failed: "bg-rose-50 text-rose-700 border-rose-200",
    skipped: "bg-muted text-muted-foreground border-border/70",
  };
  return (
    <Badge variant="outline" className={cn("gap-1 text-xs", variants[status])}>
      <span className="inline-block h-2 w-2 rounded-full bg-current opacity-70" />
      {label}: {status}
    </Badge>
  );
}

export function EnrichmentResultCard({
  result,
  onAccept,
  onEdit,
  onRerun,
}: EnrichmentResultProps) {
  const { property, batchData, listing, photos, arvSuggestion, status, confidence } = result;
  const comps = result.comps || [];
  const warnings = result.arvWarnings || [];
  const ppsf = result.arvSuggestion?.pricePerSqftRange;

  return (
    <div className="space-y-4">
      <Surface className="overflow-hidden p-0">
        {/* Photo strip */}
        <div className="flex h-48 w-full overflow-hidden bg-muted">
          {photos.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              <ImageIcon className="mr-2 h-4 w-4" />
              No photos imported
            </div>
          ) : (
            photos.slice(0, 4).map((photo, i) => (
              <div
                key={i}
                className="relative flex-1 bg-muted"
                style={{
                  backgroundImage: `url(${photo.thumbnailUrl || photo.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {i === 3 && photos.length > 4 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm font-medium text-white">
                    +{photos.length - 4}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="space-y-4 p-5">
          {/* Address header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">{property.address}</h2>
              <p className="text-sm text-muted-foreground">
                {property.city}, {property.state} {property.zip}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                <Check className="mr-1 h-3 w-3" /> Verified
              </Badge>
              <Badge variant="outline" className="bg-white text-foreground">
                {confidence}% confidence
              </Badge>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-5">
            <Stat label="Beds" value={property.beds} />
            <Stat label="Baths" value={property.baths} />
            <Stat label="Sqft" value={property.sqft && formatSqft(property.sqft)} />
            <Stat label="Year" value={property.yearBuilt} />
            <Stat label="Lot" value={property.lotAcres ? `${property.lotAcres} ac` : undefined} />
          </div>

          {/* Financials / ARV */}
          {arvSuggestion && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-primary/80">Suggested ARV</p>
              <div className="mt-2 flex flex-wrap gap-3">
                <Badge variant="outline" className="bg-white">
                  Low: {formatCurrency(arvSuggestion.low)}
                </Badge>
                <Badge variant="outline" className="bg-white">
                  Mid: {formatCurrency(arvSuggestion.mid)}
                </Badge>
                <Badge variant="outline" className="bg-white">
                  High: {formatCurrency(arvSuggestion.high)}
                </Badge>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {arvSuggestion.confidence} confidence
                </Badge>
              </div>
          {ppsf && (
            <div className="mt-2 text-xs text-muted-foreground">
              PPSF range: {ppsf.low}-{ppsf.high}
            </div>
          )}
          <ArvWhatIf
            arv={arvSuggestion}
            comps={comps}
            onAccept={(range) => {
              // no-op here; could lift state if needed
            }}
          />
          {warnings.length > 0 && (
            <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
              {warnings.map((w, i) => (
                <div key={i}>• {w}</div>
              ))}
            </div>
          )}
            </div>
          )}

          {/* Last sale info */}
          {batchData?.lastSalePrice && (
            <div className="rounded-lg border bg-muted/40 p-3">
              <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Last Sale</p>
              <p className="text-sm font-semibold text-foreground">
                {formatCurrency(batchData.lastSalePrice)}
                {batchData.lastSaleDate && (
                  <span className="ml-2 text-xs text-muted-foreground">({batchData.lastSaleDate})</span>
                )}
              </p>
            </div>
          )}

          {/* Listing summary */}
          {listing?.description && (
            <div className="rounded-lg border bg-card p-3">
              <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground mb-1">
                Listing Description
              </p>
              <p className="text-sm text-foreground line-clamp-3">{listing.description}</p>
            </div>
          )}

          {/* Source badges */}
          <div className="flex flex-wrap gap-2">
            <SourceBadge label="Records" status={status.batchdata} />
            <SourceBadge label="Listing" status={status.firecrawl} />
            <SourceBadge label="Photos" status={status.photos} />
          </div>

      {/* Comps */}
      {comps.length > 0 && <CompsPreview comps={comps} />}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {onRerun && (
              <button
                type="button"
                onClick={onRerun}
                className="text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                Re-run enrichment
              </button>
            )}
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={onEdit}
                className="rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-muted"
              >
                Edit first
              </button>
              <button
                type="button"
                onClick={onAccept}
                className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Use this data
              </button>
            </div>
          </div>
        </div>
      </Surface>
    </div>
  );
}

