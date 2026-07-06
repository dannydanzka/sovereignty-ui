# SOP: Feature Delivery Lifecycle — Full Tool Chain

> **PURPOSE**: End-to-end lifecycle from Commercial requirement to QA sign-off, connecting all tools
> **SCOPE**: Agnostic — applies to any project with Jira + Confluence + Figma + Playwright
> **RELATES TO**: `feature-delivery-workflow.md` (dev-side: Jira → code → PR → Bitbucket)
> **UPDATED**: 2026-04-06

---

## The Complete Tool Chain

```
COMMERCIAL                    IT / DESIGN                      QA / SIGN-OFF
──────────                    ──────────                       ─────────────
Jira Story         →    Confluence Research Doc    →    Playwright BDD Tests
(INVEST + AC)           (API contract, spec)             (Given/When/Then → code)
                    →    Figma Design                →    Screenshots Evidence
                         (linked from Jira)               (in Jira comments)
                    →    Subtasks by layer           →    Sign-off (Jira comment)
                         (FE Web, FE Móvil, BE)
```

**Key principle**: Each Given/When/Then acceptance criterion in Jira is a Playwright test scenario. The spec and the test are the same statement — in two different languages.

---

## Phase 0 — Commercial: INVEST Story (before IT sees it)

**Responsible**: Commercial (PO)
**Tool**: Jira + Claude Code (framework/ workspace)
**Full methodology**: `methodology/commercial/srd.md` — Sovereign Requirement Design (6-phase SOP)

Commercial writes the story using `admin/commercial/user-story-template.md`.
For complex or ambiguous requirements, apply the full SRD before writing the story.

**Required before assigning to IT:**

```
✅ Title: "As a [user], I want [action] so that [benefit]"
✅ At least 2 Given/When/Then scenarios in the description
✅ At least 1 error/edge case scenario
✅ Out of scope stated explicitly
✅ INVEST checklist passed
```

**Minimum Jira description (no Word docs):**

```markdown
**Context**: [Why this story. What problem it solves.]

**Acceptance Criteria**:

  Given [state]
  When [action]
  Then [observable result]

  Given [error state]
  When [action]
  Then [error message/behavior — specific]

**Out of scope**: [Explicit exclusions]
```

**Anti-pattern observed** (TASK-ID, TASK-ID, TASK-ID):
Spec lives in a `.docx` attachment. Acceptance criteria written in comments during QA.
Result: scope negotiated while IT is building.

---

## Phase 1 — IT: Confluence Research Document

**Responsible**: Tech Lead or Senior Developer
**Tool**: Confluence (space B3) + Claude Code + MCP Confluence

Before any subtask is created, research is documented in Confluence.

### When a research doc is required

| Trigger | Example |
|---------|---------|
| New API endpoint or service | TASK-ID linked `ContratoAPI-Ofertaltima+llamada` |
| Business rule with multiple conditions | TASK-ID: status hierarchy (6-level table) |
| New database model | TASK-ID: 5 new tables for PromotionalGift |
| External integration | Any 3rd-party API, payment provider, government API |
| Architecture decision | TASK-ID: `Definición de arquitectura` subtask |

### Research doc structure (Confluence)

```markdown
# [Feature Name] — Technical Research

> **Jira**: [TASK-IDXXXX]
> **Author**: [Tech Lead]
> **Status**: Draft | Reviewed | Final

## Business Context
[1 paragraph — what Commercial asked for, why it matters]

## Technical Analysis

### Affected Services / Modules
[List with impact level: High / Medium / Low]

### API Contract
[Request/response shapes, endpoints, error codes]

### Data Model
[New tables or fields, relationships]

### Edge Cases
[Scenarios that require specific handling]

### Decision Log
| Decision | Options considered | Chosen | Reason |
|----------|--------------------|--------|--------|

## Sign-off
[ ] Tech Lead reviewed
[ ] Commercial confirmed: business rules are correct
```

### Linking from Jira

Add to the Jira story description after the API contract is defined:

```
**API reference**: [Link to Confluence page]
```

**MCP operation (Claude Code):**

```
Tool: confluence_create_page
Params:
  space_key: "B3"
  title: "[TASK-IDXXXX] [Feature] — Technical Research"
  parent_id: [parent page id]
  body: [research content in storage format]
```

---

## Phase 2 — Design: Figma Reference

**Responsible**: Designer (or Commercial for simple UI)
**Tool**: Figma → linked in Jira description

### How Figma connects to Jira

The Figma design link is part of the Definition of Ready. IT cannot estimate a UI story without a design reference.

**In the Jira description:**

```
**Design reference**: [Figma URL — specific frame, not the whole file]
```

**What IT needs from Figma:**

