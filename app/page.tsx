import { PhaseIndicator } from "@/components/layout/phase-indicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { TEST_PROPERTY } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

const SAMPLE_BUDGET_RANGE: [number, number] = [125000, 150000];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Fix & Flip Rehab Tracker
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">
                Conveyor Belt Overview
              </h1>
              <p className="text-sm text-muted-foreground">
                Scope → Budget → Build → Close
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-phase-1 text-white">Phase 1</Badge>
              <Button variant="outline">Add Property</Button>
              <Button>Continue</Button>
            </div>
          </div>
          <PhaseIndicator currentPhase={1} />
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Test Property</CardTitle>
              <CardDescription>Preloaded sample for quick UX checks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{TEST_PROPERTY.address}</span>
                <Separator orientation="vertical" className="h-4" />
                <span>
                  {TEST_PROPERTY.city}, {TEST_PROPERTY.state} {TEST_PROPERTY.zip}
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span>
                  {TEST_PROPERTY.beds} bd / {TEST_PROPERTY.baths} ba
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span>{TEST_PROPERTY.sqft} sqft</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Stat
                  label="Purchase"
                  value={formatCurrency(TEST_PROPERTY.purchasePrice)}
                />
                <Stat
                  label="ARV"
                  value={`${formatCurrency(TEST_PROPERTY.arvLow)} – ${formatCurrency(TEST_PROPERTY.arvHigh)}`}
                />
                <Stat label="Lot" value={`${TEST_PROPERTY.lotAcres} acres`} />
                <Stat
                  label="Year"
                  value={TEST_PROPERTY.yearBuilt?.toString() ?? "—"}
                />
                <Stat label="Garage" value={`${TEST_PROPERTY.garageSpaces} stalls`} />
                <Stat
                  label="Condition"
                  value={TEST_PROPERTY.condition ?? "—"}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phase Health</CardTitle>
              <CardDescription>Quick read on budget & timeline.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="font-medium">
                    {formatCurrency(SAMPLE_BUDGET_RANGE[0])} – {formatCurrency(SAMPLE_BUDGET_RANGE[1])}
                  </span>
                </div>
                <Progress value={32} className="mt-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Timeline</span>
                  <span className="font-medium">Week 1 of 12</span>
                </div>
                <Progress value={8} className="mt-2" />
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">Next step</p>
                <div className="flex items-center justify-between rounded-lg border border-dashed bg-muted/40 px-3 py-2">
                  <div>
                    <p className="font-medium">Upload photos for scope detection</p>
                    <p className="text-xs text-muted-foreground">Phase 1 · Capture</p>
                  </div>
                  <Button size="sm">Start</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-3 shadow-sm">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold leading-tight">{value}</p>
    </div>
  );
}
