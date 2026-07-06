# SCD Step 1: Business Context

> **Input**: task ticket key (TICKET-ID)
> **Output**: `.claude/business/TICKET-ID-<description>.md`

---

## Procedure

### 1.1 Read the ticket

```
ticket_get_issue → TICKET-ID
  fields: summary, description, status, assignee, priority, issuetype
```

Extract: acceptance criteria, business rules, user roles, happy path, edge cases.

### 1.2 Read parent and subtasks

```
ticket_search → "parent = TICKET-ID OR issuekey in linkedIssuesOf('TICKET-ID')"
  fields: summary, status, assignee
```

Identify: related tasks, who's working on what, dependencies.

### 1.3 Check if already in progress

```
ticket_search → "key = TICKET-ID AND status = 'In Progress'"
```

### 1.4 Create business context file

Write `.claude/business/TICKET-ID-<brief-description>.md`:

```markdown
# TICKET-ID — <Summary from ticket system>

> **Parent**: TICKET-IDYYYY — <Parent summary>
> **Status**: <current status>
> **Assignee**: <name>
> **Type**: <Story|Task|Bug|Spike>

## Scope

<What this task delivers — from ticket system description>

## Acceptance Criteria

<Extracted from ticket system description>

## Business Rules

<Extracted from ticket system description>

## Stakeholders

<Who cares about this — Product, QA, Backend>

## API Contracts (if applicable)

<Endpoint URLs, request/response shapes — from external docs or ticket system attachments>
```

---

## Rules

- NEVER skip this step — even for "obvious" tasks
- If ticket system description is empty, ask the developer for context
- If task has subtasks, document the full tree (research + execution)
- Transition to "In Progress" after reading (if not already)
