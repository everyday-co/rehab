import type { Comp } from "./types";

const BATCHDATA_API_KEY = process.env.BATCHDATA_API_KEY;
const BATCHDATA_BASE_URL = "https://api.batchdata.com/api/v1";
const USE_MOCKS = process.env.NODE_ENV === "development" && process.env.USE_ENRICHMENT_MOCKS === "true";

interface FetchCompsInput {
  address: string;
  city: string;
  state: string;
  zip?: string;
}

interface BatchDataComp {
  propertyAddress?: {
    streetAddress?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  salePrice?: number;
  squareFeet?: number;
  bedrooms?: number;
  bathrooms?: number;
  saleDate?: string;
  distance?: number; // miles
}

interface BatchDataCompsResponse {
  status: string;
  data?: {
    comps?: BatchDataComp[];
  };
  error?: string;
}

/**
 * Fetch comps from provider (BatchData) with safe fallbacks.
 * If mocks enabled or provider not configured, return mock comps.
 */
export async function fetchComps(input: FetchCompsInput, controller?: AbortController): Promise<Comp[]> {
  if (USE_MOCKS) {
    return createMockComps(input);
  }

  if (!BATCHDATA_API_KEY) {
    return [];
  }

  const params = new URLSearchParams({
    streetAddress: input.address,
    city: input.city,
    state: input.state,
    ...(input.zip ? { zip: input.zip } : {}),
  });

  try {
    const response = await fetch(`${BATCHDATA_BASE_URL}/property/comps?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${BATCHDATA_API_KEY}`,
        "Content-Type": "application/json",
      },
      signal: controller?.signal,
    });

    if (!response.ok) {
      return [];
    }

    const data: BatchDataCompsResponse = await response.json();
    if (data.status !== "success" || !data.data?.comps) {
      return [];
    }

    return data.data.comps
      .map(mapBatchDataComp)
      .filter((c): c is Comp => !!c);
  } catch (error) {
    // Timeout/abort or other errors fall back to empty
    return [];
  }
}

export function isCompsConfigured(): boolean {
  return !!BATCHDATA_API_KEY;
}

function mapBatchDataComp(comp: BatchDataComp | undefined): Comp | null {
  if (!comp) return null;
  if (!comp.salePrice || !comp.squareFeet) return null;

  const addr = comp.propertyAddress;
  return {
    address: addr?.streetAddress || "Unknown address",
    city: addr?.city || "",
    state: addr?.state || "",
    zip: addr?.zip,
    salePrice: comp.salePrice,
    sqft: comp.squareFeet,
    beds: comp.bedrooms,
    baths: comp.bathrooms,
    soldDate: comp.saleDate,
    distanceMiles: comp.distance,
  };
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

