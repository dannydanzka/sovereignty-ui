# Tenant-Scoped Repository

> **Status**: 🚧 Stub — pattern in active use on Controla MVP, full content after validation.
> **Layer**: WHAT (business architecture)
> **Companion**: `tenancy-levels.md`

---

## Context

In a Level 1 multi-tenant deployment (shared DB + `tenantId` column), application-level isolation depends on every query including `WHERE tenantId = currentTenant`. Forgetting this once leaks data across tenants. Code review and discipline aren't enough — the architecture must enforce it.

---

## Pattern

A `TenantScopedRepository` base class wraps Prisma (or any ORM) and:

1. Reads the current `tenantId` from request-scoped context (AsyncLocalStorage / RLS variable / DI).
2. Injects `WHERE tenantId = ctx.tenantId` into every `findMany`, `findUnique`, `findFirst`, `count`.
3. Asserts `tenantId === ctx.tenantId` on every `create`, `update`, `delete` (or sets it automatically).
4. Throws `TenantContextMissingError` if no tenant context is set.

Concrete repositories extend this base and never write raw queries that skip it.

---

## Sketch

```ts
abstract class TenantScopedRepository<T> {
  constructor(protected ctx: TenantContext) {}

  protected scope() {
    if (!this.ctx.tenantId) throw new TenantContextMissingError();
    return { tenantId: this.ctx.tenantId };
  }

  protected scoped<W extends object>(where: W): W & { tenantId: string } {
    return { ...where, ...this.scope() };
  }
}
```

---

## Tests required

- Cross-tenant test: seed Tenant A and Tenant B, assert repo with ctx=A never returns B's rows.
- Missing context test: assert `TenantContextMissingError` thrown if no ctx.
- Forced-write test: attempt to update row with `tenantId !== ctx.tenantId`, assert rejection.

---

## Anti-patterns

- Reaching past the base class for "just one quick raw query."
- Setting `tenantId` from request body instead of session/JWT.
- Sharing one repository instance across requests (must be per-request to bind correct context).
