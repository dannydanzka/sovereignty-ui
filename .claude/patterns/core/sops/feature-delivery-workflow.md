# SOP: Feature Delivery Workflow

> **PURPOSE**: End-to-end procedure from Jira ticket to merged PR using MCP tools
> **SCOPE**: Agnostic — applies to any project with Jira + Bitbucket
> **PREREQUISITE**: MCP servers configured (see `mcp-setup.md`)
> **UPDATED**: 2026-03-11

---

## Overview

```
JIRA TICKET → UNDERSTAND → CLONE/CHECKOUT → IMPLEMENT → PR DOC → CREATE PR → ASSIGN REVIEWERS
     ↑              ↑              ↑              ↑           ↑           ↑            ↑
  MCP Jira      MCP Jira     git + workspace   code      template    MCP BB      MCP BB
```

This SOP replaces the manual workflow of: write .md → format in ChatGPT → copy-paste to Bitbucket. Everything happens from Claude Code in a single session.

---

## Phase 1: Read & Understand the Task

### 1.1 Get Issue Details

```
Tool: jira_get_issue
Params:
  issue_key: "PLUS-XXXX"
```

**Extract from the issue:**
- Summary (title)
- Description (acceptance criteria, business context)
- Priority and type (bug, story, task)
- Sprint and epic (context)
- Attachments (mockups, screenshots)
- Comments (clarifications, decisions)

### 1.2 Check Related Issues

```
Tool: jira_search
Params:
  jql: "parent = PLUS-XXXX OR issuekey in linkedIssuesOf('PLUS-XXXX')"
  fields: "summary,status,assignee"
```

### 1.3 Check if Already In Progress

```
Tool: jira_search
Params:
  jql: "key = PLUS-XXXX AND status = 'In Progress'"
  fields: "summary,status,assignee"
```

---

## Phase 2: Workspace Setup

### 2.1 Clone Convention

Each ticket gets its own directory. See `core/workflow/workspace-organization.md` for full conventions.

```bash
# Create ticket directory and clone
mkdir -p ~/Documents/{company}/{platform}/{TICKET-KEY} && cd $_
git clone git@bitbucket.org:{workspace}/{repo}.git .
```

### 2.2 Branch Creation

```bash
# Create feature branch from the correct base
git checkout develop  # or main, per project branching strategy
git pull origin develop
git checkout -b feature/{TICKET-KEY}-brief-description
```

### 2.3 Transition Issue to In Progress

```
Tool: jira_transition_issue
Params:
  issue_key: "PLUS-XXXX"
  transition_name: "In Progress"
```

---

## Phase 3: Implementation

Follow sovereignty patterns for the relevant discipline. Key references:

| Creating... | Pattern |
|-------------|---------|
| Component | `frontend/presentation/components.md` |
| Hook | `frontend/presentation/hooks.md` |
| Service | `frontend/infrastructure/services.md` |
| State | `frontend/infrastructure/state/slices.md` or `redux.md` |
| Test | `frontend/testing/jest.md` or `vitest.md` |

### Investigation-First

Before writing code, check existing patterns in the codebase:

```bash
# Check if similar component/feature exists
grep -r "SimilarName" src/ --include="*.tsx" --include="*.ts" -l
```

---

## Phase 4: Generate PR Documentation

### 4.1 Analyze Changes

```bash
# See what changed
git diff develop --stat
git log develop..HEAD --oneline
```

### 4.2 Generate PR Document

Use the template from `core/sops/pr-documentation.md`. The PR document follows this structure:

```markdown
Certifico que la totalidad de código de este PR se implementa atendiendo
la solicitud enlazada en el mismo.

{type} {TICKET-KEY} - {Summary from Jira}

## ¿Qué incluye este PR?

{Brief description + feature list}

## ¿Por dónde debería de iniciar el reviewer?

{Numbered list with file paths}

## ¿Cómo debería de probarse la funcionalidad manualmente?

{Prerequisites + test steps with validation checklists}

## ¿Puedes proveer algún contexto adicional?

{Technical decisions, file summary, integration notes}

## ¿Que tickets son relevantes a este PR?

- [PLUS-XXXX](https://{workspace}.atlassian.net/browse/PLUS-XXXX)
```

