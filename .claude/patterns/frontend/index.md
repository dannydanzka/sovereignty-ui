# Frontend Patterns

> **Discipline**: `frontend` — Next.js SSR web apps (API routes + React)
> **Architecture**: Clean Architecture layers
> **Shared with**: `spa` (domain, infrastructure, presentation, testing, tooling layers)

---

## Clean Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION                            │
│              (Components, Hooks, Styling)                    │
├─────────────────────────────────────────────────────────────┤
│                      INFRASTRUCTURE                          │
│          (Repositories, Services, State, Database)           │
├─────────────────────────────────────────────────────────────┤
│                         DOMAIN                               │
│              (Entities, Use Cases, Interfaces)               │
└─────────────────────────────────────────────────────────────┘
         Dependencies point INWARD (toward Domain)
```

---

## Structure

| Layer | Purpose |
|-------|---------|
| **[domain/](domain/index.md)** | Entities, Use Cases (pure, no deps) |
| **[infrastructure/](infrastructure/index.md)** | Services, State, Repos, Database |
| **[presentation/](presentation/index.md)** | Components, Hooks, Styling |
| **[nextjs/](nextjs/index.md)** | App Router, API Routes, Middleware |

### Cross-Cutting

| Module | Purpose |
|--------|---------|
| **[auth/](auth/index.md)** | Session, RBAC |
| **[media/](media/index.md)** | Images, Uploads |
| **[quality/](quality/)** | Frontend-specific anti-patterns |
| **[testing/](testing/index.md)** | Vitest, RTL |
| **[tooling/](tooling/index.md)** | ESLint, TypeScript, Imports |

---

## Quick Navigation

### By File Type

| Creating... | Pattern |
|-------------|---------|
| Entity | `domain/entities.md` |
| Use Case | `domain/use-cases.md` |
| Repository | `infrastructure/repositories.md` |
| Service | `infrastructure/services.md` |
| Slice | `infrastructure/state/slices.md` |
| Selector | `infrastructure/state/selectors.md` |
| Component | `presentation/components.md` |
| Hook | `presentation/hooks.md` |
| Styled | `presentation/styling/styled-components.md` |
| API Route | `nextjs/api-routes.md` |
| Page | `nextjs/app-router.md` |
| Middleware | `nextjs/middleware.md` |
| Test | `testing/vitest.md` |

### By Architecture

| Topic | Pattern |
|-------|---------|
| Multi-tenant contexts | `architecture/multi-tenant-contexts.md` |

### By Problem

| Problem | Pattern |
|---------|---------|
| Auth/session | `auth/session.md` |
| Image handling | `media/images.md` |
| File uploads | `media/uploads.md` |
| ESLint errors | `tooling/eslint.md` |
| Import issues | `tooling/imports.md` |
| DB migrations | `infrastructure/database/prisma.md` |

---

## Layer Rules

| Layer | Can Import | Cannot Import |
|-------|------------|---------------|
| **Domain** | Nothing | Infrastructure, Presentation |
| **Infrastructure** | Domain interfaces | Presentation |
| **Presentation** | Infrastructure (via hooks) | Domain directly |
| **NextJS** | All (routing glue) | - |

---

## State Management Variants

This sovereignty supports multiple Redux patterns:

| Pattern | Used By | Documentation |
|---------|---------|---------------|
| Redux Toolkit (RTK) | New projects (recommended) | `infrastructure/state/slices.md` |
| Redux + Sagas | Legacy monorepo projects | `infrastructure/state/redux.md` |

Both follow the same sovereignty principle: **components never call services directly**.

```
Component → Hook → Dispatch → (Thunk|Saga) → Service → API
```

---

**Version**: 4.0 | **Updated**: 2026-03-17

