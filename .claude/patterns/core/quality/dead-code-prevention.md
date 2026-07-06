# Dead Code Prevention

> **Layer**: Quality (Core - Cross-disciplinary)
> **Purpose**: Prevent and eliminate unused code
> **Enforcement**: AI investigation + manual review
> **Version**: 1.0.0

---

## Overview

Dead code is code that exists in the codebase but is never executed or used. It increases cognitive load, maintenance burden, and can hide bugs. Unlike other quality issues, dead code cannot be fully detected by linters or compilers.

**Types of Dead Code**:
1. **Unused files** - Entire files never imported
2. **Unused exports** - Functions/types exported but never imported
3. **Empty directories** - Folders with no content
4. **Orphaned modules** - Planned but never integrated code
5. **Legacy code** - Old implementations not cleaned up after refactoring

---

## Why Linters Can't Fully Detect Dead Code

| Tool | Detection Capability | Limitation |
|------|---------------------|------------|
| **ESLint** | Unused variables, imports within file | Cannot detect cross-file usage |
| **TypeScript** | Unused locals with `noUnusedLocals` | Cannot detect exported but unused |
| **Tree-shaking** | Removes at build time | Only works for imports, not files |
| **IDE** | "Find usages" on demand | Manual, not automated |

**Result**: Dead code detection requires **AI investigation** combined with **search tools**.

---

## Detection Protocol

### 1. Identify Candidates

Search for patterns that commonly indicate dead code:

```bash
# Empty directories
find src -type d -empty

# Files with no imports (potential dead files)
# Search for a specific export and verify it's imported somewhere

# Barrel exports that export nothing meaningful
# Check index.ts files for empty exports
```

### 2. Verify with Search

For each candidate, search for usage:

```typescript
// Pattern: Search for imports of the module
Grep: "from.*module-name"
Grep: "import.*ModuleName"

// If 0 results outside its own file/folder → DEAD CODE
```

### 3. Confirm Context

Before deleting, check:
- Is it referenced in tests only? → May be test utility
- Is it in a "planned" or "wip" folder? → May be intentional
- Does it have TODO comments about future use? → Evaluate if still relevant
- Was it recently added? → May be incomplete feature

---

## Common Dead Code Patterns

### Pattern 1: Empty Barrel Exports

```typescript
// src/libs/domain/types/admin/index.ts
/**
 * Admin Domain Types
 */
// DEAD: No exports, folder should be deleted
```

**Detection**: Read index.ts files, check if they export anything
**Action**: Delete empty folders

### Pattern 2: Unused Services/Helpers

```typescript
// src/services/cleanup/cleanup.service.ts
export const cleanupFiles = async () => { ... };

// DEAD: Exported but never imported anywhere
```

**Detection**: Grep for function name, check if only found in definition
**Action**: Delete file and update barrel export

### Pattern 3: Orphaned Feature Code

```typescript
// src/features/analytics/
// Planned but never integrated feature
// No imports from main app
```

**Detection**: Search for imports from the feature folder
**Action**: Delete entire feature folder if unused

### Pattern 4: Legacy After Refactoring

```typescript
// Old: src/components/OldButton/
// New: src/components/Button/ (refactored)
// OldButton still exists but not imported
```

**Detection**: After refactoring, search for old component imports
**Action**: Delete old implementation

### Pattern 5: Empty Asset Folders

```
src/assets/
├── images/
│   └── events/     # EMPTY - planned but never used
└── icons/
    └── legacy/     # EMPTY - cleaned up but folder remains
```

**Detection**: `find src -type d -empty`
**Action**: Delete empty folders

---

## Prevention Rules

### DO

1. **Delete immediately after refactoring** - Don't leave old code "just in case"
2. **Check imports before creating** - Verify the export will be used
3. **Clean up during PR review** - Reviewer should check for orphaned code
4. **Run periodic audits** - Schedule dead code hunts monthly
5. **Document planned features** - Use `.claude/plans/` not code files

### DON'T

1. **Keep code "for reference"** - Use git history instead
2. **Create "placeholder" files** - Create when actually needed
3. **Export without importing** - Export only what's used
4. **Create utilities speculatively** - YAGNI (You Ain't Gonna Need It)
5. **Leave empty directories** - Delete or populate

---

## Audit Checklist

Run this audit periodically (monthly or after major refactors):

```markdown
## Dead Code Audit - [DATE]

### 1. Empty Directories
- [ ] Run: find src -type d -empty
- [ ] Delete all empty folders

### 2. Unused Exports (sample check)
- [ ] Pick 5 random exports from libs/
- [ ] Verify each is imported somewhere
- [ ] Delete unused

### 3. Legacy Code
- [ ] Check for TODO comments mentioning "remove", "delete", "legacy"
- [ ] Evaluate and clean up

### 4. Test-Only Utilities
- [ ] Check testing/ folders for unused mocks
- [ ] Clean up unused test helpers

### 5. Planned Features
- [ ] Review .claude/plans/ for abandoned plans
- [ ] Delete associated code if plan is cancelled
```

---

## Integration with AI Workflow

### When to Investigate

1. **After refactoring** - Always search for orphaned code
2. **Before adding new code** - Check if similar exists
3. **When reviewing barrel exports** - Verify all exports are used
4. **When files seem unfamiliar** - May be unused

### Investigation Commands

```typescript
// Check if export is used
Grep: "exportName" (exclude definition file)

// Check if folder is used
Grep: "from.*folder-name"

// Check for empty folders
Bash: find src -type d -empty

// Check barrel export contents
Read: path/to/index.ts
```

### Decision Tree

```
Found potential dead code?
├── Is it imported anywhere?
│   ├── Yes → Not dead, keep it
│   └── No → Continue checking
├── Is it in tests only?
│   ├── Yes → Test utility, evaluate if tests still run
│   └── No → Continue checking
├── Has TODO about future use?
│   ├── Yes → Evaluate: still planned? Keep or delete
│   └── No → Likely dead
├── Recently added (< 1 week)?
│   ├── Yes → May be incomplete feature, ask user
│   └── No → Likely dead
└── Confirm dead → DELETE
```

---

## Related Documentation

- `.claude/patterns/core/workflow/no-reinventing-wheel.md` - Check existing before creating
- `.claude/patterns/core/quality/code-size-limits.md` - Keep files small
- `.claude/patterns/core/quality/anti-patterns.md` - Common mistakes

---

**Pattern Version**: 1.0.0 | **Created**: 2026-02-12
