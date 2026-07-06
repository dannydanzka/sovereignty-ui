# Investigation-First Protocol Pattern

**CRITICAL**: NEVER create code blindly. Always review existing patterns first.

## Core Principle

**Before creating ANY file** (component, route, hook, use case, repository, service):
1. **Identify file type**
2. **Find 2-3 similar files** (use Glob tool)
3. **Read completely**
4. **Identify patterns**
5. **Decide**: ADAPT (70%+ similar) or CREATE (following exact pattern)

## Why This Matters

- **Prevents duplication**: Existing solutions may already exist
- **Ensures consistency**: Follow established patterns
- **Maintains standards**: Architecture remains coherent
- **Reduces errors**: Proven patterns are battle-tested
- **Saves time**: Investigation (2-5 min) vs refactoring (hours)

## Investigation Protocol

### Step 1: Identify File Type
```bash
# What are you creating?
- API Route
- React Component
- Custom Hook
- Use Case
- Repository
- Service
- Middleware
- Helper/Utility
```

### Step 2: Find Similar Files
```bash
# Use Glob to find similar files

# API Routes
glob "src/app/api/admin/**/*.ts"
glob "src/app/api/public/**/*.ts"

# Components
glob "src/components/*/index.tsx"
glob "src/app/admin/components/*/index.tsx"

# Use Cases
glob "src/domain/use-cases/**/*.ts"

# Repositories
glob "src/infrastructure/repositories/**/*.ts"

# Hooks
glob "src/hooks/**/*.ts"
```

### Step 3: Read Completely
```bash
# Read 2-3 similar files from start to finish
# Focus on:
- Import patterns
- Type definitions
- Error handling
- Export patterns
- Function signatures
- Business logic structure
- Comments and TODOs
```

### Step 4: Identify Patterns

Check for:
- **Imports**: What aliases are used? Order?
- **Structure**: Arrow functions? Object literals?
- **Error handling**: try-catch? createAppError? handleUseCaseError?
- **Exports**: Named? Default? Barrel?
- **Types**: Where defined? How imported?
- **Middleware**: withAuthMiddleware? validateAndGetUser?
- **Logging**: logError? logUserActivity?
- **Testing**: Mock patterns? Setup functions?

### Step 5: Adapt or Create

**ADAPT (70%+ similar)**:
- Copy existing file
- Rename entity-specific parts
- Keep helper functions
- Keep error patterns
- Keep TODO structure
- Preserve imports/exports

**CREATE (< 70% similar)**:
- Follow EXACT pattern from similar files
- Match import structure
- Match export pattern
- Match error handling
- Match logging approach

## Examples by File Type

### API Route Investigation

**Before Creating**: `/api/admin/invoices/route.ts`

**Investigation**:
```bash
# Find similar admin routes
glob "src/app/api/admin/*/route.ts"

# Read these files:
- /api/admin/events/route.ts
- /api/admin/payment-methods/route.ts
- /api/admin/users/route.ts
```

**Pattern Checklist**:
- [ ] Uses `withAuthMiddleware`?
- [ ] Imports from `@middleware` and `@helpers`?
- [ ] try-catch with `logError`?
- [ ] `NextResponse.json()` for responses?
- [ ] `validateAndGetUser` for auth?
- [ ] Role enforcement (`user.role === 'admin'`)?
- [ ] Calls Use Case (not Repository directly)?
- [ ] Returns discriminated union?

**Result**: Copy `/api/admin/events/route.ts` structure, adapt for invoices

---

### Component Investigation

**Before Creating**: `InvoiceCard` component

**Investigation**:
```bash
# Find similar card components
glob "src/components/*Card/index.tsx"

# Read these files:
- components/UserCard/UserCard.tsx
- components/EventCard/EventCard.tsx
- components/PaymentCard/PaymentCard.tsx
```

**Pattern Checklist**:
- [ ] 5-file structure (tsx, styled, test, interfaces, index)?
- [ ] Styled components use `$` prefix for transient props?
- [ ] `useCallback` for handlers?
- [ ] Render functions for 4+ sections?
- [ ] Imports from `@components`, `@redux`, `@helpers`?
- [ ] Props alphabetically ordered?
- [ ] `renderWithProviders` or `render` in tests?

**Result**: Copy `UserCard` structure, adapt for Invoice entity

---

### Use Case Investigation

**Before Creating**: `executeCreateInvoice`

**Investigation**:
```bash
# Find similar create use cases
glob "src/domain/use-cases/*/create-*.ts"

# Read these files:
- use-cases/events/create-event.ts
- use-cases/users/create-user.ts
- use-cases/participants/create-participant.ts
```

**Pattern Checklist**:
- [ ] Arrow function export?
- [ ] Interface in `.interfaces.ts`?
- [ ] Uses `createAppError` (NOT `new AppError`)?
- [ ] Calls repository (NOT Prisma directly)?
- [ ] `logUserActivity` AFTER successful operation?
- [ ] Returns discriminated union `Result<T>`?
- [ ] Business validation before repository call?
- [ ] Spanish error messages?

**Result**: Copy `create-event.ts` structure, adapt for invoice

---

### Repository Investigation

**Before Creating**: `invoiceRepository`

