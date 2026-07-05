# Technical Synthesis - Code Sovereignty v4.0

> **Purpose**: Complete technical reference of all sovereignty documents for context sharing
> **Scope**: ~90 technical files synthesized into a single document
> **Version**: 1.0 | **Date**: 2026-02-22
> **Use case**: Provide this document to other AI contexts to understand what exists technically

---

## Repository Structure

The repository is organized in 3 layers: **WHY** (doctrine), **WHAT** (core), **HOW** (disciplines). Everything lives under `sovereignty/`.

```
sovereignty/
├── doctrine/     # WHY - Philosophy and principles
├── core/         # WHAT - Universal practices (agnóstico)
└── {discipline}/ # HOW - Stack-specific implementation
```

**Entry point**: `.claude/CLAUDE.md` → navigates to `sovereignty/` contents.

---

## 1. Architecture (core/architecture — 4 patterns)

### Core Philosophy: Code Sovereignty

Geopolitical analogy where each layer has sovereignty over its domain. World at War (coupled) = entropy, rewrites. World at Peace (sovereign) = scalability, joy.

### 6 Technical Principles

| # | Principle | Definition | In Code |
|---|-----------|------------|---------|
| 1 | **Territorial Integrity** | Each layer owns its territory exclusively | Domain has ZERO external dependencies |
| 2 | **Self-Sufficiency** | Modules self-sufficient within their domain | Components manage own UI state |
| 3 | **Non-Intervention** | Dependencies point INWARD (Dependency Inversion) | Use Cases depend on interfaces, not implementations |
| 4 | **Clear Borders** | Interfaces define contracts between layers | Domain defines interfaces, Infrastructure implements them |
| 5 | **Trade Agreements** | Data flows through defined protocols, transforms at borders | Each layer transforms data at its boundary checkpoint |
| 6 | **Secure Trade** | Request only what you need, receive exactly that | No over-fetching, no N+1, sanitize at borders |

### Clean Architecture Applied

```
┌─────────────────────────────────────────────┐
│              PRESENTATION                    │
│         (Components, Pages, Routes)          │
├─────────────────────────────────────────────┤
│              INFRASTRUCTURE                  │
│      (Repositories, Services, State)         │
├─────────────────────────────────────────────┤
│                 DOMAIN                       │
│        (Entities, Use Cases, Interfaces)     │
└─────────────────────────────────────────────┘
         ↑ Dependencies point INWARD ↑
```

### Layer Import Rules

| Layer | Can Import | Cannot Import |
|-------|------------|---------------|
| **Domain** | Nothing | Infrastructure, Presentation |
| **Infrastructure** | Domain interfaces | Presentation |
| **Presentation** | Infrastructure (via hooks) | Domain directly |
| **NextJS** | All (routing glue) | — |

### Context Boundaries

```
admin/  → Admin-specific code
public/ → Public-facing code
libs/   → Shared (explicit decision)
```

**Rule**: NO cross-context imports. admin ↛ public, public ↛ admin. Shared code → libs/.

### Modularization Limits

| Type | Max Lines | Action if Exceeded |
|------|-----------|-------------------|
| Function | 50 | Extract sub-functions |
| File | 350 | Extract components |
| Styled | 250 | Distribute to children |
| JSX section | 50 | Render function |
| Business logic | 150 | Custom hook |
| Test files | 600 | Split by concern |

**Exempt**: Tests, mocks, seeds, scripts (follow size limits loosely, accuracy > size).

### Component Extraction Pattern

```
// BEFORE: UserProfile.tsx (450 lines)

// AFTER:
UserProfile/
├── UserProfile.tsx (100 lines) - Container
├── UserProfileHeader.tsx (80 lines)
├── UserProfileStats.tsx (60 lines)
├── UserProfileActivity.tsx (120 lines)
└── index.ts
```

---

## 2. Quality (core/quality — 7 patterns)

### 2.1 Naming Conventions

| Category | Case | Extension | Example |
|----------|------|-----------|---------|
| Component | PascalCase/ | .tsx | `UserCard/UserCard.tsx` |
| Hook | PascalCase/ | .ts | `useAuth/useAuth.ts` |
| Use Case | kebab-case | .use-case.ts | `create-user.use-case.ts` |
| Repository | kebab-case | .repository.ts | `user.repository.ts` |
| Service | kebab-case | .service.ts | `user.service.ts` |
| Entity | kebab-case | .entity.ts | `user.entity.ts` |
| Interface | kebab-case | .interfaces.ts | `user.interfaces.ts` |
| Constants | kebab-case | .constants.ts | `roles.constants.ts` |
| Styled | kebab-case | .styled.ts | `user-card.styled.ts` |
| Test | kebab-case | .test.ts | `user.test.ts` |

