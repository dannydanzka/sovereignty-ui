# SOP: Creating and Structuring SOPs

> **PURPOSE**: Standard for creating SOPs that minimize auto-loaded context while keeping detail accessible
> **SCOPE**: All `.claude/rules/sop/` and `.claude/patterns/**/sops/` files
> **UPDATED**: 2026-04-09

---

## Core Principle

**SOPs live in two layers: a lightweight reference (auto-loaded) and a detailed procedure (on-demand).**

```
.claude/rules/sop/{name}.md          ← REFERENCE (auto-loaded, always in context)
.claude/patterns/**/sops/{name}.md   ← DETAIL (read on-demand, never auto-loaded)
```

The reference tells Claude **what exists and when to use it**. The detail tells Claude **how to execute it**. This separation keeps the context window lean.

---

## Two-Layer Structure

### Layer 1: Reference (`rules/sop/`)

**Auto-loaded** into every conversation. Must be minimal.

**Max size**: ~50 lines (hard limit). If it exceeds this, move detail to patterns.

**Contains**:
- Purpose (1 line)
- Quick reference commands (the 3-5 most common commands)
- Decision table or checklist (if applicable)
- `> **Full SOP**: patterns/.../sops/{name}.md` pointer

**Does NOT contain**:
- Step-by-step procedures
- Detailed explanations or rationale
- Examples longer than 2-3 lines
- Troubleshooting tables with more than 5 rows
- Anti-patterns sections

### Layer 2: Detail (`patterns/**/sops/`)

**Never auto-loaded**. Read only when the task requires it.

**Contains**:
- Full step-by-step procedure
- Detailed examples with real commands
- Troubleshooting tables
- Anti-patterns and edge cases
- Rationale and context
- Related references

**Location by domain**:
- `patterns/core/sops/` — Cross-project SOPs (git, MCP, delivery, testing)
- `patterns/business/sops/` — Business domain SOPs (manual testing, offer management)

---

## Template: Reference File (`rules/sop/{name}.md`)

```markdown
# SOP: {Name}

> **PURPOSE**: {One-line description}
> **DETAIL**: `patterns/{layer}/sops/{name}.md`

---

## Quick Reference

{3-5 most common commands or a decision table}

## When to Read Full SOP

- {Scenario 1 that requires the detailed procedure}
- {Scenario 2}

## See Also

- {Related reference 1}
- {Related reference 2}
```

**Target**: 30-50 lines. Enough to answer 80% of questions. The full SOP handles the other 20%.

---

## Template: Detail File (`patterns/**/sops/{name}.md`)

```markdown
# SOP: {Name}

> **PURPOSE**: {Description}
> **SCOPE**: {What modules/systems this covers}
> **PREREQUISITE**: {Requirements}
> **UPDATED**: {Date}

---

## Overview

{Brief context — 2-3 sentences}

---

## Procedure

### Step 1 — {Name}

{Detailed instructions with commands and examples}

### Step 2 — {Name}

{...}

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| ... | ... | ... |

---

## Anti-Patterns

| Don't | Do Instead |
|-------|-----------|
| ... | ... |

---

## Related

- {Reference to related SOPs or patterns}
```

---

## Creating a New SOP

```
1. IDENTIFY the domain → core, business, or discipline-specific?
2. WRITE the detail file in patterns/{domain}/sops/{name}.md
3. WRITE the reference file in rules/sop/{name}.md (max 50 lines)
4. ADD reference to rules/_global.md "By Task Type" table
5. REPLICATE to other projects + sovereignty repo
```

### Naming Convention

- Kebab-case: `manual-testing-cart.md`, `branch-merge-strategy.md`
- Reference and detail files use the **same name**
- If the detail splits into sub-files, the reference still points to the index

---

## Splitting a Large SOP

When a detail SOP grows beyond ~200 lines or covers multiple independent flows:

```
patterns/business/sops/
├── manual-testing-flows.md               ← Index (overview + auth + troubleshooting)
├── manual-testing-cart.md                ← Module-specific
├── manual-testing-electronic-order.md    ← Module-specific
└── manual-testing-product.md             ← Module-specific
```

The reference in `rules/sop/` points to the index file.

---

## Migrating an Existing Overloaded SOP

When a `rules/sop/` file exceeds 50 lines:

```
1. COPY rules/sop/{name}.md → patterns/{domain}/sops/{name}.md
2. TRIM rules/sop/{name}.md to reference format (max 50 lines)
3. ADD pointer: > **Full SOP**: patterns/.../sops/{name}.md
4. VERIFY _global.md references are correct
```

---

## Anti-Patterns

| Don't | Do Instead |
|-------|-----------|
| Put full procedure in `rules/sop/` | Keep reference only; detail in `patterns/` |
| Auto-load everything "just in case" | Only load on-demand when task requires it |
| Duplicate content across both layers | Reference = commands + pointer. Detail = everything else |
| Create SOP without reference pointer | Every detail SOP needs a `rules/sop/` reference |
| Exceed 50 lines in `rules/sop/` | If you can't trim it, the detail belongs in patterns |
