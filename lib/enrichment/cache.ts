/**
 * Caching layer for enrichment API calls to reduce costs
 * Uses Supabase for persistence with 24hr TTL
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateAddressCacheKey } from "./normalize-address";
import type { BatchDataResult, EnrichmentResult } from "./types";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  key: string;
  data: unknown;
  created_at: string;
  expires_at: string;
}

/**
 * Get cached BatchData result by address
 */
export async function getCachedBatchData(
  address: string,
  city: string,
  state: string,
  zip?: string
): Promise<BatchDataResult | null> {
  const cacheKey = `batchdata:${generateAddressCacheKey(address, city, state, zip)}`;
  
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("enrichment_cache")
      .select("data, expires_at")
      .eq("key", cacheKey)
      .single();

    if (error || !data) return null;

    // Check if expired
    if (new Date(data.expires_at) < new Date()) {
      // Delete expired entry
      await supabase.from("enrichment_cache").delete().eq("key", cacheKey);
      return null;
    }

    return data.data as BatchDataResult;
  } catch {
    // Cache miss or error - not critical
    return null;
  }
}

/**
 * Cache BatchData result
 */
export async function setCachedBatchData(
  address: string,
  city: string,
  state: string,
  zip: string | undefined,
  data: BatchDataResult
): Promise<void> {
  const cacheKey = `batchdata:${generateAddressCacheKey(address, city, state, zip)}`;
  
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + CACHE_TTL_MS);

    await supabase.from("enrichment_cache").upsert({
      key: cacheKey,
      data: data,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    });
  } catch {
    // Cache write failure - not critical
    console.warn("Failed to cache BatchData result");
  }
}

/**
 * Get cached enrichment result by listing URL
 */
export async function getCachedListingEnrichment(
  listingUrl: string
): Promise<EnrichmentResult | null> {
  const cacheKey = `listing:${listingUrl}`;
  
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("enrichment_cache")
      .select("data, expires_at")
      .eq("key", cacheKey)
      .single();

    if (error || !data) return null;

    // Check if expired
    if (new Date(data.expires_at) < new Date()) {
      await supabase.from("enrichment_cache").delete().eq("key", cacheKey);
      return null;
    }

    return data.data as EnrichmentResult;
  } catch {
    return null;
  }
}

/**
 * Cache listing enrichment result
 */
export async function setCachedListingEnrichment(
  listingUrl: string,
  result: EnrichmentResult
): Promise<void> {
  const cacheKey = `listing:${listingUrl}`;
  
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + CACHE_TTL_MS);

    await supabase.from("enrichment_cache").upsert({
      key: cacheKey,
      data: result,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    });
  } catch {
    console.warn("Failed to cache listing enrichment result");
  }
}

/**
 * Clear expired cache entries (can be run periodically)
 */
export async function clearExpiredCache(): Promise<number> {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return 0;

    const { data, error } = await supabase
      .from("enrichment_cache")
      .delete()
      .lt("expires_at", new Date().toISOString())
      .select("key");

    if (error) return 0;
    return data?.length || 0;
  } catch {
    return 0;
  }
}

/**
 * In-memory cache fallback for when Supabase isn't available
 * (e.g., during development without DB setup)
 */
const memoryCache = new Map<string, { data: unknown; expiresAt: number }>();

export function getMemoryCached<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  
  if (entry.expiresAt < Date.now()) {
    memoryCache.delete(key);
    return null;
  }
  
  return entry.data as T;
}

export function setMemoryCached<T>(key: string, data: T, ttlMs: number = CACHE_TTL_MS): void {
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

/**
 * Hybrid cache getter - tries Supabase first, falls back to memory
 */
export async function getCached<T>(
  key: string,
  supabaseGetter: () => Promise<T | null>
): Promise<T | null> {
  // Try Supabase first
  const supabaseResult = await supabaseGetter();
  if (supabaseResult) return supabaseResult;
  
  // Fall back to memory cache
  return getMemoryCached<T>(key);
}

