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
import { getUser } from "@/lib/supabase/server";

export default async function ReviewPage({
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

  return (
    <div className="space-y-6">
      <div>
        <Badge className="mb-2 bg-phase-4">Phase 4</Badge>
        <h2 className="text-lg font-semibold">Close & Learn</h2>
        <p className="text-sm text-muted-foreground">
          Capture learnings to improve future estimates
        </p>
      </div>

      {/* Coming soon notice */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Close & Learn features coming soon</CardTitle>
          <CardDescription>
            Project retrospective and portfolio analytics will be available in
            the next release.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Sale information entry</li>
            <li>Projected vs actual analysis</li>
            <li>What worked / lessons learned documentation</li>
            <li>Portfolio dashboard with aggregate metrics</li>
            <li>Estimate accuracy tracking by category</li>
            <li>Personalized adjustment recommendations</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

