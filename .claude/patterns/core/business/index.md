# Business Patterns

> **Layer**: WHAT (business-architecture concerns)
> **Audience**: Architects designing multi-tenant SaaS products on the sovereignty stack
> **Origin**: Distilled from Controla MVP (CORF pilot, 2026-05)

---

## Why this exists

`core/architecture/` patterns answer "how do we structure code?" (Clean Architecture, modularization, monorepo).
`core/business/` patterns answer **"how does the business shape the architecture?"** — tenancy, environments, billing, domain modeling for rental/marketplace/SaaS contexts.

These patterns are **product-shape-aware**. They encode the architectural consequences of business decisions: when to migrate tenancy levels, how to model rental flows, how to structure feature flags per tenant.

---

## Patterns in this directory

### Tenancy & multi-tenant readiness

- `tenancy-levels.md` — Three levels (shared+tenantId → shared+RLS → DB-per-tenant) with concrete migration signals
- `tenant-scoped-repository.md` — Repository base class that enforces `WHERE tenantId` automatically
- `multi-tenant-data-model.md` — `tenantId` placement, composite indexes, RLS roadmap
- `feature-flags-per-tenant.md` — Gating features by tenant + per-environment
- `audit-log-pattern.md` — What to audit, how to query, retention policy

### Domain modeling

- `rental-business-domain.md` — Asset, Rental, Quote, Maintenance, Client entities and their relationships

### Environments & deployment

- `environment-progression.md` — Single → DEV/QA + PROD → multi-region staging
- `custom-domain-routing.md` — Subdomain + custom domain resolution at the edge

---

## How to read these patterns

Each pattern document follows this structure:

1. **Context** — What business situation this addresses
2. **Forces** — Tradeoffs in tension (cost vs isolation, speed vs scope, etc.)
3. **Pattern** — The recommended approach
4. **Anti-patterns** — Common mistakes that look right but fail
5. **Migration signals** (where applicable) — Concrete metrics that say "time to evolve"
6. **Sovereignty rationale** — Why this pattern preserves sovereignty (vendor lock-in resistance, data ownership, blast radius control)

---

## Status

🚧 **Stubs only.** These were extracted from real product decisions on Controla MVP. Full content lands as we live the patterns and validate them in production. Stubs are public commitments to document, not finished doctrine.
