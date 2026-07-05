# SOP: Sovereign Code Governance (SCG) — Legacy Deep Reference

> **STATUS**: Legacy exhaustive reference. For the always-loaded orchestrator, see [SCG.md](SCG.md). Keep this when you need the long-form execution playbook; use the orchestrator for day-to-day execution.
> **PURPOSE**: Execute code changes subordinated to the architecture defined in SCD, preserving structural coherence through governed execution, conscious review, and iterative validation
> **SCOPE**: Any software development project using AI-assisted development
> **PREREQUISITE**: SOP-SCD completed — business doc + implementation plan exist and are validated
> **UPDATED**: 2026-03-23

---

## What This SOP Is

SCG is the discipline of **governed execution**. It ensures that starting development does NOT mean returning to improvisation.

> *"La mayoria de los sistemas tecnicos fracasan no por falta de buenas decisiones iniciales, sino por la erosion progresiva de esas decisiones durante la ejecucion."*
> Most technical systems fail not from lack of good initial decisions, but from the progressive erosion of those decisions during execution.

SCD produced the intention. SCG preserves the coherence.

```
SCD (sovereign-context-design.md)       SCG (this SOP)
 1. REFRAME                              7. EXECUTE   — Code within the plan
 2. INTENT                               8. VALIDATE  — Alignment + feedback
 3. QUESTION                             9. FEEDBACK  — Post-deployment cycle
 4. DOMAIN
 5. SPEC
 6. PLAN
       |
       v
   Business doc + Plan  ------>  SCG consumes these as input
```

---

## SCG Principles

| Principle | Meaning |
|---|---|
| **Plan is the contract** | The implementation plan is not a suggestion — it defines the scope, order, and boundaries |
| **Deviations are explicit** | If reality diverges from the plan, update the plan FIRST, then code |
| **Developer validates UI** | AI has structural limitations for pixel-perfect UI — the developer's visual feedback is the authoritative source of truth |
| **Validators are sovereignty devices** | TypeScript, linters, tests are constitutional validators, not annoyances |
| **Review is structural** | Conscious review verifies architectural alignment, not just syntax |
| **The AI executes, the developer directs** | AI operates within the plan; the developer validates every structural decision |
| **Iteration is the method** | Code after execution is not final — iterative refinement with the developer produces production code |
| **Platform parity over platform speed** | Consistent behavior across platforms is more valuable than finishing one platform faster |

---

## Phase 7 — EXECUTE (Governed Execution)

### 7.1 Load context

Before writing any code, the AI must read:

1. **Business doc** — `.claude/business/{TICKET-KEY}-*.md`
2. **Implementation plan** — `.claude/plans/PLAN-{TICKET-KEY}.md`
3. **Relevant patterns** — as referenced in the plan

These are the SCD artifacts. They replace scattered investigation.

### 7.2 Execute step by step

Follow the plan's numbered steps **in order**. For each step:

```
1. Read the target file (if modifying)
2. Read the pattern/reference file (if creating)
3. Implement the change
4. Update status tracking: Pending -> Done
```

**Execution invariants (platform-agnostic):**

| Invariant | Why |
|---|---|
| Read before writing | Understand existing code before modifying |
| One step at a time | Prevents contamination between independent changes |
| Follow project export conventions | Named exports, default exports — match what the project uses |
| Respect the data flow | Never bypass the established data flow pattern (e.g., dispatch -> middleware -> service) |
| No cross-module imports | Domain separation |
| No inline styles | Use the project's styling solution |
| Use project TypeScript config | Prevent false TypeScript errors |

### 7.3 Patterns, Refactoring, and Cost-Benefit

The `.claude/patterns/` directory is the authoritative guide for HOW to execute any transformation — migrations, refactors, architecture changes, documentation, coding standards, testing philosophy, and more.

**The SOP does not define HOW to refactor. It defines the FRAMEWORK for deciding: what, how deep, and why.**

#### The cost-benefit framework

