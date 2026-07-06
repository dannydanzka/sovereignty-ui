# Foundational Principles

> **Module**: doctrine
> **Version**: 2.0
> **The 8 principles governing Code Sovereignty**
> **Enriched with**: "Sistema de Soberanía" — foundational work (Roberto Ramírez, 2026)

---

## TL;DR

| # | Principle | Application |
|---|-----------|-------------|
| 1 | Explicit Governance | Rules documented, not in memory |
| 2 | Domain Separation | Clear and defensible boundaries |
| 3 | Architecture as Asset | Protect, evolve, align to business |
| 4 | Controlled Exceptions | Explicit, justified, documented |
| 5 | Prevention over Correction | Prevent before fixing |
| 6 | Technological Independence | Frameworks are means, not axes |
| 7 | Responsible Autonomy | Clear limits → freedom to act |
| 8 | Conscious Evolution | Structured change, not improvised |
| **Meta** | Doctrinal Self-Criticism | The doctrine reforms without losing identity |

---

## Foundation: Sovereignty as Self-Governance

Before individual principles, a central definition:

> *"Un sistema soberano puede evolucionar sin perder identidad estructural."*

**Sovereignty ≠ technological independence**. It is **structural independence**: the system can integrate new technologies, adopt new tools, and scale teams **without fragmenting its fundamental criteria**.

### Operational self-governance

Self-governance means the system **does not depend on constant vigilance** to preserve coherence. Its rules are internalized in its structure. Its limits are embedded in its design.

### The Law of Amplification

> *"Toda aceleración amplifica el estado estructural del sistema sobre el que actúa. Si el sistema es coherente, la velocidad consolida coherencia. Si el sistema es frágil, la velocidad acelera el colapso."*

This law governs **everything** that follows. Every principle exists to ensure the system is in condition to be accelerated without degrading.

---

## 1. Explicit Governance

Critical system rules **cannot be implicit** or depend on individual memory.

**Everything whose error is costly must be defined, documented, and accessible.**

### Symptoms of implicit governance:
- "Only Juan knows how that works"
- "We've always done it this way"
- "It's not written down, but everyone knows"

### Explicit governance means:
- Rules documented in code (ESLint, TypeScript)
- Patterns with real examples
- Traceable, reviewable decisions

### Governance as discipline, not bureaucracy

> *"La diferencia entre improvisación e innovación es la existencia de un marco."*

Governance is not a permissions system. It is a system of **conscious limits**. It doesn't eliminate variation — it eliminates **contradictions**. It is not an additional layer over development — it is the **structure that sustains it**.

- Without governance: cumulative variability → entropy
- With governance: **cumulative evolution** → coherence

---

## 2. Clear Domain Separation

Each system responsibility must have **clear and defensible boundaries**.

**Mixing domains generates accidental complexity and hinders change.**

### Essential vs accidental complexity

| Type | Origin | Management |
|------|--------|------------|
| **Essential** | Inherent to the modeled domain | Inevitable — accept and structure |
| **Accidental** | Product of how it's modeled | Manageable — reduce with governance |

> *"La complejidad no es enemiga del progreso. El problema surge cuando la complejidad supera la capacidad de gobernanza."*

### In practice:
```
┌─────────────────────────────────────────┐
│ Domain (pure logic)                     │ → NO frameworks, NO IO
├─────────────────────────────────────────┤
│ Infrastructure (implementations)        │ → Prisma, Redux, HTTP
├─────────────────────────────────────────┤
│ Presentation (UI)                       │ → React, styled-components
└─────────────────────────────────────────┘
         Dependencies point INWARD
```

### Common violations:
- Component with business logic
- Use Case importing React
- Repository returning UI data

---

## 3. Architecture as Asset

Architecture **is not a byproduct of code**.

It is a **collective asset** that must be protected, evolved consciously, and kept aligned with the business.

> *"La arquitectura no emerge — se decide. Incluso cuando no se declara explícitamente, todo sistema tiene arquitectura. La diferencia es que cuando esa estructura no está formalizada, su coherencia depende del azar histórico."*

### Implications:
- Architecture has an owner (not "nobody's")
- Architectural changes require review
- Technical debt is managed, not ignored
- Architecture value is communicated to the business

### Cognitive continuity

Cognitive continuity allows new team members to understand principles **without reconstructing the complete history**. It enables future decisions to align with original intent **without subjective interpretation**.

### Preserve ≠ freeze

| Concept | Meaning |
|---------|---------|
| **Change** | Conscious evolution |
| **Alteration** | Modification without structural reference |
| **Preserve** | Protect the intent — allow evolution |
| **Freeze** | Prevent adaptation — generate rigidity |

### Architectural health metrics:
- Cost of adding a new feature
- Onboarding time for new developers
- Frequency of bugs from "small" changes

### Architecture as financial asset

> *"La previsibilidad no es un valor estético; es un valor económico."*

See `doctrine/business-impact.md` for the complete economic analysis.

---

## 4. Controlled Exceptions

Sovereignty **does not prohibit exceptions**. It **regulates** them.

