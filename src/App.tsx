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
import { FormEvent, useMemo, useState } from "react";
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
          <div className="executive-memo" aria-label="Executive decision summary">
            <span className="eyebrow">Decision Memo</span>
            <strong>{decision.decision}</strong>
            <dl>
              <div>
                <dt>Signals</dt>
                <dd>{patternSignals.length}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{decision.status}</dd>
              </div>
              <div>
                <dt>Review</dt>
                <dd>{decision.followUpDate}</dd>
              </div>
            </dl>
          </div>
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

          <div className="chain">
            <ChainNode
              stage="signal"
              icon={<CircleDot size={18} />}
              label="Raw Signals"
              title={`${patternSignals.length} inputs with shared trust risk`}
              body={patternSignals.map((signal) => signal.title).join(" · ")}
            />
            <ChainNode
              stage="pattern"
              icon={<Sparkles size={18} />}
              label="Pattern"
              title={pattern.title}
              body={pattern.opportunityStatement}
            />
            <ChainNode
              stage="triad"
              icon={<Layers3 size={18} />}
              label="Triad Review"
              title="Outcome, clarity, and reliability converge"
              body={`${pattern.triadReview.productOutcome} ${pattern.triadReview.stateReliabilityConcern}`}
            />
            <ChainNode
              stage="decision"
              icon={<Lightbulb size={18} />}
              label="Decision"
              title={decision.decision}
              body={decision.rationale}
            />
            <ChainNode
              stage="shipped"
              icon={<PackageCheck size={18} />}
              label="Shipped Change"
              title={shipped.shippedChange}
              body={shipped.result}
            />
            <ChainNode
              stage="learning"
              icon={<RotateCcw size={18} />}
              label="Learning"
              title="The loop creates reusable product judgment"
              body={shipped.learning}
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
                <SignalCard key={signal.id} signal={signal} />
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ChainNode({
  stage,
  icon,
  label,
  title,
  body,
}: {
  stage: "signal" | "pattern" | "triad" | "decision" | "shipped" | "learning";
  icon: React.ReactNode;
  label: string;
  title: string;
  body: string;
}) {
  return (
    <article className={`chain-node ${stage}`}>
      <div className="chain-icon">{icon}</div>
      <div>
        <span className="eyebrow">{label}</span>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </article>
  );
}

function SignalCard({ signal }: { signal: Signal }) {
  return (
    <article className="signal-card">
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
    </article>
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
