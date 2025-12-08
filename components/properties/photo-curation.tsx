import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Surface } from "@/components/ui/surface";
import { cn } from "@/lib/utils";
import type { PhotoData } from "@/lib/enrichment/types";
import { ArrowUp, ArrowDown, Star, Tag } from "lucide-react";

const ROOM_TAGS = ["Exterior", "Kitchen", "Living", "Bedroom", "Bathroom", "Basement", "Garage", "Other"];

interface PhotoCurationProps {
  photos: PhotoData[];
  onChange: (photos: PhotoData[]) => void;
}

export function PhotoCuration({ photos, onChange }: PhotoCurationProps) {
  const [localPhotos, setLocalPhotos] = useState<PhotoData[]>(photos);

  const update = (next: PhotoData[]) => {
    setLocalPhotos(next);
    onChange(next);
  };

  const makeCover = (index: number) => {
    const next = localPhotos.map((p, i) => ({ ...p, isMain: i === index }));
    // Move cover to front for display consistency
    next.sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0));
    update(next);
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= localPhotos.length) return;
    const next = [...localPhotos];
    [next[index], next[target]] = [next[target], next[index]];
    update(next);
  };

  const setRoom = (index: number, room: string) => {
    const next = localPhotos.map((p, i) => (i === index ? { ...p, room } : p));
    update(next);
  };

  if (!photos || photos.length === 0) return null;

  return (
    <Surface className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Curate photos</p>
          <p className="text-xs text-muted-foreground">Select a cover, reorder, and tag rooms.</p>
        </div>
      </div>

      <div className="space-y-3">
        {localPhotos.map((photo, idx) => (
          <div
            key={`${photo.url}-${idx}`}
            className="flex items-center gap-3 rounded-lg border border-border/70 bg-card/60 p-3"
          >
            <div
              className="h-16 w-20 flex-shrink-0 rounded-md bg-muted"
              style={{
                backgroundImage: `url(${photo.thumbnailUrl || photo.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
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
                <span className="truncate">{photo.url}</span>
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
                          "rounded border px-2 py-0.5 text-[11px]",
                          photo.room === room
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-foreground hover:border-primary/50"
                        )}
                        onClick={() => setRoom(idx, room)}
                      >
                        {room}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => move(idx, -1)}
                disabled={idx === 0}
                className="h-8 w-8"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => move(idx, 1)}
                disabled={idx === localPhotos.length - 1}
                className="h-8 w-8"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                variant={photo.isMain ? "secondary" : "outline"}
                size="sm"
                onClick={() => makeCover(idx)}
              >
                <Star className="mr-1 h-3 w-3" />
                {photo.isMain ? "Cover" : "Make cover"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Surface>
  );
}

