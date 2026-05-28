# Evidence Chain

**From raw signal to shipped product decision.**

Evidence Chain is a product decision traceability tool for teams that need to connect raw feedback to shipped product decisions.

The premise is simple: product teams do not have a feedback problem. They have a conversion problem. Customer quotes, support issues, sales asks, stakeholder requests, UX friction, and metric anomalies pile up, but the hard part is preserving the reasoning between signal, tradeoff, decision, shipping, and learning.

## Core Loop

```text
Signal -> Pattern -> Triad Review -> Decision -> Shipped Change -> Learning
```

## Product Triad

Evidence Chain uses the same operating model I used while building FastTrack:

- **Product:** outcomes and scope
- **Design:** clarity and tone
- **Engineering:** reliability and state

The goal is not to automate product judgment. The goal is to make product reasoning inspectable.

## MVP Scope

The current MVP is a local-first React app focused on one director-readable artifact: the Evidence Chain.

Included:

- Seeded product example based on a sync-trust problem
- Evidence Chain view
- Signal capture
- Product/design/engineering triad review
- Editable decision memo
- Editable ship log and learning loop
- Local persistence

Intentionally out of scope for v1:

- Authentication
- Backend storage
- AI clustering or prioritization
- Team permissions
- Roadmap replacement

## Build In Public

This project is being built in public as a product operating model case study.

Positioning:

> A backlog captures work. Evidence Chain captures why the work matters.

Build decisions are tracked in [docs/build-decisions.md](docs/build-decisions.md).

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
