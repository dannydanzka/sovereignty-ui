# SOP: Sovereign Context Design (SCD) — Legacy Deep Reference

> **STATUS**: Legacy exhaustive reference (9 phases). For the always-loaded orchestrator, see [SCD.md](SCD.md). Keep this when you need the long-form checklist; use the orchestrator for day-to-day execution.
> **PURPOSE**: Transform organizational ambiguity (a ticket, a requirement, a conversation) into a formal intention artifact that AI and the developer consume — not infer
> **SCOPE**: Any software development project using AI-assisted development
> **PREREQUISITE**: Access to project management tool (Jira, Linear, GitHub Issues, etc.) and codebase
> **UPDATED**: 2026-03-23

---

## What This SOP Is

SCD is the discipline of **intention before implementation**. It separates context from code.

Before a single line is written, SCD absorbs organizational ambiguity and transforms it into formal intention artifacts. This SOP covers everything BEFORE code. For code execution, see `sovereign-code-governance.md`.

> *"La calidad, la estabilidad y el costo futuro del software se definen ANTES de escribir codigo."*
> Quality, stability, and the future cost of software are defined BEFORE writing code.

**This is a methodology, not a project checklist.** SCD applies to any codebase, any platform, any team. The principles are platform-agnostic; only the tooling adapts per project.

---

## The Reconciled Method — 9 Phases

```
SCD (this SOP)                          SCG (sovereign-code-governance.md)
 1. REFRAME   — Is the task correctly framed?
 2. INTENT    — Absorb and document the requirement
 3. QUESTION  — Proactive interrogation (what nobody asks)
 4. DOMAIN    — Investigate the territory to intervene
 5. SPEC      — Formalize acceptance criteria
 6. PLAN      — Strategy of controlled change
                                         7. EXECUTE   — Code subordinated to architecture
                                         8. VALIDATE  — Structural alignment + feedback
                                         9. FEEDBACK  — Post-deployment improvement cycle
```

Phases 1-6 produce the **Contextual Architecture** that the AI consumes during SCG. Phase 9 closes the governance cycle feeding lessons back into SCD/SCG.

---

## Outputs

| Artifact | Path | Role |
|---|---|---|
| **Business context document** | `.claude/business/{TICKET-KEY}-{slug}.md` | Single source of truth — replaces all scattered sources |
| **Implementation plan** | `.claude/plans/PLAN-{TICKET-KEY}.md` | Strategy of controlled change with explicit scope |
| **Updated SOPs/patterns** | `.claude/patterns/` or project-specific docs | Living doctrine — reforms itself without losing identity |

**Unification of truth:** Once the business doc exists, it IS the single source of truth. Ticket comments, external docs, and verbal answers become historical sources, not operative ones. The AI reads the business doc, not the originals.

---

## SCD Checklist — All Must Pass Before Code

- [ ] Task reframed — domain assignment validated (Phase 1)
- [ ] Business problem documented (Phase 2)
- [ ] Proactive questions answered — blind spots exposed (Phase 3)
- [ ] Domains affected identified — modules, services, state (Phase 4)
- [ ] Cross-platform impact assessed — if applicable (Phase 4)
- [ ] Architecture scalability evaluated — refactor needed? (Phase 4)
- [ ] Structural impact assessed — [High/Medium/Low] with justification (Phase 4)
- [ ] Contextual debt identified — assumptions listed, discrepancies resolved (Phase 4)
- [ ] Risks documented — pending dependencies, mock strategy if needed (Phase 4)
- [ ] Acceptance criteria formalized — technical, not business language (Phase 5)
- [ ] Implementation plan approved — exact files, code snippets, ordered steps (Phase 6)
- [ ] Scope AND out-of-scope explicit (Phase 6)
- [ ] Developer validated conclusions — AI assisted investigation; human validates interpretation

---

## Phase 0 — Workspace Setup

Clone or navigate to the target repository. Create a feature branch following your project's branching convention.

```bash
# Example workspace setup
cd ~/projects
git clone <repo-url> TICKET-XXXX
cd TICKET-XXXX && git checkout -b feature/TICKET-XXXX-short-description
```

**Why a dedicated folder:** One folder = one branch = one context. Named folders prevent branch confusion and keep `.claude/` artifacts scoped to the task.

---

## Phase 1 — REFRAME

> *"Suspend the task label and analyze the real domain."*

Before reading anything, the developer asks:

| Question | Purpose |
|---|---|
| Does this task belong to the domain where they placed it? | Prevent dragging an incorrect domain interpretation |
| Is the scope what the title suggests, or is it broader/narrower? | Prevent scope drift during investigation |
| Which platform(s) are affected? | Prevent discovering cross-platform scope mid-implementation |
| Which module actors are likely involved? | Focus investigation |

