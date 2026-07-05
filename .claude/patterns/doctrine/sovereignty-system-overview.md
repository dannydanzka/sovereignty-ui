# Sovereignty System — Development Governance

> **Document type**: Governance — System Overview
> **Version**: 4.0
> **Scope**: All disciplines — Company-agnostic
> **Repository**: `github.com/dannydanzka/soberania-del-codigo`

---

## Objective

Define and document the **centralized technical governance system** that governs standards, patterns, procedures, and development principles for all team projects.

This document establishes the **single reference framework** so that all development teams — regardless of discipline, stack, or company — work under the same rules, with the same quality, and with full traceability.

---

## Introduction

As the development ecosystem grows (more projects, more developers, more AI tools), the absence of technical governance generates **fragmentation, inconsistency, and accumulated technical debt**. Sovereignty is the response to this problem.

> *"La arquitectura, las reglas y la evolucion del sistema no dependen de decisiones improvisadas ni de individuos especificos, sino de principios explicitos y compartidos."*

**Sovereignty is a conceptual framework for technical governance** that defines how a software system **makes decisions**, **evolves**, and **protects itself** against growth, complexity, and technological acceleration. It doesn't describe how to program — it describes **how to govern** the process by which software is designed, modified, and maintained.

It is a **permanent organizational capability** — not a project with an end date. Once established, it enables:

- Technical teams operating with **autonomy and clarity**
- Decision-making that is **distributed without losing control**
- Processes that **simplify** rather than bureaucratize
- Technology as a **factor of trust**, not uncertainty

### What Sovereignty is NOT

- **Not a package** you install — it's documentation that syncs
- **Not a methodology** (Scrum, Kanban) — it's technical governance
- **Not dependent on any AI tool** — works with Claude, Copilot, Gemini, Codex, Cursor
- **Does not replace** each project's specific documentation
- **Does not centralize** operational decisions — it structures them
- **Does not seek to slow** value delivery — it makes speed sustainable

> *"Las arquitecturas clasicas describen como organizar el sistema; la soberania describe como organizar su transformacion."*

---

## Scope

### In scope

- **Doctrinal principles:** the 8 principles guiding all technical decisions
- **Development standards:** code conventions, naming, file structure, architecture
- **Implementation patterns:** components, hooks, services, state, testing — per discipline
- **Standard Operating Procedures (SOPs):** delivery workflows, PRs, API testing, tool configuration
- **AI governance:** usage policies, limits, validation, context economy
- **Refinement process:** who can change what, with what approval, under what protocol
- **Project synchronization:** automated mechanism to distribute updated patterns

### Out of scope

- Functional or business documentation for each project
- Operational process definitions (Scrum, Kanban, SAFe)
- Infrastructure or environment configuration (CI/CD, cloud)
- Access management or user permissions
- Dynamic roles or multi-level hierarchies

---

## The Problem It Solves

When explicit sovereignty doesn't exist, systems exhibit:

| Symptom | Description |
|---------|-------------|
| **Implicit architecture** | Only known to those who built it |
| **Informal rules** | Transmitted by experience, not by definition |
| **Reactive decisions** | Driven by urgency, not by criteria |
| **Hero dependency** | Stability depends on individuals, not principles |
| **Contextual debt** | Incomplete domain interpretations conditioning all subsequent architecture |

> *"Cuando la gobernanza tecnica no es explicita, el sistema sobrevive gracias a heroes tecnicos. Cuando la gobernanza existe, las personas pueden dejar de ser heroes y volver a ser ingenieros."*

### With Sovereignty vs Without Sovereignty

| Without Sovereignty | With Sovereignty |
|---------------------|-----------------|
| Each project invents its own conventions | A single shared standard for all |
| Documentation fragments and becomes outdated | Maintained centrally and synced |
| A new dev takes weeks to understand the rules | Setup in under 10 minutes |
| Quality depends on individual judgment | Quality is codified in explicit rules |
| AI tools generate code without context | AIs receive patterns and generate aligned code |
| Each code review is subjective | Review criteria are explicit and measurable |

