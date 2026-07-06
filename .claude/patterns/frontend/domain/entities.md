# Domain Entities

> **Module**: frontend/domain
> **Layer**: Pure business logic (NO IO, NO frameworks)

---

## TL;DR

**DO**:
- Discriminated unions: `{ success: true, data: T } | { success: false, error: string }`
- Single source of truth (ONE entity definition)
- Pure functions (input → output, NO side effects)
- Pick/Omit for context-specific views
- Nullable fields: `string | null` (NOT undefined)

**DON'T**:
- IO operations (database, HTTP, file system)
- Framework dependencies (Next.js, React, Redux)
- Duplicate entities across contexts
- 'any' types

---

## Why Domain Layer

- **Pure business logic**: No external dependencies
- **Testability**: Pure functions, easy to test
- **Reusability**: Same entities across contexts
- **Type safety**: Compiler catches mismatches

---

## Why Discriminated Unions

```typescript
type Response<T> =
  | { success: true; data: T; status: number }
  | { success: false; error: string; status: number };

// TypeScript narrows automatically
const result = await createUser(data);
if (result.success) {
  console.log(result.data);  // T
} else {
  console.log(result.error); // string
}
```

**Benefits**: Errors as values (not exceptions), forced handling, better DX.

---

## Entity Interface Pattern

```typescript
export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;

  firstName: string;
  lastName: string;

  // Address (nullable)
  street: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;

  role: UserRole;

  // Soft delete
  isActive: boolean;
  deletedAt: Date | null;
  deletedBy: string | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
```

**Key patterns**:
- Matches Prisma schema exactly
- `null` for optional fields (NOT undefined)
- Soft delete (isActive, deletedAt)

---

## Pure Domain Functions

```typescript
export const getUserFullName = (user: UserEntity): string => {
  return `${user.firstName} ${user.lastName}`.trim();
};

export const hasCompleteAddress = (user: UserEntity): boolean => {
  return Boolean(user.street && user.city && user.state && user.zipCode);
};

export const canPerformAdminAction = (user: UserEntity): boolean => {
  return user.role === 'owner' || user.role === 'admin';
};
```

**Rules**: Pure functions, NO IO, NO side effects.

---

## Request/Response Types

```typescript
// Request = Repository input (data only)
export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
}

// Params = Use Case input (includes NextRequest)
export interface CreateUserParams {
  request: NextRequest;
  email: string;
  firstName: string;
  // ...
}

// Update = Partial fields
export interface UpdateUserRequest {
  id: string;
  email?: string;
  firstName?: string;
  // ...
}
```

---

## Pick/Omit Pattern

```typescript
// Public API (hide sensitive)
type PublicUser = Omit<UserEntity, 'passwordHash' | 'deletedAt'>;

// Summary for lists
type UserSummary = Pick<UserEntity, 'id' | 'email' | 'firstName' | 'lastName'>;

// Create data
type CreateUserData = Pick<UserEntity, 'email' | 'firstName' | 'lastName' | 'passwordHash'>;
```

---

## File Structure

```
src/libs/domain/
├── types/              # Primitives, enums
│   └── common.ts       # UserRole, etc.
├── interfaces/         # Entity shapes, contracts
│   └── user/
│       └── user.interfaces.ts
└── entities/           # Pure business functions
    └── user.entity.ts
```

---

## Layer Responsibilities

| Layer | CAN DO | CANNOT DO |
|-------|--------|-----------|
| Domain | Types, pure functions | IO, frameworks |
| Infrastructure | Repos, services, state | Business logic |
| Presentation | Components, hooks | Business logic |

---

## Related

- `frontend/domain/use-cases.md` - Use Case patterns
- `frontend/infrastructure/repositories.md` - Repository patterns

