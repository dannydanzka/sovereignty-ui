# Plan Verification Patterns

> **Priority**: HIGH - Prevent false positives and documentation debt
> **Scope**: ALL projects with `.claude/plans/` directory
> **Purpose**: Ensure plan status reflects actual code state

---

## Core Principle: Trust but Verify

Plans marked as "COMPLETED" may be **false positives**. Status declarations are claims, not facts. Code is the source of truth.

**Code Sovereignty Applied**: Documentation serves code, not the other way around. If documentation says X but code shows Y, code wins.

---

## Verification Protocol

### Before Deleting/Archiving a Plan

```
1. READ plan → Identify claimed deliverables
2. VERIFY each deliverable against code:
   - Files exist? (Glob)
   - Content correct? (Grep/Read)
   - Old files removed? (Glob for deleted paths)
3. DECIDE:
   - All verified → DELETE plan
   - Partial → UPDATE status with specifics
   - Nothing done → KEEP plan, mark as PENDING
```

### Verification Commands

```bash
# Check if file exists
Glob: pattern/to/expected/file.ts

# Check if content matches
Grep: "expected pattern" path/to/file.ts

# Check if old files were removed
Glob: path/to/old/deleted/**/*.ts  # Should return "No files found"
```

---

## Status Definitions

| Status | Meaning | Action |
|--------|---------|--------|
| `COMPLETED` | Claimed done, **unverified** | Verify before trusting |
| `VERIFIED` | Done AND verified against code | Safe to delete |
| `PARTIAL` | Some deliverables done | Update with specifics |
| `PENDING` | Not started | Keep plan |
| `BLOCKED` | Cannot proceed | Document blocker |

---

## Anti-Patterns

### False Positive Sources

| Source | Problem | Prevention |
|--------|---------|------------|
| AI optimism | Marks complete before validation | Human verification required |
| Interrupted sessions | Plan says done, code wasn't committed | Check git status |
| Refactoring | Old paths in plan, new paths in code | Verify actual locations |
| Partial completion | 8/10 items done = "COMPLETED" | Verify ALL items |

### Never Do

- Trust status without verification
- Delete plans based on declaration alone
- Keep completed plans "for reference" (creates debt)
- Mark partial work as complete (false positive)

---

## Cleanup Workflow

```
┌─────────────────────────────────────────────────────────┐
│                  PLAN CLEANUP FLOW                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. List plans     → Glob: .claude/plans/*.md            │
│         │                                                │
│         ▼                                                │
│  2. Read plan      → Identify deliverables               │
│         │                                                │
│         ▼                                                │
│  3. Verify code    → Check each deliverable              │
│         │                                                │
│    ┌────┴────┐                                           │
│    │         │                                           │
│    ▼         ▼                                           │
│  DONE?    PARTIAL?                                       │
│    │         │                                           │
│    ▼         ▼                                           │
│  DELETE   UPDATE status                                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Integration with Code Sovereignty

### Territorial Integrity
Plans live in `.claude/plans/` only. No plan content embedded in code comments.

### Clear Borders
Plan documents WHAT to do. Code shows WHAT was done. No overlap.

### Secure Trade Without Seizures
Plans request work. Code delivers exactly that work. No scope creep.

### Self-Sufficiency
Each plan is self-contained with all context needed for verification.

---

## Examples

### Verifying a Backend Refactor Plan

```markdown
# Plan claims:
- [x] Created companion.entity.ts
- [x] Deleted add-participant use case
- [x] Updated schema with Companion model
```

```bash
# Verification:
Glob: src/**/companion.entity.ts          # Must exist
Glob: src/**/add-participant/**/*.ts      # Must NOT exist
Grep: "model Companion" prisma/schema.prisma  # Must match
```

### Verifying a UI Optimization Plan

```markdown
# Plan claims:
- [x] Reduced AdminForm padding to xs
- [x] Removed FormRow from modals
```

```bash
# Verification:
Grep: "spacing.xs" AdminForm.styled.ts    # Must show xs, not sm
Grep: "FormRow" UserFormModal.tsx         # Must NOT exist
```

---

## Related Documentation

- `.claude/patterns/todo-management-patterns.md` - Task tracking
- `.claude/patterns/snapshot-patterns.md` - Context snapshots
- `.claude/patterns/documentation-refactoring-patterns.md` - Doc maintenance

---

**Version**: 1.0 | **Created**: 2026-01-27 | **Author**: Claude Code
