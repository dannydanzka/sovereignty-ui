# Testing by Layer — your-project

> **PURPOSE**: Concrete test patterns per architectural layer with your-project examples
> **FRAMEWORK**: Jest + @testing-library/react-native
> **UTILITIES**: `testSagaHandler`, `testService`, `buildURL` from `@/utils/testing/`
> **MOCKS**: Centralized in `@/utils/mocks/{domain}/` — `request/response` structure

---

## 1. Service Tests

Test each service method for success and failure using `testService` helper.

```typescript
import { config } from '@/appConfig';
import * as mocks from '@/utils/mocks/insights/monitoring.mocks';
import buildURL from '@/services/utils/buildURL';
import testService from '@/services/utils/testService';
import MonitoringService from './monitoring';

const API = config.INSIGHTS_API;
const monitoringAPI = MonitoringService(API);

describe('Monitoring Services', () => {
  it('handles readDistributorHeader success and failure', async () => {
    const URL = buildURL({
      url: API.MONITORING.URL,
      params: mocks.readDistributorHeader.request,
      endpoint: API.MONITORING.ENDPOINTS.READ_DISTRIBUTOR_HEADER,
    });

    const { error, noResponse, payload } = await testService({
      URL,
      service: monitoringAPI.readDistributorHeader,
      request: mocks.readDistributorHeader.request,
      mockedResponse: mocks.readDistributorHeader.response,
    });

    expect(payload).toEqual(mocks.readDistributorHeader.response.data);
    expect(noResponse).toBeUndefined();
    expect(error.message).toBe(errorResponseMock.error.code);
  });
});
```

**Key**: Each test covers BOTH success and failure in one call via `testService`.

---

## 2. Saga Tests

Test root saga watchers + individual handlers with `testSagaHandler`.

```typescript
import { call, takeEvery } from 'redux-saga/effects';
import { testSagaHandler } from '@/utils/testing/helpers/sagaHandlerHelper';
import * as mocks from '@/utils/mocks/exchanges/cart.mocks';
import ExchangesService from '@/services/exchanges';
import { config } from '@/appConfig';

const exchangesAPI = ExchangesService(config.EXCHANGES_API);

describe('Cart Sagas', () => {
  describe('rootSaga', () => {
    it('watches the required actions', () => {
      const gen = rootSaga();
      expect(gen.next().value).toEqual(
        takeEvery(types.READ_CART, readCartHandler)
      );
      expect(gen.next().done).toBeTruthy();
    });
  });

  describe('readCart', () => {
    const action = {
      payload: mocks.readCart.request,
      type: types.READ_CART,
    };

    it('calls service and dispatches correctly', () => {
      const gen = readCart(action);
      expect(gen.next().value).toEqual(
        call(exchangesAPI.cart.readCart, action.payload.cartId)
      );
    });

    it('handles success and failure', () => {
      testSagaHandler({
        action,
        handler: readCartHandler,
        saga: function* worker(a) {
          return yield call(exchangesAPI.cart.readCart, a.payload.cartId);
        },
        response: mocks.readCart.response,
        successActionCreator: cartActions.readCartSuccess,
        failureActionCreator: cartActions.readCartFailure,
      });
    });
  });
});
```

**Key**: Export workers for testing. `testSagaHandler` validates success/failure dispatch.

---

## 3. Reducer Tests

Test initial state, unknown actions, and each action type.

```typescript
import * as mocks from '@/utils/mocks/exchanges/cart.mocks';
import cartReducer, { initialState } from './cartReducer';
import * as types from '../../actions/types';

describe('Cart Reducer', () => {
  it('returns initial state', () => {
    expect(cartReducer(undefined, {})).toEqual(initialState);
  });

  it('returns current state for unknown action', () => {
    const state = { ...initialState };
    expect(cartReducer(state, { type: 'UNKNOWN' })).toEqual(state);
  });

  it('handles TRIGGER — resets flags', () => {
    const action = { payload: {}, type: types.READ_CART };
    const result = cartReducer(undefined, action);
    expect(result.readCartSuccess).toBeUndefined();
    expect(result.readCartError).toBeUndefined();
  });

  it('handles SUCCESS', () => {
    const action = {
      payload: mocks.readCart.response,
      type: types.READ_CART_SUCCESS,
    };
    const result = cartReducer(undefined, action);
    expect(result.readCartSuccess).toBe(true);
    expect(result.cart).toEqual(mocks.readCart.response);
  });

  it('handles FAILURE', () => {
    const action = { payload: { error: 'fail' }, type: types.READ_CART_FAILURE };
    const result = cartReducer(undefined, action);
    expect(result.readCartSuccess).toBe(false);
    expect(result.readCartError).toBe('fail');
  });

  it('handles CLEAN_FLAGS', () => {
    const action = { type: types.CART_CLEAN_FLAGS };
    expect(cartReducer(undefined, action)).toEqual(initialState);
  });
});
```

