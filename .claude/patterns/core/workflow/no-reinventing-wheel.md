# No Reinventing the Wheel Pattern

> **Priority**: HIGH - Check existing components BEFORE creating new ones
> **Scope**: All file types - components, hooks, use cases, repositories, services
> **Philosophy**: "The best code is code you don't write"
> **Updated**: 2026-02-05

---

## Core Principle

**NEVER create code blindly. Always investigate existing patterns first.**

This applies to:
- UI Components (Badge, Card, Button, Image, Modal, etc.)
- Styled-components (thumbnails, containers, labels, etc.)
- Hooks (useAuth, useModal, useForm, etc.)
- Use Cases (executeCreate, executeUpdate, executeDelete, etc.)
- Repositories (userRepository, eventRepository, etc.)
- Services (userService, paymentService, etc.)
- Utilities (formatDate, formatCurrency, etc.)
- Constants (colors, spacing, typography)

---

## Investigation Protocol

### Before Creating ANY File

```
1. IDENTIFY file type (component, hook, use case, repository, etc.)
2. SEARCH for 2-3 similar files (Grep/Glob)
3. READ completely (imports, structure, patterns, exports)
4. IDENTIFY patterns (error handling, validation, transforms)
5. DECIDE: ADAPT (70%+ similar) or CREATE (following exact pattern)
```

### Search Commands by File Type

```bash
# Components
Glob: "src/libs/presentation/components/**/*.tsx"
Glob: "src/apps/*/presentation/**/*.tsx"

# Hooks
Grep: "export.*use[A-Z]"
Glob: "**/*use*.ts"

# Use Cases
Glob: "src/apps/*/domain/use-cases/**/*.use-case.ts"

# Repositories
Glob: "src/libs/infrastructure/repositories/**/*.repository.ts"

# Services
Glob: "src/libs/infrastructure/services/**/*.service.ts"

# Styled-components
Grep: "export const.*Container|Wrapper|Card|Badge"
```

---

## Investigation Checklists by File Type

### API Route Investigation

**Before Creating**: `/api/admin/[resource]/route.ts`

```bash
# Find similar routes
Glob: "src/app/api/admin/*/route.ts"

# Read 2-3 similar routes
- /api/admin/events/route.ts
- /api/admin/users/route.ts
```

**Pattern Checklist**:
- [ ] Uses `withAuthMiddleware`?
- [ ] Imports from `@middleware` and `@helpers`?
- [ ] try-catch with proper error handling?
- [ ] `NextResponse.json()` for responses?
- [ ] Delegates to Use Case (NOT Repository directly)?
- [ ] Returns discriminated union?

---

### Use Case Investigation

**Before Creating**: `execute-[action]-[entity].use-case.ts`

```bash
# Find similar use cases
Glob: "src/apps/*/domain/use-cases/*/*.use-case.ts"

# Read 2-3 similar files
- create-user.use-case.ts
- create-event.use-case.ts
```

**Pattern Checklist**:
- [ ] Arrow function export?
- [ ] Interface in `.interfaces.ts`?
- [ ] Uses `createAppError` (NOT `new AppError`)?
- [ ] Calls repository (NOT Prisma directly)?
- [ ] `validateAndGetUser` for authorization?
- [ ] Returns discriminated union `UseCaseResult<T>`?
- [ ] Business validation before repository call?
- [ ] Spanish error messages?

---

### Repository Investigation

**Before Creating**: `[entity].repository.ts`

```bash
# Find similar repositories
Glob: "src/libs/infrastructure/repositories/**/*.repository.ts"

# Read 2-3 similar files
- user.repository.ts
- event.repository.ts
```

**Pattern Checklist**:
- [ ] Object literal (NOT class)?
- [ ] Implements interface from `.interfaces.ts`?
- [ ] Transform layer (Prisma → Domain entities)?
- [ ] Helper functions (applyFilters, applyPagination)?
- [ ] TODO comments for Prisma migration (if mock)?
- [ ] Spanish error messages?

---

### Component Investigation

**Before Creating**: `[ComponentName]` component

```bash
# Find similar components
Glob: "src/libs/presentation/components/**/*.tsx"
Glob: "src/apps/*/presentation/**/*Screen*"

# Read 2-3 similar files
```

**Pattern Checklist**:
- [ ] 5-file structure (tsx, styled, test, interfaces, index)?
- [ ] Styled components use `$` prefix for transient props?
- [ ] Uses existing components from `@components`?
- [ ] Uses design tokens (NOT hardcoded colors/spacing)?
- [ ] Uses flat maps (NOT theme context)?
- [ ] Exports from index.ts?

