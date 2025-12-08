/**
 * API usage tracking utilities
 * Logs API requests per user and provides hour/day counts
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

export interface UsageCounts {
  hourly: number;
  daily: number;
  hourlyResetAt: string;
  dailyResetAt: string;
}

/**
 * Log an API request for the given user
 */
export async function logApiUsage(
  userId: string,
  endpoint: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  try {
    await supabase.from("api_usage").insert({
      user_id: userId,
      endpoint,
      metadata: (metadata as Json) ?? null,
    });
  } catch (error) {
    // Non-blocking - just log the error
    console.error("Failed to log API usage:", error);
  }
}

/**
 * Get usage counts for a user
 */
export async function getUsageCounts(userId: string): Promise<UsageCounts> {
  const supabase = await createSupabaseServerClient();
  
  const now = new Date();
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Calculate reset times
  const hourlyResetAt = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
  const dailyResetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

  if (!supabase) {
    return { hourly: 0, daily: 0, hourlyResetAt, dailyResetAt };
  }

  try {
    // Count requests in the last hour
    const { count: hourlyCount } = await supabase
      .from("api_usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("occurred_at", hourAgo.toISOString());

    // Count requests in the last day
    const { count: dailyCount } = await supabase
      .from("api_usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("occurred_at", dayAgo.toISOString());

    return {
      hourly: hourlyCount ?? 0,
      daily: dailyCount ?? 0,
      hourlyResetAt,
      dailyResetAt,
    };
  } catch (error) {
    console.error("Failed to get usage counts:", error);
    return { hourly: 0, daily: 0, hourlyResetAt, dailyResetAt };
  }
}

/**
 * Get usage counts for a specific endpoint
 */
export async function getEndpointUsageCounts(
  userId: string,
  endpoint: string
): Promise<UsageCounts> {
  const supabase = await createSupabaseServerClient();
  
  const now = new Date();
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const hourlyResetAt = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
  const dailyResetAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

  if (!supabase) {
    return { hourly: 0, daily: 0, hourlyResetAt, dailyResetAt };
  }

  try {
    const { count: hourlyCount } = await supabase
      .from("api_usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("endpoint", endpoint)
      .gte("occurred_at", hourAgo.toISOString());

    const { count: dailyCount } = await supabase
      .from("api_usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("endpoint", endpoint)
      .gte("occurred_at", dayAgo.toISOString());

    return {
      hourly: hourlyCount ?? 0,
      daily: dailyCount ?? 0,
      hourlyResetAt,
      dailyResetAt,
    };
  } catch (error) {
    console.error("Failed to get endpoint usage counts:", error);
    return { hourly: 0, daily: 0, hourlyResetAt, dailyResetAt };
  }
}

