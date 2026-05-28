import { X } from "lucide-react";
import { useEffect } from "react";
import type { Decision, Pattern, ShipLogEntry, Signal } from "../store";
import type { DecisionImpact } from "../lib/decisionImpacts";

export function DecisionBrief({
  decision,
  impact,
  onClose,
  pattern,
  selectedSignal,
  shipped,
  signals,
}: {
  decision: Decision;
  impact: DecisionImpact;
  onClose: () => void;
  pattern: Pattern;
  selectedSignal?: Signal;
  shipped: ShipLogEntry;
  signals: Signal[];
}) {
  const keySignals = signals.slice(0, 3);

  // Close on Escape, and lock body scroll while the modal is open.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="brief-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Decision brief"
      onClick={onClose}
    >
      <section className="decision-brief" onClick={(event) => event.stopPropagation()}>
        <div className="brief-header">
          <div>
            <span className="eyebrow">Decision Brief</span>
            <h2>{pattern.title}</h2>
            <p>{pattern.opportunityStatement}</p>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            title="Close brief"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="brief-summary">
          <BriefBlock label="Decision" value={decision.decision} />
          <BriefBlock label="Tradeoff accepted" value={impact.changed} />
          <BriefBlock label="Primary risk" value={decision.risks} />
          <BriefBlock label="Success metric" value={decision.successMetric} />
        </div>

        <div className="brief-body">
          <article>
            <span className="eyebrow">Evidence Summary</span>
            <h3>{signals.length} signals converged on one trust pattern.</h3>
            <ul>
              {keySignals.map((signal) => (
                <li key={signal.id}>
                  <strong>{signal.title}</strong>
                  <span>
                    {signal.type} · {signal.source}
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <article>
            <span className="eyebrow">Triad Review</span>
            <h3>Product, design, and engineering reached the same decision surface.</h3>
            <dl>
              <div>
                <dt>Product</dt>
                <dd>{pattern.triadReview.productOutcome}</dd>
              </div>
              <div>
                <dt>Design</dt>
                <dd>{pattern.triadReview.designFriction}</dd>
              </div>
              <div>
                <dt>Engineering</dt>
                <dd>{pattern.triadReview.stateReliabilityConcern}</dd>
              </div>
            </dl>
          </article>

          <article>
            <span className="eyebrow">Selected Signal Impact</span>
            <h3>{selectedSignal?.title ?? "Pattern-level decision"}</h3>
            <p>{selectedSignal?.quoteOrObservation ?? pattern.description}</p>
            <dl>
              <div>
                <dt>Pressure</dt>
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
          </article>

          <article>
            <span className="eyebrow">Shipped Learning</span>
            <h3>{shipped.shippedChange}</h3>
            <p>{shipped.learning}</p>
            <footer>
              <span>Status: {decision.status}</span>
              <span>Follow-up: {decision.followUpDate}</span>
            </footer>
          </article>
        </div>
      </section>
    </div>
  );
}

function BriefBlock({ label, value }: { label: string; value: string }) {
  return (
    <article className="brief-block">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
