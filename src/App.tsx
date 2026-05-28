import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Braces,
  CircleDot,
  ClipboardList,
  GitBranch,
  History,
  Layers3,
  Lightbulb,
  PackageCheck,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Decision,
  Pattern,
  ShipLogEntry,
  Signal,
  SignalType,
  useEvidenceStore,
} from "./store";

const signalTypes: SignalType[] = [
  "Customer pain",
  "UX friction",
  "Reliability issue",
  "Revenue request",
  "Strategic opportunity",
  "Stakeholder ask",
];

const navItems = [
  { label: "Evidence", icon: GitBranch },
  { label: "Signals", icon: ClipboardList },
  { label: "Triad", icon: Layers3 },
  { label: "Decision", icon: BookOpenCheck },
  { label: "Ship Log", icon: PackageCheck },
];

function App() {
  const {
    signals,
    patterns,
    decisions,
    shipLog,
    selectedPatternId,
    addSignal,
    updateDecision,
    updateShipLog,
    resetDemo,
  } = useEvidenceStore();

  const pattern = patterns.find((item) => item.id === selectedPatternId) as Pattern;
  const patternSignals = useMemo(
    () => signals.filter((signal) => pattern.linkedSignalIds.includes(signal.id)),
    [signals, pattern.linkedSignalIds],
  );
  const decision = decisions.find((item) => item.patternId === pattern.id) as Decision;
  const shipped = shipLog.find((item) => item.decisionId === decision.id) as ShipLogEntry;
  const [selectedSignalId, setSelectedSignalId] = useState(patternSignals[0]?.id ?? "");
  const selectedSignal =
    patternSignals.find((signal) => signal.id === selectedSignalId) ?? patternSignals[0];
  const selectedTraceLabels = {
    signal: selectedSignal?.source ?? "Signal input",
    pattern: `${patternSignals.length} related inputs`,
    triad: selectedSignal
      ? `${selectedSignal.severity} ${selectedSignal.type}`
      : `Confidence ${pattern.triadReview.confidence}`,
    decision: "Scoped trust state",
    shipped: "Source chip added",
    learning: "Trust gap reduced",
  };

  const [draft, setDraft] = useState({
    title: "",
    source: "Customer interview",
    type: "Customer pain" as SignalType,
    userSegment: "Product team",
    quoteOrObservation: "",
    severity: "Medium" as Signal["severity"],
  });

  const submitSignal = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draft.title.trim() || !draft.quoteOrObservation.trim()) {
      return;
    }

    addSignal(draft);
    setDraft({
      title: "",
      source: "Customer interview",
      type: "Customer pain",
      userSegment: "Product team",
      quoteOrObservation: "",
      severity: "Medium",
    });
  };

  useEffect(() => {
    if (!selectedSignalId && patternSignals[0]) {
      setSelectedSignalId(patternSignals[0].id);
    }
  }, [patternSignals, selectedSignalId]);

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Evidence Chain navigation">
        <div className="brand-lockup">
          <span className="brand-mark">
            <GitBranch size={20} aria-hidden="true" />
          </span>
          <div>
            <strong>Evidence Chain</strong>
            <span>From raw signal to shipped product decision.</span>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => (
            <a key={item.label} href={`#${item.label.toLowerCase().replace(" ", "-")}`}>
              <item.icon size={17} aria-hidden="true" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="sidebar-card">
          <span className="eyebrow">Operating Model</span>
          <p>
            Product owns outcomes and scope. Design owns clarity and tone.
            Engineering owns reliability and state.
          </p>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">Director-Readable MVP</span>
            <h1>Trace every product decision back to evidence.</h1>
          </div>
          <button className="icon-button" type="button" onClick={resetDemo} title="Reset demo data">
            <RotateCcw size={18} aria-hidden="true" />
          </button>
        </header>

        <section className="hero-strip" aria-label="Current pattern">
          <div>
            <span className="status-chip high">{pattern.priority}</span>
            <h2>{pattern.title}</h2>
            <p>{pattern.description}</p>
          </div>
          <ExecutiveDecisionMemo
            decision={decision}
            pattern={pattern}
            selectedSignal={selectedSignal}
            signalCount={patternSignals.length}
          />
        </section>

        <section id="evidence" className="section-grid">
          <div className="section-header">
            <div>
              <span className="eyebrow">Core Artifact</span>
              <h2>Evidence Chain</h2>
            </div>
            <p>
              The MVP starts here: one visible path from messy signal to shipped
              learning.
            </p>
          </div>

          <div className="trace-workbench">
            <div className="chain" aria-label="Selected signal trace">
            <ChainNode
              stage="signal"
              isActive={Boolean(selectedSignal)}
              icon={<CircleDot size={18} />}
              label="Raw Signals"
              proofLabel={selectedTraceLabels.signal}
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
              proofLabel={selectedTraceLabels.pattern}
              title={pattern.title}
              body={pattern.opportunityStatement}
            />
            <ChainNode
              stage="triad"
              isActive={Boolean(selectedSignal)}
              icon={<Layers3 size={18} />}
              label="Triad Review"
              proofLabel={selectedTraceLabels.triad}
              title="Outcome, clarity, and reliability converge"
              body={`${pattern.triadReview.productOutcome} ${pattern.triadReview.stateReliabilityConcern}`}
            />
            <ChainNode
              stage="decision"
              isActive={Boolean(selectedSignal)}
              icon={<Lightbulb size={18} />}
              label="Decision"
              proofLabel={selectedTraceLabels.decision}
              title={decision.decision}
              body={decision.rationale}
            />
            <ChainNode
              stage="shipped"
              isActive={Boolean(selectedSignal)}
              icon={<PackageCheck size={18} />}
              label="Shipped Change"
              proofLabel={selectedTraceLabels.shipped}
              title={shipped.shippedChange}
              body={shipped.result}
            />
            <ChainNode
              stage="learning"
              isActive={Boolean(selectedSignal)}
              icon={<RotateCcw size={18} />}
              label="Learning"
              proofLabel={selectedTraceLabels.learning}
              title="The loop creates reusable product judgment"
              body={shipped.learning}
            />
            </div>

            <SelectedEvidence
              signal={selectedSignal}
              decision={decision}
              pattern={pattern}
            />
          </div>
        </section>

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
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                  placeholder="Users are unsure whether data synced"
                />
              </label>
              <label>
                Observation
                <textarea
                  value={draft.quoteOrObservation}
                  onChange={(event) =>
                    setDraft({ ...draft, quoteOrObservation: event.target.value })
                  }
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
                      setDraft({ ...draft, severity: event.target.value as Signal["severity"] })
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
                  isSelected={signal.id === selectedSignal?.id}
                  isDimmed={Boolean(selectedSignal) && signal.id !== selectedSignal.id}
                  onSelect={() => setSelectedSignalId(signal.id)}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="triad" className="section-grid">
          <div className="section-header">
            <div>
              <span className="eyebrow">Product Triad</span>
              <h2>Review</h2>
            </div>
            <p>{pattern.opportunityStatement}</p>
          </div>

          <div className="triad-grid">
            <TriadCard
              icon={<BadgeCheck size={18} />}
              title="Product"
              subtitle="Outcomes + Scope"
              items={[pattern.triadReview.productOutcome, pattern.triadReview.scopeFit]}
            />
            <TriadCard
              icon={<Sparkles size={18} />}
              title="Design"
              subtitle="Clarity + Tone"
              items={[pattern.triadReview.designFriction, pattern.triadReview.toneRisk]}
            />
            <TriadCard
              icon={<ShieldCheck size={18} />}
              title="Engineering"
              subtitle="Reliability + State"
              items={[
                pattern.triadReview.engineeringRisk,
                pattern.triadReview.stateReliabilityConcern,
              ]}
            />
          </div>
        </section>

        <section id="decision" className="two-column">
          <EditableDecision decision={decision} onChange={updateDecision} />
          <EditableShipLog entry={shipped} onChange={updateShipLog} />
        </section>
      </section>
    </main>
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
  icon: React.ReactNode;
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

function ExecutiveDecisionMemo({
  decision,
  pattern,
  selectedSignal,
  signalCount,
}: {
  decision: Decision;
  pattern: Pattern;
  selectedSignal?: Signal;
  signalCount: number;
}) {
  const tradeoff =
    "Make trust-critical state visible while keeping setup controls out of the daily scan path.";
  const evidenceContribution = selectedSignal
    ? `${selectedSignal.type} from ${selectedSignal.source}: ${selectedSignal.title}`
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
    </aside>
  );
}

function SelectedEvidence({
  signal,
  decision,
  pattern,
}: {
  signal?: Signal;
  decision: Decision;
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
          <dd>{pattern.priority} · {pattern.title}</dd>
        </div>
        <div>
          <dt>Linked rationale</dt>
          <dd>{decision.rationale}</dd>
        </div>
      </dl>
    </aside>
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
        <span className={`status-chip ${signal.severity.toLowerCase()}`}>{signal.severity}</span>
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

function TriadCard({
  icon,
  title,
  subtitle,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  items: string[];
}) {
  return (
    <article className="triad-card">
      <div className="triad-title">
        <span>{icon}</span>
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
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

export default App;
