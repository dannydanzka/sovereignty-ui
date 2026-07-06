# Prisma (Database)

> **Module**: frontend/infrastructure/database
> **Stack**: Prisma 7 + PostgreSQL + Supabase

---

## TL;DR

**DO**:
- cuid() IDs: `@id @default(cuid())`
- Index ALL foreign keys: `@@index([userId])`
- Soft delete: `isActive`, `deletedAt`, `deletedBy`
- Timestamps: `createdAt`, `updatedAt` mandatory
- Two URLs: DATABASE_URL (pooler:6543), DIRECT_URL (direct:5432)
- Spanish seed data

**DON'T**:
- Auto-increment IDs
- Hard deletes
- Single URL for queries + migrations
- bcrypt (use bcryptjs)

---

## Why cuid()

- **Universally unique**: No collisions
- **Sortable**: Lexicographic by creation time
- **URL-safe**: No special characters
- **Distributed**: Works across systems

---

## Why Soft Delete

```prisma
model User {
  isActive  Boolean   @default(true)
  deletedAt DateTime?
  deletedBy String?
}
```

**Benefits**: Audit trail, recovery, FK integrity, compliance.

---

## Why Two URLs

| URL | Port | For |
|-----|------|-----|
| DATABASE_URL (pooler) | 6543 | App queries |
| DIRECT_URL (direct) | 5432 | Migrations |

**Poolers don't support DDL**. Migrations need direct connection.

```bash
# Migration commands use DIRECT_URL
DATABASE_URL="$DIRECT_URL" npx prisma migrate deploy
```

---

## Schema Pattern

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  firstName String
  lastName  String

  // Soft delete
  isActive  Boolean   @default(true)
  deletedAt DateTime?
  deletedBy String?

  // Timestamps
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  // Relations
  enrollments Enrollment[]

  @@index([email])
  @@map("users")
}
```

---

## Relations

```prisma
model Enrollment {
  eventId String
  userId  String

  // Cascade for owned entities
  event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)
  // Restrict for reference data
  user  User  @relation(fields: [userId], references: [id], onDelete: Restrict)

  @@unique([eventId, userId])
  @@index([eventId])
  @@index([userId])
}
```

---

## Migration Commands

```bash
# Create migration
npx prisma migrate dev --name add_field_x

# Apply migrations (production)
npx prisma migrate deploy

# Generate client
npx prisma generate

# Check status
npx prisma migrate status

# Resolve drift
npx prisma migrate resolve --applied MIGRATION_NAME
```

---

## Adding Fields

```prisma
// SAFE: Optional field
phone String?

// Requires strategy: Required field
status String @default("active")  // Add with default
```

---

## Prisma 7 Config

```typescript
// prisma/prisma.config.ts
import path from 'node:path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, 'schema.prisma'),
  datasource: {
    url: process.env['DATABASE_URL'] ?? '',
  },
  migrate: {
    url: process.env['DATABASE_URL'] ?? '',
    shadowDatabaseUrl: process.env['DIRECT_URL'] ?? '',
  },
});
```

---

## Seed Pattern

```typescript
// Idempotent with upsert
const kit = await prisma.kit.upsert({
  where: { id: 'kit_basico' },
  update: { price: 650 },
  create: {
    id: 'kit_basico',
    name: 'Kit Básico',
    price: 650,
  },
});
```

---

## File Structure

```
prisma/
├── prisma.config.ts    # Prisma 7 config
├── schema.prisma       # Models, enums, relations
├── seed.ts             # Seed script (Spanish data)
└── migrations/         # Migration history
```

---

## Related

- `frontend/infrastructure/repositories.md` - Repository patterns
- `core/testing/mocking.md` - Mock-first strategy

