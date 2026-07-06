# Testing Philosophy — Layer 1 (Agnostic)

> **Layer**: 1 (agnostic)
> **Applies to**: Every React-based test, any runner, any stack
> **Updated**: 2026-04-22

---

## Core principles

1. **Value over coverage.** A test exists to prove a behavior the user (or another module) depends on. Coverage % is a side effect, never a goal.
2. **Behavior over implementation.** Tests should keep passing through refactors that don't change observable behavior.
3. **Arrange–Act–Assert.** One AAA per test. If you need two, write two tests.
4. **Determinism over realism.** A flaky test is worse than no test. Pin time, control randomness, isolate side effects.
5. **Locale matches the product.** Spanish-speaking products use Spanish test data (`María García`, `'Error de red'`), not `John Doe` and `'Network error'`.

---

## What to test

| Test | Don't test |
|---|---|
| Business logic, validation, branching | Type definitions (TS handles them) |
| User-visible behavior (clicks, forms, navigation) | UI-only constants (route strings, button labels) |
| Error handling and recovery paths | Third-party library internals |
| State transitions (reducers, slices, machines) | Trivial getters, pass-through wrappers |
| Integration seams (component ↔ hook ↔ service) | Styled-components / emotion output |
| Accessibility (roles, labels, keyboard) | Implementation details (props, internal state names) |

The hard rule: if removing the test wouldn't surface a real regression to a user or developer, the test isn't earning its keep.

---

## Behavior vs implementation

```ts
// ❌ Implementation-coupled: breaks the moment we rename state
expect(wrapper.state('isOpen')).toBe(true);

// ✅ Behavior: passes regardless of how we store it
expect(screen.getByRole('dialog')).toBeVisible();
```

The user doesn't know `isOpen` exists. The test shouldn't either.

---

## AAA structure

```ts
it('shows error when password is too short', async () => {
  // Arrange
  const { user } = setup();

  // Act
  await user.type(screen.getByLabelText('Contraseña'), 'abc');
  await user.click(screen.getByRole('button', { name: 'Entrar' }));

  // Assert
  expect(screen.getByText('Contraseña muy corta')).toBeInTheDocument();
});
```

Each `it()` proves exactly one fact. If the assertion section grows past 3-4 expects, you're testing more than one thing — split.

---

## Test naming

A test name is a sentence the test makes true:

- ✅ `'submits form with valid credentials'` — describes outcome
- ✅ `'shows error when email is invalid'` — describes condition + outcome
- ❌ `'test 1'`, `'works'`, `'should call onSubmit'` — describes the code, not the behavior
- ❌ `'edge case: null user with undefined permissions and missing token'` — implementation laundry list

Rule of thumb: a non-developer reading only test names should understand what the feature does.

---

## File size guidance

| Type | Soft limit | Why |
|---|---|---|
| Unit test file | 350 lines | Larger files signal a component doing too much |
| Integration test file | 500 lines | Setup costs justify slightly more |
| Mock data file | No limit | Accuracy beats brevity |

Going over isn't a sin — the limit is a signal to ask "is this one thing or three?".

---

## Determinism

| Source of flake | Mitigation |
|---|---|
| `Date.now()`, `new Date()` | Fake timers (runner-specific — see Layer 2) |
| `Math.random()`, `crypto.randomUUID()` | Inject as dependency or stub at module boundary |
| Network | Mock at the service/repository layer, never the `fetch` global directly |
| Animations / transitions | Disable in test setup, or assert on final state with `findBy*` |
| Test order dependence | `clearMocks: true` runner config; never share mutable state between tests |

If a test passes locally and fails in CI (or vice versa), determinism is the first place to look.

---

## Locale

Test data lives in the product's language. For Spanish-language products:

- Names: `María García`, `José López` — never `John Doe`
- Errors: `new Error('Error de red')` — never `new Error('Network error')`
- UI assertions: `getByText('Cargando…')` — never `getByText('Loading…')`

This isn't aesthetic. Locale-mismatched data hides bugs in i18n loading order, character encoding, and pluralization.

---

## When NOT to write a test

- The "test" only re-asserts what the type system already enforces.
- The behavior is one line of pass-through delegation (`export const x = lib.x`).
- The test is more complex than the code under test (smell — refactor the code, not the test).
- You're testing the framework (`'React renders children'`, `'useState updates state'`).

---

## Related

- `react-testing-library.md` — how to express these principles with RTL queries
- `test-doubles.md` — when to mock, when not
- `anti-patterns.md` — concrete violations of these principles
- `coverage.md` — measuring without lying