---

### Hook Investigation

**Before Creating**: `use[HookName]`

```bash
# Find similar hooks
Glob: "src/libs/infrastructure/hooks/**/*.ts"
Glob: "src/apps/*/presentation/**/use*.ts"

# Read 2-3 similar files
- useAuth.ts
- useModal.ts
- useEntityActions.ts
```

**Pattern Checklist**:
- [ ] Uses `useAppDispatch` and `useAppSelector`?
- [ ] Imports selectors from slice?
- [ ] Returns object with state + handlers?
- [ ] `useCallback` for handler functions?
- [ ] No business logic (orchestration only)?

---

### Service Investigation

**Before Creating**: `[domain].service.ts`

```bash
# Find similar services
Glob: "src/libs/infrastructure/services/**/*.service.ts"

# Read 2-3 similar files
```

**Pattern Checklist**:
- [ ] Object literal pattern?
- [ ] Uses `handleRequest` wrapper?
- [ ] Proper typing for request/response?
- [ ] Spanish error messages?

---

## Common Components to REUSE

### From `@components` (libs/presentation/components)

| Need | Use This | NOT This |
|------|----------|----------|
| Status indicator | `StatusBadge` | Custom styled span |
| Role indicator | `RoleBadge` | Custom styled span |
| Event status | `EventStatusBadge` | Custom styled span |
| Payment status | `PaymentStatusBadge` | Custom styled span |
| Delivery status | `DeliveryStatusBadge` | Custom styled span |
| Image display | `Image` | Native `<img>` |
| Modal dialog | `Modal` | Custom dialog |
| Loading state | `AdminLoadingState` | Custom spinner |
| Confirmation | `ConfirmDialog` | Custom modal |
| Form fields | `TextField`, `SelectField` | Native inputs |

### From Domain Components

| Need | Use This | Location |
|------|----------|----------|
| Gallery thumbnail | `GalleryImageCard` | `domain/GalleryImageCard` |
| Event card | `EventCard` | `domain/EventCard` |
| Challenge card | `ChallengeCard` | `domain/ChallengeCard` |
| Kit card | `KitCard` | `domain/KitCard` |
| Participant card | `ParticipantCard` | `domain/ParticipantCard` |

### From Design Tokens

| Need | Use This | NOT This |
|------|----------|----------|
| Colors | `color.success`, `brandColor.landingPinkVibrant` | `#00FF00`, `'green'` |
| Spacing | `spacing.md`, `spacing['2xl']` | `16px`, `2rem` |
| Typography | `typography.size.sm` | `14px` |
| Border radius | `shape.md`, `shape.lg` | `8px` |

---

## Anti-Patterns (DON'T DO)

### ❌ Creating Custom Status Badges

```typescript
// DON'T - Custom status styled-component
export const EvidenceReviewStatus = styled.span<{ $status: string }>`
  background: ${({ $status }) => $status === 'approved' ? 'green' : 'red'};
  // ... more custom styles
`;

// DO - Use existing StatusBadge
import { StatusBadge } from '@components';
<StatusBadge status="approved" />
```

### ❌ Creating Custom Thumbnails

```typescript
// DON'T - Custom thumbnail from scratch
export const EvidenceThumbnail = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 4px;
  // ... reinventing the wheel
`;

// DO - Use or extend existing component
import { Image } from '@components';
// Or check if GalleryImageCard has reusable parts
```

### ❌ Custom Loading Spinners

```typescript
// DON'T - Custom spinner
export const LoadingSpinner = styled.div`
  animation: spin 1s linear infinite;
  // ... custom spinner styles
`;

// DO - Use existing loading component
import { AdminLoadingState } from '@components';
<AdminLoadingState message="Cargando..." />
```

### ❌ Hardcoded Colors/Spacing

```typescript
// DON'T
background-color: #FFE4E1;
padding: 16px;
color: green;

