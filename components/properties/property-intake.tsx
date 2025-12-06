"use client";

import { useState, useTransition } from "react";
import { Search, Link2, Loader2, CheckCircle2, XCircle, AlertCircle, Sparkles, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { isSupportedListingUrl, getListingDomain } from "@/lib/enrichment/types";
import type { EnrichmentResult, EnrichmentStatus, SourceStatus } from "@/lib/enrichment/types";
import type { PropertyFormValues } from "@/lib/validations";

interface PropertyIntakeProps {
  onEnrichmentComplete: (result: EnrichmentResult) => void;
  onSkip: () => void;
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
    <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Quick Start with Auto-Fill</CardTitle>
            <CardDescription>
              Enter an address or paste a listing URL to auto-populate property details
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant={mode === "address" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setMode("address");
              setError(null);
            }}
            className="flex-1"
          >
            <Search className="mr-2 h-4 w-4" />
            Address
          </Button>
          <Button
            type="button"
            variant={mode === "url" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setMode("url");
              setError(null);
            }}
            className="flex-1"
          >
            <Link2 className="mr-2 h-4 w-4" />
            Listing URL
          </Button>
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          {mode === "address" ? (
            <>
              <Label htmlFor="address-input">Property Address</Label>
              <div className="flex gap-2">
                <Input
                  id="address-input"
                  placeholder="3811 Whitetail Dr, Shakopee, MN 55379"
                  value={addressInput}
                  onChange={(e) => {
                    setAddressInput(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isPending) {
                      e.preventDefault();
                      handleEnrich();
                    }
                  }}
                  disabled={isPending}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleEnrich} 
                  disabled={isPending || !addressInput.trim()}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Look Up"
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                We&apos;ll fetch property details from public records
              </p>
            </>
          ) : (
            <>
              <Label htmlFor="url-input">Listing URL</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="url-input"
                    placeholder="https://zillow.com/homedetails/..."
                    value={urlInput}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isPending) {
                        e.preventDefault();
                        handleEnrich();
                      }
                    }}
                    disabled={isPending}
                    className={cn(urlDomain && "pr-24")}
                  />
                  {urlDomain && (
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
                  disabled={isPending || !urlInput.trim() || !!error}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Import"
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supports Zillow, Redfin, and Realtor.com listings
              </p>
            </>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isPending && (
          <div className="rounded-md bg-muted p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <div>
                <p className="font-medium">Enriching property data...</p>
                <p className="text-sm text-muted-foreground">
                  This may take a few seconds
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Skip to Manual */}
        <Collapsible open={manualExpanded} onOpenChange={setManualExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground hover:text-foreground"
            >
              <ChevronDown 
                className={cn(
                  "mr-2 h-4 w-4 transition-transform",
                  manualExpanded && "rotate-180"
                )} 
              />
              Or enter details manually
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onSkip}
              className="w-full"
            >
              Skip Auto-Fill &amp; Enter Manually
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
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

