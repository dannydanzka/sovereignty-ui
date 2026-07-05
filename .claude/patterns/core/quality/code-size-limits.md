# Code Size Limits Pattern

> **PURPOSE**: Strategies to manage file and function size for maintainability
> **ESLint Enforcement**: `custom/code-size-limits` (optional)
> **LIMITS**: Files 350 lines | Functions 50 lines | JSX 50 lines | Tests 600 lines
> **Updated**: 2026-02-05

---

## Why Code Size Matters

Large files and functions indicate:
- **Violation of Single Responsibility Principle** - doing too many things
- **Hard to test** - complex dependencies, many code paths
- **Hard to maintain** - high cognitive load, merge conflicts
- **Poor reusability** - logic coupled to specific context

---

## Recommended Limits

| File Type | Max Lines | Rationale |
|-----------|-----------|-----------|
| **Components** | 350 | UI + hooks + handlers should fit |
| **Use Cases** | 350 | Single operation with validation |
| **Services** | 350 | API methods grouped by domain |
| **Repositories** | 400 | CRUD + filters + transforms |
| **Hooks** | 200 | Orchestration only, no business logic |
| **Test Files** | 600 | More tests = more coverage |
| **Functions** | 50 | Single responsibility |
| **JSX Return** | 50 | Readable component tree |

---

## Strategy by File Type

### 1. Components (`.tsx`)

**Problem**: Component doing too much (UI + logic + state)

**Solution**: Extract to specialized files

```
ComponentName/
├── ComponentName.tsx           # UI only (max 50 lines JSX)
├── ComponentName.styled.ts     # Styles
├── ComponentName.hooks.ts      # Custom hooks (if complex logic)
├── ComponentName.helpers.ts    # Pure functions
├── ComponentName.constants.ts  # Constants
├── ComponentName.interfaces.ts # Types
└── index.ts                    # Barrel export
```

**Before** (too large):
```tsx
// 200+ lines component
export const UserProfile = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState();
  // ... 50 lines of hooks and state

  const handleSubmit = () => { /* 30 lines */ };
  const validateForm = () => { /* 20 lines */ };
  // ... more handlers

  return (
    <Container>
      {/* 100 lines of JSX */}
    </Container>
  );
};
```

**After** (split):
```tsx
// UserProfile.tsx - 30 lines
export const UserProfile = () => {
  const { user, loading, handlers } = useUserProfile();

  return (
    <Container>
      <UserHeader user={user} />
      <UserForm onSubmit={handlers.submit} />
      <UserActions {...handlers} />
    </Container>
  );
};

// useUserProfile.hooks.ts - handles all logic
// UserHeader.tsx, UserForm.tsx, UserActions.tsx - sub-components
```

---

### 2. Use Cases (`.use-case.ts`)

**Problem**: Use case handling multiple concerns

**Solution**: Split by operation or extract validation

**Before**:
```typescript
// create-user.use-case.ts - 400+ lines
export const executeCreateUser = async (request, authUser) => {
  // 100 lines of validation
  // 50 lines of permission checks
  // 100 lines of business logic
  // 50 lines of error handling
  // 100 lines of side effects
};
```

**After**:
```typescript
// create-user.use-case.ts - 150 lines (orchestration)
import { validateCreateUserRequest } from './create-user.validation';
import { checkUserPermissions } from './user-permissions.helper';

export const executeCreateUser = async (request, authUser) => {
  const validation = validateCreateUserRequest(request);
  if (!validation.success) return validation;

  const permissions = checkUserPermissions(authUser, 'create');
  if (!permissions.allowed) return permissions.error;

  // Core business logic only
  const user = await userRepository.create(request);
  return { success: true, data: user };
};

// create-user.validation.ts - Pure validation functions
// user-permissions.helper.ts - Permission checks
```

---

### 3. Redux Slices (`.slice.ts`)

**Problem**: Large slice with many reducers

**Solution**: Handler Map Pattern or split by sub-domain

**Before** (93 lines reducer):
```typescript
export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'users/list':
      return { ...state, loading: true };
    case 'users/listSuccess':
      return { ...state, loading: false, users: action.payload };
    // ... 40+ more cases
    default:
      return state;
  }
};
```

**After** - Handler Map (15 lines reducer):
```typescript
// user.handlers.ts
export const userHandlers = {
  list: (state) => ({ ...state, loading: true }),
  listSuccess: (state, payload) => ({ ...state, loading: false, users: payload.data }),
  // ... grouped by domain
};

// user.slice.ts - just mapping
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, userHandlers.list)
      .addCase(fetchUsers.fulfilled, userHandlers.listSuccess);
  },
});
```

---

### 4. Services (`.service.ts`)

**Problem**: Service with many endpoints

**Solution**: Split by resource or operation type

```
services/
└── user/
    ├── user.service.ts        # Re-exports all
    ├── user.crud.service.ts   # CRUD operations
    ├── user.admin.service.ts  # Admin-specific
    └── index.ts
```

---

### 5. Hooks (`.hooks.ts`)

**Problem**: Hook doing too much

**Solution**: Compose smaller hooks

