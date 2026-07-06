# ESLint Custom Rules Reference

> **Module**: frontend/tooling
> **Version**: 5.0
> **Updated**: 2026-06-19
> **Philosophy**: Code Sovereignty enforcement through static analysis
> **Total Rules**: 40 custom rules

> **v5.0 (2026-06-19)** — Catalog reconciled with rule files (was 19, actual 40). Imported from Betterware (FP-adjusted, adapted to our RTK/Vitest ecosystem): `no-utility-type-cast` (+Vitest mock exemption), `no-jsx-in-non-component-files` (+`.types.`), `enforce-filename-convention` (dearadry-adapted dir map, saga dirs removed). Modified: `no-try-catch-abuse` (+`console.warn` handler), `component-organization` (+HELPERS POLICY). See **Full Rule Inventory** below for the authoritative list.

---

## Code Sovereignty: The Foundation

These ESLint rules are the **enforcement layer** of Code Sovereignty - they prevent architectural violations at development time, not runtime. Each layer has sovereignty over its domain, like nations at peace.

### 6 Sovereignty Principles → ESLint Rules

| Sovereignty Principle | Primary Rule | What It Enforces |
|-----------------------|--------------|------------------|
| **Territorial Integrity** | `architecture-boundaries` | Each layer owns its domain exclusively |
| **Non-Intervention** | `architecture-boundaries` | Dependencies point inward only (Domain ← Infra ← UI) |
| **Self-Sufficiency** | `enforce-hook-composition` | Modules self-sufficient within their domain |
| **Clear Borders** | `use-case-policy` | Interfaces = treaties between layers |
| **Trade Agreements** | `import-strategy` | Data flows through defined protocols (barrels) |
| **Secure Trade** | `no-direct-service-calls` | Request what you need, receive exactly that |

### The Analogy: War vs Peace

```
┌─────────────────────────────────────────────────────────────┐
│  WORLD AT WAR (Coupled)           WORLD AT PEACE (Sovereign)│
├─────────────────────────────────────────────────────────────┤
│  UI → Database directly            UI → Redux → Service     │
│  Domain imports Prisma             Domain is pure           │
│  admin imports public              Shared code in libs/     │
│  Hardcoded colors                  Design tokens            │
│  Changes cascade everywhere        Changes isolated         │
│  Testing requires full system      Each layer testable      │
└─────────────────────────────────────────────────────────────┘
```

---

## Overview

These custom ESLint rules enforce **Code Sovereignty** principles through static analysis. They prevent architectural violations at development time, not runtime.

### Full Rule Inventory (40)

Authoritative list — one row per file in `frontend/tooling/eslint-rules/`. Detailed sections below cover the architecture/quality core; this table is the source of truth for the count.

