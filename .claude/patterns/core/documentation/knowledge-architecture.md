# Knowledge Architecture — SOP

> **Module**: core/documentation
> **Scope**: All projects
> **Created**: 2026-05-03
> **Derived from**: DearAdry + FollowMe migrations (May 2026)

---

## TL;DR

| Question | Source |
|----------|--------|
| How does this business work? (WHAT/WHY) | `soverum/products/{name}/domain/` |
| How do I implement this technically? (HOW — agnostic) | `soberania-del-codigo/` |
| How do I implement this in THIS project? (HOW — project-specific) | `project/.claude/patterns/business/` |
| What exists today in this module? (inventory) | `project/.claude/status/` |

**The rule**: No document repeats what another already says. If two documents cover the same thing, one is in the wrong place.

---

## The Two Sources of Truth

```
soberania-del-codigo/          ← Technical knowledge (agnostic, reusable)
  frontend/auth/session.md       JWT session patterns
  frontend/infrastructure/       Stripe, Prisma, repositories
  core/sops/                     Deployment, git, workflows
  ...

soverum/products/{name}/       ← Business knowledge (per product/client)
  domain/index.md                Reading guide
  domain/core-model.md           Entity hierarchy, lifecycle, key rules
  domain/admin-rules.md          RBAC, restrictions, Spanish errors
  domain/{context}.md            Additional domain files as needed
```

Every other repository (project `.claude/` folders, Confluence, etc.) **references** these two sources. It never duplicates them.

---

## Artifact Taxonomy

| Artifact | Lives in | Lifespan | Update when |
|----------|----------|----------|-------------|
| **Agnostic technical pattern** | `soberania-del-codigo/` | Permanent | The convention changes |
| **Technical SOP** | `soberania-del-codigo/core/sops/` | Permanent | The process changes |
| **Domain pattern** | `soverum/products/{name}/domain/` | Permanent | A business rule changes |
| **Project code pattern** | `project/.claude/patterns/business/` | Permanent | The code implementation changes |
| **Status snapshot** | `project/.claude/status/` | Semi-permanent | New use case, endpoint, or entity field |
| **Plan** | `project/.claude/plans/` | Temporary | Discard after merge |

---

## Domain Files (soverum)

### Purpose

Answer "how does this business work?" — not "how is this implemented in code?"

Business rules that belong here:
- Entity hierarchy and relationships
- Lifecycle state machines (DRAFT → ACTIVE → CLOSED)
- Role hierarchy and authorization matrix
- Validation rules and invariants
- Subscription or pricing tiers
- Critical constraints (e.g., "always include organizerId")

**Invariant rule**: If code conflicts with a domain file → code is wrong.

### Standard Structure per Product

```
soverum/products/{name}/domain/
├── index.md          # Reading guide: which file answers which question
├── core-model.md     # Entity hierarchy, lifecycle, key business rules
└── {context}.md      # Additional domain files (admin-rules, payments, etc.)
```

### What does NOT belong in domain files

- Code examples or TypeScript snippets
- API routes or endpoints
- Redux state or component names
- Framework-specific details
- Implementation how-tos

### index.md Template

```markdown
# {Product} — Domain Index

> **Created**: YYYY-MM-DD
> **Rule**: These files are invariants. If code conflicts → code is wrong.

## When to read each file

| Question | File |
|----------|------|
| What are the entities? Lifecycle? Main rules? | `core-model.md` |
| ... | `{file}.md` |

## Top invariants (override everything else)

1. ...
2. ...
```

---

## Status Snapshots (project .claude/status/)

### Purpose

Answer "what technically exists in this module today?" — pure inventory, no prose.

### Reduced Format (target ~50 lines per file)

```markdown
# {Module} — Snapshot

> **Created**: YYYY-MM-DD | **Last verified**: YYYY-MM-DD
> **Domain rules**: soverum/products/{name}/domain/{file}.md

## Entity (compact TypeScript)

\`\`\`typescript
interface {Entity} {
  id: string; field1: type; field2: type;  // one line per logical group
}
\`\`\`

## Use Cases (N)

| Use Case | Tests |
|----------|-------|
| `executeDoSomething` | ✅ |

## API Endpoints (N)

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/...` | Description |

