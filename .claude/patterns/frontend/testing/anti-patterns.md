# Testing Anti-Patterns — Layer 1 (Agnostic)

> **Layer**: 1 (agnostic — applies to Jest + Vitest, web + RN)
> **ESLint**: Many of these have lint rules. Where listed, the rule name comes from the canonical custom-rules pack (`@sovereignty/eslint-plugin-essential-testing` or per-project equivalent).
> **Updated**: 2026-04-22
> **Origin**: Distilled from your-company audit (2026-04) + DearAdry pattern (2026-04-06)

---

## Quick reference

| Anti-pattern | Lint rule | Severity | Category |
|---|---|---|---|
| `.only()` / `.skip()` shipped to CI | `jest/no-focused-tests`, `vitest/no-focused-tests` | error | CI safety |
| Empty test body | `jest/expect-expect` | warn | Quality |
| Verbose names ("edge case: null/undefined when X") | `essential-testing/no-verbose-names` | warn | Quality |
| Redundant `describe` wrapping | `essential-testing/no-redundant-describe` | warn | Structure |
| Nesting > 3 levels | `essential-testing/max-nesting` | warn | Structure |
| > 30 tests in one file | `essential-testing/max-tests-per-file` | warn | Size |
| > 5 snapshot assertions in one file | `essential-testing/max-snapshots` | warn | Quality |
| English data in Spanish-locale product | `essential-testing/locale-mismatch` | warn | Locale |
| English `new Error('...')` in mocks | `essential-testing/no-english-in-mock-errors` | warn | Locale |
| Inline object/array in module-mock factory | `essential-testing/no-inline-mock-factory` | error | OOM risk |
| Persistent `mockResolvedValue` inside `it()` body | `essential-testing/prefer-once-in-test` | warn | Isolation |
| Direct `expect(screen.getBy*).toBeInTheDocument()` (project has helper) | `essential-testing/prefer-centralized-assertions` | warn | Helpers |
| Direct import of `@testing-library/user-event` (project has helper) | `essential-testing/prefer-user-helper` | warn | Helpers |
| `as Mock` / `as jest.Mocked<>` casts | `essential-testing/prefer-mocked-helper` | warn | Type safety |
| `clearAllMocks()` in `beforeEach` (config already does it) | `essential-testing/no-redundant-clear-mocks` | warn | Redundant |
| Re-mocking globally-mocked module per file | `essential-testing/no-redundant-global-mocks` | error | Redundant |
| `await import()` in `beforeEach` | `essential-testing/no-await-import-in-beforeeach` | error | Pattern |
| `expect()` in unawaited `.then()` | `jest/valid-expect-in-promise` | error | Async |
| `waitFor(() => getByText())` instead of `findBy` | `testing-library/prefer-find-by` | warn | Async |
| Unnecessary `act()` wrap | `testing-library/no-unnecessary-act` | warn | Clarity |
| `queryBy` for presence assertion | `testing-library/prefer-presence-queries` | warn | Semantics |
| Conditional `expect()` (in `if`) | `jest/no-conditional-expect` | warn | Determinism |

---

## OOM risk: inline reference in module-mock factory

**Why it crashes**: React uses `===` to detect changes. A mocked hook returning a new object/array literal on every call triggers `state changed → re-render → hook called → new reference → loop`. The worker runs out of heap.

**Symptoms**: worker OOM, suite reports 0 tests run, the test "hangs", memory spike in `--logHeapUsage`.

### Fix 1 — module-scoped const

Module-mock factories run lazily (after module-level code). A `const` declared at module scope is always available inside the factory.

```ts
// ❌ New reference every call → loop → OOM
mockModule('@core/state', () => ({
  useAppSelector: () => ({ user: mockUser, isLoading: false }),
}));

// ✅ Stable reference
const authState = { user: mockUser, isLoading: false };
mockModule('@core/state', () => ({ useAppSelector: () => authState }));
```

### Fix 1b — project helper for common providers

For shared providers (`useTranslation`, `useToast`, etc.), the project should ship factory helpers:

```ts
import { stableI18n, stableToastHelpers } from '@test-helpers';

const i18n = stableI18n();
const toast = stableToastHelpers();

mockModule('react-i18next', () => ({ useTranslation: () => i18n }));
mockModule('@ui/providers', () => ({ useToastHelpers: () => toast }));
```

Each helper returns the **same** object across calls and exposes pre-built spy functions (`toast.showSuccess`).

### Fix 2 — mutable ref for toggling between tests

