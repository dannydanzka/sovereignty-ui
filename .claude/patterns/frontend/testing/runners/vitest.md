# Vitest — Layer 2 (Runner)

> **Layer**: 2 (runner-specific)
> **Version**: Vitest 1+
> **Updated**: 2026-04-22
> **Mirrors**: `runners/jest.md` (same sections, different syntax)

This doc covers Vitest config and API only. For *why* to test something see Layer 1 (`philosophy.md`, `react-testing-library.md`, `test-doubles.md`). For Vitest in a specific stack see Layer 3 (`stacks/`).

---

## When to choose Vitest

- Vite-based project (free integration, shared config)
- ESM-native codebase (no CJS interop pain)
- New project without legacy Jest plugins
- Greenfield monorepo where Nx/Lerna isn't the constraint

If the project already runs Jest, **don't migrate without a reason**. Migration cost is real; "Vitest is faster" alone is rarely enough.

---

## Minimal config

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    clearMocks: true,
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json-summary'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.styled.{ts,tsx}', 'src/**/index.{ts,tsx}', 'src/**/*.d.ts'],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
```

`globals: true` makes `describe`, `it`, `expect`, `vi` available without imports — matching Jest ergonomics. If you prefer explicit imports, set `globals: false` and import from `'vitest'`.

---

## setup file

```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest';

// Polyfills jsdom doesn't ship
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
```

`setupFiles` (Vitest) runs **before** the test file imports. Equivalent to Jest's `setupFiles`. For after-import setup (rare) use `setupFiles` with side-effect-only imports.

---

## Module mocking

```ts
// 1. Type imports
import type { UserService } from './user.service';

// 2. vi.mock — hoisted to top
vi.mock('./user.service', () => ({
  userService: {
    getById: vi.fn(),
  },
}));

// 3. Runtime imports
import { userService } from './user.service';

// 4. Type-safe mock access
const mockGetById = vi.mocked(userService.getById);

it('returns user', async () => {
  mockGetById.mockResolvedValue({ id: '1', name: 'María' });
  const user = await userService.getById('1');
  expect(user.name).toBe('María');
});
```

`vi.mocked()` is the type-safe accessor. Never cast with `as Mock`.

### Partial mock with original

```ts
vi.mock('@helpers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@helpers')>();
  return {
    ...actual,
    specificFunction: vi.fn(),
  };
});
```

Note the `async` factory — Vitest supports this natively, Jest doesn't.

### Stable reference (avoids OOM — see anti-patterns)

```ts
const authState = { user: mockUser, isLoading: false };
vi.mock('@core/state', () => ({
  useAppSelector: () => authState,
}));
```

---

## Fake timers

```ts
beforeEach(() => {
  vi.useFakeTimers({ now: new Date('2026-01-01T00:00:00Z') });
});

afterEach(() => {
  vi.useRealTimers();
});

it('debounces input', () => {
  // ... type into input
  act(() => { vi.advanceTimersByTime(300); });
  expect(handler).toHaveBeenCalledTimes(1);
});
```

For async timer advancement: `await vi.advanceTimersByTimeAsync(ms)`.

---

## userEvent + fake timers

```ts
const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
await user.type(input, 'hola');
act(() => { vi.advanceTimersByTime(500); });
```

The `.bind(vi)` matters — `userEvent` calls the function detached from its context.

---

## Async expect helpers

```ts
await expect(service.fetchUser('1')).resolves.toEqual(mockUser);
await expect(service.fetchUser('bad')).rejects.toThrow('Error de red');
```

Always `await`.

---

## Coverage

Per-directory thresholds use `thresholds.perFile` or specify directories explicitly:

```ts
coverage: {
  thresholds: {
    'src/domain/**': { branches: 95, functions: 100, lines: 95 },
    'src/components/**': { branches: 70, functions: 80, lines: 75 },
    branches: 80, functions: 80, lines: 80, statements: 80, // global fallback
  },
}
```

`json-summary` reporter feeds CI diff-coverage tools.

See Layer 1 `coverage.md` for guidance.

---

## Watch mode and filtering

```bash
yarn vitest                            # watch by default
yarn vitest run                        # one-shot, like Jest
yarn vitest path/to/file.test.ts       # single file
yarn vitest -t "submits form"          # by test name
yarn vitest --changed                  # only files changed vs HEAD
yarn vitest --reporter=verbose         # detailed output
yarn vitest --pool=forks               # debug worker issues (alternative to threads)
```

---

## Common config mistakes

| Mistake | Symptom | Fix |
|---|---|---|
| Missing `@vitejs/plugin-react` | JSX fails to transform | Add plugin to `plugins` |
| `globals: false` + missing imports | `expect is not defined` | Either set `globals: true` or import from `'vitest'` |
| Vite alias not mirrored in `test.alias` | Imports fail in test | Use `resolve.alias` (shared) not `test.alias` (test-only) |
| Mocked module imported before `vi.mock` (in async context) | Mock not applied | Vite's hoisting only handles top-level `vi.mock`; avoid dynamic mocking |
| `clearMocks: false` (default) + spy assertions | Stale call counts | Set `clearMocks: true` |

---

## Debugging a hanging test

1. `--reporter=verbose` — shows which test is currently running.
2. `--testTimeout=2000` per-test — fail fast.
3. `--pool=forks` — eliminates thread-shared-memory issues.
4. `--no-file-parallelism` — equivalent of Jest's `--runInBand`.
5. Bisect with `it.only` to find the offending test.

For OOM diagnosis, run with `node --max-old-space-size=8192 ./node_modules/.bin/vitest run` and watch heap growth.

---

## Jest equivalents

See the table at the bottom of `runners/jest.md`. Key migration notes:

- `vi.mock` accepts an **async factory** (`async (importOriginal) => ...`); Jest does not.
- `vi.importActual` is async; `jest.requireActual` is sync.
- `vitest/config` is separate from `vite.config` but can extend it via `mergeConfig`.

---

## Related

- `philosophy.md` — what to test
- `react-testing-library.md` — how to render and query
- `test-doubles.md` — when and where to mock
- `anti-patterns.md` — Vitest-flavored OOM and async traps
- `runners/snapshot-testing.md` — `toMatchSnapshot` mechanics
- `stacks/nx-monorepo.md` — Vitest with Nx (less common but supported)
- `stacks/nextjs-app-router.md` — Vitest with Next.js App Router
