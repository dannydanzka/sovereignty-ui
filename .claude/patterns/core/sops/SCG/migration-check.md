# SCG Step 5: Migration Check

> **Input**: Plan with files flagged for JS→TS migration
> **Output**: Migrated `.ts` files with interfaces and barrel exports

---

## Procedure

### 5.1 Decision tree

```
File to modify is .js?
  NO → Skip this step
  YES → Is it a core file we're significantly changing?
    NO → Edit .js as-is (minor fix doesn't justify migration)
    YES → Migrate to .ts before making changes
```

### 5.2 Migration steps

For each `.js` file:

1. **Read the file** — understand all exports, imports, logic
2. **Create `.interfaces.ts`** — extract all types (props, params, return types)
3. **Rename `.js` → `.ts`** (or `.jsx` → `.tsx` if JSX)
4. **Add types** — function params, return types, variables
5. **Create `index.ts`** barrel export (if folder has multiple files)
6. **Check imports** — update any file that imports from the old path

### 5.3 JS-origin dependency check

After migration, run `npx tsc --noEmit --project tsconfig.json`.

| Error type | Source | Action |
|-----------|--------|--------|
| Error in OUR migrated file | TS-origin | FIX — real type error |
| Error from imported `.js` dependency | JS-origin | SKIP — requires migrating that dep too |
| Error from `.d.ts` of JS component | JS-origin | SKIP — incomplete manual types |

**How to identify JS-origin**: Check if the error source file is `.js` with a manual `.d.ts`:

```bash
ls src/path/Component.js    # JS component
ls src/path/Component.d.ts  # Manual types (often incomplete)
```

If both exist → JS-origin → SKIP.

---

## Rules

- Migrate BEFORE making functional changes — clean separation of concerns
- One commit for migration, another for functional changes (when possible)
- NEVER add `@ts-ignore` — use `@ts-expect-error` with justification if needed
- NEVER fix JS-origin errors — document them and move on