---

## The Law of Amplification

The central law governing the entire doctrine:

> *"Toda aceleracion amplifica el estado estructural del sistema sobre el que actua. Si el sistema es coherente, la velocidad consolida coherencia. Si el sistema es fragil, la velocidad acelera el colapso."*

Every principle, every mechanism, every role exists to ensure the system is in condition to be accelerated without degrading.

### In systems without governance

| The system has... | AI accelerates... |
|-------------------|-------------------|
| Implicit architecture | Technical debt generation |
| Informal rules | Architectural fragmentation |
| Mixed responsibilities | Error propagation |
| Reactive decisions | Inconsistencies |

### In systems with sovereignty

| The system has... | AI accelerates... |
|-------------------|-------------------|
| Explicit sovereignty | Quality |
| Clear principles | Consistency |
| Living documentation | Real productivity |
| Automatic validations | Reliability |

**Business translation:** If we accelerate development (with more devs, with AI, with tools) without governance, chaos grows faster. With governance, speed becomes quality.

---

## 8 Doctrinal Principles

The principles guiding all technical decisions. Each exists to ensure the system can be accelerated without degrading.

| # | Principle | Application |
|---|-----------|-------------|
| 1 | **Explicit Governance** | Rules are documented, not in anyone's memory. Everything whose failure is costly must be defined, documented, and accessible |
| 2 | **Domain Separation** | Clear and defensible boundaries. Mixing domains generates accidental complexity |
| 3 | **Architecture as Asset** | Architecture is protected, evolved, and aligned to business. Not a code byproduct — it's collective patrimony |
| 4 | **Controlled Exceptions** | Every exception is explicit, justified, and documented. Permanent improvisation is incompatible with sovereignty |
| 5 | **Prevention over Correction** | Prevent structural errors before fixing them. Linters, types, and validations are sovereignty devices |
| 6 | **Technological Independence** | Frameworks are means, not axes. Business domain must survive technological changes |
| 7 | **Responsible Autonomy** | Clear limits = freedom to act. Governance doesn't reduce freedom — it reduces uncertainty |
| 8 | **Conscious Evolution** | Structured change, not improvised. Each evolution must strengthen the system, not degrade it |
| **Meta** | **Doctrinal Self-Criticism** | The doctrine reforms itself without losing identity. No framework aspiring to longevity can sustain itself without examining its own limits |

### 6 Technical Principles (Code implementation)

| # | Technical Principle | Code application |
|---|---------------------|-----------------|
| 1 | Territorial Integrity | Each layer owns its territory |
| 2 | Non-Intervention | Dependencies point inward |
| 3 | Self-Sufficiency | Self-contained modules |
| 4 | Clear Borders | Interfaces = treaties |
| 5 | Trade Agreements | Data flows through protocols |
| 6 | Secure Trade | Return ONLY what was requested |

### Judgment as Ultimate Layer

> *"El criterio no es intuicion improvisada ni opinion subjetiva. Es la capacidad de evaluar una situacion particular a la luz de principios estructurales y anticipar las consecuencias sistemicas de una decision."*

```
Rules     -> Formal base, automatically verifiable
  |
Governance -> Framework that gives meaning to rules
  |
Judgment   -> Human evaluation when rules are insufficient
```

---

## The Sovereign Method (SCD + SCG)

Sovereignty materializes into an **applied system** with two operative phases and a 5-step cycle:

### 5-step cycle

```
1. Documented intention  -> Translate requirement to conceptual structure
  |
2. Investigated domain   -> Understand dependencies, contracts, cross-cutting impact
  |
3. Formulated plan       -> Change strategy, not task list
  |
4. Assisted execution    -> Code subordinated to prior architecture
  |
5. Conscious review      -> Structural alignment, not improvised correction
```

