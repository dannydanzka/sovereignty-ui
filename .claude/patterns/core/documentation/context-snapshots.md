# Context Snapshots — Documentation Pattern

> **Module**: core/documentation
> **PURPOSE**: Document context state WITHOUT code (understanding, not copying)
> **WHEN**: After completing major context implementation (User CRUD, Event Flow, etc.)
> **COST**: Reading snapshot (5 min) < Reading all code files (30+ min)
> **Updated**: 2026-04-22 (relocated from `frontend/testing/snapshots.md` — this is doc-snapshots, NOT jest snapshots)

---

## What is a Context Snapshot?

**Definition**: Documentation that captures the STATE and FLOW of a complete context without full code implementations.

**NOT a code repository** — it's a MAP to understand:
- What exists in this context
- How files relate to each other
- What patterns are applied
- Current state (working features, pending migrations, etc.)

**Goal**: Answer "What's in User context?" in 5 minutes without reading 2,252 lines of code.

> **Naming clarification**: This pattern is NOT about Jest/Vitest `toMatchSnapshot()` testing. For that, see `frontend/testing/runners/snapshot-testing.md`.

---

## When to Create Snapshots

**Create snapshot when**:
- ✅ Complete CRUD flow implemented (User, Event, Challenge, etc.)
- ✅ All layers working (API → Use Case → Repository → UI)
- ✅ Multiple files (>5) in same business context
- ✅ Need future reference for similar contexts

**DON'T create snapshot for**:
- ❌ Single feature (use pattern instead)
- ❌ In-progress work (wait until complete)
- ❌ Simple utilities (not a context)

---

## Snapshot Structure (Template)

```markdown
# {Context} Context — Snapshot

> **Date**: YYYY-MM-DD
> **Purpose**: One-line description
> **Status**: Production | Development
> **Coverage**: ~X files, ~X lines

---

## Context Overview
- Business purpose (1-2 sentences)
- Capabilities (bullet list)
- Architecture pattern

## Data Model
- Entity interfaces (TypeScript, ~20 lines max)
- Key relationships

## Use Cases
| Use Case | Purpose |
|----------|---------|
| `executeXxx` | Description |

**Business Rules**: (bullet list)

## API Endpoints
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/...` | GET | Description |

## Key Files Inventory
(See detailed section below)

## Key Flows
1. Step-by-step numbered list
2. With decision points
3. And outcomes

## Business Rules
- Domain-specific rules
- Edge cases documented

## Related Documentation
- Links to patterns, standards, other snapshots

## Changelog
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | YYYY-MM-DD | Initial snapshot |

---
**Snapshot Version**: X.X | **Last Updated**: YYYY-MM-DD
```

---

## Key Files Inventory Format (CRITICAL)

This section helps decide **whether to read a file** without reading it.

### Format per File

```markdown
### {Layer}: {File Purpose}
**Path**: `src/path/to/file.ts`
**Lines**: ~XXX | **Read Priority**: High/Medium/Low

**Contains**:
- Function/component 1: What it does
- Function/component 2: What it does
- Types: List of exported types

**Read this file when**:
- You need to understand X
- You need to modify Y

**Skip this file when**:
- You only need to know Z (see other file instead)
```

### Example — Good File Inventory

```markdown
### Use Case: executeCreateEnrollment
**Path**: `src/apps/public/domain/use-cases/enrollment-management/create-enrollment/create-enrollment.use-case.ts`
**Lines**: ~145 | **Read Priority**: High

**Contains**:
- `executeCreateEnrollment`: Main use case function
- Input validation with `createValidator`
- Enrollment entity creation
- Stripe session creation call

**Read this file when**:
- Adding new enrollment field
- Changing enrollment validation
- Understanding Stripe integration point

**Skip this file when**:
- Only need endpoint info (see API route)
- Only need entity structure (see Data Model section above)
```

---

## What to Include vs Exclude

### ✅ INCLUDE (Useful Without Context)

| Section | Why Useful |
|---------|------------|
| **Entity interfaces** | Know data shape without reading code |
| **Use Cases table** | Know what operations exist |
| **API Endpoints table** | Know available routes |
| **File paths with purpose** | Know where to look |
| **Business rules** | Know constraints without reading code |
| **Flow diagrams** | Understand sequence without code |
| **Read this when / Skip when** | Decision guide for files |

### ❌ EXCLUDE (Noise Without Context)

| What | Why Exclude |
|------|-------------|
| **Full code implementations** | That's what source files are for |
| **Line-by-line explanations** | Too verbose, becomes stale |
| **Internal variable names** | Implementation detail |
| **Import statements** | Can see in file |
| **Test file contents** | Tests are self-documenting |
| **Styling details** | Not business logic |

---

## File Read Priority Guide

| Priority | When to Read | Example |
|----------|--------------|---------|
| **High** | Core business logic, entry points | Use Cases, API Routes |
| **Medium** | Supporting infrastructure | Repositories, Services |
| **Low** | Presentation, utilities | Styled components, helpers |

### Decision Tree

```
Need to understand the FLOW?
  → Read: Use Case (High priority)

