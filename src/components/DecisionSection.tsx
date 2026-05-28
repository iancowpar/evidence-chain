import { Braces, History } from "lucide-react";
import { Decision, ShipLogEntry, useEvidenceStore } from "../store";

export function DecisionSection({
  decision,
  shipped,
}: {
  decision: Decision;
  shipped: ShipLogEntry;
}) {
  const updateDecision = useEvidenceStore((state) => state.updateDecision);
  const updateShipLog = useEvidenceStore((state) => state.updateShipLog);

  return (
    <section id="decision" className="two-column">
      <EditableDecision decision={decision} onChange={updateDecision} />
      <EditableShipLog entry={shipped} onChange={updateShipLog} />
    </section>
  );
}

function EditableDecision({
  decision,
  onChange,
}: {
  decision: Decision;
  onChange: (id: string, field: keyof Decision, value: string) => void;
}) {
  return (
    <div className="panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Decision Room</span>
          <h2>Decision Memo</h2>
        </div>
        <Braces size={18} aria-hidden="true" />
      </div>
      <label>
        Decision
        <textarea
          value={decision.decision}
          onChange={(event) => onChange(decision.id, "decision", event.target.value)}
        />
      </label>
      <label>
        Rationale
        <textarea
          value={decision.rationale}
          onChange={(event) => onChange(decision.id, "rationale", event.target.value)}
        />
      </label>
      <label>
        Options considered
        <textarea
          value={decision.optionsConsidered.join("\n")}
          onChange={(event) =>
            onChange(decision.id, "optionsConsidered", event.target.value)
          }
        />
      </label>
      <label>
        Success metric
        <input
          value={decision.successMetric}
          onChange={(event) => onChange(decision.id, "successMetric", event.target.value)}
        />
      </label>
    </div>
  );
}

function EditableShipLog({
  entry,
  onChange,
}: {
  entry: ShipLogEntry;
  onChange: (id: string, field: keyof ShipLogEntry, value: string) => void;
}) {
  return (
    <div id="ship-log" className="panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Ship Log</span>
          <h2>Learning Loop</h2>
        </div>
        <History size={18} aria-hidden="true" />
      </div>
      <label>
        Shipped change
        <textarea
          value={entry.shippedChange}
          onChange={(event) => onChange(entry.id, "shippedChange", event.target.value)}
        />
      </label>
      <label>
        Result
        <textarea
          value={entry.result}
          onChange={(event) => onChange(entry.id, "result", event.target.value)}
        />
      </label>
      <label>
        Learning
        <textarea
          value={entry.learning}
          onChange={(event) => onChange(entry.id, "learning", event.target.value)}
        />
      </label>
      <div className="ship-date">
        <span>Shipped</span>
        <strong>{entry.shippedAt}</strong>
      </div>
    </div>
  );
}
