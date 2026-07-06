# Jest — Layer 2 (Runner)

> **Layer**: 2 (runner-specific)
> **Version**: Jest 29+
> **Updated**: 2026-04-22
> **Mirrors**: `runners/vitest.md` (same sections, different syntax)

This doc covers Jest config and API only. For *why* to test something see Layer 1 (`philosophy.md`, `react-testing-library.md`, `test-doubles.md`). For Jest in a specific stack (Nx, Next.js, RTK, RN) see Layer 3 (`stacks/`).

---

## When to choose Jest

- Project already on Jest (don't migrate without reason)
- CommonJS-friendly toolchain (Babel-based pipelines, Nx default)
- Mature ecosystem requirements (`jest-preset-angular`, `jest-image-snapshot`, etc.)
- React Native (Jest is the only first-class option)

For new ESM-native or Vite-based projects see `runners/vitest.md`.

---

## Minimal config

```ts
// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEach: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  clearMocks: true,
  resetMocks: false,
  restoreMocks: false,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.styled.{ts,tsx}',
    '!src/**/index.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  },
};

export default config;
```

`clearMocks: true` is the only mock-cleanup setting most projects need. Avoid `resetMocks: true` and `restoreMocks: true` together — they interact in surprising ways with module-level mock implementations.

---

## setup file

```ts
// jest.setup.ts
import '@testing-library/jest-dom';

// Polyfills the browser doesn't ship in jsdom
import 'whatwg-fetch';

// Stable globals (see test-doubles.md "Stable references")
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

// Silence noisy console for known-OK warnings only — never blanket-silence
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('ReactDOMTestUtils.act')) return;
    originalError(...args);
  };
});
afterAll(() => { console.error = originalError; });
```

The setup file runs **after each test file's setup phase** (`setupFilesAfterEach` is the modern name; older configs say `setupFilesAfterEach` ≠ `setupFiles`, which runs before module loading).

---

## Module mocking

```ts
// 1. Type imports first
import type { UserService } from './user.service';

// 2. jest.mock — hoisted to top regardless of position
jest.mock('./user.service', () => ({
  userService: {
    getById: jest.fn(),
  },
}));

// 3. Runtime imports
import { userService } from './user.service';

// 4. Type-safe mock access
const mockGetById = jest.mocked(userService.getById);

it('returns user', async () => {
  mockGetById.mockResolvedValue({ id: '1', name: 'María' });
  const user = await userService.getById('1');
  expect(user.name).toBe('María');
});
```

`jest.mocked()` is the type-safe way to access the mock. Never cast with `as jest.Mocked<>` — the helper exists for this.

### Partial mock with original

```ts
jest.mock('@helpers', () => {
  const actual = jest.requireActual<typeof import('@helpers')>('@helpers');
  return {
    ...actual,
    specificFunction: jest.fn(),
  };
});
```

### Stable reference (avoids OOM — see anti-patterns)

```ts
const authState = { user: mockUser, isLoading: false };
jest.mock('@core/state', () => ({
  useAppSelector: () => authState,
}));
```

---

## Fake timers

```ts
beforeEach(() => {
  jest.useFakeTimers({ now: new Date('2026-01-01T00:00:00Z') });
});

afterEach(() => {
  jest.useRealTimers();
});

it('debounces input', () => {
  // ... type into input
  act(() => { jest.advanceTimersByTime(300); });
  expect(handler).toHaveBeenCalledTimes(1);
});
```

Always pair `useFakeTimers` with `useRealTimers` teardown. Leaking fake timers across files breaks unrelated suites.

For tests that mix real promises with fake timers, use `jest.advanceTimersByTimeAsync(ms)` or wrap advancement in `await act(async () => { ... })`.

---

## userEvent + fake timers

```ts
const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
await user.type(input, 'hola');
act(() => { jest.advanceTimersByTime(500); });
```

Without `advanceTimers`, `userEvent` will hang waiting for real time to pass while timers are faked.

---

## Async expect helpers

```ts
await expect(service.fetchUser('1')).resolves.toEqual(mockUser);
await expect(service.fetchUser('bad')).rejects.toThrow('Error de red');
```

Always `await` these. Without `await`, the test passes regardless of the promise outcome.

---

## Coverage

```ts
coverageThreshold: {
  global: { branches: 80, functions: 80, lines: 80, statements: 80 },
  './src/domain/': { branches: 95, functions: 100, lines: 95, statements: 95 },
  './src/components/': { branches: 70, functions: 80, lines: 75, statements: 75 },
},
coverageReporters: ['text', 'lcov', 'json-summary'],
coverageProvider: 'v8', // faster than 'babel' on Node 18+
```

`json-summary` is the format diff-coverage tools (e.g., `coverage-diff`) consume in CI.

See Layer 1 `coverage.md` for thresholds-by-layer guidance.

---

## Watch mode and filtering

```bash
yarn jest --watch                      # interactive
yarn jest path/to/file.test.ts         # single file
yarn jest -t "submits form"            # by test name
yarn jest --changed                    # only files changed vs HEAD
yarn jest --logHeapUsage               # diagnose OOM
yarn jest --runInBand                  # serial — debug worker issues
yarn jest --detectOpenHandles          # find leaked timers/sockets
```

---

## Common config mistakes

| Mistake | Symptom | Fix |
|---|---|---|
| `setupFiles` instead of `setupFilesAfterEach` | `expect.extend` not picked up | Use `setupFilesAfterEach` for `@testing-library/jest-dom` |
| Missing `transform` for TS | `SyntaxError: Cannot use import` | Add `babel-jest` or `ts-jest` to `transform` |
| `transformIgnorePatterns: ['node_modules']` blocks ESM deps | Test fails to import an ESM-only package | Allow specific packages: `'node_modules/(?!(esm-pkg-name)/)'` |
| Missing `moduleNameMapper` for assets | `Cannot find module './x.svg'` | Add `'\\.(svg|png)$': '<rootDir>/__mocks__/fileMock.ts'` |
| Tests mutate global state | Order-dependent failures | `clearMocks: true` + reset jsdom-mutated globals in `afterEach` |

---

## Debugging a hanging test

1. Add `--detectOpenHandles` — finds leaked timers, sockets, intervals.
2. Add `--logHeapUsage` — confirms OOM (heap grows monotonically per test → likely inline-mock-factory issue, see `anti-patterns.md`).
3. Run with `--runInBand` — eliminates worker variability.
4. Add `jest.setTimeout(2000)` — fail fast instead of hanging until CI killer.
5. Bisect with `it.only` to find the offending test.

---

## Vitest equivalents

| Jest | Vitest |
|---|---|
| `jest.mock` | `vi.mock` |
| `jest.fn` | `vi.fn` |
| `jest.mocked` | `vi.mocked` |
| `jest.useFakeTimers` | `vi.useFakeTimers` |
| `jest.advanceTimersByTime` | `vi.advanceTimersByTime` |
| `jest.requireActual` | `(await vi.importActual(...))` |
| `jest.spyOn` | `vi.spyOn` |
| `jest.config.ts` | `vitest.config.ts` |
| `jest.setup.ts` | `vitest.setup.ts` (in `setupFiles`) |

For full Vitest reference see `runners/vitest.md`.

---

## Related

- `philosophy.md` — what to test
- `react-testing-library.md` — how to render and query
- `test-doubles.md` — when and where to mock
- `anti-patterns.md` — Jest-specific OOM and async traps
- `runners/snapshot-testing.md` — `toMatchSnapshot` mechanics
- `stacks/nx-monorepo.md` — `jest.preset`, project references
- `stacks/react-native.md` — `jest-react-native` preset, `transformIgnorePatterns` for RN
