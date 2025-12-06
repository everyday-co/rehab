import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function PortfolioPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio"
        description="Track your completed flips and overall performance"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Flips</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Profit</CardDescription>
            <CardTitle className="text-3xl">$0</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average ROI</CardDescription>
            <CardTitle className="text-3xl">—%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Time to Flip</CardDescription>
            <CardTitle className="text-3xl">— weeks</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Completed Flips</CardTitle>
          <CardDescription>
            Your flip history will appear here after you complete projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                No completed flips yet
              </p>
              <p className="text-xs text-muted-foreground">
                Complete your first project to see portfolio analytics
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

