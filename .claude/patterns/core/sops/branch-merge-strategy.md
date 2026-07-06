# SOP: Branch & Merge Strategy

> **PURPOSE**: Branch hierarchy, merge procedures, and PR discipline for shared environment branches
> **SCOPE**: Multi-environment repositories with layered release branches (feature → integration → qa → production)
> **UPDATED**: 2026-04-19

---

## 1. Branch Hierarchy

Hierarchy depends on release complexity:

```
Simple:    feature/TICKET-ID → qa → main
Release:   feature/* ──┐ merge → release/X → qa → main
Layered:   release/X → release/X-<variant> → qa → main
```

**Rules**: Features are independent. Release branches accumulate (features merge IN). Flow is one-directional (towards qa/main). Never merge main INTO release branches.

---

## 2. Workspace Rules

- **One folder = one branch** — NEVER checkout a different branch in a named worktree folder
- **Branch operations ONLY in the primary worktree** — checkouts, merges, switches MUST happen there
- **Named worktree folders are IMMUTABLE** — a folder named after a branch stays on that branch forever

---

## 3. No Direct Merges to Shared Branches

**NEVER** merge directly (git merge + push) into `dev`, `qa`, `lab`, `staging`, `prod`, or `main`. ALL changes to shared branches MUST go through a Pull Request with reviewers.

Direct merges bypass code review, break traceability, and risk introducing unreviewed code into shared environments.

---

## 4. Merge Procedure (for local/sacrifice branches only)

```bash
git checkout <target-branch> && git pull origin <target-branch>
git merge origin/<source-branch> --no-edit
```

**Conflict resolution**: Merges are additive — keep ALL exports, keys, reducers, forks from both sides.

---

## 5. Propagation (MANDATORY)

Every commit MUST propagate through the full chain. Never skip levels:

```
Push feature → merge into release → merge into release variant → PR to qa
```

---

## 6. PR to Shared Branches

### Reviewers (REQUIRED)

Every PR to a shared branch must declare required reviewers. Maintain the reviewer list (names, roles, user IDs) in a project-local `.claude/rules/reviewers.md` file — never hardcode in sovereignty.

### Decision: Is a sacrifice branch needed?

```
Attempt merge: git merge origin/<source-branch> --no-edit
       ↓
Conflicts?
  NO  → Direct PR from <source-branch>  (Normal Procedure)
  YES → Sacrifice branch <target>-<source-branch>  (Sacrifice Procedure)
```

**Rule**: The prefixed branch (`<target>-<source-branch>`) is EXCLUSIVE for conflict resolution. If there are no conflicts, the PR comes directly from the original branch. NEVER create a sacrifice branch preventively.

---

### Normal Procedure — Direct PR (no conflicts)

```
POST /repositories/{workspace}/{repo}/pullrequests
  body: {
    "title": "[<TARGET>][<Type>][<Module>] - TICKET-ID: Description",
    "source": {"branch": {"name": "<source-branch>"}},
    "destination": {"branch": {"name": "<target>"}},
    "reviewers": [...],
    "close_source_branch": false   ← DO NOT close the original branch
  }
```

**PR Title Reference**

`<Type>` — always in English:

| Type | When to use |
|------|-------------|
| `Feature` | New feature or functionality |
| `BugFix` | Bug fix (non-urgent) |
| `Hotfix` | Urgent bug fix going directly to production |
| `Refactor` | Code restructuring without behavior change |
| `Chore` | Build, dependencies, tooling, sovereignty sync |
| `Test` | Adding or updating tests |
| `Doc` | Documentation only |

`<Module>` — Project-specific module name. Maintain the module → package mapping in a project-local `.claude/rules/modules.md` — never in sovereignty.

---

### Sacrifice Procedure — Only when conflicts exist

**Step 1**: Check if a sacrifice branch with an open PR already exists

```
GET /repositories/{workspace}/{repo}/pullrequests
  queryParams: {"q": "source.branch.name=\"<target>-<source-branch>\" AND state=\"OPEN\""}
```

| Sacrifice PR | Action |
|--------------|--------|
| **OPEN** | Procedure A — update existing branch |
| **Not found** | Procedure B — create new sacrifice branch |

**Step 2A — Update existing sacrifice branch (OPEN)**

```bash
cd /tmp && git clone <repo-url> tmp-clone && cd tmp-clone
git checkout <target>-<source-branch>
git merge origin/<source-branch> --no-edit
# ADDITIVE — resolve conflicts manually. See Section 8.
git push origin <target>-<source-branch>
cd /tmp && rm -rf tmp-clone
```

**Step 2B — Create new sacrifice branch (not found)**

```bash
cd /tmp && git clone <repo-url> tmp-clone && cd tmp-clone
git checkout origin/<target> -b <target>-<source-branch>
git merge origin/<source-branch> --no-edit
# ADDITIVE — resolve conflicts manually. See Section 8.
git push -u origin <target>-<source-branch>
cd /tmp && rm -rf tmp-clone
```

Then create the PR from the sacrifice branch:

```
POST /repositories/{workspace}/{repo}/pullrequests
  body: {
    "title": "[<TARGET>][<Type>][<Module>] - TICKET-ID: Description",
    "source": {"branch": {"name": "<target>-<source-branch>"}},   ← sacrifice branch
    "destination": {"branch": {"name": "<target>"}},
    "reviewers": [...],
    "close_source_branch": true   ← DO close the sacrifice branch on merge
  }
```

