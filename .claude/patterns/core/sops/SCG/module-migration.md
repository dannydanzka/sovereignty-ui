# SCG: Module Migration SOP (JS → TS)

> **INPUT**: Module identified for full JS→TS migration
> **OUTPUT**: Module with 0 JS files, 0 TS errors, 0 ESLint errors, all tests green
> **REFERENCE**: TICKET-ID monitoring migration (28 phases, 420 files)
> **PATTERN**: `frontend/tooling/js-to-ts-migration.md`

---

## When to Use

- Dedicated refactor ticket (Tier 2-3 from `refactor-cost-benefit.md`)
- Module is Critical/High criticality and needs structural improvement
- Multiple features planned in the module — migration pays for itself

## Pre-Requisites

- [ ] Business context file exists (SCD complete)
- [ ] Code snapshot taken (files, lines, JS/TS ratio, tests, ESLint warnings)
- [ ] Refactor tier approved by Tech Lead (if Critical module)
- [ ] Plan file exists with phase breakdown

---

## Migration Phases

### Phase R0: Foundation (Interfaces + Constants)

**Rationale**: Everything else depends on types. Interfaces are the backbone.

1. Create `.interfaces.ts` — Convert PropTypes models to TS interfaces
2. Migrate constants to `.ts` with `as const` (type narrowing)
3. Create/update barrel `index.ts` with `export *`
4. Delete PropTypes `.model.js` files after interfaces are complete

**Validation**: `npx tsc --noEmit` — new interfaces compile, no new errors.

### Phase R1: Redux Infrastructure

**Order**: Action Types → Selectors → Actions → Reducer → Sagas

1. **Action Types** — Template literals with alias (`const ALIAS = 'DOMAIN'`)
2. **Selectors** — Three-tier (base → simple → composed → aggregate)
3. **Actions** — Factory pattern for similar actions, named exports
4. **Reducer** — Switch/case or handler map, typed `initialState`
5. **Sagas** — Factory with `sagaHandler`, export worker maps for testing

**Naming enforcement** (ESLint `enforce-naming-convention`):
- `*Action` (triggers), `*Success`/`*Failure` (results), `cleanFlags`/`cleanState`

**Validation**: Tests green for actions, reducer, sagas. Selectors tested with mock state.

### Phase R2: Service Layer

1. Rename `.service.js` → `.service.ts`
2. Type factory params and return types from R0 interfaces
3. Create `.service.interfaces.ts` for API config types
4. JS-origin errors from `handleYOUR-PROJECTRequest` → SKIP with `@ts-expect-error`

**Validation**: Service tests green.

### Phase R3: Hooks

1. Relocate misplaced hooks (e.g., helpers/ → hooks/)
2. Type params and return types using R0 interfaces + R1 selectors
3. Compose orchestrator hooks that combine sub-hooks
4. Use aggregate selectors (Tier 4) — never access state directly

**Validation**: Hook tests green with `renderHook` + mock store.

### Phase R4: Components

Per component: `.tsx` + `.styled.ts` + `.interfaces.ts` + `.test.tsx` + `index.ts`

1. Props from PropTypes → interface with defaults
2. `export default` → named export (except `.screen.tsx`)
3. Remove `React.memo` (re-add only if profiling justifies)
4. styled-components: theme tokens, transient props with `$`

**Validation**: Component tests green, 0 ESLint warnings.

### Phase R5: Mocks

1. Migrate `.mocks.js` → `.mocks.ts`
2. Named exports (not `export default`)
3. `request/response` structure matching real API
4. Spanish locale data

### Phase R6: Tests

1. Migrate `.test.js` → `.test.tsx`
2. RTL Native patterns (`toBeOnTheScreen`, `userEvent.setup()`)
3. Provider wrapping with mock store
4. Remove snapshot tests — replace with behavior tests

### Phase R7: Final Validation

```bash
find src/modules/[Module]/ -name "*.js" -not -name "*.config.*" | wc -l  # 0
npx tsc --noEmit --project tsconfig.json  # 0 new errors
npm run lint                               # 0 errors
npm run test:unit                          # All green
```

---

## ESLint Compliance (Progressive)

Don't fix all warnings at once — attack per phase:

| Phase | Focus Rules |
|-------|------------|
| R0-R1 | `component-organization`, `enforce-naming-convention` |
| R2-R3 | `import-strategy`, `no-import-rename` |
| R4 | `design-tokens-policy`, `code-size-limits`, `no-native-view-text` |
| R5-R6 | `index-barrel-exports-only`, `no-alias-exports` |
| R7 | `comments-policy`, `no-eslint-disable`, remaining |

---

## Code Snapshot Template

Take BEFORE starting migration (`.claude/status/STATUS-{TICKET}.md`):

```markdown
## Module: [Name]
## Date: [date]
## Files: [count JS] JS + [count TS] TS
## Tests: [count] suites, [count] tests
## ESLint warnings: [count]
## TS errors: [count]
```

Update AFTER each phase to track progress.

---

## Rules

- **Migrate BEFORE functional changes** — clean separation
- **One commit per phase** when possible
- **Never fix JS-origin errors** from other modules
- **Delete PropTypes after interfaces** — no coexistence
- **Run validation after each phase** — don't accumulate errors
