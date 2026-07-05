# Selectors

> **Module**: frontend/infrastructure/state
> **Pattern**: createSelector for memoization

---

## TL;DR

**DO**:
- createSelector for filtering, sorting, combining
- Simple functions for direct state access
- Parameterized selectors for dynamic filtering
- Loading/error from global.activeLoaders/notifications
- Compose selectors (reuse memoization)

**DON'T**:
- Business logic (filtering/sorting only)
- Async operations
- State mutations (read-only)
- Recompute on every render (use createSelector)

---

## Selector Types

| Type | When to Use | Memoized |
|------|-------------|----------|
| Base | Direct state access | No |
| Simple | Single input, minimal logic | Yes |
| Filtering | Array.filter() | Yes |
| Sorting | Array.sort() (immutable) | Yes |
| Combined | Multiple inputs | Yes |
| Parameterized | Dynamic parameter | Yes |

---

## Base & Simple Selectors

```typescript
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@redux/store';

// Base (direct access, no memoization needed)
const selectUsersState = (state: RootState) => state.users;

// Simple (memoized)
export const selectUsers = createSelector(
  [selectUsersState],
  (usersState) => usersState.users
);
```

---

## Filtering Selector

```typescript
export const selectActiveUsers = createSelector(
  [selectUsers],
  (users) => users.filter((user) => user.isActive)
);

export const selectAdminUsers = createSelector(
  [selectUsers],
  (users) => users.filter((user) =>
    user.role === 'admin' || user.role === 'owner'
  )
);
```

---

## Sorting Selector

```typescript
// ✅ Immutable sort with [...users]
export const selectUsersSortedByName = createSelector(
  [selectUsers],
  (users) => [...users].sort((a, b) =>
    `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
  )
);
```

**Important**: `[...users]` creates new array (immutable sort).

---

## Parameterized Selector

```typescript
export const selectUsersByRole = createSelector(
  [
    selectUsers,
    (state: RootState, role: string) => {
      void state;  // Required for signature
      return role;
    },
  ],
  (users, role) => users.filter((user) => user.role === role)
);

// Usage: selectUsersByRole(state, 'admin')
```

---

## Combined Selector (Stats)

```typescript
export const selectUsersStats = createSelector(
  [selectUsers, selectActiveUsers, selectAdminUsers],
  (allUsers, activeUsers, adminUsers) => ({
    total: allUsers.length,
    active: activeUsers.length,
    admins: adminUsers.length,
    activationRate: allUsers.length > 0
      ? (activeUsers.length / allUsers.length) * 100
      : 0,
  })
);
```

---

## Loading/Error State

```typescript
// Loading from global.activeLoaders (createManagedThunk)
export const selectUsersLoading = createSelector(
  [(state: RootState) => state.global.activeLoaders],
  (loaders) => Boolean(loaders['LOADER_FOR_users/fetchUsers'])
);

// Error from global.notifications
export const selectUsersError = createSelector(
  [(state: RootState) => state.global.notifications],
  (notifications) => {
    const errors = notifications.filter(
      (n) => n.type === 'error' && n.origin?.startsWith('users/')
    );
    return errors.length > 0 ? errors[errors.length - 1]?.message : null;
  }
);
```

---

## Why createSelector

- **Memoization**: Caches result, recomputes only when inputs change
- **Performance**: Prevents unnecessary re-renders
- **Composition**: Combine selectors efficiently
- **Testability**: Pure functions

---

## Related

- `frontend/infrastructure/state/slices.md` - Slice patterns
- `frontend/infrastructure/state/redux.md` - Store config

