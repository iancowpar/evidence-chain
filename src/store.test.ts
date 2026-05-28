import { describe, expect, it } from "vitest";
import { useEvidenceStore } from "./store";

const store = () => useEvidenceStore.getState();

const draft = {
  title: "New signal",
  source: "Interview",
  type: "Customer pain" as const,
  userSegment: "Beta cohort",
  quoteOrObservation: "Users could not tell if data saved.",
  severity: "High" as const,
};

describe("evidence store", () => {
  it("seeds one pattern, three signals, a decision, and a ship log entry", () => {
    const s = store();
    expect(s.patterns).toHaveLength(1);
    expect(s.signals).toHaveLength(3);
    expect(s.decisions).toHaveLength(1);
    expect(s.shipLog).toHaveLength(1);
    expect(s.selectedPatternId).toBe(s.patterns[0].id);
  });

  it("adds a signal to the front and links it to the selected pattern", () => {
    store().addSignal(draft);
    const s = store();
    expect(s.signals).toHaveLength(4);
    expect(s.signals[0].title).toBe("New signal");
    expect(s.signals[0].linkedPatternId).toBe(s.selectedPatternId);
    expect(s.patterns[0].linkedSignalIds[0]).toBe(s.signals[0].id);
    expect(s.signals[0].id).toBeTruthy();
    expect(s.signals[0].createdAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("updates a decision field and splits optionsConsidered on newlines", () => {
    const id = store().decisions[0].id;
    store().updateDecision(id, "rationale", "Edited rationale");
    store().updateDecision(id, "optionsConsidered", "Option A\nOption B\n\nOption C");
    const updated = store().decisions[0];
    expect(updated.rationale).toBe("Edited rationale");
    expect(updated.optionsConsidered).toEqual(["Option A", "Option B", "Option C"]);
  });

  it("updates a ship log field", () => {
    const id = store().shipLog[0].id;
    store().updateShipLog(id, "learning", "Edited learning");
    expect(store().shipLog[0].learning).toBe("Edited learning");
  });

  it("resetDemo restores the seeded state after edits", () => {
    store().addSignal(draft);
    store().updateShipLog(store().shipLog[0].id, "learning", "changed");
    store().resetDemo();
    const s = store();
    expect(s.signals).toHaveLength(3);
    expect(s.shipLog[0].learning).not.toBe("changed");
  });
});
