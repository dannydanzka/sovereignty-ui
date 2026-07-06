# Coverage — Layer 1 (Agnostic)

> **Layer**: 1 (agnostic)
> **Updated**: 2026-04-22

---

## What coverage measures

Coverage tools (Istanbul/v8) record which lines, branches, functions, and statements executed during the test run. They report percentages.

What they **don't** measure:
- Whether the executed code was **asserted on**.
- Whether the assertion was **meaningful**.
- Whether the test would catch a regression.

A test that renders a component and asserts nothing produces 100% line coverage of that component. The number lies.

---

## The four metrics

| Metric | What it counts |
|---|---|
| **Statements** | Each statement executed at least once |
| **Branches** | Each side of each `if` / `?:` / `&&` / `||` / `switch` taken |
| **Functions** | Each function invoked at least once |
| **Lines** | Each source line executed (mostly redundant with statements) |

**Branches is the only honest one.** Lines/statements/functions can be padded by smoke tests that touch code without exercising decisions. Branch coverage forces you to test both paths of every decision.

---

## Recommended thresholds

The number depends on the layer being tested:

| Layer | Branches | Functions | Lines |
|---|---|---|---|
| Pure logic (utils, validators, mappers, reducers) | 95+ | 100 | 95+ |
| Hooks (presentation layer) | 85+ | 90+ | 85+ |
| Components | 70+ | 80+ | 75+ |
| Wiring (config, root files, app shell) | 0 (don't measure) | 0 | 0 |
| Generated code (codegen, prisma client) | excluded | excluded | excluded |

Global thresholds (e.g., `branches: 80` everywhere) punish components and reward util functions for being trivially testable. Set per-directory in the runner config.

---

## What to exclude

```ts
collectCoverageFrom: [
  'src/**/*.{ts,tsx}',
  '!src/**/*.styled.{ts,tsx}',     // styled-components — test visual output, not styles
  '!src/**/*.stories.{ts,tsx}',    // storybook
  '!src/**/index.{ts,tsx}',        // barrel re-exports
  '!src/**/*.d.ts',                // type-only
  '!src/**/__mocks__/**',          // mock implementations
  '!src/**/__tests__/**',          // tests themselves
  '!src/generated/**',             // codegen
],
```

Including these inflates the denominator and produces meaningless "we improved coverage by deleting type files" wins.

---

## When the number lies

| Symptom | Likely cause |
|---|---|
| Coverage drops after a refactor that didn't change behavior | Tests coupled to implementation; refactor exposed the dead test code |
| Coverage stays flat after adding feature tests | Already-tested code got re-touched; new branches not exercised |
| Coverage is 95% but bugs ship anyway | Tests assert weakly (or not at all); high line %, low assertion % |
| Single file at 100% but reviewers find untested edge cases | Function coverage is met by any call, regardless of arguments tested |

The fix is never "lower the threshold" or "delete the test". Diagnose what the number is hiding.

---

## What to measure instead — or alongside

- **Mutation testing** (Stryker): mutates source code, reruns tests, reports which mutations survived. Surviving mutations = code with no real assertion. Slow, valuable for critical modules.
- **Per-file thresholds**: catch regressions in specific files (`src/domain/critical-flow/**: 90`) instead of letting average coverage hide a 30% file.
- **PR-level diff coverage**: measure coverage of the lines this PR changed, not the whole codebase. Reviewers know what's new.

---

## CI configuration

Two complementary checks:

1. **Threshold gate**: build fails if coverage drops below the per-layer threshold. Catches deletion of tests.
2. **Diff coverage gate**: build fails if the PR's new lines have <X% coverage. Catches new code shipped untested.

Don't rely on (1) alone. A PR that adds 100 lines of untested code and 1 line of well-tested code can still keep the average above the threshold.

---

## What threshold to set on day one

Pick the **current** measured coverage as the floor. Never start at 80% if the codebase is at 45% — every PR will fail and the team will learn to bypass the gate.

Ratchet up as tests improve:

```
Week 1: floor at current (e.g., 45%)
Each PR: must not lower the floor
Quarterly: bump floor by 5% if comfortably above it
```

This makes coverage a one-way ratchet. The number can only go up.

---

## Reporting

- **Local**: HTML report in `coverage/lcov-report/index.html`. Heatmap shows uncovered branches.
- **CI**: machine-readable (`lcov.info`) for diff-coverage tools and dashboard ingestion.
- **PR comment**: post the summary table; don't make reviewers click through artifacts.

---

## Related

- `philosophy.md` — why "value over coverage" still holds even with good thresholds
- `anti-patterns.md` — common ways tests inflate coverage without proving anything
- Runner docs for `coverage` config syntax: `runners/jest.md`, `runners/vitest.md`
