import Link from "next/link";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { PropertyList } from "@/components/properties/property-list";
import { getProperties } from "@/lib/properties/actions";
import { getUser } from "@/lib/supabase/server";

export default async function PropertiesPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const properties = await getProperties();

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Properties"
        description="Manage your fix & flip projects"
      >
        <Link href="/properties/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Property
          </Button>
        </Link>
      </PageHeader>

      <PropertyList properties={properties} />
    </div>
  );
}
