# Monorepo Centralization (DDD)

**Pattern:** Bounded Context + Shared Kernel
**Decision Tool:** "Rule of 2" + Cost of Change
**Target:** 300-400 lines max

---

## Core Concepts

| Concept | Definition | Implementation |
|---------|------------|----------------|
| **Bounded Context** | Independent domain | Each `mod-*` = own UI/logic/constants |
| **Shared Kernel** | Minimal shared code | `lib-*` = infrastructure only |
| **Rule of 2** | Elevate at 2nd use | Wait for proven reuse |
| **Cost of Change** | Impact analysis | Centralized = HIGH, Local = LOW |

---

## Decision Matrix

### ✅ CENTRALIZE in lib-* when:
- Used in **2+ modules** (proven reuse)
- Technical infrastructure (Redux, API, sagas)
- System config (endpoints, flags)
- Core models (User, Product, Order)
- Generic utils (formatters, validators)

### ❌ KEEP LOCAL in mod-* when:
- Used in **1 module only**
- UI specific (labels, routes, configs)
- Context-unique logic
- Anticipatory ("might need later")

---

## Examples

### Constants
```typescript
// ✅ lib-utils (used by admin + client)
export const OfferTypes = { COMBO: 1, DISCOUNT: 2 };

// ❌ mod-admin (admin-only)
export const ADMIN_ROUTES = { LIST: '/promotions', CREATE: '/promotions/crear' };
```

### Validation
```typescript
// ✅ lib-utils (2+ modules, pure function, stable)
export const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ❌ mod-admin (admin-specific rules)
export const validateAdminEmail = (email: string): boolean => email.endsWith('@company.com');
```

### Redux State
```typescript
// ❌ DON'T centralize when different requirements
// Admin: CRUD + filters + pagination
// Client: READ + filters only
// → Keep separate (different concerns)

// ✅ Extract ONLY shared parts if identical
// Pagination logic same? → lib-utils/helpers/pagination
```

### API Service
```typescript
// ✅ lib-services (2+ modules, same contract, infrastructure)
export const usersService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
};
```

---

## Re-exports Policy

**Purpose:** Temporary migration tool ONLY (max 3-6 months)

### ✅ Correct (with expiration)
```typescript
/**
 * @deprecated 2025-12-02
 * Import from '@your-org/utils/lib/constants/promotions/admin'
 * REMOVAL: 2025-02-01
 */
export * from '@your-org/utils/lib/constants/promotions/admin';
```

### ❌ Forbidden (permanent)
```typescript
// NO @deprecated, NO timeline = technical debt
export * from '@your-org/utils/lib/constants/promotions/admin';
```

---

## Import Rules (Vertical Slicing)

```
✅ Presentation (mod-*) → Application (lib-utils) → Infrastructure (lib-services)
❌ Infrastructure → Presentation (upward)
❌ mod-A → mod-B (cross-context)
```

---

## Quarterly Audit (Every 3 Months)

| Audit | Question | Action |
|-------|----------|--------|
| Usage | lib-* used by 1 module only? | Lower to local |
| Duplication | Code in 2+ modules? | Consider elevating |
| Re-exports | Re-exports >6 months old? | Migrate/remove |
| Dependencies | Cross-context imports? | Refactor |

---

## Decision Checklist

Before centralizing to lib-*:
- [ ] Used in 2+ modules?
- [ ] Technical infrastructure or core model?
- [ ] Stable API (changes <1x/month)?
- [ ] Cost of centralization < cost of duplication?
- [ ] NOT anticipatory abstraction?

**If ANY = NO → Keep local**

---

## Cost Analysis

| Location | Impact | Risk | Use When |
|----------|--------|------|----------|
| lib-* | All modules | HIGH | Stable, understood, infrequent changes |
| mod-* | Single context | LOW | Evolving, context-specific, frequent changes |

**Formula:** Centralize when **reuse benefit > change risk**

---

## Anti-Patterns

| Pattern | Fix |
|---------|-----|
| Premature abstraction | Keep local until 2nd use |
| God Lib (everything shared) | Split by domain or keep local |
| Permanent re-exports | Add expiration, remove after migration |
| Cross-context deps | Extract to lib-* or duplicate |

---

## Metrics

**Good:**
- lib-* LOC: +10-20%/year
- Re-exports: <5% of files
- Cross-context imports: 0
- Duplication: <10%

**Bad:**
- lib-* LOC: Doubles/6mo (God Lib)
- Re-exports: >20%
- Cross-context: >0
- Duplication: >30%

---

## Real Examples (Betternet3)

### ✅ Correct Centralization
```typescript
// lib-services/src/promotions/client/productKey/
// Used by: mod-pedido-electronico, mod-carrito, mod-producto
// Reason: Same API, infrastructure
```

### ❌ Over-Centralization
```typescript
// lib-utils/constants/promotions/admin/promotionsRoutes.constants.ts
// Used by: mod-admin ONLY
// Should be: mod-admin/constants/routes.constants.ts
```

### ✅ Correct Separation
```typescript
// mod-admin: CRUD Redux (admin-specific)
// mod-carrito: Readonly Redux (client-specific)
// Different requirements → Keep separate
```

---

## Process: Elevating Code (Local → Centralized)

1. Identify duplication (2+ modules)
2. Analyze: Same concern or different?
3. Extract to lib-* with clear API
4. Create re-exports with @deprecated (expiration date)
5. Update imports (2-4 weeks)
6. Remove re-exports
7. Update docs

---

## Process: Lowering Code (Centralized → Local)

**When:**
- Only 1 consumer remaining
- Context-specific logic added
- High change frequency

**Steps:**
1. Copy from lib-* to mod-*
2. Update imports in module
3. Add TODO in lib-* to deprecate
4. After validation, remove from lib-*

---

## Philosophy

**"Context-first, elevate when proven, audit regularly"**

- Start local by default
- Elevate after 2nd use (not 1st)
- Re-exports = migration tool (temporary)
- Audit quarterly (usage, duplication, re-exports, dependencies)

---

## Further Reading

**Books:**
- Domain-Driven Design (Eric Evans)
- Building Microservices (Sam Newman)
- Clean Architecture (Robert C. Martin)

**Principles:**
- YAGNI (You Aren't Gonna Need It)
- DRY vs WET (Write Everything Twice)
- Rule of Three (abstract after 3rd duplication)

---

## See also

**Standards**:
- `docs/development-standards/ARCHITECTURE-STANDARDS.md` - Clean Architecture theory, Context7
- `docs/development-standards/FILE-MODULARIZATION-STANDARDS.md` - When to extract shared code

**Patterns**:
- `nextjs-typescript-architecture.md` - Full monorepo architecture
- `helper-functions.md` - Shared utilities patterns

---

**Version:** 1.0 | **Created:** 2025-12-02
**Lines**: 252 | **Status**: ✅ Verified (centralization patterns)
