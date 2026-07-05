# Redux + Sagas

> **Module**: frontend/infrastructure/state
> **Stack**: Redux 4 + Redux Saga 1.x (NOT Redux Toolkit)
> **Scope**: Cross-platform (web monorepo + mobile single-app)

---

## TL;DR

**Flow**: Component → dispatch(action) → Saga (takeEvery) → Service → API → dispatch(result) → Reducer → Selector → Component

**DO**:
- Action types: template literals with `ALIAS`, one domain directory each
- Actions: explicit creators (trigger + result), namespace import
- Reducer: handler map pattern (NOT switch/case)
- Sagas: worker/handler pairs + `sagaHandler` utility
- Selectors: three-tier `createSelector` (base → simple → composed → aggregate)

**DON'T**:
- Redux Toolkit (`createSlice`, `createAsyncThunk`)
- Direct API calls from components
- Switch/case in reducers
- Business logic in reducers (only state shape)
- `export default` (except `.screen.tsx`)

---

## Architecture

```
state/store/
├── action-types/{domain}/        → constants (template literals)
├── action/{domain}/              → action creators (trigger + result)
├── reducers/{domain}/            → reducer + handler map + helpers
├── sagas/{domain}/               → worker/handler + root saga
└── selectors/{domain}/           → createSelector (base → simple → composed)
```

Each domain has its own directory with:
- `{domain}.{layer}.ts` — implementation
- `{domain}.{layer}.interfaces.ts` — types (when needed)
- `index.ts` — barrel (`export *`)

---

## 1. Action Types

### Directory Structure

```
action-types/
├── monitoring/
│   ├── monitoring.action-types.constants.ts
│   └── index.ts
├── promotions/
│   ├── promotions.action-types.ts
│   └── index.ts
```

### Template Literal Pattern

```typescript
const ALIAS = 'MONITORING';
const READ = `${ALIAS}_READ`;
const EXPORT = `${ALIAS}_EXPORT`;

/** Clean */
export const MONITORING_CLEAN_FLAGS = `${ALIAS}_CLEAN_FLAGS`;
export const MONITORING_CLEAN_STATE = `${ALIAS}_CLEAN_STATE`;

/** Result types (generic — shared across roles) */
export const MONITORING_READ_HEADER_SUCCESS = `${READ}_HEADER_SUCCESS`;
export const MONITORING_READ_HEADER_ERROR = `${READ}_HEADER_ERROR`;

/** Trigger types (role-specific) */
export const MONITORING_READ_DISTRIBUTOR_HEADER = `${READ}_DISTRIBUTOR_HEADER`;
export const MONITORING_EXPORT_DISTRIBUTOR_DISTRIBUTION = `${EXPORT}_DISTRIBUTOR_DISTRIBUTION`;
```

**Why template literals**: Single source of truth for prefix. Sub-prefixes (`READ`, `EXPORT`) reduce repetition. Eliminates typos.

### Action Type Categories

| Category | Pattern | Dispatched By |
|----------|---------|---------------|
| **Clean** | `{ALIAS}_CLEAN_FLAGS`, `{ALIAS}_CLEAN_STATE` | Components (cleanup on unmount) |
| **Trigger** | `{ALIAS}_{VERB}_{ENTITY}` | Components (via action creators) |
| **Result (success)** | `{ALIAS}_{VERB}_{ENTITY}_SUCCESS` | Sagas (on API success) |
| **Result (failure)** | `{ALIAS}_{VERB}_{ENTITY}_ERROR` | Sagas (on API error) |

### God File Decomposition

When a single constants file contains multiple domains:

1. **Group by prefix** — `MONITORING_*`, `LOOKING_*`, `MY_TEAM_*`
2. **Create domain directories** — `action-types/{domain}/` with constants + barrel
3. **Update all consumers** — change import paths to domain barrels
4. **Delete god file** — after all consumers updated
5. **Verify** — lint + type-check + tests

---

## 2. Actions

### Two Roles

| Role | Suffix | Dispatched By | Example |
|------|--------|---------------|---------|
| **Trigger** | `*Action` | Components/hooks | `readDistributorHeaderAction` |
| **Result** | `*Success`, `*Failure`, `*Clean` | Sagas | `readMonitoringHeaderSuccess` |

### Explicit Creators

