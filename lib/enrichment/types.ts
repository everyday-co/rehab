/**
 * Enrichment types for property data intake
 */

import type { PropertyFormValues } from "@/lib/validations";

/** Input for enrichment - either address or listing URL */
export interface EnrichmentInput {
  address?: string;
  listingUrl?: string;
}

/** Status of individual enrichment source */
export type SourceStatus = "success" | "failed" | "partial" | "skipped";

/** Overall enrichment status for each source */
export interface EnrichmentStatus {
  batchdata: SourceStatus;
  firecrawl: SourceStatus;
  photos: SourceStatus;
}

/** Data from BatchData property lookup */
export interface BatchDataResult {
  // Core address
  address: string;
  city: string;
  state: string;
  zip: string;
  county?: string;

  // Property details
  totalSqft?: number;
  aboveGradeSqft?: number;
  basementSqft?: number;
  beds?: number;
  baths?: number;
  garageSpaces?: number;
  lotAcres?: number;
  yearBuilt?: number;

  // Tax & valuation
  taxAssessedValue?: number;
  taxAmount?: number;
  lastSalePrice?: number;
  lastSaleDate?: string;
  priorSalePrice?: number;
  priorSaleDate?: string;

  // Owner info (for off-market deals)
  ownerName?: string;
  ownerOccupied?: boolean;

  // Geo
  latitude?: number;
  longitude?: number;
}

/** Data scraped from listing (Zillow/Redfin/Realtor) */
export interface ListingData {
  description?: string;
  listPrice?: number;
  status?: string; // "Active" | "Pending" | "Sold" | "Off-Market"
  daysOnMarket?: number;
  features?: string[];
  listingAgent?: string;
  listingBrokerage?: string;
  mlsNumber?: string;
  zestimate?: number;
  rentZestimate?: number;
  priceHistory?: PriceHistoryEntry[];
}

/** Price history entry from listing */
export interface PriceHistoryEntry {
  date: string;
  price: number;
  event: string;
}

/** Comparable sale */
export interface Comp {
  address: string;
  city: string;
  state: string;
  zip?: string;
  salePrice: number;
  sqft: number;
  beds?: number;
  baths?: number;
  soldDate?: string;
  distanceMiles?: number;
}

/** Photo data from listing */
export interface PhotoData {
  url: string;
  thumbnailUrl?: string;
  room?: string;
  isMain?: boolean;
}

/** ARV suggestion with confidence */
export interface ARVSuggestion {
  low: number;
  mid: number;
  high: number;
  pricePerSqftRange: {
    low: number;
    avg: number;
    high: number;
  };
  compsUsed: number;
  confidence: "high" | "medium" | "low";
  /** Stress percentage applied, if any */
  stressPct?: number;
}

/** Complete enrichment result */
export interface EnrichmentResult {
  /** Property data mapped to form values */
  property: Partial<PropertyFormValues>;
  /** Raw BatchData result */
  batchData: BatchDataResult | null;
  /** Listing data if URL provided */
  listing: ListingData | null;
  /** Photo URLs */
  photos: PhotoData[];
  /** Comparable sales */
  comps?: Comp[];
  /** ARV validation warnings */
  arvWarnings?: string[];
  /** ARV suggestion if available */
  arvSuggestion: ARVSuggestion | null;
  /** Status of each source */
  status: EnrichmentStatus;
  /** Overall confidence score 0-100 */
  confidence: number;
  /** Whether property already exists */
  duplicate?: {
    exists: boolean;
    existingPropertyId?: string;
  };
}

/** Supported listing domains */
export const SUPPORTED_DOMAINS = {
  "zillow.com": { name: "Zillow", enabled: true },
  "www.zillow.com": { name: "Zillow", enabled: true },
  "redfin.com": { name: "Redfin", enabled: true },
  "www.redfin.com": { name: "Redfin", enabled: true },
  "realtor.com": { name: "Realtor.com", enabled: true },
  "www.realtor.com": { name: "Realtor.com", enabled: true },
} as const;

export type SupportedDomain = keyof typeof SUPPORTED_DOMAINS;

/** Check if a URL is from a supported domain */
export function isSupportedListingUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    return hostname in SUPPORTED_DOMAINS;
  } catch {
    return false;
  }
}

/** Get domain info from URL */
export function getListingDomain(url: string): { domain: SupportedDomain; name: string } | null {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase() as SupportedDomain;
    if (hostname in SUPPORTED_DOMAINS) {
      return { domain: hostname, name: SUPPORTED_DOMAINS[hostname].name };
    }
    return null;
  } catch {
    return null;
  }
}

