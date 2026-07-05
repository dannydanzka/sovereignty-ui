# TypeScript Error Suppression Pattern

> **Context**: Projects with gradual TypeScript migration (JS components with auto-generated .d.ts)
> **Updated**: 2026-03-23

---

## Quick Reference

```typescript
// NEVER - Indiscriminate usage
// @ts-expect-error
<Component prop={value} />

// ALWAYS - After analysis, with justification
/* Analysis: Component is JS with incorrect .d.ts (borderWidth marked required but optional)
 * Root cause: Auto-generated types from PropTypes
 * Resolution: Migrate Component to TS (estimated 2-4 hours)
 * Decision: Out of scope for current feature
 */
// @ts-expect-error - Component.d.ts incorrectly marks borderWidth as required
<Component prop={value} />
```

**CRITICAL PLACEMENT RULE:** Comment MUST be on the line IMMEDIATELY BEFORE the error occurs:

```typescript
// CORRECT - Before the error line
return yield call(
  // @ts-expect-error - Comment before call() where error occurs
  serviceAPI.method,
  args
);

// WRONG - Before wrapper code (causes "Unused '@ts-expect-error' directive")
// @ts-expect-error
return yield call(serviceAPI.method, args);

// CORRECT - Before problematic prop
<Component
  // @ts-expect-error - Comment before prop with error
  invalidProp={value}
/>

// WRONG - Before component
// @ts-expect-error
<Component invalidProp={value} />
```

**Rule:** Check TS error line number -> put comment on the line before that number.

---

## Critical Rule

**`@ts-expect-error` is NOT a quick fix - it's a DOCUMENTED DECISION after deep analysis**

Required before using:
1. Understand WHY the error exists
2. Evaluate root cause resolution time/scope
3. Document analysis and decision

---

## Decision Flow

```
TS Error appears
     |
     v
Is the error from a JS-origin module? (.js file, auto-generated .d.ts)
     |
    YES -> Is fixing the root cause in scope for this ticket?
     |         |
     |        YES -> Fix the root cause (migrate to TS)
     |         |
     |        NO -> Use @ts-expect-error with FULL documentation
     |
    NO -> Is this a real type error in TS-origin code?
     |
    YES -> FIX IT. No suppression allowed for TS-origin errors.
```

---

## Allowed Scenarios

### 1. JS Component with incorrect auto-generated types

```typescript
// Component.js uses PropTypes where borderWidth has defaultProps
// Auto-generated .d.ts marks it as required
// Root cause: PropTypes -> .d.ts translation limitation
// Resolution: Migrate Component to TypeScript
// @ts-expect-error - borderWidth has defaultProps, .d.ts marks as required
<Component title="Hello" />
```

### 2. Redux store typed as generic object

```typescript
// Store is typed as {} because root state typing is incomplete
// Root cause: Gradual migration - not all reducers have TS types yet
// Resolution: Complete RootState type definition (multi-sprint effort)
// @ts-expect-error - state.feature exists but RootState incomplete
const data = useSelector((state) => state.feature.items);
```

### 3. Third-party library with incomplete types

```typescript
// Library v3.x types don't include new v4 API
// Root cause: @types/library not updated for v4
// Resolution: Wait for @types update or contribute
// @ts-expect-error - newMethod exists in v4 but types are v3
library.newMethod(config);
```

---

## NEVER Allowed

| Scenario | Why | What to do instead |
|---|---|---|
| Type mismatch between two `.ts` files | Real bug | Fix the types |
| Implicit `any` on parameters you wrote | Lazy typing | Add explicit types |
| Interface field mismatch you can fix | Real type error | Update the interface |
| "It works at runtime" | Types exist for a reason | Fix the types to match runtime behavior |
| Suppressing to pass CI faster | Technical debt acceleration | Fix or escalate |

---

## Documentation Template

When `@ts-expect-error` is justified, use this structure:

```typescript
/* Analysis: [What the error is and why it appears]
 * Root cause: [The actual underlying issue]
 * Resolution: [What would fix this properly]
 * Estimated effort: [How long the proper fix would take]
 * Decision: [Why we're suppressing instead of fixing]
 */
// @ts-expect-error - [One-line summary for quick scanning]
```

For simple, well-understood cases (same pattern repeated across files):

```typescript
// @ts-expect-error - JS-origin component, .d.ts marks optional prop as required
```

---

## Tracking Suppressions

Periodically audit suppressions:

```bash
# Count all suppressions in the project
grep -r "@ts-expect-error" src/ --include="*.ts" --include="*.tsx" | wc -l

# List unique reasons
grep -r "@ts-expect-error" src/ --include="*.ts" --include="*.tsx" -h | sort -u
```

When the root cause is fixed (e.g., a JS component is migrated to TS), the `@ts-expect-error` directive will produce an "Unused directive" error — TypeScript itself tells you to remove it.

---

## See Also

- `core/quality/type-safety.md` — Type safety principles
- `core/quality/error-handling.md` — Error handling patterns
- `methodology/development/scg.md` — Error Triage section for when to fix vs skip

---

**Status**: v2.0 — Agnosticized from enterprise version. Removed project-specific ticket references. Preserved decision flow, documentation template, and tracking methodology.
