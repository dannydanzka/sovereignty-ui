# ESLint Custom Rules

> **Module**: frontend/tooling
> **Philosophy**: Code Sovereignty enforcement via static analysis
> **Rules**: 19 custom rules

---

## TL;DR

**DO**:
- Run `yarn lint` before committing
- Use `--fix` for auto-corrections
- Follow rule suggestions (they enforce architecture)
- Override per-file when justified

**DON'T**:
- `eslint-disable` without good reason
- Ignore architectural warnings
- Skip lint step in CI/CD

---

## Why Custom Rules

Standard ESLint can't enforce:
- Clean Architecture boundaries
- Project-specific conventions
- Design system compliance
- Error handling quality

Custom rules provide automatic pattern enforcement at development time.

---

## Rule Categories

### Architecture (7 rules)

| Rule | Purpose |
|------|---------|
| `architecture-boundaries` | Layer violations, cross-context imports |
| `no-direct-service-calls` | Components → Redux → Service |
| `use-case-policy` | Arrow functions + activity logging |
| `import-strategy` | No deep relative imports |
| `index-barrel-exports-only` | `export *` only in index.ts |

### Code Quality (8 rules)

| Rule | Purpose |
|------|---------|
| `no-try-catch-abuse` | Catch blocks MUST log errors |
| `no-obvious-comments` | Clean Code (WHY not WHAT) |
| `no-underscore-prefix` | Log error OR parameterless catch |
| `require-file-header` | JSDoc header required |
| `no-inline-types` | Types in .interfaces.ts |

### Modularization (4 rules)

| Rule | Purpose |
|------|---------|
| `max-lines-per-file` | 350 lines max |
| `max-lines-per-function` | 50 lines max |
| `max-jsx-return-lines` | 50 lines max |
| `enforce-hook-composition` | Max 15 state vars |

### Design System (3 rules)

| Rule | Purpose |
|------|---------|
| `no-hardcoded-colors` | Use color tokens |
| `no-hardcoded-spacing` | Use spacing tokens |
| `no-native-html` | Styled-components only |

---

## Architecture Enforcement

```typescript
// ❌ Cross-context import
import { AdminComponent } from '@app-admin/components';  // In public context

// ✅ Elevate to shared
import { SharedComponent } from '@components';

// ❌ Direct service call in component
const data = await userService.getUsers();

// ✅ Through Redux
dispatch(fetchUsers());
```

---

## Design System Enforcement

```typescript
// ❌ Hardcoded
background: #FFC107;
padding: 24px;

// ✅ Tokens
background: ${color.primary500};
padding: ${spacing.md};
```

---

## Error Handling Enforcement

```typescript
// ❌ Silent catch
catch (error) { }

// ❌ Silent re-throw
catch (error) { throw error; }

// ✅ Log before handling
catch (error) {
  console.error('Operation failed:', error);
  return handleUseCaseError(error, 'context');
}
```

---

## Comment Policy

```typescript
// ❌ Obvious comments
// Get user by ID
const user = await repo.findById(id);

// ✅ Exceptions allowed
// TODO: Migrate to Prisma
// FIXME: Race condition

// ✅ JSDoc for valuable context
/**
 * Fallback to basic fingerprint.
 * FingerprintJS has rate limits.
 */
```

---

## File-Specific Overrides

```javascript
// Test files - relaxed limits
{ files: ['**/*.test.{ts,tsx}'], rules: {
  'custom/max-lines-per-function': ['warn', { max: 75 }],
  'custom/max-lines-per-file': ['warn', { max: 500 }],
}}

// Mock files - no limits
{ files: ['**/mocks/**/*.{ts,tsx}'], rules: {
  'custom/max-lines-per-file': ['warn', { max: 500 }],
}}
```

---

## Commands

```bash
yarn lint           # Run all rules
yarn lint --fix     # Auto-fix
```

---

## Related

- `frontend/presentation/styling/design-tokens.md` - Token usage
- `core/quality/error-handling.md` - Error handling patterns

