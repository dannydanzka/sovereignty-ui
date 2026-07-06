# Authentication Patterns

> **Module**: frontend/auth
> **Scope**: Session management, RBAC
> **Updated**: 2026-03-23

---

## Patterns

| Pattern | Purpose | Priority |
|---------|---------|----------|
| `session.md` | JWT, cookies, AuthProvider (single source of truth) | High |
| `rbac.md` | Hierarchical roles, permissions | High |
| `password-reset.md` | Hashed-token store, atomic single-use consume, no plaintext logs | High |
| `multi-tenant-resolution.md` | Strip+rewrite tenant header in middleware, JWT-wins priority | High |

---

## TL;DR

**Single Source of Truth**: `useAuth()` hook.

```typescript
// DO — Always use useAuth()
const { user, isAuthenticated, logout } = useAuth();

// DON'T — Access Redux/localStorage directly
const user = useSelector(selectUser);
const token = localStorage.getItem('token');
```

**RBAC Hierarchy**: owner > admin > participant

---

## When to Consult

- Implementing auth → `session.md`
- Managing permissions → `rbac.md`
- Protecting routes → `session.md` + `nextjs/middleware.md`
- Self-service password reset → `password-reset.md`
- Multi-tenant SaaS tenant resolution → `multi-tenant-resolution.md`

---

**Total**: 4 patterns | **Updated**: 2026-05-08
