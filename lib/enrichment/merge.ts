/**
 * Merge and map enrichment data from multiple sources
 */

import type { PropertyFormValues } from "@/lib/validations";
import type {
  BatchDataResult,
  ListingData,
  PhotoData,
  EnrichmentResult,
  EnrichmentStatus,
  ARVSuggestion,
} from "./types";

interface MergeInput {
  batchData?: BatchDataResult | null;
  listing?: ListingData | null;
  photos?: PhotoData[];
  arvSuggestion?: ARVSuggestion | null;
  status: EnrichmentStatus;
}

/**
 * Merge enrichment sources into a single result
 * Priority: BatchData > Listing (for property details)
 */
export function mergeEnrichmentData(input: MergeInput): EnrichmentResult {
  const { batchData, listing, photos = [], arvSuggestion = null, status } = input;

  // Map to PropertyFormValues
  const property: Partial<PropertyFormValues> = {};

  // Address - BatchData is authoritative
  if (batchData) {
    property.address = batchData.address;
    property.city = batchData.city;
    property.state = batchData.state;
    property.zip = batchData.zip;
  }

  // Property details - BatchData is authoritative, listing as fallback
  property.sqft = batchData?.totalSqft ?? undefined;
  property.sqftAboveGrade = batchData?.aboveGradeSqft ?? undefined;
  property.sqftBasement = batchData?.basementSqft ?? undefined;
  property.beds = batchData?.beds ?? undefined;
  property.baths = batchData?.baths ?? undefined;
  property.garageSpaces = batchData?.garageSpaces ?? undefined;
  property.lotAcres = batchData?.lotAcres ?? undefined;
  property.yearBuilt = batchData?.yearBuilt ?? undefined;

  // Financial - use last sale as potential purchase price hint
  if (batchData?.lastSalePrice) {
    property.purchasePrice = batchData.lastSalePrice;
    if (batchData.lastSaleDate) {
      property.purchaseDate = batchData.lastSaleDate;
    }
  } else if (listing?.listPrice) {
    // If no sale history, use list price as reference
    property.purchasePrice = listing.listPrice;
  }

  // Notes - combine listing description and features
  if (listing) {
    const notes: string[] = [];
    
    if (listing.description) {
      notes.push(listing.description);
    }
    
    if (listing.features && listing.features.length > 0) {
      notes.push(`\nFeatures: ${listing.features.join(", ")}`);
    }
    
    if (listing.status) {
      notes.push(`\nListing Status: ${listing.status}`);
    }
    
    if (listing.daysOnMarket !== undefined) {
      notes.push(`Days on Market: ${listing.daysOnMarket}`);
    }

    property.notes = notes.join("\n").trim() || undefined;
  }

  // Calculate confidence
  const confidence = calculateConfidence(batchData, listing, status);

  return {
    property,
    batchData: batchData || null,
    listing: listing || null,
    photos,
    arvSuggestion,
    status,
    confidence,
  };
}

/**
 * Calculate confidence score 0-100 based on data quality
 */
function calculateConfidence(
  batchData: BatchDataResult | null | undefined,
  listing: ListingData | null | undefined,
  status: EnrichmentStatus
): number {
  let score = 0;
  const maxScore = 100;

  // BatchData success is worth 50 points
  if (status.batchdata === "success" && batchData) {
    score += 30;

    // Bonus points for having key data
    if (batchData.address) score += 5;
    if (batchData.totalSqft) score += 5;
    if (batchData.beds && batchData.baths) score += 5;
    if (batchData.yearBuilt) score += 3;
    if (batchData.lastSalePrice) score += 2;
  } else if (status.batchdata === "partial") {
    score += 15;
  }

  // Listing success is worth 30 points
  if (status.firecrawl === "success" && listing) {
    score += 15;

    if (listing.description) score += 5;
    if (listing.listPrice) score += 5;
    if (listing.features && listing.features.length > 0) score += 3;
    if (listing.priceHistory && listing.priceHistory.length > 0) score += 2;
  } else if (status.firecrawl === "partial") {
    score += 10;
  }

  // Photos are worth 10 points
  if (status.photos === "success") {
    score += 10;
  } else if (status.photos === "partial") {
    score += 5;
  }

  return Math.min(score, maxScore);
}

/**
 * Check if enrichment data has changed from existing property
 */
export function detectChanges(
  existing: Partial<PropertyFormValues>,
  enriched: Partial<PropertyFormValues>
): { field: string; existing: unknown; enriched: unknown }[] {
  const changes: { field: string; existing: unknown; enriched: unknown }[] = [];

  const fields: (keyof PropertyFormValues)[] = [
    "address",
    "city",
    "state",
    "zip",
    "sqft",
    "sqftAboveGrade",
    "sqftBasement",
    "beds",
    "baths",
    "garageSpaces",
    "lotAcres",
    "yearBuilt",
    "purchasePrice",
  ];

  for (const field of fields) {
    const existingValue = existing[field];
    const enrichedValue = enriched[field];

    // Skip if both are null/undefined
    if (existingValue == null && enrichedValue == null) continue;

    // Detect change
    if (existingValue !== enrichedValue) {
      changes.push({
        field,
        existing: existingValue,
        enriched: enrichedValue,
      });
    }
  }

  return changes;
}

/**
 * Helper to format currency values
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Helper to format sqft values
 */
export function formatSqft(value: number | null | undefined): string {
  if (value == null) return "N/A";
  return new Intl.NumberFormat("en-US").format(value) + " sqft";
}

