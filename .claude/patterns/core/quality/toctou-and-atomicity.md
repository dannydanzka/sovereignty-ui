# TOCTOU and Atomicity

> **Module**: core/quality
> **Scope**: Concurrency safety in repository writes — applies to all disciplines using a relational ORM
> **Updated**: 2026-05-08

---

## TL;DR

Any **read → check invariant → write** sequence is a TOCTOU race. Two concurrent requests can both pass the check before either writes, breaking the invariant.

**DO**:
- Wrap multi-step writes in a `$transaction` (Serializable when invariants span rows).
- Use **optimistic concurrency**: include the previously-read value in the `WHERE` of the update (`updateMany` returning a count).
- Return a **discriminated union** from the repository (`{ status: 'ok' | 'conflict' | 'not_found' | ... }`) so the use case maps statuses to domain errors. The repository does not throw for business conflicts.
- Keep the atomic operation as a single repository method named after the intent (`createWithOverlapGuard`, `registerPayment`, `consumeResetToken`).

**DON'T**:
- Read in one query and update in another without a guard.
- Throw `AppError` from the repository for business conflicts — that leaks domain language into infrastructure.
- Rely on application-level locks for cross-row invariants.

---

## Pattern 1: Optimistic concurrency on a single row

```ts
type RegisterPaymentResult =
  | { status: 'ok'; rental: RentalEntity }
  | { status: 'not_found' }
  | { status: 'exceeds_total' };

registerPayment: async (
  tenantId: string,
  id: string,
  amount: number,
): Promise<RegisterPaymentResult> => {
  return prisma.$transaction(async (tx) => {
    const rental = await tx.rental.findFirst({ where: { id, tenantId } });
    if (!rental) return { status: 'not_found' };

    const next = decimalToNumber(rental.totalPaid) + amount;
    if (next > decimalToNumber(rental.totalDue)) {
      return { status: 'exceeds_total' };
    }

    const updated = await tx.rental.updateMany({
      data: { totalPaid: next },
      where: { id, tenantId, totalPaid: rental.totalPaid }, // ← guard
    });
    if (updated.count === 0) {
      throw new Prisma.PrismaClientKnownRequestError(
        'Concurrent update detected', { code: 'P2034', clientVersion: '...' },
      );
    }

    const fresh = await tx.rental.findFirst({ where: { id, tenantId } });
    return fresh ? { status: 'ok', rental: toEntity(fresh) } : { status: 'not_found' };
  });
};
```

The `where: { totalPaid: rental.totalPaid }` clause makes the update **fail with `count: 0`** if any other transaction modified the row between the read and the write. The transaction retry policy (or the caller) handles the conflict.

---

## Pattern 2: Serializable transaction for cross-row invariants

When the invariant cannot be expressed as a column guard (e.g., "no two rentals overlap for the same equipment"), use `Serializable` isolation:

```ts
createWithOverlapGuard: async (input) => {
  return prisma.$transaction(
    async (tx) => {
      const overlap = await tx.rental.findFirst({
        where: {
          equipmentId: input.equipmentId,
          tenantId: input.tenantId,
          startDate: { lte: input.endDate },
          endDate: { gte: input.startDate },
        },
      });
      if (overlap) return { status: 'overlap' };

      const created = await tx.rental.create({ data: input });
      return { status: 'ok', rental: toEntity(created) };
    },
    { isolationLevel: 'Serializable' },
  );
};
```

`Serializable` lets the database detect read-write conflicts between concurrent transactions and abort one of them — the caller retries.

---

## Pattern 3: Atomic single-use consume (idempotency)

For one-shot tokens (password reset, magic links, invites): combine `find + invalidate` into a single `updateMany` so a token can only be consumed once even under concurrent submission.

```ts
consumeResetToken: async (plaintext) => {
  const tokenHash = hashToken(plaintext);
  const updated = await prisma.passwordResetToken.updateMany({
    data: { consumedAt: new Date() },
    where: { tokenHash, consumedAt: null, expiresAt: { gt: new Date() } },
  });
  if (updated.count === 0) return null;
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  return record ? { userId: record.userId } : null;
};
```

---

## Why discriminated unions, not exceptions

Throwing for "expected" outcomes (overlap, exceeds, not_found) couples the repository to the domain error vocabulary and makes call sites use `try/catch` for control flow. Returning a discriminated union:

- Forces the use case to handle every branch (TypeScript exhaustiveness).
- Keeps `try/catch` reserved for **systemic** failures (DB down, constraint violation Prisma can't model).
- Lets the use case map status → `AppError` once, in one place.

```ts
const result = await rentalRepository.registerPayment(tenantId, id, amount);
switch (result.status) {
  case 'ok': return result.rental;
  case 'not_found': throw AppError.create('Rental not found', { code: 'NOT_FOUND', statusCode: 404 });
  case 'exceeds_total': throw AppError.create('Payment exceeds total due', { code: 'CONFLICT', statusCode: 409 });
}
```

---

## Checklist before merging a mutation

1. Does the operation read state and then write based on it? → wrap in `$transaction`.
2. Is the invariant a single-column guard? → `updateMany` with the prior value in `WHERE`.
3. Is it cross-row? → `Serializable` isolation.
4. Are the non-error outcomes modeled as a union? → no throwing for business conflicts.
5. Does the use case map every union branch?

---

**Origin**: Distilled from a post-phase audit on a multi-tenant SaaS where two TOCTOU bugs (booking overlap, payment over-collection) were closed with this pattern.
