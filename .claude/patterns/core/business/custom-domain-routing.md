# Custom Domain Routing

> **Status**: 🚧 Stub
> **Layer**: WHAT (business architecture)

---

## Context

Multi-tenant SaaS clients want either a subdomain (`acme.product.com`) or their own domain (`app.acme.com`). Both must resolve to the same application but bind the request to the correct tenant before any business logic runs.

## Pattern

A tenant-resolution middleware runs at the edge (Next.js middleware / Vercel Edge):

1. Parse `Host` header.
2. If `*.product.com` → strip subdomain, lookup `tenant.subdomain`.
3. Else, lookup `tenant.customDomain` for an exact match.
4. If neither matches → fall through to platform landing (or 404 for app subpaths).
5. Inject `tenantId` into request context (header + cookie) for downstream handlers.

`Tenant` schema:

```prisma
model Tenant {
  id           String  @id @default(cuid())
  slug         String  @unique  // subdomain
  customDomain String? @unique  // optional tenant-owned domain
  displayName  String
  theme        Json    // tokens override per tenant
  isActive     Boolean @default(true)
  // ...
}
```

## SSL for custom domains

- On Vercel: clients add CNAME (`app.acme.com → cname.vercel-dns.com`), platform issues Let's Encrypt automatically.
- Verification: tenant admin enters domain, system shows DNS instructions, polls until verified, then activates.

## Anti-patterns

- Resolving tenant from JWT only — breaks marketing pages, logged-out flows, public catalog.
- Hard-coded `if (subdomain === 'corf')` — every new tenant requires a deploy.
- Mixing tenant routing with auth middleware — separate concerns: tenant resolves first, auth runs second within the resolved tenant.
- Allowing wildcard custom domain match — opens spoofing risk. Always exact match.
