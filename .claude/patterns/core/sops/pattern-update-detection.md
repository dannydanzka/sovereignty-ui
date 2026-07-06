# SOP: Pattern Update Detection

> **PURPOSE**: Detect when project work produces improvements that should flow upstream to sovereignty
> **TRIGGER**: End of any feature task, migration, or refactoring
> **OUTPUT**: Updated sovereignty patterns OR documented decision to skip
> **UPDATED**: 2026-04-10

---

## Problem

Patterns evolve during project work. A migration task discovers a factory pattern. A bug fix reveals an error handling gap. These improvements live in `.claude/patterns/` of one worktree but never reach sovereignty — so other projects and worktrees never benefit.

Without detection, patterns decay into snapshots of the day they were written.

---

## Detection Triggers

| Trigger | Check |
|---------|-------|
| **New pattern created** | `git diff --name-only --diff-filter=A .claude/patterns/` |
| **Existing pattern enriched** | `git diff --stat .claude/patterns/` (line count increased significantly) |
| **Migration completed** | Module migration phases (R0-R7) often produce reusable patterns |
| **Repeated technique** | Same approach used in 2+ tasks → candidate for elevation |
| **SOP followed but incomplete** | Gaps found during SCD/SCG/SDP → new or updated SOP |

---

## Detection Commands

```bash
SOV=~/path/to/soberania-del-codigo
PATTERNS=.claude/patterns

git diff --name-only --diff-filter=A "$PATTERNS/"
git diff --stat "$PATTERNS/" | tail -5

for f in $(git diff --name-only "$PATTERNS/core/" "$PATTERNS/frontend/"); do
  mob_lines=$(wc -l < "$f" 2>/dev/null)
  sov_file="$SOV/$(echo "$f" | sed "s|$PATTERNS/||")"
  sov_lines=$(wc -l < "$sov_file" 2>/dev/null || echo "0")
  [ "$mob_lines" -gt "$sov_lines" ] && echo "ENRICHED: $f (mob=$mob_lines vs sov=$sov_lines)"
done
```

---

## Classification

| Category | Source in project | Destination in sovereignty | Action |
|----------|-------------------|---------------------------|--------|
| **Structural pattern** | `patterns/core/` or `patterns/frontend/` | Same path in sovereignty root | Copy upstream |
| **Project-specific** | `patterns/business/` | `projects/{project}/patterns/business/` | Update project backup |
| **Mobile-specific** | `patterns/frontend/mobile/` | `sovereignty/mobile/` | Copy upstream |
| **Rules update** | `rules/_global.md` | `projects/{project}/rules/` | Update project backup |
| **New SOP** | `patterns/core/sops/` | `sovereignty/core/sops/` | Copy upstream |

---

## Upstream Decision Flow

```
Pattern changed in project
      |
Is it structural (core/, frontend/)?
  YES -> Does sovereignty have this file?
    YES -> Is project version richer? (more lines, new sections)
      YES -> MERGE enrichments into sovereignty version
      NO  -> SKIP (sovereignty already has the full version)
    NO  -> CREATE in sovereignty
  NO -> Is it project-specific (business/, rules/)?
    YES -> UPDATE project backup in sovereignty/projects/
    NO  -> SKIP
```

---

## Merge Protocol

When merging enrichments into an existing sovereignty file:

1. **Read sovereignty version** completely
2. **Identify NEW sections** in project version (not in sovereignty)
3. **Add new sections** to sovereignty version (don't replace existing content)
4. **Resolve contradictions** — sovereignty is the authority, project is the source of new knowledge
5. **Update platform differences** table if applicable

---

## Audit Schedule

| Frequency | Scope | Command |
|-----------|-------|---------|
| **Per task** | Files touched in current task | `git diff --name-only .claude/patterns/` |
| **Per sprint** | All patterns vs sovereignty | Run detection commands above |
| **Per quarter** | Full sovereignty audit | `context-budget.md` audit procedure |

---

## Anti-Patterns

| Wrong | Right |
|-------|-------|
| Never check sovereignty after enriching patterns | Run detection after every task |
| Copy project file wholesale over sovereignty | Merge only NEW sections |
| Skip upstream because "it's just one file" | One enrichment benefits all projects |
| Wait until quarterly audit | Upstream during the task while context is fresh |

---

## Related

- `core/workflow/context-budget.md` — Token budget audit
- `core/workflow/code-elevation.md` — 2+ rule for code promotion
- `core/sops/sovereignty-sync-strategy.md` — Sync from sovereignty TO projects
