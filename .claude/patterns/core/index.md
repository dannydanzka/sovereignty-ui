# Core — Cross-Discipline Practices

> **Module**: sovereignty/core
> **Scope**: Agnostic — applies to ALL disciplines
> **Philosophy**: Contextual precision, not information hoarding
> **Updated**: 2026-03-16

---

## Structure

### Transversal (applies equally to all disciplines)

| Directory | Content | Description |
|-----------|---------|-------------|
| [git/](git/) | Workflow, commits, branches, PRs | Git conventions |
| [documentation/](documentation/) | Documentation standards | README, API docs, CLAUDE.md |
| [code-review/](code-review/) | Review practices | Checklist, feedback, process |

### Conceptual Guide (each discipline adapts)

These patterns are **conceptual** — each discipline implements with its own tools and frameworks:

| Directory | Patterns | Description |
|-----------|----------|-------------|
| [architecture/](architecture/) | 4 | Structural principles (Clean Arch, modularization) |
| [quality/](quality/) | 7 | Code quality (naming, error-handling, type-safety, comments, anti-patterns) |
| [testing/](testing/) | 2 | Testing philosophy (value > coverage, mocking) |
| [workflow/](workflow/) | 8 | Developer workflows (investigation-first, context-first, context-budget) |
| [ai/](ai/) | 15+ | AI governance, adoption research, usage policy, strategy |
| [sops/](sops/) | 16 | Standard operating procedures |

---

## Workflow Patterns

| Pattern | Purpose | When |
|---------|---------|------|
| `investigation-first.md` | Research before creating | Before any implementation |
| `context-first.md` | Read snapshots before code | Entering a context |
| `context-budget.md` | Manage auto-loaded context in `rules/` | Adding/auditing `.claude/rules/` |
| `plan-verification.md` | Verify plans against code | Before eliminating plans |
| `todo-management.md` | Effective TODO management | Leaving pending work |
| `no-reinventing-wheel.md` | Search existing first | Before creating components |
| `code-elevation.md` | Elevate local code to global | Detecting reusable code |
| `execution-discipline.md` | Execute without evasion or over-verification | High-volume tasks (lint, refactors, migrations) |

---

## Quality Patterns

- `naming.md` — Naming conventions
- `error-handling.md` — Consistent error handling
- `comments-policy.md` — When to comment
- `code-size-limits.md` — File/function limits
- `type-safety.md` — Strict typing
- `anti-patterns.md` — What to avoid
- `dead-code-prevention.md` — Prevent dead code

---

## Architecture Patterns

| Discipline | Architecture |
|------------|--------------|
| Frontend | Clean Architecture + App Router |
| SPA | Clean Architecture + Vite |
| Mobile | Clean Architecture + React Native |
| Backend (.NET) | Clean Architecture + CQRS |
| QA Automation | Page Object Model (POM) |
| Infrastructure | IaC patterns |
| SRE | GitOps patterns |

Core patterns:
- `code-sovereignty.md` — 6 sovereignty principles
- `clean-architecture.md` — Layers and boundaries
- `modularization.md` — File organization

---

## SOPs

See [sops/index.md](sops/index.md) for the full inventory (15 SOPs across 4 categories).

Key SOPs:
- `feature-delivery-workflow.md` — End-to-end: ticket → code → PR → review
- `sovereignty-maintenance.md` — Ongoing hygiene: stale refs, .gitignore, context drift
- `sovereignty-replication.md` — Replicate sovereignty to a new project
- `api-testing.md` — API testing with curl
- `code-audit.md` — Post-implementation validation (TS → lint → tests → build → structural)
- `pr-documentation.md` — PR template

---

## Usage

### For new projects

1. Apply **transversal** (git, documentation, code-review) as-is
2. Adapt **conceptual guide** to your specific discipline
3. Consult `{discipline}/` for concrete implementation

### By discipline

```
Frontend    → frontend/
SPA         → spa/
Mobile      → mobile/
Backend     → backend/
Lib         → lib/
QA          → qa/
Infra       → infrastructure/
SRE         → sre/
E-commerce  → ecommerce/
```

---

## Related

- `doctrine/` — Philosophy and principles
- `frontend/` — Next.js SSR implementation
- `mobile/` — React Native / Expo implementation
- `projects/` — Per-project backups

---

**Total**: 3 transversal + 8 workflow + 7 quality + 4 architecture + 2 testing + 16 SOPs + 15 AI | **Updated**: 2026-03-23
