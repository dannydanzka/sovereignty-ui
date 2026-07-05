# Library Architecture

> **APPLIES TO**: Repo-wide structure decisions
> **VERSION**: 1.0 | **UPDATED**: 2026-07-05

---

## Layers (strict downward flow)

```
tokens  →  components (atoms/molecules)  →  patterns (organisms)
hooks   →  (may be used by components/patterns)
utils   →  pure functions, no React, usable anywhere
```

- `tokens/` never imports from other layers.
- `components/` may import tokens, hooks, utils — never patterns.
- `patterns/` compose components + hooks + tokens.
- `hooks/` may import utils only. `utils/` import nothing internal.

## Entry Points (public API)

| Entry | Content |
|-------|---------|
| `.` | Components + patterns |
| `/tokens` | Tokens, CSS-var helpers, `injectSuiTokens()`, `createBrandPalette()` |
| `/hooks` | Generic React hooks |
| `/utils` | Pure utility functions |

Anything not re-exported by these barrels is private. Removing/renaming a public export is a breaking change (see `api-stability.md`).

## Admission Criteria — what enters the library

| Enters sovereignty-ui | Stays in the product |
|-----------------------|----------------------|
| Generic UI (Button, Modal, Input) | Domain-specific (RoleBadge, StatusBadge) |
| Agnostic feedback (Alert, Toast) | i18n-dependent components |
| Prop/slot-driven layout patterns (AppHeader-style) | Brand assets (Logo.svg, fonts) |
| Pure utilities (formatDate, truncate) | Service-specific code (Supabase upload) |
| Generic hooks (useModal, useDebounce) | State-specific hooks (useAuth, useUsers) |

**Litmus test**: if it needs an import from a product's domain/infrastructure/services or an i18n catalog, it does not enter. Semi-brand components enter only as fully configurable patterns (all content via props/slots, zero brand defaults).

## Consumer contract

- Consumers theme via `injectSuiTokens()` / CSS custom properties (`--sui-*`) or `createBrandPalette()` for multi-tenant.
- Framework needs (e.g., Next.js `'use client'`) are solved by thin wrappers in the consumer, never here.
- Product custom components must be compositions: agnostic SUI pieces + business logic.
