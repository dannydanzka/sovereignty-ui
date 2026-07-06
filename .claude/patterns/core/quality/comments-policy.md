# Comments Policy Pattern

> **Purpose**: Define when comments are valid based on Clean Code, SOLID, and Clean Architecture
> **Philosophy**: "Code that explains itself needs no comments. Comments exist only for what code cannot express."
> **ESLint Enforcement**: `custom/comments-policy` (optional - see eslint-custom-rules-patterns.md)
> **Updated**: 2026-03-11

---

## Core Principle

> "A comment is a failure to express yourself in code." — Robert C. Martin, Clean Code

**The goal is not zero comments, but zero _unnecessary_ comments.**

---

## When Comments Are VALID ✅

### 1. File Headers (MANDATORY for Complex Files)

Complex files SHOULD have a JSDoc header providing context:

```typescript
/**
 * UserAuthService
 * Handles user authentication, session management, and token refresh.
 * Integrates with Firebase Auth and manages JWT lifecycle.
 */
```

**Why?**
- Files need context that code structure alone cannot provide
- Explains the "why" of the file's existence
- Helps developers understand scope before reading code

**Exempt files:**
- `index.ts` (barrel exports are self-explanatory)
- `.d.ts` (type declarations)
- `*.config.ts` (config files)
- `*.test.ts` (test files - test names are documentation)
- `__mocks__/` (mock files)
- Simple utility files (<50 lines)

---

### 2. Non-Obvious Business Logic

When code implements a business rule that isn't immediately apparent:

```typescript
/**
 * Orders placed after 2 PM are processed next business day.
 * This is a fulfillment center constraint, not a system limitation.
 * @see https://confluence.company.com/fulfillment-sla
 */
const getProcessingDate = (orderTime: Date): Date => {
  const cutoffHour = 14;
  if (orderTime.getHours() >= cutoffHour) {
    return getNextBusinessDay(orderTime);
  }
  return orderTime;
};
```

---

### 3. Workarounds and Technical Debt

When code exists due to external constraints:

```typescript
/**
 * HACK: Safari doesn't support date input on iOS < 15.
 * Using text input with manual parsing as fallback.
 * Remove when iOS 14 support is dropped (Q3 2024).
 * @see https://bugs.webkit.org/show_bug.cgi?id=12345
 */
```

---

### 4. Complex Algorithms

When the algorithm isn't obvious from reading the code:

```typescript
/**
 * Implements Levenshtein distance for fuzzy product search.
 * Allows up to 2 character differences for typo tolerance.
 * Time complexity: O(m*n) where m,n are string lengths.
 */
const calculateEditDistance = (a: string, b: string): number => {
  // Algorithm implementation...
};
```

---

### 5. API Contracts and Integration Points

When interfacing with external systems:

```typescript
/**
 * Payment gateway webhook handler.
 *
 * Expected payload from Stripe:
 * - event.type: 'payment_intent.succeeded' | 'payment_intent.failed'
 * - event.data.object.metadata.orderId: string
 *
 * Must respond within 5 seconds or Stripe will retry.
 * @see https://stripe.com/docs/webhooks
 */
```

---

### 6. Pragmas (Development Markers)

Allowed inline comments for tracking work. **Note**: `TODO`, `FIXME`, and `HACK` trigger
`no-warning-comments` ESLint warnings by design (forces resolution). Use alternative markers
for intentionally deferred work:

```typescript
/** Actionable markers (trigger ESLint warning — resolve before merge): */
// TODO: Implement pagination when product count exceeds 1000
// FIXME: Race condition when user clicks twice quickly
// HACK: Temporary workaround for API v2 migration

/** Deferred markers (do NOT trigger warning — accepted technical debt): */
/** IMPLEMENT: S3/R2 Upload */           // Mock/stub awaiting real implementation
/** Pending: soft delete (requires schema migration) */  // Blocked by infra
// NOTE: This order matters - catalog must load before products

/** TypeScript pragmas: */
// @ts-expect-error: Legacy API returns mixed types, typed in v3
```

**Rule of thumb**: If it can be fixed now, use `TODO:`. If it's blocked by external
factors (schema migration, dependency, infra), use `/** IMPLEMENT: */` or `/** Pending: */`.

---

## When Comments Are FORBIDDEN ❌

### 1. Obvious Comments (Code Repeats Itself)

```typescript
// ❌ BAD - States the obvious
// Get user by ID
const getUserById = (id: string) => { ... };

// ❌ BAD - Repeats the variable name
// User name
const userName = user.name;

// ❌ BAD - Describes what code literally does
// Loop through products
products.forEach(product => { ... });

// ❌ BAD - Comments on property names
interface User {
  /** User's email address */
  email: string;  // The property name IS the documentation

  /** Whether the user is active */
  isActive: boolean;  // Boolean name already explains
}
```

---

### 2. Section Dividers

```typescript
// ❌ BAD - Visual noise
// ===================================
// HELPER FUNCTIONS
// ===================================

// ❌ BAD - Section markers
// --- Validation ---

// ❌ BAD - Separators
// *************************
```

**Instead**: Use file organization. If you need sections, split into files.

---

### 3. Commented-Out Code