Every code improvement during a feature ticket must pass this filter:

| Question | Purpose |
|---|---|
| Am I changing business logic, or only the code that hosts it? | Business logic changes require full regression. Code-only refactors are lower risk. |
| Is this file already in my plan? | Refactor only what you touch. A feature ticket is not a refactor ticket. |
| What's the deepest I can go without risking the review? | The refactor should not become the conversation in the PR — the feature should. |
| Does this improvement have immediate benefit, or is it preparing for a future phase? | Immediate = do it. Future = document it as tech debt for a dedicated refactor ticket. |

#### Refactor depth levels

Not all refactoring is equal. The depth determines the risk:

| Depth | What changes | Business logic | Risk | When |
|---|---|---|---|---|
| **Surface** | File extensions, type annotations, remove legacy patterns, fix linters, add interfaces | Untouched | Low | During feature tickets — files you're already modifying |
| **Structural** | Split components, extract hooks, reorganize state shape, improve module boundaries | Untouched | Medium | Dedicated refactor tickets |
| **Architectural** | Redesign data flow, change state management patterns, restructure module hierarchy | Untouched | High | Planned architecture initiatives with team alignment |

> *"The depth of the refactor is proportional to the scope of the ticket. A feature ticket gets surface refactoring. A refactor ticket gets structural. An architecture initiative gets architectural. Never mix levels."*

**Key principle:** At ALL depths, business logic remains untouched. The refactor improves the CODE — the container — not the contents.

#### How patterns and linters work together

```
Linters detect  -->  Patterns prescribe  -->  SCG governs depth
```

1. **Linters expose what needs attention** — custom rules, strict mode, sort-keys, import-order. They are the structural immune system.
2. **Patterns define the transformation** — each pattern covers a specific discipline. Consult the relevant pattern for the specific task.
3. **SCG governs how deep to go** — the cost-benefit framework determines whether you apply the full pattern or just the surface-level fix.

### 7.4 Cross-Platform Replication Protocol

When the plan specifies implementation on multiple platforms:

**Execute primary platform first**, then replicate:

```
1. Implement on primary platform (usually the one with more patterns to reference)
2. Commit + push primary platform
3. Read the primary platform's implementation as reference
4. Analyze target platform's architecture for the same domain
5. Identify differences (imports, styling, i18n, build)
6. Implement on target platform, adapting to its conventions
7. Normalize naming — same component name, same state key, same interface fields
```

**Naming normalization rule:** Use the same component name, state key, and interface fields across platforms. When they diverge, pick the more descriptive name and update both.

### 7.5 Status tracking protocol

The plan contains a status tracking table. Update it in real-time:

| Status | Meaning |
|---|---|
| `Pending` | Not started |
| `In Progress` | Currently working on this step |
| `Done` | Completed and locally verified |
| `Blocked` | Cannot proceed — document why |
| `Skipped` | Intentionally omitted — document why |

### 7.6 Deviation protocol

When reality diverges from the plan:

```
1. STOP coding
2. Identify the discrepancy
3. Assess: is this a plan error or a codebase change?
4. Update the business doc if the domain understanding changed
5. Update the plan step with the correction
6. Resume execution from the corrected step
```

**Never code around the plan without updating it.** Silent deviations are contextual debt.

### 7.7 Build checkpoints

After modifying shared libraries or packages, run the platform's build command. This is not optional.

**When to build:** After completing all changes to shared packages, before integrating in consumer modules.

### 7.8 Incremental verification

Don't wait until all steps are done. Verify incrementally:

| After step type | Verify |
|---|---|
| Interface/type added | TypeScript check |
| Reducer/action modified | Existing tests still pass |
| Component created | Component renders without errors |
| Module integration | Lint check |

---

## Phase 8 — VALIDATE, ITERATE & DELIVER

> *"The code that comes out of the plan is not final code. Conscious iteration with the developer is what produces production code."*

