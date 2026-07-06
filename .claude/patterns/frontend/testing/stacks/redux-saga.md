# Testing Redux-Saga — Layer 3 (Stack)

> **Layer**: 3 (stack-specific)
> **Stack**: redux-saga 1.x — pairs with classic Redux **and** Redux Toolkit (complement, not replacement)
> **Updated**: 2026-04-22

For runner config see `runners/jest.md` / `runners/vitest.md`. For RTK testing see `stacks/redux-toolkit.md` — both can coexist in the same store.

---

## When sagas, when RTK thunks

Both are valid. They solve overlapping problems differently.

| Concern | createAsyncThunk (RTK) | redux-saga |
|---|---|---|
| Simple async (one request, three states) | ✅ Cleaner | OK but verbose |
| Cancellation, debouncing, throttling | Manual (AbortController) | First-class (`takeLatest`, `debounce`, `throttle`) |
| Long-running flows (websockets, polling) | Awkward | Designed for it |
| Cross-action orchestration ("after A, then B if C, else D") | Reducer-spaghetti | Saga-native (`take`, `race`, `all`) |
| Testability of complex flows | Test the result state | Test the effect stream (more granular) |
| Learning curve | Lower | Higher (generators + effect creators) |

**Hybrid is fine**: RTK slices for state shape and simple thunks; sagas for orchestration, cancellation, and long-running side effects. The store doesn't care.

---

## What to test

| Layer | Test target | How |
|---|---|---|
| **Watcher (root saga)** | `takeEvery` / `takeLatest` registers correct pattern → handler | Step the generator, assert `take*` effect |
| **Worker saga** | Effects in correct order, success and failure branches | `expectSaga` from `redux-saga-test-plan` (preferred) or step manually |
| **Helpers** | Pure functions called by sagas | Test as plain functions |

Don't test the saga middleware itself, generator semantics, or `redux-saga`'s `runSaga`. Trust the library.

---

## Tooling: `redux-saga-test-plan`

Two testing styles ship with `redux-saga-test-plan`:

- **Integration testing** (`expectSaga`) — runs the saga, you assert dispatched actions and put effects. **Preferred.**
- **Unit testing** (`testSaga`) — steps through effects one by one. Use when you need granular ordering checks.

```bash
yarn add -D redux-saga-test-plan
```

---

## Watcher tests

Verify the root saga registers the right action → handler mapping:

```ts
import { takeEvery } from 'redux-saga/effects';
import { rootCartSaga, readCartHandler, addToCartHandler } from './cart.sagas';
import { CART_TYPES } from '../actions/types';

describe('rootCartSaga', () => {
  it('watches cart action types', () => {
    const gen = rootCartSaga();
    expect(gen.next().value).toEqual(takeEvery(CART_TYPES.READ_CART, readCartHandler));
    expect(gen.next().value).toEqual(takeEvery(CART_TYPES.ADD_TO_CART, addToCartHandler));
    expect(gen.next().done).toBeTruthy();
  });
});
```

This test is the only place where stepping a generator manually pays off. Worker saga tests use `expectSaga` instead.

---

## Worker tests with `expectSaga` (preferred)

```ts
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { readCartHandler } from './cart.sagas';
import { cartActions } from './cart.actions';
import * as cartApi from '@/services/cart';

const action = { type: 'cart/read', payload: { cartId: 1 } };
const mockCart = { id: 1, items: [{ productId: 'p1', qty: 2 }] };

describe('readCartHandler', () => {
  it('dispatches success on successful API call', () => {
    return expectSaga(readCartHandler, action)
      .provide([[call(cartApi.readCart, 1), mockCart]])
      .put(cartActions.readCartSuccess(mockCart))
      .run();
  });

  it('dispatches failure when API throws', () => {
    return expectSaga(readCartHandler, action)
      .provide([[call(cartApi.readCart, 1), throwError(new Error('Error de red'))]])
      .put(cartActions.readCartFailure({ error: 'Error de red' }))
      .run();
  });
});
```

`expectSaga` runs the saga end-to-end. `.provide([...])` substitutes return values for `call` effects (the `redux-saga` equivalent of mocking). `.put(...)` asserts a dispatched action. `.run()` returns a promise that resolves when the saga completes.

`return` the promise from `it()` so Jest/Vitest waits for completion.

---

## Asserting multiple effects

```ts
it('refreshes cart and notifies on success', () => {
  return expectSaga(addToCartHandler, action)
    .provide([
      [call(cartApi.addToCart, action.payload), { ok: true }],
      [call(cartApi.readCart, action.payload.cartId), mockCart],
    ])
    .put(cartActions.addToCartSuccess())
    .put(cartActions.readCartSuccess(mockCart))
    .put({ type: 'ui/showToast', payload: { kind: 'success' } })
    .run();
});
```

