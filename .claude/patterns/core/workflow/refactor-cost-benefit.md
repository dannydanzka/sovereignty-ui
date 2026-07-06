# Pattern: Refactor Cost-Benefit Framework

> **Module**: core/workflow
> **Version**: 1.0
> **Purpose**: Govern the refactor decision during feature delivery — depth, timing, justification, and ROI
> **Updated**: 2026-04-02

---

## The Core Argument

Refactors are systematically underestimated because their benefits are **not immediately visible**.

A refactor rarely improves performance today. It rarely eliminates a visible bug. It does not ship a feature.

What it does:
- Reduces the cost of every future change in that domain
- Prevents bugs that do not exist yet
- Extends the productive life of the module before it reaches legacy status
- Reduces the cognitive load on every developer who touches it afterward

> *"The cost of a refactor today is certain. The cost of NOT refactoring compounds invisibly until the module becomes too expensive to change safely."*

This pattern provides the framework to make that invisible cost visible — and to govern how deep a refactor goes relative to the ticket's scope and estimate.

---

## When This Pattern Applies

Invoke this pattern during **SCD Phase 4.12** (Status Snapshot) and **Phase 6** (Plan), after reading the code context and before creating the implementation plan.

The question is never "should we refactor?" in the abstract. It is always:
> *"Given what I found in the code, given the time estimated for this ticket, and given the criticality of this module — what level of refactor is responsible right now?"*

---

## The 4 Refactor Tiers

| Tier | Name | What changes | Business logic touched? | Who decides |
|------|------|--------------|-------------------------|-------------|
| **0** | None | Feature implementation only | No | Developer |
| **1** | Surface | File extensions, type annotations, remove dead code, fix linter violations, add interfaces to touched files | No | Developer |
| **2** | Structural | Split god components, extract hooks, reorganize state shape, improve module boundaries | No | Developer + Tech Lead |
| **3** | Architectural | Redesign data flow, change state management pattern, restructure module hierarchy | No | Formal approval — separate ticket |

**Invariant across all tiers**: Business logic is NEVER touched during a refactor. The refactor improves the container. The contents remain identical.

---

## Comparison Table

> Use this table to communicate the decision to the team and justify the chosen tier.

| Dimension | Tier 0 (None) | Tier 1 (Surface) | Tier 2 (Structural) | Tier 3 (Architectural) |
|-----------|--------------|-----------------|---------------------|------------------------|
| **Scalability (short-term)** | None | Minor: typed interfaces reduce misuse | Moderate: smaller units are easier to extend | High: clean boundaries support domain growth |
| **Scalability (medium-term)** | Code grows harder to extend | New features can reuse typed contracts | Each hook/component can evolve independently | New modules integrate without coupling debt |
| **Scalability (long-term)** | Module becomes a change bottleneck | Foundation for future structural work | Module can absorb 2-3x features without rewrite | Architecture survives team and framework changes |
| **Maintainability** | None | Interfaces expose intent; less guesswork | Focused files are easier to understand and debug | Clear layers; each layer has single responsibility |
| **Readability** | None | Types document data shape; TS errors catch misuse early | Small components/hooks are fully readable; no cognitive overload | Architecture mirrors domain; new devs orient in minutes |
| **Estimation risk** | Low (no structural change) | Low-Medium: type errors may surface hidden bugs | Medium: splitting components can reveal hidden coupling | High: architectural work is exploratory; scope can expand |
| **Adaptability to business change** | Low: changes require understanding large units | Moderate: typed contracts reduce misinterpretation | High: isolated units absorb requirements independently | Very high: new business rules fit existing boundaries |
| **Cost of NOT doing it (how it hurts)** | Acceptable short-term | Growing: next developer inherits untyped, opaque code | Compounding: every future feature in this context costs more | Critical: module becomes a liability; rewrites become necessary |
| **Future feature cost in same context** | High: next feature inherits current state | Moderate: typed contracts reduce integration time | Low: each new feature has a clear, isolated place to go | Very low: domain is self-sufficient; features slot in cleanly |
| **Implementation cost now** | Zero | Low: 1-4 hours per file | Medium: 1-3 days for focused restructuring | High: dedicated sprint or initiative |
| **Risk to current ticket estimate** | None | < 10% overhead | 20-40% overhead; requires Tech Lead sign-off | Out of scope — must be a separate ticket |

---

## Time Budget Decision