Phase 8 is NOT a single pass. It is an iterative cycle where AI and developer refine the implementation through structured feedback loops. The order of sub-phases reflects priority: **UI first, then architecture, then cleanup, then delivery.**

---

### 8.1 UI Validation — Iterative User Feedback (MANDATORY)

AI has structural limitations for pixel-perfect UI work. The iterative feedback loop with the developer is the authoritative UI validation mechanism.

**Protocol:**

```
Developer provides: screenshot/description of expected UI
     |
AI implements: first version based on context + patterns
     |
Developer reviews: visual result (browser/simulator)
     |
Developer provides feedback: "move X", "color wrong", "spacing off"
     |
AI adjusts: targeted changes per feedback
     |
Repeat until: developer approves UI
```

**Rules:**
- The developer's visual feedback is the source of truth for UI — not design specs, not the AI's interpretation
- Do NOT move to architecture/refactor steps until the developer explicitly approves the UI
- Each iteration should be a minimal, targeted change — not a full rewrite

**Why this order:** UI iteration costs minutes. Discovering UI bugs after architecture refactoring costs hours.

---

### 8.2 Architecture & Refactor Scope

**After UI is approved**, evaluate the architecture improvements appropriate for this ticket's time budget. The developer confirms the refactor depth.

| Estimated time | Refactor depth | What to do |
|---|---|---|
| < 1 day | Surface only | Type migration of touched files, modernize patterns, fix imports |
| 1-3 days | Surface + selective structural | Above + centralize shared logic, extract hooks, split large components |
| > 3 days | Surface + structural | Above + reorganize state shape, improve module boundaries |

**Decision protocol:**
1. Developer confirms time budget for refactoring
2. AI proposes refactor scope based on depth level
3. Developer approves or adjusts scope
4. AI executes within approved scope only

**Key principle:** Business logic remains untouched at ALL depths. The refactor improves the container, not the contents.

---

### 8.3 Testing Cleanup

Follow your project's testing patterns and philosophy.

| Action | When |
|---|---|
| Fix existing tests that break from our changes | Always |
| Remove legacy test patterns, replace with modern | When touching test files |
| Add new tests for new components | When creating components |
| Fix snapshot tests | When component structure changes |
| Deep test refactoring | Only in dedicated refactor tickets |

**Rules:**
- Don't fix tests for files outside your plan scope
- Don't chase 100% coverage — fix what breaks, add what's new

---

### 8.4 Linter & TypeScript Error Cleanup

**Scope rule:** Fix lint/TS errors ONLY in files you modified. Do not fix project-wide errors unless in a dedicated cleanup ticket.

**Known safe fixes (always do):**
- Formatting errors (prettier, etc.) — autofix
- Sort-key violations — autofix
- Import order violations — autofix

**Known skip (never fix in feature tickets):**
- Code size limit violations — needs dedicated refactor
- Component organization violations — needs dedicated refactor
- Errors originating from untyped upstream dependencies — needs migration of that dependency

---

### 8.5 Full Validation Suite (Code Audit)

Run the platform's complete validation. **All must pass before PR.**

For the complete procedure, see **[code-audit.md](code-audit.md)** — a dedicated SOP that expands this phase into 4 systematic stages: Static Analysis (TypeScript → Lint) → Test Audit (classify failures, fix mock drift) → Build Verification → Structural Review.

```bash
# Minimum validation (adapt to your project's commands):
typecheck_command   # Phase 1.1 — types first (cascading fixes)
lint_command        # Phase 1.2 — style and architecture rules
test_command        # Phase 2   — full suite, not just new tests
build_command       # Phase 3   — SSR, routes, bundle
```

**Key insight from practice**: Run TypeScript BEFORE lint. Type fixes often eliminate lint warnings. Running lint first wastes effort fixing warnings that disappear after type fixes.

---

### 8.6 SCG Checklist

Before considering the implementation done:

- [ ] **UI approved** — developer explicitly validated visual result
- [ ] **Refactor scope confirmed** — depth matches time budget, developer approved
- [ ] **Boundaries respected** — no cross-module imports, no violations
- [ ] **Patterns followed** — component structure matches project conventions
- [ ] **Invariants preserved** — data flow intact, no direct API calls from components
- [ ] **Validators passing** — lint, type-check, tests, build all green
- [ ] **Tests updated** — broken tests fixed, new tests for new components
- [ ] **Plan updated** — status tracking reflects reality, deviations documented
- [ ] **No scope creep** — only what the plan + approved refactor scope specified
- [ ] **Cross-platform parity** — if both platforms in scope, both implemented and consistent
- [ ] **Naming normalized** — same component, state key, and interface names across platforms

---

### 8.7 Conscious Review

The developer reviews the diff asking structural questions:

| Question | What it catches |
|---|---|
| Does every new file follow the established pattern? | Structural divergence |
| Are imports using the correct aliases? | Build system violations |
| Does the component receive data through the documented path? | Data flow deviations |
| Are the guards exactly as specified in the acceptance criteria? | Logic errors |
| Did I introduce any `any` types? | Type safety regression |
| Are styled elements using design tokens, not hardcoded values? | Design system violations |

---

### 8.8 PR Preparation

Follow your project's PR documentation SOP.

**Cross-platform context in PR description (when applicable):**
- List modified files for the current platform (full paths)
- Add a cross-platform section naming equivalent files on the other platform
- If the implementation is identical: state so explicitly
- If there are differences: document each difference and justify why

---

### 8.9 Post-PR Iterative Refinement

Even after PR creation, issues surface during code review, QA testing, or self-review.

**Protocol:**
```
PR created -> reviewer/QA/self finds issue
     |
Classify: UI fix | Logic fix | Architecture fix | Scope creep
     |
UI/Logic/Architecture fix -> implement, push to same branch
Scope creep -> document, create separate ticket
     |
Update plan status if the fix changes the implementation
```

**Rules:**
- Post-PR fixes go to the same branch — no new branches for fixes
- If a fix requires touching files outside the original plan, update the plan first
- If the fix reveals a pattern worth documenting, note it for Phase 9

---

### 8.10 Sovereignty Sync

**Two sync operations after implementation is stable:**

#### A. Cross-task sync (`.claude/` between workspaces)

When changes to patterns, rules, or SOPs are made during a task, propagate to other active workspaces:

```bash
# Identify what changed in .claude/ (excluding ephemeral content)
git diff --name-only -- .claude/ | grep -v -E '(business/|plans/|status/)'

# Copy changed files to other active workspaces
```

**Exclude from sync:** `business/`, `plans/`, `status/` — these are task-specific.

#### B. Sovereignty repo sync

When methodology-level lessons emerge (SOP changes, new patterns, doctrine updates), propagate back to the sovereignty repo:

**Classify before syncing** (see SCD Phase 6.3):
- **Methodology** — sovereignty repo + all workspaces
- **Shared pattern** — sovereignty repo + same-discipline workspaces
- **Implementation detail** — `rules/` in current project only

---

## Phase 9 — POST-DEPLOYMENT (Conscious Improvement Cycle)

> *"Technical governance does not end with deployment."*

### 9.1 Post-deployment questions

| Question | Action if answer is unexpected |
|---|---|
| Did the change behave as expected on all platforms? | Document the discrepancy |
| What did we NOT anticipate? | Add to SOP Lessons Learned |
| What rule or pattern should be updated? | Update pattern/SOP |
| Did cross-platform replication reveal architectural problems? | Document for architecture review |
| Did the mock strategy (if used) cause issues? | Document for next time |

### 9.2 Update artifacts

```
Incident -> Analysis -> Learning -> Updated rules
```

| What to update | When |
|---|---|
| `sovereign-context-design.md` (Phase 3 questions or Lessons) | New investigation pattern or blind spot discovered |
| `sovereign-code-governance.md` (Execution rules or cost-benefit) | New invariant, anti-pattern, or execution pattern found |
| `.claude/patterns/` | Reusable domain pattern emerged |
| Sovereignty repo | Universal lesson |

