# SOP: Context Pruning

> **PURPOSE**: Ritualized, auditable reduction of sovereignty + project context to keep it lean, current, and aligned with model capabilities
> **TRIGGER**: Scheduled (every 2–3 months) OR symptom-based (see Trigger Signals)
> **OUTPUT**: Pruned context, preserved gap list, metrics commit
> **UPDATED**: 2026-04-12
> **DOCTRINE**: [context-as-territory.md](../../doctrine/context-as-territory.md), [attention-economy.md](../../doctrine/attention-economy.md)

---

## Problem

Context accumulates. Files multiply. Documentation written for older models persists long after capabilities evolve. Project-specific notes drift into "universal" folders. Skills and MCPs installed for one-off tasks never get removed.

Left unchecked, the sovereignty system becomes a swamp: 300 files, 30,000 lines, nobody reads any of it, the model drowns in context that no longer serves.

Pruning is the corrective mechanism. This SOP defines how to execute it safely.

---

## Trigger Signals

Start a pruning cycle when any of these appear:

| Signal | Threshold | Action |
|--------|-----------|--------|
| **Time since last pruning** | > 3 months | Schedule pruning |
| **File count in `.claude/patterns/`** | > 80 files | Audit |
| **Line count in `.claude/patterns/`** | > 8,000 lines | Audit |
| **Model version upgrade** | Any major release | Re-audit against new capabilities |
| **Subjective friction** | "Why is this so slow?" / "Why does it hallucinate?" | Audit for noise |
| **Orphan files** | Created weeks ago, never referenced | Audit or delete |

A pruning cycle is **not optional** after more than 6 months. Skipping leads to compounded decay.

---

## The Pruning Procedure

### Phase 1 — Inventory (30–45 min)

1. Generate a current inventory:
   ```bash
   cd <project>/.claude/patterns
   find . -name '*.md' | wc -l
   find . -name '*.md' -exec wc -l {} + | tail -1
   ```
2. Record baseline metrics in the commit message at the end.
3. List every file. This is the audit surface.

### Phase 2 — Classification (60–90 min)

For each file, classify into one of four buckets:

| Bucket | Criterion | Action |
|--------|-----------|--------|
| **Keep** | Non-inferable by current model AND referenced in last 3 months | Preserve |
| **Slim** | Partially inferable; contains some project-specific gold | Extract gold, delete rest |
| **Delete** | Inferable from pretraining OR replaceable by context7 on demand OR never referenced | Remove |
| **Relocate** | Lives in wrong layer (e.g., project-specific in `core/`) | Move, do not duplicate |

**Hard rules:**

- If a file restates what the current model already knows fluently → Delete.
- If a file exists only because "someone might need it someday" → Delete.
- If a file duplicates ≥60% of another file → Merge and delete one.
- If a doctrine file argues a principle → Keep, even if rarely read.
- If uncertain → mark for Phase 4 review, do not delete now.

### Phase 3 — Execution (60 min)

1. Delete files marked Delete. Commit as a single atomic change.
2. For Slim files: extract the non-inferable content, rewrite the file, commit.
3. For Relocate: `git mv`, verify cross-references, commit.
4. Do **not** batch-commit multiple phases — each step should be independently revertible.

### Phase 4 — Gap Anticipation (30 min)

Before declaring the cycle done, review what was deleted. For each deletion, predict: *"what tasks will discover this gap first?"*

Record predicted gaps in a `pruning-cycle-<date>.md` file inside `plans/`. When a future task surfaces one of these gaps, that's the feedback signal to restore (Phase 6).

### Phase 5 — Measurement (15 min)

Compare before / after:

```
Before:  <file_count> files, <line_count> lines
After:   <file_count> files, <line_count> lines
Delta:   -<%> files, -<%> lines
```

Commit these numbers. They are not performance metrics — they are accountability metrics.

### Phase 6 — Feedback Loop (ongoing, next 2–3 tasks)

The pruning is not complete when files are deleted. It is complete when the next 2–3 real tasks validate the decisions.

- If a task surfaces a gap → restore the relevant content (or rewrite leaner).
- If no tasks surface gaps in 4–6 weeks → the pruning was correct.
- If > 30% of deleted content needs restoration → the pruning was too aggressive. Record the lesson for next cycle.

---

## What to Never Prune

Some content is protected by doctrine:

| Content | Why protected |
|---------|---------------|
| `doctrine/principles.md` | The 8 foundational principles |
| `doctrine/context-as-territory.md` | The pruning doctrine itself |
| `doctrine/attention-economy.md` | The scarcity doctrine |
| Business context (API contracts, stakeholder decisions) | Non-inferable and project-specific |
| Commit history | Git preserves this; never rewrite |
| Current active plans (`plans/PLAN-*.md`) | In-flight work |
| Project `.excludes` files | Active configuration |

If a doctrine file must be removed, require an explicit commit message rationale and retain the previous version via git.

---

## Model-Upgrade Audit

Whenever the underlying model major-version changes (e.g., Claude 4.5 → 4.6 → 5.0), execute a **capability delta audit**:

1. Sample 10 files from `patterns/`.
2. For each, ask: "does the new model reproduce this behavior without the pattern loaded?"
3. If yes → mark for deletion in next cycle.
4. If no → keep.

Models evolve. Context must evolve with them.

---

## Automation Opportunities

Parts of this SOP can be automated. When implementing:

- **Stale file detector**: list files not modified AND not git-referenced in the last 90 days.
- **Duplicate detector**: fuzzy-match content across patterns; flag > 60% overlap.
- **Cross-reference analyzer**: list files with zero incoming links.
- **Size outlier detector**: flag files > 500 lines (candidates for splitting).

These are aids, not decisions. A human must classify.

---

## Anti-Patterns

| Antipattern | Why it fails | Correction |
|-------------|--------------|------------|
| **Pruning without history** | Future maintainers repeat removed mistakes | Record every cycle's deletions |
| **Pruning without feedback** | No way to know if cuts were right | Enforce Phase 6 |
| **Pruning only on crisis** | Swamp already formed; cleanup is 10× more expensive | Schedule every 2–3 months |
| **Deleting doctrine silently** | Loses the *why*; future cycles re-invent same arguments | Doctrine deletions require commit rationale |
| **Preserving "just in case"** | Guarantees swamp | If uncertain, restore on demand is cheap |
| **Measuring only file count** | Misses line-density and cross-reference health | Measure files, lines, references, age |

---

## Cadence Summary

```
Every 2–3 months:  Full cycle (Phases 1–6)
Every major model release:  Capability delta audit
Every feature task:  Informal awareness — "does this add context weight?"
Annually:  Review this SOP itself — has the heuristic evolved?
```

---

## Related SOPs

- [pattern-update-detection.md](pattern-update-detection.md) — upstream flow (improvements flowing INTO sovereignty)
- [sovereignty-maintenance.md](sovereignty-maintenance.md) — broader hygiene (stale refs, `.gitignore`, drift)
- [sovereignty-refinement.md](sovereignty-refinement.md) — governance of who can change sovereignty

Pattern-update-detection and context-pruning are complementary:
- **Detection** ensures improvements flow up (additive maintenance).
- **Pruning** ensures noise flows out (subtractive maintenance).

A healthy system runs both continuously.

---

> *"The garden thrives not because everything grows, but because the gardener knows what to remove."*