```typescript
import type { MonitoringPayload } from './monitoring.actions.interfaces';
import { MONITORING_READ_DISTRIBUTOR_HEADER } from '../../action-types/monitoring';

/** Trigger — dispatched by hooks/components */
export const readDistributorHeaderAction = ({ userId }: MonitoringPayload) => ({
  payload: { userId },
  type: MONITORING_READ_DISTRIBUTOR_HEADER,
});

/** Result — dispatched by sagas */
export const readMonitoringHeaderSuccess = (data: Record<string, unknown>) => ({
  payload: { data },
  type: MONITORING_READ_HEADER_SUCCESS,
});

export const readMonitoringHeaderFailure = (error: { message: string }) =>
  defaultErrorActionCreator(error, MONITORING_READ_HEADER_ERROR);
```

### Namespace Import Convention

```typescript
/** Barrel: action/{domain}/index.ts */
export * as monitoringActions from './monitoring.actions';

/** Consumer (sagas): */
import { monitoringActions } from '../../action/monitoring';
monitoringActions.readMonitoringHeaderSuccess(data);
```

**Why explicit creators (not factories)**: Easier to grep, visible params, real function names in stack traces.

---

## 3. Reducer — Classic Switch/Case

### Structure

```
reducers/{domain}/
├── {domain}.reducer.ts              → switch/case reducer + initialState
├── {domain}.reducer.test.tsx        → black-box tests (action → expected state)
├── {domain}.interfaces.ts           → MonitoringState, ActionPayload, MonitoringAction
└── index.ts                         → barrel
```

Single file. No handler maps, no extracted handlers, no helpers subfolder.

### Reducer

```typescript
import {
  MONITORING_CLEAN_FLAGS,
  MONITORING_CLEAN_STATE,
  MONITORING_READ_HEADER_ERROR,
  MONITORING_READ_HEADER_SUCCESS,
} from '../../action-types/monitoring';
import type { MonitoringAction, MonitoringState } from './monitoring.interfaces';

export const initialState: MonitoringState = {
  monitoringHeader: undefined,
  readMonitoringHeaderError: undefined,
  readMonitoringHeaderSuccess: undefined,
  totalAmount: 0,
};

const monitoringReducer = (
  state: MonitoringState = initialState,
  action: MonitoringAction
): MonitoringState => {
  switch (action.type) {
    case MONITORING_CLEAN_STATE:
      return { ...initialState };

    case MONITORING_CLEAN_FLAGS:
      return {
        ...state,
        readMonitoringHeaderError: undefined,
        readMonitoringHeaderSuccess: undefined,
      };

    case MONITORING_READ_HEADER_ERROR:
      return {
        ...state,
        readMonitoringHeaderError: action.payload.error,
        readMonitoringHeaderSuccess: false,
      };

    case MONITORING_READ_HEADER_SUCCESS:
      return {
        ...state,
        monitoringHeader: action.payload.data as MonitoringState['monitoringHeader'],
        readMonitoringHeaderError: undefined,
        readMonitoringHeaderSuccess: true,
        totalAmount:
          ((action.payload.data as Record<string, unknown>)?.['totalAmount'] as number) ?? 0,
      };

    default:
      return state;
  }
};

export { monitoringReducer };
```

### Interfaces

```typescript
import type { MonitoringState } from '@your-org/consultas/common/models/Monitoring/monitoring.interfaces';

export type { MonitoringState };

export interface ActionPayload {
  [key: string]: unknown;
  data?: unknown;
  error?: string;
  file?: unknown;
}

export interface MonitoringAction {
  payload: ActionPayload;
  type: string;
}
```

**Why switch/case**: Simple, readable, self-contained. Each case is a direct state transformation. No indirection through handler maps, no helper files. The reducer stays under 150 lines for typical domains.

---

## 4. Sagas — Worker/Handler Pattern

### Structure

```
sagas/{domain}/
├── {domain}.sagas.ts                → workers + handlers + root saga + saga maps
├── {domain}.sagas.interfaces.ts     → typed action interfaces
└── index.ts                         → barrel
```

### Worker/Handler Pair

