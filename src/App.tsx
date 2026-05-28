import { RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useEvidenceStore } from "./store";
import { impactFor } from "./lib/decisionImpacts";
import { Sidebar } from "./components/Sidebar";
import { ExecutiveMemo } from "./components/ExecutiveMemo";
import { DecisionBrief } from "./components/DecisionBrief";
import { EvidenceChainSection } from "./components/EvidenceChainSection";
import { SignalsSection } from "./components/SignalsSection";
import { TriadSection } from "./components/TriadSection";
import { DecisionSection } from "./components/DecisionSection";

function App() {
  const { signals, patterns, decisions, shipLog, selectedPatternId, resetDemo } =
    useEvidenceStore();

  const pattern = patterns.find((item) => item.id === selectedPatternId);
  const patternSignals = useMemo(
    () =>
      pattern
        ? signals.filter((signal) => pattern.linkedSignalIds.includes(signal.id))
        : [],
    [signals, pattern],
  );
  const decision = decisions.find((item) => item.patternId === pattern?.id);
  const shipped = shipLog.find((item) => item.decisionId === decision?.id);

  const [selectedSignalId, setSelectedSignalId] = useState(patternSignals[0]?.id ?? "");
  const [isBriefOpen, setIsBriefOpen] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);

  const selectedSignal =
    patternSignals.find((signal) => signal.id === selectedSignalId) ?? patternSignals[0];
  const selectedImpact = impactFor(selectedSignal);

  useEffect(() => {
    if (!selectedSignalId && patternSignals[0]) {
      setSelectedSignalId(patternSignals[0].id);
    }
  }, [patternSignals, selectedSignalId]);

  // The MVP always has a seeded pattern/decision/ship log. If any is missing,
  // persisted state is corrupt or incomplete — recover instead of crashing on
  // a missing field.
  if (!pattern || !decision || !shipped) {
    return (
      <main className="recovery-screen" role="alert">
        <div className="recovery-card">
          <span className="eyebrow">No active pattern</span>
          <h1>The evidence chain is empty.</h1>
          <p>
            Saved data is missing a pattern, decision, or ship log entry. Resetting
            restores the seeded demo.
          </p>
          <button className="primary-button" type="button" onClick={resetDemo}>
            Reset to demo data
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <Sidebar />

      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">Director-Readable MVP</span>
            <h1>Trace every product decision back to evidence.</h1>
          </div>
          {confirmingReset ? (
            <div className="reset-confirm" role="group" aria-label="Confirm reset">
              <span>Reset all data?</span>
              <button
                className="reset-confirm-yes"
                type="button"
                onClick={() => {
                  resetDemo();
                  setSelectedSignalId("");
                  setConfirmingReset(false);
                }}
              >
                Reset
              </button>
              <button
                className="reset-confirm-no"
                type="button"
                onClick={() => setConfirmingReset(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="icon-button"
              type="button"
              onClick={() => setConfirmingReset(true)}
              title="Reset demo data"
            >
              <RotateCcw size={18} aria-hidden="true" />
            </button>
          )}
        </header>

        <section className="hero-strip" aria-label="Current pattern">
          <div>
            <span className="status-chip high">{pattern.priority}</span>
            <h2>{pattern.title}</h2>
            <p>{pattern.description}</p>
          </div>
          <ExecutiveMemo
            decision={decision}
            pattern={pattern}
            selectedSignal={selectedSignal}
            selectedImpact={selectedImpact}
            signalCount={patternSignals.length}
            onViewBrief={() => setIsBriefOpen(true)}
          />
        </section>

        {isBriefOpen ? (
          <DecisionBrief
            decision={decision}
            impact={selectedImpact}
            onClose={() => setIsBriefOpen(false)}
            pattern={pattern}
            selectedSignal={selectedSignal}
            shipped={shipped}
            signals={patternSignals}
          />
        ) : null}

        <EvidenceChainSection
          pattern={pattern}
          patternSignals={patternSignals}
          decision={decision}
          shipped={shipped}
          selectedSignal={selectedSignal}
          selectedImpact={selectedImpact}
        />

        <SignalsSection
          patternSignals={patternSignals}
          selectedSignalId={selectedSignal?.id ?? ""}
          onSelect={setSelectedSignalId}
        />

        <TriadSection pattern={pattern} />

        <DecisionSection decision={decision} shipped={shipped} />
      </section>
    </main>
  );
}

export default App;