**Pattern**: TRIGGER resets flags -> SUCCESS sets data -> FAILURE sets error -> CLEAN_FLAGS resets.

---

## 4. Selector Tests

Direct call with mock state objects.

```typescript
import { ASSOCIATED, DISTRIBUTOR } from '@/utils/constants/UserType';
import { getProducts, getCartId, getAssociateId } from './cart.selectors';

describe('Cart Selectors', () => {
  const stateWithData = {
    cart: {
      cartReducer: { cartId: 1, products: [{ id: 1 }] },
    },
    nav: {
      userReducer: { user: { id: 1, type: ASSOCIATED } },
    },
  };

  const stateEmpty = {
    cart: {
      cartReducer: { cartId: null, products: null },
    },
    nav: {
      userReducer: { user: { id: 1, type: DISTRIBUTOR, associateId: null } },
    },
  };

  it('getProducts returns products array', () => {
    expect(getProducts(stateWithData)).toEqual([{ id: 1 }]);
  });

  it('getProducts returns null when empty', () => {
    expect(getProducts(stateEmpty)).toBeNull();
  });
});
```

**Key**: Mock the exact Redux store shape. Test both data-present and empty/null cases.

---

## 5. Hook Tests

Use `renderHook` with Redux provider wrapper.

```typescript
import { renderHook } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

describe('useCartData', () => {
  const store = mockStore({
    cart: { cartReducer: { products: [{ id: 1 }], cartId: 123 } },
    nav: { userReducer: { user: { type: 'DISTRIBUTOR' } } },
  });

  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  it('returns cart data from store', () => {
    const { result } = renderHook(() => useCartData(), { wrapper });
    expect(result.current.products).toEqual([{ id: 1 }]);
    expect(result.current.cartId).toBe(123);
  });
});
```

---

## 6. Component Tests

Render with providers, interact, assert on screen.

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react-native';

jest.mock('@/state/store', () => ({
  useAppSelector: jest.fn((selector) =>
    selector({
      app: { globalReducer: { isLoading: false } },
    })
  ),
}));

describe('LoaderProvider', () => {
  it('renders children when not loading', () => {
    render(
      <LoaderProvider>
        <Text>Content</Text>
      </LoaderProvider>
    );
    expect(screen.getByText('Content')).toBeOnTheScreen();
  });
});
```

**Key**: Mock `useAppSelector` or use `Provider` with `mockStore`. Use `toBeOnTheScreen()` (not `toBeInTheDocument()`).

---

## Mock Data Structure

Centralized in `src/utils/mocks/{domain}/{feature}.mocks.ts`:

```typescript
export const readDistributorHeader = {
  request: { userId: 849, userType: 'DISTRIBUTOR' },
  response: {
    data: {
      totalNumberOfOrders: 150,
      averageOrderAmount: 345.67,
      netCatalogSales: 12345.89,
    },
  },
};
```

**Rules**:
- Same structure as real API response (match `preProcessResponse` output)
- Spanish locale data
- Include both `request` and `response` (reusable in service + saga + component tests)
- Named exports with descriptive names (not `export default`)

---

## Testing Utilities Location

| Utility | Location | Purpose |
|---------|----------|---------|
| `testSagaHandler` | `@/utils/testing/helpers/sagaHandlerHelper` | Saga success/failure testing |
| `testService` | `@/services/utils/testService` | Service success/failure testing |
| `buildURL` | `@/services/utils/buildURL` | URL construction for service tests |
| `errorResponseMock` | `@/utils/mocks/errorResponse.mock` | Standard error response |
| Mocks | `@/utils/mocks/{domain}/` | Centralized mock data |

---

## Quick Reference

| Layer | Test File | Key Assertion |
|-------|-----------|---------------|
| Service | `{service}.test.ts` | `payload`, `error.message`, `noResponse` |
| Saga | `{saga}.test.ts` | `takeEvery`, `call`, `testSagaHandler` |
| Reducer | `{reducer}.test.ts` | Initial state, each action type, CLEAN_FLAGS |
| Selector | `{selector}.test.ts` | Direct call with mock state |
| Hook | `{hook}.test.tsx` | `renderHook` + wrapper + `result.current` |
| Component | `{component}.test.tsx` | `render` + `screen.getBy*` + `toBeOnTheScreen` |
