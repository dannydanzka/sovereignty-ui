# Playwright — Layer 2 (E2E Runner)

> **Layer**: 2 (runner-specific)
> **Version**: Playwright 1.38+ (tsconfig paths native)
> **Updated**: 2026-04-22
> **Reference impl**: YourCompany your-project — `e2e/specs/monitoring/` (TASK-ID)

This doc covers E2E-specific architecture: POM layout, auth caching, timeouts, ESLint isolation, path alias, and custom rules. For Jest/unit coverage see `runners/jest.md`.

---

## 1. When Playwright (vs unit/component)

- **Unit/component (Jest + RTL)** — code-level correctness. Fast, mock-driven.
- **Playwright (E2E)** — integration across real UI + real backend. Slow (seconds per spec), flake-sensitive, role-gated.

Both are mandatory for user-facing flows. Playwright is *not* a replacement for unit tests — it complements them.

---

## 2. Directory layout — domain-driven

E2E is test code. Its folder is isolated from production via a one-way path alias. Specs are grouped by **module** and then by **category** (not by role — roles are multiplied across categories via the test runner's project system).

```
e2e/
├── tsconfig.json              # `@e2e/*` alias — production can't import from e2e
├── setup/                     # Auth fixtures (one project per role)
├── pages/                     # Page Objects — thin, no assertions
├── specs/
│   └── <module>/
│       ├── _demo/             # Walkthrough demo (single worker, headed)
│       ├── landing/           # Per-role screen hydration
│       ├── drill/             # Drill-down chains
│       ├── filters/           # pagination / search / sorting / empty-state
│       ├── integrity/         # Invariant assertions on payloads
│       ├── errors/            # API failure paths
│       ├── export/            # Downloads
│       └── tabs/              # Tab cycling + UI interactions
├── support/
│   ├── core/                  # Cross-cutting (roles, timeouts) + barrel
│   └── <domain>/              # Per-domain helpers + barrel
└── playwright/.auth/          # storageState per role (gitignored)
```

### Path alias — `@e2e/*`

Declare in a dedicated `e2e/tsconfig.json` that extends the project root:

```json
{ "extends": "../tsconfig.json",
  "compilerOptions": { "baseUrl": ".", "paths": { "@e2e/*": ["./*"] } },
  "include": ["**/*.ts"] }
```

Playwright 1.38+ resolves tsconfig `paths` natively at runtime. `tsc --project e2e/tsconfig.json` verifies at type-check time. The alias lives **only** in `e2e/tsconfig.json`, so production code cannot reach `e2e/`.

Usage:

```ts
import { MonitoringPage } from '@e2e/pages/MonitoringPage';
import { waitForMonitoring } from '@e2e/support/monitoring/base';
```

---

## 3. Multi-project runner — roles as projects

One Playwright project per actor (role, tenant, permission tier). Each project:

- Declares `dependencies: ['auth-setup']` so login runs first.
- Uses `storageState` from `.auth/<role>.json` (persisted by the setup step).
- Routes specs with `testMatch` regex so one basename only runs under the intended role.

`testMatch` shape (category-agnostic):

```ts
testMatch: /\/<module>\/[^/]+\/(name1|name2|…)\.spec\.ts$/
```

The `[^/]+` segment matches any category folder, so placing a spec in `<module>/landing/` or `<module>/drill/` doesn't require regex changes.

---

## 4. Auth caching

Auth is the most expensive step. Pay once per project.

- Run setup as a dedicated project with `dependencies`. All other projects reuse its `storageState`.
- Randomize `x-forwarded-for` per context to mitigate rate-limiting when runs collide (Firebase and similar IAMs block after N failed attempts per IP).
- **Pre-warm the backend**: after login, hit the feature landing endpoint via the UI and known drill-target endpoints via `page.request.get` (inherits the Bearer token from localStorage). Cold aggregate endpoints can take 2–7s on first hit; warming them during setup lets specs keep strict 5–8s budgets.

---

## 5. Timeouts — measure, don't guess

Two buckets. Setup pays cost once (first compile + cold BE), specs run warm and stay strict.

```ts
export const TIMEOUTS = {
  ACTION: 3_000,        // click / type
  API_REQUEST: 5_000,   // single API round trip (warm target: <300ms)
  PAGE_LOAD: 5_000,     // navigation + first paint
  SAGA_CHAIN: 8_000,    // side-effect fan-out + hydration
} as const;

export const SETUP_TIMEOUTS = {
  LOGIN_PAGE: 15_000,   // first dev-server compile
  POST_LOGIN: 20_000,   // post-login redirect
  WARMUP: 20_000,       // cold BE hit per endpoint
} as const;
```

If a spec hits `TIMEOUTS`, it's a real regression — don't widen the budget. Prove root cause with a curl probe first (cold vs warm), then either add the endpoint to `DRILL_WARM_TARGETS` or file a backend ticket.

### Helper pitfall — lazy vs eager waits

`page.waitForResponse` registers a listener that rejects with `Test ended` if never awaited. Shared helpers must use lazy getters so unused waits are never registered:

```ts
// ✅ lazy
export const waitForX = (page) => {
  let headerWait, distWait;
  return {
    get header() { return (headerWait ??= page.waitForResponse(/* … */)); },
    get distribution() { return (distWait ??= page.waitForResponse(/* … */)); },
  };
};
```

---

## 6. Page Object Model — rules

- One POM per screen. Assertion-free — assertions live in specs.
- Expose locators + navigation. `goto()` accepts a `timeout` parameter so demo/slow runs can override.
- Use `waitUntil: 'commit'` on `page.goto` when the spec immediately waits on a specific locator — it avoids double-waiting on `load`.
- No imports from production `packages/*` — e2e is a separate compilation unit.

---

## 7. Selector priority

| Priority | Selector | Notes |
|---|---|---|
| 1 | `getByTestId('…')` | Stable. Prefer `<module>-<concept>-<variant>` kebab format. |
| 2 | `getByRole('…', { name })` | Semantic buttons/links without a testid |
| 3 | `getByText(…)` | Last resort; breaks on i18n changes |

Locators belong in Page Objects, not inlined in specs (see §9 custom rule).

---

## 8. ESLint isolation

E2E gets flexibility proportional to the harm each rule prevents — the same philosophy used for unit test files. Relaxations live in a dedicated `e2e/**` block; every disabled rule carries an inline JSDoc explaining why. A rule without justification must be promoted back to `error` or deleted.

Themes:

| Theme | Why |
|---|---|
| **TypeScript typed rules** | E2E sits outside the main TS project, no program attached — typed rules can't run |
| **Custom production-architecture rules** | Component layout, hook composition, i18n, magic literals — designed for production code, not specs |
| **Unit-test plugin (Jest/Vitest)** | Playwright shares `test`/`expect` names but not semantics — heuristics fire false positives |
| **@testing-library/\*** | Playwright exposes the same query names as RTL; plugin can't distinguish them |
| **General smells** | `await`-in-loop (sequential is correct for drill chains), `console` (intentional observability), import resolvers that don't know the alias |

---

## 9. Playwright plugin — `eslint-plugin-playwright`

Enable the official plugin (`flat/recommended`). It authoritative-ly covers Playwright footguns — `no-wait-for-timeout`, `no-focused-test`, `no-element-handle`, `no-eval`, `no-page-pause`, `no-networkidle`, `missing-playwright-await`, `valid-expect`, plus a second tier (`prefer-web-first-assertions`, `no-conditional-in-test`, `expect-expect`, `require-top-level-describe`, …). **Never reinvent rules the plugin provides.** Keep critical ones at `error`, stylistic/signal ones at `warn`.

## 10. Custom ESLint rules — gaps the plugin doesn't cover

Three project-local rules for architectural invariants specific to your layout. Severity `warn` (signal, not block):

| Rule | Flags | Exceptions |
|---|---|---|
| `e2e-no-hardcoded-url` | `http(s)://` literals in specs/pages | `setup/**`, `support/**` |
| `e2e-page-object-required` | `page.getByRole/getByTestId/getByLabel/getByText(...)` in spec files | Page Objects, support, setup, `page.locator(...)` |
| `e2e-no-cross-domain-support-import` | `support/<A>/` importing from `support/<B>/` | `support/core/` always allowed |

Rationale: these codify the patterns above so drift surfaces in review instead of at 3am when a spec flakes in CI.

---

## 11. CI wiring

- Use the official Playwright Docker image pinned to the exact version (`mcr.microsoft.com/playwright:vX.Y.Z-<distro>`) — browsers pre-installed.
- `workers: 1` in CI until the flake budget is measured under parallel pressure.
- `retries: 2` in CI, `0` locally — retries mask real regressions during development.
- Artifacts: `playwright-report/` + `test-results/` for post-hoc diagnosis.
- Secrets: per-role credentials as secured repo variables — never committed.

Before wiring, confirm with the team whether E2E is **blocking** or **advisory**. Advisory runs without enforcement produce slow death; blocking runs without a known flake budget produce slow PRs.

---

## 12. Test-only changes ship separately

Changes that touch only specs, Page Objects, support helpers, or snapshots ship in a dedicated PR targeting the trunk branch on a `chore|test/*-tests-<area>` branch. Bundling test churn into feature PRs hides logic changes and balloons review time.

See `methodology/development/sops/sdp/branch-strategy.md` → "Test-only changes".

---

## See Also

- `runners/jest.md` — unit/component runner (layer 2 sibling)
- `runners/vitest.md` — unit/component runner for ESM/Vite stacks
- `react-testing-library.md` — selector philosophy shared with Playwright
- `methodology/development/sops/scg/e2e-testing.md` — imperative E2E testing SOP
