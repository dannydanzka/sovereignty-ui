# Workflow Patterns

> **Module**: core/workflow
> **Scope**: Developer work flows

---

## Patterns

| Pattern | Purpose | When |
|---------|---------|------|
| `investigation-first.md` | Investigate before creating | Before any implementation |
| `context-first.md` | Read snapshots before code | Entering a context |
| `plan-verification.md` | Verify plans against code | Before removing plans |
| `todo-management.md` | Effective TODO management | Leaving pending work |
| `no-reinventing-wheel.md` | Search existing first | Before creating components |
| `code-elevation.md` | Elevate local code to global | Detecting reusable code |
| `execution-discipline.md` | Execute without evasion or over-verification | High-volume tasks (lint, refactors, migrations) |
| `context-budget.md` | Manage auto-loaded context in `rules/` | Adding/auditing files in `.claude/rules/` |
| `workspace-organization.md` | Recommended local project structure | Setting up new workspaces |
| `refactor-cost-benefit.md` | 4-tier refactor framework with time budget + ROI | Before deciding refactor depth during feature delivery |
| `search-before-creating.md` | Grep/Glob the codebase before writing any new file | Before creating ANY new file, component, hook, or util |

---

## TL;DR

```
1. Investigation First     -> Does it exist? Is there a pattern?
2. Context First           -> Read snapshot before code
3. Plan Verification       -> Verify before removing
4. No Reinventing          -> Grep/Glob before creating
5. Execution Discipline    -> Execute directly, no evasion or over-verification
6. Context Budget          -> rules/ lightweight, docs/ on-demand, patterns/ synced
```

---

## Recommended Flow

```
+---------------------------------------------------+
| 1. INVESTIGATION FIRST                            |
|    +-- Does a similar component exist?            |
|    +-- Is there a documented pattern?             |
+---------------------------------------------------+
| 2. CONTEXT FIRST                                  |
|    +-- Read context snapshot                      |
|    +-- Only explore code if necessary             |
+---------------------------------------------------+
| 3. IMPLEMENT                                      |
|    +-- Follow existing pattern                    |
|    +-- Use existing components                    |
+---------------------------------------------------+
| 4. ELEVATE (if applicable)                        |
|    +-- Is this code useful for other projects?    |
|    +-- Move to core/ or frontend/                 |
+---------------------------------------------------+
```

---

## When to Consult

- Starting new task -> `investigation-first.md`
- Entering unknown context -> `context-first.md`
- Cleaning up plans -> `plan-verification.md`
- Creating component -> `no-reinventing-wheel.md`
- Code useful to others -> `code-elevation.md`

---

**Total**: 11 patterns | **Updated**: 2026-04-19