One critical note if not obvious from domain files.
```

### What does NOT belong in snapshots

- Business rule explanations (→ domain files in soverum)
- Flow diagrams or ascii art sequences (→ domain files)
- Pattern references or "See also" sections (→ CLAUDE.md Quick Reference)
- Redux state details (→ code patterns)
- File counts and line counts (→ irrelevant, changes too often)

### Directory Structure

Organize by context area to enable fast lookup:

```
.claude/status/
├── index.md            # Module table with use case counts
├── admin/              # Platform admin modules
├── tenant-admin/       # Tenant-level admin (multi-tenant projects)
├── public/             # Public-facing modules
└── auth/               # Authentication
```

### Update Trigger

| Change | Update snapshot? |
|--------|-----------------|
| New use case | ✅ |
| New API endpoint | ✅ |
| Entity field added/removed | ✅ |
| Business rule changed | ❌ Update soverum domain instead |
| Internal refactor (no API change) | ❌ |

---

## Project CLAUDE.md

Every project CLAUDE.md must include a `KNOWLEDGE SOURCES` section near the top:

```markdown
## KNOWLEDGE SOURCES — Two Sources of Truth

| What you need | Where to look |
|---------------|---------------|
| **Business domain** (WHAT/WHY) | `~/Documents/proyectos/sovereignty/soverum/products/{name}/domain/` |
| **Code patterns** (HOW — project-specific) | `.claude/patterns/business/` |
| **Technical patterns** (HOW — agnostic) | `~/Documents/proyectos/sovereignty/soberania-del-codigo/` |
| **Current inventory** (what exists today) | `.claude/status/` |

Domain files: `index.md` → `core-model.md` → `{context}.md`
If code and domain files conflict → **domain files are correct**.
```

The snapshot index in CLAUDE.md must have correct use case counts and point to the subdirectory files (not old ALL_CAPS files).

---

## Project Code Patterns (.claude/patterns/business/)

### Taxonomy (applied to DearAdry and FollowMe)

| Group | What it is | Action |
|-------|-----------|--------|
| **A — Project-specific** | Code patterns unique to this product (admin CRUD layout, UI design) | Keep forever |
| **B — Adaptation of soberania canonical** | Project version of an agnostic pattern (auth, stripe, responsive) | Keep + pointer to canonical |
| **C — Business rules superseded by soverum** | Code still valid, but rules now in soverum domain | Keep for code; never duplicate rules |
| **D — Migration candidate** | Agnostic content not yet in soberania | Migrate when opportunity arises |
| **E — Superseded** | Fully replaced by soverum domain file | Mark as deprecated |

Update `patterns/business/index.md` to reflect this taxonomy.

---

## Migration Checklist (applying to a new project)

### Step 1 — Formalizar la taxonomía
Create or update `soverum/context/plans/PLAN-KNOWLEDGE-ARCHITECTURE.md` defining the artifact map.

### Step 2 — Create domain/ in soverum
For each domain concept:
- Extract business rules from `.claude/patterns/business/`
- Write in plain English + compact TypeScript entity definitions
- No code examples, no framework details
- Create `index.md` with reading guide

### Step 3 — Reduce snapshots
For each snapshot in `.claude/status/`:
- Strip: prose, flow diagrams, Redux details, file counts, pattern references
- Keep: entity interfaces (compact), use cases table (✅), endpoints table, one critical note
- Target: 40–60 lines per file
- Reorganize into subdirectories (admin/, public/, auth/, etc.)
- Create `status/index.md` with module table

### Step 4 — Update CLAUDE.md
- Add KNOWLEDGE SOURCES section at the top
- Update snapshot index with correct counts and new file paths
- Update Quick Reference table: separate domain (soverum) from code patterns (local)
- Update Business Model section to point to soverum domain files

### Step 5 — Classify code patterns
Update `patterns/business/index.md` with A/B/C/D/E taxonomy.
Mark E (superseded) files with deprecation notice.

### Step 6 — Repeat per project
Same Steps 2–5 for each product in the portfolio.

### Step 7 — Write this SOP
With real migration experience, write `soberania-del-codigo/core/documentation/knowledge-architecture.md` (this file).

---

## Token Economy

Every documentation token must earn a return in reduced reading during development.

**High-value tokens**: Domain invariants (read once, shape all future decisions).
**Zero-value tokens**: Prose that repeats code, flows that duplicate diagrams, rules that appear in two places.

The litmus test for any documentation decision:
> "If I remove this sentence, will a future developer make a wrong decision?"
> If yes → keep it. If no → remove it.

---

## Case Studies

| Project | Domain Files | Snapshot Reduction | Snapshots |
|---------|-------------|-------------------|-----------|
| DearAdry | 5 files (core-model, admin-rules, kit-evidence-workflow, platform-sitemap, index) | 200–450 → 35–60 lines | 22 modules in admin/ + public/ + auth/ |
| FollowMe | 4 files (core-model, multi-tenant-model, voting-model, index) | 80–130 → 35–55 lines | 11 modules in admin/ + tenant-admin/ + public/ + auth/ |

Key finding: Project-specific code patterns in `.claude/patterns/business/` are NOT duplicates of soberania canonical — they are adaptations with project-specific code examples. Both coexist legitimately.
