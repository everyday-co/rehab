/**
 * API Route: Usage Statistics
 * GET /api/usage - Returns per-user hour/day API usage counts
 */

import { NextResponse } from "next/server";

import { getUser } from "@/lib/supabase/server";
import { getUsageCounts, getEndpointUsageCounts } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if specific endpoint is requested
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get("endpoint");

    const counts = endpoint
      ? await getEndpointUsageCounts(user.id, endpoint)
      : await getUsageCounts(user.id);

    return NextResponse.json({
      userId: user.id,
      endpoint: endpoint ?? "all",
      ...counts,
    });
  } catch (error) {
    console.error("Usage API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage data" },
      { status: 500 }
    );
  }
}

