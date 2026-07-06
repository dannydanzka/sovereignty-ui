# Naming Conventions

> **Module**: core/quality
> **ESLint**: `custom/no-underscore-prefix`

---

## TL;DR

**DO**:
- Files: `kebab-case` + specific extension (`.use-case.ts`, `.repository.ts`)
- Components: `PascalCase` folders
- Constants: `SCREAMING_SNAKE_CASE` values
- Variables: `camelCase`

**DON'T**:
- Generic `.ts` for domain files (use specific extensions)
- `_underscore` prefix for "private" variables
- Mix casing styles in same category

---

## Why Specific Extensions

```
❌ user.ts         → What is it? (entity? use case? service?)
✅ user.entity.ts  → Clearly a domain entity
✅ user.use-case.ts → Clearly business logic
✅ user.repository.ts → Clearly data access
```

**Benefits**:
- Instant recognition of file responsibility
- Easy to search: `find . -name "*.use-case.ts"`
- Self-documenting codebase

---

## Quick Reference

| Category | Case | Extension | Example |
|----------|------|-----------|---------|
| **Component** | PascalCase/ | .tsx | `UserCard/UserCard.tsx` |
| **Hook** | PascalCase/ | .ts | `useAuth/useAuth.ts` |
| **Use Case** | kebab-case | .use-case.ts | `create-user.use-case.ts` |
| **Repository** | kebab-case | .repository.ts | `user.repository.ts` |
| **Service** | kebab-case | .service.ts | `user.service.ts` |
| **Entity** | kebab-case | .entity.ts | `user.entity.ts` |
| **Interface** | kebab-case | .interfaces.ts | `user.interfaces.ts` |
| **Constants** | kebab-case | .constants.ts | `roles.constants.ts` |
| **Styled** | kebab-case | .styled.ts | `user-card.styled.ts` |
| **Test** | kebab-case | .test.ts | `user.test.ts` |

---

## Component Suffixes

| Suffix | Context | Complexity |
|--------|---------|------------|
| `Page` | Public routes | Simple/marketing |
| `Screen` | Admin/authenticated | Complex CRUD |
| `Modal` | Overlays | Any |
| `Form` | Forms | Any |

```
TermsPage/           → Public, simple
UserManagerScreen/   → Admin, complex CRUD
CreateUserModal/     → Overlay form
```

---

## Constants

```typescript
// ✅ SCREAMING_SNAKE_CASE for values
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

// ✅ Access pattern
if (user.role === USER_ROLES.ADMIN) { ... }

// ❌ Don't use camelCase for constants
export const userRoles = { admin: 'admin' };
```

---

## Language

**Code**: English always (variables, functions, files, routes)
**Content**: Localized per project (UI text, error messages, test data)

```typescript
// ✅ English code, localized content
const errorMessage = 'Usuario no encontrado'; // Spanish UI
const userName = 'María García';              // Spanish test data

// ❌ Non-English code
const nombreUsuario = 'María';  // Spanish variable name
```

---

## Related

- `frontend/presentation/components.md` - Component structure
- `frontend/domain/use-cases.md` - Use case patterns
