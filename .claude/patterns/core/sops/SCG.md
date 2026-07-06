# SCG — Sovereign Code Governance

> **Phase**: DURING code — implement with discipline
> **Prerequisite**: SCD complete (business context, plan, files identified)
> **Location**: `rules/sop/SCG.md` (always loaded)
> **Updated**: 2026-04-09

---

## Purpose

Orchestrate the implementation cycle. Follow the plan from SCD. Every step has a sub-SOP with detailed procedure.

---

## Steps

### 5. Migration Check → `sops/SCG/migration-check.md`

If any file we touch is `.js`, migrate to `.ts` first. Create interfaces, barrel exports. Check if JS-origin dependencies will cause cascading TS errors — document and skip those.

**Trigger**: When the plan identifies `.js` files to modify.

### 6. Implementation → `sops/SCG/implementation.md`

Code iteration following architecture flow: service → saga → reducer → action-types → selectors → hooks → UI. Consult patterns on-demand. Follow existing patterns in the codebase.

**Trigger**: Every task. This is the core coding phase.

### 7. API Review → `sops/SCG/api-review.md`

When backend delivers APIs: read contracts, test endpoints with curl, verify response shapes match interfaces. Validate error responses. Test with actual QA/DEV credentials.

**Trigger**: When backend is involved (new endpoints, changed contracts).

### 8. Testing → `sops/SCG/testing.md`

Write tests for what we touched. Use AAA pattern. Mock external deps. Ignore JS-origin errors — they require migrating the dependency first. Test hooks with `renderHook`, components with RTL.

**Trigger**: Every task. Untested code doesn't ship.

### 9. Validation → `sops/SCG/validation.md`

Final check: `npm run lint` (0 errors) + `npx tsc --noEmit --project tsconfig.json`. Fix only OUR errors. JS-origin errors are documented and skipped. No console.log, no commented code, no `any` types.

**Trigger**: Every task. Last step before delivery.

---

## Flow

```
SCD complete (plan exists)
       ↓
  5. Migration Check  → JS→TS if needed
       ↓
  6. Implementation   → Follow architecture flow
       ↓
  7. API Review       → Test backend endpoints (if applicable)
       ↓
  8. Testing          → Unit tests for touched code
       ↓
  9. Validation       → lint + tsc (0 errors)
       ↓
  ✅ Ready for SDP (delivery phase)
```

---

## Anti-Patterns

| Anti-Pattern | Correct |
|-------------|---------|
| Skip migration, edit .js file | Migrate to .ts first — don't leave half-migrated code |
| Fix JS-origin TS errors | Document and skip — requires migrating the dependency |
| Call APIs directly from components | Redux dispatch → saga → service |
| Use `any` type | Use `unknown` or proper interface |
| Leave `console.log` | Use `console.info` (allowed) or remove |
| Add ESLint disables without justification | Fix the issue, or document why disable is needed |
| Skip tests for "small" changes | Every touched file gets test coverage |
| Run `npx tsc` without `--project` | Always `npx tsc --noEmit --project tsconfig.json` |

---

## Exit Criteria

- [ ] All `.js` files we touched migrated to `.ts` (with interfaces)
- [ ] Implementation follows architecture flow (service→saga→reducer→UI)
- [ ] API endpoints tested with curl (if backend involved)
- [ ] Unit tests written for touched code
- [ ] `npm run lint` = 0 errors
- [ ] `npx tsc --noEmit --project tsconfig.json` = 0 new errors
- [ ] No `console.log`, no `any`, no commented code

**Only after ALL checkboxes → proceed to SDP**
