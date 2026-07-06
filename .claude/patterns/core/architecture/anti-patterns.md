# Architecture Anti-Patterns

> **Module**: core/architecture
> **ESLint**: `custom/architecture-boundaries`, `custom/no-direct-service-calls`
> **Created**: 2026-03-11
> **Version**: 1.0

---

## TL;DR

Detected anti-patterns that bypass Clean Architecture boundaries.
Each has an ESLint rule that enforces the correct pattern.

---

## 1. Dependency Inversion: libs → apps Import

**Violation**: Code in `libs/` importing from `apps/` — breaks the foundational rule that
dependencies flow `apps → libs`, never the reverse.

```typescript
/** ❌ WRONG: libs importing from apps */
// File: src/libs/presentation/components/layout/Header.tsx
import { NotificationBell } from '@apps/public/presentation/components/notifications';

/** ✅ CORRECT: Move shared component to libs */
// File: src/libs/presentation/components/common/notifications/NotificationBell.tsx
import { NotificationBell } from '../../common/notifications';
```

**Root cause**: Component was initially built in an app context but later needed by `libs`.
Instead of moving it, a cross-boundary import was added.

**Detection**: `custom/architecture-boundaries` rule — `libs` context is blocked from importing
any `@apps/*` or `/apps/*/` path.

**Fix**: Move the component (and its dependency tree) to `libs/`.

---

## 2. Direct Service/HTTP Calls in Presentation Layer

**Violation**: Components calling services, `fetch()`, `axios`, or project HTTP wrappers
(e.g., `handleRequest()`) directly, bypassing the state management layer.

```typescript
/** ❌ WRONG: Direct service call in component */
const FaqScreen = () => {
  const [faqs, setFaqs] = useState([]);
  useEffect(() => {
    PublicFaqsService.getAll().then(setFaqs);
  }, []);
};

/** ❌ WRONG: Direct HTTP wrapper in component */
const MyScreen = () => {
  useEffect(() => {
    handleRequest({ url: '/api/data' }).then(setData);
  }, []);
};

/** ✅ CORRECT: Via Redux thunk + selector */
const FaqScreen = () => {
  const dispatch = useAppDispatch();
  const faqs = useAppSelector(selectActiveFaqs);
  useEffect(() => {
    dispatch(fetchFaqs());
  }, [dispatch]);
};
```

**Data flow**: `Component → Redux Hook → Thunk → Service → API`

**Detection**: `custom/no-direct-service-calls` rule — detects `*Service.*()`, `fetch()`,
`axios.*()`, and configurable function names (e.g., `handleRequest`).

**Justified exceptions** (configured per project in `eslint.config.js`):
- Auth bootstrap providers (run before state management is ready)
- Payment/checkout screens (external API redirects, one-time operations)
- File upload components (FormData, stream-based — not cacheable)
- Bridge layer hooks (`.ts` files in `/hooks/` or with `use*` prefix — they ARE the abstraction)

---

## 3. Blanket ESLint Exceptions

**Violation**: Exempting entire categories of files from ESLint rules instead of specific,
justified individual exceptions.

```javascript
/** ❌ WRONG: All screens and all modals exempt */
filename.includes('/screens/') || filename.endsWith('Modal.tsx');

/** ✅ CORRECT: Specific files with documented justification */
// eslint.config.js
allowedPathPatterns: [
  '/PaymentScreen/',       // Stripe checkout redirect
  '/AuthProvider/',        // Bootstrap before Redux
]
```

**Root cause**: When a rule first detects violations, the temptation is to silence them
with broad exceptions rather than fix the violations or create targeted exceptions.

**Fix**: ESLint rules should be agnostic. Project-specific exceptions go in `eslint.config.js`
via schema options (e.g., `allowedPathPatterns`), not hardcoded in rule files.

---

## 4. Cross-Context Imports

**Violation**: Code in one app context importing from another.

```typescript
/** ❌ WRONG: admin importing from public */
// File: src/apps/admin/presentation/screens/Dashboard.tsx
import { EventCard } from '@apps/public/presentation/components';

/** ✅ CORRECT: Shared component in libs */
import { EventCard } from '@components';
```

**Detection**: `custom/architecture-boundaries` rule — contexts are detected dynamically
from `/apps/{context}/` path pattern.

**Allowed**: `shared` context (`apps/shared/`) is always importable from any context.

---

## 5. Dual-Alias Imports

**Violation**: Same symbol importable from two different paths (barrel re-exports a module
that also has its own dedicated alias).

```typescript
/** ❌ WRONG: Two paths to same symbol */
import { createManagedThunk } from '@helpers';  // Via barrel
import { createManagedThunk } from '@thunks';   // Via dedicated alias
```

**Full documentation**: `core/quality/error-handling.md` → Anti-Patterns section.

**Rule**: If a module has a dedicated alias, remove its `export *` from parent barrels.

---

## ESLint Rule Configuration

### Agnostic Rules (zero project-specific code)

| Rule | What It Detects | Configuration |
|------|----------------|---------------|
| `architecture-boundaries` | Cross-context, cross-layer, domain impurity | None needed — fully agnostic |
| `no-direct-service-calls` | Service/HTTP calls in components | `allowedPathPatterns`, `httpCallNames`, `serviceSuffix` |

### Per-Project Configuration

When replicating these rules to a new project, the rule files (`scripts/eslint-rules/*.js`)
require ZERO modifications. All project-specific exceptions are configured in `eslint.config.js`:

```javascript
// eslint.config.js
rules: {
  'custom/no-direct-service-calls': ['warn', {
    // Paths where direct calls are justified (String.includes match)
    allowedPathPatterns: [
      '/providers/AuthProvider/',    // Auth bootstrap
      '/PaymentScreen/',             // External API redirect
    ],
    // Project's HTTP wrapper function name(s)
    httpCallNames: ['handleRequest'],
    // Service class suffix (default: 'Service')
    serviceSuffix: 'Service',
  }],
}
```

---

## Related

- `core/architecture/clean-architecture.md` — Layer rules (what TO do)
- `core/quality/error-handling.md` — Dual-alias anti-pattern details
- `frontend/infrastructure/state/redux.md` — Redux thunk patterns
- `frontend/infrastructure/services.md` — Service layer patterns
