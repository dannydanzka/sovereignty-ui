# Multi-Tenant Resolution (L1)

> **Module**: frontend/auth
> **Scope**: Resolving the active tenant from request context in shared-DB multi-tenant SaaS
> **Updated**: 2026-05-08

---

## TL;DR

**DO**:
- Resolve the tenant in **middleware**, write it to a request header, and **rewrite** the request to downstream handlers.
- **Strip the inbound header** before setting the new value. Inbound `x-tenant-id` from the client must never be trusted.
- Source tenant from (in priority order): **session JWT claim** → custom domain mapping → subdomain → path prefix.
- Always read tenant in route handlers and repositories from the **rewritten request header** (set by the middleware), never from the user-controlled inbound header.
- In repositories, **require `tenantId` as a parameter** for every query touching tenant-scoped data — never read it from `globalThis` or context.

**DON'T**:
- Trust `request.headers.get('x-tenant-id')` if the middleware has not stripped+rewritten it.
- Let custom-domain mapping override the session JWT claim — that lets a user be tricked into operating on a tenant they're not a member of.
- Pass tenant via a response header (response headers reach the browser, not the next request handler).
- Add a "global" repository method that omits `tenantId` for "convenience".

---

## The trust boundary

The tenant header is a **trust signal**: every downstream query uses it for scoping. If the client can set it, multi-tenancy is broken.

```
Browser ──► [strip x-tenant-id] ──► Middleware ──► [resolve + rewrite] ──► Route handler
            ↑ untrusted                                 ↑ trusted
```

The middleware is the only component allowed to set the header. Everything downstream reads it as gospel.

---

## Middleware skeleton

```ts
// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.delete('x-tenant-id'); // strip inbound

  const sessionTenantId = await readTenantFromSessionJwt(request);
  const domainTenantId = await resolveTenantFromHostname(request);

  // Session JWT wins. Domain mapping is a fallback for unauthenticated public pages.
  const tenantId = sessionTenantId ?? domainTenantId;
  if (!tenantId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  headers.set('x-tenant-id', tenantId);
  return NextResponse.rewrite(request.nextUrl, { request: { headers } });
}
```

The `NextResponse.rewrite(url, { request: { headers } })` form is what propagates the header to the route handler — `NextResponse.next({ headers })` only sets **response** headers (visible to the browser, ignored by the handler).

---

## Reading the tenant in handlers

```ts
// libs/shared/helpers/http/get-tenant-id.ts
export const getTenantId = (request: Request): string => {
  const tenantId = request.headers.get('x-tenant-id');
  if (!tenantId) throw AppError.create('Tenant not resolved', { code: 'INTERNAL', statusCode: 500 });
  return tenantId;
};
```

```ts
// route handler
const tenantId = getTenantId(request);
const items = await rentalRepository.listForTenant(tenantId);
```

---

## Repository contract

Every repository method that touches tenant-scoped data takes `tenantId: string` as the first business parameter. Methods that operate **across tenants** (auth-internal lookups: `findUserByEmail`, `findUserById` for session validation) are clearly documented as such with JSDoc and live in a different layer (auth services) than admin-facing methods.

```ts
// userRepository.ts
/**
 * Auth-internal. Crosses tenant boundary by design — used during sign-in
 * before the session is established. NEVER call from admin/business code.
 */
findByEmail(email: string): Promise<UserEntity | null>;

/** Tenant-scoped. Use for all admin/business reads. */
listByTenant(tenantId: string): Promise<UserEntity[]>;
```

---

## Why session JWT must beat domain

If domain wins, an attacker who controls a custom domain (`evil.example.com`) can:
1. Trick an authenticated user into clicking a link.
2. Their session cookie still works (same root domain).
3. Domain-derived `tenantId` differs from their JWT's tenant.
4. Every action they take operates on the attacker's tenant — visible to the attacker.

Session JWT-wins eliminates this by anchoring tenant to the authenticated identity.

---

## Anti-patterns observed

| Smell | Why it's wrong |
|-------|----------------|
| `request.headers.get('x-tenant-id')` in a route handler with no upstream strip | Client-controlled; multi-tenancy bypass. |
| `NextResponse.next({ headers })` to propagate tenant | These are response headers; handler reads inbound. |
| Tenant stored in a module-level `let currentTenant` | Shared between concurrent requests in Fluid Compute / Edge. |
| Repository method `findUserById(id)` with no tenant arg, used by admin code | Cross-tenant leak. |
| Custom domain overriding session JWT | Auth-domain confusion attack. |

---

**Origin**: Distilled from a post-phase audit on a multi-tenant SaaS that closed a header-spoofing finding and a cross-tenant user-enumeration leak via auth-internal repository methods.
