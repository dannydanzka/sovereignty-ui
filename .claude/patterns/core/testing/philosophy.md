# Testing Essential Philosophy Pattern

**CRITICAL**: Value over coverage. Test what matters, skip what doesn't.
**FRAMEWORK**: Vitest 4.0+ (ESM-native, faster than Jest)
**Updated**: 2026-01-09

## Core Principles

1. **VALUE > COVERAGE**: Test critical paths, not every line
2. **Essential tests only**: Structural smoke tests + business logic + edge cases
3. **No constants testing**: Skip strings, routes, UI text
4. **Max file size**: 300-350 lines per test file
5. **Deterministic data**: Realistic, edge-case focused

## What to Test

### ✅ Always Test
- **Business logic validation**
- **User workflows** (happy path + edge cases)
- **Error handling scenarios**
- **State mutations** (Redux reducers/actions)
- **Integration points** (API → Service → Store)
- **Accessibility** (ARIA, keyboard navigation)
- **Critical UI interactions** (form submission, auth)

### ❌ Never Test
- **String constants** (`export const ERROR_MESSAGES = { }`)
- **UI text constants** (`export const UI_TEXT = { }`)
- **Route constants** (`export const ROUTES = { }`)
- **Configuration objects** (unless complex logic)
- **Type definitions** (TypeScript handles this)
- **Third-party library behavior** (trust the library)

## Test Structure

### Standard Pattern
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  const setup = () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const { container } = render(<LoginForm onSubmit={onSubmit} />);
    return { user, onSubmit, container };
  };

  it('submits form with valid credentials', async () => {
    const { user, onSubmit } = setup();

    await user.type(screen.getByLabelText(/email/i), 'maria@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'maria@example.com',
      password: 'password123'
    });
  });

  it('displays error for invalid email', async () => {
    const { user } = setup();

    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
  });
});
```

### Redux Testing Pattern
```typescript
import { renderWithProviders } from '@testing-support';
import { userSlice, executeLogin } from '@redux/slices/user';

describe('User Redux Slice', () => {
  it('handles login success', async () => {
    const { store } = renderWithProviders(<div />, {
      preloadedState: {
        user: { isAuthenticated: false, user: null }
      }
    });

    await store.dispatch(
      executeLogin({ email: 'maria@test.com', password: 'pass123' })
    );

    const state = store.getState().user;
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe('maria@test.com');
  });
});
```

## Mock Data Standards

### Realistic Test Data
```typescript
// ✅ CORRECT - Realistic, Spanish locale
export const mockUsers = [
  {
    id: '1',
    email: 'maria.garcia@example.com',
    name: 'María García López',
    role: 'admin' as const,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    email: 'jose.martinez@example.com',
    name: 'José Martínez Rodríguez',
    role: 'user' as const,
    createdAt: new Date('2024-02-20')
  }
];

// ❌ WRONG - English names, unrealistic
export const mockUsers = [
  { id: '1', email: 'john@test.com', name: 'John Doe' }
];
```

### Edge Cases
```typescript
export const mockEdgeCases = {
  emptyUser: {
    id: '',
    email: '',
    name: '',
    role: 'user' as const
  },
  nullUser: null,
  undefinedUser: undefined,
  userWithLongName: {
    id: '1',
    email: 'test@example.com',
    name: 'A'.repeat(255),
    role: 'user' as const
  }
};
```

## Test File Size Limits

### Limits
- **Production code**: 50 lines/function, 350 lines/file
- **Test files**: No function limit, 350 lines/file max
- **Mock files**: No limits (accuracy > size)

### When to Split
```typescript
// If test file > 350 lines, split by concern

// user.auth.test.tsx - Authentication tests
describe('User Authentication', () => { });

// user.profile.test.tsx - Profile tests
describe('User Profile', () => { });

// user.permissions.test.tsx - Permission tests
describe('User Permissions', () => { });
```

## Vitest Mock Hoisting

### Pattern
```typescript
// ✅ CORRECT - Mocks at top level (before imports)
vi.mock('@services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

import { render } from '@testing-library/react';
import { MyComponent } from './MyComponent';

// ❌ WRONG - Mock after imports
import { MyComponent } from './MyComponent';
vi.mock('@services/api'); // Hoisting issues
```

### Partial Mocks with importOriginal
```typescript
vi.mock('@helpers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@helpers')>();
  return {
    ...actual,
    validateAndGetUser: vi.fn(),
  };
});
```

## User Event Pattern

### Setup
```typescript
import userEvent from '@testing-library/user-event';

const setup = () => {
  const user = userEvent.setup(); // MUST be in setup
  render(<Component />);
  return { user };
};

it('handles click', async () => {
  const { user } = setup();
  await user.click(screen.getByRole('button'));
});
```

## Accessibility Testing

```typescript
import { axe, toHaveNoViolations } from 'vitest-axe';

expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<Form />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

it('supports keyboard navigation', async () => {
  const { user } = setup();

  await user.tab(); // Focus first element
  expect(screen.getByRole('textbox', { name: /email/i })).toHaveFocus();

  await user.tab(); // Focus next element
  expect(screen.getByRole('textbox', { name: /password/i })).toHaveFocus();
});
```

## Snapshot Testing (Use Sparingly)

```typescript
// ✅ CORRECT - Small, stable components
it('renders error message correctly', () => {
  const { container } = render(<ErrorMessage message="Error occurred" />);
  expect(container.firstChild).toMatchSnapshot();
});

// ❌ WRONG - Large, dynamic components
it('renders entire page', () => {
  const { container } = render(<HomePage />); // Too large
  expect(container).toMatchSnapshot(); // Brittle
});
```

## Coverage Guidelines

**Target**: 80% overall, 100% critical paths

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
});
```

## Quick Commands

```bash
# Run all tests
yarn test

# Watch mode
yarn test --watch

# Coverage report
yarn test --coverage

# Specific file
yarn test UserForm

# Update snapshots
yarn test -u
```

## Common Patterns

### API Mock
```typescript
vi.mock('@services/api', () => ({
  api: {
    post: vi.fn().mockResolvedValue({ data: mockUser })
  }
}));
```

### Redux Mock Store
```typescript
const mockStore = {
  user: { isAuthenticated: true, user: mockUser },
  events: { items: mockEvents }
};

renderWithProviders(<Component />, { preloadedState: mockStore });
```

### Async Testing
```typescript
it('loads data on mount', async () => {
  render(<UserList />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('María García')).toBeInTheDocument();
  });
});
```

## Validation Checklist

- [ ] All tests pass: `yarn test`
- [ ] Spanish test data (María, José, NOT John, Jane)
- [ ] No constants tests (strings, routes, UI text)
- [ ] Test file < 350 lines
- [ ] vi.mock() at top level
- [ ] user.* namespace for interactions
- [ ] Accessibility tested for critical components
- [ ] Coverage thresholds met (80%+)
- [ ] No snapshot tests for large components
- [ ] Essential tests only (value > coverage)

---

## See also

**Standards**:
- `.claude/patterns/core/TESTING-STANDARDS.md` - Essential testing theory

**Patterns**:
- `testing.md` - Testing patterns (Vitest)
- `.claude/patterns/testing-locale-patterns.md` - Spanish testing patterns (local)

---

**Lines**: ~200 | **Status**: ✅ Updated for Vitest 4.0 (2026-01-09)