### Phase 1: SCD — Sovereign Context Design (BEFORE code)

> *"La calidad, la estabilidad y el costo futuro del software se definen ANTES de escribir codigo."*

SCD separates context from implementation. Not "what are we going to code" but "what problem are we solving and what structural impact will it have".

**Mandatory questions:**

| Question | Why it matters |
|----------|---------------|
| What business problem are we solving? | Avoids solutions looking for problems |
| What system domains will be affected? | Identifies technical stakeholders |
| What structural impact will the change have? | Prevents architectural surprises |
| What technical risks does it introduce? | Enables early mitigation |
| What is explicitly out of scope? | Delimits the intervention |

### Phase 2: SCG — Sovereign Code Governance (DURING)

Starting development **does not mean returning to improvisation**. Execution mechanisms preserve coherence:

| Mechanism | What it validates | Sovereign function |
|-----------|-------------------|-------------------|
| TypeScript strict | Types and contracts | Explicit contract between layers |
| ESLint custom | Architecture and patterns | Structural immune system |
| Pre-commit hooks | Quality before commit | Constitutional pre-validation |
| CI/CD gates | Build and tests | Final conformity tribunal |

### After deployment

Every incident, adjustment, or deviation becomes a source of structural learning. Rules are updated, patterns evolve.

> *"El metodo se vuelve habito. El habito se vuelve cultura. Y la cultura se transforma en infraestructura invisible."*

---

## AI as Governed Acceleration

AI is not the future of development. **Technical governance is.**

### Central principle

> *"Ningun sistema debe acelerarse sin autogobierno tecnico."*

AI doesn't introduce disorder by itself — it **amplifies the system's state** it's inserted into. If the system is coherent, it amplifies quality. If the system is fragile, it amplifies collapse.

### Operational vs structural autonomy

| Type | Who has it | What it implies |
|------|-----------|----------------|
| **Operational autonomy** | AI | Executes complex tasks within the defined framework |
| **Structural autonomy** | Humans | Preserve systemic coherence long-term |

> *"El problema ya no es como escribir codigo mas rapido. El problema es como preservar coherencia en un entorno donde escribir codigo es trivial."*

### What AI does NOT do

- Evaluate long-term structural consequences
- Correct implicit architecture
- Detect systemic technical debt
- Question the absence of principles if they're not declared

### Documentation as AI interface

> *"La IA no debe inferir arquitectura. Debe consumirla."*

Documentation becomes a control interface. Without living documentation, AI improvises. With explicit patterns, it generates aligned code.

### The epistemological risk

> *"Cuando la produccion se acelera, genera una ilusion de comprension. El codigo existe, compila, incluso pasa tests basicos, y sin embargo puede estar debilitando el sistema a un nivel mas profundo."*

Manifestations: illusion of productivity (more code != more value), illusion of efficiency (reduced times, invisible debt growing), illusion of comprehension (it works but nobody understands the impact).

### 5 Sovereignty Principles for AI

1. **Delimitation** before delegation
2. **Contract** before integration
3. **Validation** before consolidation
4. **Economy** before saturation
5. **Human direction** before total automation

---

## Business Impact

Sovereignty **is not an isolated technical initiative**. It is a direct mechanism for risk reduction, cost optimization, and increased predictability.

> *"La previsibilidad no es un valor estetico; es un valor economico."*

### Impact by timeframe

| Timeframe | Technical impact | Business translation |
|-----------|-----------------|---------------------|
| **Short (0-6 months)** | Reduced rework, greater clarity, less reactive pressure | Fewer unproductive hours, more reliable estimates |
| **Medium (6-18 months)** | Fewer structural bugs, predictable releases, less key-person dependency | Reduced corrective maintenance cost, lower operational risk |
| **Long (18+ months)** | Sustainable architectures, safe AI adoption, cross-company synergies | Less unplanned CAPEX, greater budget predictability, architecture as financial asset |

### Governance ROI