// DO
background-color: ${brandColor.landingPinkLight};
padding: ${spacing.md};
color: ${color.success};
```

---

## When to Create New Components

Create new ONLY when:

1. **No similar component exists** (verified by search)
2. **Existing component can't be extended** (composition not possible)
3. **Domain-specific needs** (e.g., `ChallengeProgressRing` unique to challenges)
4. **Significantly different behavior** (not just styling differences)

---

## Component Discovery Checklist

Before creating, check:

- [ ] `src/libs/presentation/components/common/` - Generic UI components
- [ ] `src/libs/presentation/components/domain/` - Business-specific cards
- [ ] `@components` exports - What's available via alias
- [ ] Similar screens - How do other screens solve this?
- [ ] Design tokens - Colors, spacing, typography

---

## Quick Reference: Common Imports

```typescript
// Badges
import {
  StatusBadge,           // approved/rejected/pending
  RoleBadge,             // owner/admin/participant
  EventStatusBadge,      // event lifecycle
  PaymentStatusBadge,    // payment states
  DeliveryStatusBadge,   // kit delivery states
  Badge,                 // generic badge
} from '@components';

// UI Components
import {
  Image,                 // Smart image with fallback
  Modal,                 // Dialog modal
  ConfirmDialog,         // Confirmation modal
  AdminLoadingState,     // Loading spinner
  TextField,             // Form input
  SelectField,           // Form select
  Button,                // Action button
} from '@components';

// Domain Cards
import {
  EventCard,
  ChallengeCard,
  KitCard,
  GalleryImageCard,
  ParticipantCard,
} from '@components';

// Design Tokens
import { color, brandColor, spacing, typography, shape } from '@constants';
```

---

## Benefits

1. **Consistency** - Same look across the app
2. **Maintenance** - Fix once, fixed everywhere
3. **Speed** - Don't rebuild what exists
4. **Bundle size** - No duplicate code
5. **Testing** - Existing components are tested

---

## Adaptation Strategy

### When to ADAPT (70%+ similar)

```typescript
// Step 1: Find similar file
// - user.repository.ts ✓ (80% similar to what we need)

// Step 2: Copy structure
// - Object literal pattern ✓
// - Transform functions ✓
// - Error handling ✓

// Step 3: Adapt entity-specific parts
// - Change entity name
// - Change field names
// - Adjust validation rules
```

### When to CREATE (< 70% similar)

Even when creating new, follow the EXACT pattern from similar files:
- Match import structure
- Match export pattern
- Match error handling
- Match naming conventions

---

## Reusability Checklist

### ✅ Always Reuse

- Helper functions (applyFilters, applyPagination, transform*)
- Error handling patterns (createAppError, handleUseCaseError)
- TODO comment structure
- Import organization
- Export patterns (barrel exports)
- Test structure (renderWithProviders, mock patterns)
- Middleware patterns (withAuthMiddleware)
- Validation logic (Zod schemas)

### ❌ Never Reuse (Create New)

- Entity-specific business logic
- Entity-specific field names
- Entity-specific validation rules
- Domain-specific constants

---

## Common Mistakes

### ❌ Creating Without Investigation

```typescript
// Creating new API route without checking existing patterns
export async function GET(request: NextRequest) { // Wrong pattern
  const data = await prisma.user.findMany(); // Direct Prisma!
  return NextResponse.json(data);
}

// Should have checked existing routes and found:
// - Named export with arrow function
// - Middleware usage
// - Use Case delegation
// - Error handling
```

### ❌ Ignoring Existing Helpers

```typescript
// Creating custom pagination logic
const paginated = items.slice(
  (page - 1) * limit,
  page * limit
);

// Should have found existing helper:
import { applyPagination } from '@helpers';
const paginated = applyPagination(items, { page, limit });
```

### ❌ Reinventing Error Handling

```typescript
// Creating custom error handler
try {
  await operation();
} catch (error) {
  console.log(error); // Wrong
  throw new Error('Operation failed'); // Wrong - English!
}

// Should have found existing pattern:
try {
  await operation();
} catch (error) {
  return handleUseCaseError(error, 'Operación falló');
}
```

---

## ROI: Time Investment

| Approach | Time | Result |
|----------|------|--------|
| Investigation | 2-5 min | Pattern-consistent code |
| Blind creation | 30+ min | Inconsistent, needs refactoring |
| Refactoring later | Hours | Technical debt, frustration |

**Investment**: 5 minutes of investigation = 10x faster, 100x more consistent

---

## Related Documentation

- **Pattern**: `investigation-first-protocol.md` - Detailed investigation protocol
- **Pattern**: `component-structure.md` - 5-file component structure
- **Pattern**: `code-sovereignty-patterns.md` - Architecture philosophy
- **Standard**: `.claude/patterns/core/ARCHITECTURE-STANDARDS.md`

---

**REMEMBER**: Search first, create second. The best code is code you don't write.
