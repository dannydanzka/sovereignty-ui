# Feature Flags per Tenant

> **Status**: 🚧 Stub
> **Layer**: WHAT (business architecture)

---

## Context

Multi-tenant SaaS needs to enable features per tenant: pilot a module with one client, gate paid features by plan, roll out gradually. Global flags don't cover this — each flag must be evaluable in the context of a specific tenant.

## Pattern

Three-tier flag resolution:

1. **Global default** — what the codebase ships with.
2. **Per-environment override** — `dev/qa/prod` can flip flags independently.
3. **Per-tenant override** — a specific tenant can have a flag flipped without affecting others.

Resolution order: tenant override → environment override → global default.

## Schema

```prisma
model FeatureFlag {
  id          String  @id
  key         String
  description String
  isEnabled   Boolean @default(false)        // global
  environment String                          // 'dev' | 'qa' | 'prod' | 'all'
  tenantId    String?                         // null = applies to all tenants
  expiresAt   DateTime?                       // optional auto-disable
}
```

## Usage

```ts
const isEnabled = await flags.isEnabled('rental.scheduling-v2', { tenantId, env });
```

## Anti-patterns

- Hardcoding `if (tenantId === 'corf')` — every change requires deploy.
- Long-lived flags. Set `expiresAt` and clean up. Flags are debt.
- Using flags for permissions. RBAC is a separate concern; don't conflate.
