import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { useEvidenceStore } from "./store";

const signalCards = () => document.querySelectorAll<HTMLElement>(".signal-card");

describe("App", () => {
  it("renders the seeded pattern and decision memo", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /trace every product decision/i }),
    ).toBeInTheDocument();
    // The pattern title appears in several places (hero, chain node, evidence panel).
    expect(
      screen.getAllByText(/users do not trust whether their data is saved or synced/i)
        .length,
    ).toBeGreaterThan(0);
    expect(signalCards()).toHaveLength(3);
  });

  it("captures a new signal through the form and lists it", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(
      screen.getByPlaceholderText(/users are unsure whether data synced/i),
      "Latency complaints",
    );
    await user.type(
      screen.getByPlaceholderText(/paste a quote/i),
      "Three users mentioned slow sync.",
    );
    await user.click(screen.getByRole("button", { name: /add to evidence chain/i }));

    expect(signalCards()).toHaveLength(4);
    expect(within(signalCards()[0]).getByText("Latency complaints")).toBeInTheDocument();
  });

  it("rejects an empty submit and shows an error", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /add to evidence chain/i }));
    expect(signalCards()).toHaveLength(3);
    expect(screen.getByRole("alert")).toHaveTextContent(
      /add a title and an observation/i,
    );
  });

  it("clears the error once the user types", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /add to evidence chain/i }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
    await user.type(
      screen.getByPlaceholderText(/users are unsure whether data synced/i),
      "x",
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("updates the selected evidence panel when a signal is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    const second = signalCards()[1];
    const title = within(second).getByRole("heading").textContent ?? "";
    await user.click(second);

    const panel = document.querySelector(".selected-evidence") as HTMLElement;
    expect(within(panel).getByRole("heading").textContent).toBe(title);
  });

  it("opens the decision brief as a modal and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /view decision brief/i }));
    expect(screen.getByRole("dialog", { name: /decision brief/i })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("requires confirmation before resetting and can be cancelled", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add a signal so a reset is observable.
    await user.type(
      screen.getByPlaceholderText(/users are unsure whether data synced/i),
      "Disposable",
    );
    await user.type(screen.getByPlaceholderText(/paste a quote/i), "temp");
    await user.click(screen.getByRole("button", { name: /add to evidence chain/i }));
    expect(signalCards()).toHaveLength(4);

    // Cancel keeps the data.
    await user.click(screen.getByRole("button", { name: /reset demo data/i }));
    await user.click(screen.getByRole("button", { name: /^cancel$/i }));
    expect(signalCards()).toHaveLength(4);

    // Confirm restores the seeded three.
    await user.click(screen.getByRole("button", { name: /reset demo data/i }));
    await user.click(screen.getByRole("button", { name: /^reset$/i }));
    expect(signalCards()).toHaveLength(3);
  });

  it("shows the recovery screen when no pattern is present", () => {
    useEvidenceStore.setState({ patterns: [] });
    render(<App />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reset to demo data/i }),
    ).toBeInTheDocument();
  });
});
