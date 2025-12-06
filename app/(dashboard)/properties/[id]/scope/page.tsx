import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Camera, ClipboardList, Video, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";

const captureMethods = [
  {
    id: "photos",
    icon: Camera,
    title: "Photo Upload",
    description: "Upload 5-15 photos and AI will detect issues",
    time: "5-10 min",
    accuracy: "High",
    available: false,
    comingSoon: true,
  },
  {
    id: "video",
    icon: Video,
    title: "Video Walkthrough",
    description: "Record a quick walkthrough for most accurate scope",
    time: "10-15 min",
    accuracy: "Very High",
    available: false,
    comingSoon: true,
  },
  {
    id: "questionnaire",
    icon: ClipboardList,
    title: "Questionnaire",
    description: "Answer guided questions about each room and system",
    time: "15-20 min",
    accuracy: "Good",
    available: true,
    recommended: true,
  },
];

export default async function ScopePage({
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
        <h2 className="text-lg font-semibold">Scope Detection</h2>
        <p className="text-sm text-muted-foreground">
          Choose how you&apos;d like to identify what work the property needs
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {captureMethods.map((method) => {
          const Icon = method.icon;
          return (
            <Card
              key={method.id}
              className={cn(
                "relative transition-all",
                method.available
                  ? "cursor-pointer hover:border-primary hover:shadow-md"
                  : "opacity-60"
              )}
            >
              {method.recommended && (
                <Badge
                  className="absolute right-3 top-3 bg-phase-1"
                  variant="default"
                >
                  Recommended
                </Badge>
              )}
              {method.comingSoon && (
                <Badge
                  className="absolute right-3 top-3"
                  variant="secondary"
                >
                  Coming Soon
                </Badge>
              )}
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-base">{method.title}</CardTitle>
                <CardDescription>{method.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Time</span>
                  <span>{method.time}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span>{method.accuracy}</span>
                </div>
                {method.available ? (
                  <Link href={`/properties/${id}/scope/questionnaire`}>
                    <Button className="w-full">
                      Start Questionnaire
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button className="w-full" disabled>
                    Coming Soon
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick stats about what this phase will produce */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">What happens next?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="list-inside list-disc space-y-1">
            <li>Answer questions about each area of the property</li>
            <li>System generates a detailed scope of work</li>
            <li>Review and adjust items before building your budget</li>
            <li>Progress is saved automatically - you can continue later</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

