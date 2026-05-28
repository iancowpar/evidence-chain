import {
  CircleDot,
  Layers3,
  Lightbulb,
  PackageCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Decision, Pattern, ShipLogEntry, Signal } from "../store";
import type { DecisionImpact } from "../lib/decisionImpacts";

export function EvidenceChainSection({
  pattern,
  patternSignals,
  decision,
  shipped,
  selectedSignal,
  selectedImpact,
}: {
  pattern: Pattern;
  patternSignals: Signal[];
  decision: Decision;
  shipped: ShipLogEntry;
  selectedSignal?: Signal;
  selectedImpact: DecisionImpact;
}) {
  const traceLabels = {
    signal: selectedSignal?.source ?? "Signal input",
    pattern: `${patternSignals.length} related inputs`,
    triad: selectedSignal
      ? `${selectedSignal.severity} ${selectedSignal.type}`
      : `Confidence ${pattern.triadReview.confidence}`,
    decision: selectedImpact.pressure,
    shipped: "Source chip added",
    learning: "Trust gap reduced",
  };

  return (
    <section id="evidence" className="section-grid">
      <div className="section-header">
        <div>
          <span className="eyebrow">Core Artifact</span>
          <h2>Evidence Chain</h2>
        </div>
        <p>
          The MVP starts here: one visible path from messy signal to shipped learning.
        </p>
      </div>

      <div className="trace-workbench">
        <div className="chain" aria-label="Selected signal trace">
          <ChainNode
            stage="signal"
            isActive={Boolean(selectedSignal)}
            icon={<CircleDot size={18} />}
            label="Raw Signals"
            proofLabel={traceLabels.signal}
            title={selectedSignal?.title ?? `${patternSignals.length} inputs`}
            body={
              selectedSignal
                ? selectedSignal.quoteOrObservation
                : patternSignals.map((signal) => signal.title).join(" · ")
            }
          />
          <ChainNode
            stage="pattern"
            isActive={Boolean(selectedSignal)}
            icon={<Sparkles size={18} />}
            label="Pattern"
            proofLabel={traceLabels.pattern}
            title={pattern.title}
            body={pattern.opportunityStatement}
          />
          <ChainNode
            stage="triad"
            isActive={Boolean(selectedSignal)}
            icon={<Layers3 size={18} />}
            label="Triad Review"
            proofLabel={traceLabels.triad}
            title="Outcome, clarity, and reliability converge"
            body={`${pattern.triadReview.productOutcome} ${pattern.triadReview.stateReliabilityConcern}`}
          />
          <ChainNode
            stage="decision"
            isActive={Boolean(selectedSignal)}
            icon={<Lightbulb size={18} />}
            label="Decision"
            proofLabel={traceLabels.decision}
            title={decision.decision}
            body={decision.rationale}
          />
          <ChainNode
            stage="shipped"
            isActive={Boolean(selectedSignal)}
            icon={<PackageCheck size={18} />}
            label="Shipped Change"
            proofLabel={traceLabels.shipped}
            title={shipped.shippedChange}
            body={shipped.result}
          />
          <ChainNode
            stage="learning"
            isActive={Boolean(selectedSignal)}
            icon={<RotateCcw size={18} />}
            label="Learning"
            proofLabel={traceLabels.learning}
            title="The loop creates reusable product judgment"
            body={shipped.learning}
          />
        </div>

        <SelectedEvidence
          signal={selectedSignal}
          impact={selectedImpact}
          pattern={pattern}
        />
      </div>
    </section>
  );
}

function ChainNode({
  stage,
  isActive,
  icon,
  label,
  proofLabel,
  title,
  body,
}: {
  stage: "signal" | "pattern" | "triad" | "decision" | "shipped" | "learning";
  isActive: boolean;
  icon: ReactNode;
  label: string;
  proofLabel: string;
  title: string;
  body: string;
}) {
  return (
    <article className={`chain-node ${stage} ${isActive ? "is-active" : ""}`}>
      <div className="trace-head">
        <div className="chain-icon">{icon}</div>
        <span className="proof-label">{proofLabel}</span>
      </div>
      <div>
        <span className="eyebrow">{label}</span>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </article>
  );
}

function SelectedEvidence({
  signal,
  impact,
  pattern,
}: {
  signal?: Signal;
  impact: DecisionImpact;
  pattern: Pattern;
}) {
  if (!signal) {
    return (
      <aside className="selected-evidence" aria-label="Selected evidence">
        <span className="eyebrow">Selected Evidence</span>
        <h3>Select a signal to inspect its decision trail.</h3>
      </aside>
    );
  }

  return (
    <aside className="selected-evidence" aria-label="Selected evidence">
      <div className="selected-heading">
        <span className="eyebrow">Selected Evidence</span>
        <span className={`status-chip ${signal.severity.toLowerCase()}`}>
          {signal.severity}
        </span>
      </div>
      <h3>{signal.title}</h3>
      <blockquote>{signal.quoteOrObservation}</blockquote>
      <dl>
        <div>
          <dt>Source</dt>
          <dd>{signal.source}</dd>
        </div>
        <div>
          <dt>Segment</dt>
          <dd>{signal.userSegment}</dd>
        </div>
        <div>
          <dt>Pattern</dt>
          <dd>
            {pattern.priority} · {pattern.title}
          </dd>
        </div>
        <div className="impact-row">
          <dt>Decision impact</dt>
          <dd>{impact.changed}</dd>
        </div>
        <div>
          <dt>Decision pressure</dt>
          <dd>{impact.pressure}</dd>
        </div>
        <div>
          <dt>Risk raised</dt>
          <dd>{impact.riskRaised}</dd>
        </div>
        <div>
          <dt>Memo influence</dt>
          <dd>{impact.memoInfluence}</dd>
        </div>
      </dl>
    </aside>
  );
}
