# Documentation Standards

> **Module**: core/documentation
> **Scope**: All disciplines

---

## TL;DR

| Type | Purpose | Location |
|------|---------|----------|
| **Docstrings/Comments** | Self-documenting code | In the code |
| **README** | Quick onboarding | Project root |
| **API Docs** | Interface contracts | `/docs` or generated |
| **Architecture** | Decisions and structure | `.claude/` or `/docs` |
| **Confluence** | External wiki standards | Confluence (audience-specific) |
| **Knowledge Architecture** | Two sources of truth: soverum (business) + soberania (technical) | `knowledge-architecture.md` |

---

## Principles

### 1. Living Documentation

> **"Documentation that isn't updated is dead documentation."**

Documentation must:
- Be close to the code it documents
- Update when the code changes
- Be verifiable (scripts, tests)

### 2. Precision over Volume

> **"Less is more. Every documented line must deliver value."**

- DO NOT document the obvious
- DO document the "why"
- DO document non-evident decisions

### 3. Clear Audience

| Audience | Content |
|----------|---------|
| **New developers** | README, architecture |
| **Team developers** | API docs, patterns |
| **Future maintainers** | Decisions, trade-offs |
| **AI/Claude** | CLAUDE.md, snapshots |

---

## README Structure

```markdown
# Project Name

> One-line description

## Quick Start
[Minimum commands to run]

## Tech Stack
[Main technologies]

## Project Structure
[Key folder structure]

## Development
[How to develop]

## Testing
[How to test]

## Deployment
[How to deploy]
```

---

## AI Documentation

### CLAUDE.md

Context file for Claude Code in each project:

```markdown
# CLAUDE.md

## Project Context
[What the project is]

## Architecture
[Architectural decisions]

## Key Patterns
[Patterns to follow]

## Critical Policies
[Non-negotiable rules]

## Quick Reference
[Commands, paths, etc.]
```

### Context Snapshots

For complex domains, create snapshots in `.claude/status/`:

```markdown
# CONTEXT-SNAPSHOT.md

## Overview
[What this context covers]

## Data Model
[Entities and relationships]

## Use Cases
[Available use cases]

## API Endpoints
[Related endpoints]
```

---

## Code Comments

### When to Comment

| DO comment | DO NOT comment |
|------------|---------------|
| Why a decision was made | What the code does (obvious) |
| Workarounds and their reasons | Self-explanatory code |
| TODOs with context | "Increments counter" |
| Complex algorithms | Simple getters/setters |

### TODO Format

```typescript
// TODO: [TICKET-123] Migrate to new API when available
// Currently using v1 for compatibility with service X

// TODO: MIGRATE TO PRISMA - Replace mock with real query
// Migration path: prisma.user.findUnique({ where: { id } })
```

---

## Documentation Versioning

For important technical documentation:

```markdown
---
**Version**: 1.2 | **Updated**: 2026-02-06
```

---

## Pattern Optimization (Token Economy)

> **"Contextual precision, not information hoarding."**
> **"These files are for Claude, not for humans."**

### Philosophy

Patterns are documentation **for AI**. Claude needs to understand context quickly, not read prose. Every line must deliver value for generating correct code.

### Compression Rules

| Prefer | Over |
|--------|------|
| **Code** | Descriptions |
| **Tables** | Paragraphs |
| **Lists** | Prose |
| **References** | Duplication |
| **TL;DR first** | Intros |

### Pattern Structure

```markdown
# Pattern Name

> **Module**: location
> **ESLint**: rule-name (if applicable)

---

## TL;DR

**DO**:
- Rule 1
- Rule 2

**DON'T**:
- Anti-pattern 1
- Anti-pattern 2

---

## Quick Reference Table

| Concept | Value |
|---------|-------|
| ... | ... |

---

## Code Example (Primary Documentation)

\```typescript
// Real, production-ready code
// This IS the documentation
\```

---

## Related

- `path/to/related.md` - Description
```

### Document Types (v4.1)

| Type | Purpose | Location | Lines |
|------|---------|----------|-------|
| **SOP** | Procedures (step-by-step) | `.claude/rules/sop/` | 100-200 |
| **Pattern** | HOW + code examples | `.claude/patterns/` | 150-450 |
| **Rules** | WHEN to apply (routing) | `.claude/rules/` | 50-150 |
| **Plan** | Action items (temporary) | `.claude/plans/` | 200-300 |
| **Snapshot** | Context state (domain) | `.claude/status/` | 200-400 |
| **Documentation** | Global standards | `sovereignty/` | 150-300 |
| **Sovereignty Version** | Framework sync tracking (auto) | `.claude/.sovereignty-version` | Auto-generated |
| **Platform Status** | Project-specific state | `docs/business/PLATFORM-STATUS.md` | 200-400 |

> **Note**: "Standard" type was consolidated into "Pattern" (v4.0).
> Patterns now contain both HOW (examples) and WHY (rules).
> **Note**: `GLOBAL-ALIGNMENT.md` was replaced in v4.0 by `sync-sovereignty.sh` + `.sovereignty-version` (automated).

### Sovereignty Version vs Platform Status

| | **`.sovereignty-version`** | **PLATFORM-STATUS.md** |
|---|---|---|
| **Scope** | Agnostic / automated | Project-specific |
| **Generated by** | `sync-sovereignty.sh` (automatic) | Developer (manual) |
| **Contains** | Commit hash, sync date, discipline, layers | Architecture, metrics, modules, features, schema, deployment |
| **Changes when** | `sync-sovereignty.sh` runs | Code changes (new features, screens, endpoints, models) |
| **Location** | `.claude/.sovereignty-version` | `docs/business/PLATFORM-STATUS.md` |

### What to KEEP

- DO/DON'T rules (critical for correct code)
- File structure (where to put things)
- Code examples (primary documentation)
- Validation commands (how to verify)
- Business rules (domain-specific logic)

### What to ELIMINATE

- Verbose intros ("This document describes...")
- History/changelogs (keep only version number)
- Redundant examples (1 good > 5 similar)
- Explanations code already shows
- Sections duplicated in other patterns
- Prose that could be a table

### Anti-Pattern: Reduction for Reduction

**WRONG**: Reduce lines by removing content
**RIGHT**: Same information, better compression

```markdown
# WRONG (verbose)
The user must be authenticated before they can access this endpoint.
Authentication is performed using JWT tokens stored in HTTP-only cookies.
The middleware validates the token and extracts the user information.

# RIGHT (compressed)
**Auth**: JWT in HTTP-only cookie -> middleware validates -> user extracted
```

---

## Additional Patterns

| Pattern | Purpose | When |
|---------|---------|------|
| `confluence.md` | Confluence wiki documentation standards | Writing external technical docs for specific audiences |

---

## Related

- `core/git/` — Commit conventions
- `core/code-review/` — Documentation review
- `doctrine/governance-cycle.md` — Documentation as governance asset

---

**Module**: core/documentation | **Scope**: All disciplines | **Updated**: 2026-03-23
