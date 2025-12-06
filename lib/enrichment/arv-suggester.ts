/**
 * ARV (After Repair Value) suggestion engine
 * V1: Uses subject property history + user-entered comps
 */

import type { BatchDataResult, ARVSuggestion, ListingData } from "./types";

interface Comp {
  address: string;
  salePrice: number;
  sqft: number;
  beds?: number;
  baths?: number;
  soldDate?: string;
}

interface ARVInput {
  /** Subject property data from BatchData */
  subjectProperty: BatchDataResult;
  /** Listing data if available */
  listing?: ListingData | null;
  /** User-provided comp sales */
  userComps?: Comp[];
  /** Assumed rehab quality level */
  rehabLevel?: "cosmetic" | "moderate" | "major" | "gut-rehab";
}

/**
 * Generate ARV suggestion based on available data
 */
export function suggestARV(input: ARVInput): ARVSuggestion | null {
  const { subjectProperty, listing, userComps = [], rehabLevel = "moderate" } = input;

  // Need sqft to calculate price per sqft
  const sqft = subjectProperty.totalSqft || subjectProperty.aboveGradeSqft;
  if (!sqft) {
    return null;
  }

  // Collect all price points we can use
  const pricePoints: { price: number; sqft: number; source: string }[] = [];

  // 1. Use user-provided comps (highest priority)
  for (const comp of userComps) {
    if (comp.salePrice && comp.sqft) {
      pricePoints.push({
        price: comp.salePrice,
        sqft: comp.sqft,
        source: "user_comp",
      });
    }
  }

  // 2. Use Zestimate from listing if available
  if (listing?.zestimate) {
    pricePoints.push({
      price: listing.zestimate,
      sqft,
      source: "zestimate",
    });
  }

  // 3. Use price history from listing
  if (listing?.priceHistory) {
    // Get most recent sale
    const recentSales = listing.priceHistory
      .filter((h) => h.event.toLowerCase().includes("sold"))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (recentSales[0]) {
      pricePoints.push({
        price: recentSales[0].price,
        sqft,
        source: "listing_history",
      });
    }
  }

  // 4. Use last/prior sale from BatchData
  if (subjectProperty.lastSalePrice) {
    pricePoints.push({
      price: subjectProperty.lastSalePrice,
      sqft,
      source: "last_sale",
    });
  }

  if (subjectProperty.priorSalePrice) {
    pricePoints.push({
      price: subjectProperty.priorSalePrice,
      sqft,
      source: "prior_sale",
    });
  }

  // 5. Use tax assessed value as a floor reference
  if (subjectProperty.taxAssessedValue) {
    pricePoints.push({
      price: subjectProperty.taxAssessedValue,
      sqft,
      source: "tax_assessed",
    });
  }

  // Need at least one price point
  if (pricePoints.length === 0) {
    return null;
  }

  // Calculate price per sqft for each point
  const pricesPerSqft = pricePoints.map((p) => p.price / p.sqft);

  // Apply rehab premium based on level
  const rehabPremiums: Record<string, number> = {
    cosmetic: 1.05, // 5% premium
    moderate: 1.12, // 12% premium
    major: 1.20, // 20% premium
    "gut-rehab": 1.30, // 30% premium
  };
  const premium = rehabPremiums[rehabLevel] || 1.12;

  // Calculate statistics
  const sortedPrices = [...pricesPerSqft].sort((a, b) => a - b);
  const avgPricePerSqft = pricesPerSqft.reduce((a, b) => a + b, 0) / pricesPerSqft.length;
  const lowPricePerSqft = percentile(sortedPrices, 25);
  const highPricePerSqft = percentile(sortedPrices, 75);

  // Apply premium to get ARV estimates
  const adjustedAvg = avgPricePerSqft * premium;
  const adjustedLow = lowPricePerSqft * premium;
  const adjustedHigh = highPricePerSqft * premium;

  // Calculate final ARV values
  const arvLow = Math.round((sqft * adjustedLow) / 1000) * 1000;
  const arvMid = Math.round((sqft * adjustedAvg) / 1000) * 1000;
  const arvHigh = Math.round((sqft * adjustedHigh) / 1000) * 1000;

  // Determine confidence based on data quality
  let confidence: "high" | "medium" | "low" = "low";

  // High confidence: Have user comps or multiple data sources
  if (userComps.length >= 3) {
    confidence = "high";
  } else if (userComps.length >= 1 || pricePoints.length >= 3) {
    confidence = "medium";
  }

  return {
    low: arvLow,
    mid: arvMid,
    high: arvHigh,
    pricePerSqftRange: {
      low: Math.round(adjustedLow),
      avg: Math.round(adjustedAvg),
      high: Math.round(adjustedHigh),
    },
    compsUsed: userComps.length,
    confidence,
  };
}