| Area | Estimated return |
|------|-----------------|
| Avoided rework | 20-40% of development time |
| Structural bugs | 50% fewer critical incidents |
| Onboarding | 2x faster |
| Maintenance | 30% less effort |

### Reference metrics (project under sovereignty)

| Metric | Target | Principle validated |
|--------|--------|-------------------|
| TypeScript errors | 0 (strict mode) | Explicit Governance |
| Custom ESLint rules | Unified across platforms | Explicit Governance |
| Cross-context imports | 0 | Domain Separation |
| Context snapshots | All domains documented | Architecture as Asset |
| Clean Architecture layers | Boundaries enforced | Technological Independence |
| Use Cases | Pure logic, framework-agnostic | Technological Independence |

---

## Technical Debt — Measurement Template

Governance tools enable periodic measurement of technical debt. Below is the template for tracking:

### Summary

| Tool | Project A | Project B | **Total** |
|------|-----------|-----------|-----------|
| **ESLint** | — | — | — |
| **TypeScript (with checkJs)** | — | — | — |
| **Stylelint** | — | — | — |

### Codebase Composition

| Metric | Project A | Project B |
|--------|-----------|-----------|
| `.js` files (untyped) | — | — |
| `.ts/.tsx` files (typed) | — | — |
| **% migrated to TypeScript** | — | — |

### Top ESLint debt by category

| Category | Rule example | Impact |
|----------|-------------|--------|
| Type Safety | `@typescript-eslint/no-explicit-any` | Hidden runtime errors |
| Architecture | Custom boundary rules | Cross-domain coupling |
| Code Quality | `comments-policy`, `code-size-limits` | Maintainability |
| Sorting | `sort-keys-fix` | Auto-fixable, low risk |

### Hidden TypeScript debt

`checkJs: false` hides errors in `.js` files without type annotations. Common errors:

| Error | Description |
|-------|-------------|
| TS7006 | Parameter implicitly has `any` type |
| TS7031 | Binding element implicitly has `any` type |
| TS2322 | Type not assignable |
| TS2339 | Property does not exist on type |

> *Note: This section is updated periodically as part of the governance cycle. Numbers represent legacy code state — not new code under sovereignty.*

---

## Custom ESLint Rules — Reference Categories

Custom rules enforce architectural decisions automatically. Organize rules by category:

### Architecture & Boundaries

| Category | What it enforces |
|----------|-----------------|
| Import strategy | No deep relative imports, use aliases |
| Native element restrictions | Only design-system components, no raw HTML/RN elements |
| Component organization | Types in `.interfaces.ts`, constants in `.constants.ts` |
| Barrel exports | `index.ts` only uses `export *` |
| No alias exports | No re-exporting with different names |

### State Management & Services

| Category | What it enforces |
|----------|-----------------|
| State isolation | State management only in hooks, not in components directly |
| Service boundaries | Services only in side-effect handlers, not in components |
| Service architecture | Consistent service patterns |
| Naming policy | Correct names from source, no aliases |

### Code Quality

| Category | What it enforces |
|----------|-----------------|
| Size limits | Max lines per file/function/JSX |
| Comments policy | No obvious comments, no blanks in objects |
| Hook composition | Hooks not over-complex (max callbacks, state vars) |
| Naming conventions | Consistent naming across codebase |
| Error handling | Required error handlers, no empty catches |
| No underscore prefix | Zero tolerance for `_prefix` |
| No eslint-disable | Prohibited `eslint-disable` comments |
| No magic literals | Named constants, no magic strings/numbers |

### UI & Presentation

| Category | What it enforces |
|----------|-----------------|
| No emojis in JSX | Use icon components, not emojis |
| No import rename | No `import { X as Y }` |
| No hardcoded strings | Externalize strings to i18n |
| Testing patterns | Prevent verbose testing patterns |
| Design tokens | Use theme tokens, no hardcoded colors/spacing/typography |

### Organization

