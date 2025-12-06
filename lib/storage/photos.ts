/**
 * Photo storage utilities for Supabase Storage
 * Handles uploading listing photos and property images
 */

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PhotoData } from "@/lib/enrichment/types";

const BUCKET_NAME = "property-photos";

export interface UploadedPhoto {
  url: string;
  thumbnailUrl?: string;
  path: string;
  room?: string;
  stage?: "before" | "during" | "after";
  isMain?: boolean;
}

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageError";
  }
}

/**
 * Ensure the photos bucket exists
 */
async function ensureBucket(supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>) {
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some((b) => b.name === BUCKET_NAME);

  if (!bucketExists) {
    await supabase.storage.createBucket(BUCKET_NAME, {
      public: true, // Photos can be publicly accessible
      fileSizeLimit: 10 * 1024 * 1024, // 10MB max
    });
  }
}

/**
 * Upload a single photo from URL to Supabase Storage
 */
export async function uploadPhotoFromUrl(
  propertyId: string,
  photoUrl: string,
  index: number,
  options?: {
    room?: string;
    stage?: "before" | "during" | "after";
    isMain?: boolean;
  }
): Promise<UploadedPhoto | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new StorageError("Supabase client not available");
  }

  try {
    // Fetch the image
    const response = await fetch(photoUrl);
    if (!response.ok) {
      console.warn(`Failed to fetch photo: ${photoUrl}`);
      return null;
    }

    const blob = await response.blob();
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const extension = contentType.split("/")[1] || "jpg";

    // Generate path: property-photos/{propertyId}/{index}.{ext}
    const fileName = `${index}.${extension}`;
    const filePath = `${propertyId}/${fileName}`;

    await ensureBucket(supabase);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, blob, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error(`Upload error for ${photoUrl}:`, uploadError);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
      room: options?.room,
      stage: options?.stage,
      isMain: options?.isMain,
    };
  } catch (error) {
    console.error(`Error uploading photo from ${photoUrl}:`, error);
    return null;
  }
}

/**
 * Upload multiple photos from URLs
 * This is designed to run in the background after property creation
 */
export async function uploadPhotosFromUrls(
  propertyId: string,
  photos: PhotoData[]
): Promise<UploadedPhoto[]> {
  const results: UploadedPhoto[] = [];

  // Process in batches of 3 to avoid overwhelming the system
  const batchSize = 3;
  for (let i = 0; i < photos.length; i += batchSize) {
    const batch = photos.slice(i, i + batchSize);
    const batchPromises = batch.map((photo, batchIndex) =>
      uploadPhotoFromUrl(propertyId, photo.url, i + batchIndex, {
        room: photo.room,
        isMain: photo.isMain,
      })
    );

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults.filter((r): r is UploadedPhoto => r !== null));
  }

  return results;
}

/**
 * Delete all photos for a property
 */
export async function deletePropertyPhotos(propertyId: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new StorageError("Supabase client not available");
  }

  // List all files in the property folder
  const { data: files, error: listError } = await supabase.storage
    .from(BUCKET_NAME)
    .list(propertyId);

  if (listError) {
    console.error("Error listing photos:", listError);
    return;
  }

  if (!files || files.length === 0) return;

  // Delete all files
  const filePaths = files.map((f) => `${propertyId}/${f.name}`);
  const { error: deleteError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(filePaths);

  if (deleteError) {
    console.error("Error deleting photos:", deleteError);
  }
}

/**
 * Get all photos for a property
 */
export async function getPropertyPhotos(propertyId: string): Promise<UploadedPhoto[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return [];
  }

  const { data: files, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(propertyId);

  if (error || !files) {
    return [];
  }

  return files.map((file) => {
    const filePath = `${propertyId}/${file.name}`;
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
    };
  });
}

/**
 * Queue photos for background upload after property creation
 * In a production app, this would use a proper job queue
 * For now, we'll just trigger the upload and not wait for it
 */
export function queuePhotoUpload(propertyId: string, photos: PhotoData[]): void {
  if (photos.length === 0) return;

  // Fire and forget - don't block on this
  uploadPhotosFromUrls(propertyId, photos)
    .then((uploaded) => {
      console.log(`Uploaded ${uploaded.length}/${photos.length} photos for property ${propertyId}`);
    })
    .catch((error) => {
      console.error(`Background photo upload failed for property ${propertyId}:`, error);
    });
}

/**
 * Store photo URLs temporarily (before property is created)
 * These will be migrated to Supabase Storage after property creation
 */
export interface PendingPhotoUpload {
  propertyId: string;
  photos: PhotoData[];
  createdAt: string;
}

// In-memory store for pending uploads (in production, use Redis or DB)
const pendingUploads = new Map<string, PendingPhotoUpload>();

export function setPendingPhotoUpload(tempId: string, photos: PhotoData[]): void {
  pendingUploads.set(tempId, {
    propertyId: tempId,
    photos,
    createdAt: new Date().toISOString(),
  });
}

export function getPendingPhotoUpload(tempId: string): PendingPhotoUpload | null {
  return pendingUploads.get(tempId) || null;
}

export function clearPendingPhotoUpload(tempId: string): void {
  pendingUploads.delete(tempId);
}

