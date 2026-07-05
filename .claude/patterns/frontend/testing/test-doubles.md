# Test Doubles — Layer 1 (Agnostic)

> **Layer**: 1 (agnostic — concept-only, no `jest.mock` / `vi.mock` syntax)
> **Updated**: 2026-04-22

---

## Vocabulary

Five kinds of test doubles, each with a specific purpose. Most projects say "mock" for all of them; the precision matters when debugging.

| Double | Purpose | Verifies? |
|---|---|---|
| **Dummy** | Fills a parameter that won't be used | No |
| **Stub** | Returns canned data so the code can proceed | No |
| **Spy** | Records calls to an existing function | Yes (after the fact) |
| **Mock** | Pre-programmed with expectations on calls | Yes (built into the double) |
| **Fake** | A working implementation simpler than production (in-memory DB) | No |

In day-to-day React testing you mostly use **stubs** (return canned data) and **spies** (assert callback was called). True mocks (with verified expectations baked in) are rare; modern style prefers `expect(spy).toHaveBeenCalledWith(...)` after the fact.

---

## Where to mock — the boundary rule

**Mock at the seam, not in the middle.**

A seam is a place where code crosses an architectural boundary: HTTP, filesystem, database, time, randomness, browser APIs.

```
[Component]
   │
[Hook]
   │
[Service] ← ✅ Mock HERE — the boundary to the network
   │
[fetch / axios] ← ❌ Don't mock the global — it bypasses your service contract
   │
[Network]
```

Mocking `fetch` directly couples every test to HTTP details (URLs, headers, status codes). Mocking the service exposes the contract your code actually uses (`getUser(id) → User`).

---

## When NOT to mock

- **Pure functions** — call the real thing.
- **Your own components** — render them. If they're too complex to render, that's a design smell, not a mocking problem.
- **The framework** — never mock React, Redux, Router internals.
- **Trivial wrappers** — if the only thing you'd mock is a one-line pass-through, don't.

The "London school" instinct to mock every dependency produces brittle tests that pass when the system is broken. Default to integration: render real things, mock only the boundary.

---

## Module mocking — the universal pattern

Every modern runner (Jest, Vitest) supports module mocking with hoisting. The shape:

```
1. Import types only
2. Declare the module mock (hoisted to top regardless of position in source)
3. Import the runtime symbols
4. In tests: configure the mock per scenario
```

Runner-specific syntax lives in `runners/jest.md` and `runners/vitest.md`. The principles below are universal.

---

## Stable references — the OOM trap

React uses `===` to detect changes. A mocked hook that returns a new object literal on every call triggers an infinite re-render loop, which crashes the worker with OOM.

```ts
// ❌ New object every call → re-render storm → OOM
mockUseAuth(() => ({ user: mockUser, isLoading: false }));

// ✅ Stable reference
const authState = { user: mockUser, isLoading: false };
mockUseAuth(() => authState);
```

The same applies to mocked context providers, selectors, and any hook returning a fresh array/object.

**Project-level helpers** (`stableI18n()`, `stableToast()` — see your-company overlay) encapsulate this for common cases.

---

## Stub data: realistic, minimal, named

```ts
// ✅ Realistic, locale-correct, only fields the test needs
const mockUser = {
  id: 'user-1',
  email: 'maria.garcia@example.com',
  name: 'María García',
};

// ❌ Kitchen sink — every field, none related to the test
const mockUser = {
  id: 'user-1',
  email: 'maria@x.com', name: 'María',
  createdAt: new Date(), updatedAt: new Date(),
  permissions: [...], settings: {...}, /* and 20 more */
};
```

Extra fields hide intent. A reader has to guess which fields the test actually depends on. Strip to the minimum that compiles, add fields only when a test needs them.

---

## Spies: assert calls, don't program responses

Modern style: program the stub for return values, use the same double as a spy for call assertions:

```ts
// Setup — stub returns
mockApi.getUser.mockResolvedValue(mockUser);

// Run code
await service.fetchUser('user-1');

// Assert calls — same double, used as spy
expect(mockApi.getUser).toHaveBeenCalledTimes(1);
expect(mockApi.getUser).toHaveBeenCalledWith('user-1');
```

Avoid `mockImplementation` with side-effecty bodies that record calls manually. The runner already records them.

---

## Per-test variants

Use `mockResolvedValueOnce` / `mockReturnValueOnce` to express "this call fails, the next succeeds" without polluting subsequent tests:

```ts
mockApi.getUser
  .mockRejectedValueOnce(new Error('Error de red'))
  .mockResolvedValueOnce(mockUser);

await expect(service.fetchUser('1')).rejects.toThrow('Error de red');
await expect(service.fetchUser('1')).resolves.toEqual(mockUser);
```

Persistent `mockResolvedValue` inside a single `it()` is a smell — it leaks intent and often the test really wanted `Once`.

---

## Cleanup

Configure the runner to reset mocks between tests (`clearMocks: true` in Jest and Vitest). Manual `clearAllMocks()` in `beforeEach` is redundant and forgettable.

`reset` vs `clear` vs `restore`:

- **clear** — clears `.mock.calls` and `.mock.results`. The implementation stays.
- **reset** — `clear` + removes the implementation (back to default `jest.fn()`).
- **restore** — `reset` + restores original (only for spies created from real functions).

Default to `clearMocks` in config. Use `mockReset` per-test only when you need to swap implementations mid-suite.

---

## Time, randomness, environment

| Source | Pattern |
|---|---|
| `Date.now()` / `new Date()` | Fake timers + `setSystemTime` |
| `setTimeout` / `setInterval` | Fake timers + `advanceTimersByTime` |
| `Math.random()` | Inject as dependency or stub the module |
| `crypto.randomUUID()` | Stub the global once in setup |
| `localStorage` / `sessionStorage` | jsdom provides them; reset in `beforeEach` if state leaks |
| `navigator.geolocation` | Stub on `globalThis` in setup file |

Fake timers MUST be paired with manual advancement and a teardown that restores real timers. See runner docs for syntax.

---

## Anti-patterns

See `anti-patterns.md` for the full catalog. Highlights:

- Inline object/array in mock factory (causes OOM)
- Persistent `mockResolvedValue` inside `it()` (leaks across tests)
- Mocking the same module both globally (`setupFiles`) and per-test (redundant; sometimes contradictory)
- `as Mock` / `as jest.Mocked<>` casts (use the runner's typed helper instead)

---

## Related

- `philosophy.md` — when a test even needs a double
- `react-testing-library.md` — how to render around the mocked boundary
- `runners/jest.md` / `runners/vitest.md` — `mockResolvedValue`, `mockImplementation`, fake timer syntax
- `anti-patterns.md` — concrete violations
