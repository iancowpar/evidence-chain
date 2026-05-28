import { ArrowRight, ClipboardList, Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import { Signal, SignalType, useEvidenceStore } from "../store";

const signalTypes: SignalType[] = [
  "Customer pain",
  "UX friction",
  "Reliability issue",
  "Revenue request",
  "Strategic opportunity",
  "Stakeholder ask",
];

const emptyDraft = {
  title: "",
  source: "Customer interview",
  type: "Customer pain" as SignalType,
  userSegment: "Product team",
  quoteOrObservation: "",
  severity: "Medium" as Signal["severity"],
};

export function SignalsSection({
  patternSignals,
  selectedSignalId,
  onSelect,
}: {
  patternSignals: Signal[];
  selectedSignalId: string;
  onSelect: (id: string) => void;
}) {
  const addSignal = useEvidenceStore((state) => state.addSignal);
  const [draft, setDraft] = useState(emptyDraft);
  const [error, setError] = useState("");

  const titleMissing = Boolean(error) && !draft.title.trim();
  const observationMissing = Boolean(error) && !draft.quoteOrObservation.trim();

  const submitSignal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draft.title.trim() || !draft.quoteOrObservation.trim()) {
      setError("Add a title and an observation before capturing a signal.");
      return;
    }

    addSignal(draft);
    setDraft(emptyDraft);
    setError("");
  };

  return (
    <section id="signals" className="two-column">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Inbox</span>
            <h2>Capture a Signal</h2>
          </div>
          <Plus size={18} aria-hidden="true" />
        </div>

        <form className="signal-form" onSubmit={submitSignal}>
          <label>
            Title
            <input
              value={draft.title}
              aria-invalid={titleMissing || undefined}
              onChange={(event) => {
                setDraft({ ...draft, title: event.target.value });
                if (error) setError("");
              }}
              placeholder="Users are unsure whether data synced"
            />
          </label>
          <label>
            Observation
            <textarea
              value={draft.quoteOrObservation}
              aria-invalid={observationMissing || undefined}
              onChange={(event) => {
                setDraft({ ...draft, quoteOrObservation: event.target.value });
                if (error) setError("");
              }}
              placeholder="Paste a quote, support note, metric observation, or UX finding."
            />
          </label>
          <div className="form-row">
            <label>
              Type
              <select
                value={draft.type}
                onChange={(event) =>
                  setDraft({ ...draft, type: event.target.value as SignalType })
                }
              >
                {signalTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label>
              Severity
              <select
                value={draft.severity}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    severity: event.target.value as Signal["severity"],
                  })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>
              Source
              <input
                value={draft.source}
                onChange={(event) => setDraft({ ...draft, source: event.target.value })}
              />
            </label>
            <label>
              Segment
              <input
                value={draft.userSegment}
                onChange={(event) =>
                  setDraft({ ...draft, userSegment: event.target.value })
                }
              />
            </label>
          </div>
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          <button className="primary-button" type="submit">
            Add to Evidence Chain
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </form>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Pattern Inputs</span>
            <h2>Signals</h2>
          </div>
          <ClipboardList size={18} aria-hidden="true" />
        </div>
        <div className="signal-list">
          {patternSignals.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              isSelected={signal.id === selectedSignalId}
              isDimmed={Boolean(selectedSignalId) && signal.id !== selectedSignalId}
              onSelect={() => onSelect(signal.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SignalCard({
  signal,
  isSelected,
  isDimmed,
  onSelect,
}: {
  signal: Signal;
  isSelected: boolean;
  isDimmed: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={`signal-card ${isSelected ? "is-selected" : ""} ${
        isDimmed ? "is-dimmed" : ""
      }`}
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
    >
      <div className="card-row">
        <span className={`status-chip ${signal.severity.toLowerCase()}`}>
          {signal.severity}
        </span>
        <span>{signal.type}</span>
      </div>
      <h3>{signal.title}</h3>
      <p>{signal.quoteOrObservation}</p>
      <footer>
        <span>{signal.source}</span>
        <span>{signal.userSegment}</span>
      </footer>
    </button>
  );
}
