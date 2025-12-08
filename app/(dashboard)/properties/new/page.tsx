"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { PropertyForm } from "@/components/properties/property-form";
import { PropertyIntake } from "@/components/properties/property-intake";
import { EnrichmentResultCard } from "@/components/properties/enrichment-result";
import { EnrichmentLoading } from "@/components/properties/enrichment-loading";
import { EnrichmentLoadingTimer } from "@/components/properties/enrichment-loading-timer";
import { ProgressSteps } from "@/components/ui/progress-steps";
import type { EnrichmentResult } from "@/lib/enrichment/types";
import type { PropertyFormValues } from "@/lib/validations";

type IntakeStep = "intake" | "loading" | "preview" | "form";
const STORAGE_KEY = "rehab:intake:enrichment";

export default function NewPropertyPage() {
  const [step, setStep] = useState<IntakeStep>("intake");
  const [enrichmentResult, setEnrichmentResult] = useState<EnrichmentResult | null>(null);
  const [formDefaults, setFormDefaults] = useState<Partial<PropertyFormValues>>({});

  // Check if enrichment is enabled via env
  const isEnrichmentEnabled = process.env.NEXT_PUBLIC_ENABLE_PROPERTY_ENRICHMENT !== "false";

  // Load persisted enrichment state for the session
  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.sessionStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      try {
        const parsed: EnrichmentResult = JSON.parse(saved);
        setEnrichmentResult(parsed);
        setFormDefaults(parsed.property);
        setStep("preview");
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const persistEnrichment = (result: EnrichmentResult | null) => {
    if (typeof window === "undefined") return;
    if (result) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    } else {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleEnrichmentComplete = (result: EnrichmentResult) => {
    setEnrichmentResult(result);
    persistEnrichment(result);
    setStep("preview");
  };

  const handleSkipToForm = () => {
    setStep("form");
    setFormDefaults({});
  };

  const handleAcceptEnrichment = () => {
    if (enrichmentResult) {
      setFormDefaults(enrichmentResult.property);
    }
    setStep("form");
  };

  const handleEditEnrichment = () => {
    if (enrichmentResult) {
      setFormDefaults(enrichmentResult.property);
    }
    setStep("form");
  };

  const handleBackToIntake = () => {
    setStep("intake");
    setEnrichmentResult(null);
    persistEnrichment(null);
    setFormDefaults({});
  };

  const handleEnrichmentStart = () => {
    setStep("loading");
  };

  const handleRerun = async () => {
    if (!enrichmentResult?.property.address) return;
    setStep("loading");
    try {
      const response = await fetch("/api/properties/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: enrichmentResult.property.address, force: true }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to re-run enrichment");
      }
      const result: EnrichmentResult = await response.json();
      setEnrichmentResult(result);
      persistEnrichment(result);
      setFormDefaults(result.property);
      setStep("preview");
    } catch (error) {
      console.error(error);
      setStep("preview");
    }
  };

  const handlePhotosChange = (photos: EnrichmentResult["photos"]) => {
    if (!enrichmentResult) return;
    const next: EnrichmentResult = {
      ...enrichmentResult,
      photos,
    };
    setEnrichmentResult(next);
    persistEnrichment(next);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/properties"
          className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to properties
        </Link>
        <PageHeader
          title="New Property"
          description="Add your property with guided enrichment"
        />
        <div className="mt-3">
          <ProgressSteps
            current={step === "intake" ? 1 : step === "loading" ? 2 : step === "preview" ? 3 : 4}
            total={4}
            label={
              step === "intake"
                ? "Step 1: Find your property"
                : step === "loading"
                ? "Step 2: Enriching…"
                : step === "preview"
                ? "Step 3: Review & confirm"
                : "Step 4: Finalize details"
            }
          />
        </div>
      </div>

      {/* Step 1: Intake */}
      {step === "intake" && isEnrichmentEnabled && (
        <PropertyIntake
          onEnrichmentComplete={handleEnrichmentComplete}
          onSkip={handleSkipToForm}
          onStart={handleEnrichmentStart}
          isEnabled={isEnrichmentEnabled}
        />
      )}

      {/* Step 2: Loading */}
      {step === "loading" && isEnrichmentEnabled && (
        <div className="space-y-3">
          <EnrichmentLoading />
          <EnrichmentLoadingTimer />
          <div className="text-xs text-muted-foreground">
            If this takes longer than 8s, we’ll retry briefly and then stop to avoid using up your quota. You can re-run to try again.
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === "preview" && enrichmentResult && (
        <div className="space-y-4">
          <EnrichmentResultCard
            result={enrichmentResult}
            onAccept={handleAcceptEnrichment}
            onEdit={handleEditEnrichment}
            onRerun={handleRerun}
            onPhotosChange={handlePhotosChange}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <button
              type="button"
              onClick={handleBackToIntake}
              className="hover:text-foreground underline-offset-4 hover:underline"
            >
              ← Try a different address
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Form (always shown if intake is disabled or skipped) */}
      {(step === "form" || !isEnrichmentEnabled) && (
        <div className="space-y-4">
          {step === "form" && isEnrichmentEnabled && (
            <button
              type="button"
              onClick={handleBackToIntake}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back to auto-fill
            </button>
          )}
          <PropertyForm
            defaultValues={formDefaults}
            enrichmentResult={enrichmentResult}
          />
        </div>
      )}
    </div>
  );
}
