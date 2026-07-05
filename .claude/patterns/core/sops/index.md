# SOPs Index

> **Purpose**: Standard Operating Procedures — step-by-step guides for recurring tasks
> **Scope**: 100% agnostic (reusable across all projects and disciplines)
> **Updated**: 2026-04-09

---

## What are SOPs?

**SOPs (Standard Operating Procedures)** are step-by-step procedural guides for tasks that:
- Are performed repeatedly across projects
- Require consistent execution
- Benefit from a documented checklist

### SOPs vs Other Documentation

| Layer | Purpose | Format |
|-------|---------|--------|
| **Rules** | WHEN/WHERE — routing | Quick DO/DON'T |
| **Patterns** | HOW — implementation | Code examples |
| **SOPs** | STEP-BY-STEP — procedures | Numbered steps, checklists |

---

## SOP Inventory

### The Sovereign Delivery Lifecycle — 6 SOPs covering the full cycle

End-to-end governance from business need to production release. Every SOP is a reference file (always loaded) with on-demand detail sub-SOPs.

| # | SOP | Phase | Owner | Location |
|---|-----|-------|-------|----------|
| 1 | **SCI** — Sovereign Commercial Intake | Origin (Commercial / PO) | PO + Commercial | [admin/sops/SCI.md](../../admin/sops/SCI.md) |
| 2 | **SCD** — Sovereign Context Design | Pre-code (Dev) | Dev + TL | [SCD.md](SCD.md) |
| 3 | **SCG** — Sovereign Code Governance | Code (Dev) | Dev | [SCG.md](SCG.md) |
| 4 | **SDP** — Sovereign Delivery Process | Delivery (Dev → QA) | Dev + Reviewer | [SDP.md](SDP.md) |
| 5 | **SQP** — Sovereign QA Process | QA (Manual + Automation) | QA | [qa/sops/SQP.md](../../qa/sops/SQP.md) |
| 6 | **SRO** — Sovereign Release Operations | Deploy (SRE/DevOps) | SRE | [sre/sops/SRO.md](../../sre/sops/SRO.md) |

> **Maturity note**: SCD/SCG/SDP ship alongside the legacy references below. SCI/SQP/SRO are v0.1 drafts synthesized from industry best practices; treat them as starting scaffolds and adapt per organization before adopting as firm process.

Handoffs are explicit — each SOP declares exit criteria that become the next SOP's input.

```
Business need → SCI → SCD → SCG → SDP → SQP → SRO → Production release
    (commercial)  (dev)  (dev) (dev)  (qa)  (sre)
```

Deep-dive sub-SOPs under each SOP's subfolder (loaded on demand).

#### Legacy deep references (long-form companions to the trilogy)

These are the exhaustive originals. The trilogy orchestrators above are the day-to-day entry points; reach for these when you need the full checklist.

| SOP | Purpose |
|-----|---------|
| [sovereign-context-design.md](sovereign-context-design.md) | SCD long-form: 9-phase checklist (Reframe → Intent → Question → Domain → Spec → Plan → …) |
| [sovereign-code-governance.md](sovereign-code-governance.md) | SCG long-form: Execute → Validate → Feedback playbook |

### Development Workflow

| SOP | Purpose |
|-----|---------|
| [api-testing.md](api-testing.md) | Test APIs with curl |
| [pr-documentation.md](pr-documentation.md) | PR creation workflow (title, description, reviewers) |
| [feature-delivery-workflow.md](feature-delivery-workflow.md) | End-to-end: ticket → code → PR → review |
| [branch-merge-strategy.md](branch-merge-strategy.md) | Branch hierarchy, sacrifice-branch pattern, conflict resolution for shared branches |
| [code-audit.md](code-audit.md) | Post-implementation validation: TypeScript → lint → tests → build → structural review |
| [audit-as-documentation.md](audit-as-documentation.md) | Turn a refactor/audit into a traceable tech-debt catalog (location + category + action) that *is* the documentation |
| [pre-deployment-audit.md](pre-deployment-audit.md) | Final gate before deploy: feature integration, design homogeneity, component reuse, E2E reachability, regression perimeter |
| [sovereignty-refinement.md](sovereignty-refinement.md) | Governance: who can change sovereignty and how |
| [merge-verification.md](merge-verification.md) | Automated scripts to prevent broken merges and broken imports |
| [typescript-verification-protocol.md](typescript-verification-protocol.md) | TypeScript --project flag, JS/TS error triage, build system verification |
| [sop-creation.md](sop-creation.md) | Meta-SOP: two-layer structure for creating SOPs (reference + detail) |
| [context-pruning.md](context-pruning.md) | Ritualized, auditable reduction of sovereignty + project context (every 2–3 months) |
| [pattern-update-detection.md](pattern-update-detection.md) | Detect when project work produces patterns worth upstreaming to sovereignty |

