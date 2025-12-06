import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { QuestionnaireForm } from "@/components/questionnaire/questionnaire-form";
import { getProperty } from "@/lib/properties/actions";
import { getUser } from "@/lib/supabase/server";

export default async function QuestionnairePage({
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
        <Link
          href={`/properties/${id}/scope`}
          className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to capture methods
        </Link>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Scope Questionnaire</h2>
          <p className="text-sm text-muted-foreground">
            Answer questions about each area to generate your scope of work
          </p>
        </div>
      </div>

      <QuestionnaireForm propertyId={id} />
    </div>
  );
}