```typescript
// ❌ BAD - Dead code creates confusion
// const oldImplementation = () => { ... };

// ❌ BAD - "Just in case" code
// if (featureFlag.isEnabled('oldFlow')) {
//   return legacyHandler();
// }
```

**Instead**: Delete it. Git has history. Feature flags have configs.

---

### 4. Change History

```typescript
// ❌ BAD - Git does this better
// Modified by John on 2024-01-15 to add validation
// Updated by Jane on 2024-02-20 to fix null check

// ❌ BAD - Version tracking in comments
// v1.0: Initial implementation
// v1.1: Added error handling
// v2.0: Refactored for performance
```

**Instead**: Use git commits and PR descriptions.

---

### 5. Self-Documenting Code Patterns

When code structure IS the documentation:

```typescript
// ❌ BAD - Function name already says this
// Validates the user email format
const validateUserEmail = (email: string): boolean => { ... };

// ✅ GOOD - Let the function name speak
const validateUserEmail = (email: string): boolean => { ... };
```

---

## Object Properties: Special Rules

### No Comments Above Properties

```typescript
// ❌ BAD - Breaks alphabetical sorting, wastes space
const config = {
  /** API endpoint */
  apiUrl: 'https://api.example.com',

  /** Request timeout in ms */
  timeout: 5000,
};

// ✅ GOOD - Inline comment if truly needed
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000, // milliseconds
};

// ✅ BEST - Self-documenting property names
const config = {
  apiUrl: 'https://api.example.com',
  timeoutMs: 5000,
};
```

---

## Clean Code Naming Strategy

Instead of comments, use expressive names:

### Variables

```typescript
// ❌ BAD
const d = 86400000; // milliseconds in a day

// ✅ GOOD
const MILLISECONDS_PER_DAY = 86400000;
```

### Functions

```typescript
// ❌ BAD
// Checks if user can access the resource
const check = (user, resource) => { ... };

// ✅ GOOD
const canUserAccessResource = (user: User, resource: Resource): boolean => { ... };
```

### Booleans

```typescript
// ❌ BAD
const flag = true; // Whether the user is logged in

// ✅ GOOD
const isUserLoggedIn = true;
const hasPermission = false;
const shouldRetry = true;
const canEdit = false;
```

### Constants

```typescript
// ❌ BAD
const MAX = 100; // Maximum number of items per page

// ✅ GOOD
const MAX_ITEMS_PER_PAGE = 100;
const DEFAULT_TIMEOUT_MS = 5000;
const MIN_PASSWORD_LENGTH = 8;
```

---

## Decision Tree: Should I Comment?

```
Is the code self-explanatory?
├── YES → No comment needed
└── NO → Can I rename to make it clear?
    ├── YES → Rename, no comment
    └── NO → Can I restructure the code?
        ├── YES → Restructure, no comment
        └── NO → Is it a business rule?
            ├── YES → Add JSDoc explaining the "why"
            └── NO → Is it a workaround/hack?
                ├── YES → Add HACK/TODO with context
                └── NO → Is it a complex algorithm?
                    ├── YES → Add JSDoc explaining approach
                    └── NO → Probably don't need a comment
```

---

## Examples by File Type

### Component File

```typescript
/**
 * UserProfileCard
 * Displays user avatar, name, and quick stats.
 * Used in header, sidebar, and user list views.
 */

export const UserProfileCard: FC<UserProfileCardProps> = ({
  user,
  onEdit,
  showStats = true,
}) => {
  // Implementation...
};
```

### Service File

```typescript
/**
 * AuthenticationService
 * Handles login, logout, token refresh, and session management.
 * Integrates with Firebase Auth for identity and custom JWT for API access.
 */

export const createAuthService = (firebase: FirebaseApp) => ({
  login: async (credentials: Credentials) => { ... },
  logout: async () => { ... },
  refreshToken: async () => { ... },
});
```

### Hook File

```typescript
/**
 * useDebounce
 * Delays updating a value until after a specified wait time.
 * Useful for search inputs to reduce API calls.
 */

export const useDebounce = <T>(value: T, delay: number): T => {
  // Implementation...
};
```

### Use Case File

```typescript
/**
 * executeCreateUser
 * Creates a new user with validation and role assignment.
 * Enforces RBAC: only owner can create admins, admins can create participants.
 */

export const executeCreateUser = async (
  request: CreateUserRequest,
  authUser: AuthUser
): Promise<UseCaseResult<UserEntity>> => {
  // Implementation...
};
```

---

## Summary

| Aspect | Rule |
|--------|------|
| **File headers** | RECOMMENDED for complex files (except index, tests, mocks, configs) |
| **Single-line comments** | FORBIDDEN (except pragmas: TODO, FIXME, HACK, NOTE — see pragma conventions above) |
| **Business rules** | Document the "why" with JSDoc |
| **Algorithms** | Document complexity and approach |
| **Workarounds** | Use HACK/TODO with context and links |
| **Obvious code** | No comments - let names speak |
| **Object properties** | No comments above, keep compact |

---

## Related Documentation

- **ESLint**: See `eslint-custom-rules-patterns.md` for automated enforcement
- **Standard**: `.claude/patterns/core/COMMENTS-POLICY-STANDARDS.md` (if created)
- **Pattern**: `code-quality-standards.md` - General quality principles

---

> **Remember**: The best comment is the one you didn't have to write because your code was clear enough.
