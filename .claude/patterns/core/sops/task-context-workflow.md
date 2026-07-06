# SOP: Task Context Workflow — Reading and Creating Tasks via MCP

> **PURPOSE**: Load complete task context before development (SCD Phase 2) and create well-structured tasks from Claude Code via Jira MCP
> **SCOPE**: All active YourCompany projects — PLUS, BTC, BWECU, BWCO, SHOP
> **MCP SERVER**: `mcp__atlassian-jira-confluence__` (your-company.atlassian.net)
> **UPDATED**: 2026-04-06

---

## Project Registry

| Key | Project | Type | Issue model | Active |
|-----|---------|------|------------|--------|
| **PLUS** | YourCompany+ | Software | Epic → Story → Subtask | ✅ Main |
| **BTC** | BeFra Tecnologias Comerciales | Software | Tarea → Subtarea (flat) | ✅ |
| **BWECU** | YourCompany Ecuador | Software | Tarea + Error → Subtarea | ✅ |
| **BWCO** | YourCompany Colombia | Software | Tarea + Error → Subtarea | ✅ |
| **SHOP** | Shopify | Software | TBD | ✅ |
| **BT** | YourCompany + (ITSM) | Service Desk | Petición / Incidente | ✅ Soporte |
| **IAS** | Incidentes Activos | Business | Incidente | ✅ Soporte |
| BN2, BW, BWEC, PIP | Legacy | — | — | ❌ |

---

## Issue Types by Project

### PLUS — YourCompany+ (main development project)

| Issue type | Spanish name | Use | Creates from |
|------------|-------------|-----|-------------|
| `Épico` | Epic | Large feature — multiple sprints, multiple stories | Commercial (SRD Phase 1) |
| `Historia de usuario` | User story | Single deliverable, estimable, INVEST-compliant | Commercial (SRD Phase 5-6) |
| `Subtarea` | Subtask | Implementation work — one layer/platform/concern | Tech Lead after estimating |
| `Estimación QA` | QA estimate | QA sizing — always the FIRST subtask created | Tech Lead |
| `Incidencia` | Incident/Bug | Defect found in QA or production | QA / Developer |

**Hierarchy:**
```
Épico
  └── Historia de usuario
        ├── Estimación QA      ← always first
        ├── Subtarea [BE]      ← backend work
        ├── Subtarea [FE Web]  ← web frontend
        └── Subtarea [FE Móvil] ← mobile frontend
```

### PLUS Status Lifecycle

| Status | Category | Meaning |
|--------|----------|---------|
| `Pendiente de desarrollar` | To Do | Story defined, waiting for sprint |
| `Business Analysis` | To Do | Blocked — pending business definitions |
| `Trabajando` | In Progress | Active development |
| `Code Review` | In Progress | PR open, awaiting review |
| `Testing` | In Progress | QA validating |
| `Pendiente de Liberar` | Done | Passed QA, waiting for release |
| `Liberado` | Done | Deployed to production |
| `Cancelado` | Done | Not being built |

### BTC — BeFra Tecnologias Comerciales

| Issue type | Use |
|------------|-----|
| `Tarea` | Any work item (no story/epic hierarchy) |
| `Subtarea` | Work breakdown under a Tarea |

Flat project — no INVEST stories, no QA estimate subtask. Used for infrastructure, architecture, and cross-cutting technical work.

### BWECU / BWCO — Ecuador / Colombia

| Issue type | Use |
|------------|-----|
| `Tarea` | Feature or change request |
| `Error` | Bug — behavior that doesn't match expectations |
| `Subtarea` | Work breakdown |

Notable: `Error` type (not `Incidencia`). Status includes `Recepción de Requerimento` (initial reception) before standard flow.

### BT — Service Desk (ITSM)

Different system — not a software development project. Issues are created through the Service Desk portal, not via `jira_create_issue`. Use for:
- IT support tickets
- SOX compliance requests
- Infrastructure change requests

---

## Part 1 — Reading Task Context (Developer, SCD Phase 2)

### Step 1: Read the full task

```
Tool: jira_get_issue
issue_key: TASK-IDXXXX
fields: *all
comment_limit: 20
```

**What to extract:**
- Summary, description, status, assignee, reporter
- Issue type (is this a Story or a Subtask?)
- Parent key (if subtask — the Story is the real spec source)
- Fix version / sprint
- All comments (business rules negotiated post-creation are here)
- Attachments list

### Step 2: Read the parent story (MANDATORY if assigned a subtask)

The subtask description is minimal. **The business rules, AC, and decisions live on the parent story.**

