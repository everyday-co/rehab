/**
 * Tests for address normalization utilities
 */

import { describe, it, expect } from "vitest";
import {
  normalizeAddress,
  generateAddressCacheKey,
  parseFullAddress,
  addressesMatch,
} from "@/lib/enrichment/normalize-address";

describe("normalizeAddress", () => {
  it("converts to lowercase", () => {
    expect(normalizeAddress("123 MAIN STREET")).toBe("123 main st");
  });

  it("standardizes street types", () => {
    expect(normalizeAddress("123 Oak Avenue")).toBe("123 oak ave");
    expect(normalizeAddress("456 Elm Drive")).toBe("456 elm dr");
    expect(normalizeAddress("789 Pine Road")).toBe("789 pine rd");
    expect(normalizeAddress("321 Cedar Lane")).toBe("321 cedar ln");
    expect(normalizeAddress("654 Maple Court")).toBe("654 maple ct");
    expect(normalizeAddress("987 Birch Boulevard")).toBe("987 birch blvd");
  });

  it("standardizes directional prefixes", () => {
    expect(normalizeAddress("123 North Main St")).toBe("123 n main st");
    expect(normalizeAddress("456 South Oak Ave")).toBe("456 s oak ave");
    expect(normalizeAddress("789 East Elm Dr")).toBe("789 e elm dr");
    expect(normalizeAddress("321 West Pine Rd")).toBe("321 w pine rd");
    expect(normalizeAddress("654 Northeast Cedar Ln")).toBe("654 ne cedar ln");
  });

  it("standardizes unit designations", () => {
    expect(normalizeAddress("123 Main St Apartment 4")).toBe("123 main st apt 4");
    expect(normalizeAddress("456 Oak Ave Suite 100")).toBe("456 oak ave ste 100");
  });

  it("removes punctuation", () => {
    expect(normalizeAddress("123 Main St.")).toBe("123 main st");
    expect(normalizeAddress("456 Oak Ave, #100")).toBe("456 oak ave 100");
  });

  it("normalizes whitespace", () => {
    expect(normalizeAddress("  123   Main   St  ")).toBe("123 main st");
  });
});

describe("generateAddressCacheKey", () => {
  it("generates consistent keys for same address", () => {
    const key1 = generateAddressCacheKey("123 Main Street", "Minneapolis", "MN", "55401");
    const key2 = generateAddressCacheKey("123 Main St", "Minneapolis", "MN", "55401");
    expect(key1).toBe(key2);
  });

  it("generates different keys for different addresses", () => {
    const key1 = generateAddressCacheKey("123 Main St", "Minneapolis", "MN", "55401");
    const key2 = generateAddressCacheKey("456 Oak Ave", "Minneapolis", "MN", "55401");
    expect(key1).not.toBe(key2);
  });

  it("handles missing zip", () => {
    const key = generateAddressCacheKey("123 Main St", "Minneapolis", "MN");
    expect(key).toContain("123 main st");
    expect(key).toContain("minneapolis");
    expect(key).toContain("MN");
  });
});

describe("parseFullAddress", () => {
  it("parses comma-separated address", () => {
    const result = parseFullAddress("123 Main St, Minneapolis, MN 55401");
    expect(result).toEqual({
      street: "123 Main St",
      city: "Minneapolis",
      state: "MN",
      zip: "55401",
    });
  });

  it("parses address without city comma", () => {
    const result = parseFullAddress("123 Main St, Minneapolis MN 55401");
    expect(result).toEqual({
      street: "123 Main St",
      city: "Minneapolis",
      state: "MN",
      zip: "55401",
    });
  });

  it("handles zip+4 format", () => {
    const result = parseFullAddress("123 Main St, Minneapolis, MN 55401-1234");
    expect(result?.zip).toBe("55401-1234");
  });

  it("returns null for invalid address", () => {
    const result = parseFullAddress("invalid address");
    expect(result).toBeNull();
  });
});

describe("addressesMatch", () => {
  it("matches equivalent addresses", () => {
    const addr1 = { address: "123 Main Street", city: "Minneapolis", state: "MN" };
    const addr2 = { address: "123 Main St", city: "Minneapolis", state: "MN" };
    expect(addressesMatch(addr1, addr2)).toBe(true);
  });

  it("does not match different addresses", () => {
    const addr1 = { address: "123 Main St", city: "Minneapolis", state: "MN" };
    const addr2 = { address: "456 Oak Ave", city: "Minneapolis", state: "MN" };
    expect(addressesMatch(addr1, addr2)).toBe(false);
  });

  it("does not match different cities", () => {
    const addr1 = { address: "123 Main St", city: "Minneapolis", state: "MN" };
    const addr2 = { address: "123 Main St", city: "St. Paul", state: "MN" };
    expect(addressesMatch(addr1, addr2)).toBe(false);
  });
});