| # | Rule | Group | Purpose |
|---|------|-------|---------|
| 1 | `architecture-boundaries` | Architecture | Context isolation + layer hierarchy + domain purity (inward deps only) |
| 2 | `no-direct-service-calls` | Architecture | Services only via the sanctioned layer, not directly in components |
| 3 | `use-case-policy` | Architecture | Use Case purity: arrow fns, no direct repo/infra access |
| 4 | `no-raw-supabase-client` | Architecture | Centralized Supabase client via `getStorageClient`, no raw client |
| 5 | `redux-naming-policy` | State | Redux/RTK naming conventions (slices, actions, selectors) |
| 6 | `no-redux-in-components` | State | No `useSelector`/`useDispatch`/selector imports in components — use hooks |
| 7 | `code-size-limits` | Quality | Max lines per file / function / JSX return |
| 8 | `enforce-hook-composition` | Quality | Hook complexity limits (callbacks, state vars, lines) |
| 9 | `component-organization` | Quality | Types→`.interfaces`, constants→`.constants`, **helpers→`.helpers`** (HELPERS POLICY) |
| 10 | `no-utility-type-cast` | Type Safety | No `as Parameters/ReturnType/ComponentProps<…>` casts (import the interface) |
| 11 | `no-jsx-in-non-component-files` | Artifact Boundary | No JSX in `.helpers/.constants/.interfaces/.types/.styled` files |
| 12 | `enforce-filename-convention` | Naming | Dir→segment map (repository/use-case/slice/entity) + singular→plural typos |
| 13 | `design-tokens-policy` | Component | Design tokens for color/spacing, no hardcoded values |
| 14 | `no-native-html` | Component | Use design-system components, not raw HTML elements |
| 15 | `no-inline-styles` | Component | No inline `style={}`; use styled-components |
| 16 | `require-use-client-directive` | Component | `'use client'` where client features are used |
| 17 | `enforce-zod-forms` | Forms | react-hook-form + Zod for all form validation |
| 18 | `no-hardcoded-ui-strings` | i18n | UI text via i18n keys, not literals |
| 19 | `prefer-i18n-keys-in-errors` | i18n | Error messages reference i18n keys |
| 20 | `no-english-in-mock-errors` | i18n | Mock error strings follow locale policy |
| 21 | `comments-policy` | Style | File headers required, no obvious/redundant comments |
| 22 | `no-underscore-prefix` | Style | No `_`-prefixed identifiers |
| 23 | `no-try-catch-abuse` | Style | Catch must log/handle (allows `console.error`/**`console.warn`**); no silent/nested |
| 24 | `no-eslint-disable` | Style | No `// eslint-disable` without authorization |
| 25 | `no-magic-literal-comparison` | Style | No magic literals in comparisons |
| 26 | `no-emojis-in-jsx` | Style | No emoji in JSX; use icons |
| 27 | `no-alias-exports` | Imports | No re-export under a different name |
| 28 | `import-strategy` | Imports | Barrel/relative-depth import discipline |
| 29 | `custom-import-order` | Imports | Grouped, ordered imports |
| 30 | `index-barrel-exports-only` | Imports | `index.ts` is barrel-only |
| 31 | `essential-testing` | Testing | Essential test patterns; no verbose tests |
| 32 | `e2e-testing-policy` | Testing | Playwright E2E best practices |
| 33 | `prefer-mocked-helper` | Testing | `mocked()` helper over `as Mock`/`as Mocked<>` |
| 34 | `prefer-user-helper` | Testing | Centralized `user` event helper |
| 35 | `prefer-centralized-assertions` | Testing | Centralized assertion helpers |
| 36 | `prefer-once-in-test` | Testing | `mockResolvedValueOnce`-style discipline |
| 37 | `no-inline-hook-mock-factory` | Testing | No inline hook mock factories |
| 38 | `no-redundant-global-mocks` | Testing | No redundant global mocks |
| 39 | `no-redundant-clear-mocks` | Testing | No redundant `clearMocks` (config-driven) |
| 40 | `no-await-import-in-beforeeach` | Testing | No `await import()` in `beforeEach` |

> Rules **10, 11, 12** were imported from Betterware (2026-06-19) and adapted to our ecosystem. Rules **9, 23** were modified with Betterware FP-adjustments. All five intro at `'warn'`. See dedicated sections at the end of this document.

### Rule Categories

| Category | Rules | Purpose |
|----------|-------|---------|
| **Architecture** | 2 | `architecture-boundaries` (unified), `no-direct-service-calls` |
| **Code Quality** | 2 | `code-size-limits` (unified), `enforce-hook-composition` |
| **Component Patterns** | 4 | `design-tokens-policy` (unified), `component-organization` (unified), `no-native-html`, `require-use-client-directive` |
| **Use Cases** | 1 | `use-case-policy` (unified) |
| **Code Style** | 4 | `comments-policy`, `no-underscore-prefix`, `no-try-catch-abuse`, `no-eslint-disable` |
| **Imports** | 3 | `import-strategy`, `import-order`, `index-barrel-exports-only` |
| **Testing** | 1 | `essential-testing` |
| **UI** | 2 | `no-emojis-in-jsx`, `no-redux-in-components` |

### v3.0 Changes (2026-01-19)

**MAJOR CONSOLIDATION - 12 rules → 5 unified rules**:

| Unified Rule | Replaces | Philosophy |
|--------------|----------|------------|
| `architecture-boundaries` | `no-cross-context-imports` + `no-cross-layer-imports` + `no-domain-framework-deps` | Code Sovereignty in one rule |
| `code-size-limits` | `max-lines-per-file` + `max-lines-per-function` + `max-jsx-return-lines` | All size limits unified |
| `design-tokens-policy` | `no-hardcoded-colors` + `no-hardcoded-spacing` | Design system compliance |
| `use-case-policy` | `enforce-use-case-pattern` + `enforce-use-case-isolation` | Use case purity |
| `component-organization` | `no-inline-types` + `no-inline-constants` | File organization |

**Previous consolidations** (v2.1):
- `import-strategy`: Unified `no-deep-relative-imports` + `prefer-barrel-imports`
- `comments-policy`: Unified `require-file-header` + `no-obvious-comments` + `no-blank-lines-in-object-return`

---

## Architecture Enforcement Rules

### 1. `architecture-boundaries` UNIFIED (v3.0)

**Purpose**: Unified Code Sovereignty enforcement - context isolation + layer hierarchy + domain purity

**Consolidates**: `no-cross-context-imports` + `no-cross-layer-imports` + `no-domain-framework-deps`

**Three Sovereignty Principles**:

| Principle | Rule | Violation |
|-----------|------|-----------|
| **Context Isolation** | Contexts cannot import each other | admin ↔ public ↔ auth |
| **Layer Hierarchy** | Inner layers cannot import outer | Domain ← Infrastructure |
| **Domain Purity** | Domain has NO framework deps | React, Next.js, Prisma forbidden |

**Forbidden - Context Isolation**:
```typescript
// ❌ In admin context, importing from public
import { PublicComponent } from '@app-public/components';
// Error: Cross-context import forbidden (admin ↔ public). Move shared code to libs/.
```

**Forbidden - Layer Hierarchy**:
```typescript
// ❌ Domain importing from Infrastructure
// File: src/libs/domain/entities/user.entity.ts
import { prisma } from '@database';
// Error: domain cannot import infrastructure. Inner layers cannot know about outer layers.
```

**Forbidden - Domain Purity**:
```typescript
// ❌ Domain importing framework dependencies
// File: src/apps/admin/domain/use-cases/get-user.use-case.ts
import { useState } from 'react';
// Error: Domain layer cannot import 'react' (React). Domain must be pure.
```

**Allowed in Domain**:
- Pure TypeScript utilities
- Type-only imports (`import type`)
- Zod (only in `/domain/validation/`)

**Messages**:
- `crossContext`: "Cross-context import forbidden (X ↔ Y). Move shared code to libs/."
- `crossLayer`: "X cannot import Y. Inner layers cannot know about outer layers."
- `domainFramework`: "Domain layer cannot import 'X' (Y). Domain must be pure."
- `directPath`: "Direct path imports forbidden. Use aliases: @app-admin/*, @components/*"

---

### 2. `no-direct-service-calls`

**Purpose**: Enforce Redux flow for data fetching

**Forbidden**:
```typescript
// ❌ Direct API call in component
const UserList = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch('/api/users').then(res => setUsers(res.data));
  }, []);
};
```

**Required**:
```typescript
// ✅ Use Redux flow
const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
};
```

**Flow**: Component → Hook → Redux Thunk → Service → handleRequest → API

---

### 3. `use-case-policy` UNIFIED (v3.0)

**Purpose**: Unified Use Case enforcement - pattern + isolation

**Consolidates**: `enforce-use-case-pattern` + `enforce-use-case-isolation`

**Pattern Enforcement**:
```typescript
// ✅ CORRECT - Exported async arrow function
export const executeGetUsers = async (params: GetUsersParams): Promise<GetUsersResponse> => {
  const authResult = await validateAndGetUser(params.request, [USER_ROLES.ADMIN]);
  const result = await userRepository.findMany(filters, pagination);
  return { success: true, data: result };
};

// ❌ FORBIDDEN - Classes
export class GetUsersUseCase { }
// Error: Classes forbidden in Use Cases. Use: export const execute = async () => {}

// ❌ FORBIDDEN - Function keyword
export function executeGetUsers() { }
// Error: Function keyword forbidden for exports.

// ❌ FORBIDDEN - 'this' keyword
export const executeGetUsers = async () => {
  this.doSomething();  // ← FORBIDDEN
};
// Error: 'this' forbidden in Use Cases. Use stateless arrow functions.
```

**Isolation Enforcement**:
```typescript
// ❌ FORBIDDEN - Direct repository imports
import { userRepository } from './repositories/user.repository';
// Error: Use repository interfaces, not implementations.

// ❌ FORBIDDEN - Prisma imports
import { prisma } from '@prisma/client';
// Error: Use repository pattern, not Prisma directly.

// ✅ ALLOWED - Type-only imports
import type { UserRepository } from '@interfaces';
```

**Allowed Constructors**: `Date`, `Error`, `Map`, `Set`, `Promise`, `RegExp`, `URL`

---

## Code Quality Rules

### 4. `code-size-limits` UNIFIED (v3.0)

**Purpose**: Unified size enforcement for files, functions, and JSX returns

**Consolidates**: `max-lines-per-file` + `max-lines-per-function` + `max-jsx-return-lines`

**Default Limits**:

| Scope | Default | Override in Config |
|-------|---------|-------------------|
| **File** | 350 lines | `maxFileLines: 350` |
| **Function** | 50 lines | `maxFunctionLines: 50` |
| **JSX Return** | 50 lines | `maxJsxLines: 50` |

**Configuration**:
```javascript
'custom/code-size-limits': ['warn', {
  maxFileLines: 350,
  maxFunctionLines: 50,
  maxJsxLines: 50,
  skipBlankLines: true,
  skipComments: true
}]
```

**Exemptions** (automatic):
- `@large-file-justified` JSDoc tag
- Repository files (*.repository.ts)
- Mock files (*.mock.ts, /mocks/)
- Styled files (*.styled.ts)
- Components, hooks, use cases (for function limit)
- HTTP handlers (GET, POST, PUT, DELETE, PATCH)
- Redux reducers and extraReducers
- Test callbacks (describe, it, test)

**Fix Strategies**:

| When | Strategy |
|------|----------|
| File too large | Extract sub-components, create hooks, split modules |
| Function too large | Extract helper functions (see patterns below) |
| JSX too large | Use render functions pattern |

**Messages**:
- `fileTooLarge`: "File has X lines (max Y). Split into focused modules."
- `functionTooLarge`: "Function 'X' has Y lines (max Z). Extract helpers or split."
- `jsxTooLarge`: "JSX return has X lines (max Y). Use render functions pattern."

---

### 5. `enforce-hook-composition`

**Purpose**: Ensure hooks follow composition patterns

**Required**:
```typescript
// ✅ Composed hook
const useUserManager = () => {
  const users = useSelector(selectUsers);
  const dispatch = useDispatch();

  const fetchUsers = useCallback(() => {
    dispatch(fetchUsersThunk());
  }, [dispatch]);

  return { users, fetchUsers };
};
```

---

## Component Pattern Rules

### 6. `design-tokens-policy` UNIFIED (v3.0)

**Purpose**: Unified design token enforcement for colors and spacing

**Consolidates**: `no-hardcoded-colors` + `no-hardcoded-spacing`

**Colors Policy**:
```typescript
// ❌ FORBIDDEN - Hardcoded colors
const Container = styled.div`
  background: #FFFFFF;          // Hex
  color: rgb(26, 26, 26);       // RGB
  border: 1px solid white;      // Named color
`;

// ✅ REQUIRED - Design tokens
import { color } from '@styles';
const Container = styled.div`
  background: ${color.white};
  color: ${color.textPrimary};
  border: 1px solid ${color.border};
`;

// ✅ ALLOWED - For alpha transparency
background: rgb(${color.whiteRgb} / 0.5);
```

**Spacing Policy** (styled files only):
```typescript
// ❌ FORBIDDEN - Hardcoded spacing
const Container = styled.div`
  padding: 16px;
  margin: 24px;
  gap: 8px;
`;

// ✅ REQUIRED - Spacing tokens
import { spacing } from '@styles';
const Container = styled.div`
  padding: ${spacing.sm};   // 16px
  margin: ${spacing.md};    // 24px
  gap: ${spacing.xs};       // 8px
`;
```

**Allowed Without Token**:
- `transparent`, `currentColor`, `inherit`, `initial`, `unset`
- Border widths: 1px, 2px, 3px, 4px
- Layout values: 100px+ (intentional layout dimensions)
- Box-shadow blur/spread values
- Viewport units: vh, vw, %

**8-Point Grid Reference**:

| Pixels | Token |
|--------|-------|
| 4px | `spacing.micro` |
| 8px | `spacing.xs` |
| 16px | `spacing.sm` |
| 24px | `spacing.md` |
| 32px | `spacing.lg` |
| 40px | `spacing.xl` |
| 48px | `spacing['2xl']` |
| 56px | `spacing['3xl']` |
| 64px | `spacing['4xl']` |

---

### 7. `component-organization` UNIFIED (v3.0)

**Purpose**: Unified file organization - types in .interfaces.ts, constants in .constants.ts

**Consolidates**: `no-inline-types` + `no-inline-constants`

**Types Policy**:
```typescript
// ❌ FORBIDDEN - Inline interface/type in .tsx
const Button = ({ label }: { label: string }) => {};
interface ButtonProps { label: string; }
type Status = 'active' | 'inactive';

// ✅ REQUIRED - In .interfaces.ts
// Button.interfaces.ts
export interface ButtonProps { label: string; }

// Button.tsx
import type { ButtonProps } from './Button.interfaces';
```

**Constants Policy**:
```typescript
// ❌ FORBIDDEN - SCREAMING_SNAKE_CASE in .tsx
const MAX_RETRIES = 3;
const API_ENDPOINT = '/api/users';

// ✅ REQUIRED - In .constants.ts
// component.constants.ts
export const MAX_RETRIES = 3;
export const API_ENDPOINT = '/api/users';
```

**Allowed Inline Constants** (component-specific):
- `INITIAL_*`, `DEFAULT_*`, `FALLBACK_*`, `MOCK_*`
- `*_OPTIONS`, `*_LABELS`, `*_MODAL`, `*_ITEMS`, `*_ACTIONS`
- `*_ICONS`, `*_MAP`, `*_MAPPINGS`, `*_CATEGORIES`, `*_TABS`
- Simple primitives (boolean, number literals)

**File Exemptions** (allow inline types/constants):
- `.interfaces.ts`, `.types.ts`, `.d.ts`
- `.constants.ts`, `.config.ts`
- `.test.ts`, `.mock.ts`, `/mocks/`
- `.entity.ts`, `.styled.ts`

---

### 8. `no-native-html`

**Purpose**: Use styled-components instead of native HTML

**Forbidden**:
```typescript
// ❌ Native HTML elements
return <div className="container"><button>Click</button></div>;
```

**Required**:
```typescript
// ✅ Styled-components
import { Container, StyledButton } from './Component.styled';
return <Container><StyledButton>Click</StyledButton></Container>;
```

---

### 9. `require-use-client-directive`

**Purpose**: Ensure 'use client' for client components

**Required when file contains**:
- `useState`, `useEffect`, `useRef`, etc.
- `styled` from styled-components
- Event handlers (onClick, onChange)

```typescript
// ✅ Required directive
'use client';

import { useState } from 'react';
import styled from 'styled-components';
```

---

## Code Style Rules

### 10. `comments-policy`

**Purpose**: Unified comment policy based on Clean Code principles

**Philosophy**: "Only code that needs explanation needs documentation" - AI tends to over-document with `//` comments.

**Policy Summary**:

| Context | Rule | Reason |
|---------|------|--------|
| **File Headers** | JSDoc required at top | Context is always needed |
| **// comments** | ALL forbidden (except pragmas) | AI over-documents with these |
| **Inline docs** | Use `/** */` format only | Deliberate documentation |
| **Object properties** | No blank lines, no comments ABOVE | Breaks alphabetical sorting |

**File Header Requirement**:
```typescript
// ✅ CORRECT - JSDoc header at top of file
/**
 * User Management Service
 *
 * Handles user CRUD operations with RBAC enforcement.
 */
import { prisma } from '@database';

// ❌ WRONG - Missing file header
import { prisma } from '@database';
export const UserService = { ... };
```

**Exempt from file header**: `index.ts`, `.d.ts`, `*.config.*`, `*.test.*`, `/mocks/`

**Single-line Comment Policy**:
```typescript
// ❌ FORBIDDEN - ALL // comments (even inline)
// Get user by ID
const user = await getUser(id);
const timeout = 5000; // milliseconds  ← FORBIDDEN

// ✅ ALLOWED - Pragma comments ONLY
// TODO: Implement caching
// FIXME: Handle edge case
// HACK: Workaround for bug
// NOTE: See documentation
// @ts-ignore
// @ts-expect-error

// ❌ FORBIDDEN - Disable pragmas (handled by no-eslint-disable rule)
// eslint-disable-next-line  ← Use no-eslint-disable rule
// prettier-ignore           ← Use no-eslint-disable rule
```

**Object Properties Policy**:
```typescript
// ❌ FORBIDDEN - Comments ABOVE properties (breaks sorting)
return {
  /** User email */
  email: user.email,
  /** User name */
  name: user.name,
};

// ❌ FORBIDDEN - Blank lines between properties
return {
  email: user.email,

  name: user.name,
};

// ✅ CORRECT - Compact, no comments above
return {
  email: user.email,
  name: user.name,
};

// ✅ CORRECT - JSDoc inline AFTER value (if needed)
return {
  email: user.email, /** sanitized */
  name: user.name,
};
```

**Messages**:
- `missingFileHeader`: "File is missing a JSDoc header comment."
- `obviousComment`: "Single-line comments (//) are forbidden. Use JSDoc or remove."
- `blankLineBetweenProps`: "Blank lines between object properties are not allowed."
- `commentAboveProp`: "Comments above properties break alphabetical sorting."

**Replaces**: `require-file-header` + `no-obvious-comments` + `no-blank-lines-in-object-return` (deprecated)

---

### 11. `no-underscore-prefix`

**Purpose**: No `_unused` variable pattern

**Forbidden**:
```typescript
// ❌ Underscore prefix for unused
const [_unused, setCount] = useState(0);
const { _id, ...rest } = user;
```

**Required**:
```typescript
// ✅ Proper destructuring or omit
const [, setCount] = useState(0);
const { name, email } = user;
```

---

### 12. `no-try-catch-abuse`

**Purpose**: Proper error handling patterns

**Forbidden**:
```typescript
// ❌ Empty catch
try {
  await saveUser();
} catch (e) {}

// ❌ Generic catch without handling
try {
  await saveUser();
} catch (e) {
  console.log(e);
}
```

**Required**:
```typescript
// ✅ UI error handling
try {
  await saveUser();
} catch (error) {
  setError(error instanceof Error ? error.message : 'Unknown error');
}

// ✅ Use Case error handling
try {
  return { success: true, data: result };
} catch (error) {
  return handleUseCaseError(error, 'executeCreateUser');
}
```

---

### 13. `no-eslint-disable`

**Purpose**: No eslint-disable comments allowed

**Forbidden**:
```typescript
// ❌ Disabling rules
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = response;

/* eslint-disable no-console */
console.log('debug');
```

**Required**: Fix the underlying issue instead of disabling the rule.

---

## Import Rules

### 14. `import-strategy`

**Purpose**: Unified import policy based on Code Sovereignty "border crossing" principle

**Philosophy**: One rule to define all import policies - when to use barrels, when to use relative, and what to avoid.

**Policy Matrix**:

| Location | Barrel (@alias) | Granular (@alias/path) | Relative (../) |
|----------|-----------------|------------------------|----------------|
| **INSIDE module** | ❌ Creates cycle | ✅ Avoids cycle | ✅ Max 2 levels |
| **OUTSIDE module** | ✅ Required | ❌ Use barrel | ❌ Use barrel |

**Examples INSIDE @helpers module** (`src/libs/shared/helpers/**/*`):
```typescript
// ✅ CORRECT - Relative import within module
import { logError } from '../logger';
import { createAppError } from '../../error-handling';

// ✅ CORRECT - Other barrels are fine
import { HTTP_STATUS } from '@constants';
import { UserEntity } from '@entities';

// ❌ WRONG - Self-barrel import (creates dependency cycle!)
import { logError } from '@helpers';
// Error: Cannot import from "@helpers" while inside the @helpers module.
//        Use relative import instead (e.g., "../logError") to avoid dependency cycles.

// ✅ CORRECT - Granular within module (alternative to relative)
import { logError } from '@helpers/logger';
```

**Examples OUTSIDE module** (`src/apps/admin/**/*`):
```typescript
// ✅ CORRECT - Use barrel
import { logError, createAppError } from '@helpers';

// ❌ WRONG - Granular from outside
import { logError } from '@helpers/logger';
// Error: Use barrel import "@helpers" instead of granular "@helpers/logger".

// ❌ WRONG - Deep relative
import { logError } from '../../../../libs/shared/helpers';
// Error: Relative import is too deep (4 levels). Use alias "@helpers" instead.
```

**Configuration**:
```javascript
'custom/import-strategy': ['warn', {
  maxRelativeLevels: 2,  // Allow ../ and ../../, forbid ../../../
  aliases: {
    '@helpers': 'src/libs/shared/helpers',
    '@components': 'src/libs/presentation/components',
    // ... auto-configured with common aliases
  }
}]
```

**Messages**:
- `selfBarrelImport`: "Cannot import from X while inside the X module. Use relative import instead."
- `useBarrelNotGranular`: "Use barrel import X instead of granular Y."
- `deepRelativeImport`: "Relative import is too deep (N levels). Use alias instead."

**Skip Conditions**: Test files, mock files, index.ts files

**Replaces**: `no-deep-relative-imports` + `prefer-barrel-imports` (deprecated)

---

### 15. `custom-import-order`

**Purpose**: Consistent import ordering

**Order**:
1. React/Next.js (builtin)
2. External libraries
3. Internal aliases (@app-*, @components, etc.)
4. Relative imports (./)
5. Styled imports (*.styled)

**Example**:
```typescript
// 1. React/Next.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. External
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

// 3. Internal aliases
import { Button } from '@components';
import { useAuth } from '@hooks';
import { colorsFlatMap } from '@constants';

// 4. Relative
import type { UserListProps } from './UserList.interfaces';

// 5. Styled (last)
import { Container, UserCard } from './UserList.styled';
```

---

### 16. `index-barrel-exports-only`

**Purpose**: Index files only for barrel exports

**Forbidden in index.ts**:
```typescript
// ❌ Logic in index.ts
export const helper = () => {};

// ❌ Selective exports
export { Button } from './Button';
export { Input } from './Input';
```

**Required in index.ts**:
```typescript
// ✅ Barrel exports only
export * from './Button';
export * from './Input';
export type * from './types';
```

---

## Testing Rules

### 17. `essential-testing`

**Purpose**: Enforce essential testing philosophy

**Forbidden**:
```typescript
// ❌ Verbose/implementation tests
it('should call setLoading with true', () => {});
it('should call setLoading with false', () => {});
it('should call setError with null', () => {});

// ❌ Generic test data
const mockUser = { firstName: 'John', lastName: 'Doe' };
```

**Required**:
```typescript
// ✅ Essential behavior tests
it('should display loading state while fetching', () => {});
it('should display error message on failure', () => {});
it('should render user list after fetch', () => {});

// ✅ Realistic, localized test data
const mockUser = { firstName: 'Maria', lastName: 'Garcia' };
```

**Limits**:
- Max 300 lines per test file
- Localized test data (match project locale)

---

## Configuration

Custom rules are registered as an ESLint plugin (`custom/*`) in `eslint.config.js`. Each rule is imported from the project's custom rules directory and configured with severity and options.

### Validation Commands

```bash
# Run all ESLint rules
yarn lint

# Run with auto-fix
yarn lint:fix

# Check specific rule
npx eslint src --rule 'custom/architecture-boundaries: error'
```

---

## Quick Fixes Reference

### Spacing & Theming

| Rule | Error | Fix |
|------|-------|-----|
| `no-hardcoded-spacing` | `padding: 16px` | `padding: ${spacing.sm}` |
| `no-hardcoded-spacing` | `gap: 8px` | `gap: ${spacing.xs}` |
| `no-hardcoded-spacing` | `height: 44px` | `height: ${spacing.xl}` (40px) |
| `no-hardcoded-spacing` | `width: 60px` | `width: ${spacing['3xl']}` (56px) |
| `no-hardcoded-colors` | `color: #FFF` | `color: ${color.white}` |
| `no-hardcoded-colors` | `rgb(0 0 0 / 0.5)` | `rgb(${color.blackRgb} / 0.5)` |
| `no-hardcoded-colors` | `rgba(255,255,255,0.2)` | `rgb(${color.whiteRgb} / 0.2)` |

**Note**: `font-size` values are NOT spacing - use `typography.size.*`

#### Typography Size Reference (px → token)

| Pixels | Token | Rem |
|--------|-------|-----|
| 12px | `typography.size.xs` | 0.75rem |
| 14px | `typography.size.sm` | 0.875rem |
| 16px | `typography.size.base` | 1rem |
| 18px | `typography.size.lg` | 1.125rem |
| 20px | `typography.size.xl` | 1.25rem |
| 24px | `typography.size['2xl']` | 1.5rem |
| 28px | `typography.size['3xl']` | 1.75rem |
| 32px | `typography.size['4xl']` | 2rem |
| 36px | `typography.size['5xl']` | 2.25rem |
| 40px | `typography.size['6xl']` | 2.5rem |
| 48px | `typography.size['7xl']` | 3rem |
| 64px | `typography.size['8xl']` | 4rem |

#### Spacing Token Reference (px → token)

| Pixels | Token | Rem |
|--------|-------|-----|
| 4px | `spacing.micro` | 0.25rem |
| 8px | `spacing.xs` | 0.5rem |
| 16px | `spacing.sm` | 1rem |
| 24px | `spacing.md` | 1.5rem |
| 32px | `spacing.lg` | 2rem |
| 40px | `spacing.xl` | 2.5rem |
| 48px | `spacing['2xl']` | 3rem |
| 56px | `spacing['3xl']` | 3.5rem |
| 64px | `spacing['4xl']` | 4rem |
| 72px | `spacing['5xl']` | 4.5rem |
| 80px | `spacing['6xl']` | 5rem |
| 96px | `spacing['7xl']` | 6rem |

**Non-exact values**: Use closest token or create semantic constant in `.constants.ts`
- 44px → `spacing.xl` (40px) or create `BUTTON_HEIGHT = '44px'`
- 60px → `spacing['3xl']` (56px) or create `AVATAR_SIZE = '60px'`

### Types & Constants Organization

| Rule | Error | Fix |
|------|-------|-----|
| `no-inline-types` | `interface X {}` in .tsx | Create `.interfaces.ts`, move interface there |
| `no-inline-types` | `type Props = {}` in .tsx | Move to `.interfaces.ts` |
| `no-inline-constants` | `const MAX = 10` in .tsx | Create `.constants.ts`, move constant there |

### HTML & Components

| Rule | Error | Fix | Override in eslint.config.js |
|------|-------|-----|------------------------------|
| `no-native-html` | `<div>` in .tsx | Use styled-component: `const Container = styled.div` | Legal pages (semantic HTML), email templates |
| `no-native-html` | `<strong>` | `const Strong = styled.strong` | Override with justification, NOT rule modification |
| `require-use-client` | Missing directive | Add `'use client';` at top | Server components |

### Size Limits

| Rule | Limit | Fix Strategies |
|------|-------|----------------|
| `max-lines-per-file` | 350 | Extract sub-components, create hooks |
| `max-lines-per-function` | 50 | Extract helper functions (see patterns below) |
| `max-jsx-return-lines` | 50 | Extract render functions, sub-components |

**Extraction patterns for 50-line limit**:

```typescript
// Pattern 1: Render functions (Components)
// ❌ Long inline JSX
return (<Container>{/* 60+ lines */}</Container>);

// ✅ Extract render functions
const renderStats = () => (
  <StatsContainer>
    <StatItem label="Total" value={total} />
  </StatsContainer>
);
const renderCard = (item: Item) => (
  <Card key={item.id}>{item.name}</Card>
);
return (
  <Container>
    {renderStats()}
    {items.map(renderCard)}
  </Container>
);

// Pattern 2: Validation helpers (Hooks)
const validateForm = useCallback((): string | null => {
  const validation = validateForm(formData, [
    { field: 'name', message: 'Name required', validator: validators.required },
  ]);
  if (!validation.isValid) return validation.error;
  if (!currentEventId) return 'No event selected';
  return null;
}, [formData, currentEventId]);

// Pattern 3: Payload builders (Hooks)
const getUpdatePayload = useCallback(() => ({
  name: formData.name,
  description: formData.description,
}), [formData]);

const getCreatePayload = useCallback(() => ({
  ...getUpdatePayload(),
  status: 'draft',
}), [getUpdatePayload]);

// Pattern 4: API Route helpers
const checkStorageConfigured = () => {
  if (!isSupabaseAdminConfigured) {
    return NextResponse.json(
      { error: 'Storage not configured', success: false },
      { status: HTTP_STATUS.SERVICE_UNAVAILABLE }
    );
  }
  return null;
};

const validateParams = (file: File | null) => {
  if (!file) {
    return NextResponse.json({ error: 'File required' }, { status: 400 });
  }
  return null;
};
```

### Unused Parameters

| Rule | Error | Fix |
|------|-------|-----|
| `no-underscore-prefix` | `(_item, i) =>` | Use `void` pattern or for-loop (see below) |
| `no-underscore-prefix` | `_unusedParam` | Rename without underscore + `void param;` |
| `no-underscore-prefix` | `_request` in function | `request` + `void request;` on first line |
| `no-underscore-prefix` | `Array.from({length}, (_,i))` | Use for-loop (preferred) |

**Array.from with index-only** - prefer for-loop:
```typescript
// ❌ Forbidden
Array.from({ length: 5 }, (_item, i) => i + 1)

// ✅ Option 1: for-loop (preferred for simple cases)
const result = [];
for (let i = 0; i < 5; i += 1) {
  result.push(i + 1);
}

// ✅ Option 2: void pattern (for complex transformations)
Array.from({ length: 5 }, (item, i) => {
  void item;
  return i + 1;
});
```

**Callback pattern** - when you need index but not element:
```typescript
// ❌ Forbidden
.filter((_item, i) => i !== index)

// ✅ Correct
.filter((item, i) => {
  void item;
  return i !== index;
})
```

**Function parameter pattern**:
```typescript
// ❌ Forbidden
const handler = (_req: Request) => { ... }

// ✅ Correct
const handler = (req: Request) => {
  void req;
  ...
}
```

### Error Handling

| Rule | Error | Fix |
|------|-------|-----|
| `no-try-catch-abuse` | Empty catch | UI: `setError(msg)` / UseCase: `handleUseCaseError()` |
| `no-await-in-loop` | `await` in for loop | Often intentional (progress tracking) - verify purpose |

### Non-null Assertions

| Rule | Error | Fix |
|------|-------|-----|
| `no-non-null-assertion` | `file!.name` after validation | Type narrowing: `const validFile = file as File;` |
| `no-non-null-assertion` | `bucket!` after null check | `const validBucket = bucket as StorageBucket;` |
| `no-non-null-assertion` | `supabaseAdmin!` after config check | `const storage = supabaseAdmin as NonNullable<typeof supabaseAdmin>;` |

**Pattern - Type narrowing after validation**:
```typescript
// ❌ Forbidden: non-null assertions
const paramsError = validateParams(file, bucket);
if (paramsError) return paramsError;
const name = file!.name;  // Warning: Forbidden non-null assertion

// ✅ Correct: type narrowing after validation
const paramsError = validateParams(file, bucket);
if (paramsError) return paramsError;

const validFile = file as File;
const validBucket = bucket as StorageBucket;
const storage = supabaseAdmin as NonNullable<typeof supabaseAdmin>;

const name = validFile.name;  // Clean!
await storage.from(validBucket).upload(...);
```

**Why type narrowing over `!`**:
- More explicit about intent
- Reusable variable (use `validFile` multiple times)
- Cleaner code, no `!` scattered throughout
- TypeScript understands the narrowed type

### Imports & Exports

| Rule | Error | Fix |
|------|-------|-----|
| `index-barrel-exports-only` | `export { X }` in index.ts | Use `export * from './X'` |
| `custom-import-order` | Wrong order | React → External → Aliases → Relative → Styled |

### Prettier Formatting (Auto-fixable)

| Warning Type | Example | Fix |
|--------------|---------|-----|
| Line breaks | `Replace X with ⏎X⏎` | Run `--fix` |
| Indentation | `Insert ··` | Run `--fix` |
| Trailing commas | Missing/extra comma | Run `--fix` |
| Object formatting | Multi-line objects | Run `--fix` |

**Auto-fix all Prettier warnings**:
```bash
# Fix via ESLint (recommended - applies all rules)
yarn lint:tsx --fix

# Or fix Prettier only
npx prettier --write "src/**/*.{ts,tsx}"
```

**Workflow tip**: After extracting functions to fix `max-lines-per-function`, always run `--fix` to clean up Prettier warnings from the refactoring.

---

## Systematic Warning Reduction Workflow

When facing multiple ESLint warnings, follow this iterative process:

```bash
# 1. Count current warnings
yarn lint 2>&1 | grep -c warning

# 2. Identify warning types
yarn lint 2>&1 | grep warning | sed 's/.*warning//' | sort | uniq -c | sort -rn

# 3. Fix by category (one rule type at a time)
# 4. Auto-fix Prettier after each batch
yarn lint:tsx --fix

# 5. Verify reduction
yarn lint

# 6. Repeat until 0 warnings
```

**Recommended fix order**:
1. `max-lines-per-function` / `max-jsx-return-lines` → Extract functions
2. `no-non-null-assertion` → Type narrowing
3. `no-underscore-prefix` → for-loops or void pattern
4. Prettier warnings → Auto-fix with `--fix`

**Progress tracking**: 73 → 26 → 10 → 4 → 0 (iterative refinement works)

---

## API Route Validation Pattern

### `NextResponse | null` Validation Helper

Standard pattern for API route input validation:

```typescript
// Pattern: Return error response OR null (validation passed)
const validateParams = (file: File | null, bucket: string | null): NextResponse | null => {
  if (!file) {
    return NextResponse.json(
      { error: 'File required', success: false },
      { status: HTTP_STATUS.BAD_REQUEST }
    );
  }
  if (!bucket) {
    return NextResponse.json(
      { error: 'Bucket required', success: false },
      { status: HTTP_STATUS.BAD_REQUEST }
    );
  }
  return null;  // null = validation passed
};

// Usage in handler - early return pattern
export const POST = withAuthMiddleware(async (request) => {
  const error = validateParams(file, bucket);
  if (error) return error;  // Early return on failure

  // Type narrow after validation
  const validFile = file as File;
  const validBucket = bucket as StorageBucket;

  // Continue with valid params...
});
```

**Benefits**:
- Consistent error response format (`{ error, success: false }`)
- Localized error messages (match project locale)
- Clean handler logic (validation separated)
- Reduces handler line count (fixes `max-lines-per-function`)

---

## useCallback Extraction and Dependencies

When extracting functions from hooks using `useCallback`, update dependency arrays correctly:

```typescript
// ❌ Before: Large handleSave with inline payload
const handleSave = useCallback(async () => {
  if (isEditing) {
    await updateItem(id, {
      name: formData.name,
      description: formData.description,
      // ... 20+ more fields
    });
  }
}, [formData, isEditing, updateItem]);  // formData = entire object

// ✅ After: Extract payload builder
const getPayload = useCallback(() => ({
  name: formData.name,
  description: formData.description,
  // ... fields
}), [formData]);

const handleSave = useCallback(async () => {
  if (isEditing) {
    await updateItem(id, getPayload());
    showSuccess(`"${formData.name}" updated`);  // Only .name for message
  }
}, [
  formData.name,     // Specific field for success message
  getPayload,        // Extracted payload builder
  isEditing,
  updateItem,
  showSuccess,
]);
```

**Rules**:
1. Extracted function goes in dependency array
2. Only include specific fields used directly (e.g., `formData.name` for messages)
3. Don't include `formData` if only accessed through extracted function

---

## Edge Cases: Near-Limit Files

### Files 1-2 Lines Over Limit (51-52 lines)

When a function is just slightly over the 50-line limit:

| Lines Over | Strategy |
|------------|----------|
| 1-2 lines | Extract smallest unit (single validation, one object) |
| 3-5 lines | Extract one helper function |
| 6-15 lines | Extract 2-3 related helpers |
| 15+ lines | Major refactor needed |

**Minimal extraction example**:
```typescript
// 51 lines - just 1 over limit
const handleSave = useCallback(async () => {
  // ... validation, save logic, success message
  // Problem: inline payload building adds 10 lines
}, [...]);

// Fix: Extract just the payload (even if "small")
const getPayload = useCallback(() => ({
  name: formData.name,
  status: formData.status,
}), [formData]);

// Now handleSave is 41 lines ✓
```

**Rule**: Don't hesitate to extract "small" helpers - consistency matters more than avoiding "tiny" functions.

---

## Batch Fix Tips

### RGBA/RGB Colors in Ternary Expressions

When using color tokens inside ternary expressions, use template literals (backticks), NOT single quotes:

```typescript
// ❌ WRONG - single quotes make interpolation literal
background: ${({ $active }) => ($active ? 'rgb(${color.whiteRgb} / 0.1)' : 'transparent')};

// ✅ CORRECT - template literals enable interpolation
background: ${({ $active }) => ($active ? `rgb(${color.whiteRgb} / 0.1)` : 'transparent')};
```

### After Batch sed Replacements

When using sed to replace hardcoded values (spacing, colors), always verify:

1. **Imports exist**: Files may not have the required imports
   ```bash
   # After sed, check for missing imports
   yarn type-check 2>&1 | grep "Cannot find name"
   ```

2. **Add missing imports**: Common pattern
   ```typescript
   // Before (only color imported)
   import { color } from '@styles';

   // After (add spacing if sed added spacing tokens)
   import { color, spacing } from '@styles';
   ```

### Required Color Tokens for Overlays

Ensure `tokens.ts` has RGB versions for overlay colors:

```typescript
// Required for rgba() replacement patterns
blackRgb: '0, 0, 0',      // For dark overlays
whiteRgb: '255, 255, 255', // For light overlays
```

### Bulk Spacing Fix Pattern

```bash
# Exact 8-point grid values (safe to batch replace)
sed -i '' \
  -e "s/: 8px/: \${spacing.xs}/g" \
  -e "s/: 16px/: \${spacing.sm}/g" \
  -e "s/: 24px/: \${spacing.md}/g" \
  -e "s/: 32px/: \${spacing.lg}/g" \
  -e "s/: 40px/: \${spacing.xl}/g" \
  -e "s/: 48px/: \${spacing['2xl']}/g" \
  -e "s/: 64px/: \${spacing['4xl']}/g" \
  -e "s/: 80px/: \${spacing['6xl']}/g" \
  file.styled.ts
```

**Non-grid values** (20px, 18px, 44px, etc.) require manual review - may be intentional for icons, buttons, or design-specific sizes.

### Moving Inline Styled-Components to .styled.ts

When `no-native-html` reports "Styled-component must be in a .styled.ts file", follow this pattern:

1. **Create the .styled.ts file** in the same directory as the component
2. **Move all styled-components** from the .tsx file to .styled.ts
3. **Update imports** in the .tsx file

```typescript
// ❌ WRONG - inline styled-component in .tsx
// ComponentName.tsx
const Container = styled.div`...`;
const Title = styled.h1`...`;

export const ComponentName = () => (
  <Container><Title>Hello</Title></Container>
);

// ✅ CORRECT - styled-components in .styled.ts
// ComponentName.styled.ts
export const Container = styled.div`...`;
export const Title = styled.h1`...`;

// ComponentName.tsx
import { Container, Title } from './ComponentName.styled';
export const ComponentName = () => (
  <Container><Title>Hello</Title></Container>
);
```

**Common reusable styled-components** (create once, import from .styled.ts):
- `LoadingWrapper` - centered flex container with spinner
- `EmptyState` - centered text for empty data
- `Pagination` - flex container for pagination controls
- `PageHeader`, `PageTitle`, `PageSubtitle` - page header pattern

### Icon Size Tokens (layout.icon.*)

For icon dimensions (width/height of svg icons), use `layout.icon.*` instead of spacing tokens:

```typescript
// tokens.ts has:
layout: {
  icon: {
    sm: '16px',  // Small icons
    md: '20px',  // Default icons
    lg: '24px',  // Large icons
    xl: '32px',  // Extra large icons
  }
}

// Usage in styled-components
svg {
  height: ${layout.icon.md};  // 20px
  width: ${layout.icon.md};
}
```

**Common icon size mappings**:
| Pixels | Token | Use Case |
|--------|-------|----------|
| 12px | No token (use spacing.xs/2 or keep) | Micro icons in badges |
| 16px | `layout.icon.sm` | Inline icons, buttons |
| 18px | `layout.icon.sm` (round down) | Tab icons |
| 20px | `layout.icon.md` | Default icons |
| 24px | `layout.icon.lg` | Prominent icons |
| 32px | `layout.icon.xl` | Hero icons |

---

## Known False Positives

These warnings are expected and should be ignored (not actual violations):

| Rule | Context | Why It's False Positive |
|------|---------|------------------------|
| `no-restricted-syntax` (default exports) | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` | Next.js App Router **requires** default exports for these special files |
| `testing-library/no-debugging-utils` | `logger.debug()` in services | Rule detects "debug" keyword but `logger.debug()` is legitimate logging, not `screen.debug()` |

**Note**: If these false positives appear frequently, consider adding file-specific overrides in `eslint.config.js` for the affected patterns.

---

## no-hardcoded-spacing Automatic Exclusions

The `no-hardcoded-spacing` rule now automatically excludes:

| Context | Example | Reason |
|---------|---------|--------|
| Blur/Filter values | `blur(8px)`, `backdrop-filter: blur(12px)` | Visual effect parameters, not spacing |
| Scrollbar dimensions | `::-webkit-scrollbar { width: 6px }` | Browser-specific styling |
| Font-size values | `font-size: 14px` | Uses typography tokens, not spacing |
| Pseudo-element content | `::after { width: 5px }` | Visual elements (checkmarks, decorations) |
| Decimal values | `letter-spacing: 0.5px` | Typography adjustments |
| Box-shadow blur/spread | `box-shadow: 0 4px 6px` | Visual effect parameters |
| Border widths | `border: 1px solid` | 1-4px allowed for borders |
| Large layout values | `max-width: 1200px` | 100px+ are intentional layout dimensions |

These exclusions prevent false positives while still catching actual spacing violations.

---

## File-Specific Overrides

When a rule violation is **intentional by design**, add a file-specific override in `eslint.config.js` instead of using inline comments.

### `no-await-in-loop` for Sequential Operations

**Use Case**: Sequential uploads or processing that need per-item progress tracking:
- Granular progress tracking per item (25%, 50%, 75%, 100%)
- Individual error handling per item
- Preventing server overload (vs parallel `Promise.all`)

**Override Pattern**:
```javascript
// eslint.config.js - file-specific override
{
  files: ['src/**/useFileUpload.ts'],
  rules: {
    'no-await-in-loop': 'off',
  },
},
```

**When to use await-in-loop vs Promise.all**:

| Pattern | Use When | Progress | Speed |
|---------|----------|----------|-------|
| `await` in loop | Need per-item progress/error handling | ✅ Granular | Slower |
| `Promise.all` | Independent operations, only need final result | ❌ 0/100 only | Faster |
| `Promise.allSettled` | Parallel but need individual results | ❌ 0/100 only | Faster |

**Rule**: Never use `// eslint-disable-next-line` for this. Use file-specific override in config.

---

## Native ESLint Rules (Sovereignty-Relevant Configuration)

Beyond the 19 custom rules, these native ESLint rules enforce sovereignty principles:

### `no-warning-comments` — Technical Debt Visibility

**Purpose**: Makes `TODO`, `FIXME`, and `HACK` comments visible as ESLint warnings instead of silently accumulating.

```javascript
// eslint.config.js
'no-warning-comments': ['warn', {
  terms: ['TODO', 'FIXME', 'HACK'],
  location: 'start',
}],
```

**Convention for deferred work markers** (do NOT trigger the rule):
- `/** IMPLEMENT: description */` — Mock/stub awaiting real implementation
- `/** Pending: description */` — Deferred feature needing schema/infra changes
- `// NOTE:` — Context annotation (not actionable)

**Convention that DOES trigger** (intentional — forces resolution):
- `// TODO:` — Actionable item that should be resolved
- `// FIXME:` — Known bug to fix
- `// HACK:` — Temporary workaround to remove

### `no-restricted-syntax` — Additional Detections

Beyond default export prevention, configured to detect:

| Selector | Detects | Fix |
|----------|---------|-----|
| `CallExpression[callee.object.object.name="globalThis"][callee.object.property.name="console"]` | `globalThis.console.*()` | Use `logError`/`logWarning` from `@logger` |
| `ExportDefaultDeclaration` | Default exports | Use named exports (except App Router pages) |

**Logger module exemption**: `logger.ts` is exempt from the `globalThis.console` restriction (it IS the logger).

---

## Betterware-Imported Rules (v5.0, 2026-06-19)

Imported from Betterware and adapted to our RTK/Vitest/Next ecosystem. Each was validated against dearadry (logic probes + real-exposure measurement) and introduced at `'warn'`.

### `no-utility-type-cast` (Type Safety) — Clear Borders

Forbids type-extracting utility types inside `as` casts; import the interface directly.

```typescript
// ❌ extracts a type from a signature at the use-site (invisible coupling)
const data = payload as Parameters<typeof updateUserAction>[0]['data'];
const props = x as React.ComponentProps<typeof Button>['onClick'];

// ✅ declare at origin and import the interface
import type { UpdateUserData } from './user.interfaces';
const data = payload as UpdateUserData;

// ✅ ALLOWED: structural subset, double-cast to a named interface, type aliases
const a = x as Pick<UserInterface, 'id'>;
const b = x as unknown as UserInterface;
type State = ReturnType<typeof buildState>; const c = store.getState() as State;
```

**Ecosystem adaptation**: exempts `ReturnType<typeof vi.fn | vitest.fn | jest.fn>` — the canonical Vitest mock-typing idiom (3rd-party util with no importable interface). Betterware (Jest) lacked this. Forbidden forms: bare `Parameters/ReturnType/ComponentProps<…>`, indexed-access chains `T<…>[k]['p']`, and `as unknown as Parameters<typeof Component>[0]` (the double-unknown does not whitelist component extraction).

### `no-jsx-in-non-component-files` (Artifact Boundary) — Territorial Integrity

JSX may only live in component/screen/layout files. `.helpers / .constants / .interfaces / .types / .styled` stay JSX-free.

```typescript
// ❌ foo.helpers.ts — rendering smuggled into a logic file
export const renderRow = (i) => <Row>{i.name}</Row>;

// ✅ foo.helpers.ts — returns data; the component renders it
export const buildRowProps = (i) => ({ label: i.name });
```

**Ecosystem adaptation**: added `.types.` (same rule as `.interfaces.`). `.mock.*` intentionally excluded — mock factories legitimately return JSX. Detects only real `JSXElement`/`JSXFragment` AST nodes, so TS generics (`styled.div<Props>`, `Map<K,V>`, `<T,>`) never false-positive.

### `enforce-filename-convention` (Naming)

Two checks: (1) cross-cutting singular→plural typos (`.helper.`→`.helpers.`, `.interface.`→`.interfaces.`, `.constant.`→`.constants.`); (2) directory required-segment for clean layers.

| Directory | Required segment |
|-----------|------------------|
| `/repositories/` | `.repository.` |
| `/use-cases/` | `.use-case.` |
| `/slices/` | `.slice.` |
| `/entities/` | `.entity.` |

**Ecosystem adaptation**: removed all Redux-Saga dirs (reducers/sagas/actions/selectors) and `/pages/→.screen.`. **Excluded `/services/`** on purpose — it holds heterogeneous files (`.processor./.validator./.utils.`) that a single required segment would false-positive. RTK uses `/slices/→.slice.`.

---

## Modified Rules (Betterware FP-adjustments, v5.0)

- **`no-try-catch-abuse`** — added `console.warn` to the valid-handler list (dev logging allowed by `no-console` config). Strictly more permissive; the redux-saga branch from Betterware was **not** imported (irrelevant to RTK/Next).
- **`component-organization`** — added **HELPERS POLICY**: pure transformation functions (`normalize* / transform* / sort* / format* / parse* / filter* / compute* / calculate* / extract*`) in implementation files must move to `.helpers.ts`. Components, hooks, and `.helpers.*` files are exempt. Note: this conflicts with the colocated repository-mapper convention (`transformPrismaXToEntity` in `*.repository.ts`) — surfaced as warnings, resolution deferred by decision.

---

## Related

- `doctrine/principles.md` — 8 doctrinal principles (sovereignty foundation)
- `core/architecture/code-sovereignty.md` — 6 technical sovereignty principles
- `frontend/tooling/index.md` — Tooling patterns index
- `frontend/framework/canonical-reference.md` — Canonical stack and ESLint rules summary

---

**Version**: 5.0 | **Updated**: 2026-06-19
