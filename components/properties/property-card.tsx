"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  MoreVertical,
  MapPin,
  Bed,
  Bath,
  Ruler,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";
import { PHASES } from "@/lib/constants";
import type { PropertyRow } from "@/lib/properties/actions";

interface PropertyCardProps {
  property: PropertyRow;
  onDelete?: (id: string) => void;
}

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  scope: { label: "Scoping", variant: "outline" },
  budget: { label: "Budgeting", variant: "secondary" },
  build: { label: "In Progress", variant: "default" },
  listed: { label: "Listed", variant: "secondary" },
  sold: { label: "Sold", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

export function PropertyCard({ property, onDelete }: PropertyCardProps) {
  const phase = PHASES.find((p) => p.id === property.current_phase);
  const status = statusConfig[property.status] ?? statusConfig.scope;

  const isSold = property.status === "sold";

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md">
      {/* Phase color indicator */}
      <div
        className="absolute left-0 top-0 h-1 w-full"
        style={{ backgroundColor: phase?.colorVar }}
      />

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Badge variant={status.variant} className="mb-2">
              {status.label}
            </Badge>
            <Link
              href={`/properties/${property.id}`}
              className="block hover:underline"
            >
              <h3 className="truncate font-semibold leading-tight">
                {property.address}
              </h3>
            </Link>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {property.city}, {property.state} {property.zip}
              </span>
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/properties/${property.id}`}>View details</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete?.(property.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Property specs */}
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {property.beds != null && (
            <span className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5" />
              {property.beds} bd
            </span>
          )}
          {property.baths != null && (
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
              {property.baths} ba
            </span>
          )}
          {property.sqft != null && (
            <span className="flex items-center gap-1">
              <Ruler className="h-3.5 w-3.5" />
              {property.sqft.toLocaleString()} sqft
            </span>
          )}
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/50 p-2 text-sm">
          {isSold ? (
            <>
              <div>
                <p className="text-xs text-muted-foreground">Profit</p>
                <p className="font-medium">—</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ROI</p>
                <p className="font-medium">—%</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-xs text-muted-foreground">ARV</p>
                <p className="font-medium">
                  {property.arv_high
                    ? formatCurrency(property.arv_high)
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phase</p>
                <p className="font-medium">{phase?.name ?? "—"}</p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Updated{" "}
            {formatDistanceToNow(new Date(property.updated_at), {
              addSuffix: true,
            })}
          </span>
          <Link
            href={`/properties/${property.id}`}
            className="font-medium text-foreground hover:underline"
          >
            Continue →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