- **Variables**: `camelCase`
- **Constants values**: `SCREAMING_SNAKE_CASE` with `as const`
- **Code language**: English always
- **Content**: Localized per project (UI text, error messages, test data)

**Component Suffixes**: `Page` (public routes), `Screen` (admin/authenticated), `Modal` (overlays), `Form` (forms).

### 2.2 Error Handling

- Factory pattern: `createAppError()` (not `new AppError()`)
- Handlers per layer: `handleApiError()` (routes), `handleUseCaseError()` (use cases), `setError()` (components)
- Discriminated unions for all results:

```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

- ZERO empty catch blocks, ZERO silent failures
- Log BEFORE re-throwing
- No try-catch for validation (use direct returns)
- No nested try-catch

**Error Categories**: `VALIDATION_ERROR` (400), `NOT_FOUND` (404), `UNAUTHORIZED` (401), `FORBIDDEN` (403), `INTERNAL_ERROR` (500).

### 2.3 Type Safety

- ZERO `any` in production (only in tests for mocking)
- `unknown` with type guards for untyped data
- `as const` for literal constants
- Centralized types, single source of truth
- `@ts-expect-error` over `@ts-ignore`
- Discriminated unions for result handling

### 2.4 Comments Policy

**Valid**: Non-obvious business rules (JSDoc), workarounds/hacks with links, complex algorithms, API contracts, pragmas (TODO, FIXME, HACK, NOTE).

**Forbidden**: Obvious comments, section dividers, commented-out code, change history, property documentation on self-explanatory names.

**Decision tree**: Is code self-explanatory? → Can I rename? → Can I restructure? → Is it a business rule/workaround/algorithm? → Only then comment.

### 2.5 Code Size Limits

| File Type | Max Lines | Rationale |
|-----------|-----------|-----------|
| Components | 350 | UI + hooks + handlers should fit |
| Use Cases | 350 | Single operation with validation |
| Services | 350 | API methods grouped by domain |
| Repositories | 400 | CRUD + filters + transforms |
| Hooks | 200 | Orchestration only |
| Test Files | 600 | More tests = more coverage |
| Functions | 50 | Single responsibility |
| JSX Return | 50 | Readable component tree |

### 2.6 Anti-Patterns (Zero Tolerance)

1. No default exports (except pages for routing)
2. No named re-exports in barrel files (use `export *`)
3. No wildcard imports in implementation
4. No inline styles (styled-components only)
5. No hardcoded values / magic numbers
6. No anonymous functions in props
7. No direct state access without selectors
8. No PropTypes with defaultProps (use destructuring defaults)
9. No business logic in components (extract to hooks)
10. No `var` or `function` keyword (use `const` + arrow functions)

### 2.7 Dead Code Prevention

- AI-driven investigation for unused code
- Delete completely (no `_unused` prefix, no `// removed` comments)
- Git has history — no need to preserve dead code

---

## 3. Testing (core/testing — 2 patterns)

### 3.1 Philosophy: Value > Coverage

- Target: 80% overall, 100% critical paths
- Framework: Vitest 4.0+ (ESM-native, faster than Jest)
- Test data: Spanish locale (María García, José López — NEVER John Doe)

| Always Test | Never Test |
|------------|------------|
| Business logic validation | String constants |
| User workflows (happy + edge) | UI text constants |
| Error handling scenarios | Route constants |
| State mutations (Redux) | Configuration objects |
| Integration points | Type definitions |
| Accessibility (ARIA, keyboard) | Third-party library behavior |
| Critical UI interactions | |

### 3.2 Test Structure

```typescript
describe('Component', () => {
  const setup = () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Component onSubmit={onSubmit} />);
    return { user, onSubmit };
  };

  it('does the thing', async () => {
    const { user, onSubmit } = setup();
    await user.click(screen.getByRole('button'));
    expect(onSubmit).toHaveBeenCalled();
  });
});
```

**Vitest specifics**: `vi.mock()` at top level (before imports), partial mocks with `importOriginal`, `userEvent.setup()` in setup function, snapshots only for small stable components.

### 3.3 Mock-First Development

**Strategy**: Mocks → Validation → Prisma

