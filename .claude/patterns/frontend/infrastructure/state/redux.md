# Redux (Store + Thunks)

> **Module**: frontend/infrastructure/state
> **ESLint**: `custom/no-direct-service-calls`, `custom/no-redux-in-components`

---

## TL;DR

**DO**:
- createManagedThunk for ALL async operations
- combineReducers for all slices
- redux-persist with whitelist (security)
- serializableCheck: false (Date objects)
- Transform in thunk (API → Domain)

**DON'T**:
- createAsyncThunk directly (use wrapper)
- Persist sensitive data (users, events)
- Business logic in thunks (use Use Cases)
- Skip transform layer

---

## Redux Flow

```
Component → Hook → createManagedThunk
    ↓
Service (handleRequest) → API
    ↓
Transform (API → Domain) in Thunk
    ↓
extraReducers → State Update
    ↓
Selectors → Component
```

---

## Store Configuration

```typescript
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['global', 'auth'],  // ONLY safe data
};

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  global: globalSlice.reducer,
  users: usersSlice.reducer,
});

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## createManagedThunk

```typescript
// ✅ Automatic loader + notification + error handling
export const fetchUsers = createManagedThunk<UserEntity[], void>({
  actionName: 'users/fetchUsers',
  customErrorMessage: 'Error al cargar usuarios',
  operation: async () => {
    const apiData = await UsersService.getAll();
    return apiData.map(transformUser);  // Transform here
  },
});

// ✅ With parameters
export const updateUser = createManagedThunk<
  UserEntity,
  { userId: string; data: Partial<UserData> }
>({
  actionName: 'users/updateUser',
  customErrorMessage: 'Error al actualizar usuario',
  operation: async ({ userId, data }) => {
    const apiData = await UsersService.update(userId, data);
    return transformUser(apiData);
  },
});
```

**Why createManagedThunk**:
- Automatic loaders (global.activeLoaders)
- Error notifications (global.notifications)
- Centralized error logging
- Spanish messages
- Less boilerplate

---

## Persist Strategy

| Persist (Safe) | Runtime Only (Sensitive) |
|----------------|--------------------------|
| global (UI prefs) | users |
| auth (session) | events, admin |

**Why Whitelist**: Security. Sensitive data should not persist in localStorage.

---

## Why serializableCheck: false

Domain entities use Date objects. Redux Toolkit warns about non-serializable values, but they work correctly with our controlled serialization.

---

## Related

- `frontend/infrastructure/state/slices.md` - Slice patterns
- `frontend/infrastructure/state/selectors.md` - Selector patterns
- `frontend/infrastructure/services.md` - Service layer

