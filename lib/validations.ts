import { z } from "zod";

export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
] as const;

export const CONDITIONS = [
  { value: "cosmetic", label: "Cosmetic", description: "Paint, flooring, fixtures" },
  { value: "moderate", label: "Moderate", description: "Kitchen/bath updates, some systems" },
  { value: "major", label: "Major", description: "Significant updates, multiple systems" },
  { value: "gut-rehab", label: "Gut Rehab", description: "Complete renovation" },
] as const;

export const propertySchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "ZIP is required").max(10),
  sqft: z.coerce.number().nonnegative().optional().nullable(),
  sqftAboveGrade: z.coerce.number().nonnegative().optional().nullable(),
  sqftBasement: z.coerce.number().nonnegative().optional().nullable(),
  beds: z.coerce.number().int().min(0).max(20).optional().nullable(),
  baths: z.coerce.number().min(0).max(10).optional().nullable(),
  lotAcres: z.coerce.number().nonnegative().optional().nullable(),
  garageSpaces: z.coerce.number().int().min(0).max(10).optional().nullable(),
  yearBuilt: z.coerce.number().int().min(1800).max(new Date().getFullYear()).optional().nullable(),
  purchasePrice: z.coerce.number().nonnegative().optional().nullable(),
  purchaseDate: z.string().optional().nullable(),
  arvLow: z.coerce.number().nonnegative().optional().nullable(),
  arvHigh: z.coerce.number().nonnegative().optional().nullable(),
  condition: z
    .enum(["gut-rehab", "major", "moderate", "cosmetic"])
    .optional()
    .nullable(),
  notes: z.string().max(2000).optional().nullable(),
}).refine(
  (data) => {
    if (data.arvLow && data.arvHigh) {
      return data.arvHigh >= data.arvLow;
    }
    return true;
  },
  {
    message: "ARV High must be greater than or equal to ARV Low",
    path: ["arvHigh"],
  }
);

export type PropertyFormValues = z.infer<typeof propertySchema>;
