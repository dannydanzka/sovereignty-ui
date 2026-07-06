# Governance in the Development Cycle

> **Module**: doctrine
> **Version**: 2.0
> **Applying sovereignty to each development phase**
> **Enriched with**: Sovereign Method (SCD + SCG) — "Sistema de Soberanía" (Roberto Ramírez, 2026)

---

## TL;DR

| Phase | Key question | Mechanism |
|-------|-------------|-----------|
| **Before (SCD)** | What structural impact will it have? | Sovereign Context Design |
| **During (SCG)** | Are boundaries respected? | Sovereign Code Governance |
| **After** | What did we learn? | Structural feedback |

---

## Fundamental Premise

> *"La calidad, la estabilidad y el costo futuro del software se definen ANTES de escribir código."*

Technical governance **is not an additional stage** or a posterior control.

It is a **transversal layer** that orients decisions in each phase of the cycle.

---

## The Sovereign Method

The method is the concrete form governance translates into action. Not a rigid procedure — it is **applied decision architecture**.

> *"Si se ejecuta mecánicamente, pierde su fuerza. Si se entiende como arquitectura de decisión, se convierte en hábito virtuoso."*

### Method sequence

```
1. Documented intention
        ↓
2. Investigated domain
        ↓
3. Formulated plan
        ↓
4. Assisted execution
        ↓
5. Conscious review
```