The ticket estimate is the primary constraint. Use this as a guide:

| Estimated ticket size | Maximum refactor tier | Rationale |
|----------------------|----------------------|-----------|
| < 4 hours (hotfix) | Tier 0 only | No time budget for structural changes |
| 4-8 hours (small story) | Tier 1 on touched files | Surface cleanup within normal delivery |
| 1-3 days (medium story) | Tier 1 full + selective Tier 2 | With Tech Lead alignment on scope |
| > 3 days (large story/epic) | Tier 1 + Tier 2 with approval | Structural work justified by surface area |
| Dedicated refactor ticket | Tier 2 or Tier 3 | Only acceptable context for deep restructuring |

**Rule**: If the refactor scope exceeds the estimate by more than 20%, stop and create a separate refactor ticket. Do not silently expand the original ticket.

---

## Module Criticality Index

Not all modules carry the same risk for code changes. Before deciding on refactor tier, classify the module:

| Criticality | Definition | Modules (YourCompany web) | Refactor impact |
|-------------|-----------|--------------------------|-----------------|
| **Critical** | Any bug or regression causes direct revenue loss or user data risk | `mod-pedido-electronico`, `mod-canjes`, `mod-altas`, `mod-pago-en-linea` | Every structural change requires full regression + QA sign-off; estimate risk is HIGH |
| **High** | Bugs affect core user workflows; visible to most users | `mod-carrito`, `mod-credito`, `mod-auth`, `mod-perfil` | Structural refactors require Tech Lead approval; estimate risk is MEDIUM-HIGH |
| **Medium** | Bugs degrade UX but do not cause data loss or critical failures | `mod-admin`, `mod-devoluciones`, `mod-consultas`, `mod-notificaciones` | Structural refactors with normal review process; estimate risk is MEDIUM |
| **Low** | Internal tools, rarely-used flows, or isolated experiences | `mod-herramientas`, `mod-encuestas`, `mod-template`, `mod-prospectos-web` | Refactor freely within time budget; estimate risk is LOW |

> *"A god component in `mod-template` is a maintenance cost. A god component in `mod-pedido-electronico` is a ticking incident waiting for the next release cycle."*

**Rule**: For Critical modules, refactor tier must be discussed with the Tech Lead before including in the plan. Tier 2 in a Critical module requires a dedicated ticket regardless of estimate size.

---

## TypeScript Migration Argument

TypeScript migration is systematically undervalued in planning. It belongs in the same framework as structural refactoring.

### What TypeScript migration actually delivers:

| Benefit | Mechanism | Timeline |
|---------|-----------|----------|
| **Team comprehension** | Types document the shape of every data structure — new devs read the type, not the API | Immediate |
| **Error prevention** | Compile-time errors catch misuse before runtime — and before QA | Immediate |
| **Error tracking quality** | Typed stack traces map to known interfaces; easier to reproduce and fix | Short-term |
| **Refactor safety** | Changing a type propagates errors to every consumer — instant regression detection | Medium-term |
| **Legacy extension** | Typed modules can be extended confidently; untyped ones require full re-reading | Long-term |
| **Reduced bus factor** | Knowledge is encoded in types, not in the memory of whoever wrote it | Long-term |

### The lifecycle argument

Untyped JS modules enter **legacy state faster** because:
- Every change requires rereading the entire flow to understand data shapes
- Bugs introduced by misunderstood data shapes are invisible until runtime
- New developers cannot navigate without an experienced guide

A TypeScript migration adds 20-40% overhead to the immediate ticket. It reduces maintenance cost by an estimated 30% for every subsequent ticket in that domain.

> *"Every JS file migrated to TypeScript is a loan repayment on contextual debt. Every JS file left unmigrated is interest accumulating."*

### Migration scope per tier:

| Tier | TypeScript migration scope |
|------|---------------------------|
| Tier 0 | No migration |
| Tier 1 | Touched files only — add interfaces, type annotations, fix implicit `any` |
| Tier 2 | Module-level — all files in affected domain |
| Tier 3 | Architecture-wide — requires dedicated planning |

---

## The Invisible ROI Problem

Refactors do not ship visible features. They do not improve performance benchmarks. They do not eliminate current bugs.

This makes them easy to deprioritize in sprint planning. Product managers see no user-visible output. Estimations don't account for future cost reduction.

### How to make the ROI visible:

