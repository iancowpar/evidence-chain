import { RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Decision, Pattern, ShipLogEntry, useEvidenceStore } from "./store";
import { impactFor } from "./lib/decisionImpacts";
import { Sidebar } from "./components/Sidebar";
import { ExecutiveMemo } from "./components/ExecutiveMemo";
import { DecisionBrief } from "./components/DecisionBrief";
import { EvidenceChainSection } from "./components/EvidenceChainSection";
import { SignalsSection } from "./components/SignalsSection";
import { TriadSection } from "./components/TriadSection";
import { DecisionSection } from "./components/DecisionSection";

function App() {
  const {
    signals,
    patterns,
    decisions,
    shipLog,
    selectedPatternId,
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
  const [isBriefOpen, setIsBriefOpen] = useState(false);

  const selectedSignal =
    patternSignals.find((signal) => signal.id === selectedSignalId) ?? patternSignals[0];
  const selectedImpact = impactFor(selectedSignal);

  useEffect(() => {
    if (!selectedSignalId && patternSignals[0]) {
      setSelectedSignalId(patternSignals[0].id);
    }
  }, [patternSignals, selectedSignalId]);

  return (
    <main className="app-shell">
      <Sidebar />

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
