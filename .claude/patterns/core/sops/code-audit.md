# SOP: Code Audit

> **PURPOSE**: Systematic validation of code changes before commit/PR — catches issues that slip past incremental development
> **SCOPE**: After completing a feature, bugfix, or refactor — before commit or PR creation
> **PREREQUISITE**: All implementation work is done; no pending code changes in progress
> **UPDATED**: 2026-03-23

---

## What This SOP Is

Code generation is fast. Code **governance** is what separates shipping from shipping correctly.

AI-assisted development can produce large volumes of code in a single session. Each file may pass local validation, but the **aggregate** can introduce:
- Test failures in files you didn't touch (mocks drift, interface changes)
- Lint warnings that accumulate across multiple edits
- Type errors that only surface when the full graph is checked
- Build failures from missing exports, circular dependencies, or SSR issues

This SOP is the final gate before code leaves the developer's machine.

> *"Es muy facil generar codigo, pero a veces dejamos de lado ciertas cosas que eslint nos puede avisar o a veces ya es mas de flujo que de codigo."*
> It's very easy to generate code, but sometimes we overlook things that eslint can flag, or sometimes the issue is flow, not code.

---

## When to Run

| Trigger | Audit Scope |
|---------|-------------|
| Feature complete, before commit | Full audit (all 4 phases) |
| Bugfix, before commit | Quick audit (Phase 1 + Phase 4) |
| Refactor complete | Full audit |
| Pre-existing failures discovered | Targeted audit (Phase 2 focus) |
| Before PR creation | Full audit (mandatory) |

---

## Phase 1 — Static Analysis (Automated)

Run the project's full validation suite. Order matters — fix upstream before downstream.

### 1.1 TypeScript Check

```bash
# Use your project's configured command — NEVER raw tsc
yarn type-check    # or: npm run type-check
```

**Why first**: Type errors cascade. A missing export causes import errors, which cause unused-variable warnings. Fix types first, and many lint errors disappear.

**What to look for**:
- Missing exports from new modules
- Interface mismatches between layers (use case returns X, API route expects Y)
- `any` types that slipped in during rapid development
- Generic inference issues (e.g., `useState` with `as const` values)

### 1.2 Linter Check

```bash
yarn lint          # or: npm run lint
```

**Common issues after feature development**:

| Issue | Typical Cause | Fix |
|-------|---------------|-----|
| Prettier formatting | Multi-line imports that should be single-line (or vice versa) | Autofix: `--fix` |
| Hardcoded design tokens | `16px`, `#FFF`, `rgba()` in styled-components | Replace with token: `${spacing.md}`, `${color.white}` |
| CSS property order | Properties not alphabetical in styled-components | Reorder alphabetically |
| Native HTML elements | `<div>`, `<span>` used directly | Create styled-component |
| Dead code | Unused imports, variables, styled-components defined but never used | Remove |
| Architecture boundary | Cross-context imports (admin <-> public) | Restructure import |

**Key principle**: Fix ALL warnings, not just errors. Warnings accumulate into tech debt.

### 1.3 Stylelint Check (if applicable)

```bash
yarn lint:css      # or: npx stylelint "**/*.styled.{ts,tsx}"
```

**Common issues**: CSS property order violations in styled-components.

---

## Phase 2 — Test Audit (The Critical Phase)

This is where most post-development issues hide. Tests fail not because your code is wrong, but because the **test assumptions** no longer match the implementation.

### 2.1 Run Full Test Suite

```bash
yarn test --run    # or: npm test -- --run
```

**Do NOT run only your new tests.** Run the entire suite. Your changes may break tests in files you never opened.

### 2.2 Classify Failures

When tests fail, classify before fixing:

| Classification | Description | Action |
|----------------|-------------|--------|
| **Direct** | Test for code you modified | Fix — your responsibility |
| **Indirect** | Test for code that depends on your changes | Fix — you caused the breakage |
| **Pre-existing** | Failure exists on clean main branch | Fix if feasible, document if not |
| **Mock drift** | Implementation changed but test mocks didn't | Update mocks to match new implementation |

### 2.3 Verify Pre-existing Failures

Before assuming a failure is your fault:

```bash
# Stash your changes and run tests on clean state
git stash
yarn test --run
git stash pop
```

If the same tests fail on clean main, they are pre-existing. You can still fix them (recommended), but they are not blockers for your PR.

### 2.4 Common Test Fix Patterns

#### Mock Drift (Most Common)

When implementation changes from repository methods to direct database operations (e.g., Prisma transactions):

**Before** (test mocks repository):
```typescript
vi.mock('@repositories/business', () => ({
  evidenceAttemptRepository: {
    findById: vi.fn(),
    update: vi.fn(),  // Implementation no longer calls this
  },
}));
```

**After** (test mocks database + repository):
```typescript
const mockTx = {
  evidenceAttempt: { update: vi.fn() },
  userChallenge: { findFirst: vi.fn(), update: vi.fn() },
  enrollment: { findUnique: vi.fn(), update: vi.fn() },
};

vi.mock('@database', () => ({
  prisma: {
    $transaction: vi.fn((cb) => cb(mockTx)),
  },
}));

vi.mock('@repositories/business', () => ({
  evidenceAttemptRepository: {
    findById: vi.fn(),  // Still used for pre/post transaction reads
  },
}));
```

