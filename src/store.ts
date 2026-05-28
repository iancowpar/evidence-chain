import { create } from "zustand";
import { persist } from "zustand/middleware";
import { deriveImpact, impactForId, type DecisionImpact } from "./lib/decisionImpacts";

export type SignalType =
  | "Customer pain"
  | "UX friction"
  | "Reliability issue"
  | "Revenue request"
  | "Strategic opportunity"
  | "Stakeholder ask";

export type Signal = {
  id: string;
  title: string;
  source: string;
  type: SignalType;
  userSegment: string;
  quoteOrObservation: string;
  severity: "Low" | "Medium" | "High";
  createdAt: string;
  linkedPatternId: string;
  // How this signal pressured the decision. Curated for seeded signals,
  // derived from type/severity for captured ones. See lib/decisionImpacts.
  impact: DecisionImpact;
};

export type TriadReview = {
  productOutcome: string;
  scopeFit: string;
  designFriction: string;
  toneRisk: string;
  engineeringRisk: string;
  stateReliabilityConcern: string;
  confidence: "Low" | "Medium" | "High";
};

export type Pattern = {
  id: string;
  title: string;
  description: string;
  linkedSignalIds: string[];
  opportunityStatement: string;
  priority: "P0" | "P1" | "P2";
  triadReview: TriadReview;
};

export type Decision = {
  id: string;
  patternId: string;
  optionsConsidered: string[];
  decision: string;
  rationale: string;
  risks: string;
  successMetric: string;
  status: "Decided" | "In progress" | "Shipped" | "Learning";
  followUpDate: string;
};

export type ShipLogEntry = {
  id: string;
  decisionId: string;
  shippedChange: string;
  shippedAt: string;
  result: string;
  learning: string;
};

type DraftSignal = Omit<Signal, "id" | "createdAt" | "linkedPatternId" | "impact">;

type EvidenceStore = {
  signals: Signal[];
  patterns: Pattern[];
  decisions: Decision[];
  shipLog: ShipLogEntry[];
  selectedPatternId: string;
  addSignal: (signal: DraftSignal) => void;
  updateDecision: (id: string, field: keyof Decision, value: string) => void;
  updateShipLog: (id: string, field: keyof ShipLogEntry, value: string) => void;
  resetDemo: () => void;
};

const demoPatternId = "pattern-sync-trust";
const demoDecisionId = "decision-sync-trust";
const demoShipId = "ship-sync-trust";

const demoSignalSeeds: Omit<Signal, "impact">[] = [
  {
    id: "signal-file-localhost",
    title: "Data appears missing across origins",
    source: "User testing",
    type: "Reliability issue",
    userSegment: "Daily logger",
    quoteOrObservation:
      "I thought my data disappeared when I switched from file:// to localhost.",
    severity: "High",
    createdAt: "2026-05-26",
    linkedPatternId: demoPatternId,
  },
  {
    id: "signal-cloud-hidden",
    title: "Cloud Sync is cleaner but too hidden",
    source: "UX audit",
    type: "UX friction",
    userSegment: "Returning user",
    quoteOrObservation:
      "The daily view feels calmer, but users may not know where sync status lives.",
    severity: "Medium",
    createdAt: "2026-05-26",
    linkedPatternId: demoPatternId,
  },
  {
    id: "signal-pin-recovery",
    title: "PIN recovery feels blocked",
    source: "Support simulation",
    type: "Customer pain",
    userSegment: "Locked-out user",
    quoteOrObservation:
      "Session-expired recovery can feel brittle when the PIN overlay appears first.",
    severity: "High",
    createdAt: "2026-05-26",
    linkedPatternId: demoPatternId,
  },
];

const demoSignals: Signal[] = demoSignalSeeds.map((seed) => ({
  ...seed,
  impact: impactForId(seed),
}));

