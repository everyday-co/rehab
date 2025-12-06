/**
 * Tests for ARV suggestion engine
 */

import { describe, it, expect } from "vitest";
import {
  suggestARV,
  calculatePotentialProfit,
  validateARV,
  createMockARVSuggestion,
} from "@/lib/enrichment/arv-suggester";
import type { BatchDataResult, ListingData } from "@/lib/enrichment/types";

const mockSubjectProperty: BatchDataResult = {
  address: "123 Test St",
  city: "Minneapolis",
  state: "MN",
  zip: "55401",
  totalSqft: 2500,
  aboveGradeSqft: 1800,
  beds: 4,
  baths: 2.5,
  yearBuilt: 1995,
  lastSalePrice: 320000,
  lastSaleDate: "2020-06-15",
  taxAssessedValue: 350000,
};

describe("suggestARV", () => {
  it("returns null when sqft is missing", () => {
    const property: BatchDataResult = {
      address: "123 Test St",
      city: "Minneapolis",
      state: "MN",
      zip: "55401",
    };
    const result = suggestARV({ subjectProperty: property });
    expect(result).toBeNull();
  });

  it("generates ARV from last sale price", () => {
    const result = suggestARV({ subjectProperty: mockSubjectProperty });
    expect(result).not.toBeNull();
    expect(result!.low).toBeGreaterThan(0);
    expect(result!.mid).toBeGreaterThan(result!.low);
    expect(result!.high).toBeGreaterThan(result!.mid);
  });

  it("incorporates zestimate from listing", () => {
    const listing: ListingData = {
      zestimate: 380000,
    };
    const result = suggestARV({
      subjectProperty: mockSubjectProperty,
      listing,
    });
    expect(result).not.toBeNull();
    // ARV should be influenced by zestimate
    expect(result!.mid).toBeGreaterThan(0);
  });

  it("applies rehab premium based on level", () => {
    const cosmeticResult = suggestARV({
      subjectProperty: mockSubjectProperty,
      rehabLevel: "cosmetic",
    });
    const gutRehabResult = suggestARV({
      subjectProperty: mockSubjectProperty,
      rehabLevel: "gut-rehab",
    });

    // Gut rehab should have higher ARV due to higher premium
    expect(gutRehabResult!.mid).toBeGreaterThan(cosmeticResult!.mid);
  });

  it("increases confidence with user comps", () => {
    const withoutComps = suggestARV({
      subjectProperty: mockSubjectProperty,
    });

    const withComps = suggestARV({
      subjectProperty: mockSubjectProperty,
      userComps: [
        { address: "124 Test St", salePrice: 380000, sqft: 2400 },
        { address: "125 Test St", salePrice: 395000, sqft: 2600 },
        { address: "126 Test St", salePrice: 370000, sqft: 2350 },
      ],
    });

    expect(withComps!.confidence).not.toBe("low");
    expect(withComps!.compsUsed).toBe(3);
  });
});

describe("calculatePotentialProfit", () => {
  it("calculates profit correctly", () => {
    const arvSuggestion = createMockARVSuggestion(2500);
    const result = calculatePotentialProfit(
      300000, // purchase
      50000,  // rehab
      10000,  // holding
      20000,  // selling
      arvSuggestion
    );

    const totalCosts = 300000 + 50000 + 10000 + 20000;
    expect(result.mid).toBe(arvSuggestion.mid - totalCosts);
  });

  it("calculates ROI correctly", () => {
    const arvSuggestion = {
      low: 400000,
      mid: 450000,
      high: 500000,
      pricePerSqftRange: { low: 160, avg: 180, high: 200 },
      compsUsed: 0,
      confidence: "low" as const,
    };

    const totalCosts = 300000 + 50000 + 10000 + 20000; // 380000
    const result = calculatePotentialProfit(
      300000,
      50000,
      10000,
      20000,
      arvSuggestion
    );

    // Mid profit = 450000 - 380000 = 70000
    // Mid ROI = 70000 / 380000 * 100 = 18.42%
    expect(result.roi.mid).toBeCloseTo(18.42, 1);
  });
});

describe("validateARV", () => {
  it("returns reasonable for ARV within comp range", () => {
    const arvSuggestion = createMockARVSuggestion(2500);
    const comps = [
      { address: "124 Test St", salePrice: 440000, sqft: 2400, soldDate: "2024-06-01" },
      { address: "125 Test St", salePrice: 460000, sqft: 2600, soldDate: "2024-05-15" },
    ];

    const result = validateARV(arvSuggestion, comps);
    expect(result.isReasonable).toBe(true);
  });

  it("warns when ARV deviates significantly from comps", () => {
    const arvSuggestion = {
      low: 600000,
      mid: 650000,
      high: 700000,
      pricePerSqftRange: { low: 240, avg: 260, high: 280 },
      compsUsed: 0,
      confidence: "low" as const,
    };

    const comps = [
      { address: "124 Test St", salePrice: 350000, sqft: 2400, soldDate: "2024-06-01" },
      { address: "125 Test St", salePrice: 360000, sqft: 2600, soldDate: "2024-05-15" },
    ];

    const result = validateARV(arvSuggestion, comps);
    expect(result.isReasonable).toBe(false);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("warns about stale comps", () => {
    const arvSuggestion = createMockARVSuggestion(2500);
    const comps = [
      { address: "124 Test St", salePrice: 440000, sqft: 2400, soldDate: "2023-01-01" },
      { address: "125 Test St", salePrice: 460000, sqft: 2600, soldDate: "2023-02-15" },
    ];

    const result = validateARV(arvSuggestion, comps);
    expect(result.warnings.some(w => w.includes("older than 6 months"))).toBe(true);
  });
});

describe("createMockARVSuggestion", () => {
  it("creates valid mock data", () => {
    const mock = createMockARVSuggestion(2000);
    expect(mock.low).toBeGreaterThan(0);
    expect(mock.mid).toBeGreaterThan(mock.low);
    expect(mock.high).toBeGreaterThan(mock.mid);
    expect(mock.confidence).toBe("low");
  });
});

