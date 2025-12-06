import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ScopeReview } from "@/components/questionnaire/scope-review";
import { getProperty } from "@/lib/properties/actions";
import { getScopeItems } from "@/lib/questionnaire/actions";
import { getUser } from "@/lib/supabase/server";

export default async function ScopeReviewPage({
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

  if (items.length === 0) {
    redirect(`/properties/${id}/scope/questionnaire`);
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/properties/${id}/scope/questionnaire`}
          className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to questionnaire
        </Link>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Review Your Scope</h2>
          <p className="text-sm text-muted-foreground">
            Review and adjust the generated scope items before building your budget
          </p>
        </div>
      </div>

      <ScopeReview propertyId={id} items={items} />
    </div>
  );
}

