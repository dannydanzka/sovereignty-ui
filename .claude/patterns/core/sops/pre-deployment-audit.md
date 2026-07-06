# SOP: Pre-Deployment Audit

> **PURPOSE**: Final gate before `vercel --prod` / release — verifies the feature is not just *correct in code*, but *correct as a product*: integrated, homogeneous with existing design, reusing shared components, reachable end-to-end, and free of regressions the previous session may have masked.
> **SCOPE**: Run AFTER `code-audit.md` passes, BEFORE deploying to production or merging the release PR.
> **PREREQUISITES**: Feature implementation done; `code-audit.md` already green (lint + type-check + tests + build).
> **UPDATED**: 2026-04-22

---

## Why This SOP Exists

`code-audit.md` answers: *does the code compile, lint, type-check and pass tests?*
Pre-Deployment Audit answers: *is the feature shippable?*

A feature can be green on all code gates and still be wrong to ship:

- The public page renders but is not linked from nav or footer.
- The admin CRUD works but the public side does not reflect changes (RBAC, filters, caching).
- The component rebuilds a card/badge that already exists in the design system.
- The layout uses hardcoded values instead of design tokens.
- A previous session left TypeScript errors in test files that were never re-validated.
- Snapshots (`.claude/status/**`) were not updated, so future agents will re-explore from scratch.

These are **integration and governance** failures, not code failures. They do not show up in `yarn test` or `yarn lint`. They show up in production, or in the next sprint when the next agent has to rediscover the drift.

> *"Code generation is fast. Shipping correctly is governance."*
> — same spirit as `code-audit.md`, applied one level above.

---

## When to Run

| Trigger | Scope |
|---------|-------|
| Before `vercel --prod` / release tag | Full audit (all 6 phases) |
| Before merging release PR to `main` | Full audit |
| After a long session (>2h) with many files touched | Full audit — session fatigue hides regressions |
| After a `/compact` in the middle of a feature | Full audit — compaction can drop context about integration points |
| Hotfix (single-file, reversible) | Phases 1 + 5 only |

---

## Phase 1 — Re-run the Code Gates (non-negotiable)

Even if you ran them at the end of the implementation session, run them again now. Sessions drift. Sessions get compacted. Someone else may have pushed to the branch.

```bash
yarn type-check    # 0 errors
yarn lint          # 0 errors (warnings OK if pre-existing)
yarn test --run    # full suite, not just your files
yarn build         # catches SSR issues, missing exports, circular deps
```

**Why re-run**: in the Sponsors module audit (2026-04-22) this phase caught 3 TypeScript errors in test files that the implementation session had never re-validated:

- `SponsorFilters` used `search` instead of `searchTerm` (field renamed mid-session).
- Spreading `as never` return value (mock helper signature changed).
- `deletedAt: string` instead of `Date` (entity type hardened later).

All three would have shipped silently because the project runs `type-check` per-file during development, not aggregate.

**Fail condition**: any red → stop, fix, re-run.

---

## Phase 2 — Feature Integration Audit

Confirm the feature is **wired into the product**, not a sealed island.

### 2.1 Navigation & Entry Points

For every user-facing screen the feature adds, verify a user can reach it:

```bash
# Find all nav registrations mentioning the feature
grep -rn "<feature-label>" src/apps/**/presentation/hooks/use*Navigation*
grep -rn "<feature-route>" src/apps/**/presentation/components/**/Footer*
grep -rn "<feature-route>" src/apps/**/presentation/components/**/Drawer*
```

**Checklist**:
- [ ] Public nav / footer / hamburger includes the new route
- [ ] Admin sidebar includes the new module (if admin CRUD)
- [ ] Landing / dashboard includes any promotional strip or card (if applicable)
- [ ] Breadcrumbs / "back" links point somewhere valid

### 2.2 Routes & API Endpoints Inventory

Verify every new route is documented in the project's API inventory file (e.g. `.claude/rules/reference/api-endpoints.md`).

```bash
# For each new route file, grep the inventory doc
for route in $(find src/app/api/<feature>/ -name "route.ts"); do
  method=$(grep -oE "export const (GET|POST|PUT|PATCH|DELETE)" "$route")
  echo "$route → $method"
done
```

**Checklist**:
- [ ] Every new endpoint listed in the API inventory
- [ ] HTTP methods in docs match the actual exports (e.g. doc says `POST`, code exports `PUT`)
- [ ] Auth expectations documented (public/admin/owner)

> **Real bug this catches**: during the Sponsors audit, `POST /api/admin/sponsors/reorder` was documented but the route actually exports `PUT`. Caught by an API route smoke test comparing doc vs export.

### 2.3 Snapshots Updated

