# SDP Step 14: Promotion

> **Input**: PR approved at current environment
> **Output**: Code promoted to next environment, cleanup at master

---

## Promotion Pipeline

```
feature → qa → lab → master
```

**CRITICAL — Source branch rule:**

- **ALL PRs** (to qa, lab, and master) have the **feature branch** as source.
- The feature branch is born from `master` and is promoted independently to each environment.
- **Sacrifice branches exist ONLY to resolve conflicts.** If the feature branch merges cleanly into the target, use it directly — never create a sacrifice branch "just in case."
- A sacrifice branch is named `<target>-<feature-branch>`, is created from the target, and has the feature merged into it. It is the sacrifice branch that gets used as `source` in the PR when conflicts exist.

Each promotion is a separate PR with the same process:
1. Attempt merge into target locally — if clean, use feature branch as source
2. If conflicts, create sacrifice branch `<target>-<feature-branch>` and resolve there
3. Create PR with reviewers
4. Wait for approval

**Master only** — before creating the PR:
1. Cleanup task-specific files in the feature worktree
2. Create business pattern if applicable
3. Then proceed with PR creation

## QA → LAB

```
pr_create → /repositories/{workspace}/{repo}/pullrequests
  body: {
    "title": "[LAB][<Type>][<Module>] - TICKET-ID: <Desc>",
    "source": {"branch": {"name": "feature/TICKET-ID-<desc>"}},  ← feature branch
    "destination": {"branch": {"name": "lab"}},
    "reviewers": [...],
    "close_source_branch": false
  }
```

> If there are conflicts with `lab`, replace source with `lab-feature/TICKET-ID-<desc>` (sacrifice branch born from `lab` with the feature merged in).

## LAB → Master

### Step 1 — Master Cleanup (BEFORE PR)

In the feature worktree, before touching the branch or creating the PR:

### Delete task-specific files

```bash
# These files are task-specific and should NOT persist in master
rm -rf .claude/business/TICKET-ID-*.md
rm -rf .claude/plans/PLAN-TICKET-ID.md
rm -rf .claude/status/*snapshot*.md
rm -rf .claude/docs/SPIKE-*.md
```

### Create business pattern (if applicable)

If the feature introduces shared knowledge (new business flow, data normalization, integration pattern):

```bash
# Create pattern in .claude/patterns/business/
# Example: .claude/patterns/business/device-identification.md
```

This pattern persists in master and helps future tasks understand the domain.

### Decision tree

```
Feature is domain knowledge others need?
  YES → Create .claude/patterns/business/<feature>.md
  NO  → No pattern needed

Task files (.claude/business/, plans/, status/, docs/)?
  ALWAYS delete from master — they're task-specific
```

### Update SOPs with learnings

If the task revealed new patterns, errors, or process improvements:

1. Update the relevant sub-SOP in sovereignty repo
2. Sync to project worktrees
3. Add anti-patterns discovered

### Step 2 — Create PR (after cleanup is committed)

```
pr_create → /repositories/{workspace}/{repo}/pullrequests
  body: {
    "title": "[MASTER][<Type>][<Module>] - TICKET-ID: <Desc>",
    "source": {"branch": {"name": "feature/TICKET-ID-<desc>"}},  ← feature branch
    "destination": {"branch": {"name": "master"}},
    "reviewers": [...],
    "close_source_branch": false
  }
```

> If there are conflicts with `master`, replace source with `master-feature/TICKET-ID-<desc>` (sacrifice branch born from `master` with the feature merged in). Feature branches born from `master` typically have NO conflicts at master — do not create a sacrifice branch preemptively.

### Step 3 — ticket system transition (after merge)

```
ticket_transition_issue → TICKET-ID
  transition_name: "Done"
```

---

## Rules

- Each environment promotion is a SEPARATE PR
- **Source is ALWAYS the feature branch** — never the previous environment (`qa`, `lab`) as source
- **Sacrifice branch ONLY when conflicts exist** at the target — never preemptively
- Sacrifice naming: `<target>-<feature-branch>` (e.g. `lab-feature/TICKET-ID-visualizacion-regalos-pedido`)
- ALWAYS cleanup task files at master
- Business patterns are the ONLY `.claude/` content that persists in master
- Update SOPs with learnings — every task teaches something
