# SOP: MCP Jira (Atlassian)

> **PURPOSE**: Query and manage Jira issues from Claude via MCP
> **SCOPE**: Agnostic — applies to any Jira project
> **PREREQUISITE**: Atlassian MCP plugin authenticated (OAuth via Claude managed plugins)
> **UPDATED**: 2026-03-10

---

## 1. Connection

MCP Jira connects via Atlassian's OAuth-managed plugin. No local config file needed.

| Parameter | Value |
|-----------|-------|
| MCP Prefix | `mcp__atlassian-jira-confluence__jira_*` |
| Auth | OAuth (managed by Claude plugin system) |
| Auth Cache | `.claude/mcp-needs-auth-cache.json` |

**Project key must be known** — use `jira_get_all_projects` to discover available projects.

---

## 2. Read Operations

### Discover Projects

```
Tool: jira_get_all_projects
Params:
  include_archived: false
```

### Search Issues (JQL)

```
Tool: jira_search
Params:
  jql: "project = {KEY} AND status = 'In Progress'"
  fields: "summary,status,assignee,priority"
  limit: 10
```

**Common JQL patterns:**

| Need | JQL |
|------|-----|
| My open issues | `project = {KEY} AND assignee = currentUser() AND status != Done` |
| Active sprint | `project = {KEY} AND sprint in openSprints()` |
| Children of epic | `parent = {KEY}-123` |
| By label | `project = {KEY} AND labels = {label}` |
| Recently updated | `project = {KEY} AND updated >= -7d` |
| By status | `project = {KEY} AND status = "In Progress"` |
| By priority | `project = {KEY} AND priority = High` |
| By type | `project = {KEY} AND issuetype = Bug` |
| Text search | `project = {KEY} AND text ~ "search term"` |

### Get Issue Detail

```
Tool: jira_get_issue
Params:
  issue_key: "{KEY}-123"
  fields: "summary,status,assignee,priority,description"
  comment_limit: 5
```

**Field options:**
- Default: `summary,status,assignee,priority,reporter`
- All fields: `*all` (expensive — avoid unless needed)
- Expand transitions: `expand: "transitions"`
- Expand changelog: `expand: "changelog"`

### Get Available Transitions

```
Tool: jira_get_transitions
Params:
  issue_key: "{KEY}-123"
```

Returns available status transitions with their IDs (needed for `jira_transition_issue`).

---

## 3. Agile Operations

### Get Boards

```
Tool: jira_get_agile_boards
Params:
  project_key: "{KEY}"
```

### Get Sprints from Board

```
Tool: jira_get_sprints_from_board
Params:
  board_id: "{board_id}"
  state: "active"         # active | future | closed | null (all)
```

### Get Sprint Issues

```
Tool: jira_get_sprint_issues
Params:
  sprint_id: "{sprint_id}"
  fields: "summary,status,assignee,priority"
  limit: 50
```

---

## 4. Write Operations

### Create Issue

```
Tool: jira_create_issue
Params:
  project_key: "{KEY}"
  summary: "Issue title"
  issue_type: "Task"      # Task | Bug | Story | Epic | Subtask
  description: "Markdown description"
  assignee: "user@email.com"
  additional_fields: '{"labels": ["label1"], "priority": {"name": "High"}}'
```

**Link to epic:** `{"epicKey": "{KEY}-123"}`
**Create subtask:** `{"parent": "{KEY}-123"}`

### Update Issue

```
Tool: jira_update_issue
Params:
  issue_key: "{KEY}-123"
  fields: '{"summary": "New title", "description": "Updated markdown"}'
```

### Transition Issue (Change Status)

```
# Step 1: Get available transitions
Tool: jira_get_transitions → issue_key: "{KEY}-123"

# Step 2: Transition with the ID from step 1
Tool: jira_transition_issue
Params:
  issue_key: "{KEY}-123"
  transition_id: "{id}"
  comment: "Markdown comment for the transition"
```

### Add Comment

```
Tool: jira_add_comment
Params:
  issue_key: "{KEY}-123"
  body: "Markdown comment text"
```

---

## 5. Common Workflows

### Check Sprint Status

1. `jira_get_agile_boards` → get board_id
2. `jira_get_sprints_from_board` → board_id, state: "active" → get sprint_id
3. `jira_get_sprint_issues` → sprint_id

### Review Issue Before Starting Work

1. `jira_get_issue` → read description + status
2. `jira_get_transitions` → see available transitions
3. `jira_transition_issue` → move to "In Progress"

### Close Issue After Work Complete

1. `jira_get_transitions` → get "Done" transition ID
2. `jira_transition_issue` → transition_id + comment documenting what was done

---

## 6. Token Optimization

| Practice | Impact |
|----------|--------|
| Always specify `fields` | Avoid loading unnecessary data |
| Use `limit` parameter | Default is 10 — only increase when needed |
| Avoid `*all` fields | Returns every field including custom ones |
| Use `expand` sparingly | transitions/changelog add significant payload |
| Paginate with `start_at` | Don't load everything at once |

---

## See Also

- **Bitbucket MCP**: `sovereignty/core/sops/mcp-bitbucket.md`
- **Context7 MCP**: `sovereignty/core/sops/mcp-context7.md`
- **MCP Setup**: `sovereignty/core/sops/mcp-setup.md`
