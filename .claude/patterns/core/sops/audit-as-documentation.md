# SOP: Audit as Documentation

> **PURPOSE**: Turn a refactor or codebase audit into a durable, traceable artifact — a tech-debt catalog that *is* the documentation, not separate prose written afterward.
> **SCOPE**: Any codebase, any discipline. Especially valuable for small teams with no dedicated documentation role: the audit output doubles as the record.
> **PREREQUISITES**: Read access to the codebase. A concrete trigger (a migration, a refactor, an incoming-handoff audit, or a "what's rotten here" sweep).
> **UPDATED**: 2026-06-19

---

## Overview

When you touch a subsystem deeply (a migration, a refactor, an audit), you discover dead code, mocks left in production, orphaned config, and pre-existing bugs — *parallel findings* that are not the task but matter. The waste is letting that knowledge evaporate when the PR merges.

**Principle**: the audit *is* the documentation. Each finding is a **traceable unit** (exact location + category + action), not loose prose. The catalog is greppable, assignable, and survives the refactor that produced it.

This is the lightweight distillation of the practice (validated on a multi-module gateway migration). It deliberately omits the heavyweight tracker↔wiki mirroring and C4 leveling appropriate for large vendor-audit programs — for a small focused team, a single markdown catalog under `docs/` or `.claude/status/` is enough.

---

## The finding — atomic unit

Every finding is one row/bullet with three mandatory parts:

| Part | What | Example |
|------|------|---------|
| **Location** | `path:line` (the precise anchor) | `lib-services/src/exchanges/agreements/agreements.service.ts:24` |
| **Category** | one of the categories below | Dead code |
| **Action** | the concrete cleanup/fix, or "coordinate with X" | Delete saga + action creators + types + reducer cases + service |

Never write a finding without a location. "Some services are unused" is prose; `agreements.service.ts:24 — Dead code — delete` is a finding.

---

## Categories

| Category | Definition | Typical action |
|----------|------------|----------------|
| **Dead code** | Action/saga/reducer/service/use-case registered but no UI/caller dispatches it | Delete the whole chain (types, creator, handler, reducer, service) |
| **Mocks in production** | Service hardcoded to return a mock (`simulate: true`, stubbed response), never hits the backend | Coordinate with backend; migrate or delete |
| **Orphan config / strings** | Endpoint, constant, or path declared in config but no code references it | Delete the config key |
| **Pending migration** | The new path exists (hash/endpoint/flag) but the consumer still uses the legacy one | Migrate the consumer |
| **Pre-existing bug** | A typo or broken reference that breaks functionality, unrelated to your task | File a bug; fix only if in scope |

Add categories as a project needs them — keep them few and named.

---

## Flow

```
1. Trigger     → a deep touch (migration/refactor/audit) is underway or planned
2. Capture     → as you read code, log every parallel finding immediately (location + category + action)
3. Classify    → bucket each finding into a category; if it doesn't fit, name a new category
4. Separate    → split "we can fix" from "needs another team" (e.g. backend-pending) into two lists
5. Catalog     → one markdown file, grouped by module/subsystem, then by category
6. Hand off    → link the catalog from the PR; the cleanup items become follow-up tickets
```

**Capture beats recall**: log the finding the moment you see it, with the line number open in front of you. Reconstructing locations later costs more than the finding is worth.

---

## Deliverables

- **`docs/audit-tech-debt.md`** (or `.claude/status/<area>-audit.md`) — the catalog: grouped by module → category, each finding `location + action`.
- **A second list for cross-team blockers** (e.g. `docs/be-pending.md`) — findings that need another team, kept out of the main catalog so "ours to fix" stays actionable.
- **Optional QA checklist** — when the refactor changes runtime behavior, a per-module pass/fail checklist with concrete success criteria (e.g. "request now goes to gateway URL, status 200"). Lets QA verify without reading code.

---

## Why it works for small teams

- **No separate doc step**: the audit output is the documentation. Nothing to write twice.
- **Traceable**: `path:line + action` means any finding is independently actionable months later.
- **Resilient**: knowledge is captured at discovery, not reconstructed from memory after merge.
- **Scoped**: separating cross-team blockers keeps the "we can fix" list honest and short.

---

## Anti-patterns

- ❌ Prose summaries without locations ("the cart module has some dead code").
- ❌ Mixing your-team and other-team findings in one list → the actionable items drown.
- ❌ Deferring capture to "after the refactor" → locations are lost, findings forgotten.
- ❌ Fixing pre-existing bugs mid-refactor without flagging them → scope creep, unreviewable PR.

---

## Related

- `core/sops/api-inventory-extraction.md` — read-only extraction of a backend-call inventory (a focused audit variant).
- `core/sops/code-audit.md` — broader code audit procedure.
- `core/sops/snapshot-management.md` — where status snapshots live.