- Start with mocks (fast iteration, no DB setup)
- `simulateNetworkDelay()` in ALL mock methods
- `TODO: MIGRATE TO PRISMA` with exact Prisma code commented
- Spanish mock data, soft delete pattern (deletedAt)
- Migration = ONE-time operation (NOT iterative)

**When to migrate**: All use cases implemented, data flows validated, all tests passing, business logic proven, UI/UX finalized.

```typescript
export const eventRepository: EventRepository = {
  findAll: async (): Promise<EventEntity[]> => {
    await simulateNetworkDelay();
    // TODO: MIGRATE TO PRISMA
    // return await prisma.event.findMany({ where: { deletedAt: null } });
    return mockEventData.filter(event => !event.deletedAt);
  },
};
```

---

## 4. Workflow (core/workflow — 6 patterns)

### 4.1 Investigation-First Protocol

Before creating ANY file:
1. **Identify** file type
2. **Find** 2-3 similar files (Glob)
3. **Read** completely
4. **Identify** patterns (imports, structure, error handling, exports)
5. **Decide**: ADAPT (70%+ similar) or CREATE (following exact pattern)

**ROI**: Investigation (2-5 min) vs blind creation + refactoring (hours).

### 4.2 Context-First Protocol

```
1. READ snapshot → .claude/status/{CONTEXT}-CONTEXT-SNAPSHOT.md
2. READ patterns → .claude/patterns/business/
3. READ rules   → .claude/rules/
4. THEN explore code → Only if snapshot is insufficient
```

Token savings: ~80%.

### 4.3 Other Workflows

- **Plan Verification**: Verify plans against actual code before execution
- **Todo Management**: NEVER delete TODO without implementing complete solution
- **No Reinventing Wheel**: Search existing before creating
- **Code Elevation**: Elevate shared code from local to global (libs/)

---

## 5. Frontend — Stack & Patterns (sovereignty/frontend — ACTIVE)

This is the fully developed discipline with ~50 pattern files.

### 5.1 Canonical Stack

| Package | Version | Notes |
|---------|---------|-------|
| Next.js | 16.1.1 | Turbopack default |
| React | 19.2.3 | — |
| TypeScript | 5.9.3 | Strict mode |
| styled-components | 6.1.14 | **PINNED** (6.2.0+ bug with Next.js 16) |
| Prisma | 7.x | — |
| Vitest | 4.0.16 | Replaced Jest |
| @reduxjs/toolkit | 2.5.0 | — |

**Known issues**: styled-components 6.2.0+ styles not injected with Next.js 16 (pin to 6.1.14), Turbopack SVG distortion (add `removeViewBox: false`), keyframe interpolation (use `css` helper).

### 5.2 Architecture Flows

```
Backend: API Route → Use Case → Repository → Database/Mock
Frontend: Component → Hook → Redux Thunk → Service → API
```

### 5.3 Domain Layer

#### Entities

- Pure interfaces, ZERO framework dependencies
- `null` for optional fields (NOT undefined)
- Soft delete pattern (isActive, deletedAt, deletedBy)
- Discriminated unions for results
- Pure domain functions (input → output, NO side effects)
- Pick/Omit for context-specific views

```typescript
export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  street: string | null;
  city: string | null;
  role: UserRole;
  isActive: boolean;
  deletedAt: Date | null;
  deletedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Pure domain functions
export const getUserFullName = (user: UserEntity): string =>
  `${user.firstName} ${user.lastName}`.trim();

export const canPerformAdminAction = (user: UserEntity): boolean =>
  user.role === 'owner' || user.role === 'admin';
```

**Request/Response types**: `CreateUserRequest` (repo input), `CreateUserParams` (use case input, includes NextRequest), `UpdateUserRequest` (partial fields).

**File structure**: `src/libs/domain/types/` (primitives), `src/libs/domain/interfaces/` (entity shapes), `src/libs/domain/entities/` (pure business functions).

#### Use Cases

- Arrow functions: `export const executeX = async ()`
- Flow: Validate → Authorize → Business rules → Repository → Log → Return
- `validateAndGetUser()` for protected operations
- Spanish error messages
- NO HTTP/NextResponse (belongs in routes)
- NO direct database calls (use repositories)