If your project uses context snapshots (`.claude/status/**`), verify they were updated:

```bash
git diff main -- .claude/status/
```

**Checklist**:
- [ ] New snapshot file if the feature is a new domain
- [ ] Existing snapshots updated if use cases / endpoints / entities changed
- [ ] `index.md` or equivalent listing the new snapshot

---

## Phase 3 — Design Homogeneity Audit

Confirm the feature's UI is visually and structurally consistent with the rest of the product.

### 3.1 Design Tokens (No Hardcoded Values)

```bash
# Scan the feature's styled files for raw values
grep -rnE "(#[0-9a-fA-F]{3,8}|\b[0-9]+px\b|\brgba?\()" src/apps/**/presentation/**/<feature>/**/*.styled.ts
```

**Expected**: zero matches. Every value should be a token (`${spacing.md}`, `${color.white}`, `${shape.lg}`, `${elevation.sm}`, `${typography.size.lg}`, `${layout.breakpoint.sm}`).

### 3.2 Page Wrapper Convention

Every new public screen should use the project's standard page wrapper (e.g. `PublicPageWrapper` + `PublicSection`). Every admin screen should use the admin layout wrapper.

```bash
grep -l "PublicPageWrapper\|PublicSection" src/apps/public/presentation/screens/<NewScreen>/*.tsx
grep -l "AdminLayout\|AdminPageWrapper" src/apps/admin/presentation/screens/<NewScreen>/*.tsx
```

**Fail condition**: new screen rolls its own `<div>`-based layout.

### 3.3 Responsive Breakpoints

Check every grid / flex container in the new screens has at least one breakpoint rule if it's a multi-column layout:

```bash
grep -B2 -A8 "grid-template-columns\|flex-direction" src/apps/**/presentation/**/<feature>/**/*.styled.ts | grep -E "@media|breakpoint"
```