`.put` calls chain — `expectSaga` checks all of them happened, in any order. For order-sensitive assertions use `.put.actionType(...)` with `.next()` matchers, or fall back to `testSaga`.

---

## Cancellation, takeLatest, race

```ts
import { race, take } from 'redux-saga/effects';

function* searchSaga(action: SearchAction) {
  const { cancelled, result } = yield race({
    cancelled: take('search/cancel'),
    result: call(searchApi, action.payload.query),
  });
  if (cancelled) {
    yield put(searchActions.cancelled());
    return;
  }
  yield put(searchActions.success(result));
}

it('cancels in-flight request when cancel action dispatched', () => {
  return expectSaga(searchSaga, { type: 'search', payload: { query: 'hola' } })
    .provide([
      [race({ cancelled: take('search/cancel'), result: call(searchApi, 'hola') }),
        { cancelled: { type: 'search/cancel' } }],
    ])
    .put(searchActions.cancelled())
    .not.put.actionType('search/success')
    .run();
});
```

`.not.put.actionType(...)` asserts an action was **not** dispatched — useful for cancellation paths.

For `takeLatest` behavior (newer dispatch cancels in-flight), test the worker in isolation; `takeLatest` itself is library code.

---

## Sagas in an RTK store (hybrid)

```ts
// store.ts
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from './rootReducer';     // RTK slices combined
import { rootSaga } from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) => getDefault({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);
```

Tests of slices remain unchanged (see `stacks/redux-toolkit.md`). Tests of sagas use `expectSaga`. Tests of components dispatching actions assert on either the resulting state (RTK pattern) or the dispatched action (saga pattern), depending on which side handles the work.

When RTK and sagas both react to the same action, document which one owns the result and write the test against that source.

---

## Testing components that trigger sagas

The component dispatches an action. The saga handles it. The test asserts on the resulting state (most cases) or on the dispatch (when the saga's effect is observable elsewhere — toast, navigation, etc.).

```ts
const { store } = renderWithProviders(<CartButton />);

await user.click(screen.getByRole('button', { name: /agregar/i }));

// Assert on state — what the user sees
await waitFor(() => {
  expect(store.getState().cart.items).toHaveLength(1);
});

// Or, if the side effect is the goal:
await waitFor(() => {
  expect(mockNavigate).toHaveBeenCalledWith('/checkout');
});
```

Avoid spying on `store.dispatch` to assert raw action types — that couples the test to internal saga-trigger mechanics.

---

## Reducer + saga interplay

The reducer is still pure (`stacks/redux-toolkit.md` "Slice reducers" section applies). The saga is still a generator function. Test them separately:

- Reducer test: `reducer(state, action)` → expected state.
- Saga test: `expectSaga(handler, action).provide(...).put(...)` → expected dispatches.
- Integration test (rare): real store + `sagaMiddleware.run(rootSaga)` + dispatch + assert state.

---

## Common failures

| Symptom | Cause | Fix |
|---|---|---|
| `expectSaga` test never finishes | Saga has infinite loop (`while (true) yield take`) | Use `silentRun()` and a timeout, or refactor to dispatch a stop action |
| `.put(...)` matches nothing | Action shape includes a non-matching field (e.g., timestamp) | Use `.put.actionType(...)` to match by type only |
| Provider for `call(api, args)` not matching | Args differ | Use `dynamic` provider or `partialMatch` to ignore non-essential args |
| Saga appears to skip steps | Generator function re-created per render (in component code) | Hoist saga to module scope; never define inside a component |
| Test passes but production saga hangs | Mock returned data the real API doesn't | Provider should mirror real API contract, including error shape |

---

## When NOT to use sagas

- The async is one request → loading → success/failure. RTK `createAsyncThunk` is shorter and easier to test.
- Pure data transformations after fetch — do them in the slice, not the saga.
- UI-only state (modals, hover, accordion). Local component state, not Redux.

A codebase where every async goes through a saga ends up with hard-to-follow control flow. Use sagas where their strengths (cancellation, orchestration, long-running) actually matter.

---

## Related

- `runners/jest.md` / `runners/vitest.md` — runner config (sagas test the same in both)
- `stacks/redux-toolkit.md` — RTK slices, selectors, and thunks coexist with sagas
- `philosophy.md` — "behavior over implementation" still applies; assert state, not action types when possible
- `anti-patterns.md` — async traps and OOM rules apply to saga tests too
