# Domain Layer

> **Layer**: Domain (innermost)
> **Dependencies**: NONE (pure, isolated)
> **Principle**: Territorial Integrity - owns business logic exclusively

---

## Patterns

| Pattern | Purpose |
|---------|---------|
| `entities.md` | Domain models, value objects |
| `use-cases.md` | Business logic orchestration |
| `interfaces.md` | Contracts (ports) for infrastructure |

---

## TL;DR

**Domain = Pure business logic, ZERO external dependencies.**

```typescript
// ✅ Domain entity - no framework imports
interface User {
  id: string;
  email: string;
  role: UserRole;
}

// ✅ Use case - depends on interfaces, not implementations
const executeCreateUser = async (
  request: CreateUserRequest,
  repository: UserRepository  // Interface, not implementation
): Promise<User> => {
  // Pure business logic
};

// ❌ NEVER in domain
import { prisma } from './database';  // Infrastructure leak!
import { useSelector } from 'react-redux';  // Presentation leak!
```

---

## Layer Rules

1. **No framework imports** - No React, Redux, Prisma, Next.js
2. **No IO operations** - No HTTP, database, file system
3. **Interfaces only** - Define contracts, don't implement
4. **Pure functions** - Same input = same output

---

## When to Consult

- Creating business entity → `entities.md`
- Implementing business logic → `use-cases.md`
- Defining repository contract → `interfaces.md`

---

**Sovereignty**: Domain is the most sovereign layer. No invasions allowed.
