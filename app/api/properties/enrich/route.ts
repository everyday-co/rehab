/**
 * API Route: Property Enrichment
 * POST /api/properties/enrich
 */

import { NextRequest, NextResponse } from "next/server";

import { getUser, createSupabaseServerClient } from "@/lib/supabase/server";
import { enrichmentRequestSchema } from "@/lib/validations/enrichment";
import { 
  isSupportedListingUrl, 
  getListingDomain,
  type EnrichmentResult,
  type EnrichmentStatus,
  type PhotoData,
} from "@/lib/enrichment/types";
import { parseFullAddress, generateAddressCacheKey } from "@/lib/enrichment/normalize-address";
import { 
  lookupPropertyByFullAddress, 
  isBatchDataConfigured,
  createMockBatchDataResult,
  type BatchDataResult,
} from "@/lib/enrichment/batchdata";
import { 
  extractListingData, 
  isFirecrawlConfigured,
  createMockListingData,
  createMockPhotos,
  type ListingData,
} from "@/lib/enrichment/firecrawl";
import { 
  getCachedBatchData, 
  setCachedBatchData,
  getCachedListingEnrichment,
  setCachedListingEnrichment,
  getMemoryCached,
  setMemoryCached,
} from "@/lib/enrichment/cache";
import { mergeEnrichmentData } from "@/lib/enrichment/merge";
import { suggestARV } from "@/lib/enrichment/arv-suggester";

// Check if enrichment is enabled
const ENRICHMENT_ENABLED = process.env.ENABLE_PROPERTY_ENRICHMENT !== "false";
const USE_MOCKS = process.env.NODE_ENV === "development" && process.env.USE_ENRICHMENT_MOCKS === "true";

export async function POST(request: NextRequest) {
  try {
    // Check if enrichment is enabled
    if (!ENRICHMENT_ENABLED) {
      return NextResponse.json(
        { error: "Property enrichment is not enabled" },
        { status: 503 }
      );
    }

    // Verify user is authenticated
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const parseResult = enrichmentRequestSchema.safeParse(body);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors[0]?.message || "Invalid request" },
        { status: 400 }
      );
    }

    const { address, listingUrl } = parseResult.data;

    // Initialize result tracking
    const status: EnrichmentStatus = {
      batchdata: "skipped",
      firecrawl: "skipped",
      photos: "skipped",
    };

    let batchDataResult: BatchDataResult | null = null;
    let listingData: ListingData | null = null;
    let photos: PhotoData[] = [];
    let resolvedAddress = address;

    // If listing URL provided, scrape it first
    if (listingUrl) {
      if (!isSupportedListingUrl(listingUrl)) {
        return NextResponse.json(
          { error: "Unsupported listing URL. Please use Zillow, Redfin, or Realtor.com" },
          { status: 400 }
        );
      }

      // Check cache first
      const cachedResult = await getCachedListingEnrichment(listingUrl);
      if (cachedResult) {
        return NextResponse.json(cachedResult);
      }

      const domain = getListingDomain(listingUrl);
      
      if (USE_MOCKS) {
        // Use mock data for development
        listingData = createMockListingData();
        photos = createMockPhotos();
        status.firecrawl = "success";
        status.photos = "success";
      } else if (isFirecrawlConfigured() && domain) {
        try {
          const extracted = await extractListingData(listingUrl, domain.domain);
          listingData = extracted.listing;
          photos = extracted.photos;
          status.firecrawl = "success";
          status.photos = photos.length > 0 ? "success" : "skipped";

          // If we got address from listing, use it
          if (extracted.address) {
            resolvedAddress = `${extracted.address.street}, ${extracted.address.city}, ${extracted.address.state} ${extracted.address.zip}`;
          }
        } catch (error) {
          console.error("Firecrawl extraction failed:", error);
          status.firecrawl = "failed";
        }
      } else {
        status.firecrawl = "skipped";
      }
    }

    // Look up property data from BatchData
    if (resolvedAddress) {
      // Parse address if it's a full string
      const parsedAddress = parseFullAddress(resolvedAddress);
      
      if (parsedAddress) {
        // Check cache first
        const cachedBatchData = await getCachedBatchData(
          parsedAddress.street,
          parsedAddress.city,
          parsedAddress.state,
          parsedAddress.zip
        );

        if (cachedBatchData) {
          batchDataResult = cachedBatchData;
          status.batchdata = "success";
        } else if (USE_MOCKS) {
          // Use mock data for development
          batchDataResult = createMockBatchDataResult({
            address: parsedAddress.street,
            city: parsedAddress.city,
            state: parsedAddress.state,
            zip: parsedAddress.zip,
          });
          status.batchdata = "success";
        } else if (isBatchDataConfigured()) {
          try {
            batchDataResult = await lookupPropertyByFullAddress(resolvedAddress);
            status.batchdata = "success";

            // Cache the result
            await setCachedBatchData(
              parsedAddress.street,
              parsedAddress.city,
              parsedAddress.state,
              parsedAddress.zip,
              batchDataResult
            );
          } catch (error) {
            console.error("BatchData lookup failed:", error);
            status.batchdata = "failed";
          }
        } else {
          status.batchdata = "skipped";
        }
      } else {
        // Try full address lookup
        if (USE_MOCKS) {
          batchDataResult = createMockBatchDataResult();
          status.batchdata = "success";
        } else if (isBatchDataConfigured()) {
          try {
            batchDataResult = await lookupPropertyByFullAddress(resolvedAddress);
            status.batchdata = "success";
          } catch (error) {
            console.error("BatchData lookup failed:", error);
            status.batchdata = "failed";
          }
        }
      }
    }

    // Check for duplicate property
    let duplicate: { exists: boolean; existingPropertyId?: string } | undefined;
    
    if (batchDataResult) {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        const cacheKey = generateAddressCacheKey(
          batchDataResult.address,
          batchDataResult.city,
          batchDataResult.state,
          batchDataResult.zip
        );

        // Check if property with similar address exists for this user
        const { data: existingProperty } = await supabase
          .from("properties")
          .select("id, address, city, state")
          .eq("user_id", user.id)
          .ilike("address", `%${batchDataResult.address.split(" ")[0]}%`)
          .eq("city", batchDataResult.city)
          .eq("state", batchDataResult.state)
          .maybeSingle();

        if (existingProperty) {
          duplicate = {
            exists: true,
            existingPropertyId: existingProperty.id,
          };
        }
      }
    }

    // Generate ARV suggestion if we have enough data
    let arvSuggestion = null;
    if (batchDataResult && (batchDataResult.totalSqft || batchDataResult.aboveGradeSqft)) {
      arvSuggestion = suggestARV({
        subjectProperty: batchDataResult,
        listing: listingData,
        userComps: [],
      });
    }

    // Merge all data sources
    const enrichmentResult = mergeEnrichmentData({
      batchData: batchDataResult,
      listing: listingData,
      photos,
      arvSuggestion,
      status,
    });

    // Add duplicate info
    const result: EnrichmentResult = {
      ...enrichmentResult,
      duplicate,
    };

    // Cache the complete result if from listing URL
    if (listingUrl && result.confidence > 0) {
      await setCachedListingEnrichment(listingUrl, result);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Enrichment error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Enrichment failed" },
      { status: 500 }
    );
  }
}

