# SOP: Sovereignty Workflow (Sync + Backup)

> **PURPOSE**: The single authoritative procedure for keeping sovereignty in sync with projects
> **SCOPE**: ALL projects using sovereignty (repo-local and workspace-governance)
> **PREREQUISITES**: Sovereignty repo cloned, project registered in `projects/<group>/<name>/`
> **UPDATED**: 2026-04-23

---

## 0. Mental Model (Read This First)

```
soberania up to date?  →  sync (blind replace)  →  work  →  backup (business + rules)  →  commit soberania
```

Three rules that unlock everything else:

**1. Soberania must be current before you sync.**
`sync-sovereignty.sh` pulls from whatever is in soberania at that moment. If soberania is stale (last backup not committed), the project gets outdated patterns. Always verify the project's backup is committed in soberania before running sync.

**2. sync-sovereignty.sh only replaces — it does not analyze, does not backup.**
It wipes and rebuilds `.claude/patterns/{doctrine,core,<discipline>}/` from soberania. Nothing else. No intelligence, no safety net. What's in soberania is what lands in the project.

**3. backup-project.sh backs up only project-owned content: business patterns + rules.**
It does NOT touch doctrine/, core/, or discipline patterns — those are sovereignty-owned and flow the other direction. Backup scope: `.claude/patterns/business/`, `.claude/rules/`, `.claude/docs/`, `CLAUDE.md`.

| Script | Does | Does NOT |
|--------|------|----------|
| `sync-sovereignty.sh` | Replace doctrine + core + discipline | Backup, analyze, touch business/rules |
| `backup-project.sh` | Copy business + rules → soberania | Sync, analyze, touch doctrine/core |

---

## 1. The Two Commands

Sovereignty uses **two complementary commands** that flow in opposite directions. They are **never automated together**.

| Command | Direction | What it touches | When to run |
|---------|-----------|-----------------|-------------|
| `sync-sovereignty.sh` | sov → local | `.claude/patterns/{doctrine,core,<discipline>}/` (agnostic) | At the start of work, or after sov updates |
| `backup-project.sh` | local → sov | `sovereignty/projects/<name>/{rules,patterns/business,docs}/` + `CLAUDE.md` | At the end of work, if rules/business were edited locally |

Everything else is a consequence of these two directions.

---

## 2. Classification — Who Owns What

Before editing anything, know whether you're touching **sov-owned** or **project-owned** content. This determines where the edit lives and how it propagates.

### Sov-owned (agnostic — lives in sovereignty repo)

| Path | Content | Applies to |
|------|---------|------------|
| `sovereignty/doctrine/` | Philosophy, principles (WHY) | ALL projects |
| `sovereignty/core/` | Git, quality, testing, SOPs, workflow (WHAT) | ALL projects |
| `sovereignty/<discipline>/` | Frontend/mobile/backend/etc. patterns (HOW) | Projects of that discipline |

**Rule**: Edit directly in `sovereignty/`. Never edit `.claude/patterns/{doctrine,core,<discipline>}/` inside a project — those folders are wiped+replaced on every sync.

### Project-owned (specific to one project — lives in `projects/<name>/`)

| Path | Content | Scope |
|------|---------|-------|
| `projects/<name>/rules/` | Lerna/Nx config, module rules, stack-specific SOPs | This project only |
| `projects/<name>/patterns/business/` | Domain patterns (offers, payments, business rules) | This project only |
| `projects/<name>/CLAUDE.md` | Project entry point | This project only |
| `projects/<name>/docs/` | Reference docs (stable, not ephemeral) | This project only |

**Rule**: Edit either in sov's `projects/<name>/` directly (then sync), or in the project's `.claude/rules/` (then backup).

### Ephemeral (never backed up)

| Path | Content |
|------|---------|
| `.claude/business/` | Per-ticket business context |
| `.claude/plans/` | Per-ticket implementation plans |
| `.claude/status/` | Code state snapshots |

**Rule**: These live and die in the project. If something stabilizes into reusable knowledge, promote it to `patterns/` or `rules/` and THEN it enters the sync/backup cycle.

---

## 3. The Daily Flow (Per Project, Atomic)

Work on **one project at a time**. Complete the full cycle before moving to another project that shares the same sov backup folder.

```
┌────────────────────────────────────────────────────────────┐
│  1. cd <project>                                           │
│  2. ./sync-sovereignty.sh            # baja agnósticos     │
│  3. [trabajo normal en el proyecto]                        │
│  4. ./backup-project.sh              # sube rules/business │
│  5. cd sovereignty                                         │
│  6. git diff projects/<name>/        # REVISAR             │
│  7. git add + git commit + git push  # manual              │
│  8. siguiente proyecto                                     │
└────────────────────────────────────────────────────────────┘
```

### Step-by-step

**Step 1 — Enter the project root**
```bash
cd ~/Documents/proyectos/my-project
```

