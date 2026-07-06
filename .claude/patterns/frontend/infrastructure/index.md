# Infrastructure Layer

> **Layer**: Infrastructure (outer)
> **Dependencies**: Domain interfaces
> **Principle**: Non-Intervention - implements domain contracts

---

## Structure

```
infrastructure/
├── index.md
├── repositories.md      # Data access implementation
├── services.md          # HTTP, external services
├── helpers.md           # Infrastructure helpers
├── state/               # State management
│   ├── index.md
│   ├── redux.md
│   ├── slices.md
│   └── selectors.md
├── database/
│   ├── index.md
│   └── prisma.md
└── payments/
    ├── index.md
    └── stripe.md        # Stripe Checkout integration
```

---

## Patterns

| Pattern | Purpose |
|---------|---------|
| `repositories.md` | Implement domain repository interfaces |
| `services.md` | HTTP calls, handleRequest wrapper |
| `state/redux.md` | Store configuration, thunks |
| `state/slices.md` | Slice structure, reducers |
| `state/selectors.md` | Memoized selectors |
| `database/prisma.md` | Migrations, queries, seeds |
| `payments/stripe.md` | Stripe Checkout Sessions integration |

---

## TL;DR

**Infrastructure = Implements domain interfaces with real technology.**

```typescript
// Domain defines the contract
interface UserRepository {
  findById(id: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
}

// Infrastructure implements it
export const userRepository: UserRepository = {
  findById: async (id) => {
    return prisma.user.findUnique({ where: { id } });
  },
  create: async (data) => {
    return prisma.user.create({ data });
  },
};
```

---

## Layer Rules

1. **Implements interfaces** - From domain layer
2. **Handles IO** - Database, HTTP, storage
3. **No business logic** - Delegate to use cases
4. **Replaceable** - Can swap Prisma for another ORM

---

## When to Consult

- Data access patterns → `repositories.md`
- HTTP calls → `services.md`
- Redux store → `state/redux.md`
- Creating slice → `state/slices.md`
- Database operations → `database/prisma.md`
- Payment processing → `payments/stripe.md`

---

**Sovereignty**: Infrastructure serves domain, never invades it.
