# Frontend Testing — Three-Layer Doctrine

> **Module**: frontend/testing
> **Scope**: React-based UIs (web + native), runner-agnostic, stack-aware
> **Updated**: 2026-04-22
> **Status**: Canonical for ALL React projects (YOUR-PROJECT + your-company + future)

---

## Why three layers

Testing knowledge fragments into three orthogonal axes:

1. **What** to test and **why** — independent of tools
2. **How** to express it — runner-specific (Jest vs Vitest vs others)
3. **Where** it plugs in — stack combinations (Nx, Next.js, RTK, RN)

Conflating them produces the symptoms we have today: "Vitest" docs that bleed into Jest projects, "Jest" docs that hardcode Lerna+Sagas, framework-specific examples in agnostic philosophy. The three-layer split keeps each doc honest about its scope.

---

## Layer 1 — Agnostic principles (this directory)

Apply to **every** React-based test, regardless of runner or stack.

| Doc | Scope |
|---|---|
| `philosophy.md` | Value > coverage. What to test, what to skip. AAA. Behavior > implementation. |
| `react-testing-library.md` | Queries, `userEvent`, async patterns, `act()`, accessibility-first selectors. |
| `test-doubles.md` | Stubs, mocks, spies as concepts. Boundaries. When to mock, when not. |
| `anti-patterns.md` | Catalog of what to avoid + ESLint mappings (where applicable). |
| `coverage.md` | What to measure. Thresholds. When the number lies. |

Read this layer first. Everything else builds on it.

---

## Layer 2 — Runner-specific (`runners/`)

Same principles, different syntax. Each runner doc mirrors the others — if Jest has a section, Vitest has the equivalent.

| Doc | Scope |
|---|---|
| `runners/jest.md` | Jest 29+ config, `jest.config`, `setupFilesAfterEach`, `moduleNameMapper`, `jest.mock` semantics. |
| `runners/vitest.md` | Vitest 1+ config, `vitest.config`, `setupFiles`, `vi.mock` semantics, ESM. |
| `runners/snapshot-testing.md` | Inline + file snapshots — when they help, when they hurt. Same mechanics in both runners. |
| `runners/playwright.md` | E2E layer — POM, auth caching, timeouts, `@e2e/*` path alias, ESLint isolation, 4 custom rules. |

**No project should pick a runner based on these docs.** The choice is upstream (build pipeline, monorepo tooling, ESM vs CJS). These docs only document the runner you already chose.

---

## Layer 3 — Stack combinations (`stacks/`)

How testing changes when you combine the canonical libs.

| Doc | Scope |
|---|---|
| `stacks/nx-monorepo.md` | `jest.preset`, project references, shared `@test-helpers`, path aliases in `tsconfig.spec`. |
| `stacks/nextjs-app-router.md` | Mocking `next/navigation`, `'use client'` boundaries, server vs client components. |
| `stacks/redux-toolkit.md` | Testing slices, thunks, `createAsyncThunk`, RTK Query, store-aware `renderWithProviders`. |
| `stacks/redux-saga.md` | `expectSaga`, watchers, workers, cancellation. Pairs with RTK (complement, not alternative). |
| `stacks/react-native.md` | `@testing-library/react-native`, `fireEvent` vs `userEvent`, navigation mocks, `toBeOnTheScreen`. |

A stack doc may reference Layer 1 ("for behavior-vs-implementation principle see `philosophy.md`") and Layer 2 ("Jest config snippets in `runners/jest.md`") but never duplicates them.

---

## Project overlays

Project-specific deviations live under `sovereignty/projects/<project>/patterns/frontend/testing/`. Examples:

- **your-company**: `helpers-contract.md` (their `@test-helpers` API), `stable-mocks.md` (OOM-prevention factories).
- **YOUR-PROJECT**: `sagas.md` if Sagas remain in their stack.

Project overlays add or override; they never re-declare canonical principles.

---

## Reading paths

**New to this codebase** → `philosophy.md` → `react-testing-library.md` → runner doc → stack docs you actually use.

**Adding a test to existing project** → `anti-patterns.md` first (catch common mistakes), then layer-3 doc for the relevant stack.

**Choosing a coverage threshold** → `coverage.md`.

**Configuring a new project** → runner doc + relevant stack docs (typically nx + nextjs OR react-native).

---

## E2E testing

E2E lives in `sovereignty/qa/automation/` — see `qa/automation/playwright.md` and `qa/automation/e2e-timeouts.md`. The boundary: if it boots a browser end-to-end with real network and routing, it's QA automation. If it renders React with `@testing-library/*` and mocks the boundaries, it's frontend testing.

---

## Related

- `sovereignty/qa/automation/` — Playwright E2E patterns
- `sovereignty/frontend/quality/` — ESLint, TS strictness, lint-staged
- `sovereignty/core/documentation/context-snapshots.md` — documentation snapshots (NOT jest snapshots)
