# Database

> **Module**: infrastructure/database
> **Tech**: Prisma ORM
> **Principle**: Safe migrations, type-safe queries

---

## Patterns

| Pattern | Purpose |
|---------|---------|
| `prisma.md` | Migrations, queries, seeds, production safety |

---

## TL;DR

**Safe commands**:
```bash
# Development
prisma migrate dev --name description  # Create migration
prisma db push                         # Quick schema sync (dev only)
prisma generate                        # Generate client

# Production
prisma migrate deploy                  # Apply migrations (safe)
```

**Dangerous commands** (NEVER in production):
```bash
prisma migrate reset        # Drops all data!
prisma db push --force-reset  # Drops all data!
```

---

## Migration Workflow

```
1. Edit schema.prisma
2. prisma migrate dev --name add_user_role
3. prisma generate
4. Test locally
5. Commit migration files
6. CI/CD runs: prisma migrate deploy
```

---

**Total**: 1 pattern
