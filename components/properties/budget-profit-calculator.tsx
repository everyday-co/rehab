"use client";

import { ArvWhatIf, ProfitBandInputs } from "./arv-whatif";
import type { ARVSuggestion } from "@/lib/enrichment/types";

interface BudgetProfitCalculatorProps {
  arvLow: number | null;
  arvHigh: number | null;
  purchasePrice: number | null;
  rehabCostLow: number;
  rehabCostHigh: number;
}

export function BudgetProfitCalculator({
  arvLow,
  arvHigh,
  purchasePrice,
  rehabCostLow,
  rehabCostHigh,
}: BudgetProfitCalculatorProps) {
  // Construct ARV suggestion from property data
  if (!arvLow || !arvHigh) return null;

  const arvMid = Math.round((arvLow + arvHigh) / 2 / 1000) * 1000;
  const avgRehabCost = Math.round((rehabCostLow + rehabCostHigh) / 2);

  const arv: ARVSuggestion = {
    low: arvLow,
    mid: arvMid,
    high: arvHigh,
    pricePerSqftRange: { low: 0, avg: 0, high: 0 },
    compsUsed: 0,
    confidence: "medium",
  };

  const initialInputs: Partial<ProfitBandInputs> = {
    purchasePrice: purchasePrice ?? 0,
    rehabCost: avgRehabCost,
  };

  return (
    <ArvWhatIf
      arv={arv}
      comps={[]}
      initialInputs={initialInputs}
    />
  );
}

