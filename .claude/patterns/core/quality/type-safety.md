# Type Safety

> **Module**: core/quality
> **Scope**: TypeScript strict mode, zero 'any' tolerance

---

## TL;DR

**DO**:
- `unknown` for untyped data (with type guards)
- Discriminated unions for results
- Centralized types (single source of truth)
- `as const` for literal constants

**DON'T**:
- `any` in production (ZERO TOLERANCE)
- Type assertions without validation
- Duplicate type definitions
- `@ts-ignore` (use `@ts-expect-error` if needed)

---

## Why No 'any'

```typescript
// ❌ 'any' defeats TypeScript
const data: any = fetchData();
data.foo.bar.baz(); // No error, crashes at runtime

// ✅ 'unknown' forces validation
const data: unknown = fetchData();
if (isUser(data)) {
  data.name; // Safe, TypeScript knows it's User
}
```

**'any' problems**:
- No type checking
- No IntelliSense
- Cascades to other code
- Runtime errors

---

## Discriminated Unions

```typescript
// ✅ Type-safe result handling
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

const result = await createUser(data);

if (result.success) {
  console.log(result.data); // TypeScript knows: T
} else {
  console.log(result.error); // TypeScript knows: string
}
```

**Benefits**:
- Auto-narrowing in branches
- Exhaustiveness checking
- Errors as values (not exceptions)

---

## Type Guards

```typescript
// ✅ Safe narrowing with type guard
const isUser = (data: unknown): data is User => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'email' in data
  );
};

// Usage
if (isUser(response)) {
  response.email; // Safe
}
```

---

## Centralized Types

```typescript
// ✅ Single source of truth
// @domain-types/common.types.ts
export type User = {
  id: string;
  email: string;
  role: UserRole;
};

// Import everywhere
import type { User } from '@domain-types';
```

**Before creating types**:
1. Search existing: `grep -r "type TypeName"`
2. Check centralized location
3. Import if found, create if not

---

## as const

```typescript
// ✅ Literal types, not widened
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

type Role = typeof ROLES[keyof typeof ROLES]; // 'admin' | 'user'

// ❌ Without as const
const ROLES = { ADMIN: 'admin' }; // type: { ADMIN: string }
```

---

## Exception: Tests

`any` allowed **only** in test files for mocking:

```typescript
// ✅ Allowed in .test.ts
vi.fn() as any
mockData as any

// ESLint: @typescript-eslint/no-explicit-any disabled for tests
```

---

## Related

- `core/quality/error-handling.md` - Error types
- `frontend/domain/entities.md` - Domain types
