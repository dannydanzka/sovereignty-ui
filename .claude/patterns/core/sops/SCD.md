# SCD — Sovereign Context Design

> **Phase**: BEFORE code — understand the task fully before writing anything
> **Location**: `rules/sop/SCD.md` (always loaded)
> **Updated**: 2026-04-09

---

## Purpose

Orchestrate the understanding phase. Every task starts here. No code until all 4 steps are done.

---

## Steps

### 1. Business Context → `sops/SCD/business-context.md`

Read task ticket + parent + subtasks. Extract acceptance criteria, business rules, user roles, edge cases. Create `.claude/business/TICKET-ID.md`.

**Trigger**: Every task, no exceptions.

### 2. Technical Context → `sops/SCD/technical-context.md`

Search external docs for existing tech docs, API contracts, release docs. Identify if backend delivers APIs. Save URLs for PR documentation later.

**Trigger**: Every task. A task without external docs context is incomplete.

### 3. Code Context → `sops/SCD/code-context.md`

Investigate codebase: grep existing patterns, similar implementations, files we'll touch. Check if files need JS→TS migration. Identify dependencies.

**Trigger**: Every task. Never code from memory — the codebase may have changed.

### 4. Implementation Plan → `sops/SCD/plan.md`

Create `.claude/plans/PLAN-TICKET-ID.md` with phases, files to change, risks, migration needs, test strategy.

**Trigger**: Every task. The plan is the contract with the developer.

---

## Flow

```
task ticket received
       ↓
  1. Business Context  → .claude/business/TICKET-ID.md
       ↓
  2. Technical Context  → external docs URLs saved, API contracts identified
       ↓
  3. Code Context       → Files to touch identified, migration needs flagged
       ↓
  4. Plan               → .claude/plans/PLAN-TICKET-ID.md
       ↓
  ✅ Ready for SCG (code phase)
```

---

## Anti-Patterns

| Anti-Pattern | Correct |
|-------------|---------|
| Start coding immediately | Complete all 4 SCD steps first |
| Skip ticket system reading, code from memory | Always `ticket_get_issue` — requirements change |
| Skip external docs search | Always search — tech docs and API contracts exist |
| Assume file is TS | Check — may need JS→TS migration |
| Create plan without investigating code | Grep existing patterns first |

---

## Exit Criteria

- [ ] `.claude/business/TICKET-ID.md` exists with scope, stakeholders, acceptance criteria
- [ ] external docs URLs collected (tech docs, API contracts)
- [ ] Files to touch identified (with migration needs flagged)
- [ ] `.claude/plans/PLAN-TICKET-ID.md` exists with phases and risks

**Only after ALL checkboxes → proceed to SCG**
