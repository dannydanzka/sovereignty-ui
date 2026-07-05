# SOP: Workspace Governance Pattern

> **PURPOSE**: Host sovereignty (`.claude/` + `CLAUDE.md`) at a **workspace layer above the product repos** so inner repos stay clean of governance files
> **SCOPE**: Multi-repo workspaces where exposing `.claude/` inside the vendor / product repo is undesirable (audit contexts, closed-source consumers, multi-workspace orchestration)
> **COMPANION TO**: [`sovereignty-sync-strategy.md`](sovereignty-sync-strategy.md) — repo-local strategy (sovereignty lives inside each feature branch)
> **UPDATED**: 2026-04-23

---

## 1. Two Distribution Models

Sovereignty supports **two mutually exclusive** distribution strategies per project. Pick one per workspace; do not mix.

| Model | Where `.claude/` lives | Best for | Reference SOP |
|-------|------------------------|----------|---------------|
| **Repo-local** | Inside each feature branch / worktree of the product repo | Team distribution — every dev cloning any branch gets sovereignty automatically | [`sovereignty-sync-strategy.md`](sovereignty-sync-strategy.md) |
| **Workspace-governance** | In a parent folder that wraps one or more product repos — tracked by its OWN governance-only git repo | Solo / restricted work where the product repo must not carry `.claude/` (audits, vendor handovers, air-gapped reviews) | this SOP |

### Decision matrix

Choose **workspace-governance** when any of these apply:

- The product repo is vendor-owned or cross-org and `.claude/` would be rejected in PR review
- You run multiple cloned repos side-by-side from one workspace (web + mobile + references)
- You need a single governance timeline that spans all platforms under a project
- Exposure of internal tooling in the product repo is an operational / contractual concern

Choose **repo-local** when:

- The team needs every clone/branch to include sovereignty without extra steps
- CI or tooling depends on `.claude/rules/` being inside the product repo
- The repo is owned by your organization and governance noise is acceptable

---

## 2. Workspace-Governance Topology

```
<workspace>/                        ← its OWN git repo (governance-only)
├── .git/                           ← tracks ONLY .claude/ + CLAUDE.md
├── .gitignore                      ← whitelist: ignore everything except sovereignty
├── CLAUDE.md                       ← workspace entry point
├── .claude/                        ← synced from sovereignty + project-owned folders
│   ├── patterns/                   ← sovereignty (synced)
│   ├── rules/                      ← project-specific (synced from sovereignty/projects)
│   ├── business/ · plans/ · status/ · docs/   ← per-ticket or per-workspace context
│   └── secrets/                    ← gitignored credentials vault
├── <repo-a>/                       ← real product repo, git-ignored at workspace level
├── <repo-b>/                       ← real product repo, git-ignored at workspace level
└── <docs-or-ref>/                  ← gitignored, workspace-local material
```

### Key invariants

1. **Workspace is a git repo.** It has `.git/`, a remote (usually Bitbucket), and commits trace governance evolution.
2. **Whitelist `.gitignore`.** Ignore `/*` first, then un-ignore only `.claude/` and `CLAUDE.md`. This makes accidental commits of product code impossible.
3. **Inner repos stay virgin.** Never create gitlinks/submodules to them. They are ignored, not nested.
4. **No `.claude/` inside inner repos.** If a dev accidentally creates one, `.gitignore` in the inner repo must forbid it.
5. **Sync runs from workspace root.** `sync-sovereignty.sh` is executed from `<workspace>/`, not from any inner repo.

---

## 3. Bootstrap — Convert a Workspace to Governance Mode

### Step 1: Initialize the workspace repo

```bash
cd ~/Documents/<workspace>
git init -b main
git remote add origin git@bitbucket.org:<org>/<workspace>-governance.git
```

### Step 2: Write the whitelist `.gitignore`

```gitignore
# Whitelist: ignore everything, then un-ignore governance.
/*
!/.gitignore
!/.claude/
!/CLAUDE.md

# macOS cruft
.DS_Store

# Claude runtime noise inside .claude/
.claude/cache/
.claude/debug/
.claude/paste-cache/
.claude/shell-snapshots/
.claude/statsig/
.claude/telemetry/
.claude/todos/
.claude/projects/
.claude/file-history/
.claude/backups/
.claude/stats-cache.json
.claude/mcp-needs-auth-cache.json
.claude/history.jsonl
.claude/scheduled_tasks.lock

# Credentials — never commit
.claude/secrets/
```

