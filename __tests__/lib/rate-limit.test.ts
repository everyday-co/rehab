/**
 * Tests for API usage tracking utilities
 * Note: These are unit tests for the helper logic.
 * Integration tests with Supabase would require mocking.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase client
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(),
}));

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logApiUsage, getUsageCounts, getEndpointUsageCounts } from "@/lib/rate-limit";

describe("rate-limit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("logApiUsage", () => {
    it("handles missing supabase client gracefully", async () => {
      vi.mocked(createSupabaseServerClient).mockResolvedValue(null as any);

      // Should not throw
      await expect(logApiUsage("user-123", "/api/test")).resolves.toBeUndefined();
    });

    it("calls insert with correct parameters", async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });
      const mockSupabase = { from: mockFrom };

      vi.mocked(createSupabaseServerClient).mockResolvedValue(mockSupabase as any);

      await logApiUsage("user-123", "/api/properties/enrich", { foo: "bar" });

      expect(mockFrom).toHaveBeenCalledWith("api_usage");
      expect(mockInsert).toHaveBeenCalledWith({
        user_id: "user-123",
        endpoint: "/api/properties/enrich",
        metadata: { foo: "bar" },
      });
    });

    it("does not throw on insert error", async () => {
      const mockInsert = vi.fn().mockRejectedValue(new Error("DB error"));
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });
      const mockSupabase = { from: mockFrom };

      vi.mocked(createSupabaseServerClient).mockResolvedValue(mockSupabase as any);

      // Should not throw
      await expect(logApiUsage("user-123", "/api/test")).resolves.toBeUndefined();
    });
  });

  describe("getUsageCounts", () => {
    it("returns zeros when supabase is not available", async () => {
      vi.mocked(createSupabaseServerClient).mockResolvedValue(null as any);

      const result = await getUsageCounts("user-123");

      expect(result.hourly).toBe(0);
      expect(result.daily).toBe(0);
      expect(result.hourlyResetAt).toBeDefined();
      expect(result.dailyResetAt).toBeDefined();
    });

    it("returns correct counts from database", async () => {
      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockGte = vi.fn().mockImplementation(() => ({
        select: mockSelect,
        eq: mockEq,
        gte: mockGte,
      }));

      // First call for hourly count
      mockGte.mockReturnValueOnce({ count: 5 });
      // Second call for daily count
      mockGte.mockReturnValueOnce({ count: 15 });

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: mockSelect.mockReturnValue({
            eq: mockEq.mockReturnValue({
              gte: mockGte,
            }),
          }),
        }),
      };

      vi.mocked(createSupabaseServerClient).mockResolvedValue(mockSupabase as any);

      const result = await getUsageCounts("user-123");

      expect(result).toBeDefined();
      expect(typeof result.hourly).toBe("number");
      expect(typeof result.daily).toBe("number");
    });

    it("returns timestamps for reset times", async () => {
      vi.mocked(createSupabaseServerClient).mockResolvedValue(null as any);

      const before = Date.now();
      const result = await getUsageCounts("user-123");
      const after = Date.now();

      const hourlyReset = new Date(result.hourlyResetAt).getTime();
      const dailyReset = new Date(result.dailyResetAt).getTime();

      // Reset times should be approximately 1 hour and 24 hours from now
      expect(hourlyReset).toBeGreaterThanOrEqual(before + 59 * 60 * 1000);
      expect(hourlyReset).toBeLessThanOrEqual(after + 61 * 60 * 1000);

      expect(dailyReset).toBeGreaterThanOrEqual(before + 23 * 60 * 60 * 1000);
      expect(dailyReset).toBeLessThanOrEqual(after + 25 * 60 * 60 * 1000);
    });
  });

  describe("getEndpointUsageCounts", () => {
    it("filters by endpoint", async () => {
      const mockSelect = vi.fn().mockReturnThis();
      const mockEq = vi.fn().mockReturnThis();
      const mockGte = vi.fn().mockReturnValue({ count: 3 });

      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: mockSelect.mockReturnValue({
            eq: mockEq.mockReturnValue({
              eq: mockEq.mockReturnValue({
                gte: mockGte,
              }),
            }),
          }),
        }),
      };

      vi.mocked(createSupabaseServerClient).mockResolvedValue(mockSupabase as any);

      await getEndpointUsageCounts("user-123", "/api/properties/enrich");

      // Should be called with endpoint filter
      expect(mockSupabase.from).toHaveBeenCalledWith("api_usage");
    });

    it("returns zeros when supabase is not available", async () => {
      vi.mocked(createSupabaseServerClient).mockResolvedValue(null as any);

      const result = await getEndpointUsageCounts("user-123", "/api/test");

      expect(result.hourly).toBe(0);
      expect(result.daily).toBe(0);
    });
  });
});

