# Password Reset

> **Module**: frontend/auth
> **Scope**: Self-service password reset via emailed token
> **Updated**: 2026-05-08

---

## TL;DR

**DO**:
- Persist tokens as **SHA-256 hashes**, never plaintext.
- Use a single atomic `consumeResetToken` operation (`updateMany` with `consumedAt: null` guard).
- Set a **short TTL** (30 min default) and enforce it in the consume `WHERE` clause.
- Deliver the plaintext token only via email; never log it, never return it from the request endpoint.
- Always respond `200` to the request endpoint regardless of whether the email exists (no enumeration).

**DON'T**:
- Store plaintext tokens — a DB read is enough to compromise every account.
- Log the plaintext token (`logInfo('token: ...', { token })`). Even debug logs leak.
- Use a two-step `findResetToken` + `consumeResetToken` — racy and non-idempotent.
- Reuse the same token across requests.

---

## Schema

```prisma
model PasswordResetToken {
  id         String    @id @default(cuid())
  userId     String
  tokenHash  String    @unique
  expiresAt  DateTime
  consumedAt DateTime?
  createdAt  DateTime  @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
}
```

The plaintext token is **never** persisted. Only its `tokenHash` is.

---

## Token store

```ts
import { createHash, randomBytes } from 'node:crypto';

const TOKEN_TTL_MS = 1000 * 60 * 30;

const hashToken = (plaintext: string): string =>
  createHash('sha256').update(plaintext).digest('hex');

export const issueResetToken = async (userId: string): Promise<string> => {
  const plaintext = randomBytes(32).toString('hex');
  await prisma.passwordResetToken.create({
    data: {
      userId,
      tokenHash: hashToken(plaintext),
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    },
  });
  return plaintext; // returned ONLY to the email-sender; never logged
};

export const consumeResetToken = async (
  plaintext: string,
): Promise<{ userId: string } | null> => {
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

The atomic `updateMany` returns `count: 0` for unknown, expired, or already-consumed tokens — same path for all three.

---

## Use cases

```ts
// request-password-reset.use-case.ts
const user = await userRepository.findByEmail(email);
if (!user) return { ok: true }; // no enumeration
const token = await issueResetToken(user.id);
await emailService.sendPasswordResetEmail(user.email, token);
logInfo('[password-reset] Token generated', { userId: user.id }); // no plaintext
return { ok: true };

// reset-password.use-case.ts
const consumed = await consumeResetToken(plaintext);
if (!consumed) {
  throw AppError.create('Token inválido o expirado', { code: 'UNAUTHORIZED', statusCode: 401 });
}
await userRepository.updatePassword(consumed.userId, await hashPassword(newPassword));
```

---

## Anti-patterns observed

| Smell | Why it's wrong |
|-------|----------------|
| `logInfo('Reset token', { token: plaintext })` | Plaintext in logs ≡ plaintext in DB. |
| In-memory `Map<string, Token>` store with TODO | Survives no restart, no horizontal scale; will ship as-is if unaudited. |
| `findResetToken` + later `consumeResetToken` | Racy; same token can be consumed twice under concurrent submission. |
| `if (!user) return 404` on request endpoint | Account enumeration. |
| Token stored alongside user record (denormalized) | Cannot revoke per-token; rotation is harder. |

---

**Origin**: Distilled from a post-phase audit where the starter shipped an in-memory plaintext-token store as a TODO and required full hardening.
