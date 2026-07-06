# Redux Slices

> **Module**: frontend/infrastructure/state
> **Pattern**: createSlice + extraReducers + transform layer

---

## TL;DR

**DO**:
- createSlice for ALL slices
- createManagedThunk for ALL async
- Transform in thunk operation
- extraReducers with builder pattern
- Minimal sync reducers (UI-only)

**DON'T**:
- createAsyncThunk directly
- Business logic in reducers
- HTTP calls in slices
- Transform in services

---

## Slice Responsibility

| CAN DO | CANNOT DO |
|--------|-----------|
| State shape | Business logic |
| Async thunks | HTTP calls |
| extraReducers | Validation |
| Sync reducers (UI-only) | Transform in service |

---

## Complete Slice

```typescript
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createManagedThunk } from '@thunks';
import { UsersService } from '@services/admin';
import { transformUser } from '@domain/mappers';
import type { UserEntity } from '@interfaces/user';

interface UsersState {
  users: UserEntity[];
  selectedUsers: string[];  // UI-only
  lastUpdated: string | null;
}

const initialState: UsersState = {
  users: [],
  selectedUsers: [],
  lastUpdated: null,
};

// Async thunks
export const fetchUsers = createManagedThunk<UserEntity[], void>({
  actionName: 'users/fetchUsers',
  customErrorMessage: 'Error al cargar usuarios',
  operation: async () => {
    const apiData = await UsersService.getAll();
    return apiData.map(transformUser);  // Transform here
  },
});

export const deleteUser = createManagedThunk<string, string>({
  actionName: 'users/deleteUser',
  customErrorMessage: 'Error al eliminar usuario',
  operation: async (userId) => {
    await UsersService.delete(userId);
    return userId;  // Return ID for state cleanup
  },
});

// Slice
export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Sync reducers (UI-only state)
    selectUser: (state, action: PayloadAction<string>) => {
      if (!state.selectedUsers.includes(action.payload)) {
        state.selectedUsers.push(action.payload);
      }
    },
    clearSelection: (state) => {
      state.selectedUsers = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload;
      state.lastUpdated = new Date().toISOString();
    });

    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
      state.selectedUsers = state.selectedUsers.filter((id) => id !== action.payload);
    });
  },
});

export const { selectUser, clearSelection } = usersSlice.actions;
```

---

## State Shape

```typescript
interface SliceState {
  items: Entity[];         // Domain entities (from server)
  selectedIds: string[];   // UI-only state
  lastUpdated: string | null;
}
```

**Pattern**: Separate server data from UI-only state.

---

## extraReducers Patterns

```typescript
// Replace array
builder.addCase(fetchAll.fulfilled, (state, action) => {
  state.items = action.payload;
});

// Add item
builder.addCase(create.fulfilled, (state, action) => {
  state.items.push(action.payload);
});

// Update item
builder.addCase(update.fulfilled, (state, action) => {
  const index = state.items.findIndex((i) => i.id === action.payload.id);
  if (index !== -1) {
    state.items[index] = { ...state.items[index], ...action.payload };
  }
});

// Remove item
builder.addCase(remove.fulfilled, (state, action) => {
  state.items = state.items.filter((i) => i.id !== action.payload);
});
```

---

## Why Transform in Thunk

```
Service (raw API) → Thunk (transform) → State (domain entities)
```

**Benefits**:
- Services test HTTP only
- Thunks test transformation
- Same service, different transforms
- Type safety at boundaries

---

## Related

- `frontend/infrastructure/state/redux.md` - Store config
- `frontend/infrastructure/state/selectors.md` - Selectors
- `frontend/infrastructure/services.md` - Service layer

