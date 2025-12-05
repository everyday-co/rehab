import { z } from "zod";

export const propertySchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "ZIP is required"),
  sqft: z.number().nonnegative().optional(),
  sqftAboveGrade: z.number().nonnegative().optional(),
  sqftBasement: z.number().nonnegative().optional(),
  beds: z.number().nonnegative().optional(),
  baths: z.number().nonnegative().optional(),
  lotAcres: z.number().nonnegative().optional(),
  garageSpaces: z.number().nonnegative().optional(),
  yearBuilt: z.number().int().optional(),
  purchasePrice: z.number().nonnegative().optional(),
  purchaseDate: z.string().optional(),
  arvLow: z.number().nonnegative().optional(),
  arvHigh: z.number().nonnegative().optional(),
  condition: z
    .enum(["gut-rehab", "major", "moderate", "cosmetic"])
    .optional(),
  notes: z.string().max(2000).optional(),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
