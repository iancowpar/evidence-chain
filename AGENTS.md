# Agents

Shared instructions for AI coding agents working in this repo (Claude Code,
Codex CLI, or anything else that reads `AGENTS.md`). Read this before you
make changes.

## What this is

Evidence Chain — a local-first React app that traces product decisions from
raw signal to shipped change. Single-page, no backend, no auth. State is
held in Zustand and persisted to `localStorage` under the key
`evidence-chain-demo`.

Positioning: *a backlog captures work; Evidence Chain captures why the work
matters.*

## Tech

- Vite 6 + React 19 + TypeScript
- Zustand (with `persist` middleware) for state
- `lucide-react` for icons
- Hand-rolled CSS in `src/styles.css` (no Tailwind, no CSS-in-JS)

## Run / build / verify

```bash
bin/setup          # npm ci — first time, or after pulling dependency changes
npm run dev        # vite on 0.0.0.0:5173
npm run build      # tsc -b && vite build (production build)
npm run typecheck  # tsc --noEmit — fastest check before committing
```

There are no tests and no linter yet. `typecheck` + a manual browser pass
is the verification bar.

## File layout

```
src/
  main.tsx                          entry
  App.tsx                           top-level layout + state wiring
  store.ts                          Zustand store, types, seeded demo data
  styles.css                        all styling
  lib/
    decisionImpacts.ts              per-signal impact mapping (UI-only)
  components/
    Sidebar.tsx
    ExecutiveMemo.tsx
    DecisionBrief.tsx
    EvidenceChainSection.tsx        chain trace + SelectedEvidence panel
    SignalsSection.tsx              capture form + signal list
    TriadSection.tsx
    DecisionSection.tsx             editable memo + ship log
```

## Domain model

`Signal` → `Pattern` (which embeds `TriadReview`) → `Decision` →
`ShipLogEntry`. The MVP ships with one seeded pattern; a multi-pattern UI
is not yet built (the store models patterns as an array, but there is no
switcher and the type assertions assume one exists).

## Conventions

- Edit existing files. Only add new component files if the change crosses
  a section boundary (the sections above).
- Keep components mostly pure. Read from the store at the section level
  and pass props down — don't sprinkle `useEvidenceStore` calls through
  every leaf.
- No new dependencies without a clear reason. The dep list is small on
  purpose.
- All styles live in `src/styles.css`. Don't introduce CSS modules,
  Tailwind, or styled-components without agreement.
- The "Decision Impact" data in `lib/decisionImpacts.ts` is keyed by
  signal id. New seeded signals can add an entry; user-captured signals
  fall through to `fallbackDecisionImpact`.

## Branches

- Develop on a short-lived feature branch off `main`.
- Naming: `claude/<feature>` for Claude Code sessions,
  `codex/<feature>` for Codex CLI sessions. Pick whichever matches the
  agent you're driving in.
- One agent per branch at a time. If you need to continue another
  agent's branch, pull first and read the diff before committing.
- Open a PR; do not push directly to `main`.

## Hot files (high merge-conflict risk)

- `src/store.ts` — domain model changes ripple everywhere. If you change
  the shape of `Signal`, `Pattern`, `Decision`, or `ShipLogEntry`, bump
  the persist `version` (when it exists) and write a `migrate`. Otherwise
  hydration will silently break for anyone with existing localStorage.
- `src/styles.css` — long single file. Prefer appending to a section
  rather than reorganizing.
- `src/App.tsx` — the orchestration root. Most feature work should land
  in `components/`, not here. Touch this only when wiring is genuinely
  cross-cutting.

## Things this repo intentionally does NOT have (yet)

- Tests
- A linter
- A backend or auth
- A pattern switcher / multi-pattern UI
- A persist `version` / migration in Zustand
- AI clustering or prioritization
