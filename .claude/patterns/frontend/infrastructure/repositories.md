# Repositories

> **Module**: frontend/infrastructure
> **Pattern**: Object literal + Prisma → Domain transform

---

## TL;DR

**DO**:
- Object literal: `export const repo = { method: async () => {} }`
- Arrow functions for ALL methods
- Transform Prisma → Domain entities
- Soft delete (isActive, deletedAt, deletedBy)
- Return domain entities (NOT Prisma models)

**DON'T**:
- Classes or constructors
- Business logic (Use Cases only)
- Return Prisma models directly
- Hard delete (forbidden)

---

## Repository Responsibility

| CAN DO | CANNOT DO |
|--------|-----------|
| Database queries | Business logic |
| Transform Prisma → Domain | Validation |
| CRUD operations | Authorization |
| Filtering, pagination | HTTP transport |

---

## Transform Function

```typescript
// Private, not exported
const transformPrismaToEntity = (user: PrismaUser): UserEntity => ({
  id: user.id,
  email: user.email,
  role: mapRoleFromPrisma(user.role),  // Enum conversion
  firstName: user.firstName,
  lastName: user.lastName,
  isActive: user.isActive,
  createdAt: user.createdAt,
  // ...all fields
});
```

**Why**: Decouples domain from database schema.

---

## Basic Repository

```typescript
import { prisma } from '@database';

export const userRepository: UserRepository = {
  findById: async (id: string): Promise<UserEntity | null> => {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user || user.deletedAt) return null;

    return transformPrismaToEntity(user);
  },

  findByEmail: async (email: string): Promise<UserEntity | null> => {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || user.deletedAt) return null;

    return transformPrismaToEntity(user);
  },

  create: async (data: CreateUserRequest): Promise<UserEntity> => {
    const newUser = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        firstName: data.firstName,
        lastName: data.lastName,
        passwordHash: data.password,
        role: mapRoleToPrisma(data.role),
        isActive: data.isActive ?? true,
      },
    });

    return transformPrismaToEntity(newUser);
  },
};
```

---

## Dynamic Filtering

```typescript
findMany: async (filters: Filters, pagination: Pagination) => {
  const where: Record<string, unknown> = {
    deletedAt: null,  // Always exclude soft-deleted
  };

  if (filters.role) {
    where['role'] = mapRoleToPrisma(filters.role);
  }
  if (filters.isActive !== undefined) {
    where['isActive'] = filters.isActive;
  }
  if (filters.searchTerm) {
    where['OR'] = [
      { firstName: { contains: filters.searchTerm, mode: 'insensitive' } },
      { email: { contains: filters.searchTerm, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users: users.map(transformPrismaToEntity),
    pagination: { ...pagination, total, totalPages: Math.ceil(total / pagination.limit) },
  };
}
```

---

## Soft Delete

```typescript
// Delete (soft)
delete: async (id: string): Promise<void> => {
  await prisma.user.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
  });
}

// Reactivate
reactivate: async (id: string): Promise<UserEntity> => {
  const user = await prisma.user.update({
    where: { id },
    data: {
      deletedAt: null,
      isActive: true,
    },
  });
  return transformPrismaToEntity(user);
}
```

**Why Soft Delete**:
- Audit trail
- Can reactivate
- FK integrity preserved

---

## File Structure

```
repositories/admin/user-management/
├── user.repository.ts
└── index.ts
```

```typescript
// index.ts
export * from './user.repository';
```

---

## Why Object Literal

- No `new` keyword
- No `this` binding issues
- Tree-shaking friendly
- Easy to mock in tests

---

## Related

- `frontend/domain/use-cases.md` - Use Case patterns
- `frontend/infrastructure/database/prisma.md` - Prisma config