**Checklist**:
- [ ] Multi-column grids collapse on mobile
- [ ] Flex rows wrap or stack on `sm`
- [ ] Typography scales (or at least doesn't break) at narrow widths

---

## Phase 4 — Component-Reuse Audit ("No Reinventing the Wheel")

This is the most commonly skipped audit and the one that silently rots design systems.

For every custom styled component in the new feature, ask: **does an equivalent already exist?**

### 4.1 Inventory New Styled Components

```bash
grep -rnE "^export const \w+ = styled\." src/apps/**/presentation/**/<feature>/**/*.styled.ts \
  | awk -F':' '{print $NF}' \
  | sort -u
```

### 4.2 Cross-Reference Against the Design System

For each new styled component, search for a pre-existing equivalent:

```bash
# Example: you created `CategoryBadge` — does a generic Badge already exist?
grep -rn "export const \w*Badge\w* = " src/libs/presentation/components/
grep -rn "export const \w*Card\w* = "  src/libs/presentation/components/
grep -rn "export const \w*Chip\w* = "  src/libs/presentation/components/
```

**Decision matrix**:

| Found equivalent? | Action |
|---|---|
| Yes, drop-in compatible | Delete the custom one, import the shared one |
| Yes, but needs a new variant | Add the variant to the shared component (not fork it) |
| Yes, but only solves 60% of needs | Document the delta in the PR — consider promoting later |
| No, but other screens rebuild the same shape | Flag as candidate for future extraction |
| No, and it's genuinely feature-specific | Keep custom, document in PR description |

> **Real finding (Sponsors audit)**: `SponsorCard` and `CategoryBadge` are built custom. Investigation showed the global `Badge` only exposes domain-specific variants (`RoleBadge`, `StatusBadge`, `EventStatusBadge`, etc.) — there is no generic `Badge`. The global `Card` is a `<div>` wrapper, not a link card. **25 other public screens build their cards the same way.** Verdict: custom is consistent with the established codebase convention — not a violation, but a candidate for future extraction into a shared `LinkCard`.

### 4.3 Look for Obvious Duplication

```bash
# Quick smell test: multiple screens with identical styled patterns
grep -rhE "styled\.a`[^`]{200,}" src/apps/ | sort | uniq -c | sort -rn | head
```

Repeated near-identical blocks (same gradient, same hover transform, same border-radius progression) are extraction candidates.

---

## Phase 5 — End-to-End Reachability

Prove the feature actually works end-to-end, in a running environment, against a real database.

### 5.1 E2E Test

```bash
yarn test:e2e <feature-spec>
```

**Expected**: all green, including auth-setup.

**What this proves that unit tests don't**:
- The API routes are actually registered in Next.js.
- Redux → Service → fetch → route → use case → repository → Prisma → DB works.
- RBAC middleware allows the right roles.
- The public page actually renders the data the admin just created.
- Cache invalidation / optimistic UI / redux-persist do not mask stale state.

### 5.2 Manual Browser Smoke Test

**Mandatory for any UI change.** Unit tests and E2E do not replace seeing the page.

```bash
yarn dev
# Then:
# 1. Open the public page in the browser — does it look like the rest of the site?
# 2. Resize to mobile — does it collapse cleanly?
# 3. Open DevTools console — any warnings? (React prop warnings like `iconOnly` / `isActive` leaking to DOM are real bugs)
# 4. Network tab — are the API calls hitting the expected routes with correct auth?
```

**Checklist**:
- [ ] Page renders with real data, not just loading state
- [ ] Empty state renders correctly (delete all records and reload)
- [ ] Error state renders correctly (disconnect network mid-request)
- [ ] No React key warnings / prop warnings / hydration warnings in console
- [ ] Mobile viewport renders correctly

### 5.3 API Reachability (optional but recommended)

For admin-protected endpoints, verify with curl (using `api-testing.md`):

```bash
# Login, save token
test_ep GET  "/api/admin/<feature>"
test_ep POST "/api/admin/<feature>" '{"name":"Test"}'
```

**What this catches**: middleware misconfigurations, missing route handlers, wrong HTTP method exports.

---

## Phase 6 — Regression Perimeter Check

The feature works in isolation. Does the rest of the product still work?

### 6.1 Adjacent-Area Smoke Tests

Run the test suite for areas the feature touches indirectly:

```bash
# If the feature touched shared Redux state, selectors, or services:
yarn test --run src/libs/infrastructure/state
yarn test --run src/libs/infrastructure/services
```

### 6.2 Visual Check of Shared Surfaces

If the feature added anything to shared UI surfaces (landing page, dashboard, nav, footer), open each surface in the browser:

- [ ] Landing page still renders correctly with the new section
- [ ] Admin sidebar scroll is not broken by the new entry
- [ ] Footer columns still balance

### 6.3 Coverage Thresholds

```bash
yarn test:coverage
```

**Expected**: global coverage thresholds (lines/branches/functions/statements) still pass. New code pulling down coverage is a signal of under-tested paths.

---

## Completion Checklist

Before declaring "ready to deploy":

- [ ] Phase 1 — all 4 code gates green (yarn type-check, lint, test, build)
- [ ] Phase 2 — feature reachable from nav/footer/landing; API inventory + snapshots updated
- [ ] Phase 3 — zero hardcoded values; standard wrappers; responsive breakpoints present
- [ ] Phase 4 — no duplicated design primitives; custom styled components justified
- [ ] Phase 5 — E2E green; manual browser smoke test done; no console warnings
- [ ] Phase 6 — adjacent test suites still green; coverage thresholds held

If all six pass: deploy.
If any fail: do not deploy — the feature is code-correct but product-incorrect.

---

## Relationship to Other SOPs

```
┌──────────────────────────────────────────────────────────────┐
│ Sovereign Context Design  → SCD: intent before code          │
│ Sovereign Code Governance → SCG: governed execution          │
│ Code Audit                → is the code correct?             │
│ Pre-Deployment Audit      → is the feature shippable? ← HERE │
│ PR Documentation          → is the change communicated?      │
│ Feature Delivery Workflow → end-to-end ticket → merge        │
└──────────────────────────────────────────────────────────────┘
```

- `code-audit.md` — runs before each commit; focuses on code correctness.
- **`pre-deployment-audit.md`** — runs before deploy/merge-to-main; focuses on product correctness.
- `pr-documentation.md` — runs after this SOP passes; captures the change for reviewers.

---

## Anti-Patterns This SOP Prevents

| Anti-pattern | Symptom in production |
|---|---|
| "I tested my files, I'm done" | Snapshot drift, unreachable pages, dead nav links |
| "Coverage is green, ship it" | Feature works in isolation but breaks the landing page layout |
| "The component looked fine in Storybook" | Page uses hardcoded `16px` everywhere; mobile is broken |
| "Why rebuild a Card when one exists?" — nobody asks | Design system fragments into 25 competing card definitions |
| "Last session said it was done" | 3 TypeScript errors in tests, never re-validated after the last rename |
| "The API works, trust me" | Doc says `POST`, code exports `PUT`, next agent writes a test against doc and fails |

---

## References

- `code-audit.md` — precedes this SOP (code-level gates)
- `pr-documentation.md` — follows this SOP (communication)
- `api-testing.md` — used in Phase 5.3
- `coverage-report.md` — used in Phase 6.3
- `sovereign-context-design.md` / `sovereign-code-governance.md` — the governance frame this SOP operationalizes at the deploy gate