Need to understand the DATA?
  → Read: Entity interfaces in snapshot (no file read needed)
  → If more detail: Repository (Medium priority)

Need to understand the API?
  → Read: API Endpoints table in snapshot (no file read needed)
  → If more detail: API Route file (High priority)

Need to understand the UI?
  → Read: Component file (Low priority)
  → Usually not needed for backend work
```

---

## Changelog Section (MANDATORY)

Every snapshot MUST have a changelog at the bottom:

```markdown
## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2026-01-27 | Major: companionEnrollments replaces participants |
| 1.2 | 2026-01-20 | Added: kit delivery notifications |
| 1.1 | 2026-01-15 | Fixed: Missing API endpoint documentation |
| 1.0 | 2025-12-24 | Initial snapshot |
```

### Version Bumping Rules

| Change Type | Version Bump | Examples |
|-------------|--------------|----------|
| **Major** (X.0) | Entity restructure, breaking changes | participants → companionEnrollments |
| **Minor** (x.X) | New use case, endpoint, field | Added deactivateCompanions |
| **Patch** (x.x.X) | Typo fixes, clarifications | Fixed endpoint path typo |

---

## Anti-Patterns

### ❌ BAD: Code Dump
```markdown
### Repository
\`\`\`typescript
// 200 lines of code
export const enrollmentRepository = {
  create: async (data) => {
    // full implementation...
  },
};
\`\`\`
```
**Why bad**: Defeats purpose of snapshot.

### ✅ GOOD: Inventory with Decision Guide
```markdown
### Repository: enrollmentRepository
**Path**: `src/libs/.../enrollment.repository.ts`
**Lines**: ~280 | **Read Priority**: Medium

**Contains**:
- `create`, `findById`, `findByUserId`, `findByUserIdWithEvents`, `update`
- Prisma ↔ Entity transformers

**Read when**: Adding query methods, changing DB interaction
**Skip when**: Only calling existing methods
```

### ❌ BAD: No Changelog
Snapshot without version history — impossible to know if it's current.

### ✅ GOOD: Maintained Changelog
Version history showing when each major change was documented.

---

## Snapshot Maintenance Protocol

### When to Update

| Trigger | Required Update |
|---------|-----------------|
| New use case added | Add to Use Cases table + changelog |
| API endpoint changed | Update API Endpoints table + changelog |
| Entity field added/removed | Update Data Model + changelog |
| Business rule changed | Update Business Rules + changelog |
| File moved/renamed | Update File Inventory paths |
| Major refactor | Major version bump + full review |

### Update Checklist

- [ ] Update relevant section
- [ ] Add changelog entry
- [ ] Bump version appropriately
- [ ] Update "Last Updated" date
- [ ] Update index.md if new snapshot

---

## Validation Criteria

**Good snapshot checklist**:
- [ ] Header with metadata (date, purpose, status, coverage)
- [ ] Data Model with entity interfaces (~20 lines max)
- [ ] Use Cases table
- [ ] API Endpoints table
- [ ] Key Files Inventory with "Read when / Skip when"
- [ ] Business Rules section
- [ ] Changelog section
- [ ] Total lines: 150-400 (NOT 2,000+)
- [ ] NO code blocks >15 lines

**Reading test**:
- Can I understand the context in 5 minutes? ✅
- Do I know which files to read for my task? ✅
- Do I need to read code files just to understand? ❌

---

## Location & Naming

**Location**: `.claude/status/`

**Naming**: `{APP}-{DOMAIN}-CONTEXT-SNAPSHOT.md`
- `AUTH-CONTEXT-SNAPSHOT.md`
- `ADMIN-ENROLLMENTS-CONTEXT-SNAPSHOT.md`
- `PUBLIC-MIS-RETOS-CONTEXT-SNAPSHOT.md`

**Index**: `.claude/status/index.md` (inventory of all snapshots)

---

## Related Documentation

- `core/documentation/index.md` — documentation patterns index
- `frontend/testing/runners/snapshot-testing.md` — Jest/Vitest snapshot testing (NOT this pattern)
- Project-specific: `.claude/patterns/context-first-patterns.md` — when/how to use snapshots
