# SDP Step 13: ticket system Tracking

> **Input**: PR created, external docs docs published
> **Output**: ticket system comments, time logged, estimates set

---

## Task Decomposition

| Scenario | Action |
|----------|--------|
| Task is research + execution | Create execution subtask under same parent |
| Task is execution only | Use existing task |
| Task has no parent | Standalone — log everything on it |

### Creating execution subtask

```
ticket_create_issue
  project: PLUS
  issuetype: Sub-task
  parent: TICKET-ID (parent task, NOT the research task)
  summary: "FE Ejecución: <Topic> — TICKET-ID"
  description: "Subtarea de ejecución para implementar la solución investigada en TICKET-ID"
  assignee: <current user>
```

## Estimates

Set BEFORE logging time:

```
PUT /rest/api/3/issue/TICKET-ID
Body: { "fields": { "timetracking": { "originalEstimate": "1d" } } }
```

| Task type | Typical estimate |
|-----------|-----------------|
| Research/Spike | 1d |
| Small execution (1-3 files) | 2h-4h |
| Medium execution (3-6 files) | 1d-2d |
| Large execution (6+ files, migrations) | 3d-5d |

## Time Logging

```
POST /rest/api/3/issue/TICKET-ID/worklog
Body: {
  "timeSpentSeconds": <seconds>,
  "started": "<ISO datetime with timezone>",
  "comment": { "type": "doc", "version": 1, "content": [...] }
}
```

### Guidelines

| Guideline | Detail |
|-----------|--------|
| Standard workday | 7h effective (8:30h nominal minus ~1:30h meetings) |
| What to log | Research, implementation, testing, documentation, PR creation |
| What NOT to log | Meetings, context switching, breaks |
| Granularity | Per task — separate research vs execution |
| Overtime | Valid to log >7h/day if actual focused work |
| Intellectual work | Research, analysis, decisions count — not just code |

## Ticket Comments

### On research task (TICKET-ID)

```
Research completado para TICKET-ID: <Topic>

**Hallazgos principales:**
- <Finding 1>
- <Finding 2>

**Recomendación:** <Recommended approach>

**Documentación:**
- Research Técnico: <external docs URL>

**Subtarea de ejecución:** TICKET-IDYYYY
```

### On execution task (TICKET-IDYYYY)

```
Implementación completada para TICKET-IDYYYY: <Topic>

**Cambios realizados:**
- <Change 1>
- <Change 2>

**PR:** <git host PR URL>

**Documentación:**
- Documentación Técnica: <external docs URL>
- Research Técnico: <external docs URL>

**Archivos modificados:** <count> archivos, +<additions>/-<deletions> líneas
```

---

## Rules

- ALWAYS set estimate before logging time
- ALWAYS separate research and execution time on different tasks
- Comments are research-focused on research tasks, implementation-focused on execution tasks
- Include PR link and external docs links in EVERY comment
- Log time the same day it was worked — don't batch at end of sprint