const demoPattern: Pattern = {
  id: demoPatternId,
  title: "Users do not trust whether their data is saved or synced",
  description:
    "Multiple signals point to the same product risk: users can lose confidence in saved data even when the underlying state is intact.",
  linkedSignalIds: demoSignals.map((signal) => signal.id),
  opportunityStatement:
    "How might we make data source and recovery state visible enough to build trust without making the daily logging surface feel technical?",
  priority: "P0",
  triadReview: {
    productOutcome: "Protect daily logging trust and reduce perceived data loss.",
    scopeFit:
      "In scope because trust is a prerequisite for repeat behavior and retention.",
    designFriction:
      "Sync and recovery cues are split across surfaces, so users have to infer state.",
    toneRisk: "Over-explaining state could make the product feel fragile or technical.",
    engineeringRisk:
      "Origin-specific local storage, session state, and PIN recovery need explicit handling.",
    stateReliabilityConcern:
      "Users need clear feedback when state is local, cloud-backed, stale, or recoverable.",
    confidence: "High",
  },
};

const demoDecision: Decision = {
  id: demoDecisionId,
  patternId: demoPatternId,
  optionsConsidered: [
    "Move Cloud Sync back into the primary hero",
    "Add a persistent source chip with recovery affordances",
    "Create a separate recovery mode screen",
  ],
  decision:
    "Add a visible source/status chip and clearer recovery copy while keeping setup controls out of the primary daily scan path.",
  rationale:
    "The signal is about trust, not configuration. Users need enough state to feel safe, but the daily product should still prioritize one next action.",
  risks:
    "The chip may become visual noise if it shows too often. Recovery copy must be direct without implying data is unsafe.",
  successMetric:
    "Users can explain where their data is stored and recover access in under 30 seconds during testing.",
  status: "Shipped",
  followUpDate: "2026-06-02",
};

const demoShipLog: ShipLogEntry = {
  id: demoShipId,
  decisionId: demoDecisionId,
  shippedChange:
    "Source chip, canonical URL warning, clearer auth status, and recovery copy were added to reduce perceived data-loss risk.",
  shippedAt: "2026-05-26",
  result:
    "Daily hierarchy stayed calm while trust-critical state became visible when it mattered.",
  learning:
    "Maintenance products win when state confidence is built into the workflow instead of hidden in settings.",
};

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const initialState = {
  signals: demoSignals,
  patterns: [demoPattern],
  decisions: [demoDecision],
  shipLog: [demoShipLog],
  selectedPatternId: demoPatternId,
};

export const useEvidenceStore = create<EvidenceStore>()(
  persist(
    (set) => ({
      ...initialState,
      addSignal: (signal) =>
        set((state) => {
          const createdSignal: Signal = {
            ...signal,
            id: createId(),
            createdAt: new Date().toISOString().slice(0, 10),
            linkedPatternId: state.selectedPatternId,
            impact: deriveImpact(signal),
          };

          return {
            signals: [createdSignal, ...state.signals],
            patterns: state.patterns.map((pattern) =>
              pattern.id === state.selectedPatternId
                ? {
                    ...pattern,
                    linkedSignalIds: [createdSignal.id, ...pattern.linkedSignalIds],
                  }
                : pattern,
            ),
          };
        }),
      updateDecision: (id, field, value) =>
        set((state) => ({
          decisions: state.decisions.map((decision) =>
            decision.id === id
              ? {
                  ...decision,
                  [field]:
                    field === "optionsConsidered"
                      ? value.split("\n").filter(Boolean)
                      : value,
                }
              : decision,
          ),
        })),
      updateShipLog: (id, field, value) =>
        set((state) => ({
          shipLog: state.shipLog.map((entry) =>
            entry.id === id ? { ...entry, [field]: value } : entry,
          ),
        })),
      resetDemo: () => set(initialState),
    }),
    {
      name: "evidence-chain-demo",
      version: 2,
      // Runs whenever the persisted version is older than the current one.
      // Pre-versioning storage is treated as version 0, so this also guards
      // against corrupt or incompatible state written before we added a
      // version. Bump `version` and extend this when a type shape changes.
      migrate: (persisted) => {
        const state = persisted as Partial<EvidenceStore> | undefined;
        if (
          !state ||
          !Array.isArray(state.signals) ||
          !Array.isArray(state.patterns) ||
          !Array.isArray(state.decisions) ||
          !Array.isArray(state.shipLog) ||
          !state.selectedPatternId
        ) {
          return initialState;
        }
        // v2 added `impact` to every Signal. Back-fill it for signals saved
        // before the field existed so the UI never reads `undefined`.
        const signals = state.signals.map((signal) =>
          signal.impact ? signal : { ...signal, impact: impactForId(signal) },
        );
        return { ...state, signals };
      },
    },
  ),
);
