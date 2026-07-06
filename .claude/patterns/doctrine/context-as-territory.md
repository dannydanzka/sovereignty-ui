# Context as Living Territory

> **Module**: doctrine
> **Version**: 1.0
> **Updated**: 2026-04-12
> **Author**: Roberto Ramírez
> **Related**: [principles.md](principles.md) (Principle 8 — Conscious Evolution), [evolution.md](evolution.md), [attention-economy.md](attention-economy.md)

---

## TL;DR

The optimal context for an AI-native system is **not accumulative — it is seasonal**. It grows, is pruned, regrows. Stability is achieved through conscious evolution, not through preservation.

A system that never prunes its context becomes a swamp. A system that prunes without history loses its compass.

---

## Thesis

Documentation is not a monument. It is a territory that must be cultivated.

Three forces act on any AI-native context system over time:

1. **Entropy** — every session adds patterns, SOPs, skills, MCPs. Left unchecked, volume crowds out signal.
2. **Model evolution** — capabilities that required explicit documentation 18 months ago are now internalized in the pretraining. Context written for Sonnet 3.5 is noise in Opus 4.6.
3. **Project divergence** — what was universal yesterday becomes project-specific tomorrow. What was a local workaround becomes a universal principle.

The only sustainable response is **conscious evolution**: periodic, ritualized pruning paired with preservation of the *why*.

---

## The Three Corollaries

### 1. Law of Decreasing Context

> *As models evolve, the context they require to execute well decreases.*

Claude 3.5 Sonnet (June 2024) needed explicit instructions on React patterns, TypeScript inference, Redux wiring. Claude Opus 4.6 (2026) already knows these internally — documenting them wastes attention budget.

**Corollary**: every pruning cycle should begin with the question *"is this still non-inferable by the current model?"*. If the answer is no, the document is a fossil.

This is why documentation written for older models must be audited against current capabilities, not preserved for nostalgia.

### 2. Pruning as Ritual, Not Correction

> *Pruning is maintenance, not repair.*

Six prunings in eight months is not instability — it is health. The alternative (preservation out of fear) produces the documentation swamp visible in most enterprise codebases: 300 markdown files, none of which anyone reads.

Each pruning cycle follows the pattern:

```
accumulate → use → learn → prune → restore gaps → repeat
```

The restore step is critical. Pruning without feedback produces regret. Restoring without pruning produces sprawl. Both are needed.

**Corollary**: a pruning cadence that never restores anything is too conservative. One that restores more than 30% of what it pruned is too aggressive.

### 3. Preserve the Why, Prune the How

> *Principles are consulted; procedures are executed.*

Doctrine files (the *why*) are rarely read line by line. They are anchors — consulted in moments of doubt or conflict. They deserve depth, argumentation, and history.

SOPs and patterns (the *how*) are executed. They must be lean, current, and directly actionable.

**Corollary**: pruning aggressiveness should be inversely proportional to depth layer:

| Layer | Pruning pressure | Why |
|-------|------------------|-----|
| Patterns / SOPs (how) | High | Must reflect current reality |
| Doctrine (why) | Low | Historical argumentation has permanent value |
| Project-specific | Case-by-case | Depends on active use |

---

## History of the Prunings

The sovereignty system has undergone six major pruning cycles since inception (2025-08 to 2026-04):

1. **Initial structure** — raw accumulation of patterns from first Claude Code project.
2. **First consolidation** — separation of doctrine / core / frontend layers.
3. **Discipline split** — separation of mobile / web / spa / backend disciplines.
4. **SOP monolith break** — fragmentation of 700+ line SOPs into sub-procedures.
5. **v6 Modular SOP System** — introduction of SCD / SCG / SDP trilogy, elimination of redundant workflow files (April 2026).
6. **v6 Pruning + Gap Restoration** — 109 → 59 files, 16,410 → 5,105 lines. Restored 12 structural gaps from real-task feedback (April 2026).

Each cycle produced a leaner, more current, more model-aligned system. None of them were "mistakes to be corrected." They are the mechanism itself.

---

## Practical Implications

1. **Schedule pruning** — do not wait until the context feels broken. Prune every 2-3 months regardless.
2. **Measure before and after** — file count, line count, cross-references. The numbers matter for accountability, even when the benefit is qualitative.
3. **Preserve pruning decisions** — this file exists so future maintainers understand that aggressive pruning is policy, not accident.
4. **Never delete doctrine silently** — if a principle is removed, document why in the commit and in this file.
5. **Restore what breaks** — if the next 2-3 tasks reveal a gap, restore it. The cycle depends on feedback.

---

## Governance

This doctrine applies to all sovereignty repositories and their projected contexts. Project-level decisions about what to prune belong in each project's `.excludes` file — but the *why* of pruning lives here, once, for all projects.

See [core/sops/context-pruning.md](../core/sops/context-pruning.md) for the operational procedure.

---

> *"Without pruning, the garden becomes a jungle. Without history, the gardener forgets what was planted."*