```typescript
export const executeCreateUser = async (params: CreateUserParams): Promise<CreateUserResponse> => {
  try {
    // 1. Validate
    if (!params.email || !params.firstName) {
      return createValidationError('Faltan campos obligatorios', 'email');
    }
    // 2. Auth
    const authResult = await validateAndGetUser(params.request, [USER_ROLES.ADMIN]);
    if (!authResult.success) return authResult.error;
    // 3. Business rules
    const existing = await userRepository.findByEmail(params.email);
    if (existing) return createValidationError('Ya existe un usuario con este email', 'email');
    // 4. Repository
    const newUser = await userRepository.create({ email: params.email, firstName: params.firstName });
    // 5. Success
    return { success: true, data: newUser, message: 'Usuario creado exitosamente' };
  } catch (error) {
    return handleUseCaseError(error, 'executeCreateUser');
  }
};
```

**File structure**:
```
use-cases/create-user/
├── create-user.use-case.ts
├── create-user.interfaces.ts
├── create-user.use-case.test.ts
└── index.ts  // export type * + export *
```

### 5.4 Infrastructure Layer

#### Repositories

- Object literal pattern (no classes): `export const repo = { method: async () => {} }`
- Arrow functions for ALL methods
- Private transform function: Prisma → Domain entities
- Soft delete (always exclude deletedAt in queries)
- Return domain entities (NOT Prisma models)
- Dynamic filtering with `where` builder
- Pagination with `skip/take` + `count`

```typescript
export const userRepository: UserRepository = {
  findById: async (id: string): Promise<UserEntity | null> => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.deletedAt) return null;
    return transformPrismaToEntity(user);
  },
  create: async (data: CreateUserRequest): Promise<UserEntity> => {
    const newUser = await prisma.user.create({
      data: { email: data.email.toLowerCase(), firstName: data.firstName, /* ... */ },
    });
    return transformPrismaToEntity(newUser);
  },
  delete: async (id: string): Promise<void> => {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  },
};
```

#### Services

- HTTP client layer ONLY via `handleRequest`
- Object literal pattern (no classes)
- Return raw API data (transform in Redux thunks)
- Spanish error messages
- Response strategy: arrays return `[]` on error, single objects throw

```typescript
export const UsersService = {
  getAll: async (): Promise<UserApiData[]> => {
    const response = await handleRequest({
      endpoint: '/api/admin/users',
      method: 'GET',
      timeout: 10000,
      customDefaultErrorMessage: 'No se pudieron cargar los usuarios',
    });
    const typedResponse = response as ApiResponse<{ users: UserApiData[] }>;
    if (!typedResponse.success || !typedResponse.data?.users) return [];
    return typedResponse.data.users;
  },
};
```

#### Redux (Store + Thunks + Slices)

**Store**: `configureStore` + `combineReducers` + `redux-persist` with whitelist (only safe data: global, auth) + `serializableCheck: false`.

**Thunks**: `createManagedThunk` wrapper for ALL async (auto loaders + notifications + error handling + Spanish messages):

```typescript
export const fetchUsers = createManagedThunk<UserEntity[], void>({
  actionName: 'users/fetchUsers',
  customErrorMessage: 'Error al cargar usuarios',
  operation: async () => {
    const apiData = await UsersService.getAll();
    return apiData.map(transformUser);  // Transform HERE
  },
});
```

**Slices**: `createSlice` + `extraReducers` with builder pattern. State shape separates server data from UI-only state:

```typescript
interface UsersState {
  users: UserEntity[];       // Domain entities (from server)
  selectedUsers: string[];   // UI-only state
  lastUpdated: string | null;
}
```

**Data flow**: Service (raw API) → Thunk (transform) → State (domain entities) → Selectors → Component.

**Persist strategy**: Persist safe data only (global, auth). Sensitive data (users, events) = runtime only.

#### Selectors

- `createSelector` for memoized selectors
- Always use selectors (NEVER direct state access)
- Compose selectors for derived data

### 5.5 Presentation Layer

#### Components (5-file structure)

```
ComponentName/
├── ComponentName.tsx           # 'use client' + logic
├── ComponentName.interfaces.ts # Types
├── ComponentName.styled.ts     # 'use client' + styles
├── ComponentName.test.tsx      # Tests
└── index.ts                    # export * + export type *
```

- `'use client'` in .tsx and .styled.ts (hooks/styled-components)
- Transient props with `$` prefix: `$isActive`, `$variant`
- Flat maps for colors/spacing (NO theme context — SSR crash)
- Render functions inside component body (never exported)
- Named exports only (never default, except pages)
- `useCallback` for handler functions in props

```typescript
'use client';
import { useCallback } from 'react';
import { Container, Title } from './UserCard.styled';
import type { UserCardProps } from './UserCard.interfaces';

export const UserCard = ({ user, onSelect }: UserCardProps) => {
  const handleClick = useCallback(() => {
    onSelect(user.id);
  }, [onSelect, user.id]);

  return (
    <Container onClick={handleClick}>
      <Title>{user.name}</Title>
    </Container>
  );
};
```

