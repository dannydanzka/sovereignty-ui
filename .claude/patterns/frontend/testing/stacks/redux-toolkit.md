# Testing Redux Toolkit — Layer 3 (Stack)

> **Layer**: 3 (stack-specific)
> **Stack**: Redux Toolkit 1.9+ (createSlice, createAsyncThunk, optionally RTK Query)
> **Updated**: 2026-04-22
> **Note**: RTK and redux-saga are complementary, not alternatives. Many projects run both — RTK slices for state shape and simple thunks, sagas for orchestration and cancellation. For saga testing see `stacks/redux-saga.md`.

For runner config see `runners/jest.md` / `runners/vitest.md`.

---

## What to test in RTK

| Layer | Test target | How |
|---|---|---|
| **Slice reducers** | Pure state transitions | Call reducer directly with action |
| **Slice selectors** | Derive correct value from state shape | Call selector with mock state |
| **createAsyncThunk** | Pending/fulfilled/rejected dispatches + side effects | Run thunk against real store with mocked services |
| **RTK Query endpoints** | Cache behavior, transforms, invalidation | `setupListeners` + real store + mocked `fetchBaseQuery` |
| **Components using selectors** | Render with `<Provider>` + preloaded state | `renderWithProviders` |
| **Components dispatching thunks** | Effect propagates to store | `renderWithProviders` + assert on `store.getState()` |

Don't test the framework itself — `combineReducers`, `configureStore`, `createSlice`'s mechanics. Trust the library.

---

## Test store helper

```ts
// test/test-store.ts
import { configureStore } from '@reduxjs/toolkit';
import type { PreloadedState } from '@reduxjs/toolkit';
import { rootReducer, type RootState } from '@/store';

export function makeTestStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefault) => getDefault({
      // Test stores often disable serializability check for speed
      serializableCheck: false,
    }),
  });
}
```

`renderWithProviders` (see `stacks/nx-monorepo.md`) wraps this:

```ts
export function renderWithProviders(
  ui: ReactElement,
  { preloadedState, store = makeTestStore(preloadedState), ...options }: RenderOptions = {}
) {
  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>, options),
  };
}
```

---

## Slice reducers

Reducers are pure functions — call them directly, no store needed.

```ts
import authReducer, { loginSuccess, logout } from './auth-slice';

describe('authSlice', () => {
  it('starts unauthenticated', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toEqual({
      user: null,
      token: null,
      status: 'idle',
    });
  });

  it('stores user on loginSuccess', () => {
    const next = authReducer(undefined, loginSuccess({ user: mockUser, token: 'abc' }));
    expect(next.user).toEqual(mockUser);
    expect(next.token).toBe('abc');
  });

  it('clears user on logout', () => {
    const authed = { user: mockUser, token: 'abc', status: 'idle' as const };
    expect(authReducer(authed, logout())).toEqual({
      user: null, token: null, status: 'idle',
    });
  });
});
```

One test per action. Don't combine actions in a single test.

---

## Selectors

```ts
import { selectIsAuthenticated, selectUserName } from './auth-slice';

const stateAuthed = {
  auth: { user: { id: '1', name: 'María' }, token: 'abc', status: 'idle' as const },
};
const stateAnon = { auth: { user: null, token: null, status: 'idle' as const } };

it('selectIsAuthenticated reflects token presence', () => {
  expect(selectIsAuthenticated(stateAuthed)).toBe(true);
  expect(selectIsAuthenticated(stateAnon)).toBe(false);
});

it('selectUserName returns name or empty string', () => {
  expect(selectUserName(stateAuthed)).toBe('María');
  expect(selectUserName(stateAnon)).toBe('');
});
```

For `createSelector` memoized selectors, also test the memoization behavior if the selector is hot:

```ts
const result1 = selectExpensive(stateAuthed);
const result2 = selectExpensive(stateAuthed);
expect(result1).toBe(result2); // same reference — memo working
```

---

## createAsyncThunk

Thunks have three phases: `pending`, `fulfilled`, `rejected`. Test what the **store** ends up with, not the dispatched actions individually.

```ts
import { fetchUser } from './auth-slice';
import * as api from '@/services/auth';

jest.mock('@/services/auth');
const mockGetUser = jest.mocked(api.getUser);

it('fulfilled: stores user and clears loading', async () => {
  mockGetUser.mockResolvedValue(mockUser);
  const store = makeTestStore();

  await store.dispatch(fetchUser('user-1'));

  const state = store.getState().auth;
  expect(state.user).toEqual(mockUser);
  expect(state.status).toBe('idle');
});

it('rejected: sets error, leaves user null', async () => {
  mockGetUser.mockRejectedValue(new Error('Error de red'));
  const store = makeTestStore();

  await store.dispatch(fetchUser('user-1'));

  const state = store.getState().auth;
  expect(state.user).toBeNull();
  expect(state.status).toBe('failed');
  expect(state.error).toBe('Error de red');
});
```

