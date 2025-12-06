import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { PhaseIndicator } from "@/components/layout/phase-indicator";
import { getProperty } from "@/lib/properties/actions";
import { getUser } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import type { PhaseId } from "@/types";

export default async function PropertyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  const conditionLabels: Record<string, string> = {
    cosmetic: "Cosmetic",
    moderate: "Moderate",
    major: "Major",
    "gut-rehab": "Gut Rehab",
  };

  return (
    <div className="space-y-6">
      {/* Property header */}
      <div className="space-y-4">
        <Link
          href="/properties"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to properties
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {property.condition && (
                <Badge variant="outline">
                  {conditionLabels[property.condition] ?? property.condition}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {property.address}
            </h1>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {property.city}, {property.state} {property.zip}
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            {property.purchase_price && (
              <div className="text-right">
                <p className="text-muted-foreground">Purchase</p>
                <p className="font-semibold">
                  {formatCurrency(property.purchase_price)}
                </p>
              </div>
            )}
            {property.arv_high && (
              <div className="text-right">
                <p className="text-muted-foreground">Target ARV</p>
                <p className="font-semibold">
                  {formatCurrency(property.arv_high)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Phase indicator */}
        <PhaseIndicator currentPhase={property.current_phase as PhaseId} />
      </div>

      {/* Phase content */}
      {children}
    </div>
  );
}