| Category | What it enforces |
|----------|-----------------|
| Import order | Consistent import organization |
| Default props | Props with documented defaults |

---

## Maturity Model — 5 Levels

A formal model to evaluate the state of technical governance:

| Level | Name | Characteristics | Key indicator |
|-------|------|----------------|---------------|
| **I** | Operational Reactivity | Implicit architecture, case-by-case decisions, hero-dependent coherence | "Only Juan knows how it works" |
| **II** | Informal Standardization | Shared patterns emerge but aren't formalized | "We generally do this" |
| **III** | Partial Governance | Formalized principles + validation, but uneven application | "We have rules but don't always follow them" |
| **IV** | Executable Governance | Rules integrated into infrastructure; systematically verifiable contracts | "The system validates automatically" |
| **V** | Institutionalized Sovereignty | Governance integrated into organizational identity; architecture as accumulated capital | "This is how we work" |

---

## Professional Transformation

Sovereignty doesn't just reorganize workflows — it reorganizes **professional identity**.

| Transformation | From | To |
|---------------|------|-----|
| Operating model | Heroic (individuals sustain coherence) | Sovereign (principles sustain coherence) |
| Professional identity | Developer (executor) | Orchestrator (change director) |
| Seniority | Accumulated technical mastery | Anticipation of structural consequences |
| Differentiating value | Ability to execute | Ability to **direct without suffocating** |

> *"La seniority ya no se mide por cuanto codigo puedes escribir sin ayuda. Se mide por cuanto impacto puedes prever antes de que el codigo exista."*

---

## Governance Model (Repository)

### Distribution flow

```
SOVEREIGNTY REPO (source of truth)
+-- Doctrine: WHY we build this way
+-- Core: WHAT practices apply to all
+-- Discipline: HOW each area implements
         |
         | sync-sovereignty.sh
         |
    +----+----+
    v    v    v
  ProjA  ProjB  ProjC
```

### AI tool agnostic

| Tool | How it consumes `.claude/` |
|------|---------------------------|
| **Claude Code** | Native — auto-loads `rules/`, reads `CLAUDE.md` |
| **Copilot** | Reference via `@workspace` or manual context |
| **Gemini CLI** | Reads `CLAUDE.md` as project context |
| **Codex** | Reads `CLAUDE.md` as instructions |
| **Cursor** | `.cursorrules` can reference `.claude/` patterns |

---

## Repository Structure

```
sovereignty/
+-- doctrine/          # WHY — Philosophy and principles
+-- core/              # WHAT — Cross-discipline practices
+-- frontend/          # HOW — React + TypeScript implementation
+-- mobile/            # HOW — React Native / Expo
+-- backend/           # HOW — NestJS / .NET Core / FastAPI / Laravel (skeleton)
+-- spa/               # HOW — Pure React/Vite (skeleton)
+-- lib/               # HOW — npm packages / component libraries (skeleton)
+-- qa/                # QA — Automation + manual (skeleton)
+-- ecommerce/         # Shopify Hydrogen (skeleton)
+-- sre/               # Kubernetes + GitOps (skeleton)
+-- infrastructure/    # Terraform + Ansible (skeleton)
+-- projects/          # Per-project backups
+-- templates/         # Starter code (planned)
+-- bootstrap-project.sh
+-- sync-sovereignty.sh
+-- backup-project.sh
+-- ONBOARDING.md
+-- CONTRIBUTING.md
+-- CHANGELOG.md
```

---

## Refinement Process — Who Can Change What

### Permissions Matrix

| Layer | Who can change | Required approval |
|-------|---------------|-------------------|
| `doctrine/` (principles) | Only Architecture Lead | Self-approved (constitutional) |
| `core/` (cross practices) | Architecture Lead + Seniors | Architecture Lead |
| `frontend/` (discipline) | Frontend developers | Frontend Tech Lead |
| `backend/` (discipline) | Backend developers | Backend Tech Lead |
| `projects/` (backups) | Project developers | Discipline Tech Lead |
| Root scripts and docs | Only Architecture Lead | Self-approved |