```typescript
import { call, takeEvery } from 'redux-saga/effects';
import { sagaHandler } from '@your-org/utils/lib/state/store/sagas/global';

/** Worker — calls the API service */
export function* readDistributorHeaderSaga({ payload }: AnyAction): Generator {
  return yield call(InsightsAPI.monitoring.readDistributorHeader, payload);
}

/** Handler — orchestrates success/failure flow via sagaHandler */
export function* readDistributorHeaderHandler(action: AnyAction) {
  yield sagaHandler({
    action,
    errorActionCreator: monitoringActions.readMonitoringHeaderFailure,
    saga: readDistributorHeaderSaga,
    successActionCreator: monitoringActions.readMonitoringHeaderSuccess,
  });
}
```

### sagaHandler Utility

`sagaHandler` is a centralized utility that:
1. Calls the worker saga
2. On success → dispatches `successActionCreator(response.data)`
3. On error → dispatches `errorActionCreator(error)`
4. Optionally manages loader state

```typescript
/** sagaHandler interface */
interface SagaHandlerParams {
  action: AnyAction;
  errorActionCreator: (error: { message: string }) => Action;
  saga: GeneratorFunction;
  successActionCreator: (data: unknown) => Action;
  fixedLoaderId?: string;       // optional (mobile)
  showLoader?: boolean;         // optional (mobile)
}
```

### Root Saga + Saga Maps

```typescript
/** Root saga — registers all watchers */
export function* monitoringSaga() {
  yield takeEvery(MONITORING_READ_DISTRIBUTOR_HEADER, readDistributorHeaderHandler);
  yield takeEvery(MONITORING_READ_REGIONAL_HEADER, readRegionalHeaderHandler);
  yield takeEvery(MONITORING_EXPORT_DISTRIBUTOR_DISTRIBUTION, exportDistributorDistributionHandler);
  // ...
}

/** Saga maps — exported for organized test coverage */
export const headerSagaHandler = {
  [MONITORING_READ_DISTRIBUTOR_HEADER]: readDistributorHeaderHandler,
  [MONITORING_READ_REGIONAL_HEADER]: readRegionalHeaderHandler,
  // ...
};

export const distributionSagaHandler = { /* ... */ };
export const exportSagaHandler = { /* ... */ };
```

**Saga maps** group handlers by responsibility (header, distribution, export). Tests iterate each map to verify all handlers.

### Export Reuse Pattern

Export handlers reuse the same worker saga as read handlers but dispatch to export-specific result actions:

```typescript
/** Read uses distribution result actions */
export function* readDistributorDistributionHandler(action: AnyAction) {
  yield sagaHandler({
    action,
    errorActionCreator: monitoringActions.readMonitoringDistributionFailure,
    saga: readDistributorDistributionSaga,
    successActionCreator: monitoringActions.readMonitoringDistributionSuccess,
  });
}

/** Export reuses same worker, different result actions */
export function* exportDistributorDistributionHandler(action: AnyAction) {
  yield sagaHandler({
    action,
    errorActionCreator: monitoringActions.exportMonitoringFileFailure,
    saga: readDistributorDistributionSaga,
    successActionCreator: monitoringActions.exportMonitoringFileSuccess,
  });
}
```

---

## 5. Selectors — Three-Tier Architecture

```typescript
import { createSelector } from 'reselect';

/** Tier 1: Base — single entry point to the reducer slice */
const selectMonitoringState = (state: RootState): MonitoringState =>
  state.monitoringReducer || initialState;

/** Tier 2: Simple — 1:1 with state fields */
export const selectMonitoringHeader = createSelector(
  selectMonitoringState,
  (s) => s.monitoringHeader
);

/** Tier 3: Composed — derived logic */
export const selectMonitoringTotalOrderAmount = createSelector(
  [selectMonitoringTotalAmount, selectMonitoringTotalAmountLineage],
  (amount, lineage) => amount + lineage
);

export const selectMonitoringIsLoadingHeader = createSelector(
  [selectMonitoringReadHeaderSuccess],
  (success) => success === undefined
);

/** Tier 4: Aggregate — composite objects for hooks */
export const selectMonitoringHeaderState = createSelector(
  [selectMonitoringHeader, selectMonitoringTotalAmount, selectMonitoringIsLoadingHeader],
  (header, totalAmount, isLoading) => ({ header, totalAmount, isLoading })
);
```

**Why `createSelector`**: Memoization prevents unnecessary re-renders. Composed selectors compose from simple ones — never from the base directly.

