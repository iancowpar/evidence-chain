import { Printer } from "lucide-react";
import type { Decision, Pattern, Signal } from "../store";
import type { DecisionImpact } from "../lib/decisionImpacts";

export function ExecutiveMemo({
  decision,
  pattern,
  selectedSignal,
  selectedImpact,
  signalCount,
  onViewBrief,
}: {
  decision: Decision;
  pattern: Pattern;
  selectedSignal?: Signal;
  selectedImpact: DecisionImpact;
  signalCount: number;
  onViewBrief: () => void;
}) {
  const tradeoff =
    "Make trust-critical state visible while keeping setup controls out of the daily scan path.";
  const evidenceContribution = selectedSignal
    ? `${selectedImpact.memoInfluence} ${selectedImpact.pressure} pressure.`
    : `${signalCount} related signals support this pattern-level decision.`;

  return (
    <aside className="executive-memo" aria-label="Executive decision memo">
      <div className="memo-title-row">
        <span className="eyebrow">Executive Decision Memo</span>
        <span className={`confidence-chip ${pattern.triadReview.confidence.toLowerCase()}`}>
          {pattern.triadReview.confidence} confidence
        </span>
      </div>
      <strong>{decision.decision}</strong>
      <dl className="memo-grid">
        <div className="wide">
          <dt>Rationale</dt>
          <dd>{decision.rationale}</dd>
        </div>
        <div>
          <dt>Tradeoff</dt>
          <dd>{tradeoff}</dd>
        </div>
        <div>
          <dt>Primary risk</dt>
          <dd>{decision.risks}</dd>
        </div>
        <div>
          <dt>Success metric</dt>
          <dd>{decision.successMetric}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{decision.status}</dd>
        </div>
        <div>
          <dt>Review date</dt>
          <dd>{decision.followUpDate}</dd>
        </div>
        <div>
          <dt>Evidence contribution</dt>
          <dd>{evidenceContribution}</dd>
        </div>
      </dl>
      <button className="brief-button" type="button" onClick={onViewBrief}>
        <Printer size={15} aria-hidden="true" />
        View Decision Brief
      </button>
    </aside>
  );
}
