"use client";

import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Surface } from "@/components/ui/surface";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { formatCurrency } from "@/lib/enrichment/merge";
import type { ARVSuggestion, Comp } from "@/lib/enrichment/types";
import { ChevronDown, Calculator, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProfitBandInputs {
  purchasePrice: number;
  rehabCost: number;
  holdingCost: number;
  sellingCost: number;
}

interface ArvWhatIfProps {
  arv: ARVSuggestion;
  comps: Comp[];
  /** Initial cost inputs (e.g., from property data) */
  initialInputs?: Partial<ProfitBandInputs>;
  onAccept?: (range: {
    low: number;
    mid: number;
    high: number;
    stressPct: number;
    profitBand?: { low: number; mid: number; high: number };
  }) => void;
}

export function ArvWhatIf({ arv, comps, initialInputs, onAccept }: ArvWhatIfProps) {
  const [stressPct, setStressPct] = useState(0);
  const [profitPanelOpen, setProfitPanelOpen] = useState(false);
  
  // Profit band inputs
  const [purchasePrice, setPurchasePrice] = useState(initialInputs?.purchasePrice ?? 0);
  const [rehabCost, setRehabCost] = useState(initialInputs?.rehabCost ?? 0);
  const [holdingCost, setHoldingCost] = useState(initialInputs?.holdingCost ?? 0);
  const [sellingCost, setSellingCost] = useState(initialInputs?.sellingCost ?? 0);

  const stressed = useMemo(() => {
    if (!stressPct) return arv;
    const factorLow = 1 - stressPct;
    const factorHigh = 1 + stressPct;
    const low = Math.round(arv.low * factorLow);
    const high = Math.round(arv.high * factorHigh);
    const mid = Math.round(((low + high) / 2 / 1000)) * 1000;
    return { ...arv, low, mid, high, stressPct };
  }, [arv, stressPct]);

  // Calculate profit for each ARV band
  const profitBand = useMemo(() => {
    const totalCosts = purchasePrice + rehabCost + holdingCost + sellingCost;
    return {
      low: stressed.low - totalCosts,
      mid: stressed.mid - totalCosts,
      high: stressed.high - totalCosts,
    };
  }, [stressed, purchasePrice, rehabCost, holdingCost, sellingCost]);

  // Calculate ROI percentage
  const roiBand = useMemo(() => {
    const totalInvestment = purchasePrice + rehabCost + holdingCost;
    if (totalInvestment <= 0) return { low: 0, mid: 0, high: 0 };
    return {
      low: (profitBand.low / totalInvestment) * 100,
      mid: (profitBand.mid / totalInvestment) * 100,
      high: (profitBand.high / totalInvestment) * 100,
    };
  }, [profitBand, purchasePrice, rehabCost, holdingCost]);

  const compPpsf = useMemo(() => {
    const ppsf = comps
      .filter((c) => c.salePrice && c.sqft)
      .map((c) => c.salePrice / c.sqft);
    if (ppsf.length === 0) return null;
    const avg = ppsf.reduce((a, b) => a + b, 0) / ppsf.length;
    return Math.round(avg);
  }, [comps]);

  const hasCostInputs = purchasePrice > 0 || rehabCost > 0;

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

      {/* Profit Band Calculator */}
      <Collapsible open={profitPanelOpen} onOpenChange={setProfitPanelOpen}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Profit Calculator</span>
              {hasCostInputs && (
                <Badge variant="outline" className="text-[10px] ml-1">
                  {profitBand.mid >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-emerald-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-rose-600" />
                  )}
                  {formatCurrency(profitBand.mid)}
                </Badge>
              )}
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                profitPanelOpen && "rotate-180"
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="space-y-4">
            {/* Cost inputs */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="purchase-price" className="text-xs">
                  Purchase Price
                </Label>
                <Input
                  id="purchase-price"
                  type="number"
                  placeholder="250000"
                  value={purchasePrice || ""}
                  onChange={(e) => setPurchasePrice(Number(e.target.value) || 0)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rehab-cost" className="text-xs">
                  Rehab Cost
                </Label>
                <Input
                  id="rehab-cost"
                  type="number"
                  placeholder="50000"
                  value={rehabCost || ""}
                  onChange={(e) => setRehabCost(Number(e.target.value) || 0)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="holding-cost" className="text-xs">
                  Holding Costs
                </Label>
                <Input
                  id="holding-cost"
                  type="number"
                  placeholder="5000"
                  value={holdingCost || ""}
                  onChange={(e) => setHoldingCost(Number(e.target.value) || 0)}
                  className="h-9"
                />
                <p className="text-[10px] text-muted-foreground">
                  Insurance, taxes, utilities, loan interest
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="selling-cost" className="text-xs">
                  Selling Costs
                </Label>
                <Input
                  id="selling-cost"
                  type="number"
                  placeholder="15000"
                  value={sellingCost || ""}
                  onChange={(e) => setSellingCost(Number(e.target.value) || 0)}
                  className="h-9"
                />
                <p className="text-[10px] text-muted-foreground">
                  Agent fees, closing costs, staging
                </p>
              </div>
            </div>

            {/* Profit results */}
            {hasCostInputs && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Total Investment</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(purchasePrice + rehabCost + holdingCost)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Total Costs (incl. selling)</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(purchasePrice + rehabCost + holdingCost + sellingCost)}
                  </span>
                </div>
                
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <ProfitCard
                    label="Low Profit"
                    profit={profitBand.low}
                    roi={roiBand.low}
                  />
                  <ProfitCard
                    label="Mid Profit"
                    profit={profitBand.mid}
                    roi={roiBand.mid}
                    highlighted
                  />
                  <ProfitCard
                    label="High Profit"
                    profit={profitBand.high}
                    roi={roiBand.high}
                  />
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

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
                profitBand: hasCostInputs ? profitBand : undefined,
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

function ProfitCard({
  label,
  profit,
  roi,
  highlighted,
}: {
  label: string;
  profit: number;
  roi: number;
  highlighted?: boolean;
}) {
  const isPositive = profit >= 0;
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        highlighted
          ? "border-primary/30 bg-primary/5"
          : "border-border/80 bg-muted/40",
        !isPositive && "border-rose-200 bg-rose-50/50"
      )}
    >
      <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
      <p
        className={cn(
          "text-sm font-semibold",
          isPositive ? "text-emerald-700" : "text-rose-700"
        )}
      >
        {formatCurrency(profit)}
      </p>
      <p className="text-[10px] text-muted-foreground mt-0.5">
        {roi.toFixed(1)}% ROI
      </p>
    </div>
  );
}