**Investigation**:
```bash
# Find similar repositories
glob "src/infrastructure/repositories/*-repository.ts"

# Read these files:
- repositories/event-repository.ts
- repositories/user-repository.ts
- repositories/participant-repository.ts
```

**Pattern Checklist**:
- [ ] Object literal (NOT class)?
- [ ] Arrow functions for methods?
- [ ] Mock implementation with TODO comments?
- [ ] `simulateNetworkDelay()`?
- [ ] Implements interface from `.interfaces.ts`?
- [ ] Helper functions (applyFilters, applyPagination)?
- [ ] Spanish error messages?
- [ ] TODO: MIGRATE TO PRISMA comments?

**Result**: Copy `event-repository.ts`, adapt for invoice entity

---

### Custom Hook Investigation

**Before Creating**: `useInvoiceActions`

**Investigation**:
```bash
# Find similar action hooks
glob "src/hooks/use*Actions.ts"

# Read these files:
- hooks/useUserActions.ts
- hooks/useEventActions.ts
- hooks/useParticipantActions.ts
```

**Pattern Checklist**:
- [ ] Uses `useAppDispatch` and `useAppSelector`?
- [ ] Imports selectors from `@redux/selectors`?
- [ ] Imports actions from `@redux/actions`?
- [ ] Returns object with state + handlers?
- [ ] `useCallback` for handler functions?
- [ ] Memoized selectors?

**Result**: Copy `useUserActions.ts`, adapt for invoice

---

## Reusability Checklist

### ✅ Always Reuse
- Helper functions (applyFilters, applyPagination, transform*)
- Error handling patterns
- TODO comment structure
- Import organization
- Export patterns
- Test structure
- Mock setup functions
- Middleware patterns
- Validation logic

### ❌ Never Reuse
- Entity-specific business logic
- Entity-specific field names
- Entity-specific validation rules
- Domain-specific constants

## Adaptation Strategy

### Example: Creating Evidence Repository

```typescript
// Step 1: Find similar repositories
// - enrollmentRepository ✓ (80% similar)
// - userRepository ✓ (70% similar)
// - eventRepository ✓ (75% similar)

// Step 2: Analyze reusability
// - Object literal pattern ✓
// - Arrow functions ✓
// - applyFilters helper ✓
// - applyPagination helper ✓
// - simulateNetworkDelay ✓
// - TODO comments ✓
// - Interface implementation ✓

// Step 3: ADAPT (copy enrollmentRepository)
export const evidenceRepository: EvidenceRepository = {
  findAll: async (filters?) => {
    await simulateNetworkDelay();

    // TODO: MIGRATE TO PRISMA
    // await prisma.evidence.findMany({ where: filters })

    const filtered = filters
      ? applyFilters(mockEvidenceData, filters)
      : mockEvidenceData;

    return applyPagination(filtered, filters?.pagination);
  },

  create: async (data) => {
    await simulateNetworkDelay();

    // TODO: MIGRATE TO PRISMA
    // await prisma.evidence.create({ data })

    const newEvidence = {
      id: generateId(),
      ...data,
      createdAt: new Date(),
    };

    mockEvidenceData.push(newEvidence);
    return newEvidence;
  },
};

// Result: 90% less code, 100% pattern consistency
```

## Validation After Creation

```bash
# Verify pattern consistency
yarn type-check  # 0 errors
yarn lint --fix  # 0 errors, 0 warnings
yarn test        # All passing

# Compare with reference file
diff src/repositories/evidence-repository.ts \
     src/repositories/enrollment-repository.ts
# Should show only entity-specific changes
```

## Common Mistakes

### ❌ Creating Without Investigation
```typescript
// Creating new API route without checking existing patterns
export async function GET(request: NextRequest) { // Wrong pattern
  const data = await prisma.invoice.findMany(); // Direct Prisma
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
  throw new Error('Operation failed'); // Wrong
}

// Should have found existing pattern:
try {
  await operation();
} catch (error) {
  logError(error, 'operationName');
  throw createAppError({}, 'Operación falló');
}
```

## Quick Commands

```bash
# Find all API routes
find src/app/api -name "route.ts" -type f

# Find all components
find src/components -name "index.tsx" -type f

# Find all use cases
find src/domain/use-cases -name "*.ts" -type f

# Find all repositories
find src/infrastructure/repositories -name "*repository.ts" -type f

# Search for pattern (e.g., middleware usage)
grep -r "withAuthMiddleware" src/app/api

# Search for error handling
grep -r "handleUseCaseError" src/domain/use-cases
```

## Zero Tolerance

**NEVER create code blindly without investigation.**

This violates:
- Professional standards
- Code consistency
- Architectural integrity
- Team collaboration

**Always investigate → understand → adapt → create**

**Time Investment**:
- Investigation: 2-5 minutes
- Blind creation + refactoring: Hours
- Technical debt: Days/Weeks

**ROI**: Investigation first = 10x faster, 100x more consistent

---

## See also

**Standards**:
- `docs/development-standards/TODO-STANDARDS.md` - TODO discipline, investigation-first

**Patterns**:
- `todo-management.md` - TODO management patterns
- `nextjs-typescript-architecture.md` - Architecture reference

---

**Lines**: ~200 | **Status**: ✅ Verified (investigation-first protocol)