**Step 2 — Sync sov→local**
```bash
~/Documents/proyectos/sovereignty/soberania-del-codigo/sync-sovereignty.sh
```
The script detects the discipline from `.project-id`, wipes+replaces `.claude/patterns/{doctrine,core,<discipline>}/`, applies the project overlay from `projects/<name>/patterns/`, and pulls `rules/` from `projects/<name>/rules/`. Project-owned folders (`business/`, `plans/`, `status/`, `docs/`, `CLAUDE.md`) are never touched.

**Step 3 — Work normally**
Edit code, write tests, update `.claude/business/<ticket>.md`, whatever the task needs.

**Step 4 — Backup if rules/business were touched**
```bash
~/Documents/proyectos/sovereignty/soberania-del-codigo/backup-project.sh
```
The script shows a diff of what changed, a validation checklist, and asks for confirmation. Only `rules/`, `patterns/business/`, `docs/`, and `CLAUDE.md` are copied to sov. If nothing project-specific changed, the script reports "no changes" and exits.

**Step 5-7 — Review and commit in sov**
```bash
cd ~/Documents/proyectos/sovereignty/soberania-del-codigo
git diff projects/<name>/
git add projects/<name>/
git commit -m "backup(<name>): <short description>"
git push origin main
```
**Never commit without reviewing the diff.** The backup is blind — it does not classify, it only copies. The human review step is where misclassification gets caught.

**Step 8 — Next project**
Move to the next worktree or project. The updated `projects/<name>/` in sov is now the new source of truth for subsequent syncs.

---

## 4. Editing Agnostics (Sov-Owned)

When the change applies to ALL projects of a discipline or to all projects globally, edit in sov directly. Never edit inside a project's `.claude/patterns/`.

```bash
# 1. Edit in sov
cd ~/Documents/proyectos/sovereignty/soberania-del-codigo
vim core/sops/new-procedure.md

# 2. Commit + push
git add core/sops/new-procedure.md
git commit -m "docs(sops): add new-procedure"
git push origin main

# 3. Distribute to every affected project
for project in ~/Documents/proyectos/my-project-*; do
  cd "$project"
  ~/Documents/proyectos/sovereignty/soberania-del-codigo/sync-sovereignty.sh
done
```

### Classification decision tree

Before writing a pattern, decide where it belongs:

| Question | Yes → destination |
|----------|-------------------|
| Is it business domain (offers, payments, user flows of the product)? | `projects/<name>/patterns/business/` |
| Is it project stack-specific (Lerna, Nx, Firebase, monorepo structure)? | `projects/<name>/rules/` |
| Is it a technique applicable to any project of this discipline (React hooks, Next.js API routes)? | `<discipline>/` |
| Is it transversal to all disciplines (git workflow, testing philosophy)? | `core/` |

If in doubt, start specific (`projects/<name>/`) and promote later. Demoting something from agnostic to project-specific is much harder than promoting.

---

## 5. Multi-Worktree Edge Case (Shared Project Backup)

Two worktrees of the same project (e.g., `feature-a` and `feature-b`, both from `my-project`) write to the **same** `projects/my-project/` folder in sov. Last-writer-wins.

### The wrong sequence (data loss)

```
1. backup worktree-a  → uploads worktree-a local rules to sov
2. backup worktree-b  → OVERWRITES with worktree-b rules (loses worktree-a)
```

### The right sequence

```
1. sync worktree-a
2. [edits in 9836]
3. backup worktree-a
4. cd sov && git commit + push
5. sync worktree-b          ← baja los cambios de 9836 + actualiza a baseline
6. [edits in 8927]
7. backup worktree-b        ← sube sobre base actualizada
8. cd sov && git commit + push
```

**Rule**: One project at a time. Commit and push in sov between worktrees. Never interleave backups without a commit in between.

---

## 6. Multi-Branch Homologation (All Worktrees Matching Master)

When you want all branches of the same project to end up with identical sovereignty files (e.g., after a major sov update):

```bash
SOV=~/Documents/proyectos/sovereignty/soberania-del-codigo

for dir in worktree-a worktree-b worktree-c; do
  PROJECT=~/Documents/proyectos/my-project-$dir

  # Restore ONLY sov-owned dirs to master's version
  cd "$PROJECT"
  git fetch origin master --quiet
  git checkout origin/master -- .claude/patterns/ .claude/rules/ .claude/.sovereignty-version CLAUDE.md

  # Run sync from clean baseline
  "$SOV/sync-sovereignty.sh"

  echo "$dir: synced"
done
```

**Critical**: Only restore `patterns/`, `rules/`, `.sovereignty-version`, and `CLAUDE.md`. Never restore `.claude/` as a whole — that wipes `business/`, `plans/`, `status/` which contain task-specific work.

---

## 7. Workspace-Governance vs Repo-Local

Two distribution models exist. They are mutually exclusive per project.

| Model | Where `.claude/` lives | Reference |
|-------|------------------------|-----------|
| **Repo-local** | Inside each feature branch of the product repo | [`sovereignty-sync-strategy.md`](sovereignty-sync-strategy.md) |
| **Workspace-governance** | In a parent governance-only git repo; product repos stay clean | [`workspace-governance.md`](workspace-governance.md) |

This workflow SOP applies to both models. The only difference is where sync/backup are executed from:

- **Repo-local**: Run from each feature branch / worktree
- **Workspace-governance**: Run from the workspace root (one command covers all inner repos)