```
Tool: jira_get_issue
issue_key: TASK-IDXXXX   ← the PARENT key, not the subtask
fields: *all
comment_limit: 30      ← more comments — scoping decisions often appear late
```

### Step 3: Read sibling subtasks

```
Tool: jira_search
jql: parent = TASK-IDXXXX
fields: summary, issuetype, status, assignee
```

Classify: BE / FE Web / FE Móvil / QA. This tells you:
- Which platform(s) are in scope
- Which backend tasks are pending (→ mock strategy if incomplete)
- Who owns QA

### Step 4: Get development info (PRs and branches)

```
Tool: jira_get_issue_development_info
issue_key: TASK-IDXXXX   ← use the PARENT key
```

Returns: open PRs, merged branches, related commits. Confirms which repos are involved.

### Step 5: Starter prompt (copy-paste)

Use this to kick off context loading for any PLUS task:

```
Lee la tarea TASK-IDXXXX con todos sus comentarios y adjuntos.
Si es subtarea, lee también su historia padre y todas las subtareas hermanas.
Obtén el development info del padre.

Con todo eso, aplica SCD fases 1 a 4:
1. REFRAME — ¿está bien planteada? ¿cuál es el dominio real?
2. INTENT — resumen estructurado de todo el contexto
3. QUESTION — preguntas proactivas que nadie hizo (técnicas y de negocio)
4. DOMAIN — módulos, servicios y archivos afectados

Crea:
- .claude/business/TASK-IDXXXX-[slug].md
- .claude/status/STATUS-TASK-IDXXXX.md (inventario del código afectado)
```

---

## Part 2 — Creating Tasks via MCP

### Create an Epic (Commercial, SRD Phase 1)

```
Tool: jira_create_issue
project_key: PLUS
summary: "[Verb] [Feature] — [Business Outcome]"
issue_type: Épico
description: |
  **Business driver**: [Why this is needed. What metric it improves.]

  **Affected users**: [DS / AS / Staff — describe the pain point]

  **Success definition**: [How we measure success — specific and verifiable]

  **Likely stories**:
  - As a [user], I want [action] so that [benefit]
  - ...

  **Out of scope**: [Explicit exclusions]

  **Dependencies**: [Other epics, integrations, systems]
```

### Create a User Story (Commercial, SRD Phase 6)

```
Tool: jira_create_issue
project_key: PLUS
summary: "As a [user], I want [action] so that [benefit]"
issue_type: Historia de usuario
description: |
  **Context**: [1-2 sentences — why this matters now]

  **Acceptance Criteria**:

    Given [starting state]
    When [user action]
    Then [expected result]

    Given [error condition]
    When [user action]
    Then [error message or degraded behavior]

  **Out of scope**: [Explicit exclusions]

  **Definition of Ready**: AC complete, INVEST validated, IT confirmed estimable
additional_fields: '{"parent": "TASK-IDEPIC-KEY"}'
```

### Create Subtasks (Tech Lead, after SCD)

Create the QA estimate subtask first — always:

```
Tool: jira_create_issue
project_key: PLUS
summary: "Estimación QA"
issue_type: Estimación QA
additional_fields: '{"parent": "TASK-IDXXXX"}'
```

Then implementation subtasks in order:

```
Tool: jira_create_issue
project_key: PLUS
summary: "BE - [Specific endpoint or service]"
issue_type: Subtarea
additional_fields: '{"parent": "TASK-IDXXXX"}'
```

```
Tool: jira_create_issue
project_key: PLUS
summary: "FE Web - [Specific UI component or screen]"
issue_type: Subtarea
additional_fields: '{"parent": "TASK-IDXXXX"}'
```

**Naming convention**: `[LAYER] [PLATFORM] - Description`

| Layer | Platform | Examples |
|-------|----------|---------|
| `BE` | — | `BE - GET /catalog/products` |
| `FE` | `Web` | `FE Web - Display VIP tag in order capture` |
| `FE` | `Móvil` | `FE Móvil - Display VIP tag in order capture` |
| `FE` | `Web / Móvil` | `FE Web / Móvil - [shared change]` |
| `QA` | — | `QA - Regression test for PPR flow` |
| `TS` | — | `TS - Migrate service to TypeScript` |

### Create an Incident/Bug (QA or Developer)

