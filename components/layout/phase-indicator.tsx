"use client";

import React from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PHASES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { PhaseId } from "@/types";

interface PhaseIndicatorProps {
  currentPhase?: PhaseId;
  onSelectPhase?: (phase: PhaseId) => void;
}

export function PhaseIndicator({
  currentPhase = 1,
  onSelectPhase,
}: PhaseIndicatorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {PHASES.map((phase, index) => {
        const isActive = currentPhase === phase.id;
        const isComplete = currentPhase > phase.id;
        const Icon = phase.icon;

        return (
          <React.Fragment key={phase.id}>
            <Button
              variant={isActive ? "default" : isComplete ? "secondary" : "ghost"}
              className={cn(
                "gap-2 border border-border shadow-sm",
                isActive && phase.accentClass,
                isComplete && "bg-secondary text-foreground"
              )}
              onClick={
                onSelectPhase ? () => onSelectPhase(phase.id) : undefined
              }
            >
              {isComplete ? (
                <Check className="h-4 w-4" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
              <span className="hidden md:inline">{phase.name}</span>
            </Button>
            {index < PHASES.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-10 rounded-full",
                  isComplete ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
