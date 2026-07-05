# Data Persistence Patterns - v1.0

> **PURPOSE**: Strategic data persistence for Redux state
> **SCOPE**: Client-side caching with redux-persist
> **PHILOSOPHY**: Persist stable data, clear on auth changes

---

## Core Principle

**Persist what rarely changes. Fetch what changes often.**

| Data Type | Persistence | Reason |
|-----------|-------------|--------|
| Reference data (kits, categories, FAQs) | ✅ Persist | Changes infrequently, used across views |
| User preferences | ✅ Persist | Personal settings, theme, locale |
| Session data (current user) | ✅ Persist | Needed for auth state restoration |
| Transactional data (orders, payments) | ❌ Don't persist | Changes frequently, must be fresh |
| Real-time data (notifications, status) | ❌ Don't persist | Stale quickly, fetch on demand |

---

## Persist Whitelist Strategy

```typescript
// store.ts - Selective persistence
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'auth',       // Session restoration (ALWAYS persist)
    'global',     // UI preferences (with nested blacklist for loaders/toasts)
    'settings',   // App settings (if read-only for users)
  ],
  // Explicitly exclude volatile data
  blacklist: [
    'notifications',  // Real-time, fetch fresh
    'payments',       // Transactional, always fresh
    'enrollments',    // User-specific, changes often
  ],
};
```

### Critical: Shared Slices Between Admin and Public

**NEVER persist slices shared by admin and public contexts:**

```typescript
// ❌ DON'T persist shared slices
whitelist: ['kits', 'events', 'challenges']  // Admin needs real-time!

// ✅ DO keep shared slices runtime-only
// Admin creates/edits → needs fresh data
// Public views → fetch is fast enough
```

**Why?**
- Admin A creates a kit → Admin B must see it immediately
- Persisted data = stale data for admin context
- Network fetches are fast (~100ms), persistence saves little

