# SCD Step 4: Implementation Plan

> **Input**: Business context + technical context + code context
> **Output**: `.claude/plans/PLAN-TICKET-ID.md`

---

## Procedure

### 4.1 Create plan file

Write `.claude/plans/PLAN-TICKET-ID.md`:

```markdown
# Plan: TICKET-ID — <Summary>

> **ticket system**: TICKET-ID
> **Parent**: TICKET-IDYYYY (if applicable)
> **Branch**: `feature/TICKET-ID-<brief-description>`
> **Base**: `master`
> **Created**: <date>

---

## Phase 1: SCD — Context (COMPLETE/PENDING)

| Step | Status |
|------|--------|
| Business context | Done/Pending |
| Technical context | Done/Pending |
| Code context | Done/Pending |

## Phase 2: SCG — Implementation (PENDING)

| Step | Action | Status |
|------|--------|--------|
| Migration | <files to migrate JS→TS> | Pending |
| <step> | <what to implement> | Pending |
| <step> | <what to implement> | Pending |
| Tests | <what to test> | Pending |
| Validation | lint + tsc | Pending |

## Phase 3: SDP — Delivery (PENDING)

| Step | Status |
|------|--------|
| Branch + PR | Pending |
| external docs docs | Pending |
| ticket system tracking | Pending |

## Files to Change

| File | Action | Notes |
|------|--------|-------|
| `src/path/file.ts` | MODIFY | <what changes> |
| `src/path/file.js` | MIGRATE + MODIFY | JS→TS first |
| `src/path/new.ts` | CREATE | <why new file> |

## Risks

| Risk | Mitigation |
|------|-----------|
| <risk> | <how to handle> |
```

### 4.2 Identify migration needs

List every `.js` file that needs migration. Each gets:
- `.ts` file (implementation)
- `.interfaces.ts` file (types)
- `index.ts` barrel export

### 4.3 Estimate scope

| Scope | Typical effort |
|-------|---------------|
| 1-3 files, no migration | 2-4h |
| 3-6 files, 1 migration | 4h-1d |
| 6+ files, multiple migrations | 1d-3d |
| New module/domain | 2d-5d |

---

## Rules

- Plan MUST exist before any code is written
- Update plan status as you progress (mark steps COMPLETE)
- If scope changes during implementation, update the plan
- Plan is the developer's contract — they should be able to read it and understand everything
