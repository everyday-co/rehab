import Link from "next/link";
import {
  ArrowRight,
  Camera,
  DollarSign,
  Hammer,
  Award,
  LayoutDashboard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const phases = [
  {
    icon: Camera,
    title: "Scope Detect",
    description: "Figure out what the property needs with guided questionnaires",
    color: "bg-phase-1",
  },
  {
    icon: DollarSign,
    title: "Budget & Optimize",
    description: "Build a smart, market-aligned budget with AI recommendations",
    color: "bg-phase-2",
  },
  {
    icon: Hammer,
    title: "Build & Track",
    description: "Monitor progress, track costs, and manage change orders",
    color: "bg-phase-3",
  },
  {
    icon: Award,
    title: "Close & Learn",
    description: "Capture learnings to improve future flip estimates",
    color: "bg-phase-4",
  },
];

export default async function HomePage() {
  const user = await getUser();

  // Redirect authenticated users to properties
  if (user) {
    redirect("/properties");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Fix & Flip Tracker</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Fix & Flip Rehab Tracker
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              The most intuitive, data-driven fix & flip deal analysis and
              project tracking tool. Maximize ROI with intelligent rehab
              budgeting and market-aligned finish selection.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg">
                  Start your first flip
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Phases */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              The Conveyor Belt Workflow
            </h2>
            <p className="mt-2 text-muted-foreground">
              Scope → Budget → Build → Close
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              return (
                <Card key={phase.title} className="relative overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-1 w-full ${phase.color}`}
                  />
                  <CardHeader>
                    <div
                      className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${phase.color} text-white`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Phase {index + 1}
                      </span>
                    </CardTitle>
                    <CardDescription className="text-base font-semibold text-foreground">
                      {phase.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {phase.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">
            Ready to maximize your flip profits?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Start tracking your fix & flip projects today.
          </p>
          <div className="mt-6">
            <Link href="/signup">
              <Button size="lg">
                Create free account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>&copy; 2025 Fix & Flip Tracker. Built for real estate investors.</p>
        </div>
      </footer>
    </div>
  );
}