Every exception must be:
- **Explicit** — Documented in code
- **Justified** — With technical or business reason
- **Documented** — So others understand
- **Temporary** (when applicable) — With review date

### Structural debt (beyond technical debt)

| Type | Example | Risk |
|------|---------|------|
| **Technical debt** | Poorly written function | Local, fixable |
| **Structural debt** | Unsystematized decisions, accumulated exceptions, implicit dependencies, poorly delimited domains | Systemic, compounding |
| **Contextual debt** | Incomplete domain interpretation conditioning all subsequent architecture | Foundational, costly |

> *"La deuda estructural, entendida como deuda soberana: útil en situaciones excepcionales, peligrosa cuando se normaliza."*

### Exception format:
```typescript
// EXCEPTION: [REASON] - [DATE] - [OWNER]
// Justification: [Why it's needed]
// Resolution plan: [How it will be eliminated]
// eslint-disable-next-line custom/rule-name
```

**Permanent improvisation is incompatible with sovereignty.**

---

## 5. Prevention over Correction

Sovereign governance prioritizes **preventing structural errors before correcting them after**.

### Error cost pyramid:
```
                    △
                   /│\
                  / │ \      Production ($$$$$)
                 /  │  \
                /   │   \    QA ($$$$)
               /    │    \
              /     │     \   Code Review ($$$)
             /      │      \
            /       │       \  Development ($$)
           /        │        \
          /         │         \ Design ($)
         ───────────┴───────────
```

### Preventive mechanisms:
- TypeScript strict mode
- ESLint with custom rules
- Pre-commit hooks
- Pattern documentation
- Structured code review

### Verifiable contracts as sovereignty devices

> *"Linters, validadores y sistemas de análisis no son accesorios — son **dispositivos de soberanía**, mecanismos de control constitucional del sistema."*

| Mechanism | Sovereign function |
|-----------|-------------------|
| TypeScript strict | Explicit contract between layers |
| ESLint custom rules | Structural immune system |
| Pre-commit hooks | Constitutional pre-validation |
| CI/CD gates | Final conformity tribunal |

> *"La gobernanza no debe depender de la memoria humana constante. Debe materializarse en mecanismos reproducibles."*

---

## 6. Technological Independence

**Frameworks, tools, and platforms are means, not system axes.**

Business domain and critical logic must be able to **survive technological changes**.

### Independence test:
> "Could we switch from React to Vue without rewriting business logic?"
> "Could we switch from Prisma to Drizzle without touching Use Cases?"

### In practice:
```typescript
// WRONG — coupled to framework
const useCreateUser = () => {
  const [user, setUser] = useState(null);
  // Business logic mixed with React
};

// CORRECT — independent
// Pure Use Case (can run without React)
const executeCreateUser = async (data: CreateUserRequest) => {
  // Pure business logic
};

// Hook only orchestrates
const useCreateUser = () => {
  return { createUser: (data) => dispatch(executeCreateUser(data)) };
};
```

### Sovereignty as meta-architecture

Sovereignty does not compete with existing architectures — it **recontextualizes** them for the AI era.

| Architecture | What it solves | What sovereignty adds |
|-------------|---------------|----------------------|
| **Clean Architecture** | Domain protection | Protection is also **procedural** — governs how layers are modified under acceleration |
| **Hexagonal** | Ports and adapters | Ports don't guarantee coherence if changes aren't governed |
| **DDD** | Bounded contexts | Extends clarity toward governing how contexts **evolve** |
| **Agile** | Adaptability | Structures agility — iterates within **explicit limits** |
| **DevOps/SRE** | Reliability | Focuses on the **prior** stage: governance before code reaches production |

> *"Las arquitecturas clásicas describen cómo organizar el sistema; la soberanía describe cómo organizar su **transformación**."*

---

## 7. Responsible Autonomy (Protected Autonomy)

Sovereignty **does not centralize operational decisions**.

It defines **clear limits** so teams can act autonomously **without generating systemic risk**.

### Protected Autonomy

Governance doesn't just allow autonomy — it **protects** it:

| Dimension | Meaning |
|-----------|---------|
| Teams retain **autonomy in how to implement** | Technical freedom within clear limits |
| The common framework **protects** teams | Against high-risk decisions made under pressure |
| Governance **does not reduce freedom** | It reduces **uncertainty** |

> *"La autonomía no es ausencia de reglas. Es libertad dentro de límites claros."*

### Federated sovereignty

When the technological system becomes a constellation of teams, domains, and platforms, sovereignty must **federalize**.

**Principle**: Local autonomy within shared limits.

| Aspect | Meaning |
|--------|---------|
| Each technical domain acts as internally **sovereign territory** | Defines its own rules, patterns, and evolution pace |
| Recognizes a **superior technical constitution** | Regulating interaction between territories |
| Establishes **minimum coherence contracts** | Does not impose absolute uniformity |

> *"La diversidad es legítima; la incoherencia no."*

### Autonomy matrix:

| Decision | Autonomy level |
|----------|---------------|
| Variable name | Total (team) |
| Component structure | High (existing pattern) |
| New library | Medium (technical review) |
| Architecture change | Low (formal approval) |