### Validation Protocol — 5 Pillars

Every proposed change to sovereignty must be validated against **5 pillars** before approval:

| # | Pillar | Question |
|---|--------|----------|
| 1 | **Business Alignment** | Does this serve the business or is it personal preference? |
| 2 | **Architectural Consistency** | Is it consistent with existing principles? |
| 3 | **Best Practices** | Is it a recognized industry practice? |
| 4 | **AI Audit** | Was it reviewed by AI to detect blind spots? |
| 5 | **Production Validation** | Was it tested in real code, not just theory? |

---

## System Evolution (v1 to v4)

| Version | Period | Context | Main limitation |
|---------|--------|---------|----------------|
| **v1** | 2025 | Personal project (Next.js SaaS) | Didn't scale beyond one project |
| **v2** | 2025-2026 | Frontend monorepo enterprise (~15 devs) | Didn't scale beyond one team |
| **v3** | 2026-02 | Multi-project + `~/.claude/sovereignty/` | Didn't scale beyond one machine |
| **v4** | 2026-03 | Git repo enterprise | Scales to entire organization |

**The pattern:** sovereignty scales when governance is explicit, shared, and automated.

---

## Conclusion

Sovereignty establishes a **centralized, versioned, and syncable** technical governance framework that guarantees development consistency across all teams and projects.

The model solves fundamental scalability problems: convention fragmentation, slow onboarding, inconsistent quality, hero dependency, and misaligned code generation by AI tools. By codifying rules in a single repository with a controlled refinement process, it ensures that acceleration translates into quality, not entropy.

The Law of Amplification summarizes it: every acceleration amplifies the system's state. Without sovereignty, speed amplifies chaos. With sovereignty, speed amplifies coherence.

> *"La gobernanza no limita la velocidad — la hace sostenible."*

---

## Acronyms and Definitions

| Acronym / Term | Definition |
|----------------|-----------|
| **Sovereignty** | Centralized technical governance repository — company-agnostic |
| **Doctrine** | Philosophical layer of the system: foundational principles and the "why" behind decisions |
| **Core** | Cross-discipline practices layer: git, documentation, code review, quality |
| **Discipline** | Stack-specific implementation layer: frontend, backend, QA, SRE |
| **SCD** | *Sovereign Context Design*. Pre-development phase: separate context from implementation |
| **SCG** | *Sovereign Code Governance*. Development phase: execution as a governed act |
| **Law of Amplification** | Central doctrinal law: every acceleration amplifies the system's structural state |
| **SOP** | *Standard Operating Procedure*. Step-by-step documented operative procedure |
| **MCP** | *Model Context Protocol*. Protocol for connecting AI tools with external services |
| **RTK** | *Redux Toolkit*. Official Redux library for state management in React |
| **Contextual debt** | Incomplete domain interpretation conditioning all subsequent architecture |
| **Context Snapshot** | Structured synthesis of a domain's current state for rapid consumption |

---

## References

| Source | Type | Detail |
|--------|------|--------|
| [doctrine/principles.md](doctrine/principles.md) | Internal | 8 doctrinal principles in full detail |
| [doctrine/governance-cycle.md](doctrine/governance-cycle.md) | Internal | SCD + SCG method detail |
| [doctrine/ai-acceleration.md](doctrine/ai-acceleration.md) | Internal | AI as governed acceleration |
| [doctrine/business-impact.md](doctrine/business-impact.md) | Internal | Business impact + maturity model |
| [doctrine/roles-evolution.md](doctrine/roles-evolution.md) | Internal | Professional transformation |
| [core/sops/sovereignty-refinement.md](core/sops/sovereignty-refinement.md) | Internal | Who can change what and how |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Internal | Security model and contribution guide |

---

**Version**: 4.0 | **Updated**: 2026-03-23
