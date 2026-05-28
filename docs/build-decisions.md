# Evidence Chain Build Decisions

This file tracks the product, design, engineering, and operating-model decisions made while building Evidence Chain in public.

Use it as source material for LinkedIn posts, case study notes, changelogs, and portfolio narrative.

## Operating Cast

- **Codex:** primary builder and implementation owner
- **Arendt:** marketing positioning agent
- **Faraday:** logo and app aesthetic design agent
- **Godel:** first UX feedback loop agent
- **Darwin:** UX feedback loop agent for the post-trace interaction pass
- **Ptolemy:** focused aesthetic critique agent
- **Hilbert:** UX feedback loop agent for audit-trail refinement
- **Dewey:** UX feedback loop agent for decision-impact critique
- **Hume:** UX feedback loop agent for shareable artifact critique
- **Laplace:** attempted next UX feedback pass; blocked by usage limit

## Decision Log

### 2026-05-28: Name the product Evidence Chain

- **Decision:** Use `Evidence Chain` as the product name.
- **Tagline:** `From raw signal to shipped product decision.`
- **Why:** The name directly describes the core artifact and carries more director-level gravity than `Signal-to-Ship`.
- **Tradeoff:** It is more serious and less playful, but that matches the target audience.
- **Build-in-public angle:** Naming the product around the artifact signals that the product is about inspectable reasoning, not another feedback inbox.

### 2026-05-28: Build for Directors of Product, not general makers

- **Decision:** Position Evidence Chain for Directors of Product, senior PMs, product leads, and product/design/engineering triads.
- **Why:** A director will care about decision quality, operating cadence, tradeoffs, and learning loops.
- **Tradeoff:** This narrows the surface away from generic productivity or note-taking.
- **Build-in-public angle:** The product is designed to prove product judgment, not just usefulness.

### 2026-05-28: Use React, Vite, and TypeScript

- **Decision:** Build the MVP with Vite, React, TypeScript, Zustand, local storage, and Lucide icons.
- **Why:** Evidence Chain has richer object relationships than FastTrack: signals, patterns, triad reviews, decisions, ship logs, and briefs.
- **Tradeoff:** More setup than vanilla HTML/JS, but cleaner component and state boundaries.
- **Build-in-public angle:** The stack reflects the product shape: a real multi-surface product workspace, not a static demo.

### 2026-05-28: Make the Evidence Chain the MVP

- **Decision:** Center the MVP on the chain: `Signal -> Pattern -> Triad Review -> Decision -> Shipped Change -> Learning`.
- **Why:** This is the product's core aha. Capture forms and dashboards are supporting surfaces.
- **Tradeoff:** Defers broader inbox, routing, and workspace features.
- **Build-in-public angle:** The first version ships the differentiating artifact first.

### 2026-05-28: Use the FastTrack triad operating model

- **Decision:** Keep the same triad used for FastTrack:
  - Product: outcomes and scope
  - Design: clarity and tone
  - Engineering: reliability and state
- **Why:** The triad gives every decision a clear review lens and ties this product to the FastTrack story.
- **Tradeoff:** It makes the operating model explicit rather than hiding it behind generic fields.
- **Build-in-public angle:** Evidence Chain is being built with the same product system it encodes.

### 2026-05-28: Make UX feedback autonomous

- **Decision:** Use the UX feedback loop agent every step of the way and automatically address the highest-leverage issue it identifies.
- **Why:** The product should be shaped through the same observe-prioritize-implement-verify loop that made FastTrack better.
- **Tradeoff:** It creates more iteration passes, but each pass is scoped and verifiable.
- **Build-in-public angle:** The build process itself becomes evidence of product operating discipline.

### 2026-05-28: Position as product decision traceability

- **Decision:** Category framing: `A product decision traceability tool`.
- **Why:** It avoids the crowded "feedback inbox," "roadmap tool," and "AI prioritization" categories.
- **Tradeoff:** The category is more precise and may require explanation.
- **Build-in-public angle:** "A backlog captures work. Evidence Chain captures why the work matters."

### 2026-05-28: Use an executive-neutral visual system