If a direct PR from the original branch already exists with conflicts → **update its source branch** to the sacrifice branch via API. NEVER decline PRs — declining loses comments, approvals, and history.

```
PUT /repositories/{workspace}/{repo}/pullrequests/{id}
  body: {
    "source": {"branch": {"name": "<target>-<source-branch>"}}
  }
```

This preserves the PR ID, title, description, comments, and reviewer activity.

---

## 7. PR Title Convention

**Format**: `[<TARGET>][<Type>][<Module>] - <TICKET-IDs>: <Description>`

`<Description>` — Use the **ticket title** (business context), NOT a technical summary of changes. The PR description body is where technical details go.

```
✅ [QA][Feature][Orders] - TICKET-1234: Show promotional gifts in order detail
❌ [QA][Feature][Orders] - TICKET-1234: Unified GiftsContainer + JS→TS migration
```

PR description template: see `core/sops/pr-documentation.md`

---

## 8. Conflict Resolution Protocol

**Context**: Target branches (lab, qa, main) are cleaned before each cycle. A conflict during merge means **another feature recently merged also touched the same files**. Both sets of changes are valid.

**Rule**: Merges are ALWAYS additive. Never discard either side.

### Process

```bash
# When git reports conflicts:
git status  # Identify conflicted files

# For each conflicted file:
# 1. Open the file
# 2. Identify WHAT each side added (don't assume one side is "wrong")
# 3. Combine both sets of changes manually
# 4. git add <file>
git merge --continue
```

### Anti-patterns (NEVER do)

```bash
# ❌ WRONG — discards the other feature's changes
git checkout --theirs <file>
git checkout --ours <file>

# ❌ WRONG — PR branch built from a local branch that already has another feature merged
# (contaminates PR with foreign commits)

# ❌ WRONG — sacrifice branch naming
sacrifice/TICKET-1234-to-qa        # Wrong prefix
qa/feature/TICKET-1234             # Wrong format

# ✅ CORRECT — sacrifice branch naming: <target>-<source-branch>
qa-feature/TICKET-1234-device-identification
```

### PR Management (NEVER do)

| Anti-Pattern | Correct |
|--------------|---------|
| Decline a PR to fix mistakes (title, source branch, description) | Use API `PUT` to update the existing PR — preserves history, comments, approvals |
| Create a new PR when the old one has issues | Update the existing PR via API |
| Name sacrifice branch with `sacrifice/` prefix | Use `<target>-<source-branch>` convention |

### Why never merge qa into a feature branch

Merging qa into a feature branch introduces ALL commits from other features into your branch history. This:
1. **Contaminates** the feature branch with unrelated code
2. **Makes reverts impossible** — you can't cleanly undo the merge without losing your own work
3. **Breaks branch isolation** — the feature branch is no longer independent
4. **Creates cascading conflicts** — future merges become unpredictable

The sacrifice branch pattern exists specifically to avoid this. Conflicts are resolved in a disposable branch, never in the feature branch.

### Sacrifice branch vs feature branch — key distinction

| Aspect | Feature branch | Sacrifice branch |
|--------|----------------|------------------|
| Lifetime | Permanent (until merged) | Disposable (deleted after merge) |
| Direction | Feature code flows OUT | qa + feature merge IN |
| PR | Stays open, pointing to feature | NEW PR, `close_source_branch: true` |
| Conflicts | NEVER resolved here | Resolved HERE |
| qa merge | NEVER | Always (it's based on qa) |

### Post-resolution verification (MANDATORY)

After resolving conflicts — whether manually or via `--ours`/`--theirs` — **always verify every resolved file** before committing:

```bash
# Check for leftover conflict markers in ALL staged files
git diff --cached --name-only | xargs grep -l '<<<<<<<\|=======\|>>>>>>>' 2>/dev/null

# If the command returns ANY files, the resolution is incomplete
```

**Why this is mandatory**: `git checkout --ours` and `git checkout --theirs` do NOT always produce clean files, especially with rename/rename conflicts. Git may combine content from both sides and leave conflict markers embedded in the result. Committing without verifying pushes broken files to the branch.

**Rule**: Zero trust in automated resolution. Verify before commit. Always.

### Contamination prevention

When creating multiple PR branches in the same session, always start from remote:

```bash
# ✅ CORRECT — always rebuild from origin
git checkout origin/<target> -b <target>-<source-branch>

# ❌ WRONG — local branch may have prior merges
git checkout <target>
git checkout -b <target>-<source-branch>
```

---

## 9. Release Branch Risks (Lessons Learned)

Risks observed during release cycles with a layered hierarchy (`feature/* → release/X → release/X-<variant> → qa → main`).

### Main merge shifts merge-base

When a variant release branch (e.g., `release/X-sox`) merges main but its parent (`release/X`) does NOT, the merge-base between the two release branches shifts. This causes **phantom conflicts** — files that both branches have identically still appear as conflicted because git calculates the diff from different merge-bases.

**Prevention**: When merging main into a layered branch, merge it into ALL levels of the hierarchy, not just one. Or avoid merging main into release branches at all until the final PR to qa.

### Re-merge conflicts on shared files

When features that were already merged into a release branch (via different paths) are merged again, shared files like `es.json`, `index.ts`, and reducer barrel files will conflict on every merge. These conflicts are technically "already resolved" but git cannot detect this.

**Prevention**: Keep barrel files and i18n files as minimal as possible. When resolving these re-merge conflicts, the correct resolution is always **additive** — keep all entries from both sides, deduplicate if needed.
