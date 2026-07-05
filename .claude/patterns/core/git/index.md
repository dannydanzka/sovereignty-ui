# Git Workflow

> **Module**: core/git
> **Scope**: All disciplines

---

## TL;DR

| Practice | Rule |
|----------|------|
| **Branching** | GitFlow or Trunk-based (per project) |
| **Commits** | Conventional, atomic, descriptive |
| **PRs** | Clear description, checklist, reviews |
| **Merges** | Squash or rebase per policy |

---

## Commit Conventions

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Usage |
|------|-------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting (no logic change) |
| `refactor` | Refactoring |
| `test` | Tests |
| `chore` | Maintenance |

### Examples

```bash
feat(auth): add password reset flow
fix(payments): correct currency conversion
docs(api): update endpoint documentation
refactor(users): extract validation logic
```

---

## Branching Strategy

### GitFlow (Projects with releases)

```
main ------------------------------------------>
  |                                    |
  +-- develop -------------------------+
        |       |       |              |
        +-- feature/x   +-- release/1.0+
```

### Trunk-Based (Intensive CI/CD)

```
main ------------------------------------------>
  |       |       |       |
  +-- feat-x (short-lived)
```

---

## Pull Requests

### Minimum Checklist

- [ ] Clear change description
- [ ] Tests included/updated
- [ ] Documentation updated
- [ ] No conflicts with base
- [ ] Build/CI passing

### Template

```markdown
## Summary
[What this PR does]

## Change type
- [ ] feat
- [ ] fix
- [ ] refactor
- [ ] docs

## Checklist
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Reviewed locally
```

---

## Universal Policies

1. **NO force push to main/develop**
2. **NO direct commits to main** (use PRs)
3. **NO merge without approval** (except critical hotfix)
4. **ALWAYS review before merge**

---

## Protected-branch hook (machine-wide enforcement)

These policies are enforced mechanically by a global `pre-push` hook. It blocks
direct pushes to protected branches (`prod production master main dev qa lab`)
on **every repo on the machine** — promotion happens only via PR.

| Item | Value |
|------|-------|
| **Source of truth** | `core/git/hooks/pre-push` (this repo — governance lives here, not in a client repo) |
| **Activation** | global, via `git config --global core.hooksPath ~/.config/git/hooks` + a symlink |
| **Bypass** | `git push --no-verify` (conscious, rare) |
| **Per-repo escape** | an executable `.git/hooks/pre-push.local` is delegated to, if present |

**Exempt repos** (a protected-name branch is their normal integration branch):
edit the `EXEMPT_REMOTES` regex inside the hook. Currently: `sovereignty`,
`soverum`, `sovertainty` — each uses `dev` as its integration branch.

### Install on a new machine

```bash
cd /path/to/soberania-del-codigo
git config --global core.hooksPath ~/.config/git/hooks
mkdir -p ~/.config/git/hooks
ln -sf "$PWD/core/git/hooks/pre-push" ~/.config/git/hooks/pre-push
```

> **Why here and not in a client repo**: the guard is global and repo-agnostic, so
> its source of truth belongs in the governance repo. Keeping it inside a client
> repo (the old layout) leaked governance diffs into unrelated working trees and
> broke the global hook whenever that repo was cleaned or archived.

---

## Related

- `core/code-review/` — Review practices
- `core/documentation/` — Documentation standards
- `doctrine/governance-cycle.md` — Governance in the cycle

---

**Module**: core/git | **Scope**: All disciplines | **Updated**: 2026-03-23