**Before**:
```typescript
// useUserForm.ts - 150 lines
export const useUserForm = () => {
  // State management - 30 lines
  // Validation logic - 40 lines
  // API calls - 30 lines
  // Effects - 20 lines
  // Handlers - 30 lines
};
```

**After**:
```typescript
// useUserFormState.ts - state only
// useUserFormValidation.ts - validation only
// useUserFormApi.ts - API calls only

// useUserForm.ts - composition (30 lines)
export const useUserForm = () => {
  const state = useUserFormState();
  const validation = useUserFormValidation(state.formData);
  const api = useUserFormApi();

  return {
    ...state,
    ...validation,
    submit: () => api.save(state.formData),
  };
};
```

---

### 6. Test Files (`.test.ts`)

**Problem**: Test file too large (many test cases)

**Solution**:
1. Use higher limit for tests (600 lines)
2. Split by functionality if exceeds limit

```
__tests__/
└── user/
    ├── user.crud.test.ts        # CRUD tests
    ├── user.validation.test.ts  # Validation tests
    ├── user.edge-cases.test.ts  # Edge cases
    └── user.integration.test.ts
```

---

### 7. Helper/Utility Files (`.helpers.ts`)

**Problem**: Helper file with too many functions

**Solution**: Split by responsibility

**Before**:
```
utils/
└── helpers.ts  # 400 lines - TOO LARGE
```

**After**:
```
utils/
├── date.helpers.ts      # Date utilities
├── string.helpers.ts    # String utilities
├── validation.helpers.ts # Validation helpers
└── index.ts             # Barrel export
```

---

### 8. Styled Components (`.styled.ts`)

**Problem**: Too many styled components in one file

**Solution**: Group by component section

**Before**:
```typescript
// Component.styled.ts - 200+ lines
export const Container = styled.div`...`;
export const Header = styled.header`...`;
export const Title = styled.h1`...`;
// ... 30 more components
```

**After**:
```typescript
// Component.styled.ts - imports sub-modules
export * from './styled/layout.styled';
export * from './styled/header.styled';
export * from './styled/form.styled';

// Or keep common in main, split complex sections
```

---

## Quick Decision Tree

```
Is your file too large?
├── Component? → Extract hooks, helpers, sub-components
├── Use Case? → Extract validation, permissions, transforms
├── Slice? → Use Handler Map or split by sub-domain
├── Service? → Split by resource or operation
├── Hook? → Compose smaller hooks
├── Helper? → Split by responsibility (date, string, validation)
├── Styled? → Group by section or component
├── Test? → Check if limit is 600, else split by functionality
└── Constants? → Group by domain
```

---

## Refactoring Checklist

When a file exceeds limits:

1. **Identify concerns** - List all responsibilities
2. **Group by cohesion** - What changes together?
3. **Extract modules** - Create new files for each group
4. **Update imports** - Use barrel exports for clean API
5. **Verify tests** - Run tests after each extraction
6. **Document** - Update related documentation

---

## Anti-Patterns to Avoid

### ❌ Splitting Too Early

```typescript
// DON'T: One function per file
// utils/add.ts
export const add = (a, b) => a + b;

// utils/subtract.ts
export const subtract = (a, b) => a - b;
```

**Rule**: Split when file exceeds limit OR has distinct responsibilities.

### ❌ Over-Abstraction

```typescript
// DON'T: Abstracting for one use case
// userFormStateFactory.ts
export const createUserFormState = (config) => {
  // 100 lines of generic form state
};

// ONLY used in one place
```

**Rule**: 2+ usages before abstracting.

### ❌ God Files

```typescript
// DON'T: Everything in one file
// api.ts - ALL API calls for entire app
// utils.ts - ALL utilities for entire app
```

**Rule**: Split by domain/feature, not by type.

---

## ESLint Configuration (Optional)

If implementing automated enforcement:

```javascript
// eslint.config.js
{
  rules: {
    'custom/code-size-limits': ['warn', {
      maxFileLines: 350,
      maxFunctionLines: 50,
      maxJsxLines: 50,
      skipBlankLines: true,
      skipComments: true
    }]
  }
}

// Test file override
{
  files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
  rules: {
    'custom/code-size-limits': ['warn', {
      maxFileLines: 600,
      maxFunctionLines: 100,
      maxJsxLines: 100,
    }],
  },
}
```

---

## Benefits of Size Limits

1. **Readability** - Fits in one screen/mental model
2. **Testability** - Smaller units = easier to test
3. **Reusability** - Focused modules = more reuse opportunities
4. **Maintainability** - Clear boundaries = easier changes
5. **Code Review** - Smaller files = faster reviews
6. **Merge Conflicts** - Smaller files = fewer conflicts

---

## Related Documentation

- **Pattern**: `file-modularization.md` - File organization strategies
- **Pattern**: `component-structure.md` - 5-file component structure
- **Pattern**: `custom-hooks.md` - Hook composition patterns
- **Standard**: `.claude/patterns/core/FILE-STRUCTURE-STANDARDS.md`

---

**Remember**: Size limits are guidelines, not laws. Use judgment. A 360-line file that's cohesive is better than 4 poorly-organized 90-line files.