| Step | Purpose | Key principle |
|------|---------|--------------|
| **1. Documented intention** | Translate requirement to conceptual structure — not simple functional description, but **deliberate technical interpretation** | Explicit Governance (#1) |
| **2. Investigated domain** | Understand the topology of territory to be intervened — dependencies, contracts, transversal impact | Domain Separation (#2) |
| **3. Formulated plan** | Change strategy, not task list. AI can participate as exploration tool, but validation stays under human judgment | Architecture as Asset (#3) |
| **4. Assisted execution** | Code writing subordinated to prior architecture. AI as speed multiplier **within the defined framework** | Technological Independence (#6) |
| **5. Conscious review** | Structural alignment, not improvised correction | Conscious Evolution (#8) |

> *"El método se vuelve hábito. El hábito se vuelve cultura. Y la cultura se transforma en infraestructura invisible."*

---

## The Sovereignty System: SCD + SCG

Code Sovereignty (WHY) materializes into an **applied system** (HOW) with two operative phases:

```
┌─────────────────────────────────────────────────────────────┐
│              SOVEREIGNTY SYSTEM                              │
├──────────────────────────┬──────────────────────────────────┤
│   PHASE 1: SCD           │   PHASE 2: SCG                   │
│   Sovereign Context      │   Sovereign Code                 │
│   Design                 │   Governance                     │
├──────────────────────────┼──────────────────────────────────┤
│ Absorbs organizational   │ Executes under explicit rules    │
│ ambiguity                │ that preserve architecture       │
│        ↓                 │        ↓                         │
│ Produces formal          │ Produces governed                │
│ intention artifact       │ and validated code               │
└──────────────────────────┴──────────────────────────────────┘
```

> *"La soberanía conceptual sin sistema aplicado se convierte en discurso. El sistema aplicado sin fundamento filosófico se convierte en técnica sin dirección."*

---

## Phase 1: SCD — Sovereign Context Design (BEFORE)

SCD is the phase that **separates context from implementation** — the discipline of intention first, implementation second.

### Why separate context from implementation

| Intention questions | Implementation questions |
|--------------------|------------------------|
| What problem? | How to integrate? |
| What domain? | What architectural pattern? |
| What rules? | How to encapsulate state? |
| What transversal impact? | How to validate contracts? |
| What is explicitly out of scope? | How to test? |

> *"Mezclar ambas capas produce contaminación conceptual. Separarlas no implica rigidez secuencial. Implica claridad estructural."*

### Contextual debt

Contextual debt is distinct from technical debt. It's not a poorly written function — it's an **incomplete domain interpretation** conditioning all subsequent architecture.

> *"El supuesto implícito es que la claridad emergerá durante la implementación. Este supuesto es estructuralmente incorrecto."*

### SCD Operations

#### 1. Reframing as architectural act

Suspend the task label and analyze the real domain. Before implementing, ask: does this task really belong to the domain where they placed it?

#### 2. Truth unification

A single consolidated artifact represents the final decision — eliminates the problem of multiple implicit interpretations.

#### 3. Business Overview as governance artifact

Not an executive summary — a **convergence point** between business and technology. The structured input that AI will use to accelerate execution.

### Mandatory SCD questions:

| Question | Why it matters |
|----------|---------------|
| What business problem are we solving? | Avoids solutions looking for problems |
| What system domains will be affected? | Identifies technical stakeholders |
| What structural impact will the change have? | Prevents architectural surprises |
| What technical risks does it introduce? | Enables early mitigation |
| What technical/contextual debt could it generate? | Makes hidden cost visible |

### Artifact: Technical Plan

```markdown
# Plan: [Change name]

## Business problem
[Clear description of the problem to solve]

## Affected domains
- [ ] Domain (entities, types)
- [ ] Infrastructure (repos, services, state)
- [ ] Presentation (components, screens)
- [ ] API Routes

## Structural impact
[High/Medium/Low] - [Justification]

## Identified risks
1. [Risk] → [Mitigation]

## Potential debt (technical + contextual)
- [Debt] → [Resolution plan]

## Out of scope (explicit)
- [What is NOT addressed in this iteration]
```

---

## Documentation as Governance Asset

Documentation stops being a secondary artifact and becomes a **central governance mechanism**.

### Three key functions:

| Function | Description |
|----------|-------------|
| **Align** | Translates requirements to technical impact |
| **Preserve** | Reduces individual knowledge dependency |
| **Verify** | Source of truth for people and tools |

### Documentation as AI interface

> *"La IA no debe inferir arquitectura. Debe consumirla."*

### Contextual Architecture Hierarchy (5 layers)

Context is not a uniform mass of information — it must be designed as architecture:

| Layer | Purpose | Analogy |
|-------|---------|---------|
| **1. Permanent structural principles** | Invariable governance foundations, domain delimitation, central contracts | Technical constitution |
| **2. Reusable patterns** | Recurring solution models encapsulating validated decisions | Architectural jurisprudence |
| **3. Operative rules and validations** | Self-corrective mechanisms: static analysis, type verification, integrity validation | Constitutional tribunal |
| **4. Current state of affected domain** | Structured synthesis of the specific territory to modify | Domain reconnaissance |
| **5. Punctual intervention specification** | Clear definition of desired change, its limits and restrictions | Intervention order |

> *"El poder del sistema no reside en la existencia de estas capas, sino en su separación explícita."*

---

## Phase 2: SCG — Sovereign Code Governance (DURING)

Starting development **does not mean returning to technical improvisation**. If the first phase consolidated intention, the second must **preserve coherence**.

> *"La mayoría de los sistemas técnicos fracasan no por falta de buenas decisiones iniciales, sino por la erosión progresiva de esas decisiones durante la ejecución."*

### Execution mechanisms:

| Mechanism | Validates | Sovereign function |
|-----------|----------|-------------------|
| TypeScript strict | Types and contracts | Explicit contract between layers |
| ESLint custom | Architecture and patterns | Structural immune system |
| Pre-commit hooks | Quality before commit | Constitutional pre-validation |
| CI/CD gates | Build and tests | Final conformity tribunal |

---

## Testing as Technical Epistemology

> *"El testing es la forma en que el sistema sabe que permanece coherente consigo mismo."*

- Automated testing acts as the system's **constitutional tribunal**
- No accelerated change should consolidate without programmatic validation
- Tests describing expected behaviors become **living artifacts** capturing operative knowledge

> *"Un componente que no puede aislarse y verificarse es un territorio sin frontera clara."*

---

## Post-Deployment Governance

Technical governance **does not end with deployment**.

### Continuous learning:

```
Incident → Analysis → Learning → Updated rules
```

### Post-deployment questions:
- Did the change behave as expected?
- What didn't we anticipate?
- What rule or pattern should be updated?

---

## Governance Checklist

### SCD — Before starting:
- [ ] Business problem documented
- [ ] Affected domains identified
- [ ] Structural impact evaluated
- [ ] Risks documented
- [ ] Contextual debt identified
- [ ] Technical plan approved
- [ ] Scope and out-of-scope explicit

### SCG — During implementation:
- [ ] Boundaries respected
- [ ] Patterns followed
- [ ] Invariants preserved
- [ ] Validations passing
- [ ] Documentation updated

### After deployment:
- [ ] Behavior verified
- [ ] Learnings documented
- [ ] Rules updated (if applicable)

---

## Related

- `doctrine/principles.md` — The 8 principles + meta-principle
- `doctrine/governance-role.md` — Custodian role (who governs)
- `doctrine/ai-acceleration.md` — AI in the cycle
- `doctrine/business-impact.md` — Business impact
- `core/sops/sovereign-context-design.md` — SCD operative procedure
- `core/sops/sovereign-code-governance.md` — SCG operative procedure

---

**Version**: 2.0 | **Updated**: 2026-03-23