---

## 8. Anti-Patterns

### A. Editing agnostics inside the project

**Wrong**: Edit `.claude/patterns/core/sops/foo.md` in the project.
**Why it fails**: Next sync wipes it. Change is lost silently.
**Right**: Edit in `sovereignty/core/sops/foo.md`, commit, push, sync.

### B. Running backup without reviewing sov git diff

**Wrong**: `backup-project.sh && cd sov && git add . && git commit -m "backup"`
**Why it fails**: Backup is blind. Misclassified content (agnostic stuck in `business/`, WIP drafts, test files) ships to sov permanently.
**Right**: Always `git diff` in sov before commit. Move or discard misclassified content.

### C. Interleaving backups across worktrees of the same project

**Wrong**: `backup worktree-a && backup worktree-b` without commit+push between.
**Why it fails**: Last-writer-wins. 9836's changes get overwritten.
**Right**: Sync → edit → backup → commit+push → move to next worktree.

### D. Skipping sync before edits

**Wrong**: Open worktree, start editing rules, then backup.
**Why it fails**: The worktree's rules may be stale. Backup pushes stale+new mixed content to sov.
**Right**: `sync-sovereignty.sh` first. Always.

### E. Mixing sovereignty sync with master merge

**Wrong**: `git merge origin/master && sync-sovereignty.sh` in a branch with heavy code diff.
**Why it fails**: Hundreds of code conflicts unrelated to sovereignty block the sync.
**Right**: Separate operations. Merge master first, resolve, commit. Then sync.

### F. Copying between projects directly

**Wrong**: Copy a new rule from `worktree-a/.claude/rules/foo.md` to `worktree-b/.claude/rules/foo.md`.
**Why it fails**: Bypasses sov as source of truth. Next sync overwrites or conflicts.
**Right**: Backup from 9836 → commit sov → sync on 8927.

### G. Commits in sov with unreviewed changes

**Wrong**: `cd sov && git add . && git commit -am "sync"` without reading the diff.
**Why it fails**: Accidental inclusion of secrets, WIP, or misclassified content becomes part of the sovereignty history.
**Right**: `git diff` every time. `git add <specific-files>` when in doubt.

---

## 9. Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Different file counts between worktrees after sync | Accumulated manual edits | Restore to master + re-run sync (Section 6) |
| Backup reports "no project backup found" | `.project-id` missing or wrong | Create `sovereignty/projects/<group>/<name>/.project-id` with package name |
| Sync wiped files I edited in the project | Files were in sov-owned layers | Edit in sov directly, not in project |
| CRLF warnings on some files | `.gitattributes` vs master CRLF | `sed -i '' 's/\r$//' file` (cosmetic) |
| `.sovereignty-version` mismatch | Worktree not synced after sov update | Re-run sync |
| Extra files in `business/` not in sov | Task-specific files (expected) | No action — `business/` is per-task |
| Sync fails on `--force` missing | `.claude/` doesn't exist yet | Run with `--force` flag |

---

## 10. What the Scripts Do (Do NOT Replicate Manually)

| Script | Behavior |
|--------|----------|
| `sync-sovereignty.sh` | Detects discipline from `.project-id`, wipes+replaces agnostic layers, applies project overlay, syncs rules from `projects/<name>/rules/`, writes `.sovereignty-version`. Never touches `business/`, `plans/`, `status/`, `docs/`, `CLAUDE.md`. Warns if local changes detected in sov-owned layers (you choose: abort or continue losing). **Does NOT auto-commit or auto-push.** |
| `backup-project.sh` | Shows diff of project-owned folders vs sov, validation checklist, interactive confirmation. Copies `rules/`, `patterns/business/`, `docs/`, `CLAUDE.md` to `projects/<name>/`. Writes `.last-backup` timestamp. **Does NOT commit or push to sov.** |

Both scripts are idempotent and safe to re-run.

---

## 11. Checklist (Per Project Cycle)

- [ ] `cd <project>` (worktree or workspace root)
- [ ] `sync-sovereignty.sh` runs without errors
- [ ] Work on the task (code, tests, ephemeral `.claude/business/`, `.claude/plans/`)
- [ ] `backup-project.sh` runs and reports changes (or "no changes")
- [ ] `cd sovereignty && git diff projects/<name>/` — review every file
- [ ] Move misclassified content to correct location (or revert)
- [ ] `git add projects/<name>/ && git commit && git push`
- [ ] Next worktree/project

---

## 12. Related

- [`sovereignty-sync-strategy.md`](sovereignty-sync-strategy.md) — Repo-local PR hygiene (carrier/non-carrier cleanup)

- [`sovereignty-maintenance.md`](sovereignty-maintenance.md) — Ongoing hygiene (stale refs, .gitignore, context drift)
- [`sovereignty-replication.md`](sovereignty-replication.md) — Replicating sovereignty to a new project
- [`sovereignty-refinement.md`](sovereignty-refinement.md) — Governance: who can change sovereignty and how
- [`pattern-update-detection.md`](pattern-update-detection.md) — Detecting upstream-worthy changes during project work
