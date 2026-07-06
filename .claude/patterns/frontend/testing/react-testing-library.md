# React Testing Library — Layer 1 (Agnostic)

> **Layer**: 1 (agnostic — applies to web RTL and `@testing-library/react-native`)
> **Updated**: 2026-04-22

---

## Mental model

RTL tests render the component, query the DOM (or RN tree) **as a user would perceive it**, simulate interactions, and assert on visible outcomes. There is no shallow rendering, no snapshot-by-default, no access to internal state.

If your test needs to reach into the component's guts, the design is wrong — refactor either the component or the test.

---

## Query priority

Use queries in this order. Each step down increases coupling to implementation.

1. **`getByRole`** — accessible role. Mirrors how assistive tech finds elements.
2. **`getByLabelText`** — form fields with associated `<label>`.
3. **`getByPlaceholderText`** — only when no label exists.
4. **`getByText`** — non-interactive content.
5. **`getByDisplayValue`** — current value of input/select/textarea.
6. **`getByAltText`** — images.
7. **`getByTitle`** — `title` attribute.
8. **`getByTestId`** — last resort. A `data-testid` is a confession that nothing more semantic exists.

```ts
// ✅ Semantic
screen.getByRole('button', { name: 'Entrar' });
screen.getByLabelText('Correo electrónico');

// ❌ Brittle and a11y-blind
screen.getByTestId('login-button');
container.querySelector('.btn-primary');
```

---

## get / query / find

| Variant | Returns | Throws | Async | Use for |
|---|---|---|---|---|
| `getBy*` | Element | If 0 or >1 matches | No | Asserting **presence** of something already rendered |
| `queryBy*` | Element or `null` | Only if >1 matches | No | Asserting **absence** |
| `findBy*` | Promise<Element> | After timeout | Yes | Asserting **eventual presence** (after async render) |
| `getAllBy*` / `queryAllBy*` / `findAllBy*` | Array | Same rules | Same rules | Multiple matches expected |

```ts
// ✅ Presence
expect(screen.getByText('Bienvenido')).toBeInTheDocument();

// ✅ Absence
expect(screen.queryByText('Error')).not.toBeInTheDocument();

// ✅ Eventual presence (after fetch resolves)
expect(await screen.findByText('María García')).toBeInTheDocument();

// ❌ Wrong tool — using queryBy for presence loses the helpful error message
expect(screen.queryByText('Bienvenido')).toBeInTheDocument();
```

---

## userEvent vs fireEvent

**`userEvent` is the default** for the web. It simulates real interactions (focus → keydown → input → keyup → change), which surfaces bugs `fireEvent` misses.

```ts
// ✅ userEvent — realistic
const user = userEvent.setup();
await user.type(input, 'maría');
await user.click(button);

// ⚠️ fireEvent — only when you truly need a single low-level event
fireEvent.scroll(window, { target: { scrollY: 500 } });
```

**React Native is the exception**: `@testing-library/react-native` ships `fireEvent` as the primary API. `userEvent` exists for RN but is less mature; default to `fireEvent` there.

Always call `userEvent.setup()` once per test (or in a `setup()` helper) — don't reuse a global instance, it leaks state between tests.

---

## Async patterns

```ts
// ✅ findBy* — preferred for "appears after async work"
expect(await screen.findByText('Cargando…')).toBeInTheDocument();

// ✅ waitForElementToBeRemoved — for things that disappear
await waitForElementToBeRemoved(() => screen.queryByText('Cargando…'));

// ✅ waitFor — last resort, for non-DOM assertions
await waitFor(() => expect(mockApi).toHaveBeenCalledTimes(1));

// ❌ waitFor wrapping a getBy — use findBy instead
await waitFor(() => expect(screen.getByText('María')).toBeInTheDocument());
```

`waitFor` retries until the callback succeeds or times out. Don't put assertions with side effects inside; the callback may run many times.

---

## act()

Wrap state updates that aren't already awaited:

```ts
// ✅ Already awaited — no act() needed
await user.click(button);

// ✅ Manual state update — act() needed
act(() => {
  result.current.setValue('nuevo');
});

// ✅ Timer-driven update — act() needed
act(() => {
  jest.advanceTimersByTime(1000); // or vi.advanceTimersByTime
});
```

If RTL prints `Warning: An update to ... was not wrapped in act(...)`, you have an un-awaited state change. Find it; don't suppress the warning.

---

## renderHook

For testing hooks in isolation:

```ts
const { result, rerender } = renderHook(({ id }) => useUser(id), {
  initialProps: { id: '1' },
  wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
});

expect(result.current.user).toEqual(mockUser);

rerender({ id: '2' });
expect(result.current.user).toEqual(otherMockUser);
```

State updates inside the hook need `act()`:

```ts
act(() => {
  result.current.refetch();
});
```

---

## Custom render with providers

Every project wraps `render` with its own providers (Redux, theme, i18n, router). Define **once**, use everywhere:

```ts
// test/render.tsx
export function renderWithProviders(
  ui: ReactElement,
  { preloadedState, ...options }: RenderOptions = {}
) {
  const store = configureTestStore({ preloadedState });
  const wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>
      <ThemeProvider theme={testTheme}>{children}</ThemeProvider>
    </Provider>
  );
  return { store, ...render(ui, { wrapper, ...options }) };
}
```

Tests should never re-import `Provider` directly — they import `renderWithProviders` and call it. This keeps provider changes (new context, new store slice) a one-line edit.

---

## Accessibility-first

A test that uses `getByRole` is implicitly an accessibility test:

```ts
// Catches: missing `aria-label`, missing `<label htmlFor>`, button-as-div anti-pattern
screen.getByRole('button', { name: 'Guardar' });
screen.getByRole('textbox', { name: 'Correo' });
```

If a query forces you to fall back to `getByTestId` because no accessible name exists, the component has an a11y bug. Fix the component, not the test.

---

## Cleanup

`@testing-library/react` auto-cleans between tests when running with Jest or Vitest defaults. Don't call `cleanup()` manually unless you're disabling auto-cleanup (you shouldn't be).

Mocks need explicit cleanup — see runner config (`clearMocks: true`).

---

## Migrating from enzyme (deprecated)

Enzyme is end-of-life: no official React 18 adapter and its philosophy (shallow rendering, props/state introspection) is incompatible with "test behavior, not implementation." Any project still using it should migrate on touch — existing `enzyme` test files must be rewritten in the same PR that touches them, and new `import 'enzyme'` is forbidden.

| Legacy (enzyme) | Replacement (RTL) |
|---|---|
| `mount(<C />)` | `render(<C />)` |
| `wrapper.find('selector')` | `screen.getByRole / getByText / getByTestId` (in priority order) |
| `wrapper.simulate('click')` | `await userEvent.click(el)` |
| `wrapper.props()` / `.state()` | Assert rendered output — never the internals |
| `shallow()` | No equivalent — render the full tree and assert from the DOM |
| `wrapper.update()` | Unnecessary — RTL re-queries the live DOM on each call |

If a migrated test suddenly passes that used to fail (or vice versa), that's signal: the enzyme test was asserting an implementation detail the real user can't observe.

---

## Related

- `philosophy.md` — why "behavior over implementation" matters
- `test-doubles.md` — what to mock around the rendered tree
- `anti-patterns.md` — RTL-specific anti-patterns (querying DOM directly, etc.)
- `runners/jest.md` / `runners/vitest.md` — `act()`, fake timers, mock setup syntax
