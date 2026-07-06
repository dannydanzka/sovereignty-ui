# SCG Step 9: Validation

> **Input**: Implementation + tests complete
> **Output**: Zero lint errors, zero TS errors, clean code
> **This is the LAST step before delivery (SDP)**

---

## Procedure

### 9.1 Run lint

```bash
npm run lint
```

**Target**: 0 errors. Warnings are acceptable if preexistent.

Common fixes:

| ESLint rule | Fix |
|-------------|-----|
| `custom/comments-policy` | Remove single-line `//` comments. Use JSDoc or delete |
| `no-console` | `console.log` → `console.info` (allowed) or remove |
| `prettier/prettier` | Run `npm run lint:js:fix` |
| `typescript-sort-keys/interface` | Alphabetical sort or autofix |
| `import/order` | Autofix sorts imports |

### 9.2 Run TypeScript check

```bash
npx tsc --noEmit --project tsconfig.json
```

**CRITICAL**: Always include `--project tsconfig.json`. Without it, tsc shows false errors.

**Target**: 0 NEW errors from our changes.

### 9.3 Error triage

| Error | Origin | Action |
|-------|--------|--------|
| In file we created/modified | TS-origin | FIX |
| In file we didn't touch | Preexistent | SKIP |
| From `.js` dependency we import | JS-origin | SKIP |
| `Module has no exported member` | Check `.d.ts` files | See typescript-verification protocol |

### 9.4 Final cleanup checklist

- [ ] No `console.log` (use `console.info` if needed)
- [ ] No `debugger` statements
- [ ] No commented-out code
- [ ] No `any` types in production code
- [ ] No `@ts-ignore` (use `@ts-expect-error` with justification)
- [ ] No `// eslint-disable` without explicit permission
- [ ] No inline styles (use styled-components)
- [ ] No hardcoded strings (use i18n)
- [ ] No hardcoded URLs (use config)
- [ ] No TODO without implementation plan

---

## Rules

- Run BOTH lint AND tsc — never skip either
- Fix only errors from OUR changes — don't fix the world
- If a preexistent error is in a file we touched, it's now ours — fix it
- This step is NON-NEGOTIABLE before SDP
