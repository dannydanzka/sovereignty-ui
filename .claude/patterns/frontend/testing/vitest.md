# Testing (Vitest)

> **Module**: frontend/testing
> **ESLint**: `custom/essential-testing`
> **Framework**: Vitest 4.0+ (ESM-native)

---

## TL;DR

**DO**:
- Essential tests only (value > coverage)
- `vi.mock()` after type imports, before project imports
- `vi.mocked()` for type-safe mocks
- Max 350 lines per test file
- Localized test data (match target audience)

**DON'T**:
- Test constants, interfaces, styled components
- 100% coverage goal (aim for essential)
- Test implementation details (test behavior)
- `jest.fn()` / `jest.mock()` (use `vi.*`)

---

## Why Vitest

- **Speed**: 2-3x faster than Jest (ESM-native)
- **TypeScript**: First-class support
- **API**: Same as Jest (easy migration)
- **Modern**: Built for Vite/Next.js ecosystem

---

## What to Test

| Test | Don't Test |
|------|------------|
| Business logic (use cases) | Constants/interfaces |
| User interactions | Styled components |
| API route behavior | Trivial getters |
| Error handling | Type definitions |
| Critical paths | Implementation details |

---

## Basic Pattern

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('UserCard', () => {
  it('displays user name', () => {
    render(<UserCard user={mockUser} />);
    expect(screen.getByText('María García')).toBeInTheDocument();
  });
});
```

---

## Mocking

```typescript
// ✅ Mock order: type imports → vi.mock → project imports
import type { UserService } from './user.service';

vi.mock('./user.service', () => ({
  userService: {
    getById: vi.fn(),
  },
}));

import { userService } from './user.service';

// Type-safe mock
const mockGetById = vi.mocked(userService.getById);
mockGetById.mockResolvedValue({ id: '1', name: 'Test' });
```

---

## Constructible Globals (IntersectionObserver, ResizeObserver)

Browser APIs invoked with `new` (used by `next/link`, virtualization libs, sticky headers) **must** be mocked as classes — `vi.fn().mockImplementation(arrow)` fails because the inner arrow is not a constructor. Symptom: `TypeError: ... is not a constructor`.

```typescript
// ❌ Breaks: next/link prefetch calls `new IntersectionObserver(cb)`
global.IntersectionObserver = vi
  .fn()
  .mockImplementation((cb) => ({ disconnect: vi.fn(), observe: vi.fn(), unobserve: vi.fn() }));

// ✅ Class form — supports `new`
class MockIntersectionObserver {
  callback: IntersectionObserverCallback;
  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => [] as IntersectionObserverEntry[]);
  unobserve = vi.fn();
  constructor(cb: IntersectionObserverCallback) {
    this.callback = cb;
  }
  trigger(entries: IntersectionObserverEntry[]) {
    this.callback(entries, this as unknown as IntersectionObserver);
  }
}
global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
```

Same shape for `ResizeObserver`, `MutationObserver`, `PerformanceObserver`.

---

## UI Library Mocks: Render All Slot Props

When mocking a component library (sovereignty-ui, MUI, etc.), the mock **must** render every slot prop the production component supports — `children`, `footer`, `header`, `actions`, etc. Dropping a slot makes its descendants invisible to RTL queries even though they exist in the JSX.

```typescript
// ❌ Footer dropped → tests can't find buttons placed in <Modal footer={...}>
Modal: ({ children, isOpen, title }: P) =>
  isOpen ? React.createElement('div', { role: 'dialog' }, children) : null;

// ✅ Render every slot
Modal: ({ children, footer, isOpen, title }: P) =>
  isOpen
    ? React.createElement(
        'div',
        { 'data-testid': 'modal', role: 'dialog' },
        title ? React.createElement('h2', null, title) : null,
        children,
        footer ? React.createElement('div', { 'data-testid': 'modal-footer' }, footer) : null
      )
    : null;
```

**Rule of thumb**: a global mock that hides a documented prop is a structural defect, not a parch. Audit the production component's prop surface before publishing the mock.

---

## Partial Mocks

```typescript
vi.mock('@helpers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@helpers')>();
  return {
    ...actual,
    specificFunction: vi.fn(),
  };
});
```

---

## Testing Use Cases

```typescript
describe('executeCreateUser', () => {
  it('returns success with valid data', async () => {
    const result = await executeCreateUser(validData, mockRepo);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('test@example.com');
    }
  });

  it('returns error for invalid email', async () => {
    const result = await executeCreateUser(invalidData, mockRepo);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('email');
    }
  });
});
```

---

## Testing Components with Redux

```typescript
import { renderWithProviders } from '@testing';

it('loads users on mount', async () => {
  renderWithProviders(<UserList />, {
    preloadedState: {
      users: { items: [], loading: false },
    },
  });

  expect(screen.getByRole('list')).toBeInTheDocument();
});
```

---

## Config Reference

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    clearMocks: true,
    restoreMocks: true,
  },
});
```

---

## Related

- `core/testing/philosophy.md` - Testing philosophy
- `core/testing/mocking.md` - Mock-first strategy
- `frontend/testing/rtl.md` - React Testing Library
