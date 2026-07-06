# Jest Testing Patterns

> **Framework**: Jest 29.x + React Testing Library
> **Used by**: Lerna monorepo projects
> **Sovereignty principle**: Testing as epistemology — the system knows it remains coherent
> **Enforced by**: `essential-testing` ESLint rule

---

## Philosophy

Same as [Vitest](vitest.md) — value over coverage, behavior over implementation.

See `core/testing/philosophy.md` for cross-discipline testing principles.

---

## Structure

```
__tests__/
├── ComponentName.test.tsx
├── useHookName.test.ts
├── serviceFunction.test.ts
└── helpers/
    └── renderWithProviders.tsx
```

---

## Patterns

### Component Testing

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from '../ComponentName';

describe('ComponentName', () => {
  it('should render initial state correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<ComponentName onSubmit={mockFn} />);

    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(mockFn).toHaveBeenCalledWith(expectedArgs);
  });
});
```

### Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useHookName } from '../useHookName';

describe('useHookName', () => {
  it('should return initial state', () => {
    const { result } = renderHook(() => useHookName());
    expect(result.current.value).toBe(initialValue);
  });
});
```

### Redux + Saga Testing

```typescript
// Saga testing with redux-saga-test-plan
import { expectSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga-test-plan/matchers';
import { sagaName } from '../sagas';
import { serviceFunction } from '../services';

describe('sagaName', () => {
  it('should call service and dispatch success', () => {
    return expectSaga(sagaName, action)
      .provide([[call(serviceFunction, params), mockResponse]])
      .put(successAction(mockResponse))
      .run();
  });
});
```

### Test Utilities — renderWithProviders

```typescript
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from './testStore';

export const renderWithProviders = (
  ui: React.ReactElement,
  { preloadedState, ...options } = {}
) => {
  const store = configureStore({ preloadedState });
  return {
    ...render(<Provider store={store}>{ui}</Provider>, options),
    store,
  };
};
```

---

## Configuration

### jest.config.js (monorepo)

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterSetup: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // Mirror webpack aliases
    '^@components/(.*)$': '<rootDir>/src/common/components/$1',
    '^@hooks/(.*)$': '<rootDir>/src/common/hooks/$1',
    '^@helpers/(.*)$': '<rootDir>/src/common/helpers/$1',
    '^@state/(.*)$': '<rootDir>/src/state/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.styled.{ts,tsx}',
    '!src/**/index.{ts,tsx}',
  ],
};
```

---

## Rules

| Rule | Value |
|------|-------|
| File size limits (test files) | 600 lines / 100 per function / 100 JSX |
| Props spreading | Allowed in tests |
| `any` type | Allowed in tests |
| Display name | Relaxed in tests |

---

## Related

- `core/testing/philosophy.md` — Value over coverage
- `core/testing/mocking.md` — Mock strategy
- `frontend/testing/vitest.md` — Vitest patterns (Next.js projects)
