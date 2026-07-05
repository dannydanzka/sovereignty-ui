# SCD Step 3: Code Context

> **Input**: Files to touch (from business context + technical context)
> **Output**: Codebase investigation results, migration needs identified

---

## Procedure

### 3.1 Find existing patterns

```bash
# Search for similar implementations
grep -r "SimilarFeature" src/ --include="*.tsx" --include="*.ts" -l

# Check if module/domain already exists
ls src/modules/<Module>/
ls src/services/<domain>/
ls src/state/{actions,reducers,sagas,selectors}/<domain>/
```

### 3.2 Read 2-3 similar files

Before creating ANY new file, read existing files of the same type:
- Creating a service? Read 2 existing services
- Creating a saga? Read 2 existing sagas
- Creating a hook? Read 2 existing hooks

Match the existing patterns — do NOT invent new conventions.

### 3.3 Check file types (JS vs TS)

```bash
# For each file we'll touch:
ls src/path/to/file.{js,ts,tsx}
```

| File type | Action |
|-----------|--------|
| `.ts` / `.tsx` | Ready — no migration needed |
| `.js` with `.d.ts` | JS-origin — migration optional (flag in plan) |
| `.js` without `.d.ts` | Migrate to `.ts` if we're modifying it (SCG step 5) |

### 3.4 Check dependencies

For each file we'll modify, check what imports it:

```bash
grep -r "from.*/<filename>" src/ --include="*.ts" --include="*.tsx" --include="*.js" -l
```

This reveals the blast radius of our changes.

### 3.5 Check Redux state shape

If task involves state management:

```bash
# Check existing actions, reducers, selectors
ls src/state/actions/<domain>/
ls src/state/reducers/<domain>/
ls src/state/selectors/<domain>/
```

---

## Rules

- NEVER code from memory — always investigate current state
- 2-3 similar files is the minimum — match existing patterns
- Flag JS files for migration in the plan — SCG handles the actual migration
- Document blast radius — changes that affect many files need extra care
