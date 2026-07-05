# Multi-Tenant Context Architecture

> **Version**: 1.0 | **Updated**: 2026-03-05
> **Scope**: Multi-tenant SaaS projects only
> **Status**: Standard

---

## Problem

Multi-tenant SaaS applications have two dimensions of context:
1. **Scope**: Platform vs Tenant
2. **Role**: Admin vs Public

This creates 4 distinct contexts that need clear architectural boundaries. Without a standard, projects use inconsistent naming (camelCase `adminTenant`, business-specific `organizer`, hyphenated `admin-tenant`).

---

## Standard: `tenant/` Subdirectory Pattern

### Directory Structure

```
src/apps/
├── admin/              -> Platform administration (manages tenants, global config)
├── public/             -> Platform public (marketing, landing, SEO pages)
├── auth/               -> Authentication (shared across scopes)
├── account/            -> User account management (optional)
├── shared/             -> Cross-context shared code
└── tenant/
    ├── admin/          -> Tenant administration (tenant manages their business)
    │   ├── constants/
    │   ├── domain/
    │   │   └── use-cases/
    │   ├── infrastructure/  (optional)
    │   └── presentation/
    │       ├── components/
    │       ├── hooks/
    │       ├── layouts/
    │       └── screens/
    ├── public/         -> Tenant public (end-users interact with tenant content)
    │   ├── constants/
    │   ├── domain/
    │   │   └── use-cases/
    │   ├── infrastructure/  (optional)
    │   └── presentation/
    │       ├── components/
    │       ├── hooks/
    │       ├── layouts/
    │       └── screens/
    └── shared/         -> Tenant-scoped shared code (optional)
```

### App Router Routes

Route groups use standardized names. URL segments remain business-specific:

```
src/app/
├── (admin)/            -> /admin/*
├── (public)/           -> / (landing, pricing, terms)
├── (auth)/             -> /login, /signup
├── (account)/          -> /account/* (optional)
├── (tenant-admin)/     -> Business-specific URLs
│   └── organizer/      -> /organizer/* (voting platform)
│   └── seller/         -> /seller/* (marketplace)
│   └── instructor/     -> /instructor/* (e-learning)
├── (tenant-public)/    -> Business-specific URLs
│   └── events/         -> /events/* (voting platform)
│   └── products/       -> /products/* (marketplace)
│   └── courses/        -> /courses/* (e-learning)
```

---

## Aliases

The wildcard `@apps/*` handles all paths automatically:

```
@apps/admin             -> src/apps/admin
@apps/public            -> src/apps/public
@apps/tenant/admin      -> src/apps/tenant/admin
@apps/tenant/public     -> src/apps/tenant/public
@apps/tenant/shared     -> src/apps/tenant/shared
```

### Short Aliases (tsconfig.json, vitest.config.ts, next.config.ts)

Multi-tenant projects add these alongside the standard admin/public short aliases:

```
// Tenant Admin context - short aliases
"@apps/tenant/admin/components"  -> src/apps/tenant/admin/presentation/components
"@apps/tenant/admin/hooks"       -> src/apps/tenant/admin/presentation/hooks
"@apps/tenant/admin/screens"     -> src/apps/tenant/admin/presentation/screens
"@apps/tenant/admin/layouts"     -> src/apps/tenant/admin/presentation/layouts
"@apps/tenant/admin/constants"   -> src/apps/tenant/admin/constants
"@apps/tenant/admin/domain"      -> src/apps/tenant/admin/domain

// Tenant Public context - short aliases
"@apps/tenant/public/components" -> src/apps/tenant/public/presentation/components
"@apps/tenant/public/hooks"      -> src/apps/tenant/public/presentation/hooks
"@apps/tenant/public/screens"    -> src/apps/tenant/public/presentation/screens
"@apps/tenant/public/layouts"    -> src/apps/tenant/public/presentation/layouts
"@apps/tenant/public/constants"  -> src/apps/tenant/public/constants
"@apps/tenant/public/domain"     -> src/apps/tenant/public/domain
```

---

## Context Boundaries (Import Rules)

Same isolation rules as platform contexts apply to tenant contexts:

| From \ To | admin | public | tenant/admin | tenant/public | shared | tenant/shared |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|
| **admin** | - | NO | NO | NO | YES | NO |
| **public** | NO | - | NO | NO | YES | NO |
| **tenant/admin** | NO | NO | - | NO | YES | YES |
| **tenant/public** | NO | NO | NO | - | YES | YES |
| **shared** | NO | NO | NO | NO | - | NO |
| **tenant/shared** | NO | NO | NO | NO | YES | - |

- Platform contexts NEVER import from tenant contexts
- Tenant contexts NEVER import from platform contexts
- Cross-tenant imports are FORBIDDEN (tenant/admin <-> tenant/public)
- Shared is accessible by same-scope contexts

---

## When to Use

| Project Type | Contexts |
|-------------|----------|
| **Single-tenant** (blog, portfolio, landing) | `admin/`, `public/`, `auth/` |
| **Multi-tenant SaaS** (marketplace, voting, e-learning) | Above + `tenant/admin/`, `tenant/public/` |
| **Multi-tenant with accounts** (e-commerce) | Above + `account/` |

Single-tenant projects simply don't have the `tenant/` directory. Zero impact.

---

## Migration Guide

### From business-specific names (e.g., `organizer/`)

```bash
# 1. Create tenant structure
mkdir -p src/apps/tenant/admin src/apps/tenant/public

# 2. Move context code
mv src/apps/organizer/* src/apps/tenant/admin/

# 3. Update imports (find-replace)
# @apps/organizer -> @apps/tenant/admin
# @app-organizer  -> @apps/tenant/admin

# 4. Update route groups
# src/app/organizer/ -> src/app/(tenant-admin)/organizer/
```

### From camelCase names (e.g., `adminTenant/`)

```bash
# 1. Create tenant structure
mkdir -p src/apps/tenant/admin src/apps/tenant/public

# 2. Move context code
mv src/apps/adminTenant/* src/apps/tenant/admin/
mv src/apps/publicTenant/* src/apps/tenant/public/

# 3. Update imports (find-replace)
# @apps/adminTenant  -> @apps/tenant/admin
# @apps/publicTenant -> @apps/tenant/public

# 4. Update route groups
# src/app/(adminTenant)/ -> src/app/(tenant-admin)/
# src/app/(publicTenant)/ -> src/app/(tenant-public)/
```

---

## Examples

### Voting platform example

| Old | New | Business URL |
|-----|-----|-------------|
| `src/apps/organizer/` | `src/apps/tenant/admin/` | `/organizer/*` |
| `src/apps/public/` (tenant pages) | `src/apps/tenant/public/` | `/events/*`, `/vote/*` |
| `src/apps/public/` (platform pages) | `src/apps/public/` | `/pricing`, `/terms` |

### Marketplace example

| Old | New | Business URL |
|-----|-----|-------------|
| `src/apps/adminTenant/` | `src/apps/tenant/admin/` | `/seller/*` |
| `src/apps/publicTenant/` | `src/apps/tenant/public/` | `/products/*`, `/cart/*` |
