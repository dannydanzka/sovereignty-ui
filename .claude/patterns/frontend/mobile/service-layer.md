# Service Layer Pattern — React Native

> **Scope**: Mobile-only API service pattern with centralized config injection
> **Sovereignty principle**: Self-Sufficiency — each service is self-contained with its config

---

## File Structure

```
services/
└── [domain]/
    ├── index.ts                          # Barrel export only
    ├── [serviceName].service.ts          # Service functions
    ├── [serviceName].service.interfaces.ts # TypeScript interfaces
    └── [serviceName].service.test.ts     # Tests (optional)
```

---

## Config Structure (Centralized)

Mobile uses centralized config files in `config/` folder:

```
config/
├── default.json    # Dev environment
├── qa.json         # QA environment
├── lab.json        # Lab environment
└── prod.json       # Production environment
```

```json
{
  "PROMOTIONS_API": {
    "URL": "https://dev.api-gateway.example.com/api/v1",
    "ENDPOINTS": {
      "READ_CONDITIONAL": "/Product/ConditionalProduct/GetOffer"
    }
  }
}
```

---

## Service Implementation

```typescript
// conditionalProducts.service.ts
import handleApiRequest from '../../../utils/helpers/handleApiRequest';
import type {
  ConditionalProductsAPIConfig,
  ConditionalProductsResponse,
} from './conditionalProducts.service.interfaces';

export const getConditionalProducts =
  (API: ConditionalProductsAPIConfig) =>
  async (catalogId: number | string): Promise<ConditionalProductsResponse> =>
    handleApiRequest({
      endpoint: API.ENDPOINTS.READ_CONDITIONAL,
      method: 'get',
      query: { catalogId: String(catalogId) },
      url: API.URL,
      preProcessResponse: (res) => res,
    });

// Service factory
export const conditionalProductsService = (API: ConditionalProductsAPIConfig) => ({
  getConditionalProducts: getConditionalProducts(API),
});
```

---

## Interfaces

```typescript
// conditionalProducts.service.interfaces.ts
export interface ConditionalProductsAPIConfig {
  URL: string;
  ENDPOINTS: {
    READ_CONDITIONAL: string;
  };
}

export interface ConditionalProductsResponse {
  catalogId: number;
  masterProduct: string[];
  multiplicar: number;
  products: string[];
}
```

---

## Usage in Sagas

```typescript
import { call, put } from 'redux-saga/effects';
import config from '@/config';
import { conditionalProductsService } from '@/services/promotions';

const promotionsAPI = conditionalProductsService(config.PROMOTIONS_API);

export function* getConditionalProductsSaga(action) {
  try {
    const response = yield call(
      promotionsAPI.getConditionalProducts,
      action.payload.catalogId
    );
    yield put(getConditionalProductsSuccess(response));
  } catch (error) {
    yield put(getConditionalProductsFailure(error));
  }
}
```

---

## Rules

1. **Config centralization**: Use `config/default.json` for URLs and endpoints
2. **Factory pattern**: Pass config to service factory
3. **TypeScript interfaces**: Define all types in `.interfaces.ts`
4. **Barrel exports**: Use `export *` in index files
5. **Named exports**: NEVER use default exports for services
6. **handleApiRequest**: ALL API calls go through this wrapper

---

## Differences from Web

| Aspect | Web (Monorepo) | Mobile (React Native) |
|--------|----------------|----------------------|
| Config location | `packages/lib-utils/src/config/` | `config/` (root) |
| Build system | src/ → lib/ compilation | Metro bundler (no compilation) |
| Import paths | `@lib/services` | `@/services` or `@services` |
| Config access | DefinePlugin injection | Direct import from `@/config` |
| Service location | `packages/lib-services/src/` | `src/services/` |

---

## Related

- `mobile/error-handling.md` — Error chain
- `frontend/infrastructure/state/redux.md` — Saga patterns
- `frontend/infrastructure/services.md` — Cross-platform service concepts