**When CAN you persist reference data?**
- **Separate slices**: `publicKits` (persist) vs `adminKits` (don't persist)
- **Read-only apps**: If NO admin context exists, safe to persist
- **Offline-first**: If app must work offline, persist with sync strategy

---

## Slice Structure for Persistable Data

```typescript
// kits.slice.ts - Optimized for persistence
interface KitsState {
  kits: KitEntity[];
  lastFetched: string | null;  // Track freshness
  version: number;             // Schema version for migrations
}

const initialState: KitsState = {
  kits: [],
  lastFetched: null,
  version: 1,
};

// Track when data was fetched
builder.addCase(fetchKits.fulfilled, (state, action) => {
  state.kits = action.payload;
  state.lastFetched = new Date().toISOString();
});
```

---

## Smart Fetch Pattern

**Fetch only when necessary:**

```typescript
// useKits.ts - Smart fetch with cache check
export const useKits = () => {
  const kits = useSelector(selectKits);
  const lastFetched = useSelector(selectKitsLastFetched);
  const dispatch = useDispatch<AppDispatch>();

  const fetchIfStale = useCallback(async () => {
    // Skip if data is fresh (less than 5 minutes old)
    if (lastFetched) {
      const age = Date.now() - new Date(lastFetched).getTime();
      const FIVE_MINUTES = 5 * 60 * 1000;
      if (age < FIVE_MINUTES && kits.length > 0) {
        return; // Use cached data
      }
    }
    await dispatch(fetchKitsAction());
  }, [lastFetched, kits.length, dispatch]);

  // Fetch on mount if needed
  useEffect(() => {
    void fetchIfStale();
  }, [fetchIfStale]);

  return { kits, fetchIfStale };
};
```

---

## Auth-Triggered Cleanup

**Clear persisted data on auth changes:**

```typescript
// auth.slice.ts - Clear related data on logout
export const logout = createManagedThunk({
  actionName: 'auth/logout',
  operation: async (_, { dispatch }) => {
    await AuthService.logout();

    // Clear user-specific persisted data
    dispatch(clearEnrollments());
    dispatch(clearNotifications());
    dispatch(clearPayments());

    // Keep reference data (kits, events, challenges)
    // These are not user-specific
  },
});

// Alternative: Clear ALL persisted data
import { persistor } from '@redux';
export const logoutAndClearAll = async () => {
  await AuthService.logout();
  await persistor.purge(); // Clears everything
};
```

---

## Login Initialization Pattern

**Load essential data after login:**

```typescript
// useAuthInit.ts - Post-login data loading
export const useAuthInit = () => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Fetch user-specific data
      void dispatch(fetchUserEnrollments(user.id));
      void dispatch(fetchNotifications());

      // Refresh reference data if stale
      void dispatch(fetchAvailableKits());
      void dispatch(fetchActiveEvents());
    }
  }, [isAuthenticated, user, dispatch]);
};
```

---

## Component Usage Pattern

**Use cached data immediately, refresh in background:**

```typescript
// AddParticipantModal.tsx - Optimal UX
export const AddParticipantModal = ({ isOpen, onClose }) => {
  const { availableKits, fetchAvailableKits, isLoading } = useKits();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // If we have cached kits, use them immediately
      if (availableKits.length > 0) {
        setHasFetched(true);
        // Optionally refresh in background
        void fetchAvailableKits();
      } else {
        // No cache, must fetch
        void fetchAvailableKits().then(() => setHasFetched(true));
      }
    }
  }, [isOpen, availableKits.length, fetchAvailableKits]);

  // Show form immediately with cached data
  // Or wait for fetch if no cache
};
```

---

## What to Persist (Decision Matrix)

| Question | Yes → Persist | No → Don't Persist |
|----------|---------------|-------------------|
| Changes less than once per day? | ✅ | - |
| Same for all users? | ✅ | - |
| Needed immediately on app load? | ✅ | - |
| Small data size (< 100KB)? | ✅ | - |
| Contains sensitive data? | - | ❌ |
| Real-time accuracy required? | - | ❌ |
| User-specific transactional data? | - | ❌ |

---

## Migration Strategy

**Handle schema changes:**

```typescript
// persistConfig with migrations
import { createMigrate } from 'redux-persist';

const migrations = {
  1: (state) => state, // Initial version
  2: (state) => ({
    ...state,
    kits: {
      ...state.kits,
      // Add new field with default
      version: 2,
    },
  }),
};

const persistConfig = {
  key: 'root',
  storage,
  version: 2,
  migrate: createMigrate(migrations, { debug: false }),
  whitelist: ['auth', 'kits', 'events', 'challenges'],
};
```

---

## Project-Specific Implementation Example

**Recommended persist whitelist (minimal - admin needs real-time):**

```typescript
// Persist ONLY session-related slices
const persistConfig = {
  key: 'my_project_root',
  storage,
  whitelist: ['global', 'auth'],  // Minimal persistence
};

// Global slice has nested blacklist for transient UI state
const globalPersistConfig = {
  key: 'global',
  storage,
  blacklist: ['layoutBgColor', 'toasts', 'notifications', 'activeModals', 'activeLoaders'],
};
```

**Why minimal?**
- `kits`, `events`, `challenges` are shared by admin + public
- Admins create/edit these entities → need real-time updates
- Fetches are fast (~100ms) → persistence saves minimal time
- Stale data in admin = bugs and confusion

---

## Anti-Patterns

```typescript
// ❌ NEVER persist loading/error states
whitelist: ['global'] // NO - contains volatile state

// ❌ NEVER persist sensitive data without encryption
whitelist: ['payments'] // NO - contains financial data

// ❌ NEVER fetch on every render
useEffect(() => {
  fetchKits(); // NO - check cache first
}, []);

// ❌ NEVER ignore stale data
const kits = useSelector(selectKits);
// Missing freshness check

// ✅ ALWAYS check freshness before using cache
if (isFresh(lastFetched)) {
  return cachedData;
}
await refetch();
```

---

## Validation Checklist

- [ ] Whitelist contains only stable, reference data
- [ ] Auth changes trigger appropriate cleanup
- [ ] Components check cache before fetching
- [ ] Freshness is tracked with timestamps
- [ ] Migrations handle schema changes
- [ ] Sensitive data is excluded or encrypted
- [ ] Loading states are never persisted

---

## See also

**Standards**:
- `.claude/patterns/core/REDUX-STANDARDS.md` - Redux patterns
- `.claude/patterns/core/SLICE-STANDARDS.md` - Slice structure

**Patterns**:
- `.claude/patterns/redux-patterns.md` - Redux implementation
- `.claude/patterns/auth-session-patterns.md` - Auth state management

---

**Lines**: ~250 | **Status**: Active | **Version**: 1.0
