# Testing in an Nx Monorepo — Layer 3 (Stack)

> **Layer**: 3 (stack-specific)
> **Stack**: Nx 16+ workspace with Jest (default) or Vitest
> **Updated**: 2026-04-22

For runner config see `runners/jest.md` / `runners/vitest.md`. This doc covers what changes when the runner sits inside an Nx workspace.

---

## Project structure

```
workspace/
├── jest.preset.js          ← shared base config (Jest)
├── jest.config.ts          ← lists projects
├── tsconfig.base.json      ← shared paths (the source of truth)
├── apps/
│   └── web/
│       ├── jest.config.ts        ← extends preset
│       ├── tsconfig.json         ← extends base
│       └── tsconfig.spec.json    ← extends base + test-only paths
└── libs/
    └── core/
        ├── jest.config.ts
        └── src/test/helpers/     ← shared @test-helpers (see below)
```

The constraint: every project tests in **isolation** (Nx caches per-project) but **shares helpers and types** through libs. The wiring happens in three places: `tsconfig.base.json` (paths), `jest.preset.js` (Jest defaults), and per-project `tsconfig.spec.json` (test-only paths).

---

## jest.preset.js (workspace root)

```js
const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  coverageReporters: ['text', 'lcov', 'json-summary'],
  clearMocks: true,
  testEnvironment: 'jsdom',
};
```

Per-project `jest.config.ts`:

```ts
import type { Config } from 'jest';

const config: Config = {
  displayName: 'web',
  preset: '../../jest.preset.js',
  setupFilesAfterEach: ['<rootDir>/src/test/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@test-helpers$': '<rootDir>/../../libs/core/src/test/helpers/index.ts',
    '^@test-helpers/(.*)$': '<rootDir>/../../libs/core/src/test/helpers/$1',
  },
  coverageDirectory: '../../coverage/apps/web',
};

export default config;
```

Two non-obvious things:

1. `displayName` shows up in CI logs when running multiple projects in parallel — make it match the Nx project name.
2. `coverageDirectory` lives outside the project so Nx can collect it without polluting the project tree.

---

## tsconfig paths (the gotcha)

