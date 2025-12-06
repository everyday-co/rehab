"use client";

import { useState, useTransition } from "react";
import { Search, Link2, Loader2, CheckCircle2, XCircle, AlertCircle, Sparkles, ChevronDown, Home, PenLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Surface } from "@/components/ui/surface";
import { cn } from "@/lib/utils";
import { isSupportedListingUrl, getListingDomain } from "@/lib/enrichment/types";
import type { EnrichmentResult, SourceStatus } from "@/lib/enrichment/types";

interface PropertyIntakeProps {
  onEnrichmentComplete: (result: EnrichmentResult) => void;
  onSkip: () => void;
  onStart?: () => void;
  isEnabled?: boolean;
}

type IntakeMode = "address" | "url";

function StatusBadge({ status, label }: { status: SourceStatus; label: string }) {
  const variants: Record<SourceStatus, { icon: React.ReactNode; className: string }> = {
    success: {
      icon: <CheckCircle2 className="h-3 w-3" />,
      className: "bg-green-100 text-green-800 border-green-200",
    },
    failed: {
      icon: <XCircle className="h-3 w-3" />,
      className: "bg-red-100 text-red-800 border-red-200",
    },
    partial: {
      icon: <AlertCircle className="h-3 w-3" />,
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    skipped: {
      icon: null,
      className: "bg-gray-100 text-gray-600 border-gray-200",
    },
  };

  const variant = variants[status];

  return (
    <Badge variant="outline" className={cn("gap-1 text-xs", variant.className)}>
      {variant.icon}
      {label}: {status}
    </Badge>
  );
}

export function PropertyIntake({
  onEnrichmentComplete,
  onSkip,
  onStart,
  isEnabled = true,
}: PropertyIntakeProps) {
  const [mode, setMode] = useState<IntakeMode>("address");
  const [addressInput, setAddressInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [urlDomain, setUrlDomain] = useState<string | null>(null);
  const [manualExpanded, setManualExpanded] = useState(false);

  // Validate URL as user types
  const handleUrlChange = (value: string) => {
    setUrlInput(value);
    setError(null);
    
    if (value.trim()) {
      const domain = getListingDomain(value);
      setUrlDomain(domain?.name || null);
      
      if (value.startsWith("http") && !domain) {
        setError("This domain is not supported. Try Zillow, Redfin, or Realtor.com");
      }
    } else {
      setUrlDomain(null);
    }
  };

  const handleEnrich = () => {
    setError(null);
    
    const input = mode === "address" ? addressInput.trim() : urlInput.trim();
    
    if (!input) {
      setError(mode === "address" ? "Please enter an address" : "Please enter a listing URL");
      return;
    }

    if (mode === "url" && !isSupportedListingUrl(input)) {
      setError("Please enter a valid Zillow, Redfin, or Realtor.com URL");
      return;
    }

    onStart?.();
    startTransition(async () => {
      try {
        const response = await fetch("/api/properties/enrich", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            mode === "address"
              ? { address: input }
              : { listingUrl: input }
          ),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to enrich property");
        }

        const result: EnrichmentResult = await response.json();
        
        // Check for duplicate
        if (result.duplicate?.exists) {
          setError(`This property already exists. You can view it or continue to create a duplicate.`);
          // Still pass the result so user can choose
        }
        
        onEnrichmentComplete(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to enrich property");
      }
    });
  };

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-8 rounded-2xl border border-border/70 bg-gradient-to-b from-background to-muted/40 p-6 sm:p-10">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Add Your Property</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Find it instantly or enter details manually
          </p>
        </div>
      </div>

      {/* Primary input surface */}
      <Surface className="w-full max-w-3xl space-y-4">
        <Label htmlFor="intake-input" className="text-sm font-medium text-muted-foreground">
          Search address or paste listing URL
        </Label>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="intake-input"
              placeholder={
                mode === "address"
                  ? "3811 Whitetail Dr, Shakopee, MN 55379"
                  : "https://zillow.com/homedetails/..."
              }
              value={mode === "address" ? addressInput : urlInput}
              onChange={(e) => {
                if (mode === "address") {
                  setAddressInput(e.target.value);
                  setError(null);
                } else {
                  handleUrlChange(e.target.value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isPending) {
                  e.preventDefault();
                  handleEnrich();
                }
              }}
              disabled={isPending}
              className={cn(urlDomain && mode === "url" && "pr-24", "h-12 text-base")}
            />
            {urlDomain && mode === "url" && (
              <Badge
                variant="secondary"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
              >
                {urlDomain}
              </Badge>
            )}
          </div>
          <Button
            type="button"
            onClick={handleEnrich}
            disabled={
              isPending ||
              (mode === "address" ? !addressInput.trim() : !urlInput.trim() || !!error)
            }
            className="h-12 px-5"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Go"}
          </Button>
        </div>

        {/* Mode pills */}
        <div className="flex gap-2 text-sm">
          <Button
            type="button"
            variant={mode === "address" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => {
              setMode("address");
              setError(null);
            }}
            className="gap-2"
          >
            <Search className="h-4 w-4" />
            Address
          </Button>
          <Button
            type="button"
            variant={mode === "url" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => {
              setMode("url");
              setError(null);
            }}
            className="gap-2"
          >
            <Link2 className="h-4 w-4" />
            Listing URL
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Info text */}
        <div className="text-xs text-muted-foreground">
          Paste a Zillow, Redfin, or Realtor.com URL for best results. We’ll fetch photos, listing data, and public records.
        </div>
      </Surface>

      {/* Option cards */}
      <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
        <Surface className="flex items-start gap-3" padding="md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Link2 className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Paste a listing URL</p>
            <p className="text-sm text-muted-foreground">Zillow, Redfin, or Realtor.com</p>
            <Button
              type="button"
              variant="link"
              className="px-0 text-primary"
              onClick={() => setMode("url")}
            >
              Use URL
            </Button>
          </div>
        </Surface>

        <Surface className="flex items-start gap-3" padding="md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
            <PenLine className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Enter manually</p>
            <p className="text-sm text-muted-foreground">I’ll type the details myself</p>
            <Button
              type="button"
              variant="link"
              className="px-0 text-primary"
              onClick={onSkip}
            >
              Skip auto-fill
            </Button>
          </div>
        </Surface>
      </div>

      {/* Helper / Pro tip */}
      <div className="w-full max-w-2xl rounded-xl border border-dashed border-border/70 bg-muted/30 p-4 text-center text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Pro tip:</span> Paste a listing URL and we’ll auto-fill everything, including photos and price history.
      </div>

      {/* Loading State Inline */}
      {isPending && (
        <Surface className="w-full max-w-3xl">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <div>
              <p className="font-medium">Enriching property data…</p>
              <p className="text-sm text-muted-foreground">This may take a few seconds</p>
            </div>
          </div>
        </Surface>
      )}
    </div>
  );
}

/** Display enrichment results with status badges */
export function EnrichmentPreview({
  result,
  onAccept,
  onEdit,
}: {
  result: EnrichmentResult;
  onAccept: () => void;
  onEdit: () => void;
}) {
  const { property, batchData, listing, photos, arvSuggestion, status, confidence } = result;

  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">Property Found</CardTitle>
          </div>
          <Badge variant="outline" className="bg-white">
            {confidence}% confidence
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <StatusBadge status={status.batchdata} label="Records" />
          <StatusBadge status={status.firecrawl} label="Listing" />
          <StatusBadge status={status.photos} label="Photos" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address */}
        <div>
          <p className="font-semibold text-lg">
            {property.address}
          </p>
          <p className="text-muted-foreground">
            {property.city}, {property.state} {property.zip}
          </p>
        </div>

        {/* Key Details Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {property.sqft && (
            <div>
              <p className="text-sm text-muted-foreground">Sqft</p>
              <p className="font-medium">{property.sqft.toLocaleString()}</p>
            </div>
          )}
          {property.beds && (
            <div>
              <p className="text-sm text-muted-foreground">Beds</p>
              <p className="font-medium">{property.beds}</p>
            </div>
          )}
          {property.baths && (
            <div>
              <p className="text-sm text-muted-foreground">Baths</p>
              <p className="font-medium">{property.baths}</p>
            </div>
          )}
          {property.yearBuilt && (
            <div>
              <p className="text-sm text-muted-foreground">Year Built</p>
              <p className="font-medium">{property.yearBuilt}</p>
            </div>
          )}
        </div>

        {/* Last Sale Info */}
        {batchData?.lastSalePrice && (
          <div className="rounded-md bg-white p-3">
            <p className="text-sm text-muted-foreground">Last Sale</p>
            <p className="font-medium">
              ${batchData.lastSalePrice.toLocaleString()}
              {batchData.lastSaleDate && (
                <span className="ml-2 text-sm text-muted-foreground">
                  ({batchData.lastSaleDate})
                </span>
              )}
            </p>
          </div>
        )}

        {/* Listing Description */}
        {listing?.description && (
          <div className="rounded-md bg-white p-3">
            <p className="text-sm text-muted-foreground mb-1">Listing Description</p>
            <p className="text-sm line-clamp-3">{listing.description}</p>
          </div>
        )}

        {/* ARV Suggestion */}
        {arvSuggestion && (
          <div className="rounded-md bg-primary/5 p-3">
            <p className="text-sm font-medium text-primary mb-2">
              Suggested ARV Range ({arvSuggestion.confidence} confidence)
            </p>
            <div className="flex gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Low</p>
                <p className="font-semibold">${arvSuggestion.low.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mid</p>
                <p className="font-semibold">${arvSuggestion.mid.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">High</p>
                <p className="font-semibold">${arvSuggestion.high.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Photos Preview */}
        {photos.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {photos.length} photos found
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {photos.slice(0, 5).map((photo, i) => (
                <div
                  key={i}
                  className="h-16 w-16 flex-shrink-0 rounded-md bg-muted"
                  style={{
                    backgroundImage: `url(${photo.thumbnailUrl || photo.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              ))}
              {photos.length > 5 && (
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
                  +{photos.length - 5}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button onClick={onAccept} className="flex-1">
            Use This Data
          </Button>
          <Button variant="outline" onClick={onEdit}>
            Edit First
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

