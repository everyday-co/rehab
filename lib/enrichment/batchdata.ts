/**
 * BatchData API wrapper for property lookups
 * https://batchdata.com/api
 */

import type { BatchDataResult } from "./types";

const BATCHDATA_API_KEY = process.env.BATCHDATA_API_KEY;
const BATCHDATA_BASE_URL = "https://api.batchdata.com/api/v1";

interface BatchDataApiResponse {
  status: string;
  data?: {
    // Address fields
    propertyAddress?: {
      streetAddress?: string;
      city?: string;
      state?: string;
      zip?: string;
      county?: string;
    };
    // Property details
    buildingInfo?: {
      totalSquareFeet?: number;
      livingSquareFeet?: number;
      basementSquareFeet?: number;
      bedrooms?: number;
      bathrooms?: number;
      garageSpaces?: number;
      yearBuilt?: number;
    };
    // Lot info
    lotInfo?: {
      lotAcreage?: number;
      lotSquareFeet?: number;
    };
    // Tax info
    taxInfo?: {
      assessedValue?: number;
      taxAmount?: number;
      taxYear?: number;
    };
    // Sales history
    lastSale?: {
      salePrice?: number;
      saleDate?: string;
    };
    priorSale?: {
      salePrice?: number;
      saleDate?: string;
    };
    // Owner info
    ownerInfo?: {
      ownerName?: string;
      ownerOccupied?: boolean;
    };
    // Geo
    geo?: {
      latitude?: number;
      longitude?: number;
    };
  };
  error?: string;
}

export class BatchDataError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "BatchDataError";
  }
}

/**
 * Check if BatchData is configured
 */
export function isBatchDataConfigured(): boolean {
  return !!BATCHDATA_API_KEY;
}

/**
 * Look up property data by address
 */
export async function lookupProperty(
  address: string,
  city: string,
  state: string,
  zip?: string
): Promise<BatchDataResult> {
  if (!BATCHDATA_API_KEY) {
    throw new BatchDataError("BatchData API key not configured");
  }

  const params = new URLSearchParams({
    streetAddress: address,
    city: city,
    state: state,
    ...(zip && { zip }),
  });

  const response = await fetch(
    `${BATCHDATA_BASE_URL}/property/lookup?${params}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${BATCHDATA_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new BatchDataError(
      `BatchData API error: ${response.statusText}`,
      response.status
    );
  }

  const data: BatchDataApiResponse = await response.json();

  if (data.status !== "success" || !data.data) {
    throw new BatchDataError(data.error || "Property not found");
  }

  return mapBatchDataResponse(data.data);
}

/**
 * Look up property by full address string
 */
export async function lookupPropertyByFullAddress(
  fullAddress: string
): Promise<BatchDataResult> {
  if (!BATCHDATA_API_KEY) {
    throw new BatchDataError("BatchData API key not configured");
  }

  const params = new URLSearchParams({
    address: fullAddress,
  });

  const response = await fetch(
    `${BATCHDATA_BASE_URL}/property/lookup?${params}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${BATCHDATA_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new BatchDataError(
      `BatchData API error: ${response.statusText}`,
      response.status
    );
  }

  const data: BatchDataApiResponse = await response.json();

  if (data.status !== "success" || !data.data) {
    throw new BatchDataError(data.error || "Property not found");
  }

  return mapBatchDataResponse(data.data);
}

/**
 * Map BatchData API response to our internal format
 */
function mapBatchDataResponse(data: NonNullable<BatchDataApiResponse["data"]>): BatchDataResult {
  return {
    // Address
    address: data.propertyAddress?.streetAddress || "",
    city: data.propertyAddress?.city || "",
    state: data.propertyAddress?.state || "",
    zip: data.propertyAddress?.zip || "",
    county: data.propertyAddress?.county,

    // Property details
    totalSqft: data.buildingInfo?.totalSquareFeet,
    aboveGradeSqft: data.buildingInfo?.livingSquareFeet,
    basementSqft: data.buildingInfo?.basementSquareFeet,
    beds: data.buildingInfo?.bedrooms,
    baths: data.buildingInfo?.bathrooms,
    garageSpaces: data.buildingInfo?.garageSpaces,
    yearBuilt: data.buildingInfo?.yearBuilt,

    // Lot
    lotAcres: data.lotInfo?.lotAcreage,

    // Tax & valuation
    taxAssessedValue: data.taxInfo?.assessedValue,
    taxAmount: data.taxInfo?.taxAmount,
    lastSalePrice: data.lastSale?.salePrice,
    lastSaleDate: data.lastSale?.saleDate,
    priorSalePrice: data.priorSale?.salePrice,
    priorSaleDate: data.priorSale?.saleDate,

    // Owner
    ownerName: data.ownerInfo?.ownerName,
    ownerOccupied: data.ownerInfo?.ownerOccupied,

    // Geo
    latitude: data.geo?.latitude,
    longitude: data.geo?.longitude,
  };
}

/**
 * Create a mock BatchData result for testing/development
 */
export function createMockBatchDataResult(overrides?: Partial<BatchDataResult>): BatchDataResult {
  return {
    address: "123 Test St",
    city: "Minneapolis",
    state: "MN",
    zip: "55401",
    county: "Hennepin",
    totalSqft: 2500,
    aboveGradeSqft: 1800,
    basementSqft: 700,
    beds: 4,
    baths: 2.5,
    garageSpaces: 2,
    lotAcres: 0.25,
    yearBuilt: 1995,
    taxAssessedValue: 350000,
    taxAmount: 4500,
    lastSalePrice: 320000,
    lastSaleDate: "2020-06-15",
    ownerName: "Test Owner",
    ownerOccupied: true,
    latitude: 44.9778,
    longitude: -93.265,
    ...overrides,
  };
}