```
Tool: jira_create_issue
project_key: PLUS
summary: "[Screen/Module] — [Brief description of incorrect behavior]"
issue_type: Incidencia
description: |
  **Story**: TASK-IDXXXX

  **Expected** (from AC):
    [Copy the Given/When/Then scenario that failed]

  **Actual**:
    [What happened instead — specific, observable]

  **Environment**: QA / Dev
  **Test user**: [userCode] ([role])

  **Evidence**: [Screenshot attached]
additional_fields: '{"parent": "TASK-IDXXXX"}'
```

### Create a Task in BTC / BWECU / BWCO

Flat structure — no stories, no epics:

```
Tool: jira_create_issue
project_key: BTC
summary: "[Brief description of work]"
issue_type: Tarea
description: |
  **Context**: [Why this is needed]
  **Scope**: [What specifically is being done]
  **Acceptance**: [How to verify it's done]
```

For bugs in Ecuador/Colombia:

```
Tool: jira_create_issue
project_key: BWECU
summary: "[Screen] — [Description of incorrect behavior]"
issue_type: Error
description: |
  **Expected**: [Correct behavior]
  **Actual**: [What happens instead]
  **Steps to reproduce**: [Step by step]
  **Environment**: [QA/Prod]
```

---

## Batch Subtask Creation

When creating multiple subtasks at once, use batch creation:

```
Tool: jira_batch_create_issues
issues: [
  {
    "project_key": "PLUS",
    "summary": "Estimación QA",
    "issue_type": "Estimación QA",
    "additional_fields": "{\"parent\": \"TASK-IDXXXX\"}"
  },
  {
    "project_key": "PLUS",
    "summary": "BE - [endpoint description]",
    "issue_type": "Subtarea",
    "additional_fields": "{\"parent\": \"TASK-IDXXXX\"}"
  },
  {
    "project_key": "PLUS",
    "summary": "FE Web - [UI description]",
    "issue_type": "Subtarea",
    "additional_fields": "{\"parent\": \"TASK-IDXXXX\"}"
  }
]
```

### Starter prompt for subtask creation (copy-paste)

```
Crea las subtareas para TASK-IDXXXX con este desglose:

Estimación QA
BE - [descripción backend]
FE Web - [descripción frontend web]
FE Móvil - [descripción frontend móvil]   ← omitir si no aplica

Proyecto: PLUS. Tipo: Subtarea (excepto Estimación QA).
Parent: TASK-IDXXXX
```

---

## Transition (Change Status)

```
# First: get available transitions
Tool: jira_get_transitions
issue_key: TASK-IDXXXX

# Then: apply the transition
Tool: jira_transition_issue
issue_key: TASK-IDXXXX
transition_id: [ID from previous call]
```

Common transitions in PLUS:
- `Pendiente de desarrollar` → `Trabajando` (start work)
- `Trabajando` → `Testing` (done, send to QA)
- `Testing` → `Pendiente de Liberar` (QA approved)
- `Testing` → `Trabajando` (QA found issues — back to dev)

---

## Common Patterns

### Full story bootstrap (Commercial → IT handoff)

```
1. Commercial creates Epic (if new feature area)
2. Commercial creates Historia de usuario via SRD
3. IT Tech Lead reads the story
4. IT confirms: "Estimable as written" → status: Pendiente de desarrollar
5. IT creates Estimación QA + implementation subtasks
6. Sprint planning: subtasks assigned and estimated
7. Dev opens workspace, reads task via MCP, applies SCD
```

### Dev starting a new sprint task

```
1. cd ~/Documents/proyectos/TASK-IDXXXX
2. claude
3. "Lee TASK-IDXXXX con SCD fases 1-4 y crea el business context"
4. [SCD produces .claude/business/ + .claude/status/]
5. "Crea el plan de implementación" → .claude/plans/PLAN-TASK-IDXXXX.md
6. Start coding (SCG)
```

### Post-delivery

```
1. Dev posts evidence screenshots in Jira comment
2. Dev transitions subtask to Testing
3. QA validates against AC
4. QA transitions to Pendiente de Liberar (or back to Trabajando)
5. Commercial signs off (Phase 6 of feature-delivery-lifecycle.md)
6. Dev updates Confluence module knowledge page (Phase 7)
```

---

## See Also

- `core/sops/mcp-jira.md` — Full Jira MCP operations reference
- `methodology/development/scd.md` — SCD: how task context becomes an implementation plan
- `core/sops/feature-delivery-lifecycle.md` — Full lifecycle including subtask creation
- `admin/commercial/jira-issue-standards.md` — Naming conventions + real PLUS task analysis
- `methodology/commercial/srd.md` — SRD: the 6-phase process before creating a story
- `patterns/business/your-company-context.md` — Project registry, modules, roles
