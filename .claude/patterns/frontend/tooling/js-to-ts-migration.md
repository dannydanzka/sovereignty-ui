# JS to TS Migration Pattern

> **PURPOSE**: Systematic approach for migrating JavaScript modules to TypeScript
> **SCOPE**: Any React/Next.js/React Native project with mixed JS/TS codebase
> **UPDATED**: 2026-04-09

---

## Core Principles

1. **No backups, no `.old` files** — git is the version control system. Use `git show HEAD:path/to/file.js` to recover.
2. **No bridges or re-exports** — update ALL consumers immediately. Migration is not done until every import points to the real source.
3. **No default exports** (except `.screen.tsx` for React.lazy and saga root generators for `spawn()`).
4. **No PropTypes coexistence** — `.interfaces.ts` replaces `.model.js` entirely. Delete PropTypes files.
5. **Delete `.js` when `.ts` exists** — Webpack/bundler `resolve.extensions` may resolve `.js` before `.ts`, so the old file shadows the new one.

---

## Strategy: Delete and Replace

```
1. Create .ts/.tsx with typed content → 2. Delete .js/.jsx → 3. Update ALL consumer imports
4. Update index to barrel (export *) → 5. Move to next file
```

**No parallel files. No backups. No bridges.** Git has every version of every file.

### Phase Order (Dependencies-First)

```
 1. Interfaces (.interfaces.ts)      8. Service (.service.ts)
 2. Constants (.ts + as const)       9. Hooks (.ts)
 3. Action Types (.actionTypes.ts)  10. Components (.tsx)
 4. Selectors (.selectors.ts)       11. Mocks (.ts)
 5. Actions (.actions.ts)           12. Utils (.ts)
 6. Reducer (.reducer.ts)           13. Tests (.test.ts/.tsx)
 7. Sagas (.sagas.ts)               14. Index (.ts) + import updates + validation
```

**Rule**: Never migrate a file before its dependencies are migrated (or have interfaces).
**Rule**: A folder is not done until it has zero `.js` files — tests and utils included.

---

## Export Conventions

### Named exports only (standard)

```typescript
/** Component */
const UserCard = () => { ... };
export { UserCard };

/** Index — always export * */
export * from './UserCard';
export * from './UserCard.interfaces';
```

### Exceptions to named-only

| File Type | Export | Reason |
|-----------|--------|--------|
| `.screen.tsx` / `page.tsx` | `export default` | `React.lazy()` / Next.js requires default |

### React.memo — Remove during migration

`React.memo` adds wrapper complexity with negligible benefit for infrequently-rendered components. Remove during migration, re-add only if profiling proves measurable savings.

---

## JS-Origin TS Errors

Errors caused by JS-origin dependencies are **expected and must NOT be fixed** during migration.

**How to identify**: Error source is a `.js` file or module with manual `.d.ts`.

```typescript
/** @ts-expect-error — sagaHandler is a JS-origin export without .d.ts */
import { sagaHandler } from '@utils/state/store/sagas/global';
```

### Classification

| Origin | Action |
|--------|--------|
| Source is `.js` with manual `.d.ts` | **DO NOT FIX** — requires migrating the JS component first |
| Source is `.ts`/`.tsx` you authored | **FIX** — real type error |

**Rule**: Only fix TS errors where both the error AND its source are in `.ts`/`.tsx` files you authored.

---

## Default Export Elimination

**Rule**: Do NOT bulk-migrate default exports when the consumer count is high (>10 files) and the consumers span multiple modules.

| Consumer count | Scope | Action |
|---------------|-------|--------|
| 1-5 files | Same module | Migrate immediately (named import) |
| 5-10 files | Same module | Migrate immediately |
| 5-10 files | Cross-module | Migrate if all files are already being touched |
| 10+ files | Any | **Dual export + TODO** — defer to dedicated cleanup task |

### Dual export pattern (safe transitional)

```typescript
/** Source file — keeps both exports temporarily */
const myUtility = (arg: string) => { ... };

export { myUtility };
export default myUtility;
```

---

## Post-Migration TS Error Resolution

After migrating files, fix in priority order:

| Priority | Error | Fix |
|----------|-------|-----|
| 1 | TS7006/TS7031 implicit `any` | Add parameter types to hooks, callbacks |
| 2 | TS2339 property on `never` | Add prop interfaces — TS infers `never` for destructured defaults without types |
| 3 | TS2322 type assignment | Add return types to `useMemo`, cast data for JS component props |
| 4 | TS2345 type argument | `Math.round(item.field ?? 0)` for optional numbers |
| 5 | TS4111 index signature | Bracket notation `obj['key']` for `Record<string, unknown>` |
| 6 | TS2578 unused @ts-expect-error | Remove directives no longer needed post-migration |

---

## Validation Checklist

After completing a module migration:

- [ ] Zero `.js` files remaining in migrated folder (including tests)
- [ ] All consumers updated to new import paths
- [ ] No re-export bridge files
- [ ] No PropTypes files remaining
- [ ] `yarn tsc --noEmit --project tsconfig.json` passes
- [ ] `yarn lint` passes
- [ ] All tests pass
- [ ] Build succeeds

---

## See Also

- `frontend/tooling/typescript.md` — TypeScript strict mode, tsconfig
- `frontend/tooling/typescript-error-suppression.md` — Gradual migration policy
- `core/sops/typescript-verification-protocol.md` — Always use --project flag
- `core/workflow/refactor-cost-benefit.md` — When to invest in migration vs ship the feature
