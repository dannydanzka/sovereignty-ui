# Pattern vs SOP — Knowledge Artifact Types

> **PURPOSE**: Clarify the two types of documented knowledge in `.claude/` and where `tooling/` fits.
> **SCOPE**: Any `.md` under `.claude/patterns/` or `.claude/rules/`.
> **UPDATED**: 2026-04-22

---

## TL;DR

The taxonomy is **binary**, not ternary:

| Artifact | Voice | Answers | Example |
|---|---|---|---|
| **Pattern** | Descriptive | "How does X work here?" | `patterns/frontend/testing/playwright.md` |
| **SOP** | Imperative | "What steps achieve Y?" | `patterns/core/sops/feature-delivery-workflow.md` |

**`tooling/` is NOT a third type.** It's a subfolder of `patterns/` that groups patterns about dev tools (ESLint, TS, Prettier, Stylelint).

---

## Pattern — reusable knowledge (descriptive)

**What it is**: A durable description of how this codebase does something — conventions, architecture choices, trade-offs.

**Voice**: Third person, present tense. Explains the system as-is.

**Examples**:
- `patterns/frontend/presentation/components.md` — 5-file component structure
- `patterns/frontend/infrastructure/state/redux.md` — Redux + saga flow
- `patterns/frontend/testing/playwright.md` — E2E strategy
- `patterns/frontend/tooling/typescript-error-suppression.md` — @ts-expect-error policy

**When to create one**: A convention exists in code and needs to be preserved in prose so Claude (or a human) can follow it without re-deriving it.

**Where they live** (3 layers from doctrine):
- `patterns/doctrine/` — WHY (principles, philosophy)
- `patterns/core/` — WHAT, cross-discipline (quality, git, testing)
- `patterns/frontend/` — HOW for React/TS (includes `tooling/`)
- `patterns/business/` — domain-specific (offers, promotions)

---

## SOP — executable procedure (imperative)

**What it is**: A step-by-step recipe to accomplish a specific task. Has clear entry conditions, ordered steps, and exit criteria.

**Voice**: Imperative. "Do X, then Y, verify Z."

**Examples**:
- `patterns/core/sops/feature-delivery-workflow.md` — ticket → merged PR
- `patterns/core/sops/pr-documentation.md` — PR description template
- `patterns/business/sops/manual-testing-cart.md` — curl-by-step for cart scenarios
- `patterns/core/sops/typescript-verification-protocol.md` — `tsc --project` rule

**Two-layer structure** (see `patterns/core/sops/sop-creation.md`):
```
rules/sop/{name}.md          ← Reference, auto-loaded, ≤50 lines
patterns/**/sops/{name}.md   ← Detail, on-demand, full procedure
```

**When to create one**: A task has enough steps or nuance that reproducing it from memory causes errors or drift.

---

## `tooling/` — subfolder, not a type

`patterns/frontend/tooling/` groups patterns *about* dev tools:

- ESLint rule config and rationale
- TypeScript strict-mode conventions
- Prettier / Stylelint setup
- Build tool configuration patterns

These are still **patterns** (descriptive knowledge). If a tooling doc is a step-by-step procedure (e.g. "how to add a new ESLint rule"), it becomes an **SOP** at `patterns/frontend/tooling/sops/` or `patterns/core/sops/`.

---

## Decision table

| You're documenting… | Artifact | Location |
|---|---|---|
| A codebase convention (components, hooks, state) | Pattern | `patterns/frontend/{layer}/` |
| A build-tool configuration choice | Pattern | `patterns/frontend/tooling/` |
| A cross-cutting principle (quality, git policy) | Pattern | `patterns/core/` |
| A principle with no procedure attached | Pattern | `patterns/doctrine/` |
| A multi-step task someone will execute again | **SOP** | `patterns/**/sops/` + `rules/sop/` ref |
| A business rule or offer-type definition | Pattern | `patterns/business/` |
| A manual testing flow (curl, browser) | **SOP** | `patterns/business/sops/` |

---

## Quick test: pattern or SOP?

Ask: *"If I rewrote this doc, would the reader execute something specific afterward?"*

- **Yes, concrete steps** → SOP
- **No, they'd just understand the system better** → Pattern

---

## See Also

- `patterns/core/sops/sop-creation.md` — SOP two-layer structure
- `doctrine/index.md` — Three-layer sovereignty taxonomy (doctrine / core / frontend-business)
- `rules/_global.md` — How patterns and SOPs are referenced
