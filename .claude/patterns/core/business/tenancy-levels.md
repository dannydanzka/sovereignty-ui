# Tenancy Levels — Migration-Driven Multi-Tenancy

> **Status**: 🚧 Stub — patterns extracted from Controla MVP. Full content lands after validating each migration in production.
> **Layer**: WHAT (business architecture)

---

## Context

Multi-tenant SaaS architectures aren't a single decision — they're a **progression** that scales with customer count, query load, and compliance pressure. Building L3 (DB-per-tenant) on day 1 burns 6 months of complexity before you have product-market fit. Skipping past L1 leaves landmines that detonate at the worst time (a noisy neighbor, a leaked query, a compliance audit).

This pattern documents the three levels, their boundaries, and the **concrete signals** that say "time to migrate."

---

## The Three Levels

### Level 1 — Shared DB + `tenantId` column

**Model**: One Postgres database. Every tenant-scoped table has a `tenantId` column. Every query filters by it (enforced via repository base class).

**When you're here**: 1-15 tenants, <500 total active users. Building MVPs and early growth.

**Pros**: Cheapest to operate. Single migration runs against all tenants. Easy backup, easy reasoning.

**Cons**: Application-level isolation only. A bug that forgets `WHERE tenantId` leaks data across tenants. No physical isolation.

**SOPs required**:
1. `TenantScopedRepository` base class auto-injects `WHERE tenantId`
2. Composite indexes lead with `tenantId` (e.g., `(tenantId, createdAt)`)
3. Cross-tenant tests in CI: seed two tenants, assert zero leak
4. Logger and metrics tag every line with `tenantId`
5. Audit log of all writes, cross-checked vs session tenant

### Level 2 — Shared DB + Postgres RLS

**Model**: Same database, but Postgres Row Level Security (RLS) policies enforce isolation at the DB layer. Application sets `SET LOCAL app.tenant_id = '...'` per request.

**When you're here**: 15-50 tenants, ~5K users.

**Pros**: Real isolation — even a buggy query can't leak. Compliance-friendly. Still single-DB operations.

**Cons**: RLS policies need maintenance per table. Some Prisma/ORM patterns require workarounds. Performance overhead is small but real.

**SOPs required**: RLS policy template per new table, automated tests verifying RLS is enabled, role separation (admin vs tenant connections).

### Level 3 — Database per tenant

**Model**: Each tenant gets its own Postgres database (or schema). Application routes connections at request-time.

**When you're here**: 50+ tenants, enterprise contracts demanding isolation.

**Pros**: Maximum isolation. Per-tenant backups, restores, scaling. Compliance gold standard.

**Cons**: Operational explosion (50 DBs to migrate, monitor, backup). Cross-tenant queries impossible. Onboarding requires DB provisioning.

---

## Migration Signals

### L1 → L2

Migrate when ANY of:

| Signal | Threshold |
|--------|-----------|
| Postgres CPU sustained | >70% during business hours |
| Query p95 latency | >300ms on tenant-scoped queries |
| Total DB size | >100GB |
| Concurrent connections | >70% of pool limit |
| Compliance ask | A tenant asks "prove my data is isolated" |
| **Any cross-tenant leak in production** | Even one — non-negotiable |

### L2 → L3

Migrate when ANY of:

| Signal | Threshold |
|--------|-----------|
| Single tenant query share | >40% of total (noisy neighbor) |
| Total DB size | >1TB |
| Per-tenant backup/restore time | >30 min |
| Tenant requests data residency | Specific region, BAA, or HIPAA-like |
| Schema diverges per tenant | Custom fields/columns specific to one tenant |
| SLA contract | "Blast radius zero" guarantees |

---

## Anti-patterns

- **Skipping L1 to "future-proof"**: building RLS or DB-per-tenant before product-market fit. Wastes months you don't have.
- **Staying at L1 past the signals**: every signal you ignore compounds risk. The first cross-tenant leak in prod IS the migration trigger; don't wait.
- **Migrating prematurely on a single signal**: signals must be sustained or acute (not "we hit 70% CPU once"). Look for trends.
- **Not documenting the migration playbook before you need it**: write the L1→L2 migration runbook at L1, rehearse it at L1 month 6.

---

## Sovereignty rationale

Each level preserves sovereignty differently:
- **L1**: maximum portability (any Postgres works). Vendor lock-in: zero.
- **L2**: still portable, RLS is standard Postgres. Vendor lock-in: zero.
- **L3**: requires orchestration (Terraform, automated provisioning). Vendor lock-in risk: medium (whoever runs the DBs).

Pick the lowest level that meets current needs. Migrate when signals say so, not when fashion says so.
