/**
 * Firecrawl API wrapper for scraping listing pages
 * Uses the Firecrawl MCP tool or direct API
 */

import type { ListingData, PhotoData, SupportedDomain } from "./types";

const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const FIRECRAWL_BASE_URL = "https://api.firecrawl.dev/v1";

interface FirecrawlExtractResponse {
  success: boolean;
  data?: {
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    listPrice?: number;
    status?: string;
    daysOnMarket?: number;
    beds?: number;
    baths?: number;
    sqft?: number;
    lotSize?: string;
    yearBuilt?: number;
    description?: string;
    features?: string[];
    photoUrls?: string[];
    listingAgent?: string;
    listingBrokerage?: string;
    mlsNumber?: string;
    zestimate?: number;
    rentZestimate?: number;
    priceHistory?: Array<{
      date: string;
      price: number;
      event: string;
    }>;
  };
  error?: string;
}

export class FirecrawlError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "FirecrawlError";
  }
}

/**
 * Check if Firecrawl is configured
 */
export function isFirecrawlConfigured(): boolean {
  return !!FIRECRAWL_API_KEY;
}

/**
 * Listing extraction schema for Firecrawl
 */
const LISTING_SCHEMA = {
  type: "object",
  properties: {
    streetAddress: { type: "string" },
    city: { type: "string" },
    state: { type: "string" },
    zipCode: { type: "string" },
    listPrice: { type: "number" },
    status: { type: "string" },
    daysOnMarket: { type: "number" },
    beds: { type: "number" },
    baths: { type: "number" },
    sqft: { type: "number" },
    lotSize: { type: "string" },
    yearBuilt: { type: "number" },
    description: { type: "string" },
    features: { type: "array", items: { type: "string" } },
    photoUrls: { type: "array", items: { type: "string" } },
    listingAgent: { type: "string" },
    listingBrokerage: { type: "string" },
    mlsNumber: { type: "string" },
    zestimate: { type: "number" },
    rentZestimate: { type: "number" },
    priceHistory: {
      type: "array",
      items: {
        type: "object",
        properties: {
          date: { type: "string" },
          price: { type: "number" },
          event: { type: "string" },
        },
      },
    },
  },
};

/**
 * Get domain-specific extraction prompt
 */
function getExtractionPrompt(domain: SupportedDomain): string {
  const basePrompt = "Extract all property listing details including address, price, beds, baths, sqft, description, features, and all photo URLs.";
  
  const domainPrompts: Record<string, string> = {
    "zillow.com": `${basePrompt} Also extract the Zestimate and Rent Zestimate if available.`,
    "www.zillow.com": `${basePrompt} Also extract the Zestimate and Rent Zestimate if available.`,
    "redfin.com": `${basePrompt} Also extract the Redfin estimate if available.`,
    "www.redfin.com": `${basePrompt} Also extract the Redfin estimate if available.`,
    "realtor.com": basePrompt,
    "www.realtor.com": basePrompt,
  };

  return domainPrompts[domain] || basePrompt;
}

/**
 * Scrape and extract listing data from a URL
 */
export async function extractListingData(
  url: string,
  domain: SupportedDomain
): Promise<{
  listing: ListingData;
  photos: PhotoData[];
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}> {
  if (!FIRECRAWL_API_KEY) {
    throw new FirecrawlError("Firecrawl API key not configured");
  }

  const response = await fetch(`${FIRECRAWL_BASE_URL}/extract`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      urls: [url],
      prompt: getExtractionPrompt(domain),
      schema: LISTING_SCHEMA,
    }),
  });

  if (!response.ok) {
    throw new FirecrawlError(
      `Firecrawl API error: ${response.statusText}`,
      response.status
    );
  }

  const result: FirecrawlExtractResponse = await response.json();

  if (!result.success || !result.data) {
    throw new FirecrawlError(result.error || "Failed to extract listing data");
  }

  const data = result.data;

  // Map to our types
  const listing: ListingData = {
    description: data.description,
    listPrice: data.listPrice,
    status: data.status,
    daysOnMarket: data.daysOnMarket,
    features: data.features,
    listingAgent: data.listingAgent,
    listingBrokerage: data.listingBrokerage,
    mlsNumber: data.mlsNumber,
    zestimate: data.zestimate,
    rentZestimate: data.rentZestimate,
    priceHistory: data.priceHistory,
  };

  // Map photos
  const photos: PhotoData[] = (data.photoUrls || []).map((url, index) => ({
    url,
    isMain: index === 0,
  }));

  // Extract address if available
  const address = data.streetAddress
    ? {
        street: data.streetAddress,
        city: data.city || "",
        state: data.state || "",
        zip: data.zipCode || "",
      }
    : undefined;

  return { listing, photos, address };
}

/**
 * Simple scrape to get page content (fallback)
 */
export async function scrapeUrl(url: string): Promise<{ markdown: string; html: string }> {
  if (!FIRECRAWL_API_KEY) {
    throw new FirecrawlError("Firecrawl API key not configured");
  }

  const response = await fetch(`${FIRECRAWL_BASE_URL}/scrape`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      formats: ["markdown", "html"],
    }),
  });

  if (!response.ok) {
    throw new FirecrawlError(
      `Firecrawl scrape error: ${response.statusText}`,
      response.status
    );
  }

  const result = await response.json();

  return {
    markdown: result.data?.markdown || "",
    html: result.data?.html || "",
  };
}

/**
 * Create mock listing data for testing/development
 */
export function createMockListingData(overrides?: Partial<ListingData>): ListingData {
  return {
    description: "Beautiful 4-bedroom home with updated kitchen, hardwood floors, and finished basement. New HVAC system installed in 2023.",
    listPrice: 350000,
    status: "Active",
    daysOnMarket: 14,
    features: [
      "Updated Kitchen",
      "Hardwood Floors", 
      "Finished Basement",
      "New HVAC (2023)",
      "2-Car Garage",
    ],
    listingAgent: "Jane Smith",
    listingBrokerage: "Example Realty",
    mlsNumber: "123456",
    zestimate: 345000,
    rentZestimate: 2200,
    priceHistory: [
      { date: "2024-01-15", price: 350000, event: "Listed" },
      { date: "2020-06-01", price: 320000, event: "Sold" },
    ],
    ...overrides,
  };
}

/**
 * Create mock photos for testing/development
 */
export function createMockPhotos(): PhotoData[] {
  return [
    { url: "https://example.com/photo1.jpg", isMain: true },
    { url: "https://example.com/photo2.jpg" },
    { url: "https://example.com/photo3.jpg" },
    { url: "https://example.com/photo4.jpg" },
    { url: "https://example.com/photo5.jpg" },
  ];
}