```ts
// ❌ let + new object per call
let isAuth = false;
mockModule('@hooks', () => ({ useAuth: () => ({ isAuthenticated: isAuth }) }));

// ✅ Mutable ref — same object, mutated property
const authRef = { isAuthenticated: false };
mockModule('@hooks', () => ({ useAuth: () => authRef }));

// In tests: authRef.isAuthenticated = true;
```

(Pseudocode `mockModule` stands for `jest.mock` or `vi.mock` depending on runner — see Layer 2.)

---

## Async safety: assertions inside unhandled promises

```ts
// ❌ Assertion runs after the test ends → silently passes
it('processes data', () => {
  fetchData().then((result) => {
    expect(result).toBe('success');
  });
});

// ✅ Await or return
it('processes data', async () => {
  const result = await fetchData();
  expect(result).toBe('success');
});
```

If you must keep the `.then()` (you shouldn't), `return` it:

```ts
it('processes data', () => {
  return fetchData().then((result) => {
    expect(result).toBe('success');
  });
});
```

---

## Test isolation: persistent mocks inside `it()`

With `clearMocks: true`, mocks reset **after** each test. Using a persistent variant inside an `it()` body signals confused intent.

```ts
// ❌ Does this apply to one call or all? Reader has to guess
it('retries on failure', async () => {
  mockApi.fetch.mockRejectedValue(new Error('Error temporal'));
  // Applies to ALL subsequent calls in this test
});

// ✅ Explicit: fails exactly once, then succeeds
it('retries on failure', async () => {
  mockApi.fetch
    .mockRejectedValueOnce(new Error('Error temporal'))
    .mockResolvedValueOnce({ data: 'ok' });
});
```

---

## Conditional expects

```ts
// ❌ Test passes whether the button exists or not — proves nothing
const resend = screen.queryByText('Reenviar');
if (resend) {
  expect(resend).toBeVisible();
}
```

If the button's existence depends on state, set up the state explicitly:

```ts
// ✅ Force the state, then assert unconditionally
act(() => timers.advance(31_000)); // expire countdown
expect(await screen.findByText('Reenviar')).toBeInTheDocument();
```

If two paths legitimately exist (e.g., A/B test), write **two tests**, each forcing one path.

---

## queryBy for presence

```ts
// ❌ queryBy returns null silently — wrong tool for presence
expect(screen.queryByText('Guardar')).toBeInTheDocument();

// ✅ getBy throws with a helpful "unable to find element" message
expect(screen.getByText('Guardar')).toBeInTheDocument();

// ✅ queryBy for absence — correct
expect(screen.queryByText('Error')).not.toBeInTheDocument();
```

Memorize: `getBy` for present, `queryBy` for absent, `findBy` for eventually-present.

---

## Locale mismatch

Spanish-locale products use Spanish data. English data hides bugs in i18n loading, encoding, pluralization.

```ts
// ❌
mockRepo.findById.mockRejectedValue(new Error('Database error'));
const mockUser = { firstName: 'John', lastName: 'Doe', email: 'john@test.com' };

// ✅
mockRepo.findById.mockRejectedValue(new Error('Error de base de datos'));
const mockUser = { firstName: 'María', lastName: 'García', email: 'maria.garcia@example.com' };
```

---

## Verbose / implementation-focused names

```ts
// ❌ Describes the code, not the behavior
it('should call setState with isOpen=true when click handler is invoked', () => {});

// ❌ Edge-case laundry list
it('handles null user with undefined permissions and missing token edge case', () => {});

// ✅ Describes outcome the user observes
it('opens the dialog when the menu button is clicked', () => {});
it('redirects to login when the session expires', () => {});
```

---

## Web vs Mobile assertion differences

| Concept | Web (`@testing-library/react`) | Mobile (`@testing-library/react-native`) |
|---|---|---|
| Element is present | `.toBeInTheDocument()` | `.toBeOnTheScreen()` |
| Default interaction API | `userEvent.setup()` | `fireEvent` |
| Role queries | `getByRole('button', { name })` | `getByRole('button', { name })` (same) |

The rest of these anti-patterns apply identically to both targets.

---

## Related

- `philosophy.md` — first principles these violations break
- `react-testing-library.md` — correct usage of get/query/find
- `test-doubles.md` — mock boundaries and stable references
- `coverage.md` — why high coverage with these anti-patterns is worthless
- Runner-specific syntax for fake timers, module mocks: `runners/jest.md`, `runners/vitest.md`
