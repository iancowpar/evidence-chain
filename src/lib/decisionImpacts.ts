import type { Signal } from "../store";

export type DecisionImpact = {
  changed: string;
  pressure: "Ship now" | "Learn more" | "Defer" | "Narrow scope";
  riskRaised: string;
  memoInfluence: string;
};

const decisionImpacts: Record<string, DecisionImpact> = {
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

const fallbackDecisionImpact = (signal?: Signal): DecisionImpact => ({
  changed: signal
    ? `Adds ${signal.type.toLowerCase()} evidence to the active pattern.`
    : "Summarizes the pattern-level evidence behind the decision.",
  pressure: signal?.severity === "Low" ? "Learn more" : "Ship now",
  riskRaised: signal
    ? "Requires triad review before changing scope."
    : "Pattern may need more evidence before scaling beyond the MVP.",
  memoInfluence: signal
    ? "Supports the evidence contribution field."
    : "Supports the pattern-level decision memo.",
});

export const impactFor = (signal?: Signal): DecisionImpact =>
  decisionImpacts[signal?.id ?? ""] ?? fallbackDecisionImpact(signal);
