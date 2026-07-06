# Execution Discipline

> **Module**: core/workflow
> **Scope**: Direct execution without evasion or over-verification
> **Priority**: HIGH - Overrides default cautious behavior
> **VERSION**: 1.0 | **UPDATED**: 2026-03-05

---

## Problem

When facing large-volume tasks (many lint warnings, mass migrations, bulk refactors, rule enforcement), the agent tends to:

1. **Evade** - Try to disable rules, add exceptions, or skip files instead of fixing them
2. **Over-verify** - Run linters after every 3-5 files when the big picture is already known
3. **Stall** - Propose alternatives, ask unnecessary questions, or over-analyze instead of executing
4. **Partially complete** - Fix 30% and report "done" or suggest "we can do the rest later"
5. **Loop on troubleshooting** - Re-diagnose known issues instead of applying known solutions

---

## Rules

### 1. Execute First, Don't Negotiate

When the user says "fix all X warnings" or "resolve these issues":
- **DO**: Start fixing immediately, file by file, using known patterns
- **DON'T**: Propose disabling rules, adding exceptions, or skipping categories
- **DON'T**: Ask "should I do A or B?" when the answer is clearly "fix them"

### 2. Batch Workflow for High Volume

When there are 10+ issues of the same type:
```
Known pattern + known solution = batch execute
```
- Apply the fix to ALL files, then verify ONCE at the end
- Do NOT run linters between individual files
- Do NOT check intermediate status when the big picture is known
- Do NOT re-count remaining issues mid-batch

### 3. Known Solutions Are Not Negotiations

If a solution is documented (patterns, SOPs, previous fixes):
- Apply it directly. Don't re-analyze, re-propose, or suggest alternatives
- The documentation IS the decision. Execute it.

### 4. Complete the Work

- If asked to fix 100 warnings, fix 100 warnings (or as many as possible in session)
- Don't fix 20 and say "I've made good progress, we can continue later"
- If truly blocked, explain the specific blocker, not a vague "this is complex"

### 5. No Evasion Patterns

These are NOT valid responses to "fix all warnings":
- "We could disable this rule for these files"
- "These warnings are low priority, should we skip them?"
- "Let me check if we really need to fix all of these"
- "This is a large task, let me propose a phased approach"

The ONLY valid exception requests are when:
- A fix would break production functionality
- A fix contradicts another documented rule
- The user explicitly asks for prioritization

---

## Verification Protocol

| Volume | Verification |
|--------|-------------|
| 1-5 files | After each file (standard workflow) |
| 6-20 files | After every 10 files |
| 20+ files | Once at the end of the batch |

---

## Anti-Patterns (NEVER)

| Anti-Pattern | Correct Behavior |
|-------------|-----------------|
| Run `yarn lint` after every file edit | Run once at end of batch |
| Re-count warnings mid-migration | Track progress mentally, verify at end |
| Propose disabling a rule to reduce count | Fix the issues the rule catches |
| Fix 5 files then ask "should I continue?" | Continue until done or blocked |
| Re-read documentation for known patterns | Apply the pattern, move on |
| Over-explain what you're about to do | Just do it |

---

## See Also

- `investigation-first.md` - Research before creating (not before executing known fixes)
- `no-reinventing-wheel.md` - Use existing solutions
- `context-first.md` - Read snapshots for understanding, not for stalling

---

**Version**: 1.0 | **Created**: 2026-03-05
