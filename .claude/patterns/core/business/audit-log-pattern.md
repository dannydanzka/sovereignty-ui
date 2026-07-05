# Audit Log Pattern

> **Status**: 🚧 Stub
> **Layer**: WHAT (business architecture)

---

## Context

Multi-tenant systems must answer "who did what, when, on whose behalf" — for compliance, debugging cross-tenant leaks, and customer disputes. Application logs alone aren't enough; an append-only audit log records intent and authorization.

## Pattern

Append-only `AuditLog` table captures every mutation that crosses a meaningful business boundary:

| Field | Purpose |
|-------|---------|
| `id` | UUID |
| `tenantId` | Tenant whose data was affected |
| `actorTenantId` | Tenant of the actor (usually = tenantId; differs in platform-admin operations) |
| `actorUserId` | User who performed the action |
| `actorRole` | RBAC role at time of action (snapshot) |
| `action` | Verb: `rental.created`, `payment.received`, `asset.decommissioned` |
| `subjectType` | Entity affected: `Rental`, `Payment`, `Asset` |
| `subjectId` | Entity primary key |
| `before` | JSONB snapshot before mutation (for updates/deletes) |
| `after` | JSONB snapshot after mutation (for creates/updates) |
| `requestId` | Trace correlation |
| `ip`, `userAgent` | Optional context |
| `occurredAt` | Server timestamp |

## What to audit

Always:
- All mutations to financial entities (Rentals, Payments, Quotes accepted, Sales).
- Asset status changes (especially `decommissioned`, `lost`, `sold`).
- User role changes.
- Tenant configuration changes.
- Cross-tenant operations (platform-admin only).

Don't audit:
- Reads (use access logs).
- Trivial UI state (e.g., toggling a filter).
- High-frequency telemetry (use metrics).

## Cross-tenant leak detection

Run a continuous check: `SELECT * FROM AuditLog WHERE actorTenantId != tenantId AND actorRole != 'platform-admin'`. Any row is a security incident.

## Anti-patterns

- Mixing audit log with operational logs (Loki/Datadog). Audit log lives in your DB, queryable, retained per compliance requirements.
- Storing only `after` (no `before`) — defeats forensic value.
- Mutable audit log — must be append-only, no UPDATE/DELETE allowed (enforce via DB privileges).