- **Decision:** Use a restrained palette: ink, charcoal, slate, line, white surfaces, signal blue, decision green, risk amber, learning violet.
- **Why:** The audience should feel operational credibility, not playful productivity energy.
- **Tradeoff:** Less immediately flashy, but more suitable for director-level review.
- **Build-in-public angle:** Visual design is being used to communicate judgment and traceability.

### 2026-05-28: Build a selectable evidence trace

- **Decision:** Selecting a signal highlights its path through all six stages.
- **Why:** The chain was too static; the product promise requires visible traceability.
- **Tradeoff:** More interaction complexity in the first MVP, but it creates the aha moment.
- **Verification:** Desktop and mobile checks confirmed no horizontal overflow and six active trace nodes.
- **Build-in-public angle:** The product moved from a dashboard to an inspectable reasoning artifact.

### 2026-05-28: Upgrade the Executive Decision Memo

- **Decision:** Add decision, rationale, tradeoff, primary risk, success metric, confidence, status, review date, and evidence contribution above the fold.
- **Why:** Provenance alone is not enough. Directors need to inspect judgment.
- **Tradeoff:** The memo became denser, so content clamping and compact rows were added.
- **Verification:** The memo fits within a 1200x900 desktop viewport and remains single-column on mobile.
- **Build-in-public angle:** The trace proves where the decision came from; the memo proves whether the decision was sound.

### 2026-05-28: Make the trace an audit trail

- **Decision:** Add compact proof labels to each stage and strengthen the continuous trace spine.
- **Why:** Six highlighted cards still felt like a dashboard. The selected signal needed to read as a decision audit trail.
- **Tradeoff:** Medium desktop now uses a vertical trail to preserve continuity instead of squeezing the chain horizontally.
- **Verification:** Proof labels update per selected signal, and mobile remains scroll-safe.
- **Build-in-public angle:** The core UI now mirrors the brand concept: evidence moving through structured judgment.

### 2026-05-28: Add per-signal Decision Impact

- **Decision:** Each seeded signal gets a distinct decision impact: what changed, pressure applied, risk raised, and memo influence.
- **Why:** The product needed causal clarity, not just traceability.
- **Tradeoff:** Seeded data is more opinionated, but it better demonstrates product judgment.
- **Verification:** All three seeded signals produce distinct impact, pressure, risk, memo contribution, and trace labels.
- **Build-in-public angle:** Evidence Chain can show how a specific signal changed a product decision.

### 2026-05-28: Add a shareable Decision Brief

- **Decision:** Add a read-only Decision Brief mode generated from the current chain context.
- **Why:** Directors need a polished artifact they could send to leadership or use in a product review.
- **Tradeoff:** Adds another surface, but it is generated from existing evidence rather than a separate report builder.
- **Verification:** Brief opens from the Executive Memo, preserves selected signal context, includes the promised sections, and renders as single-column on mobile.
- **Build-in-public angle:** The product now produces the artifact it promises: a reviewable product decision narrative.

### 2026-05-28: Choose and refine the Trace Spine mark

- **Decision:** Use the Trace Spine concept as the Evidence Chain mark and lockup.
- **Why:** The mark shares the same grammar as the product: raw signal becomes pattern, decision, shipped change, and learning loop.
- **Tradeoff:** It is more literal than an abstract monogram, but stronger for a product whose differentiator is inspectable traceability.
- **Verification:** Final SVG assets were created for horizontal lockup, stacked lockup, dark mark, light mark, and favicon, then integrated into the app shell.
- **Build-in-public angle:** The logo is not decoration. It is the product thesis compressed into a brand mark.

## Current Narrative Thread

Evidence Chain is being built as a product decision traceability tool for product leaders. The central thesis is that product teams do not lack feedback; they lack a reliable way to convert feedback into scoped decisions, shipped changes, and visible learning.

The build process is intentionally recursive: Evidence Chain is being built with an evidence chain. Every major product decision is captured, critiqued through UX feedback, implemented, verified, and pushed publicly.

## Open Decisions

- Decide whether the Trace Spine should be simplified further for tiny social avatars.
- Decide whether the Decision Brief should become the default shareable route.
- Decide when to deploy a public demo URL beyond the GitHub repository.
- Decide the first build-in-public LinkedIn post sequence.