**Classify the learning before saving** — methodology vs shared pattern vs implementation detail (see SCD Phase 6.3).

### 9.3 Clean up ephemeral artifacts

After the feature is in production and stable:

| Artifact | Action |
|---|---|
| `.claude/business/{TICKET-KEY}-*.md` | Keep — historical reference |
| `.claude/plans/PLAN-{TICKET-KEY}.md` | Keep — audit trail |
| `.claude/status/*` (if any) | Delete — ephemeral |
| Mock code | **Must be removed** before merging to main |

---

## Error Triage During SCG

### TypeScript errors

| Origin | Example | Action |
|---|---|---|
| **JS-origin** | Type error on a JS component's props — component is `.js` with auto-generated `.d.ts` | **DO NOT FIX** — requires JS->TS migration |
| **JS-origin** | Property error on state — store typed as `{}` (no typed root state) | **DO NOT FIX** — requires store typing migration |
| **TS-origin** | Type mismatch between two `.ts`/`.tsx` files | **FIX** — real type error |
| **TS-origin** | Implicit any on params you authored | **FIX** — add explicit types |
| **Build-origin** | "Module has no exported member" | Run build command, check `.d.ts` files |

### Linter errors (cross-platform policy)

| Category | Action |
|---|---|
| Formatting errors | **FIX** — autofix |
| Sort-key violations | **FIX** — autofix |
| Import order violations | **FIX** — autofix |
| Code size limit violations | **SKIP** unless refactoring is in scope |
| Component organization violations | **SKIP** unless refactoring is in scope |
| State management in components (direct dispatch) | **EVALUATE** — custom hook is the proper fix |
| Hook dependency warnings | **EVALUATE** — intentional omissions are valid |
| Errors from untyped JS-origin modules | **SKIP** — requires upstream migration |

---

## Anti-Patterns (NEVER do during SCG)

| Anti-pattern | Why |
|---|---|
| Code without reading the plan first | Loses the SCD investment — AI infers instead of consuming |
| Skip build after shared lib changes | Modules import from compiled output — unbuilt changes are invisible |
| Add `// eslint-disable` without permission | Bypasses structural immune system |
| Use `any` in production code | Destroys type contracts |
| Fix unrelated code while implementing | Scope creep — contaminates the PR |
| Deviate from plan without updating it | Silent deviation = contextual debt |
| Import from source paths in compiled modules | Violates build system boundary |
| Bypass the data flow (e.g., API calls from components) | Violates architectural data flow |
| Implement on one platform and "forget" the other | Cross-platform debt compounds over time |
| Use different names for the same concept across platforms | Naming divergence = cognitive debt |
| Mix methodology lessons with implementation details in SOPs | Violates contextual architecture hierarchy |

---

## Relationship Between SCD and SCG

```
SCD produces:                    SCG consumes:
  Business doc        -------->    Domain context for AI
  Implementation plan -------->    Step-by-step execution guide
  Acceptance criteria -------->    Verification targets
  Contextual debt log -------->    Known risks to watch for
  Proactive Q&A       -------->    Business edge cases to guard against

SCG produces:                    Post-deploy feeds back:
  Working code        -------->    Behavior verification
  UI-approved visuals -------->    Developer-validated result
  Updated plan status -------->    Audit trail
  PR documentation    -------->    Team review context
  Updated tests       -------->    Regression safety net
  Sovereignty sync    -------->    Knowledge propagation
  Lessons learned     -------->    SCD/SCG SOP updates (classified by level)
  Cross-platform code -------->    Platform parity verification
```

---

**Status**: v6.0 — Agnosticized from enterprise version (v3.0). Platform-neutral methodology. Removed project-specific appendices, lint rule lists, and build commands. Preserved full iterative Phase 8 (UI -> Architecture -> Testing -> Cleanup -> Delivery), Error Triage framework, Anti-Patterns, and SCD/SCG relationship model.
