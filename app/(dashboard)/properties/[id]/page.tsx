import { redirect, notFound } from "next/navigation";
import { getProperty } from "@/lib/properties/actions";
import { getUser } from "@/lib/supabase/server";

// This page just redirects to the current phase
export default async function PropertyDetailPage({
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

  // Redirect to current phase
  const phaseRoutes: Record<number, string> = {
    1: "scope",
    2: "budget",
    3: "build",
    4: "review",
  };

  const route = phaseRoutes[property.current_phase] ?? "scope";
  redirect(`/properties/${id}/${route}`);
}