### Sovereignty System

| SOP | Purpose |
|-----|---------|
| [sovereignty-replication.md](sovereignty-replication.md) | Replicate sovereignty to a new project or team |
| [sovereignty-maintenance.md](sovereignty-maintenance.md) | Ongoing hygiene: stale refs, .gitignore, context drift, backup validation |
| [sovereignty-ui-publish.md](sovereignty-ui-publish.md) | Publish sovereignty-ui to GitHub Packages |
| [sovereignty-sync-strategy.md](sovereignty-sync-strategy.md) | Manage `.claude/` across branches — carrier pattern, PR cleanup |

### Tooling & Integrations (MCP)

| SOP | Purpose |
|-----|---------|
| [atlassian-mcp-setup.md](atlassian-mcp-setup.md) | Configure Atlassian MCP servers (Jira, Confluence, Bitbucket) |
| [mcp-setup.md](mcp-setup.md) | MCP server setup, auth, troubleshooting |
| [mcp-jira.md](mcp-jira.md) | Jira issue management via MCP |
| [mcp-bitbucket.md](mcp-bitbucket.md) | Bitbucket PRs, branches, diffs via MCP |
| [mcp-confluence.md](mcp-confluence.md) | Confluence page management via MCP |
| [mcp-context7.md](mcp-context7.md) | Library documentation lookup via MCP |
| [mcp-playwright.md](mcp-playwright.md) | Visual testing & browser automation via Playwright MCP |
| [playwright-bdd.md](playwright-bdd.md) | Map ticket AC to Playwright BDD tests (Gherkin + Page Object Model) |
| [document-ingestion.md](document-ingestion.md) | Convert documents (pdf, docx, xlsx, pptx, images) to Markdown via MarkItDown — single + batch (`scripts/markitdown-batch.sh`) |
| [data-as-code.md](data-as-code.md) | Turn opaque data (xlsx/PDF) into a typed, versioned source of truth → generated views (deterministic-first, validate, surface uncertainty) |

### Infrastructure & Services

| SOP | Purpose |
|-----|---------|
| [supabase-project-setup.md](supabase-project-setup.md) | Configure new Supabase project: database, storage, credentials, Prisma connection |
| [vercel-project-setup.md](vercel-project-setup.md) | Configure Vercel project: deployment, env vars, domains, cron jobs |
| [mac-cleanup.md](../../infrastructure/sops/mac-cleanup.md) | Systematic Mac dev environment cleanup — 9 phases, 40-100 GB recoverable |

### Security & Governance

| SOP | Purpose |
|-----|---------|
| [ai-usage-policy.md](ai-usage-policy.md) | Claude Code enterprise security & data protection |
| [executive-presentations.md](executive-presentations.md) | HTML dark-theme decks for executives: design system, slide anatomy, PDF export |

---

## Integration with Projects

### From sovereignty → project

SOPs live in the sovereignty repo and are synced to `.claude/patterns/core/sops/`. Projects reference them from there:

```markdown
- API Testing: `.claude/patterns/core/sops/api-testing.md`
- PR Documentation: `.claude/patterns/core/sops/pr-documentation.md`
```

### When to create project-specific SOPs

Create in `.claude/rules/sop/` when the procedure:
- Uses project-specific URLs, credentials, or configurations
- Follows project-specific workflows
- References project-specific files or structures

---

## SOP Template

```markdown
# SOP: [Task Name]

> **PURPOSE**: What this procedure accomplishes
> **SCOPE**: When/where to use this SOP
> **PREREQUISITES**: What must be true before starting
> **UPDATED**: YYYY-MM-DD

---

## 1. Prerequisites

- [ ] Prerequisite 1

## 2. Procedure

### Step 1: [Action Name]

Description + command.

**Validation**: How to verify this step succeeded.

## 3. Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|

## 4. Checklist

- [ ] Step 1 completed
- [ ] Final validation passed
```
