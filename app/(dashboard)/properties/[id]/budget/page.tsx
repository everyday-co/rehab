import { notFound, redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProperty } from "@/lib/properties/actions";
import { getScopeItems } from "@/lib/questionnaire/actions";
import { getUser } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export default async function BudgetPage({
  params,
}: {
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

  const items = await getScopeItems(id);
  const includedItems = items.filter((i) => i.is_included);
  
  const totalLow = includedItems.reduce(
    (sum, i) => sum + i.quantity * i.cost_low,
    0
  );
  const totalHigh = includedItems.reduce(
    (sum, i) => sum + i.quantity * i.cost_high,
    0
  );

  // Group by category for display
  const categories = includedItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  return (
    <div className="space-y-6">
      <div>
        <Badge className="mb-2 bg-phase-2">Phase 2</Badge>
        <h2 className="text-lg font-semibold">Budget & Optimize</h2>
        <p className="text-sm text-muted-foreground">
          Build a budget that maximizes your profit
        </p>
      </div>

      {/* Budget summary */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Summary</CardTitle>
          <CardDescription>
            Based on {includedItems.length} scope items from Phase 1
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Estimated Rehab</p>
              <p className="text-2xl font-bold">
                {formatCurrency(totalLow)} – {formatCurrency(totalHigh)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Purchase Price</p>
              <p className="text-2xl font-bold">
                {formatCurrency(property.purchase_price)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Target ARV</p>
              <p className="text-2xl font-bold">
                {formatCurrency(property.arv_high)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Projected Profit</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  (property.arv_high ?? 0) -
                    (property.purchase_price ?? 0) -
                    totalHigh * 1.1
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories breakdown */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(categories).map(([category, categoryItems]) => {
          const catLow = categoryItems.reduce(
            (sum, i) => sum + i.quantity * i.cost_low,
            0
          );
          const catHigh = categoryItems.reduce(
            (sum, i) => sum + i.quantity * i.cost_high,
            0
          );

          return (
            <Card key={category}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{category}</CardTitle>
                <CardDescription>{categoryItems.length} items</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {formatCurrency(catLow)} – {formatCurrency(catHigh)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Coming soon notice */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>More features coming soon</CardTitle>
          <CardDescription>
            Full budget optimization, timeline planning, and contractor documents
            will be available in the next release.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>AI-powered budget recommendations</li>
            <li>Build Your Own mode with cost database</li>
            <li>Scenario comparison (Conservative/Base/Premium)</li>
            <li>ROI optimizer suggestions</li>
            <li>Gantt chart timeline with holding cost calculator</li>
            <li>Scope of Work and bid sheet generation</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