**Styled file**:
```typescript
'use client';
import styled from 'styled-components';
import { colorsFlatMap, spacingFlatMap } from '@theme';

export const Container = styled.div`
  background-color: ${colorsFlatMap.white};
  padding: ${spacingFlatMap.md};
`;
```

**Component Types**: UI Components (`libs/presentation/components/`), Admin Screens (`apps/admin/presentation/screens/` → `NameScreen`), Public Pages (`apps/public/presentation/pages/` → `NamePage`).

#### Custom Hooks

- Encapsulate business logic from components
- Select data from Redux using selectors
- Dispatch actions based on lifecycle
- Return object with state + handlers
- `useCallback` for handler functions
- Single responsibility per hook
- Compose smaller hooks when >200 lines

**Hook patterns**: Data fetching (dispatch + selector + loading), Form management (state + validation + submit), List management (list + selection + delete).

```typescript
export const useUserProfile = (userId: string) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUserById(userId));
  const loading = useAppSelector(selectUsersLoading);

  useEffect(() => {
    if (userId) dispatch(fetchUserById(userId));
  }, [userId, dispatch]);

  const handleUpdate = useCallback((data: UpdateUserData) => {
    dispatch(updateUser({ userId, data }));
  }, [userId, dispatch]);

  return { user, loading, handleUpdate };
};
```

#### Styling

- **styled-components** only (no inline styles, no CSS modules)
- **Flat maps**: `colorsFlatMap`, `spacingFlatMap` (NO theme context for SSR compatibility)
- **Transient props**: `$` prefix to prevent DOM leaking
- **Design tokens**: centralized color/spacing/typography system
- **Responsive**: mobile-first with breakpoint utilities

### 5.6 Next.js Layer

#### API Routes (Thin Controllers)

- `withAuthMiddleware` for protected routes with role-based access
- Extract params, delegate 100% to Use Cases
- `handleApiError` for centralized error handling
- `HTTP_STATUS` constants (no magic numbers)
- `await context.params` (Next.js 15+ async params)
- Conditional spreading for optional params

```typescript
export const GET = withAuthMiddleware(
  async (request: NextRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const result = await executeGetUsers({
        ...(searchParams.get('role') && { role: searchParams.get('role') }),
        ...(searchParams.get('search') && { search: searchParams.get('search') }),
        request,
      });
      return NextResponse.json(result, {
        status: result.success ? HTTP_STATUS.OK : HTTP_STATUS.BAD_REQUEST,
      });
    } catch (error) {
      return handleApiError(error, 'GET /api/admin/users');
    }
  },
  ['admin']
);
```

**File structure**:
```
src/app/api/admin/users/
├── route.ts                # GET, POST
├── route.interfaces.ts
├── count/
│   └── route.ts            # GET /count
└── [id]/
    ├── route.ts            # GET, PUT, DELETE
    └── route.interfaces.ts
```

#### App Router

- Pages delegate to components (`page.tsx` = thin delegation only)
- `generateMetadata` MUST use Use Cases, NEVER repositories
- Clean Architecture mandatory in all layers

#### Middleware

- `withAuthMiddleware` provides JWT validation, RBAC, automatic 401/403

### 5.7 Cross-Cutting Concerns

| Module | Key Patterns |
|--------|-------------|
| **Auth** | Session management, RBAC (role-based access control), `validateAndGetUser()` |
| **Media** | Image handling with Next.js Image, file uploads to cloud storage |
| **Styling** | styled-components, design tokens, responsive layouts, spacing system |
| **Database** | Prisma with migrations, soft delete, transform functions |
| **Payments** | Stripe integration pattern |
| **Helpers** | `handleRequest`, `simulateNetworkDelay`, `createAppError`, `logError`, `applyFilters`, `applyPagination` |

### 5.8 TypeScript Alias Configuration

Explicit short aliases in single root `tsconfig.json` + matching Turbopack `resolveAlias`:

```json
{
  "compilerOptions": {
    "paths": {
      "@apps/admin/components": ["./src/apps/admin/presentation/components"],
      "@apps/admin/hooks": ["./src/apps/admin/presentation/hooks"],
      "@apps/admin/screens": ["./src/apps/admin/presentation/screens"],
      "@apps/admin/domain": ["./src/apps/admin/domain"],
      "@apps/public/components": ["./src/apps/public/presentation/components"],
      "@apps/*": ["./src/apps/*"]
    }
  }
}
```

