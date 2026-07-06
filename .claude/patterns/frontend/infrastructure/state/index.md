# State Management

> **Module**: infrastructure/state
> **Tech**: Redux Toolkit
> **Principle**: Centralized state, predictable updates

---

## Patterns

| Pattern | Purpose |
|---------|---------|
| `redux.md` | Store setup, createManagedThunk |
| `slices.md` | Slice structure, reducers |
| `selectors.md` | Memoized selectors, derived state |
| `redux-sagas.md` | Redux Saga for critical flows (payments, auth, multi-step) alongside RTK |

---

## TL;DR

**Flow**: Component → dispatch(thunk) → Service → API → Reducer → Selector → Component

```typescript
// Thunk (async action)
export const fetchUsers = createManagedThunk(
  'users/fetch',
  async (_, { rejectWithValue }) => {
    const result = await userService.getAll();
    if (!result.success) return rejectWithValue(result.error);
    return result.data;
  }
);

// Selector (memoized)
export const selectActiveUsers = createSelector(
  [selectAllUsers],
  (users) => users.filter(u => u.isActive)
);

// Component (consume)
const users = useAppSelector(selectActiveUsers);
const dispatch = useAppDispatch();
dispatch(fetchUsers());
```

---

## Rules

1. **Server data in Redux** - Never useState for fetched data
2. **createManagedThunk** - All async operations
3. **Selectors for derived state** - Memoization by default
4. **No direct service calls** - Always through thunks

---

**Total**: 4 patterns
