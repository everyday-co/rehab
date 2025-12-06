/**
 * Tests for enrichment data merging
 */

import { describe, it, expect } from "vitest";
import {
  mergeEnrichmentData,
  detectChanges,
  formatCurrency,
  formatSqft,
} from "@/lib/enrichment/merge";
import type { BatchDataResult, ListingData, EnrichmentStatus } from "@/lib/enrichment/types";

const mockBatchData: BatchDataResult = {
  address: "123 Test St",
  city: "Minneapolis",
  state: "MN",
  zip: "55401",
  totalSqft: 2500,
  aboveGradeSqft: 1800,
  basementSqft: 700,
  beds: 4,
  baths: 2.5,
  garageSpaces: 2,
  lotAcres: 0.25,
  yearBuilt: 1995,
  lastSalePrice: 320000,
  lastSaleDate: "2020-06-15",
};

const mockListing: ListingData = {
  description: "Beautiful 4-bedroom home with updates",
  listPrice: 350000,
  status: "Active",
  daysOnMarket: 14,
  features: ["Updated Kitchen", "New HVAC"],
};

const successStatus: EnrichmentStatus = {
  batchdata: "success",
  firecrawl: "success",
  photos: "success",
};

describe("mergeEnrichmentData", () => {
  it("maps BatchData to property form values", () => {
    const result = mergeEnrichmentData({
      batchData: mockBatchData,
      status: { batchdata: "success", firecrawl: "skipped", photos: "skipped" },
    });

    expect(result.property.address).toBe("123 Test St");
    expect(result.property.city).toBe("Minneapolis");
    expect(result.property.state).toBe("MN");
    expect(result.property.zip).toBe("55401");
    expect(result.property.sqft).toBe(2500);
    expect(result.property.beds).toBe(4);
    expect(result.property.baths).toBe(2.5);
  });

  it("includes last sale as purchase price", () => {
    const result = mergeEnrichmentData({
      batchData: mockBatchData,
      status: { batchdata: "success", firecrawl: "skipped", photos: "skipped" },
    });

    expect(result.property.purchasePrice).toBe(320000);
    expect(result.property.purchaseDate).toBe("2020-06-15");
  });

  it("uses list price when no sale history", () => {
    const batchDataNoSale: BatchDataResult = {
      ...mockBatchData,
      lastSalePrice: undefined,
      lastSaleDate: undefined,
    };

    const result = mergeEnrichmentData({
      batchData: batchDataNoSale,
      listing: mockListing,
      status: successStatus,
    });

    expect(result.property.purchasePrice).toBe(350000);
  });

  it("combines listing description and features into notes", () => {
    const result = mergeEnrichmentData({
      batchData: mockBatchData,
      listing: mockListing,
      status: successStatus,
    });

    expect(result.property.notes).toContain("Beautiful 4-bedroom home");
    expect(result.property.notes).toContain("Updated Kitchen");
    expect(result.property.notes).toContain("New HVAC");
  });

  it("calculates confidence based on data quality", () => {
    const fullDataResult = mergeEnrichmentData({
      batchData: mockBatchData,
      listing: mockListing,
      photos: [{ url: "test.jpg", isMain: true }],
      status: successStatus,
    });

    const partialDataResult = mergeEnrichmentData({
      batchData: { address: "123 Test", city: "Mpls", state: "MN", zip: "55401" },
      status: { batchdata: "partial", firecrawl: "skipped", photos: "skipped" },
    });

    expect(fullDataResult.confidence).toBeGreaterThan(partialDataResult.confidence);
  });

  it("handles null/undefined inputs gracefully", () => {
    const result = mergeEnrichmentData({
      batchData: null,
      listing: null,
      photos: [],
      status: { batchdata: "failed", firecrawl: "failed", photos: "skipped" },
    });

    expect(result.property).toEqual({});
    expect(result.confidence).toBe(0);
  });
});

describe("detectChanges", () => {
  it("detects changed fields", () => {
    const existing = { address: "123 Main St", sqft: 2000 };
    const enriched = { address: "123 Main St", sqft: 2500 };

    const changes = detectChanges(existing, enriched);

    expect(changes).toHaveLength(1);
    expect(changes[0]).toEqual({
      field: "sqft",
      existing: 2000,
      enriched: 2500,
    });
  });

  it("ignores unchanged fields", () => {
    const existing = { address: "123 Main St", sqft: 2500 };
    const enriched = { address: "123 Main St", sqft: 2500 };

    const changes = detectChanges(existing, enriched);
    expect(changes).toHaveLength(0);
  });

  it("detects null to value changes", () => {
    const existing = { beds: null };
    const enriched = { beds: 4 };

    const changes = detectChanges(existing, enriched);
    expect(changes).toHaveLength(1);
    expect(changes[0].field).toBe("beds");
  });
});

describe("formatCurrency", () => {
  it("formats currency correctly", () => {
    expect(formatCurrency(350000)).toBe("$350,000");
    expect(formatCurrency(1250000)).toBe("$1,250,000");
  });

  it("handles null/undefined", () => {
    expect(formatCurrency(null)).toBe("N/A");
    expect(formatCurrency(undefined)).toBe("N/A");
  });
});

describe("formatSqft", () => {
  it("formats sqft correctly", () => {
    expect(formatSqft(2500)).toBe("2,500 sqft");
    expect(formatSqft(10000)).toBe("10,000 sqft");
  });

  it("handles null/undefined", () => {
    expect(formatSqft(null)).toBe("N/A");
    expect(formatSqft(undefined)).toBe("N/A");
  });
});