**Output:** A mental model of the task's real domain. If the reframe reveals a fundamentally different task, raise it with the reporter before proceeding.

---

## Phase 2 — INTENT (Documented Intention)

**Objective:** Consolidate all organizational context (tickets, wiki, attachments, comments) into structured knowledge.

### 2.1 Read the task/ticket

Read the full ticket with all comments, attachments, and changelog.

Capture: summary, description, status, priority, assignee, reporter, **parent ticket key** (if subtask), fix version.

### 2.2 Read the parent story (if applicable)

The subtask captures the assignment. The parent captures the business problem, domain decisions, and stakeholder answers.

Capture: full business description, **ALL comments** (business rules, Q&A, PO answers), fix version, linked issues.

### 2.3 Read all sibling tasks

Classify as BE/FE/QA/Mobile/etc. Note:
- Pending backend tasks — incomplete backend = mock strategy required
- Cross-platform tasks exist — coordination required
- QA task assignee — future test coordination contact

### 2.4 Get development info (PRs & branches)

Capture: all PRs (ID, branch, status, merge date), commit messages, active branches, repository names (confirms which repos are involved).

### 2.5 Download and read attachments

Look for design specs, business rule documents, images. Extract text from documents when needed.

---

## Phase 3 — QUESTION (Proactive Interrogation)

> *"The questions nobody asks are the ones that define the cost of software 6 months later."*

**This phase is what separates a sovereign engineer from a task executor.** The developer (or AI) must actively interrogate the requirement BEFORE investigating the codebase.

### 3.1 Structural Questions (architecture-level)

| Question | What it catches | Who should answer |
|---|---|---|
| Does this feature already exist on another platform? | Duplicate effort, naming divergence | Developer (grep both repos) |
| What happens to existing data when this field is added? | Migration risk, null handling | Backend lead |
| Is this a new data node or a modification to an existing one? | Regression risk assessment | Backend lead |
| Does the API return empty array `[]` or omit the field entirely? | Guard logic, null vs undefined handling | Backend developer |
| Is the API contract shared across platforms, or are there separate endpoints? | Contract divergence risk | Backend lead |

### 3.2 Business Blind Spot Questions (what stakeholders don't ask)

| Question | What it catches |
|---|---|
| What happens when this feature is active but the user has no qualifying data? | Empty state UX — POs rarely spec this |
| What happens if the backend service is down? Does the frontend degrade gracefully? | Resilience — never in business specs |
| Can this data change between page load and user action? (race condition) | Stale data — invisible in mockups |
| Does this affect historical records, or only new ones? | Retroactivity — often assumed but never confirmed |
| Is this feature behind a feature flag, or always on? | Rollback strategy |
| Does this feature behave differently per user role? | Role-based rendering — often under-specified |
| Does the i18n copy exist, or does the frontend need to define it? | Copy ownership — causes last-minute changes |

### 3.3 Technical Foresight Questions (preventing future errors)

| Question | What it catches |
|---|---|
| Will this component be reused in other screens? Shared or module-local? | Premature localization or premature extraction |
| Does the current state shape support this addition without breaking existing consumers? | State shape regression |
| Are there snapshot/integration tests that will break? | Noise in CI — not a blocker but needs awareness |
| If multiple platforms implement this differently, will QA need separate test plans? | QA coordination cost |
| Does this change payload size significantly? | Performance impact on slow connections |

### 3.4 Resolution Protocol

For each question:
1. **Can the developer answer from the code?** — Answer and document
2. **Needs confirmation from another team?** — Post as ticket comment, **block Phase 6 (PLAN) until answered**
3. **Cannot be answered now?** — Document as contextual debt with assumed answer and risk level

> *"An unanswered question is not a problem. An un-asked question is."*

---

## Phase 4 — DOMAIN (Investigated Domain)

**Objective:** Map the topology of the territory to be intervened — dependencies, contracts, existing patterns.

> *"Investigation (2-5 min) vs refactoring (hours). ROI: 10x faster, 100x more consistent."*

### 4.1 Business Domain: API contracts and wiki docs

Search your documentation system (Confluence, Notion, GitHub Wiki) for:
- API contracts (request/response shape)
- Prior tech docs (architectural reference)
- PM/UX spec pages

### 4.2 Read prior implementations for pattern reference

Search for prior implementations of analogous features. Commit messages reveal which tickets modified the same domain.

### 4.3 Identify affected modules

Confirm scope from ticket context, design specs, or backend answers. When in doubt, grep for where the analogous feature renders.

### 4.4 Cross-Platform Discovery (if applicable)

Before coding, check if the other platform already implemented this:

```bash
# Search for the feature identifier in the other platform's codebase
grep -r "featureIdentifier" /path/to/other-platform/src/ -l 2>/dev/null
```

Document findings:

| Aspect | Platform A | Platform B | Decision |
|---|---|---|---|
| Component name | `FeatureComponent` | N/A (new) | Use same name |
| State location | `featureReducer` | `featureReducer` | Same |
| Hook pattern | `useSelector` in component | `useFeature` custom hook | Adopt superior pattern |

**Rule:** When patterns differ between platforms, adopt the superior pattern and normalize. Document WHY one is better.

### 4.5 Search for existing similar feature (Investigation-First)

Read: model (interface/types), component (rendering), state integration (selector, reducer, action), page connection.

**Adapt (>=70% similar) or Create (following exact pattern).** Never reinvent.

### 4.6 Map the data flow

Answer by reading the code:
1. Where does the data enter the frontend? (service, endpoint)
2. Where is it stored in state? (reducer, store key)
3. Is there an existing interface to extend?
4. Which selector reads it? (existing or new?)
5. Where does the component render? (page, position)

### 4.7 Validate API endpoints (EP Validation)

Test every affected endpoint. Verify per endpoint:
- Response shape matches contract
- All expected fields present
- Business rules fire correctly
- **Field names consistent across endpoints** — discrepancies must be resolved before implementing

**If endpoint not available:** Activate mock response strategy. Flag dependency and proceed with documented assumptions.

### 4.8 Architecture Scalability Assessment

> *"Architecture is patrimony. Before intervening, assess whether the patrimony supports the intervention."*

Before adding to an existing module/reducer/component, answer:

| Question | Red flag | Action |
|---|---|---|
| Does the reducer have more than 15 cases? | State bloat | Consider splitting before adding |
| Does the component exceed 300 lines? | God component | Consider extraction before adding |
| Does the saga/thunk handle more than 5 side effects? | Orchestration bloat | Consider splitting |
| Is the hook returning more than 10 values? | Interface bloat | Consider splitting into focused hooks |
| Does this change require touching more than 3 modules? | Architectural coupling | Escalate — may need refactor first |
| Are there circular or cross-module imports? | Domain boundary violation | Must resolve before proceeding |

**Output:** `[Scalable]` — proceed as-is. `[Needs Refactor]` — document what needs refactoring, add to plan as Step 0.

### 4.9 Identify exact files to create/modify

List each file: package/module, path, action (ADD/CREATE/MODIFY), what exactly changes.

### 4.10 Assess contextual debt

> *"Contextual debt is an incomplete interpretation of the domain that conditions all subsequent architecture."*

Before moving to Phase 5, explicitly answer:

| Question | Answer |
|---|---|
| What am I assuming without verification? | List assumptions |
| What interpretations could be incorrect? | List risks |
| Do field names match across all endpoints? | Confirmed / Discrepancy found |
| Are there business rules I inferred rather than confirmed? | List and flag |
| Are there cross-platform inconsistencies I'm ignoring? | List and justify |

Unresolved contextual debt = **stop and clarify before proceeding**.

### 4.11 Assess structural impact

Classify: **[High / Medium / Low]** with justification.

| Level | Criteria |
|---|---|
| **High** | Modifies shared libs + multiple modules, OR cross-platform changes |
| **Medium** | Modifies 1-2 modules + shared lib types/models only |
| **Low** | Changes contained within a single module on a single platform |

---

## Phase 5 — SPEC (Formalized Specification)

**Objective:** Translate business requirements into explicit, verifiable acceptance criteria in technical language.

### 5.1 Formalize acceptance criteria

For each surface (module/screen), define:

```markdown
## Acceptance Criteria

### Surface: [Platform — Module — Screen]
- WHEN [condition] THEN [expected behavior]
- WHEN [empty/null/absent state] THEN [expected behavior]
- Guard: [expression that controls rendering]
- Data source: [State path]
```

### 5.2 Define the guard contract

The guard is the single expression that determines show/hide. Document it explicitly:

```
Guard: featureData?.length > 0
Empty state: [] (confirmed with backend)
Absent state: field missing -> same as empty (guard handles both)
```

### 5.3 Verify design alignment

**Design specs > documents > ticket description** for all UI decisions.

Extract: component structure, exact copy (UI text), position within screen, colors/typography tokens.

---

## Phase 6 — PLAN (Formulated Plan)

**Objective:** Create two formal artifacts — the business doc and the implementation plan.

> *"The technical plan is not a task list — it is a strategy of controlled change."*

### 6.1 Create the business context document

Path: `.claude/business/{TICKET-KEY}-{slug}.md`

