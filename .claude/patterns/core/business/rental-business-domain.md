# Rental Business Domain

> **Status**: 🚧 Stub
> **Layer**: WHAT (business architecture)
> **Origin**: Controla MVP (CORF — construction equipment rental)

---

## Context

Rental businesses (equipment, vehicles, tools, events) share a recurring domain model. Capturing it once as a sovereignty pattern lets new tenants onboard quickly without re-discovering the entities, transitions, and edge cases each time.

## Core entities

| Entity | Purpose | Key fields |
|--------|---------|------------|
| `Asset` | The thing rented or sold | sku, category, status, condition (new/used), saleable, rentable, dailyRate, weeklyRate, monthlyRate, salePrice |
| `Client` | Customer of the tenant | name, taxId (RFC for MX), contact, billingAddress, deliveryAddress |
| `Quote` | Proposed rental/sale before commitment | clientId, items[], totals, validUntil, status (draft/sent/accepted/rejected/expired) |
| `Rental` | Active commitment of an asset to a client | assetId, clientId, startDate, endDate, dailyRate, status (reserved/active/returned/overdue), depositAmount |
| `Payment` | Money received against a rental or sale | rentalId or saleId, amount, method, receivedAt, reconciled |
| `Maintenance` | Service event on an asset | assetId, type (preventive/corrective), performedAt, cost, notes, nextDue |
| `Sale` | Outright sale (vs rental) | assetId, clientId, soldAt, price |
| `MovementLog` | Append-only history of asset state changes | assetId, fromStatus, toStatus, reason, actorId, occurredAt |

## State machines

### Asset status
`available → reserved → in_use → returned → (maintenance) → available`
With branches to `sold`, `lost`, `decommissioned`.

### Rental status
`draft → reserved → active → returned`
Branches to `overdue` (active past endDate), `cancelled`, `extended`.

### Quote status
`draft → sent → (accepted | rejected | expired)`
Accepted quotes spawn a `Rental` or `Sale`.

## Key invariants

1. An `Asset` cannot be in two active `Rental`s at once.
2. A `Rental.endDate` cannot precede `startDate`.
3. A `Maintenance` block cannot overlap an active `Rental`.
4. `Sale` of an asset transitions it to `sold` and prevents future rentals.
5. All money fields use integer cents (or `Decimal`), never floats.

## Reports CORF needs day 1

- **Asset utilization**: % of days rented vs available, per asset and category.
- **Revenue by category**: monthly/quarterly aggregates.
- **Overdue rentals**: list with days overdue and contact info.
- **Upcoming returns**: next 7/30 days.
- **Maintenance due**: assets approaching `nextDue`.
- **Cash forecast**: expected payments by date based on active rentals + payment terms.

## Anti-patterns

- Modeling `Rental` as a flag on `Asset` — loses history, breaks reporting.
- Storing rates only on `Asset` — quotes need historical rates (price changes shouldn't rewrite past quotes).
- Coupling `Quote` to `Rental` 1:1 — a quote may have multiple line items that become multiple rentals + sales.
- Soft-deleting `Asset` with `isDeleted` instead of `decommissionedAt + reason` — loses operational history.
