# Code Elevation Patterns

**Purpose:** Define when and how to elevate code from local (screen/feature-specific) to global (libs) scope.
**Principle:** Avoid duplication by elevating reusable code after 2+ usages.

---

## The 2+ Rule

**WHEN a piece of code is used more than 2 times, it MUST be elevated to global.**

This applies to ALL contexts:
- Components (styled, presentational)
- Hooks (custom React hooks)
- Helpers/Utils (pure functions)
- Constants (configuration, mappings)
- Selectors (Redux selectors)
- Slices (Redux state slices)
- Types/Interfaces (shared types)
- Services (API clients)

---

## Decision Matrix

| Usage Count | Action | Location |
|-------------|--------|----------|
| 1 | Keep local | `screen/Component.styled.ts` |
| 2 | Evaluate elevation | Consider if patterns match |
| 3+ | MUST elevate | `libs/presentation/components/` |

---

## Elevation Process

### Step 1: Identify Candidates
```
# Find duplicated patterns across screens
grep -r "PageWrapper" src/apps/*/presentation/screens/
grep -r "EmptyState" src/apps/*/presentation/screens/
grep -r "LoadingState" src/apps/*/presentation/screens/
```

### Step 2: Analyze Similarity
- **80%+ similar** → Elevate as-is
- **50-80% similar** → Elevate with props/variants
- **<50% similar** → Keep local, different concerns

### Step 3: Create Global Component
```
libs/presentation/components/public/
├── PublicStates/
│   ├── PublicStates.styled.ts   # LoadingState, ErrorState, EmptyState
│   ├── PublicStates.interfaces.ts
│   └── index.ts
```

### Step 4: Update Barrel Export
```typescript
// libs/presentation/components/public/index.ts
export * from './PublicStates';
```

### Step 5: Migrate Usages
```typescript
// Before (local)
import { EmptyState } from './Screen.styled';

// After (global)
import { PublicEmptyState } from '@components';
```

### Step 6: Remove Local Duplicates
Delete elevated components from all local `.styled.ts` files.

---

## Elevation by Context

### Components (Styled)

**Local → Global when:**
- Same structure across 3+ screens
- Only differences are content/props

**Example elevation:**
```
Local: PageWrapper, ScreenSection, ContentWrapper
Global: PublicPageWrapper, PublicSection, PublicContainer
```

**Structure:**
```
libs/presentation/components/
├── public/           # Public-facing components
│   ├── PublicPageLayout/
│   ├── PublicCard/
│   ├── PublicForm/
│   └── PublicStates/
├── admin/            # Admin-specific components
└── common/           # Cross-context components
```

### Hooks

**Local → Global when:**
- Same state orchestration pattern
- Used across multiple screens/features

**Example:**
```typescript
// Local: useEnrollments in 3 screens
// → Global: @hooks/useEnrollments

// libs/presentation/hooks/useEnrollments/
├── useEnrollments.ts
├── useEnrollments.interfaces.ts
└── index.ts
```

### Helpers

**Local → Global when:**
- Pure function used 3+ times
- No business-specific logic

**Example:**
```typescript
// libs/shared/helpers/
├── formatters/
│   ├── formatCurrency.ts      # Used in 5+ places
│   ├── formatDate.ts          # Used in 10+ places
│   └── index.ts
```

### Constants

**Local → Global when:**
- Same values across contexts
- Configuration that shouldn't vary

**Example:**
```typescript
// libs/shared/constants/
├── status-colors.constants.ts  # Status → Color mapping
├── pagination.constants.ts     # DEFAULT_PAGE_SIZE, etc.
└── index.ts
```

### Selectors

**Local → Global when:**
- Same derived state computation
- Used across multiple components/screens

**Example:**
```typescript
// libs/infrastructure/state/selectors/
├── auth.selectors.ts           # selectUser, selectIsAdmin
├── enrollments.selectors.ts    # selectActiveEnrollments
└── index.ts
```

### Types/Interfaces

**Local → Global when:**
- Shared across layers (domain ↔ presentation)
- Used in 3+ files

**Example:**
```typescript
// libs/domain/entities/
├── user.entity.ts              # UserEntity, UserRole
├── enrollment.entity.ts        # EnrollmentEntity, EnrollmentStatus
└── index.ts
```

---

## Anti-Patterns

### ❌ DON'T: Premature Elevation
```typescript
// Wrong: Elevating after first use
// Only elevate when pattern is confirmed (3+ usages)
```

### ❌ DON'T: Over-Generalization
```typescript
// Wrong: Making component too generic
<UniversalCard
  variant="product|user|order|payment|..."
  layout="horizontal|vertical|grid|..."
  // 20+ props
/>

// Right: Specific components for specific contexts
<ProductCard />
<UserCard />
```

### ❌ DON'T: Breaking Changes
```typescript
// Wrong: Changing elevated component API
// Right: Add new props with defaults, deprecate old ones
```

### ❌ DON'T: Cross-Context Imports
```typescript
// Wrong: Admin importing from Public
import { PublicCard } from '@components/public';

// Right: Elevate to common or duplicate with context prefix
import { AdminCard } from '@components/admin';
```

---

## Validation Checklist

Before elevating, verify:

- [ ] **3+ usages** confirmed across codebase
- [ ] **80%+ similarity** in structure/styling
- [ ] **No business logic** in elevated component
- [ ] **Props interface** defined for variants
- [ ] **Barrel export** added to index.ts
- [ ] **All usages** migrated to global import
- [ ] **Local duplicates** removed
- [ ] **Tests** passing after migration
- [ ] **Type-check** passing

---

## Real Examples (Reference Project)

### PublicStates Elevation

**Before:** 6 screens with duplicate states
```
ContactScreen.styled.ts      → LoadingState, ErrorState
MyEventsScreen.styled.ts     → LoadingState, EmptyState
KitCatalogScreen.styled.ts   → LoadingContainer, EmptyContainer
DashboardScreen.styled.ts    → EmptyState
EventsListScreen.styled.ts   → EmptyState
MyPaymentsScreen.styled.ts   → LoadingState, EmptyState
```

**After:** 1 global module
```
libs/presentation/components/public/PublicStates/
├── PublicStates.styled.ts   # 11 exports
├── PublicStates.interfaces.ts
└── index.ts

Exports:
- PublicLoadingState, PublicLoadingIcon, PublicLoadingText, PublicLoadingSpinner
- PublicErrorState, PublicErrorIcon, PublicErrorText
- PublicEmptyState, PublicEmptyIcon, PublicEmptyTitle, PublicEmptyText, PublicEmptyActions
```

**Result:**
- 6 screens migrated
- ~500 lines eliminated
- Consistent UX across app

### Footer Cleanup

**Before:** Footer duplicated in 10+ screens (unused - layout provides footer)

**After:** Removed all local footer components

**Result:**
- ~800 lines eliminated
- Cleaner screen components

---

## Summary

| Principle | Description |
|-----------|-------------|
| **2+ Rule** | Elevate after 3+ usages |
| **Investigation First** | Grep before creating |
| **80% Similarity** | Don't force-fit dissimilar code |
| **Context Boundaries** | admin/, public/, common/ |
| **Clean Migration** | Remove ALL local duplicates |
| **No Breaking Changes** | Add props, don't remove |

**Philosophy:** Elevation saves implementation time, ensures consistency, and reduces maintenance burden. But premature elevation creates unnecessary abstraction. Wait for the pattern to emerge naturally (3+ usages) before elevating.

---

**Version:** 1.0 | **Created:** 2025-12-22
**Applies to:** Components, Hooks, Helpers, Constants, Selectors, Slices, Types
