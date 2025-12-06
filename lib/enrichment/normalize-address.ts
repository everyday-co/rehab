/**
 * Address normalization utilities for consistent matching and deduplication
 */

/** Normalize an address for comparison and caching */
export function normalizeAddress(address: string): string {
  return address
    .toLowerCase()
    .trim()
    // Standardize common abbreviations
    .replace(/\bstreet\b/gi, "st")
    .replace(/\bavenue\b/gi, "ave")
    .replace(/\bdrive\b/gi, "dr")
    .replace(/\broad\b/gi, "rd")
    .replace(/\blane\b/gi, "ln")
    .replace(/\bcourt\b/gi, "ct")
    .replace(/\bplace\b/gi, "pl")
    .replace(/\bboulevard\b/gi, "blvd")
    .replace(/\bcircle\b/gi, "cir")
    .replace(/\bterrace\b/gi, "ter")
    .replace(/\bparkway\b/gi, "pkwy")
    .replace(/\bhighway\b/gi, "hwy")
    .replace(/\bnorth\b/gi, "n")
    .replace(/\bsouth\b/gi, "s")
    .replace(/\beast\b/gi, "e")
    .replace(/\bwest\b/gi, "w")
    .replace(/\bnortheast\b/gi, "ne")
    .replace(/\bnorthwest\b/gi, "nw")
    .replace(/\bsoutheast\b/gi, "se")
    .replace(/\bsouthwest\b/gi, "sw")
    .replace(/\bapartment\b/gi, "apt")
    .replace(/\bsuite\b/gi, "ste")
    .replace(/\bunit\b/gi, "unit")
    .replace(/\bbuilding\b/gi, "bldg")
    .replace(/\bfloor\b/gi, "fl")
    // Remove extra whitespace
    .replace(/\s+/g, " ")
    // Remove common punctuation
    .replace(/[.,#]/g, "")
    .trim();
}

/** Generate a cache key from address components */
export function generateAddressCacheKey(
  address: string,
  city: string,
  state: string,
  zip?: string
): string {
  const normalizedAddress = normalizeAddress(address);
  const normalizedCity = city.toLowerCase().trim();
  const normalizedState = state.toUpperCase().trim();
  const normalizedZip = zip?.trim() || "";

  // Create a deterministic key
  return `${normalizedAddress}|${normalizedCity}|${normalizedState}|${normalizedZip}`;
}

/** Parse a full address string into components */
export function parseFullAddress(fullAddress: string): {
  street: string;
  city: string;
  state: string;
  zip: string;
} | null {
  // Common patterns: "123 Main St, Minneapolis, MN 55401" or "123 Main St Minneapolis MN 55401"
  const patterns = [
    // With commas: "123 Main St, Minneapolis, MN 55401"
    /^(.+?),\s*(.+?),\s*([A-Z]{2})\s*(\d{5}(?:-\d{4})?)$/i,
    // Without city comma: "123 Main St, Minneapolis MN 55401"
    /^(.+?),\s*(.+?)\s+([A-Z]{2})\s*(\d{5}(?:-\d{4})?)$/i,
    // Space separated: "123 Main St Minneapolis MN 55401"
    /^(.+?)\s+([A-Za-z\s]+?)\s+([A-Z]{2})\s*(\d{5}(?:-\d{4})?)$/i,
  ];

  for (const pattern of patterns) {
    const match = fullAddress.match(pattern);
    if (match) {
      return {
        street: match[1].trim(),
        city: match[2].trim(),
        state: match[3].toUpperCase(),
        zip: match[4],
      };
    }
  }

  return null;
}

/** Check if two addresses likely refer to the same property */
export function addressesMatch(
  addr1: { address: string; city: string; state: string; zip?: string },
  addr2: { address: string; city: string; state: string; zip?: string }
): boolean {
  const key1 = generateAddressCacheKey(addr1.address, addr1.city, addr1.state, addr1.zip);
  const key2 = generateAddressCacheKey(addr2.address, addr2.city, addr2.state, addr2.zip);
  return key1 === key2;
}

