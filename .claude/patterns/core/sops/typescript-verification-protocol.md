# TypeScript Verification Protocol

> **Priority**: CRITICAL - Must follow exactly
> **Scope**: ALL TypeScript projects (monorepos, Next.js, React, React Native)
> **Purpose**: Prevent false errors and wasted debugging time
> **Updated**: 2026-04-09

---

## TypeScript Verification Command

**ALWAYS use `--project tsconfig.json`**:

```bash
# From project root
yarn tsc --noEmit --project tsconfig.json

# Monorepo package
yarn --cwd packages/<package-name> tsc --noEmit --project tsconfig.json

# Or from project root with explicit path
yarn tsc --noEmit --project packages/<package-name>/tsconfig.json
```

### Never Use

| Command | Problem |
|---------|---------|
| `yarn tsc --noEmit src/file.tsx` | Missing --project flag |
| `npx tsc --noEmit file.tsx` | Missing --project flag |
| `tsc --noEmit file.tsx` | Missing --project flag |
| ANY tsc without `--project` | Missing config |

### Why `--project` is Mandatory

Without `--project tsconfig.json`:
- tsc doesn't load project config (jsx, paths, compilerOptions)
- Shows FALSE errors: "Cannot use JSX", "Module not found"
- Wastes hours debugging non-existent problems

**Rule**: Before ANY tsc command, verify it includes `--project tsconfig.json`

---

## TypeScript Error Protocol

### When Seeing "Module has no exported member"

```
error TS2305: Module '"@package/lib/..."' has no exported member 'TypeName'.
```

### Step 1: Check .d.ts Files (FIRST)

```bash
find packages/lib-utils/lib -name "*.d.ts" | wc -l
```

| Result | Action |
|--------|--------|
| **0** | Build system broken → Go to Step 2 |
| **> 0** | Check troubleshooting docs |

### Step 2: Fix Build System

**Check tsconfig.json**:

```json
// ❌ WRONG
"noEmit": true

// ✅ CORRECT
"emitDeclarationOnly": true,
"outDir": "lib",
"rootDir": "src"
```

**Check package.json**:

```json
// ❌ WRONG - build:clean-dts deletes .d.ts files
"build:lib": "... && build:clean-dts && build:types"

// ✅ CORRECT
"build:lib": "build:clean && build:babel && build:types && build:assets"
```

### Step 3: Rebuild

```bash
yarn --cwd packages/lib-utils build:lib
find packages/lib-utils/lib -name "*.d.ts" | wc -l  # Should be > 0
```

---

## Error Triage: JS-Origin vs TS-Origin

In projects with JS and TS files coexisting, many TS errors originate from JS components that lack proper type definitions. Triage before fixing.

### Classification

| Origin | Example | Action |
|--------|---------|--------|
| **JS-origin** | `TS2322` on props — component is `.js` with manual `.d.ts` | **DO NOT FIX** — requires migrating the JS component to TS first |
| **JS-origin** | `TS2339` on hook return — hook is `.js`, return typed as `object` | **DO NOT FIX** — requires JS→TS migration of the hook |
| **TS-origin** | `TS2322` type mismatch between two `.ts`/`.tsx` files | **FIX** — real type error in authored TypeScript |
| **TS-origin** | `TS2307` module not found — missing export or build issue | **FIX** — check exports and run build |

### How to Identify JS-Origin Errors

```bash
# Check if the error source is a JS file with manual .d.ts
ls packages/lib-ui/src/components/Modal/Modal.js    # JS component
ls packages/lib-ui/src/components/Modal/Modal.d.ts  # Manual types (often incomplete)
```

If the component/hook causing the error is `.js` with a `.d.ts` → **JS-origin**, skip it.

---

## DO / DON'T

### DO

- ✅ Check .d.ts files FIRST
- ✅ Fix build system if broken
- ✅ Read troubleshooting docs IMMEDIATELY
- ✅ Always use `--project tsconfig.json`

### DON'T

- ❌ Import from src/ directly
- ❌ Define types locally BEFORE checking build
- ❌ Use workarounds BEFORE fixing root cause
- ❌ Waste time with other solutions
- ❌ Run tsc without --project flag

---

## Troubleshooting Decision Tree

```
TypeScript Error
      ↓
Is it "Module has no exported member"?
      ↓
   YES → Check .d.ts count
      ↓
   Count = 0?
      ↓
   YES → Fix build system (tsconfig + package.json)
      ↓
   Rebuild → Verify .d.ts files exist
      ↓
   Run tsc --project tsconfig.json again
```

---

## See Also

- `frontend/tooling/typescript.md` — TypeScript strict mode, tsconfig
- `frontend/tooling/typescript-error-suppression.md` — Gradual TS migration policy
- `frontend/tooling/js-to-ts-migration.md` — Full JS→TS migration guide
