"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { PropertyForm } from "@/components/properties/property-form";
import { PropertyIntake, EnrichmentPreview } from "@/components/properties/property-intake";
import type { EnrichmentResult } from "@/lib/enrichment/types";
import type { PropertyFormValues } from "@/lib/validations";

type IntakeStep = "intake" | "preview" | "form";

export default function NewPropertyPage() {
  const [step, setStep] = useState<IntakeStep>("intake");
  const [enrichmentResult, setEnrichmentResult] = useState<EnrichmentResult | null>(null);
  const [formDefaults, setFormDefaults] = useState<Partial<PropertyFormValues>>({});

  // Check if enrichment is enabled via env
  const isEnrichmentEnabled = process.env.NEXT_PUBLIC_ENABLE_PROPERTY_ENRICHMENT !== "false";

  const handleEnrichmentComplete = (result: EnrichmentResult) => {
    setEnrichmentResult(result);
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
    setFormDefaults({});
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
          description={
            step === "intake"
              ? "Enter an address or listing URL to get started"
              : step === "preview"
              ? "Review the property details we found"
              : "Enter the property details to start your flip"
          }
        />
      </div>

      {/* Step 1: Intake */}
      {step === "intake" && isEnrichmentEnabled && (
        <PropertyIntake
          onEnrichmentComplete={handleEnrichmentComplete}
          onSkip={handleSkipToForm}
          isEnabled={isEnrichmentEnabled}
        />
      )}

      {/* Step 2: Preview */}
      {step === "preview" && enrichmentResult && (
        <div className="space-y-4">
          <EnrichmentPreview
            result={enrichmentResult}
            onAccept={handleAcceptEnrichment}
            onEdit={handleEditEnrichment}
          />
          <button
            type="button"
            onClick={handleBackToIntake}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Try a different address
          </button>
        </div>
      )}

      {/* Step 3: Form (always shown if intake is disabled or skipped) */}
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
