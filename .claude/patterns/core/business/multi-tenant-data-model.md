# Multi-Tenant Data Model

> **Status**: 🚧 Stub
> **Layer**: WHAT (business architecture)

---

## Context

Where to put `tenantId`, how to index, and how to evolve toward RLS without a rewrite.

## Pattern

1. **`Tenant` is a first-class entity** with `id`, `slug` (subdomain), `customDomain`, `displayName`, `theme`, `createdAt`, `isActive`.
2. **Every domain entity carries `tenantId`** as a non-null foreign key to `Tenant.id`. No exceptions for "global" tables — convert globals to seeded-per-tenant if needed.
3. **Composite indexes lead with `tenantId`**: `(tenantId, createdAt)`, `(tenantId, status)`, `(tenantId, ownerId)`. Postgres prunes by tenant first, dramatically improving query plans.
4. **Unique constraints scoped by tenant**: `@@unique([tenantId, slug])` instead of `@unique slug`.
5. **Foreign keys stay within tenant**: a `Rental.assetId → Asset.id` is fine because both share the same `tenantId`. Verify in repository writes.
6. **No cross-tenant joins in business logic.** Admin/ops queries that aggregate across tenants are clearly marked and route through a separate "platform-admin" repo.

## RLS readiness (L1 → L2)

When you migrate to L2, you add:
- Per-table RLS policy: `USING (tenant_id = current_setting('app.tenant_id')::uuid)`
- Connection-level `SET LOCAL app.tenant_id = '...'` per request
- Separate Postgres role for application connections (not superuser)

Because every entity already carries `tenantId`, the L1→L2 migration is policy creation, not data migration.

## Anti-patterns

- "We'll add `tenantId` later" — adds a backfill nightmare.
- Forgetting `tenantId` in unique constraints — a tenant can't have a slug already used by another tenant.
- Cross-tenant foreign keys (e.g., a global `Plan` table referenced by tenants) — converts to seeded-per-tenant or a separate `platform_*` schema.
