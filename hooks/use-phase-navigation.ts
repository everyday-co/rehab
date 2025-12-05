import { useMemo } from "react";

import { PHASES } from "@/lib/constants";
import type { PhaseId } from "@/types";

export function usePhaseNavigation(currentPhase: PhaseId) {
  return useMemo(() => {
    const index = PHASES.findIndex((phase) => phase.id === currentPhase);
    const previous = index > 0 ? PHASES[index - 1] : null;
    const next = index < PHASES.length - 1 ? PHASES[index + 1] : null;

    return {
      current: PHASES[index] ?? null,
      previous,
      next,
      isFirst: index <= 0,
      isLast: index === PHASES.length - 1,
    };
  }, [currentPhase]);
}
