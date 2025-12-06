/**
 * Zod schemas for property enrichment
 */

import { z } from "zod";

/**
 * Schema for enrichment request
 */
export const enrichmentRequestSchema = z
  .object({
    address: z.string().min(1).optional(),
    listingUrl: z.string().url().optional(),
  })
  .refine(
    (data) => data.address || data.listingUrl,
    {
      message: "Either address or listingUrl must be provided",
    }
  );

export type EnrichmentRequest = z.infer<typeof enrichmentRequestSchema>;

/**
 * Schema for BatchData result
 */
export const batchDataResultSchema = z.object({
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  county: z.string().optional(),
  totalSqft: z.number().optional(),
  aboveGradeSqft: z.number().optional(),
  basementSqft: z.number().optional(),
  beds: z.number().optional(),
  baths: z.number().optional(),
  garageSpaces: z.number().optional(),
  lotAcres: z.number().optional(),
  yearBuilt: z.number().optional(),
  taxAssessedValue: z.number().optional(),
  taxAmount: z.number().optional(),
  lastSalePrice: z.number().optional(),
  lastSaleDate: z.string().optional(),
  priorSalePrice: z.number().optional(),
  priorSaleDate: z.string().optional(),
  ownerName: z.string().optional(),
  ownerOccupied: z.boolean().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

/**
 * Schema for listing data
 */
export const listingDataSchema = z.object({
  description: z.string().optional(),
  listPrice: z.number().optional(),
  status: z.string().optional(),
  daysOnMarket: z.number().optional(),
  features: z.array(z.string()).optional(),
  listingAgent: z.string().optional(),
  listingBrokerage: z.string().optional(),
  mlsNumber: z.string().optional(),
  zestimate: z.number().optional(),
  rentZestimate: z.number().optional(),
  priceHistory: z
    .array(
      z.object({
        date: z.string(),
        price: z.number(),
        event: z.string(),
      })
    )
    .optional(),
});

/**
 * Schema for photo data
 */
export const photoDataSchema = z.object({
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  room: z.string().optional(),
  isMain: z.boolean().optional(),
});

/**
 * Schema for ARV suggestion
 */
export const arvSuggestionSchema = z.object({
  low: z.number(),
  mid: z.number(),
  high: z.number(),
  pricePerSqftRange: z.object({
    low: z.number(),
    avg: z.number(),
    high: z.number(),
  }),
  compsUsed: z.number(),
  confidence: z.enum(["high", "medium", "low"]),
});

/**
 * Schema for enrichment status
 */
export const enrichmentStatusSchema = z.object({
  batchdata: z.enum(["success", "failed", "partial", "skipped"]),
  firecrawl: z.enum(["success", "failed", "partial", "skipped"]),
  photos: z.enum(["success", "failed", "partial", "skipped"]),
});

/**
 * Schema for complete enrichment result
 */
export const enrichmentResultSchema = z.object({
  property: z.record(z.unknown()),
  batchData: batchDataResultSchema.nullable(),
  listing: listingDataSchema.nullable(),
  photos: z.array(photoDataSchema),
  arvSuggestion: arvSuggestionSchema.nullable(),
  status: enrichmentStatusSchema,
  confidence: z.number().min(0).max(100),
  duplicate: z
    .object({
      exists: z.boolean(),
      existingPropertyId: z.string().optional(),
    })
    .optional(),
});

export type EnrichmentResult = z.infer<typeof enrichmentResultSchema>;