### Step 3: Create the entry `CLAUDE.md`

Document what the workspace aggregates, which inner repo is the current active target, and the rule that **root commits are governance-only**. See [`~/Documents/your-company/CLAUDE.md`](../../) as a reference implementation.

### Step 4: First sync

```bash
~/Documents/proyectos/sovereignty/soberania-del-codigo/sync-sovereignty.sh
```

Select the discipline (e.g., `your-fullstack` for web+mobile, or any per-platform discipline). The script auto-detects the workspace via `.claude/` + `CLAUDE.md` and runs in UMBRELLA mode when `.git` is absent; for governance repos (`.git` present, tracking only `.claude/`) the normal preflight passes.

### Step 5: Initial commit

```bash
git add .gitignore CLAUDE.md .claude/
git commit -m "chore: init root tracking for .claude/ and CLAUDE.md"
git push -u origin main
```

---

## 4. Operating Rules

### 4.1 Commits at workspace root

- **Allowed**: changes to `.claude/` or `CLAUDE.md`
- **Forbidden**: anything under inner repo folders (they're gitignored; new files there silently won't be tracked, which is correct)
- Commit messages follow [`core/git/commits.md`](../git/commits.md)

### 4.2 Product code

- Commit inside the respective inner repo (`<workspace>/<repo-a>/`), following its own git workflow
- Never cross-commit workspace governance with product code — they live in different repos

### 4.3 Upstream to sovereignty

- `backup-project.sh` (run from workspace root) copies `.claude/rules/` and `patterns/business/` into `sovereignty/projects/<workspace>/`
- `sync-sovereignty.sh` upstream triage (v6.0.0+) detects local pattern changes and offers per-file routing (universal / project overlay / keep-local)
- Same mechanics as repo-local — the workspace layer does not change the upstream flow

### 4.4 Task context organization

Per-ticket folders live **inside the workspace `.claude/`**, not per-repo:

```
.claude/business/JAF-1234/
.claude/plans/PLAN-JAF-1234.md
.claude/status/JAF-1234-YYYY-MM-DD.md
```

If multiple inner repos participate in the same ticket (web + mobile), one ticket folder covers both.

---

## 5. Migration — Repo-Local → Workspace-Governance

Only do this when the distribution tradeoff has changed (team shrank, repo went vendor, exposure became unacceptable).

1. Decide the new workspace root (e.g., `~/Documents/<org>/`)
2. Follow Section 3 bootstrap
3. Move any per-ticket `.claude/business/`, `plans/`, `status/` from the product repo's `.claude/` into the workspace `.claude/`
4. In the product repo: remove `.claude/` from tracking (`git rm -r --cached .claude/`), add `.claude/` to its `.gitignore`, commit
5. Run `sync-sovereignty.sh` from the new workspace root to populate `patterns/` and `rules/`
6. Update project backup in `sovereignty/projects/<name>/.project-id` to reflect the new root

## 6. Anti-Patterns

- **Gitlinks/submodules for inner repos.** Never. Inner repos are independent; whitelist gitignore keeps them decoupled.
- **Mixing models.** A project is either repo-local or workspace-governance. Having `.claude/` in both the workspace AND inside each repo creates drift and ambiguity about which is the source of truth.
- **Committing inner-repo paths at workspace level.** If `.gitignore` accidentally allows it, `git status` will show inner product files. Fix the whitelist; never commit them.
- **Running `sync-sovereignty.sh` inside an inner repo.** It will create a stray `.claude/` there. Always run from workspace root.

---

## 7. Reference Implementations

| Workspace | Pattern | Notes |
|-----------|---------|-------|
| `~/Documents/your-company/` | Workspace-governance | Wraps `web/audit`, `web/jf-frontend-web`, `mobile/audit`; discipline `your-fullstack` |
| `~/Documents/proyectos/TASK-IDXXXX/` | Repo-local (worktree per ticket) | One branch = one worktree = one `.claude/`; team distribution |

## 8. Related

- [`sovereignty-sync-strategy.md`](sovereignty-sync-strategy.md) — repo-local PR hygiene (carrier/non-carrier, cleanup command)
- [`sovereignty-replication.md`](sovereignty-replication.md) — standing up a new project (either model)
- [`sovereignty-maintenance.md`](sovereignty-maintenance.md) — ongoing hygiene
- `sync-sovereignty.sh` (repo root) — supports both models; UMBRELLA mode preflight for workspaces without `.git`