Mandatory sections:
- Header (keys, version, status, estimate, **structural impact: [H/M/L]**, **platforms**)
- Business Overview (2-3 sentences + context)
- Design Spec (component visual spec)
- Business Rules (table)
- Actors & Stakeholders (table)
- Tasks Breakdown (table with status)
- API Contract (full JSON from validation + field reference table)
- EP Validation Results
- Acceptance Criteria (from Phase 5)
- Architecture Scalability Assessment (from Phase 4.8)
- Proactive Questions & Answers (from Phase 3)
- Scope (files to create/modify + explicit non-goals)
- Contextual Debt Assessment (from Phase 4.10)
- Risks
- Related Documents & References

**Token economy:** The business doc must contain only what the AI needs to execute. Be precise, not exhaustive.

### 6.2 Create the implementation plan

Path: `.claude/plans/PLAN-{TICKET-KEY}.md`

Mandatory sections:
- Header (branch, base, repo, modules, shared libs, **platform**)
- Confirmed Scope table
- Numbered steps ordered: interfaces -> models -> state propagation -> component -> integration -> i18n -> tests -> validation -> PR
- Each step: exact file path, action, code snippet
- **Cross-platform replication section** (if applicable): which steps repeat, what differs
- Status tracking table (all Pending initially)
- Context Verified section (confirmed facts, EP validation results)

### 6.3 Classify and update learnings

Every ticket reveals new patterns. Classify the learning:

| Level | Where to update | Example |
|---|---|---|
| **Methodology** | This SOP (SCD/SCG) | "Always check the other platform before coding" |
| **Shared pattern** | `.claude/patterns/` | "All API calls require error boundary" |
| **Implementation detail** | `.claude/rules/` or project-specific docs | "`.screen.tsx` suffix required for ESLint" |

**Never mix levels.** Methodology lessons go in the SOP. Implementation details go in rules.

### 6.4 Developer validation checkpoint

> *"The team delegates not only execution but also prior reflection."*

**The developer — not the AI — validates:**
- Are the business doc conclusions correct?
- Does the plan match what I understand about the codebase?
- Are the acceptance criteria complete?
- Were the proactive questions answered satisfactorily?
- Am I confident enough to start coding?

If any answer is "no" — iterate on that phase before proceeding to SCG.

---

## Contextual Architecture Hierarchy (5 Layers)

| Layer | Purpose | Typical equivalent |
|---|---|---|
| **1. Structural permanent principles** | Invariable governance foundations | `sovereignty/doctrine/` + `sovereignty/core/` |
| **2. Reusable patterns** | Recurring solution models | `.claude/patterns/` |
| **3. Operative rules and validations** | Auto-corrective mechanisms: SOPs, linting, type-checking | `.claude/rules/` |
| **4. Current state of the affected domain** | Structured synthesis of the territory | `.claude/business/{TICKET-KEY}-*.md` |
| **5. Specific intervention specification** | Definition of the change, limits, restrictions | `.claude/plans/PLAN-{TICKET-KEY}.md` |

> *"The power of the system lies not in the existence of these layers, but in their explicit separation."*

---

## Lessons Learned (Methodology Level)

These are patterns about HOW TO INVESTIGATE, not about specific code.

- **Parent story holds everything.** Subtask description is minimal; business rules, Q&A, attachments all live on the parent.
- **Dev info lives on the parent.** Development info queries on subtasks often return nothing.
- **Commit messages reveal upstream changes.** More informative than wiki contracts.
- **Download the attachments.** UX message states and edge cases are rarely in ticket descriptions.
- **Grep for existing similar feature first.** Reading the existing pattern saves hours.
- **Ask clarifying questions before coding.** Standard set: appears where? which surfaces? null or empty array? list view? copy confirmed?
- **Backend responses close the scope definitively** — update business doc immediately.
- **Field name discrepancies between endpoints** are contextual debt. Test both endpoints. Confirm normalization with backend.
- **EP validation is mandatory when ticket requires backend changes.** Test before writing code.
- **Post a comment after EP validation.** Tag the backend developer. Include full response.
- **Mock response strategy when backend endpoints are not ready.** Hardcode mock, develop frontend in parallel, remove mock once backend deploys.
- **Cross-platform discovery prevents duplicate divergence.** Check the other platform before coding. Naming, patterns, and state shape should be normalized.
- **The superior pattern wins.** When platforms solve the same problem differently, adopt whichever pattern is objectively better and normalize.
- **Architecture assessment prevents accidental debt.** A 500-line component is a worse host for a new feature than a 200-line one, even if it "works."
- **Stakeholders never spec empty states.** Always ask: "what renders when there's no data?"

---

## Handoff to SCG

When all SCD checklist items pass, the developer transitions to `sovereign-code-governance.md` (Sovereign Code Governance).

The SCG phase consumes the business doc and plan as its input. **No code should exist before this handoff.**

---

**Status**: v6.0 — Agnosticized from enterprise version. Platform-neutral methodology. Removed project-specific tooling references. Preserved full 9-phase method, Contextual Architecture Hierarchy, and Lessons Learned.