#### Double-Call Pattern

When a function calls `findById` twice (once for validation, once for result):

```typescript
// WRONG: single mock returns same value for both calls
(repository.findById as Mock).mockResolvedValue(entity);

// RIGHT: different values for each call
(repository.findById as Mock)
  .mockResolvedValueOnce(pendingEntity)    // validation call
  .mockResolvedValueOnce(processedEntity); // post-operation call
```

#### UI Component Drift

When component rendering changed but tests check old text/structure:

```typescript
// Read the ACTUAL component to see current UI text
// Don't guess — grep for the exact strings
```

**Protocol**: Always read the implementation file before fixing its test. Never fix a test based on assumptions about what the code does.

### 2.5 Missing Mocks

New dependencies added during development that tests don't mock:

```typescript
// Added @logger import to use case? Mock it in tests:
vi.mock('@logger', () => ({
  logError: vi.fn(),
  logInfo: vi.fn(),
}));
```

---

## Phase 3 — Build Verification

```bash
yarn build         # or: npm run build
```

**Why after tests**: Build catches different issues than tests — SSR compatibility, missing `'use client'` directives, tree-shaking failures, route generation.

**What to look for**:
- New routes appear in the build output
- No SSR errors for client-only components
- Bundle size is reasonable (no accidental large imports)
- Dynamic imports resolve correctly

---

## Phase 4 — Structural Review

Manual verification that automated tools cannot catch.

### 4.1 Architecture Compliance

| Check | How |
|-------|-----|
| No cross-context imports | Grep for imports between admin/public/auth |
| Data flow intact | Components use hooks, hooks use Redux, Redux uses services |
| No business logic in routes | Routes delegate to use cases |
| No IO in domain layer | Use cases use repositories, not direct DB calls |

### 4.2 Security Review

| Check | What to verify |
|-------|----------------|
| No secrets in code | No API keys, tokens, passwords in committed files |
| Auth on new endpoints | All new API routes have `withAuthMiddleware` or `validateAndGetUser` |
| Input validation | User input is validated before processing |
| Private resources | Files/URLs that should be private are not publicly accessible |

### 4.3 Context Snapshots (if applicable)

If your project uses context snapshots (`.claude/status/`):

- [ ] New use cases documented in relevant snapshot
- [ ] New API endpoints added to endpoint reference
- [ ] Entity changes reflected in data model reference
- [ ] Navigation changes reflected in overview snapshots

---

## Audit Checklist

Copy this checklist for each audit:

```markdown
## Code Audit — [Feature/Fix Name] — [Date]

### Phase 1: Static Analysis
- [ ] TypeScript: 0 errors (`yarn type-check`)
- [ ] ESLint: 0 errors, 0 warnings (`yarn lint`)
- [ ] Stylelint: 0 errors (if applicable)

### Phase 2: Tests
- [ ] Full suite executed (`yarn test --run`)
- [ ] All tests passing (N files, N tests)
- [ ] Pre-existing failures identified and classified
- [ ] Mock drift addressed for refactored code
- [ ] No `.only()` or `.skip()` left in test files

### Phase 3: Build
- [ ] Build succeeds (`yarn build`)
- [ ] New routes visible in build output (if applicable)
- [ ] No SSR errors

### Phase 4: Structural
- [ ] No cross-context imports
- [ ] Auth on all new endpoints
- [ ] Context snapshots updated (if applicable)
- [ ] No secrets in code

### Result
- [ ] PASS — Ready for commit/PR
- [ ] FAIL — Issues documented, fixes in progress
```

---

## Audit Depth by Change Size

Not every change needs the full audit. Match depth to risk:

| Change Size | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|-------------|---------|---------|---------|---------|
| 1-3 files (bugfix) | Full | Targeted (related tests) | Skip | Quick scan |
| 4-10 files (feature) | Full | Full suite | Full | Full |
| 10+ files (major feature) | Full | Full suite | Full | Full + peer review |
| Mass refactor (50+ files) | Full | Full suite | Full | Full + architecture review |

---

## Integration with SCG

This SOP expands **SCG Phase 8.5 (Full Validation Suite)** into a complete, repeatable procedure.

```
SCG Phase 8.4 (Linter Cleanup)
     |
     v
Code Audit SOP (this document)  <-- Replaces the 3-line validation in SCG 8.5
     |
     v
SCG Phase 8.6 (Checklist)
```

The audit is the bridge between "code is written" and "code is ready for review."

---

## Anti-Patterns

| Anti-Pattern | Why It Fails |
|--------------|-------------|
| Running only new test files | Misses indirect breakage from your changes |
| Fixing lint but not re-running tests | Lint fixes can introduce regressions |
| Skipping build because tests pass | SSR issues only surface at build time |
| Assuming pre-existing failures are not your problem | They compound — fix them when you can |
| Running audit phases in wrong order | Type fixes eliminate lint warnings; fixing lint first wastes effort |
| Disabling rules instead of fixing code | `eslint-disable`, `@ts-ignore` — bypasses the structural immune system |

---

**Status**: v1.0 — Extracted from production development methodology. Platform-agnostic, applicable to any project with TypeScript + linting + testing + build pipeline.
