"use client";

import { useState, useCallback } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Surface } from "@/components/ui/surface";
import { cn } from "@/lib/utils";
import type { PhotoData } from "@/lib/enrichment/types";
import { GripVertical, Star, Tag } from "lucide-react";

const ROOM_TAGS = ["Exterior", "Kitchen", "Living", "Bedroom", "Bathroom", "Basement", "Garage", "Other"];

interface PhotoCurationProps {
  photos: PhotoData[];
  onChange: (photos: PhotoData[]) => void;
}

export function PhotoCuration({ photos, onChange }: PhotoCurationProps) {
  const [localPhotos, setLocalPhotos] = useState<PhotoData[]>(photos);

  const update = useCallback(
    (next: PhotoData[]) => {
      setLocalPhotos(next);
      onChange(next);
    },
    [onChange]
  );

  const makeCover = useCallback(
    (targetUrl: string) => {
      const next = localPhotos.map((p) => ({
        ...p,
        isMain: p.url === targetUrl,
      }));
      update(next);
    },
    [localPhotos, update]
  );

  const setRoom = useCallback(
    (targetUrl: string, room: string) => {
      const next = localPhotos.map((p) =>
        p.url === targetUrl ? { ...p, room } : p
      );
      update(next);
    },
    [localPhotos, update]
  );

  const handleReorder = useCallback(
    (reordered: PhotoData[]) => {
      update(reordered);
    },
    [update]
  );

  if (!photos || photos.length === 0) return null;

  return (
    <Surface className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Curate photos</p>
          <p className="text-xs text-muted-foreground">
            Drag to reorder, select a cover, and tag rooms.
          </p>
        </div>
      </div>

      <Reorder.Group
        axis="y"
        values={localPhotos}
        onReorder={handleReorder}
        className="space-y-3"
      >
        {localPhotos.map((photo) => (
          <PhotoItem
            key={photo.url}
            photo={photo}
            onMakeCover={makeCover}
            onSetRoom={setRoom}
          />
        ))}
      </Reorder.Group>
    </Surface>
  );
}

interface PhotoItemProps {
  photo: PhotoData;
  onMakeCover: (url: string) => void;
  onSetRoom: (url: string, room: string) => void;
}

function PhotoItem({ photo, onMakeCover, onSetRoom }: PhotoItemProps) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={photo}
      dragListener={false}
      dragControls={controls}
      className="flex items-center gap-3 rounded-lg border border-border/70 bg-card/60 p-3 cursor-default"
      whileDrag={{
        scale: 1.02,
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        zIndex: 50,
      }}
    >
      {/* Drag handle */}
      <button
        type="button"
        onPointerDown={(e) => controls.start(e)}
        className="flex-shrink-0 cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Thumbnail */}
      <div
        className="h-16 w-20 flex-shrink-0 rounded-md bg-muted"
        style={{
          backgroundImage: `url(${photo.thumbnailUrl || photo.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          {photo.isMain && (
            <Badge variant="secondary" className="gap-1 text-[11px]">
              <Star className="h-3 w-3 fill-primary text-primary" /> Cover
            </Badge>
          )}
          {photo.room && (
            <Badge variant="outline" className="text-[11px]">
              <Tag className="mr-1 h-3 w-3" />
              {photo.room}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="max-w-[200px] truncate">{photo.url}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Room:</span>
            <div className="flex flex-wrap gap-1">
              {ROOM_TAGS.map((room) => (
                <button
                  key={room}
                  type="button"
                  className={cn(
                    "rounded border px-2 py-0.5 text-[11px] transition-colors",
                    photo.room === room
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-foreground hover:border-primary/50"
                  )}
                  onClick={() => onSetRoom(photo.url, room)}
                >
                  {room}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cover button */}
      <div className="flex flex-shrink-0 flex-col items-center gap-2">
        <Button
          variant={photo.isMain ? "secondary" : "outline"}
          size="sm"
          onClick={() => onMakeCover(photo.url)}
        >
          <Star className="mr-1 h-3 w-3" />
          {photo.isMain ? "Cover" : "Set cover"}
        </Button>
      </div>
    </Reorder.Item>
  );
}
