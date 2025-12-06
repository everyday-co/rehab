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

export default async function BuildPage({
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
        <Badge className="mb-2 bg-phase-3">Phase 3</Badge>
        <h2 className="text-lg font-semibold">Build & Track</h2>
        <p className="text-sm text-muted-foreground">
          Stay on budget and on schedule during construction
        </p>
      </div>

      {/* Coming soon notice */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Build & Track features coming soon</CardTitle>
          <CardDescription>
            Project tracking, cost monitoring, and photo documentation will be
            available in the next release.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
            <li>Progress dashboard with status cards</li>
            <li>Budget vs actual cost tracking</li>
            <li>Expense logging with receipt uploads</li>
            <li>Change order management</li>
            <li>Photo documentation by room and stage</li>
            <li>Before/after comparison generator</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

