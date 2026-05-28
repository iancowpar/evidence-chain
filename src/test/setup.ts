import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { initialState, useEvidenceStore } from "../store";

// The store is a module-level singleton with persisted state. Reset both the
// in-memory store and localStorage before each test so cases don't leak into
// one another.
beforeEach(() => {
  localStorage.clear();
  useEvidenceStore.setState(initialState);
});

afterEach(() => {
  cleanup();
});