---

## 6. Governance (ESLint as Law Enforcement)

```
Standards (Law)           → Define what's legal
Patterns (Procedures)     → Define how to comply
ESLint Rules (Police)     → Detect violations in real-time
CI Pipeline (Courts)      → Final judgment (0 errors required)
eslint-disable (Appeals)  → Exceptions with justification (rare)
```

### Custom ESLint Rules

| Rule | Principle Enforced | Violation Example |
|------|--------------------|-------------------|
| `no-cross-context-imports` | Territorial Integrity | admin ↔ public imports |
| `no-cross-layer-imports` | Non-Intervention | UI calling database |
| `no-direct-service-calls` | Trade Agreements | Component calling API directly |
| `no-hardcoded-colors` | Clear Borders | Magic colors instead of colorsFlatMap |
| `no-hardcoded-spacing` | Clear Borders | Magic numbers instead of spacingFlatMap |
| `no-inline-types` | Self-Sufficiency | Types in implementation files |
| `enforce-use-case-pattern` | Territorial Integrity | Business logic in routes |
| `no-native-html` | Trade Agreements | Raw HTML instead of styled-components |

### Quality Gates

```bash
yarn type-check  # 0 TypeScript errors
yarn lint        # 0 ESLint errors, 0 warnings
yarn test        # All passing
yarn build       # Success
```

---

## 7. Disciplines (Skeletons)

| Discipline | Stack | Architecture | Status |
|------------|-------|-------------|--------|
| **Frontend** | React + Next.js + TS | Clean Architecture | **Active** (~50 files) |
| Backend | .NET Core | Clean Architecture + CQRS | Skeleton |
| QA Automation | Java + Selenium | Page Object Model | Skeleton |
| Infrastructure | Terraform + Ansible | IaC patterns | Skeleton |
| SRE | Kubernetes + GitOps | ArgoCD/Flux | Skeleton |
| E-commerce | Shopify Hydrogen | Composable | Skeleton |

Each discipline follows the same internal structure: `index.md`, `architecture/`, `patterns/`, `testing/`, `framework/`, `sops/`.

---

## 8. Critical Policies

| # | Policy | Description |
|---|--------|-------------|
| 1 | **Investigation First** | Search existing before creating any file |
| 2 | **Context First** | Read snapshots before exploring code (~80% token savings) |
| 3 | **No Subagents** | Use Grep/Read/Edit/Glob directly |
| 4 | **Git Discipline** | Commits only when explicitly requested |
| 5 | **English Documentation** | All technical docs in English; Spanish only for UI/user-facing |
| 6 | **Zero Tolerance** | 0 ESLint errors, 0 TypeScript errors, 0 warnings |
| 7 | **No Plan Mode** | Create `.claude/plans/PLAN-NAME.md` files, not EnterPlanMode |
| 8 | **Check Existing** | Always search if something already exists before creating |
| 9 | **No ESLint Modifications** | Never modify ESLint rules without explicit user authorization |
| 10 | **No Re-exports** | Each constant/type/utility exists in exactly ONE location |

---

## 9. SOPs (Standard Operating Procedures)

| SOP | Purpose |
|-----|---------|
| `core/sops/api-testing.md` | API testing with curl |
| `core/sops/pr-documentation.md` | PR template and documentation |
| `core/sops/ai-usage-policy.md` | Claude Code enterprise security & data protection |
| `core/sops/sovereignty-replication.md` | Replicating sovereignty to new projects |

---

## 10. Known Issues & Production Fixes

| Issue | Fix |
|-------|-----|
| styled-components 6.2.0+ with Next.js 16 | Pin to `6.1.14` |
| Turbopack SVG distortion | `removeViewBox: false` in SVGR config |
| Keyframe interpolation `[object Object]` | Use `css` helper from styled-components |

---

## Summary

- **~90 technical files** across doctrine, core, and frontend
- **Frontend** is the only fully active discipline (~50 files); rest are skeletons ready to expand
- **Core thread**: Sovereignty metaphor — independent layers, clear borders, fair data trade
- **Governance enforced** via custom ESLint rules + CI pipeline + zero tolerance policy
- **Production-validated** across multiple codebases (reference project as reference implementation)
- **Philosophy**: "Without sovereignty, AI accelerates collapse. With sovereignty, AI accelerates progress."

---

**Synthesis Version**: 1.0 | **Generated**: 2026-02-22
