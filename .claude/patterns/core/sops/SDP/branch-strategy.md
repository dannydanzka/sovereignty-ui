# SDP Step 10: Branch Strategy

> **Input**: Validated code ready to deliver
> **Output**: Branch pushed, conflict-free path to target

---

## Procedure

### 10.1 Push feature branch

```bash
git push -u origin feature/TICKET-ID-description
```

### 10.2 Check for conflicts

```bash
git fetch origin qa
git merge origin/qa --no-edit --no-commit
```

| Result | Action |
|--------|--------|
| Clean merge | Abort (`git merge --abort`), PR directly from feature branch |
| Conflicts | Create sacrifice branch |

### 10.3 Sacrifice branch (only if conflicts)

**Naming**: `<target>-<source-branch>`

```bash
# Create from target, merge source
git checkout origin/qa -b qa-feature/TICKET-ID-description
git merge origin/feature/TICKET-ID-description --no-edit
# Resolve conflicts — ALWAYS additive (keep both sides)
git push -u origin qa-feature/TICKET-ID-description
```

**Conflict resolution**: MANUAL only. NEVER use `--theirs`, `--ours`, `-X theirs`, or `-X ours`.

### 10.4 Update existing PR (if PR already exists)

If a PR was already created and now needs sacrifice branch:

```
pr_update → /repositories/{workspace}/{repo}/pullrequests/{id}
  body: {
    "source": {"branch": {"name": "qa-feature/TICKET-ID-description"}},
    "close_source_branch": true
  }
```

**NEVER decline a PR** — declining creates unnecessary history and loses comments/approvals.

### 10.5 Contamination prevention

```bash
# CORRECT — always rebuild from origin
git checkout origin/<target> -b <target>-<source-branch>

# WRONG — local branch may have prior merges
git checkout <target>
git checkout -b <target>-<source-branch>
```

---

## Branch Hierarchy

```
Simple:    feature/TICKET-ID → qa → master
Release:   feature/* → release/X → qa → master
```

**Default PR target**: `qa` (never assume master)

---

## Rules

- NEVER decline PRs — use `pr_update` to update
- Sacrifice branch naming: `<target>-<source-branch>` (never `sacrifice/`)
- Merges are ALWAYS additive — keep both sides
- Always rebuild from `origin/<target>` (avoid contamination)
- `close_source_branch: true` for sacrifice branches
- `close_source_branch: false` for feature branches
