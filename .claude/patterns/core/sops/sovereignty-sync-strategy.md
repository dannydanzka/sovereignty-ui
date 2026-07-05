# SOP: Sovereignty Sync Strategy

> **PURPOSE**: Manage `.claude/` and `CLAUDE.md` files across feature branches — keep them available for all devs while minimizing PR noise
> **SCOPE**: All repositories using Sovereign Context Design
> **PREREQUISITE**: Sovereignty repo synced locally
> **UPDATED**: 2026-04-09

---

## 1. Problem Statement

Sovereignty files (`.claude/patterns/`, `.claude/rules/`, `CLAUDE.md`) are shared development infrastructure. They are:

- **Refined during feature development** — patterns improve as you build features
- **Synced across all active branches** — so every branch has the latest patterns
- **Required by all developers** — not everyone knows how to sync from sovereignty repo

This creates a conflict: the files MUST be committed (so devs have them), but they create massive noise in PR diffs when they're not identical to the main branch.

**What actually happens when you merge main:**

- Files that are **byte-identical** to main: git resolves them silently during merge, BUT they still appear in the three-dot diff (`origin/main...HEAD`) because git calculates the diff from the merge-base (the point where the branch was created), not from the merge commit
- Files that are **different** from main: remain in the diff with real changes
- Files that are **new** (don't exist in main): remain in the diff as additions

**Bottom line**: Merging main does NOT automatically clean the diff. Manual intervention is ALWAYS required.

---

## 2. Strategy: Commit Everything + Clean Before PR Review

### Principle

All sovereignty files are committed to every feature branch. Any developer who clones any branch gets the full sovereignty context. No sync scripts required.

### The tradeoff

- During development: sovereignty files are committed freely — no restrictions
- Before PR review: a single cleanup step aligns sovereignty with main so the PR only shows feature code

---

## 3. File Classification

| Directory | Purpose | Committed? | In PR diff? |
|-----------|---------|------------|-------------|
| `.claude/patterns/` | Architecture, quality, testing, SOPs, doctrine | Yes | **No** — cleaned before review |
| `.claude/rules/` | Project-specific rules (auto-loaded by Claude) | Yes | **No** — cleaned before review |
| `.claude/.sovereignty-version` | Sovereignty version marker | Yes | **No** — cleaned before review |
| `CLAUDE.md` | Project root configuration | Yes | **No** — cleaned before review |
| `.claude/business/` | Task-specific business context | Yes | **Yes** — removed before main merge |
| `.claude/plans/` | Task-specific implementation plans | Yes | **Yes** — removed before main merge |
| `.claude/status/` | Code state snapshots | Yes | **Yes** — removed before main merge |

---

## 4. Workflow

### 4.1 During Feature Development — Single Commit Rule

Sovereignty files MUST live in a **single, exclusive commit** per branch. Never mix sovereignty files with feature code in the same commit. Never spread sovereignty across multiple commits.

**Workflow**:

1. Sovereignty repo syncs to all active feature branches
2. Stage ONLY sovereignty files and commit them in ONE commit:

```bash
git add .claude/patterns/ .claude/rules/ .claude/.sovereignty-version CLAUDE.md
git commit -m "chore: sovereignty sync"
```

3. All feature code goes in separate commits — never mixed with sovereignty
4. When sovereignty is refined and re-synced, **revert the old commit and create a new one**:

```bash
git log --oneline | grep "sovereignty sync"
git revert <sovereignty-commit-hash> --no-edit
git add .claude/patterns/ .claude/rules/ .claude/.sovereignty-version CLAUDE.md
git commit -m "chore: sovereignty sync"
```

### 4.2 Designating the Sovereignty Carrier

Before merging to main, choose **ONE feature branch** per merge cycle to carry sovereignty updates. This is "the carrier."

| Branch role | Sovereignty files in PR | Action before merge |
|-------------|------------------------|---------------------|
| **Carrier** (1 branch) | YES — carries updates to main | Clean task-specific files only |
| **Non-carrier** (all others) | NO — cleaned to match main | Run cleanup command (Section 5) |

### 4.3 Carrier Branch — Merge to Main

1. Sync sovereignty from the sovereignty repo (get latest)
2. Commit sovereignty files normally
3. Remove task-specific files:

```bash
git rm -r .claude/business/ .claude/plans/ .claude/status/ 2>/dev/null
git commit -m "chore: remove task-specific context before main merge"
```

4. Push and create PR — sovereignty files as changes is expected
5. Add to PR description: "This PR carries sovereignty sync to main"

### 4.4 Non-Carrier Branches — Clean PR Diff

After the carrier merges to main, all other branches must:

1. Pull main
2. Run the cleanup command (Section 5)
3. Push

---

## 5. Cleanup Command — The Core Procedure

### Step 1: Pull main

```bash
git fetch origin main
git merge origin/main --no-edit
```

### Step 2: Reset sovereignty files to main's version

```bash
git checkout origin/main -- .claude/patterns/ .claude/rules/ .claude/.sovereignty-version CLAUDE.md
```

### Step 3: Commit and push

```bash
git commit -m "chore: align sovereignty files with main"
git push origin HEAD
```

### Step 4: Verify

```bash
# Should return 0 shared sovereignty files
git diff origin/main...HEAD --name-only | grep -E '\.claude/(patterns|rules)/|\.sovereignty-version|^CLAUDE\.md' | wc -l
```

### One-liner version

```bash
git fetch origin main && git merge origin/main --no-edit && git checkout origin/main -- .claude/patterns/ .claude/rules/ .claude/.sovereignty-version CLAUDE.md && git commit -m "chore: align sovereignty files with main" && git push origin HEAD
```

---

## 6. Merge Conflicts in Sovereignty Files

When pulling main, conflicts may arise. Resolution: **always accept main's version**.

```bash
git checkout --theirs .claude/patterns/ .claude/rules/ CLAUDE.md 2>/dev/null
git add .claude/patterns/ .claude/rules/ CLAUDE.md
git commit --no-edit
```

Then proceed with cleanup (Section 5, Step 2 onward).

---

## 7. Edge Cases

| Scenario | Action |
|----------|--------|
| Main has NO sovereignty files yet | Create dedicated branch `chore/sovereignty-initial-setup`, sync, merge to main |
| New branch created AFTER sovereignty is in main | Files inherited automatically — no setup needed |
| Multiple features ready to merge simultaneously | Pick ONE carrier. Merge first. Others pull main + cleanup |
| Sovereignty diverged between branches | Re-sync all branches from sovereignty repo (single source of truth) |

---

## 8. Summary

| Question | Answer |
|----------|--------|
| Are sovereignty files committed? | **Yes** — every branch, every dev has them |
| Do they appear in PR diffs? | **No** — cleaned before review (non-carrier) or expected (carrier) |
| Is cleanup automatic? | **No** — requires running Section 5 manually |
| Does merging main clean the diff? | **No** — you MUST run `git checkout origin/main --` after merge |
| Can I use `.gitignore`? | **No** — files must be tracked so all devs have them |
| How many carriers per merge cycle? | **One** — exactly one branch carries sovereignty to main |
| How many sovereignty commits per branch? | **One** — single exclusive commit, never mixed with feature code |
