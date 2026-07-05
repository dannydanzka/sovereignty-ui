# SCG Step 6: Implementation

> **Input**: Plan with steps, migrated files ready
> **Output**: Feature implemented following architecture flow

---

## Architecture Flow

Always implement in this order — each layer depends on the previous:

```
1. Service      → API calls (factory pattern)
2. Saga         → Orchestration (worker → handler → watcher)
3. Reducer      → State shape (trigger → success → failure → cleanFlags)
4. Action Types → Constants
5. Selectors    → Memoized state access (createSelector)
6. Hooks        → Business logic aggregation (useAppSelector + derived)
7. UI           → Screens and components (styled-components)
```

## Per-Layer Checklist

### Service
- Factory pattern: `(API) => ({ method1, method2 })`
- Use `handleYOUR-PROJECTRequest` for ALL API calls
- Config injection from `config/default.json`
- Type params and return values

### Saga
- worker → handler → watcher pattern
- Use `sagaHandler` for error handling
- Export workers for testing

### Reducer
- trigger → success → failure → cleanFlags → cleanState
- Export `initialState` for testing
- Reset data on trigger (clear stale data)

### Selectors
- Base → raw data → computed (`getShouldShow*`)
- Use `createSelector` for memoization
- NEVER query state directly — always through selectors

### Hooks
- Return object with named values (not array)
- Use selectors (NEVER `state.x.y.z` directly)
- Complete dependency arrays in `useEffect`/`useMemo`
- NO conditional hooks

### UI
- styled-components ONLY (no inline styles)
- Theme values: `${({ theme }) => theme.colors.base}`
- `useTranslation()` for ALL user-facing text
- Event handlers prefixed `handle*`

---

## Iteration Pattern

```
Implement layer → Verify (tsc) → Fix errors → Next layer
```

Do NOT implement all layers then verify. Verify after each layer to catch issues early.

---

## Rules

- Consult patterns on-demand: `patterns/frontend/` for HOW
- Read 2-3 similar files BEFORE implementing each layer
- NEVER invent new patterns — match existing codebase conventions
- Business logic ONLY in hooks or sagas — NEVER in components
- API calls ONLY via sagas — NEVER direct from components
