# Security Audit Checklist

> **Module**: core/quality
> **Scope**: Post-phase / pre-release security audit — applies to any backend or full-stack feature
> **Updated**: 2026-05-08

---

## TL;DR

After every major phase, run a focused audit on the five vectors that yield the highest signal-to-effort ratio. Aim for one finding per vector minimum; if a vector returns clean, prove it (link to the code, not "looks fine").

| # | Vector | What to look for |
|---|--------|------------------|
| 1 | Tenant boundary | Inbound trusted headers, repo methods missing `tenantId`, cross-tenant joins |
| 2 | Authn / authz boundary | Plaintext tokens in logs, in-memory token stores, missing JWT-claim verification, role checks bypassed by middleware ordering |
| 3 | Output encoding | Unescaped interpolation in HTML emails, PDFs, server-rendered HTML, error messages |
| 4 | TOCTOU in mutations | `read → check → write` without `$transaction`; uniqueness/overlap/balance invariants enforced in app code only |
| 5 | Input validation | Mutating routes accepting `await request.json()` directly; schemas without `.strict()`; mass-assignment surfaces |

---

## Vector 1 — Tenant boundary

**Read**: every repository method touching tenant-scoped data.

**Ask**:
- Does it require `tenantId`? If not, why is it safe to be global?
- Is the tenant value coming from a header set by middleware, or from the inbound request (untrusted)?
- Does the middleware **strip** the inbound header before resolving and rewriting?
- Does the session JWT win over domain-derived resolution?

**Common fix**: add `tenantId` to `WHERE`, document auth-internal vs admin methods, strip+rewrite header in middleware.

---

## Vector 2 — Authn / authz boundary

**Read**: every place a token, password, or session is created, stored, transmitted, or logged.

**Ask**:
- Are reset/invite/magic-link tokens stored as **hashes**, not plaintext?
- Is any token, password, or secret logged (`logInfo`, `console.log`, error message)?
- Are tokens consumed atomically (single-use enforced at the DB)?
- Are role checks evaluated **after** authentication, with explicit hierarchy (`owner > admin > participant`)?
- Does the API respond identically for "user not found" and "wrong password" (no enumeration)?

**Common fix**: SHA-256 + `updateMany` consume + remove plaintext from logs.

---

## Vector 3 — Output encoding

**Read**: every template that interpolates user/tenant-controlled strings — emails, PDFs, server-rendered HTML, error pages, downloadable filenames.

**Ask**:
- Is every `${var}` in HTML wrapped in `escapeHtml(...)`?
- Are filenames in `Content-Disposition` sanitized?
- Are error messages echoing raw input?

**Common fix**: extract an `escapeHtml` helper and wrap **every** interpolation, not "the obvious ones".

---

## Vector 4 — TOCTOU in mutations

**Read**: every use case that reads state and then writes based on it.

**Ask**:
- Is the read+write inside a `$transaction`?
- Is there an optimistic-concurrency guard (`updateMany` with prior value in `WHERE`)?
- For cross-row invariants (overlap, uniqueness composite), is the isolation `Serializable`?
- Does the repository return a discriminated union for non-error outcomes, or does it throw `AppError`?

**Common fix**: collapse the read+check+write into one repository method, return `{ status: ... }` union, map in the use case.

See `core/quality/toctou-and-atomicity.md` for the full pattern.

---

## Vector 5 — Input validation

**Read**: every route handler with `POST`, `PATCH`, `PUT`, `DELETE`.

**Ask**:
- Is the body validated with a Zod schema **before** reaching the use case?
- Does the schema use `.strict()`?
- Is the schema co-located with the route?
- Does the inferred type live in `.interfaces.ts` per `component-organization`?

**Common fix**: introduce `validateBody(request, schema)`, schemas in `route.schemas.ts`, types in `route.schemas.interfaces.ts`.

See `frontend/quality/zod-route-validation.md`.

---

## How to run the audit

1. **Block one focused window** — security audits don't go well between feature work.
2. **One vector at a time**, with a written finding per file you read (or "clean" with a citation).
3. **Number the findings** (`SEC-1`, `SEC-2`, ...) — they become tickets, commits, and changelog entries.
4. **Close each finding with a test** that would have caught it.
5. **Document the audit** in the project's status doc (one-row-per-finding table with resolution).

---

## Output template

```
## Post-Phase-N audit (YYYY-MM-DD) — closed

| ID | Vector | Finding | Resolution |
|----|--------|---------|------------|
| SEC-1 | Tenant boundary | <one sentence> | <commit / file> |
| SEC-2 | ... | ... | ... |
```

---

**Origin**: Distilled from a post-phase audit on a multi-tenant SaaS. Five vectors, five findings, all closed with tests.
