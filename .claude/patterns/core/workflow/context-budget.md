# Context Budget

> **Module**: core/workflow
> **Scope**: Managing auto-loaded context in `.claude/rules/` to prevent token waste
> **Priority**: HIGH — Directly impacts every Claude Code interaction
> **VERSION**: 1.0 | **UPDATED**: 2026-03-16

---

## Problem

Claude Code **auto-loads every file in `.claude/rules/`** on every message. Files placed here consume context tokens whether they're needed or not.

### Incident (2026-03-16)

Six projects were loading 8,322 lines of rules including:
- Full database schemas (601 lines)
- Full data models (338 lines)
- Complete SOPs with code examples (478 lines)
- Duplicates of content already in `.claude/patterns/`

This burned ~56% of token budget on context that was rarely needed. After optimization: 8,322 → 3,676 lines.

---

## Three-Layer Architecture

```
.claude/
├── rules/          ← ALWAYS LOADED (lightweight pointers only)
│   ├── _global.md      5-20 lines: project identity + references
│   ├── apps/           Per-app routing rules (10-30 lines each)
│   ├── reference/      Pointers to docs/ (3-6 lines each)
│   └── sop/            Short checklists (10-25 lines each)
│
├── docs/           ← ON DEMAND (read when explicitly needed)
│   ├── database-schema.md    Full schema (hundreds of lines)
│   ├── data-model.md         Full entity model (hundreds of lines)
│   └── stripe-setup.md       Full integration guide
│
└── patterns/       ← SOVEREIGNTY-SYNCED (read when working on related code)
    ├── doctrine/       WHY — Philosophy
    ├── core/           WHAT — Transversal practices
    ├── frontend/       HOW — Discipline implementation
    └── business/       Project-specific business patterns
```

### Decision Criteria

| Question | → Layer |
|----------|---------|
| Does Claude need this on EVERY message? | `rules/` (keep it tiny) |
| Does Claude need this when working on a specific topic? | `docs/` (read on demand) |
| Is this synced from sovereignty? | `patterns/` (already there) |
| Does it duplicate content in `patterns/`? | DELETE from `rules/` |

---

## Rules for `rules/`

### What BELONGS in `rules/`

- **Routing rules**: "When working on X files, do Y" (10-30 lines)
- **Project identity**: Stack, conventions, quick references (15-20 lines)
- **Pointers**: 3-6 line files that say "Full reference: `.claude/docs/X.md`"
- **Short checklists**: Quick DO/DON'T, max 25 lines

### What DOES NOT belong in `rules/`

- Full database schemas → `docs/`
- Full data models → `docs/`
- Complete SOPs with code examples → `docs/` or reference `patterns/`
- Content that duplicates `patterns/` → DELETE
- Integration guides (Stripe, auth, etc.) → `docs/`

### Size Limits

| File type | Max lines in `rules/` |
|-----------|-----------------------|
| `_global.md` | 30 |
| `apps/*.md` | 30 |
| `reference/*.md` | 10 (pointer only) |
| `sop/*.md` | 25 (checklist only) |
| **Total rules/** | < 600 lines per project |

---

## Pointer Pattern

When a heavy file must be referenced from `rules/`, create a pointer:

```markdown
# Database Schema

> **Full reference**: `.claude/docs/database-schema.md`
> **Prisma schema**: `prisma/schema.prisma`

18 models. PostgreSQL via Supabase. See full reference for field details.
```

This loads 5 lines instead of 601.

---

## Audit Procedure

Run periodically (monthly or after sovereignty sync):

### Step 1: Count current load

```bash
# Count total auto-loaded lines
find .claude/rules/ -name "*.md" -exec cat {} + | wc -l
```

### Step 2: Identify heavy files

```bash
# Find files > 30 lines in rules/
find .claude/rules/ -name "*.md" -exec sh -c 'lines=$(wc -l < "$1"); [ "$lines" -gt 30 ] && echo "$lines $1"' _ {} \; | sort -rn
```

### Step 3: Identify duplicates

```bash
# Check if any rules/ content duplicates patterns/
for f in .claude/rules/sop/*.md; do
  name=$(basename "$f")
  if find .claude/patterns/ -name "$name" -print -quit | grep -q .; then
    echo "DUPLICATE: $f"
  fi
done
```

### Step 4: Move or delete

- Heavy files → `mkdir -p .claude/docs/ && mv .claude/rules/reference/heavy.md .claude/docs/`
- Replace with pointer in `rules/reference/`
- Duplicates → delete from `rules/`
- Update sovereignty backup: `backup-project.sh`

---

## Anti-Patterns

| Anti-Pattern | Consequence | Fix |
|-------------|-------------|-----|
| Copy full SOP to `rules/sop/` | 200-500 lines auto-loaded | Slim to 25-line checklist, reference `patterns/` |
| Put database schema in `rules/reference/` | 600+ lines auto-loaded | Move to `docs/`, leave pointer |
| Duplicate `patterns/core/workflow/X.md` in `rules/sop/X.md` | Same content loaded twice | Delete from `rules/` |
| Never audit rules/ size | Grows silently over syncs | Monthly audit (Step 1-4 above) |

---

## Related

- `context-first.md` — Read snapshots before code (context efficiency)
- `execution-discipline.md` — Execute directly, don't over-verify
- `core/sops/sovereignty-maintenance.md` — Ongoing sovereignty hygiene

---

**Version**: 1.0 | **Created**: 2026-03-16