---

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Action type | `SCREAMING_SNAKE_CASE` | `MONITORING_READ_HEADER_SUCCESS` |
| Action creator (trigger) | `camelCase` + `Action` suffix | `readDistributorHeaderAction` |
| Action creator (success) | `camelCase` + `Success` suffix | `readMonitoringHeaderSuccess` |
| Action creator (failure) | `camelCase` + `Failure` suffix (NOT `Error`) | `readMonitoringHeaderFailure` |
| Saga (worker) | `camelCase` + `Saga` suffix | `readDistributorHeaderSaga` |
| Saga (handler) | `camelCase` + `Handler` suffix | `readDistributorHeaderHandler` |
| Saga (root) | `camelCase` + `Saga` suffix | `monitoringSaga` |
| Reducer | `camelCase` + `Reducer` suffix | `monitoringReducer` |
| Selector | `select` + `PascalCaseDomain` + `Field` | `selectMonitoringHeader` |
| State field (error) | `read{Domain}{Entity}Error` | `readMonitoringHeaderError` |
| State field (success) | `read{Domain}{Entity}Success` | `readMonitoringHeaderSuccess` |

**Critical**: Action creators end with `Failure` (the action). State fields end with `Error` (the data). These are independent — do NOT conflate them.

---

## Advanced: Action Factory Pattern

For domains with many similar actions (e.g., per-role CRUD with 5+ triggers), use factories to eliminate copy-paste:

```typescript
const createTriggerAction = (type: string) =>
  (payload: DomainPayload) => ({ type, payload });

const createResultAction = (type: string) =>
  (data: unknown) => ({ type, payload: { data } });

const createErrorAction = (type: string) =>
  (error: string) => ({ type, payload: { error } });

export const readDistributorHeader = createTriggerAction(TYPES.READ_DISTRIBUTOR_HEADER);
export const readPromoterHeader = createTriggerAction(TYPES.READ_PROMOTER_HEADER);
export const readHeaderSuccess = createResultAction(TYPES.READ_HEADER_SUCCESS);
export const readHeaderFailure = createErrorAction(TYPES.READ_HEADER_FAILURE);
```

**Pattern**: Triggers are role-specific, results are generic (shared state slot).

**When to use**: 5+ similar actions in the same domain. Below that threshold, prefer explicit creators (easier to grep, visible params, real function names in stack traces).

---

## Advanced: Saga Factory with sagaHandler

```typescript
const createDomainSaga = (serviceMethod, successAction, failureAction) => {
  function* worker(action) {
    return yield call(serviceMethod, action.payload);
  }
  return function* handler(action) {
    yield sagaHandler({
      action,
      saga: worker,
      successActionCreator: successAction,
      failureActionCreator: failureAction,
    });
  };
};

const headerSagas = {
  [TYPES.READ_DISTRIBUTOR_HEADER]: createDomainSaga(
    API.readDistributorHeader,
    actions.readHeaderSuccess,
    actions.readHeaderFailure
  ),
  [TYPES.READ_PROMOTER_HEADER]: createDomainSaga(
    API.readPromoterHeader,
    actions.readHeaderSuccess,
    actions.readHeaderFailure
  ),
};

export default function* rootSaga() {
  for (const [type, saga] of Object.entries({ ...headerSagas, ...distributionSagas })) {
    yield takeEvery(type, saga);
  }
}
```

**When to use**: Domains with 5+ worker/handler pairs that follow the identical pattern (call service → dispatch success/failure). Reduces 30 identical functions to a declarative map.

---

## Platform Differences

| Aspect | Web (monorepo) | Mobile (single app) |
|--------|----------------|---------------------|
| Location | `packages/mod-*/src/state/store/` | `src/state/` |
| File suffix | `.action-types.constants.ts` (ESLint) | `.action-types.ts` |
| Service init | `Service(config['API_URL'])` | `Service(config.API_URL)` |
| sagaHandler | `{ action, saga, success, error }` | + `fixedLoaderId`, `showLoader` |
| Import alias | `@your-org/utils/lib/state/store/sagas/global` | `@/state/sagas/global` |

---

## Related

- `frontend/infrastructure/state/selectors.md` — Selector patterns (sovereignty agnostic)
- `frontend/infrastructure/services.md` — Service factory pattern
- `frontend/tooling/js-to-ts-migration.md` — Full migration guide with file structure