`tsconfig.base.json` defines workspace paths once:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@core/*": ["libs/core/src/*"],
      "@test-helpers": ["libs/core/src/test/helpers/index.ts"],
      "@test-helpers/*": ["libs/core/src/test/helpers/*"]
    }
  }
}
```

**Trap**: a project's `tsconfig.json` that re-declares its own `paths` **overrides** (does not merge with) the base. Test-only paths like `@test-helpers` must be redeclared in every project that imports them — even though Jest resolves them through `moduleNameMapper`.

```json
// apps/web/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@core/*": ["../../libs/core/src/*"],
      "@test-helpers": ["../../libs/core/src/test/helpers/index.ts"],
      "@test-helpers/*": ["../../libs/core/src/test/helpers/*"]
    }
  }
}
```

**Symptom of forgetting this**: tests run green (Jest finds the module) but `tsc --noEmit` errors with `Cannot find module '@test-helpers'`. The lint/CI gate catches it.

`tsconfig.spec.json` (used by the IDE for `.test.ts` typing) extends `tsconfig.json`, so re-declaring paths there too is unnecessary **as long as** `tsconfig.json` already has them.

---

## Shared `@test-helpers` library

Centralize what every project's tests need:

```
libs/core/src/test/helpers/
├── index.ts                ← public re-exports
├── render-with-providers.tsx
├── stable-mocks.ts         ← OOM-safe mock factories
├── assertion.ts            ← centralized assertions (see project overlay)
├── dom.ts                  ← low-level DOM helpers
├── user.ts                 ← userEvent wrappers
└── timers.ts               ← fake-timer helpers
```

`index.ts`:

```ts
export * as assertion from './assertion';
export * as dom from './dom';
export * as user from './user';
export * as timers from './timers';
export { renderWithProviders } from './render-with-providers';
export { stableI18n, stableToast, stableScreenLoader } from './stable-mocks';
```

Tests import the namespace:

```ts
import { renderWithProviders, screen, user, assertion, timers } from '@test-helpers';
```

Project-specific assertions (e.g., your-company's `assertion.textPresent`) live in this library, **not** scattered in each project's `__tests__/`. The library is the contract. See `projects/your-company/patterns/frontend/testing/helpers-contract.md` for your-company's specific API.

---

## Running tests

```bash
nx test web                    # one project
nx test web --watch
nx test web --coverage
nx run-many -t test            # all projects (parallel, cached)
nx affected -t test            # only projects affected by current changes
nx affected -t test --base=main --head=HEAD
```

`nx affected` is the killer feature in CI — only retest projects whose dependency graph touched your changes.

---

## Cache hygiene

Nx caches Jest results based on inputs (source files + config + dependencies). Two failure modes:

1. **Stale cache hides regressions** — usually because a transitive dep wasn't in the cache key. Add it to `targetDefaults.test.inputs` in `nx.json`.
2. **Cache misses on every run** — usually a setup file mutating workspace state, or non-deterministic source generation. Diagnose with `--skip-nx-cache`.

```json
// nx.json
{
  "targetDefaults": {
    "test": {
      "inputs": [
        "default",
        "^production",
        "{workspaceRoot}/jest.preset.js",
        "{workspaceRoot}/tsconfig.base.json"
      ],
      "cache": true
    }
  }
}
```

---

## CI parallelism

`nx affected -t test --parallel=4` runs up to 4 projects concurrently. Inside a project, Jest still spawns its own workers. Total = `parallel × maxWorkers`. Tune both based on CI runner capacity, not arbitrarily.

For very large monorepos, set `--maxWorkers=2` per-project to avoid contention when `--parallel=4`. Memory is usually the bottleneck before CPU.

---

## Coverage aggregation

Each project writes coverage to `coverage/<project>/`. Aggregate at the workspace root:

```bash
nx run-many -t test --coverage
# Merge with nyc or coverage-merger:
npx istanbul-merge --out coverage/merged.json 'coverage/*/coverage-final.json'
npx istanbul report --include coverage/merged.json --dir coverage/merged lcov text
```

Per-project thresholds in each `jest.config.ts`. Workspace-level threshold is rarely useful — it averages weak and strong projects together.

---

## Vitest in Nx

Nx supports Vitest via `@nx/vite`. The same path-aliasing constraint applies (`vitest.config.ts` shares `resolve.alias` with the Vite build config). The `testing-by-layer` and helper-library patterns are runner-agnostic.

```ts
// vitest.config.ts (Nx project)
import { defineConfig } from 'vitest/config';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  plugins: [nxViteTsPaths()],  // reads tsconfig.base.json paths automatically
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setupTests.ts'],
    clearMocks: true,
  },
});
```

`nxViteTsPaths` removes the manual `moduleNameMapper`-equivalent dance. Vitest in Nx is generally less configuration than Jest in Nx.

---

## Common failures

| Symptom | Cause | Fix |
|---|---|---|
| `Cannot find module '@test-helpers'` (TS) but Jest passes | Path missing in project's `tsconfig.json` | Redeclare in project tsconfig (paths don't merge from base) |
| Tests pass locally, fail in CI with module not found | `setupFilesAfterEach` path wrong on case-sensitive FS | Use exact case; macOS hides bugs Linux exposes |
| Cache hit on a test that should re-run | Input not in `targetDefaults.test.inputs` | Add the file/config to inputs |
| Coverage % differs between local and CI | Different files included | Pin `collectCoverageFrom` per project, don't rely on auto-detection |
| `displayName` not shown in CI | `nx test` swallows it | Use `nx run-many` or `nx affected`, not single-project `nx test` |

---

## Related

- `runners/jest.md` — Jest config baseline this extends
- `runners/vitest.md` — Vitest equivalent
- `stacks/nextjs-app-router.md` — Next.js apps inside an Nx workspace
- `stacks/redux-toolkit.md` — RTK in shared libs
- `projects/your-company/patterns/frontend/testing/helpers-contract.md` — your-company's `@test-helpers` API
