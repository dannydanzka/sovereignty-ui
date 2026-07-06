# Folder Structure Architecture

> **Module**: core/architecture
> **Version**: 5.0
> **Purpose**: Folder architecture for Code Sovereignty

---

## TL;DR

| Layer | Folder | Purpose | Content |
|-------|--------|---------|---------|
| **Entry** | `CLAUDE.md` | Entry point | Navigation + policies |
| **Root** | `sovereignty/` | Centralized root | All disciplines |
| **WHY** | `doctrine/` | Philosophy | Principles, governance |
| **WHAT** | `core/` | Cross-discipline | Universal practices |
| **HOW** | `{discipline}/` | Implementation | Stack-specific |

---

## Organization Philosophy

### 1. Full Centralization

> **"A single root directory contains all technical knowledge."**

```
.claude/
+-- CLAUDE.md           # Entry point (navigation)
+-- sovereignty/        # ALL content
```

**Benefits**:
- Easy to clone/sync
- No location ambiguity
- Scalable structure

### 2. WHY / WHAT / HOW Separation

```
sovereignty/
+-- doctrine/     # WHY - Why we do this
+-- core/         # WHAT - What practices we follow
+-- {discipline}/ # HOW - How we implement
```

| Layer | Question | Example |
|-------|----------|---------|
| **Doctrine** | Why does governance matter? | Principles, business impact |
| **Core** | What practices are universal? | Git, documentation, code review |
| **Discipline** | How do I implement in my stack? | React patterns, .NET CQRS |

### 3. Cross-Discipline vs Stack-Specific

```
core/                     # Pure cross-discipline
+-- git/                  # Applies EQUALLY to all
+-- documentation/        # Applies EQUALLY to all
+-- code-review/          # Applies EQUALLY to all
+-- architecture/         # CONCEPTS each discipline ADAPTS

frontend/                 # Stack-specific
+-- framework/            # React + Next.js stack
+-- testing/              # Vitest + RTL
+-- patterns/             # Hooks, components
```

**Rule**: If content is identical for all disciplines -> `core/`. If it requires adaptation -> `{discipline}/`.

---

## Full Structure

```
sovereignty/                          # Centralized root
|
+-- doctrine/                         # PHILOSOPHY (WHY)
|   +-- index.md                      # What is Code Sovereignty
|   +-- principles.md                 # 8 doctrinal principles
|   +-- governance-cycle.md           # Governance before/during/after
|   +-- ai-acceleration.md            # AI as governed phase
|   +-- business-impact.md            # Business impact
|   +-- governance-role.md            # Custodian role
|   +-- roles-evolution.md            # Professional transformation
|   +-- sovereignty-system-overview.md # System overview
|
+-- core/                             # CROSS-DISCIPLINE (WHAT)
|   +-- index.md                      # Core index
|   +-- git/                          # Pure cross-discipline
|   +-- documentation/                # Pure cross-discipline
|   +-- code-review/                  # Pure cross-discipline
|   +-- architecture/                 # Concepts (adapt)
|   +-- quality/                      # Concepts (adapt)
|   +-- testing/                      # Philosophy (adapt)
|   +-- workflow/                     # Universal flows
|   +-- ai/                           # AI governance
|   +-- sops/                         # Procedures
|
+-- frontend/                         # React + Next.js (HOW)
|   +-- index.md
|   +-- domain/                       # Entities, Use Cases
|   +-- infrastructure/               # Services, State, Repos
|   +-- presentation/                 # Components, Hooks, Styling
|   +-- nextjs/                       # App Router, API Routes
|   +-- auth/                         # Session, RBAC
|   +-- media/                        # Images, Uploads
|   +-- testing/                      # Vitest, RTL
|   +-- tooling/                      # ESLint, TypeScript
|   +-- framework/                    # Canonical stack
|   +-- quality/                      # React-specific anti-patterns
|
+-- mobile/                           # React Native / Expo (HOW)
+-- spa/                              # Pure React/Vite (skeleton)
+-- backend/                          # NestJS / .NET / FastAPI (skeleton)
+-- lib/                              # npm packages (skeleton)
+-- qa/                               # QA Manual + Automation (skeleton)
+-- ecommerce/                        # Shopify Hydrogen (skeleton)
+-- sre/                              # Kubernetes + GitOps (skeleton)
+-- infrastructure/                   # Terraform + Ansible (skeleton)
+-- projects/                         # Per-project backups
+-- templates/                        # Starter code (planned)
```

---

## Folder Intent

### Entry Point

| File | Intent |
|------|--------|
| `CLAUDE.md` | Entry point for Claude Code. Quick navigation, critical policies, structure. |

### Doctrine (WHY)

| File | Intent |
|------|--------|
| `index.md` | What Code Sovereignty is and isn't |
| `principles.md` | The 8 doctrinal principles |
| `governance-cycle.md` | Apply governance before/during/after |
| `ai-acceleration.md` | AI as governed acceleration, not substitute |
| `business-impact.md` | ROI of technical governance |

### Core (WHAT)

| Folder | Type | Intent |
|--------|------|--------|
| `git/` | Pure cross-discipline | Conventions ALL use equally |
| `documentation/` | Pure cross-discipline | Universal documentation standards |
| `code-review/` | Pure cross-discipline | Universal review process |
| `architecture/` | Conceptual | Principles each discipline ADAPTS |
| `quality/` | Conceptual | Code quality each discipline ADAPTS |
| `testing/` | Philosophical | Philosophy each discipline IMPLEMENTS differently |
| `workflow/` | Universal | Workflows applicable to all |
| `sops/` | Procedures | Agnostic SOPs |

### Disciplines (HOW)

Each discipline has the same internal structure:

| Subfolder | Intent |
|-----------|--------|
| `index.md` | Entry, summary, status |
| `architecture/` | Stack-specific architecture |
| `patterns/` | Implementation patterns |
| `testing/` | Testing framework and strategies |
| `framework/` | Canonical stack, tools |
| `sops/` | Stack-specific procedures |

---

## Local Replication

For projects that don't use the global configuration:

```
.claude/
+-- sovereignty/     # COPY of global structure
|   +-- doctrine/    # Only index.md (reference)
|   +-- core/        # Adapted to project
|   +-- frontend/    # Or the relevant discipline
|
+-- patterns/        # Local patterns (business)
+-- rules/           # Project rules
+-- status/          # Context snapshots
```

**Rule**: Global is reference, local is project-specific adaptation.

---

## Structure Metrics

| Metric | Value v5.0 |
|--------|------------|
| Supported disciplines | 10 (doctrine + core + 8 technical) |
| Frontend patterns | ~60 files |
| Core patterns | ~42 files |
| Doctrine | 10 files |
| Skeletons | 7 disciplines |
| Max depth | 4 levels |

---

## Related

- `core/architecture/clean-architecture.md` — Layers and boundaries
- `core/architecture/code-sovereignty.md` — 6 technical principles
- `core/documentation/index.md` — Documentation standards
- `doctrine/principles.md` — 8 doctrinal principles

---

**Version**: 5.0 | **Updated**: 2026-03-23