| Element | Why |
|---------|-----|
| Component states (default, hover, selected, error) | Each state = 1 Given/When/Then scenario |
| Empty states | Required as an AC scenario |
| Error states | Required as a negative AC scenario |
| Responsive variants (mobile / desktop) | Drives FE Web vs FE Móvil subtask split |
| Annotations on spacing/tokens | Ensures design system compliance |

### Figma API — reading design for automation (advanced)

When Playwright tests need to validate design tokens:

```typescript
// Fetch design token from Figma REST API
// Library: /figma/rest-api-spec
const figmaFile = await fetch(
  `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${NODE_ID}`,
  { headers: { 'X-Figma-Token': process.env.FIGMA_TOKEN } }
);
// Extract fill color, spacing, typography from node
```

---

## Phase 3 — Development: Subtasks by Layer

**Responsible**: Tech Lead creates subtasks
**Tool**: Jira

### Subtask creation convention

Format: `[LAYER] [PLATFORM] - Description of specific work`

**Standard subtask set for a story with UI + API:**

```
Estimación QA                              ← Always first (QA estimate subtype)
BE - Analysis / spike (if needed)          ← Only if there are unknowns
BE - [Specific endpoint or service]        ← One subtask per API concern
FE Web - [Specific UI component/screen]   ← Web frontend
FE Móvil - [Specific UI component/screen] ← Mobile frontend (if in scope)
```

**Observed pattern from real tasks:**

| Task | Subtask count | Breakdown |
|------|--------------|-----------|
| TASK-ID (simple UI tag) | 2 | Estimación QA + BE Ajustes |
| TASK-ID (monitor redesign) | 13 | 1 QA + 7 FE (Web+Móvil per change) + 4 BE |
| TASK-ID (promotional gifts) | 7 | 1 QA + 4 BE + 1 FE + 1 BE (future) |
| TASK-ID (ULL conditional) | 24 | 1 QA + 4 FE + 7 BE + 1 TS fix + 8 QA incidents + 1 version |

**Rule: 8+ QA incident subtasks = acceptance criteria were missing upfront.**

### Version increment subtask (mobile only)

For mobile releases, always include:

```
Incremento de versión    ← Mobile: bump app version + build number
```

---

## Phase 4 — Evidence: Screenshots in Jira Comments

**Responsible**: Developer (after implementation)
**Tool**: Playwright MCP → screenshots → Jira comment

This is the manual evidence step. Before QA validates, the developer posts structured evidence in the Jira comment.

### Evidence comment format (from TASK-ID pattern)

```markdown
## Validation Evidence — [Feature name]

**Test user**: `[userCode]` ([role]) — valid in QA and Dev

### Scenario: [AC scenario title]

**Given**: [starting state]
**When**: [action performed]
**Then**: [observed result]

[Screenshot attached]

---

### Scenario: [Another AC scenario]
...
```

### Taking evidence screenshots with Playwright MCP

```
1. browser_navigate → QA environment URL
2. browser_fill_form → login credentials
3. browser_navigate → feature screen
4. browser_take_screenshot → ".playwright-mcp/screenshots/evidence-{scenario}.png"
5. Repeat for each AC scenario
6. Attach screenshots to Jira comment
```

**Screenshot naming for evidence:**

```
evidence-{TASK-IDXXXX}-{role}-{scenario}.png

Examples:
evidence-9836-distributor-header-status.png
evidence-9836-staff-detail-amounts.png
evidence-9278-distributor-vip-tag.png
```

---

## Phase 5 — QA: Playwright BDD Tests

**Responsible**: QA / Developer
**Tool**: Playwright BDD (`playwright-bdd`) — see `core/sops/playwright-bdd.md`

**The core connection:**

```
Jira AC (Gherkin)           →   Playwright BDD (.feature file)   →   Step definitions (.ts)
────────────────────             ──────────────────────────────       ──────────────────
Given the user is on             Feature: Order capture tag           @Given('the user is on {string}')
  the order capture screen       Scenario: VIP tag shown              async (screen) => {
When a VIP associate             Given the user is on                   await orderCapturePage.goto();
  is selected                      "order capture screen"             }
Then the VIP tag                 When a VIP associate is selected
  is shown in the card           Then the VIP tag is shown            @When('a VIP associate is selected')
                                                                       async ({ orderCapturePage }) => {
                                                                         await orderCapturePage.selectAssociate('vip');
                                                                       }
```

**One Given/When/Then = One Playwright test scenario. No exceptions.**

### Scenario-to-test mapping table (per story)

Before writing any test code, map each AC from Jira:

| AC Scenario | `.feature` scenario title | Page Object method | Priority |
|-------------|--------------------------|-------------------|----------|
| Given distributor on capture / When VIP selected / Then tag shows | `VIP associate shows classification tag` | `selectAssociate('vip')` | P0 |
| Given distributor on capture / When BASE selected / Then no tag | `BASE associate shows no tag` | `selectAssociate('base')` | P0 |
| Given auto-select flow / When user IS the associate / Then fallback endpoint | `Auto-select uses fallback profile endpoint` | `loginAsAssociate()` | P1 |

---

## Phase 6 — Sign-off

**Responsible**: Commercial (PO)
**Tool**: Jira comment + QA environment

PO validates in QA environment — not via screenshots, in the actual app.

### Sign-off comment format

```markdown
## QA Sign-off — [Story title]

**Validated on**: [Date]
**Environment**: QA
**Validated by**: [Name]

| AC Scenario | Result |
|-------------|--------|
| [Scenario 1] | ✅ PASS |
| [Scenario 2] | ✅ PASS |
| [Error scenario] | ✅ PASS |

**Decision**: ✅ Accepted — story moves to Pendiente de Liberar
```

If any scenario fails: story moves back to "Trabajando" with a specific comment on which scenario and what was observed vs expected.

---

## Phase 7 — Knowledge Update (post-delivery)

**Responsible**: Developer who implemented the feature
**Tool**: Confluence (module knowledge page) + MCP
**When**: After PR merged to master and sign-off received

This phase closes the knowledge loop. The feature research doc (Phase 1) is feature-specific. The module knowledge page is cumulative — it captures operational knowledge that outlives any single story.

### What to update

| What changed | Where to update |
|-------------|----------------|
| New or modified user flow | "Key Flows" section of module page |
| New or changed business rule | "Business Rules" section |
| Discovered edge case | "Known Edge Cases" section |
| API endpoint added or changed | "API Endpoints" section |
| Architecture or business decision | "Decision Log" section |
| Any change | "Recent Changes" (always — minimum 1 row) |

### Minimum update (always required)

Add one row to "Recent Changes" on the module's Confluence page:

```
| 2026-04-XX | TASK-IDXXXX | [One-line summary of what changed in this module] |
```

### Finding the module page

1. Check `patterns/business/knowledge-index.md` for the page ID
2. If the module has no page yet: create it using the template in `core/sops/platform-knowledge.md`
3. Update `knowledge-index.md` with the new page ID

### MCP operation

```
# Update existing page
Tool: confluence_get_page (read current content first)
Tool: confluence_update_page (append to Recent Changes + update sections)

# Create new module page
Tool: confluence_create_page
  space_key: "B3"
  title: "[Module Name] — Platform Knowledge"
  body: [template from platform-knowledge.md]
```

**Gate**: Story is not "Done" until at least one row in Recent Changes is added for each module touched.

---

## Lifecycle Summary

| Phase | Owner | Tool | Gate |
|-------|-------|------|------|
| 0 — INVEST Story | Commercial | Jira | IT confirms: "Estimable as written" |
| 1 — Confluence Research | Tech Lead | Confluence + MCP | API contract confirmed by Commercial |
| 2 — Design | Designer | Figma | Link in Jira description |
| 3 — Subtasks | Tech Lead | Jira | Subtasks created per layer/platform |
| 4 — Evidence | Developer | Playwright MCP | Screenshots posted in Jira comment |
| 5 — Playwright Tests | QA/Dev | playwright-bdd | All AC scenarios have passing tests |
| 6 — Sign-off | Commercial | Jira + QA env | Written sign-off in Jira comment |
| 7 — Knowledge Update | Developer | Confluence + MCP | Module page updated, PR marked Done |

---

## What Makes This Different from `feature-delivery-workflow.md`

| `feature-delivery-workflow.md` | This document |
|-------------------------------|---------------|
| Dev-side: Jira → code → PR → Bitbucket | Full lifecycle: Commercial → IT → Design → QA |
| MCP tools for developer actions | Tool chain connecting 5 different tools |
| Assumes story is already defined | Starts from story writing |
| No Confluence, no Figma, no Playwright BDD | All tools covered |

Use both: `feature-delivery-workflow.md` for the code → PR phase, this document for the full lifecycle.

---

## See Also

- `core/sops/feature-delivery-workflow.md` — Dev workflow: Jira → code → PR → Bitbucket
- `core/sops/playwright-bdd.md` — Playwright BDD: Jira AC → test scenarios
- `core/sops/mcp-playwright.md` — Playwright MCP: screenshots, visual testing
- `core/sops/mcp-confluence.md` — Confluence MCP: create/update pages
- `admin/commercial/jira-issue-standards.md` — Jira story standards with real PLUS examples
- `admin/commercial/user-story-template.md` — Copy-paste templates
- `methodology/commercial/sdd-admin.md` — Spec Driven Development: spec before code
