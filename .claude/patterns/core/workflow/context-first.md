# Context-First Protocol Patterns

> **Version**: 1.0
> **Created**: 2026-01-27
> **Purpose**: Optimize token usage by reading documentation before code exploration
> **Scope**: All projects with context snapshots

---

## Overview

The Context-First Protocol mandates reading context snapshots **before** exploring code. This reduces token usage by ~80% when understanding a domain or feature.

**Anti-pattern**: Exploring code first, then realizing there's documentation
**Pattern**: Read snapshot → understand domain → targeted code exploration only if needed

---

## Protocol Steps

```
┌─────────────────────────────────────────────────────────────┐
│              CONTEXT-FIRST PROTOCOL (MANDATORY)              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. READ snapshot     → .claude/status/{CONTEXT}.md          │
│  2. READ patterns     → .claude/patterns/business/           │
│  3. READ rules        → .claude/rules/                       │
│  4. THEN explore code → Only if snapshot is insufficient     │
│                                                              │
│  Token savings: ~80%                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Snapshot Structure Standard

Every context snapshot MUST contain:

```markdown
# {Context} - Snapshot

> **Date**: YYYY-MM-DD
> **Purpose**: One-line description
> **Status**: Production/Development
> **Coverage**: ~X files, ~X lines

---

## Context Overview
- Business Purpose
- Capabilities (bullet list)
- Architecture pattern

## Data Model
- Entity definitions with TypeScript interfaces
- Relationships

## Use Cases
- Table: Use Case | Purpose
- Business rules

## API Endpoints
- Table: Route | Method | Purpose

## Key Flows
- Step-by-step flows with numbered lists

## UI Components (if applicable)
- Screen/component inventory

## Business Rules
- Domain-specific rules and edge cases

## Related Documentation
- Links to patterns, standards, other snapshots

---
**Snapshot Version**: X.X | **Last Updated**: YYYY-MM-DD
```

---

## Snapshot Organization

### Naming Convention

```
{APP}-{DOMAIN}-CONTEXT-SNAPSHOT.md

Examples:
- ADMIN-ENROLLMENTS-CONTEXT-SNAPSHOT.md
- PUBLIC-MIS-RETOS-CONTEXT-SNAPSHOT.md
- AUTH-CONTEXT-SNAPSHOT.md
```

### Location

```
.claude/
└── status/
    ├── AUTH-CONTEXT-SNAPSHOT.md
    ├── ADMIN-*.md (admin contexts)
    ├── PUBLIC-*.md (public contexts)
    └── USER-CONTEXT-SNAPSHOT.md
```

---

## Path-to-Snapshot Mapping

When working on files in these paths, read the corresponding snapshot FIRST:

| File Path Pattern | Snapshot |
|-------------------|----------|
| `src/apps/admin/*/enrollment/` | `ADMIN-ENROLLMENTS-CONTEXT-SNAPSHOT.md` |
| `src/apps/admin/*/challenge/` | `ADMIN-CHALLENGES-CONTEXT-SNAPSHOT.md` |
| `src/apps/admin/*/evidence/` | `ADMIN-EVIDENCES-CONTEXT-SNAPSHOT.md` |
| `src/apps/admin/*/event/` | `ADMIN-EVENTS-CONTEXT-SNAPSHOT.md` |
| `src/apps/admin/*/kit/` | `ADMIN-KITS-CONTEXT-SNAPSHOT.md` |
| `src/apps/admin/*/user/` | `USER-CONTEXT-SNAPSHOT.md` |
| `src/apps/public/*/challenges/` | `PUBLIC-MIS-RETOS-CONTEXT-SNAPSHOT.md` |
| `src/apps/public/*/enrollment/` | `PUBLIC-ENROLLMENT-CONTEXT-SNAPSHOT.md` |
| `src/apps/public/*/evidence/` | `PUBLIC-EVIDENCES-CONTEXT-SNAPSHOT.md` |
| `src/apps/public/*/events/` | `PUBLIC-EVENTS-CONTEXT-SNAPSHOT.md` |
| `src/app/api/auth/` | `AUTH-CONTEXT-SNAPSHOT.md` |
| `src/libs/*/auth/` | `AUTH-CONTEXT-SNAPSHOT.md` |

---

## Documentation Hierarchy

```
CLAUDE.md (project entry point)
    │
    ├── .claude/rules/_global.md (always loaded)
    │       └── References → patterns, standards, snapshots
    │
    ├── .claude/rules/apps/*.md (conditional by path)
    │       └── admin.md, public.md
    │
    ├── .claude/rules/sop/*.md (standard operating procedures)
    │       └── context-first.md
    │
    ├── .claude/status/*-CONTEXT-SNAPSHOT.md
    │       └── DOMAIN STATE (READ FIRST for context)
    │
    ├── .claude/patterns/business/*.md (local patterns)
    │       └── HOW to implement (project-specific)
    │
    ├── .claude/patterns/*.md (global patterns)
    │       └── HOW to implement (universal)
    │
    └── .claude/patterns/core/*.md (global standards)
            └── WHY we do it (theory)
```

---

## When to Update Snapshots

**MUST update** when:
- Adding new use case
- Adding/modifying API endpoint
- Changing entity structure
- Changing business rules
- Fixing bugs that reveal undocumented behavior

**Update command**: After modifying a context, update its snapshot before ending the session.

---

## Implementation Guide

### For New Projects

1. Create `.claude/status/` directory
2. Create snapshots for each bounded context
3. Create `.claude/rules/sop/context-first.md` referencing this pattern
4. Add reference to project CLAUDE.md

### For Existing Projects

1. Audit existing contexts
2. Create missing snapshots
3. Ensure snapshots follow standard structure
4. Add SOP reference to `_global.md`

---

## Anti-Patterns

| ❌ DON'T | ✅ DO |
|----------|-------|
| Explore code first | Read snapshot first |
| Skip snapshot "to save time" | Snapshots save ~80% tokens |
| Leave snapshots outdated | Update after every context change |
| Create duplicate docs in code | Reference snapshot, don't duplicate |
| Ask "where is X?" | Check snapshot's file paths |

---

## Related Documentation

**Standards**:
- `.claude/patterns/core/DOCUMENTATION-STANDARDS.md` - Documentation principles

**Framework**:
- `.claude/patterns/frontend/framework/DOCUMENTATION-SYSTEM.md` - Three-layer system

**Other Patterns**:
- `.claude/patterns/component-structure.md` - Component file organization
- `.claude/patterns/use-case-patterns.md` - Use case patterns

---

**Pattern Version**: 1.0 | **Last Updated**: 2026-01-27