/**
 * Calculate percentile value from sorted array
 */
function percentile(sortedArr: number[], p: number): number {
  if (sortedArr.length === 0) return 0;
  if (sortedArr.length === 1) return sortedArr[0];

  const index = (p / 100) * (sortedArr.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  if (lower === upper) {
    return sortedArr[lower];
  }

  return sortedArr[lower] + (sortedArr[upper] - sortedArr[lower]) * (index - lower);
}

/**
 * Calculate potential profit based on ARV and costs
 */
export function calculatePotentialProfit(
  purchasePrice: number,
  rehabCost: number,
  holdingCosts: number,
  sellingCosts: number,
  arvSuggestion: ARVSuggestion
): {
  low: number;
  mid: number;
  high: number;
  roi: { low: number; mid: number; high: number };
} {
  const totalInvestment = purchasePrice + rehabCost + holdingCosts + sellingCosts;

  const profitLow = arvSuggestion.low - totalInvestment;
  const profitMid = arvSuggestion.mid - totalInvestment;
  const profitHigh = arvSuggestion.high - totalInvestment;

  return {
    low: profitLow,
    mid: profitMid,
    high: profitHigh,
    roi: {
      low: (profitLow / totalInvestment) * 100,
      mid: (profitMid / totalInvestment) * 100,
      high: (profitHigh / totalInvestment) * 100,
    },
  };
}

/**
 * Validate ARV against comps - check if it's reasonable
 */
export function validateARV(
  arvSuggestion: ARVSuggestion,
  comps: Comp[]
): {
  isReasonable: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  if (comps.length === 0) {
    warnings.push("No comparable sales provided - ARV estimate may be less accurate");
    return { isReasonable: true, warnings };
  }

  // Calculate comp price per sqft range
  const compPricesPerSqft = comps
    .filter((c) => c.salePrice && c.sqft)
    .map((c) => c.salePrice / c.sqft);

  if (compPricesPerSqft.length === 0) {
    warnings.push("Comps missing sqft data - unable to validate");
    return { isReasonable: true, warnings };
  }

  const avgCompPricePerSqft = compPricesPerSqft.reduce((a, b) => a + b, 0) / compPricesPerSqft.length;

  // Check if ARV $/sqft is within reasonable range of comps
  const arvAvgPricePerSqft = arvSuggestion.pricePerSqftRange.avg;
  const deviation = Math.abs(arvAvgPricePerSqft - avgCompPricePerSqft) / avgCompPricePerSqft;

  if (deviation > 0.3) {
    warnings.push(
      `ARV price/sqft ($${arvAvgPricePerSqft}) differs significantly from comps ($${Math.round(avgCompPricePerSqft)})`
    );
  }

  // Check for stale comps (older than 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const staleComps = comps.filter((c) => c.soldDate && new Date(c.soldDate) < sixMonthsAgo);
  if (staleComps.length > comps.length / 2) {
    warnings.push("More than half of comps are older than 6 months - consider finding fresher sales");
  }

  return {
    isReasonable: deviation <= 0.3,
    warnings,
  };
}

/**
 * Create mock ARV suggestion for testing
 */
export function createMockARVSuggestion(sqft: number = 2500): ARVSuggestion {
  const basePricePerSqft = 180;
  
  return {
    low: Math.round((sqft * basePricePerSqft * 0.9) / 1000) * 1000,
    mid: Math.round((sqft * basePricePerSqft) / 1000) * 1000,
    high: Math.round((sqft * basePricePerSqft * 1.1) / 1000) * 1000,
    pricePerSqftRange: {
      low: Math.round(basePricePerSqft * 0.9),
      avg: basePricePerSqft,
      high: Math.round(basePricePerSqft * 1.1),
    },
    compsUsed: 0,
    confidence: "low",
  };
}

