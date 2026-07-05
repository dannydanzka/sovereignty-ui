# Mock-First Development

> **Module**: core/testing
> **Strategy**: Mocks → Validation → Prisma

---

## TL;DR

**DO**:
- Start with mocks (fast iteration)
- `simulateNetworkDelay()` in ALL mock methods
- `TODO: MIGRATE TO PRISMA` with exact Prisma code
- Spanish mock data (María García, José López)
- Soft delete pattern (deletedAt)

**DON'T**:
- Prisma-first for new features
- Skip simulateNetworkDelay()
- English mock data
- Hard delete (remove from array)

---

## Why Mock-First

**Faster iteration**:
- No database setup delays
- No migration headaches
- Instant yarn dev startup
- Focus on business logic

**Perfect interfaces**:
- Refine contracts FIRST
- Iterate on data shapes quickly
- Business logic drives data model

**Complete testing**:
- Predictable mock data
- Fast test execution
- Spanish locale from day one

---

## When to Migrate to Prisma

**ONLY after**:
- All use cases implemented
- Data flows validated end-to-end
- All tests passing
- Business logic proven
- UI/UX finalized

**Migration = ONE-time operation** (NOT iterative)

---

## Mock Repository Pattern

```typescript
import { simulateNetworkDelay } from '@helpers';
import { mockEventData } from '@mocks';

export const eventRepository: EventRepository = {
  findAll: async (): Promise<EventEntity[]> => {
    await simulateNetworkDelay();

    // TODO: MIGRATE TO PRISMA
    // return await prisma.event.findMany({ where: { deletedAt: null } });

    return mockEventData.filter(event => !event.deletedAt);
  },

  findById: async (id: string): Promise<EventEntity | null> => {
    await simulateNetworkDelay();

    // TODO: MIGRATE TO PRISMA
    // return await prisma.event.findUnique({ where: { id } });

    return mockEventData.find(e => e.id === id && !e.deletedAt) || null;
  },

  create: async (data): Promise<EventEntity> => {
    await simulateNetworkDelay();

    // TODO: MIGRATE TO PRISMA
    // return await prisma.event.create({ data });

    const newEvent = {
      id: `event-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    mockEventData.push(newEvent);
    return newEvent;
  },

  delete: async (id: string): Promise<void> => {
    await simulateNetworkDelay();

    // TODO: MIGRATE TO PRISMA (soft delete)
    // await prisma.event.update({ where: { id }, data: { deletedAt: new Date() } });

    const index = mockEventData.findIndex(e => e.id === id);
    if (index !== -1) {
      mockEventData[index].deletedAt = new Date();
    }
  },
};
```

---

## Mock Data Pattern

```typescript
export const mockEventData: EventEntity[] = [
  {
    id: 'event-001',
    name: 'Rally Example 2025',
    slug: 'rally-example-2025',
    description: 'Evento de bienestar y resiliencia',
    status: 'active',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
    deletedAt: null,
  },
  {
    id: 'event-002',
    name: 'Wellness Experience 2025',
    status: 'draft',
    // ...
  },
];
```

**Requirements**:
- Spanish names and text
- Realistic data structures
- Multiple scenarios (active, draft, deleted)
- Dates as Date objects

---

## simulateNetworkDelay

```typescript
export const simulateNetworkDelay = async (ms = 100): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
```

**Why**: Mimics latency, tests loading states, catches async bugs.

---

## Migration Path

1. **Define Prisma schema**
2. **Generate client**: `yarn db:generate`
3. **Update repository** (one method at a time)
4. **Test incrementally**
5. **Remove mocks** when ALL methods migrated

```typescript
// After migration
export const eventRepository: EventRepository = {
  findAll: async () => {
    // ✅ MIGRATED TO PRISMA
    const events = await prisma.event.findMany({
      where: { deletedAt: null },
    });
    return events.map(transformPrismaToEntity);
  },
};
```

---

## Decision Criteria

| Use Mocks | Migrate to Prisma |
|-----------|-------------------|
| New feature | Data structure stable (2+ weeks) |
| Prototyping | Business logic validated |
| Fast iteration | All tests passing |
| No DB yet | Ready for production |

---

## Related

- `frontend/infrastructure/repositories.md` - Repository patterns
- `frontend/infrastructure/database/prisma.md` - Prisma config

