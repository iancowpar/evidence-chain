import type { Signal } from "../store";

export type DecisionImpact = {
  changed: string;
  pressure: "Ship now" | "Learn more" | "Defer" | "Narrow scope";
  riskRaised: string;
  memoInfluence: string;
};

// Curated impact copy for the seeded demo signals. Used both to seed the
// store and to re-attach the right copy when migrating older persisted state.
export const SEEDED_IMPACTS: Record<string, DecisionImpact> = {
  "signal-file-localhost": {
    changed: "Moved source visibility into the core trust surface.",
    pressure: "Ship now",
    riskRaised:
      "Users may perceive intact local data as lost when the app origin changes.",
    memoInfluence: "Supports the primary risk and success metric.",
  },
  "signal-cloud-hidden": {
    changed: "Kept sync controls secondary while adding lightweight state reassurance.",
    pressure: "Narrow scope",
    riskRaised:
      "Putting sync configuration back in the hero could make daily logging feel technical.",
    memoInfluence: "Supports the tradeoff between trust cues and daily focus.",
  },
  "signal-pin-recovery": {
    changed:
      "Expanded recovery copy and auth-state clarity without creating a new recovery flow.",
    pressure: "Ship now",
    riskRaised:
      "Blocked recovery can break the daily habit and damage confidence in saved data.",
    memoInfluence: "Supports the rationale for visible state and recovery affordances.",
  },
};

// Impact shown when no signal is selected — summarizes the pattern as a whole.
export const PATTERN_FALLBACK: DecisionImpact = {
  changed: "Summarizes the pattern-level evidence behind the decision.",
  pressure: "Ship now",
  riskRaised: "Pattern may need more evidence before scaling beyond the MVP.",
  memoInfluence: "Supports the pattern-level decision memo.",
};

// Derive an impact for a captured signal from its type and severity. Every
// signal carries its own impact in the store; this is how new ones get one.
export function deriveImpact(input: Pick<Signal, "type" | "severity">): DecisionImpact {
  return {
    changed: `Adds ${input.type.toLowerCase()} evidence to the active pattern.`,
    pressure: input.severity === "Low" ? "Learn more" : "Ship now",
    riskRaised: "Requires triad review before changing scope.",
    memoInfluence: "Supports the evidence contribution field.",
  };
}

// Resolve the impact to store on a signal by id: curated copy for seeded
// signals, derived copy for everything else.
export function impactForId(
  input: Pick<Signal, "id" | "type" | "severity">,
): DecisionImpact {
  return SEEDED_IMPACTS[input.id] ?? deriveImpact(input);
}

// Read the impact for the currently selected signal (or the pattern fallback).
export function impactFor(signal?: Signal): DecisionImpact {
  return signal?.impact ?? PATTERN_FALLBACK;
}
