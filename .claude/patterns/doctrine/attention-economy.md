# The Attention Economy

> **Module**: doctrine
> **Version**: 1.0
> **Updated**: 2026-04-12
> **Author**: Roberto Ramírez
> **Related**: [context-as-territory.md](context-as-territory.md), [principles.md](principles.md) (Principle 5 — Prevention over Correction)

---

## TL;DR

Context is a scarce resource with cognitive cost, not an infinite convenience buffer.

Every skill, MCP, pattern, or line of documentation loaded into an AI session competes for a finite attention budget. Adding more is not free — it dilutes focus, increases hallucination, and slows execution.

The discipline is simple: **load only what the model cannot infer on its own**.

---

## The Industry Antipattern

The current state of AI tooling resembles the `npm` ecosystem circa 2016: a skill for every micro-task, an MCP for every API, a slash command for every workflow. The assumption is that more capabilities equal more power.

The assumption is false.

A Claude session loaded with 47 skills is not 47× more capable. It is 47× more distracted. Each skill competes for attention at inference time. Each MCP is a dependency that can corrupt state. Each custom command is context weight that must be parsed even when unused.

This is the `left-pad` problem applied to AI: infinite tiny abstractions that collectively weigh more than they enable.

---

## The Non-Inferable Principle

> *Document only what the model cannot infer on its own.*

Pretrained models already know:

- Language syntax (JavaScript, TypeScript, Python, SQL, etc.)
- Framework idioms (React hooks, Redux patterns, Next.js routing)
- Git workflow, commit conventions, PR etiquette
- Common design patterns (Factory, Observer, Repository)
- Tooling basics (ESLint, Prettier, Jest, Vitest)

Loading documentation for any of these is noise. The model will reproduce these patterns correctly whether or not the documentation is in context.

What the model **cannot** infer:

- Business decisions and their historical justification
- Team conventions that deviate from industry defaults
- Architectural trade-offs specific to the project
- Integration contracts with internal services
- Constraints imposed by legacy systems
- Organizational vocabulary, process, and stakeholders

These are the legitimate inhabitants of the context window. Everything else is decoration.

---

## Cost of Attention

Every element loaded into context has three costs:

| Cost | Description |
|------|-------------|
| **Token cost** | Literal tokens consumed in the context window, reducing room for actual work. |
| **Attention cost** | Distribution of model focus — more content competing means less precision on any single part. |
| **Maintenance cost** | Human time to keep the content current. Stale context is actively harmful (misleads the model). |

A rule that saves 30 seconds of model inference but requires 10 minutes per quarter to maintain is net negative.

---

## Practical Heuristics

### Before adding a skill, MCP, pattern, or SOP, ask:

1. **Is this inferable from the model's pretraining?**
   If yes → do not document.

2. **Is this genuinely specific to this project / team / org?**
   If no → it belongs somewhere more general (or not at all).

3. **Will this be referenced at least 3 times per month?**
   If no → inline the knowledge in the one place it's needed, don't create a pattern.

4. **Is there an existing pattern that covers this?**
   If yes → extend or reference it, don't duplicate.

5. **Does this replace something older that should be pruned?**
   If yes → prune simultaneously. Additions without deletions create sprawl.

### Before installing an MCP server, ask:

1. Does the model need real-time data this MCP provides?
2. Is the frequency of need high enough to justify permanent loading?
3. Can a one-off web fetch or CLI call accomplish the same result?

Most "nice to have" MCPs fail these questions.

### Before creating a custom skill / command, ask:

1. Is this actually repetitive (>5 invocations per week)?
2. Would a prompt template serve equally well?
3. Is the value high enough to justify permanent attention cost?

---

## The Minimum Viable Context

A well-curated sovereignty system for one project should contain:

- **Doctrine**: the *why* — small, stable, rarely read but critical when consulted.
- **Core patterns**: cross-discipline practices that are non-obvious.
- **Discipline patterns**: framework-specific decisions that deviate from defaults.
- **Business patterns**: the domain knowledge, API contracts, integration rules.
- **Rules**: auto-loaded project-specific directives.

Everything beyond this should justify its existence against the non-inferable principle.

**Target**: under 60 files, under 6,000 lines, for a mature project context.

---

## Anti-Patterns

| Antipattern | Example | Fix |
|-------------|---------|-----|
| **Documenting syntax** | A pattern explaining how to write a React hook | Delete. Model knows this. |
| **Skill for a one-liner** | A custom skill that runs `git status` with formatting | Delete. Use the CLI directly. |
| **MCP for static data** | An MCP loading constants that change yearly | Delete. Inline the constants where needed. |
| **Redundant wrappers** | A pattern that restates what context7 would return | Delete. Use context7 on demand. |
| **Indexes of indexes** | Navigation files pointing to navigation files | Collapse or delete. |
| **Copy of industry standard** | A pattern explaining SOLID, Clean Code, or REST | Delete. These are in pretraining. |

---

## Governance

This doctrine informs the pruning procedure in [core/sops/context-pruning.md](../core/sops/context-pruning.md).

When in conflict with convenience, attention economy wins. A cleaner, smaller context that forces occasional lookup is preferable to a bloated context that degrades every inference.

---

> *"The model is not the bottleneck. Attention is."*
