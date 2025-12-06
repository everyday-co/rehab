import { describe, it, expect } from "vitest";
import { fetchComps, createMockComps, isCompsConfigured } from "@/lib/enrichment/comps";

describe("comps", () => {
  it("returns mocks when using mock helper", () => {
    const comps = createMockComps({
      address: "123 Main St",
      city: "Minneapolis",
      state: "MN",
      zip: "55401",
    });
    expect(comps.length).toBeGreaterThan(0);
    expect(comps[0]).toHaveProperty("salePrice");
  });

  it("returns array even when not configured", async () => {
    if (isCompsConfigured()) {
      // if configured, we skip because actual API isn't implemented here
      return;
    }
    const comps = await fetchComps({
      address: "123 Main St",
      city: "Minneapolis",
      state: "MN",
      zip: "55401",
    });
    expect(Array.isArray(comps)).toBe(true);
  });
});