Two tests per thunk minimum: success + failure. Add a third for unique cases (concurrent dispatches, abort signals).

---

## Inspecting dispatched actions

When the side effect matters more than final state (e.g., a thunk dispatches another thunk), spy the dispatch:

```ts
const store = makeTestStore();
const dispatch = jest.spyOn(store, 'dispatch');

await store.dispatch(fetchUser('user-1'));

expect(dispatch).toHaveBeenCalledWith(
  expect.objectContaining({ type: 'auth/fetchUser/pending' })
);
expect(dispatch).toHaveBeenCalledWith(
  expect.objectContaining({ type: 'auth/fetchUser/fulfilled', payload: mockUser })
);
```

Prefer state-level assertions when possible — they're less brittle to internal action-type renames.

---

## Components with selectors

```ts
const { container } = renderWithProviders(<UserBadge />, {
  preloadedState: {
    auth: { user: { id: '1', name: 'María' }, token: 'abc', status: 'idle' },
  },
});

expect(screen.getByText('María')).toBeInTheDocument();
```

The component reads via `useSelector(selectUserName)` — the test never imports the selector, it just sets the state shape and asserts on the rendered output.

---

## Components dispatching thunks

```ts
const { store } = renderWithProviders(<LoginForm />);

await user.type(screen.getByLabelText('Correo'), 'maria@example.com');
await user.type(screen.getByLabelText('Contraseña'), 'pass123');
await user.click(screen.getByRole('button', { name: 'Entrar' }));

await waitFor(() => {
  expect(store.getState().auth.user?.email).toBe('maria@example.com');
});
```

The thunk runs through the real store. Mock the **service** (HTTP boundary), not the thunk itself.

---

## RTK Query

```ts
import { setupApiStore } from './setupApiStore';
import { authApi } from './authApi';

it('getMe: caches and transforms response', async () => {
  const fetchSpy = jest.spyOn(global, 'fetch')
    .mockResolvedValue(new Response(JSON.stringify(mockUserDto)));

  const store = setupApiStore(authApi);
  const result = await store.dispatch(authApi.endpoints.getMe.initiate());

  expect(result.data).toEqual(transformedUser);
  expect(fetchSpy).toHaveBeenCalledWith(
    expect.stringContaining('/me'),
    expect.objectContaining({ method: 'GET' })
  );
});
```

`setupApiStore` is a small helper exposing `{ store, api }` with `setupListeners` enabled — RTK Query needs them for refetch-on-focus and similar.

For invalidation tests:

```ts
await store.dispatch(authApi.endpoints.getMe.initiate());
await store.dispatch(authApi.endpoints.updateMe.initiate(input));
// Asserts getMe refetched after invalidating tag 'Me':
expect(fetchSpy).toHaveBeenCalledTimes(3); // get, update, refetch-get
```

---

## What NOT to test

- **Action creators generated by `createSlice`** — they're typed wrappers; no logic.
- **`extraReducers` mappings** — covered by the thunk test (final state).
- **Middleware shipped with RTK** — `serializableCheck`, `immutableCheck`. Trust the library.
- **`combineReducers` output** — test individual reducers; the combination is wiring.

---

## Common failures

| Symptom | Cause | Fix |
|---|---|---|
| `useSelector hook called outside <Provider>` | Component rendered with bare `render` | Use `renderWithProviders` |
| Thunk test passes but state never updates | Forgot to `await store.dispatch(...)` | `await` the dispatch |
| `non-serializable value detected` | Date/Function in state | Disable `serializableCheck` in test middleware (acceptable for tests) |
| RTK Query test misses tag invalidation | `setupListeners` not called | Use `setupApiStore` helper, not bare `configureStore` |
| Selector returns wrong value with `createSelector` | Test state object identity changed but contents same | Use the actual store, not bare state objects, for memoized selectors |

---

## Related

- `runners/jest.md` / `runners/vitest.md` — runner setup
- `stacks/nx-monorepo.md` — `renderWithProviders` lives in shared `@test-helpers`
- `stacks/nextjs-app-router.md` — RTK store in App Router
- `philosophy.md` — behavior over implementation (don't test action types, test state)