---

## 8. Conscious Evolution

**Change is inevitable. Sovereignty does not seek to stop it, but to structure it.**

It ensures each evolution **strengthens the system** rather than degrading it.

### Evolution vs Degradation:

| Conscious evolution | Unconscious degradation |
|--------------------|------------------------|
| Planned change | Permanent "quick fix" |
| Updated documentation | "I'll document it later" |
| Updated tests | "Tests can wait" |
| Team communication | "Only I need to know" |

### Evolutionary predictability

A living architecture acquires **predictability**: not that the future can be anticipated in detail, but that the **limits within which change will occur** are defined.

> *"La IA puede modificar la superficie del sistema con velocidad; la soberanía determina qué tan profundo puede penetrar sin alterar el núcleo."*

### Evolution protocol:
1. **Propose** — Document the change and justification
2. **Review** — Evaluate architectural impact
3. **Approve** — Obtain technical consensus
4. **Implement** — Execute with tests
5. **Document** — Update patterns/standards
6. **Communicate** — Inform the team

---

## Meta-Principle: Doctrinal Self-Criticism

No doctrine aspiring to longevity can sustain itself without examining its own limits.

> *"La fortaleza de un marco no reside en su capacidad de imponerse sin fricción, sino en su capacidad de **reformarse sin perder identidad**."*

### 5 Identified Risks

| Risk | Description | Mitigation |
|------|-------------|------------|
| **Dogmatism** | Sovereign principles become immovable rules; architecture crystallizes into relic | The essence of sovereignty is the capacity for deliberate reform |
| **Bureaucratization** | Intermediate documents degenerate into empty formalism | The method must stay alive, not automated; discipline through understanding, not ritual |
| **Authority concentration** | Orchestrator role becomes authoritarian centralization | Sovereignty distributes responsibility within clear limits; requires transparency and dialogue |
| **Coherence ≠ Uniformity** | Doctrine interpreted as imposing total homogeneity | Complex systems require **controlled variety**; uniformity limits necessary exploration |
| **Automated complacency** | Team delegates not just execution but also prior reflection | Sovereign method requires active human deliberation; AI executes, humans delimit |

---

## Judgment as the Ultimate Governance Layer

No normative structure can anticipate every future scenario. Judgment is the **irreducible human core**.

> *"El criterio no es intuición improvisada ni opinión subjetiva. Es la capacidad de evaluar una situación particular a la luz de principios estructurales y anticipar las consecuencias sistémicas de una decisión."*

### Governance progression

```
Rules           →  Formal base, automatically verifiable
    ↓
Governance      →  Framework giving meaning to rules and connecting them
    ↓
Judgment        →  Human evaluation when rules don't suffice
```

> *"La soberanía no reside únicamente en la existencia de reglas, sino en la capacidad de aplicarlas con comprensión profunda de su propósito."*

---

## The 6 Technical Principles (Implementation)

The 8 doctrinal principles materialize in **6 technical principles** for code:

| # | Technical Principle | Code application |
|---|-------------------|-----------------|
| 1 | Territorial Integrity | Each layer owns its territory |
| 2 | Non-Intervention | Dependencies point inward |
| 3 | Self-Sufficiency | Self-contained modules |
| 4 | Clear Borders | Interfaces = treaties |
| 5 | Trade Agreements | Data flows through protocols |
| 6 | Secure Trade | Return ONLY what's requested |

**Detail**: See `core/architecture/clean-architecture.md`

---

## Principle Validation

Before any significant change, ask:

- [ ] Are rules explicit? (Principle 1)
- [ ] Does it respect domain boundaries? (Principle 2)
- [ ] Does it strengthen or weaken architecture? (Principle 3)
- [ ] Are exceptions documented? (Principle 4)
- [ ] Does it prevent future problems? (Principle 5)
- [ ] Does it depend on specific frameworks? (Principle 6)
- [ ] Does it allow responsible autonomy? (Principle 7)
- [ ] Is the change conscious and structured? (Principle 8)
- [ ] Does the doctrine remain reformable? (Meta-principle)

---

## Doctrinal Quotes

| Quote | Source |
|-------|--------|
| *"Un sistema soberano puede cambiar porque sabe qué no debe romperse"* | Ch. 2 |
| *"El modelo heroico es un síntoma de talento. La soberanía es un síntoma de madurez"* | Ch. 4 |
| *"La libertad sin límites genera entropía; la libertad estructurada genera innovación sostenible"* | Origin |
| *"La diversidad es legítima; la incoherencia no"* | Ch. VI |
| *"La soberanía no es un cargo. Es una forma de pensar frente a la complejidad"* | Ch. Final |

---

## Related

- `doctrine/index.md` — What is Code Sovereignty
- `doctrine/governance-role.md` — The role that custodians these principles
- `doctrine/governance-cycle.md` — Application in the development cycle
- `doctrine/ai-acceleration.md` — Principles applied to AI
- `doctrine/business-impact.md` — Business impact
- `core/architecture/clean-architecture.md` — Technical implementation