### 4.3 Save PR Document Locally

```bash
# Save alongside the project root for reference
cat > PR-{TICKET-KEY}.md << 'EOF'
{generated content}
EOF
```

> **Note**: The `PR-*.md` file is for local reference only. Do NOT commit it to the repository.

---

## Phase 5: Push & Create PR

### 5.1 Push Branch

```bash
git push -u origin feature/{TICKET-KEY}-brief-description
```

### 5.2 Create PR via Bitbucket MCP

```
Tool: bb_post
Params:
  path: "/repositories/{workspace}/{repo}/pullrequests"
  body: {
    "title": "{type} {TICKET-KEY} - {Summary}",
    "description": "{PR document content}",
    "source": {
      "branch": { "name": "feature/{TICKET-KEY}-brief-description" }
    },
    "destination": {
      "branch": { "name": "develop" }
    },
    "close_source_branch": true,
    "reviewers": [
      { "uuid": "{reviewer-uuid}" }
    ]
  }
```

### 5.3 Add Jira Link to PR

Bitbucket auto-links if the branch or PR title contains the Jira key (e.g., `PLUS-XXXX`).

### 5.4 Verify PR Created

```
Tool: bb_get
Params:
  path: "/repositories/{workspace}/{repo}/pullrequests"
  queryParams: {"state": "OPEN", "q": "source.branch.name = \"feature/{TICKET-KEY}-brief-description\""}
```

---

## Phase 6: Assign Reviewers

### 6.1 Get Team Members

Reviewer UUIDs must be known. Each project should document its current team in:
`projects/{project}/team.md`

### 6.2 Update PR Reviewers (if not set in creation)

```
Tool: bb_put
Params:
  path: "/repositories/{workspace}/{repo}/pullrequests/{pr-id}"
  body: {
    "reviewers": [
      { "uuid": "{reviewer-1-uuid}" },
      { "uuid": "{reviewer-2-uuid}" }
    ]
  }
```

---

## Phase 7: Post-PR Actions

### 7.1 Transition Issue

```
Tool: jira_transition_issue
Params:
  issue_key: "PLUS-XXXX"
  transition_name: "Code Review"
```

### 7.2 Add Comment to Jira

```
Tool: jira_add_comment
Params:
  issue_key: "PLUS-XXXX"
  comment: "PR created: https://bitbucket.org/{workspace}/{repo}/pull-requests/{pr-id}"
```

---

## Quick Reference

### Full Command Sequence

```
1. jira_get_issue          → Read task
2. git clone + checkout    → Setup workspace
3. jira_transition_issue   → Move to "In Progress"
4. [implement]             → Write code
5. git push                → Push branch
6. bb_post (pullrequests)  → Create PR with description + reviewers
7. jira_transition_issue   → Move to "Code Review"
8. jira_add_comment        → Link PR in Jira
```

### What Goes Where

| Content | Location | Why |
|---------|----------|-----|
| PR template | `core/sops/pr-documentation.md` | Agnostic — any project |
| This workflow | `core/sops/feature-delivery-workflow.md` | Agnostic — any project |
| MCP tool reference | `core/sops/mcp-jira.md`, `mcp-bitbucket.md` | Tool-specific docs |
| Team members + UUIDs | `projects/{project}/team.md` | Project-specific |
| Active projects | `projects/{project}/index.md` | Project-specific |
| Branching strategy | Project `.claude/rules/sop/branch-merge-strategy.md` | Project-specific |

---

## Anti-Patterns

| Anti-Pattern | Correct |
|-------------|---------|
| Write PR doc in .md → format in ChatGPT → paste in Bitbucket | Generate + create PR in one session via MCP |
| Skip Jira reading, code from memory | Always `jira_get_issue` first — requirements change |
| Create PR without reviewers | Always assign from project team |
| Leave Jira in "To Do" after PR | Transition to "Code Review" |
| Commit PR-*.md files | PR docs are local reference only |

---

## Related

- `core/sops/pr-documentation.md` — PR template
- `core/sops/mcp-jira.md` — Jira MCP reference
- `core/sops/mcp-bitbucket.md` — Bitbucket MCP reference
- `core/sops/mcp-setup.md` — MCP server setup
- `core/workflow/workspace-organization.md` — Clone conventions
