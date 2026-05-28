import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useEvidenceStore } from "./store";
import "./styles.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ErrorBoundary onReset={() => useEvidenceStore.getState().resetDemo()}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
