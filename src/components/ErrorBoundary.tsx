import { Component, ReactNode } from "react";

type Props = {
  children: ReactNode;
  onReset: () => void;
};

type State = {
  error: Error | null;
};

/**
 * Catches render-time crashes so a corrupt state or a bad component never
 * leaves the user staring at a white screen. The only recovery the MVP
 * offers is resetting to the seeded demo, which also clears bad persisted
 * state.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  handleReset = () => {
    this.props.onReset();
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <main className="recovery-screen" role="alert">
          <div className="recovery-card">
            <span className="eyebrow">Something broke</span>
            <h1>The workspace hit an error.</h1>
            <p>
              This usually means saved data is out of date or incomplete.
              Resetting restores the seeded demo and clears the bad state.
            </p>
            <pre>{this.state.error.message}</pre>
            <button className="primary-button" type="button" onClick={this.handleReset}>
              Reset to demo data
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
