import type { Comp } from "./types";

const BATCHDATA_API_KEY = process.env.BATCHDATA_API_KEY;
const USE_MOCKS = process.env.NODE_ENV === "development" && process.env.USE_ENRICHMENT_MOCKS === "true";

interface FetchCompsInput {
  address: string;
  city: string;
  state: string;
  zip?: string;
}

/** In real implementation, call provider comps endpoint. Here, return mocks when enabled. */
export async function fetchComps(input: FetchCompsInput): Promise<Comp[]> {
  if (USE_MOCKS) {
    return createMockComps(input);
  }

  if (!BATCHDATA_API_KEY) {
    return [];
  }

  // Placeholder: provider-specific comps endpoint not implemented. Return empty for now.
  return [];
}

export function isCompsConfigured(): boolean {
  return !!BATCHDATA_API_KEY;
}

export function createMockComps(_: FetchCompsInput): Comp[] {
  return [
    {
      address: "124 Test St",
      city: "Minneapolis",
      state: "MN",
      zip: "55401",
      salePrice: 420000,
      sqft: 2400,
      beds: 4,
      baths: 2.5,
      soldDate: "2024-06-01",
      distanceMiles: 0.4,
    },
    {
      address: "125 Test Ave",
      city: "Minneapolis",
      state: "MN",
      zip: "55401",
      salePrice: 395000,
      sqft: 2350,
      beds: 4,
      baths: 2,
      soldDate: "2024-05-20",
      distanceMiles: 0.7,
    },
    {
      address: "126 Oak Ln",
      city: "Minneapolis",
      state: "MN",
      zip: "55401",
      salePrice: 410000,
      sqft: 2500,
      beds: 5,
      baths: 3,
      soldDate: "2024-04-15",
      distanceMiles: 0.9,
    },
  ];
}

