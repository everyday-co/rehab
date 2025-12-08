"use server";

/**
 * Photo management server actions
 * Handles persisting photo metadata (order, cover, room tags) to Supabase
 */

import { createSupabaseServerClient, getUser } from "@/lib/supabase/server";
import type { PhotoData } from "@/lib/enrichment/types";

export interface PhotoMetadata {
  url: string;
  thumbnailUrl?: string;
  room?: string;
  stage?: "before" | "during" | "after";
  isMain: boolean;
  sortOrder: number;
}

export type PhotoActionResult<T = void> = {
  error?: string;
  data?: T;
};

/**
 * Save photos for a property (upserts all photos)
 */
export async function savePropertyPhotos(
  propertyId: string,
  photos: PhotoData[]
): Promise<PhotoActionResult<{ count: number }>> {
  const supabase = await createSupabaseServerClient();
  const user = await getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  if (!supabase) {
    return { error: "Database not available" };
  }

  // Verify user owns the property
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("id")
    .eq("id", propertyId)
    .eq("user_id", user.id)
    .single();

  if (propertyError || !property) {
    return { error: "Property not found or access denied" };
  }

  // Delete existing photos for this property
  await supabase.from("photos").delete().eq("property_id", propertyId);

  // Ensure only one cover photo
  let hasCover = false;
  const photoRows = photos.map((photo, index) => {
    const isMain = photo.isMain && !hasCover;
    if (isMain) hasCover = true;
    
    return {
      property_id: propertyId,
      url: photo.url,
      thumbnail_url: photo.thumbnailUrl ?? null,
      room: photo.room ?? null,
      stage: null,
      is_main: isMain,
      sort_order: index,
    };
  });

  // If no cover was set, make the first photo the cover
  if (!hasCover && photoRows.length > 0) {
    photoRows[0].is_main = true;
  }

  if (photoRows.length === 0) {
    return { data: { count: 0 } };
  }

  const { error: insertError } = await supabase.from("photos").insert(photoRows);

  if (insertError) {
    console.error("Error saving photos:", insertError);
    return { error: "Failed to save photos" };
  }

  return { data: { count: photoRows.length } };
}

/**
 * Get photos for a property
 */
export async function getPropertyPhotos(
  propertyId: string
): Promise<PhotoData[]> {
  const supabase = await createSupabaseServerClient();
  const user = await getUser();

  if (!user || !supabase) {
    return [];
  }

  // Verify user owns the property
  const { data: property } = await supabase
    .from("properties")
    .select("id")
    .eq("id", propertyId)
    .eq("user_id", user.id)
    .single();

  if (!property) {
    return [];
  }

  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("property_id", propertyId)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    console.error("Error fetching photos:", error);
    return [];
  }

  return data.map((row) => ({
    url: row.url,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    room: row.room ?? undefined,
    isMain: row.is_main,
  }));
}

/**
 * Update cover photo for a property
 */
export async function setCoverPhoto(
  propertyId: string,
  photoUrl: string
): Promise<PhotoActionResult> {
  const supabase = await createSupabaseServerClient();
  const user = await getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  if (!supabase) {
    return { error: "Database not available" };
  }

  // Verify user owns the property
  const { data: property } = await supabase
    .from("properties")
    .select("id")
    .eq("id", propertyId)
    .eq("user_id", user.id)
    .single();

  if (!property) {
    return { error: "Property not found or access denied" };
  }

  // Clear all cover flags for this property
  await supabase
    .from("photos")
    .update({ is_main: false })
    .eq("property_id", propertyId);

  // Set the new cover photo
  const { error } = await supabase
    .from("photos")
    .update({ is_main: true })
    .eq("property_id", propertyId)
    .eq("url", photoUrl);

  if (error) {
    console.error("Error setting cover photo:", error);
    return { error: "Failed to set cover photo" };
  }

  return {};
}

