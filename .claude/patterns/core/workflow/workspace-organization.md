# Workspace Organization

> **Module**: core/workflow
> **Scope**: Cross-discipline — recommended conventions for local project structure
> **Updated**: 2026-03-11

---

## Principle

> Every developer organizes their own workspace. This document defines a **recommended convention** that optimizes for multi-company, multi-platform, multi-ticket workflows. It is not mandatory, but adopting it ensures AI tools and scripts work predictably.

---

## Recommended Structure

```
~/Documents/
├── {company}/                          # Company boundary
│   ├── sovereignty/                    # Governance repo (one per company group)
│   ├── {platform}/                     # Platform boundary (web, mobile, backend)
│   │   ├── {repo-base}/               # Base clone (main/develop, always clean)
│   │   ├── {repo-disposable}/         # Disposable clone for merges/QA
│   │   ├── {TICKET-KEY}/              # Feature clone (one per Jira ticket)
│   │   ├── {long-lived-feature}/      # Long-lived feature branches
│   │   └── ...
│   ├── skills/                         # Technical evaluations, exercises
│   └── reports/                        # Reports, audits
├── {company-2}/                        # Second company (same structure)
│   ├── {platform}/
│   └── ...
└── {personal}/                         # Personal projects (separate context)
```

---

## Directory Types

### Base Clone (`{repo-base}`)

The reference clone. Always on `main` or `develop`. Used for:
- Reading current state of the codebase
- Running comparisons (`git diff`)
- Pulling latest changes
- Reference for AI context

```bash
# Example: keep base clone always updated
cd ~/Documents/{company}/web/{repo-base}
git checkout develop && git pull
```

**Rules:**
- NEVER commit directly here
- NEVER switch branches here (use ticket clones)
- Keep it clean — `git status` should always be empty

### Disposable Clone (`{repo-disposable}`)

A temporary clone used exclusively for branch operations: merges, QA branch creation, release preparation. Destroyed and recreated for each operation.

```bash
# Destroy and recreate before each merge operation
rm -rf ~/Documents/{company}/web/{repo-disposable}
git clone git@bitbucket.org:{workspace}/{repo}.git ~/Documents/{company}/web/{repo-disposable}
cd ~/Documents/{company}/web/{repo-disposable}
```

**Rules:**
- ALWAYS destroy before reuse — never reuse an existing disposable
- Only used for git operations (merge, cherry-pick, release cuts)
- No feature development here

### Ticket Clone (`{TICKET-KEY}`)

One clone per Jira ticket. This is where actual development happens.

```bash
# Create ticket directory and clone
mkdir -p ~/Documents/{company}/web/{TICKET-KEY} && cd $_
git clone git@bitbucket.org:{workspace}/{repo}.git .
git checkout -b feature/{TICKET-KEY}-brief-description
```

**Rules:**
- One ticket = one directory = one feature branch
- Directory name matches Jira ticket key (e.g., `PLUS-9210`)
- Can have multiple ticket clones active simultaneously
- Delete after PR is merged (optional, for disk space)

### Long-Lived Feature (`{feature-name}`)

For features that span multiple tickets or weeks.

```bash
mkdir -p ~/Documents/{company}/web/{feature-name} && cd $_
git clone git@bitbucket.org:{workspace}/{repo}.git .
git checkout feature/{feature-name}
```

---

## Platform Conventions

| Platform | Directory | Contains |
|----------|-----------|----------|
| `web/` | Web frontend projects | Next.js, Lerna monorepos, NX workspaces |
| `mobile/` | Mobile projects | React Native apps |
| `backend/` | Backend services | .NET, Node.js APIs |
| `infra/` | Infrastructure | Terraform, Ansible, Kubernetes |

---

## Multi-Company Setup

When working across multiple companies, each company gets its own root directory:

```
~/Documents/
├── {company-1}/                    # Company 1
│   ├── sovereignty/                # Shared governance
│   ├── web/                        # Web projects
│   └── mobile/                     # Mobile projects
├── {company-2}/                    # Company 2
│   ├── web/
│   └── mobile/
└── {personal}/                     # Personal (separate sovereignty context)
```

**Key rule**: The sovereignty repo lives at the company group level, not inside a platform directory. It serves all platforms.

---

## Sovereignty Repo Location

```
~/Documents/{company}/sovereignty/

# NOT inside a platform:
# ~/Documents/{company}/web/sovereignty/     ← WRONG
# ~/Documents/{company}/mobile/sovereignty/  ← WRONG
```

The sovereignty repo is **cross-platform** — it serves web, mobile, backend, etc. It sits at the company level.

---

## AI Tool Integration

This workspace convention enables:

| Benefit | How |
|---------|-----|
| **Consistent paths** | `bootstrap-project.sh` and `sync-sovereignty.sh` know where to find sovereignty |
| **Parallel work** | Multiple ticket clones open simultaneously in different terminals |
| **Clean context** | Each ticket clone has its own `.claude/` context, no cross-contamination |
| **Easy cleanup** | Delete ticket directory after merge — no orphan branches |
| **Base reference** | AI can always read the base clone for current codebase state |

---

## Quick Setup for New Developer

```bash
# 1. Create company structure
mkdir -p ~/Documents/{company}/{web,mobile}

# 2. Clone sovereignty
git clone git@bitbucket.org:{workspace}/sovereignty.git ~/Documents/{company}/sovereignty

# 3. Clone base repos
git clone git@bitbucket.org:{workspace}/{web-repo}.git ~/Documents/{company}/web/{web-repo-base}
git clone git@bitbucket.org:{workspace}/{mobile-repo}.git ~/Documents/{company}/mobile/{mobile-repo-base}

# 4. Start working on a ticket
mkdir -p ~/Documents/{company}/web/PLUS-1234 && cd $_
git clone git@bitbucket.org:{workspace}/{web-repo}.git .
~/Documents/{company}/sovereignty/bootstrap-project.sh "Project Name" "Description"
```

---

## Related

- `core/git/index.md` — Git workflow, branching, PRs
- `core/sops/feature-delivery-workflow.md` — End-to-end feature delivery
- `ONBOARDING.md` — New team member guide
