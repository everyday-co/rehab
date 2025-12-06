"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient, getUser } from "@/lib/supabase/server";
import { propertySchema, type PropertyFormValues } from "@/lib/validations";
import type { Tables } from "@/types/database";

export type PropertyRow = Tables<"properties">;

export type ActionResult<T = void> = {
  error?: string;
  data?: T;
};

export async function getProperties(): Promise<PropertyRow[]> {
  const supabase = await createSupabaseServerClient();
  const user = await getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching properties:", error);
    return [];
  }

  return data ?? [];
}

export async function getProperty(id: string): Promise<PropertyRow | null> {
  const supabase = await createSupabaseServerClient();
  const user = await getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching property:", error);
    return null;
  }

  return data;
}

export async function createProperty(
  values: PropertyFormValues
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createSupabaseServerClient();
  const user = await getUser();

  if (!user) {
    return { error: "You must be logged in to create a property" };
  }

  // Validate the input
  const parsed = propertySchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid form data" };
  }

  const { data, error } = await supabase
    .from("properties")
    .insert({
      user_id: user.id,
      address: parsed.data.address,
      city: parsed.data.city,
      state: parsed.data.state,
      zip: parsed.data.zip,
      sqft: parsed.data.sqft ?? null,
      sqft_above_grade: parsed.data.sqftAboveGrade ?? null,
      sqft_basement: parsed.data.sqftBasement ?? null,
      beds: parsed.data.beds ?? null,
      baths: parsed.data.baths ?? null,
      lot_acres: parsed.data.lotAcres ?? null,
      garage_spaces: parsed.data.garageSpaces ?? null,
      year_built: parsed.data.yearBuilt ?? null,
      purchase_price: parsed.data.purchasePrice ?? null,
      purchase_date: parsed.data.purchaseDate ?? null,
      arv_low: parsed.data.arvLow ?? null,
      arv_high: parsed.data.arvHigh ?? null,
      condition: parsed.data.condition ?? null,
      notes: parsed.data.notes ?? null,
      status: "scope",
      current_phase: 1,
      current_step: 0,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error creating property:", error);
    return { error: "Failed to create property. Please try again." };
  }

  revalidatePath("/properties");
  return { data: { id: data.id } };
}

export async function updateProperty(
  id: string,
  values: Partial<PropertyFormValues>
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const user = await getUser();

  if (!user) {
    return { error: "You must be logged in to update a property" };
  }

  const updateData: Record<string, unknown> = {};
  
  if (values.address !== undefined) updateData.address = values.address;
  if (values.city !== undefined) updateData.city = values.city;
  if (values.state !== undefined) updateData.state = values.state;
  if (values.zip !== undefined) updateData.zip = values.zip;
  if (values.sqft !== undefined) updateData.sqft = values.sqft;
  if (values.sqftAboveGrade !== undefined) updateData.sqft_above_grade = values.sqftAboveGrade;
  if (values.sqftBasement !== undefined) updateData.sqft_basement = values.sqftBasement;
  if (values.beds !== undefined) updateData.beds = values.beds;
  if (values.baths !== undefined) updateData.baths = values.baths;
  if (values.lotAcres !== undefined) updateData.lot_acres = values.lotAcres;
  if (values.garageSpaces !== undefined) updateData.garage_spaces = values.garageSpaces;
  if (values.yearBuilt !== undefined) updateData.year_built = values.yearBuilt;
  if (values.purchasePrice !== undefined) updateData.purchase_price = values.purchasePrice;
  if (values.purchaseDate !== undefined) updateData.purchase_date = values.purchaseDate;
  if (values.arvLow !== undefined) updateData.arv_low = values.arvLow;
  if (values.arvHigh !== undefined) updateData.arv_high = values.arvHigh;
  if (values.condition !== undefined) updateData.condition = values.condition;
  if (values.notes !== undefined) updateData.notes = values.notes;

  const { error } = await supabase
    .from("properties")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating property:", error);
    return { error: "Failed to update property. Please try again." };
  }

  revalidatePath("/properties");
  revalidatePath(`/properties/${id}`);
  return {};
}

export async function deleteProperty(id: string): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const user = await getUser();

  if (!user) {
    return { error: "You must be logged in to delete a property" };
  }

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting property:", error);
    return { error: "Failed to delete property. Please try again." };
  }

  revalidatePath("/properties");
  return {};
}

export async function updatePropertyPhase(
  id: string,
  phase: number,
  step: number = 0
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  const user = await getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  const statusMap: Record<number, string> = {
    1: "scope",
    2: "budget",
    3: "build",
    4: "listed",
  };

  const { error } = await supabase
    .from("properties")
    .update({
      current_phase: phase,
      current_step: step,
      status: statusMap[phase] ?? "scope",
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating property phase:", error);
    return { error: "Failed to update phase. Please try again." };
  }

  revalidatePath(`/properties/${id}`);
  return {};
}

