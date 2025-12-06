"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FooterActionsProps {
  onBack?: () => void;
  onContinue?: () => void;
  backLabel?: string;
  continueLabel?: string;
  backHref?: string;
  continueHref?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FooterActions({
  onBack,
  onContinue,
  backLabel = "Back",
  continueLabel = "Continue",
  backHref,
  continueHref,
  isLoading = false,
  disabled = false,
  className,
}: FooterActionsProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 flex items-center justify-between border-t bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6 lg:px-8",
        className
      )}
    >
      <div>
        {(onBack || backHref) && (
          <Button
            variant="ghost"
            onClick={onBack}
            disabled={isLoading}
            asChild={!!backHref}
          >
            {backHref ? (
              <a href={backHref}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {backLabel}
              </a>
            ) : (
              <>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {backLabel}
              </>
            )}
          </Button>
        )}
      </div>
      <div>
        {(onContinue || continueHref) && (
          <Button
            onClick={onContinue}
            disabled={isLoading || disabled}
            asChild={!!continueHref && !isLoading}
          >
            {continueHref && !isLoading ? (
              <a href={continueHref}>
                {continueLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            ) : (
              <>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {continueLabel}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