| Invisible benefit | How to quantify |
|-------------------|----------------|
| Reduced future development time | "Next 3 features in this module will cost 30% less if we refactor now" |
| Reduced incident risk | "This module has X% of our production incidents despite being Y% of the codebase" |
| Reduced onboarding friction | "New developer spent N hours understanding this module last sprint" |
| Reduced regression surface | "Last 3 PRs in this module caused unintended side effects" |

### The compounding cost argument

Technical debt in high-traffic modules compounds:
1. Developer spends extra time understanding the code (cost: time)
2. Developer makes an incorrect assumption due to lack of types (cost: bug)
3. Bug reaches production (cost: incident + hotfix sprint)
4. Hotfix adds more unstructured code to the already-fragile module (cost: compounding debt)

One refactored module breaks this cycle. The cost is paid once. The saving repeats on every future ticket.

> *"The question is never whether the module will be refactored. It is whether it will be refactored now, at controlled cost, or later, in crisis."*

---

## Decision Protocol (In Practice)

During SCD Phase 4 (after reading the code, before the plan):

```
1. Read status snapshot → identify code health issues
2. Classify module criticality → Critical / High / Medium / Low
3. Check ticket estimate → determine maximum tier from time budget table
4. Cross-reference criticality + tier → if Critical + Tier 2, must discuss with Tech Lead
5. Document decision in plan:
   - Refactor tier chosen: [0 / 1 / 2 / 3]
   - Justification: [why this tier]
   - What is explicitly excluded: [what would require a separate ticket]
   - Risk acknowledgment: [if not refactoring, document what that means for future tickets]
```

**If recommending NO refactor**, document the deferred cost explicitly:
> "Tier 0 chosen for this ticket. Current state: [describe technical debt found]. Future cost: [describe impact on next feature in this domain]. Recommended: create refactor ticket TASK-IDXXXX to address before next sprint in this module."

This closes the loop. Deferred refactor debt is not ignored — it is tracked.

---

## Status Snapshot Format (`.claude/status/STATUS-{TICKET-KEY}.md`)

This document is produced at the end of SCD Phase 4.12 (code reading). It is the input for the refactor decision.

```markdown
# Status Snapshot: {TICKET-KEY}
> **Module**: {module/context}
> **Date**: {date}
> **Author**: {developer}

## Code Inventory

| File | Type | Lines | JS/TS | Has Tests | Notes |
|------|------|-------|-------|-----------|-------|
| path/to/service.js | Service | 280 | JS | No | Handles all X logic — large |
| path/to/reducer.js | Reducer | 120 | JS | Partial | 18 cases — approaching bloat |
| path/to/Screen.js | Screen | 450 | JS | No | God component |
| path/to/Component.jsx | Component | 80 | JS | Yes | Clean, reusable |

## Architecture Health

| Check | Status | Detail |
|-------|--------|--------|
| Cross-module imports | ❌ Found | mod-X imports from mod-Y (line 45) |
| Direct API calls in components | ✅ Clean | All via sagas |
| `any` types | ⚠️ N/A | JS — no types at all |
| Inline styles | ❌ Found | 3 components use inline style objects |
| Component size (>300 lines) | ❌ Found | Screen.js (450 lines) |

## Technical Debt Inventory

| Debt item | Type | Severity | Impact on this ticket |
|-----------|------|----------|----------------------|
| Screen.js is a god component | Structural | High | Must add feature here — will make it worse |
| No TypeScript types in module | Surface | Medium | Data flow opaque, risk of misuse |
| Reducer has 18 cases | Structural | Medium | Adding 2 more cases this ticket |
| No unit tests for service | Quality | High | Cannot validate behavior changes safely |

## Refactor Recommendation

**Module criticality**: {Critical / High / Medium / Low}
**Chosen tier**: Tier {0 / 1 / 2 / 3} — {name}
**Justification**: {1-2 sentences}
**Excluded (deferred)**: {what is out of scope and why}
**Deferred cost**: {impact on next tickets if not done now}

## Reference Implementation

Best existing pattern in codebase for this domain:
- {path/to/best-example.tsx} — {why it is the reference}
```

---

## Related

- `methodology/development/scd.md` — Phase 4.12 where this pattern is invoked
- `methodology/development/scg.md` — Phase 7.3 and 8.2 where refactor depth is governed during execution
- `core/workflow/investigation-first.md` — Investigation before code
- `doctrine/principles.md` — Principle 5: Prevention over Correction
