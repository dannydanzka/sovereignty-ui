# TypeScript Strict Standards Pattern

**CRITICAL**: Zero tolerance for `any`, strict typing, type centralization.

## Core Rules

1. **NEVER use `any`** (except in tests for mocking)
2. **Use `unknown`** when type is truly unknown + type guards
3. **Define types from the beginning** - No incremental typing
4. **Zero TypeScript errors** before completion

## Type Safety Patterns

### Unknown with Type Guards
```typescript
// ✅ CORRECT
const processData = (data: unknown): User => {
  if (!isValidUser(data)) {
    throw new Error('Invalid user data');
  }
  return data as User;
};

const isValidUser = (data: unknown): data is User => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'email' in data
  );
};

// ❌ WRONG
const processData = (data: any) => {
  return data; // No type safety
};
```

### Discriminated Unions
```typescript
// ✅ CORRECT - Type-safe success/error pattern
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: AppError };

export const executeGetUser = async (
  id: string
): Promise<Result<User>> => {
  try {
    const user = await userRepository.findById(id);
    return { success: true, data: user };
  } catch (error) {
    return {
      success: false,
      error: handleUseCaseError(error, 'executeGetUser')
    };
  }
};

// Usage with type narrowing
const result = await executeGetUser(id);
if (result.success) {
  console.log(result.data.email); // Type: User
} else {
  console.error(result.error.message); // Type: AppError
}
```

### Generic Arrow Functions
```typescript
// ✅ CORRECT - Use extends to avoid comma conflict
export const createResponse = <T extends Record<string, unknown>>(
  data: T
) => {
  return { success: true, data };
};

// ❌ WRONG - Bare generic with comma
export const createResponse = <T,>(data: T) => { };
```

### Type-Only Imports
```typescript
// ✅ CORRECT
import type { User } from '@types';
import type { Metadata } from 'next';

// Only imports the type, removed at compile time
// Helps bundler optimize

// ❌ WRONG
import { User } from '@types'; // Imports as value
```

## Type Centralization

### Single Source of Truth
```typescript
// src/libs/domain/types/common/common.types.ts
export type UserRole = 'admin' | 'organizer' | 'manager' | 'super_admin';

export type EntityStatus = 'active' | 'inactive' | 'archived';

export type SortOrder = 'asc' | 'desc';

// All files import from here - NEVER duplicate
```

### Type Investigation Protocol
Before creating a new type:
1. **Search existing**: `grep -r "type UserRole" src/`
2. **Check centralized**: Look in `@types`, `@domain-types`
3. **Check constants**: Types often mirror constants
4. **Avoid duplication**: Import or elevate to shared types

### Centralized Import Pattern
```typescript
// ✅ CORRECT
import type { UserRole, EntityStatus } from '@domain-types';

// ❌ WRONG - Local duplicate
type UserRole = 'admin' | 'user'; // Duplicate definition
```

## Dot vs Bracket Notation

### Rule: Based on Type Definition

```typescript
// Specific interface - Use DOT notation
interface User {
  id: string;
  email: string;
}

const user: User = getUser();
console.log(user.email); // ✅ CORRECT

// Record type - Use BRACKET notation
const getEnvVar = (key: string): string => {
  const value = process.env[key]; // ✅ CORRECT
  if (!value) throw new Error(`Missing: ${key}`);
  return value;
};

// ❌ WRONG - dot notation on Record
const value = process.env.DATABASE_URL; // eslint error
```

### ESLint Rule
```json
{
  "rules": {
    "@typescript-eslint/dot-notation": ["error", {
      "allowIndexSignaturePropertyAccess": true
    }]
  }
}
```

## Interface vs Type

### When to Use Each

```typescript
// ✅ Interfaces - For object shapes, can be extended
export interface UserRepository {
  findById: (id: string) => Promise<User>;
  create: (data: CreateUserData) => Promise<User>;
}

// ✅ Types - For unions, intersections, primitives
export type UserRole = 'admin' | 'user';
export type Result<T> = Success<T> | Failure;

// Composition
export type AdminUser = User & { role: 'admin' };
```

### Separation Rule
```typescript
// ❌ WRONG - Interface in implementation file
// UserRepository.ts
export interface UserRepository { }
export const userRepository: UserRepository = { };

// ✅ CORRECT - Interface in .interfaces.ts
// UserRepository.interfaces.ts
export interface UserRepository { }

// UserRepository.ts
import type { UserRepository } from './UserRepository.interfaces';
export const userRepository: UserRepository = { };
```

## Strict Null Checks

```typescript
// ✅ CORRECT - Handle nullable explicitly
const getUserEmail = (user: User | null): string => {
  if (!user) return 'N/A';
  return user.email;
};

// With optional chaining
const email = user?.email ?? 'default@example.com';

// ❌ WRONG - Unsafe access
const email = user.email; // Error if user is null
```

## Type Guards

```typescript
// Custom type guard
export const isUser = (data: unknown): data is User => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    typeof (data as User).id === 'string'
  );
};

// Usage
const processData = (data: unknown) => {
  if (isUser(data)) {
    console.log(data.id); // Type narrowed to User
  }
};
```

## Utility Types

```typescript
// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties required
type RequiredUser = Required<User>;

// Pick specific properties
type UserCredentials = Pick<User, 'email' | 'password'>;

// Omit specific properties
type UserWithoutPassword = Omit<User, 'password'>;

// Make properties readonly
type ImmutableUser = Readonly<User>;
```

## Validation Checklist

```bash
# Zero TypeScript errors
yarn type-check

# Should return: "Found 0 errors"

# Check for 'any' usage (should be empty except tests)
grep -r ": any" src/ --exclude="*.test.ts*"

# Check for type assertions (use sparingly)
grep -r "as any" src/

# Verify type imports
grep -r "import type" src/
```

## Common Patterns

### API Response Types
```typescript
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string; code: string } };
```

### Async Function Types
```typescript
export type AsyncFunction<T, P = void> = (
  params: P
) => Promise<Result<T>>;
```

### Repository Interface
```typescript
export interface Repository<T, CreateData = Partial<T>> {
  findById: (id: string) => Promise<T | null>;
  findAll: () => Promise<T[]>;
  create: (data: CreateData) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<void>;
}
```

## Zero Tolerance Violations

- ❌ Using `any` (except test mocks)
- ❌ Type assertions without validation
- ❌ Duplicate type definitions
- ❌ Missing return types on exported functions
- ❌ Implicit `any` from missing types
- ❌ Non-null assertions (`!`) without guards

---

## See also

**Standards**:
- `docs/development-standards/TYPE-SAFETY-STANDARDS.md` - Type safety theory, zero 'any' tolerance
- `docs/development-standards/TYPESCRIPT-ERROR-SUPPRESSION-STANDARDS.md` - @ts-expect-error policy

**Patterns**:
- `typescript-components.md` - Component typing patterns
- `typescript-verification-protocol.md` - TypeScript debugging

---

**Lines**: 304 | **Status**: ✅ Verified (strict TypeScript patterns)
