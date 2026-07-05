# SOP: MCP Bitbucket

> **PURPOSE**: Query and manage Bitbucket PRs, branches, and diffs from Claude via MCP
> **SCOPE**: Agnostic — applies to any Bitbucket repository
> **PREREQUISITE**: Bitbucket MCP plugin with repository read scopes
> **UPDATED**: 2026-03-10

---

## 1. Connection

MCP Bitbucket connects via App Password or OAuth token.

| Parameter | Description |
|-----------|-------------|
| MCP Prefix | `mcp__atlassian-bitbucket__bb_*` |
| Methods | `bb_get`, `bb_post`, `bb_put`, `bb_patch`, `bb_delete` |
| Base Path | `/repositories/{workspace}/{repo_slug}` |
| Output Format | TOON (default, 30-60% fewer tokens) or JSON |

### Required Scopes

| Scope | Enables |
|-------|---------|
| `read:repository` | Repos, branches, commits, file content |
| `read:pullrequest` | PRs, diffs, comments |
| `read:user` | List users (optional) |
| `read:workspace` | List workspaces (optional) |

Minimum for useful operation: `read:repository` + `read:pullrequest`.

---

## 2. Read Operations (bb_get)

All paths start with `/repositories/{workspace}/{repo}`.

### List Open PRs

```
Tool: bb_get
Params:
  path: "/repositories/{ws}/{repo}/pullrequests"
  queryParams: {"state": "OPEN", "pagelen": "10"}
  jq: "values[*].{id: id, title: title, source: source.branch.name, dest: destination.branch.name, author: author.display_name}"
```

### Get PR Detail

```
Tool: bb_get
Params:
  path: "/repositories/{ws}/{repo}/pullrequests/{id}"
  jq: "{id: id, title: title, description: description, source: source.branch.name, dest: destination.branch.name, state: state}"
```

### Get PR Diff

```
Tool: bb_get
Params:
  path: "/repositories/{ws}/{repo}/pullrequests/{id}/diff"
```

### Get PR Comments

```
Tool: bb_get
Params:
  path: "/repositories/{ws}/{repo}/pullrequests/{id}/comments"
  queryParams: {"pagelen": "25"}
  jq: "values[*].{id: id, user: user.display_name, content: content.raw, created: created_on}"
```

### List Branches

```
Tool: bb_get
Params:
  path: "/repositories/{ws}/{repo}/refs/branches"
  queryParams: {"pagelen": "25"}
  jq: "values[*].{name: name, target_hash: target.hash, target_date: target.date}"
```

### Filter Branches by Name

```
Tool: bb_get
Params:
  path: "/repositories/{ws}/{repo}/refs/branches"
  queryParams: {"q": "name ~ \"feature\"", "pagelen": "10"}
  jq: "values[*].{name: name, target_hash: target.hash}"
```

### Compare Branches (Diff)

```
Tool: bb_get
Params:
  path: "/repositories/{ws}/{repo}/diff/{source_branch}..{dest_branch}"
```

### List Recent Commits

```
Tool: bb_get
Params:
  path: "/repositories/{ws}/{repo}/commits"
  queryParams: {"pagelen": "10"}
  jq: "values[*].{hash: hash, message: message, author: author.raw, date: date}"
```

### Commits on a Branch

```
Tool: bb_get
Params:
  path: "/repositories/{ws}/{repo}/commits/{branch_name}"
  queryParams: {"pagelen": "10"}
  jq: "values[*].{hash: hash, message: message, date: date}"
```

### Get File Content

```
Tool: bb_get
Params:
  path: "/repositories/{ws}/{repo}/src/{commit_or_branch}/{filepath}"
```

---

## 3. Write Operations

### Create PR (bb_post)

```
Tool: bb_post
Params:
  path: "/repositories/{ws}/{repo}/pullrequests"
  body: {
    "title": "PR title",
    "description": "## Summary\n- Change description",
    "source": {"branch": {"name": "source-branch"}},
    "destination": {"branch": {"name": "target-branch"}},
    "close_source_branch": true
  }
  jq: "{id: id, title: title, links: links.html.href}"
```

### Add PR Comment (bb_post)

```
Tool: bb_post
Params:
  path: "/repositories/{ws}/{repo}/pullrequests/{id}/comments"
  body: {"content": {"raw": "Markdown comment text"}}
```

### Approve PR (bb_post)

```
Tool: bb_post
Params:
  path: "/repositories/{ws}/{repo}/pullrequests/{id}/approve"
  body: {}
```

### Merge PR (bb_post)

```
Tool: bb_post
Params:
  path: "/repositories/{ws}/{repo}/pullrequests/{id}/merge"
  body: {"merge_strategy": "merge_commit"}
```

Strategies: `merge_commit`, `squash`, `fast_forward`

### Update PR (bb_patch)

```
Tool: bb_patch
Params:
  path: "/repositories/{ws}/{repo}/pullrequests/{id}"
  body: {"title": "Updated title", "description": "Updated description"}
```

### Decline PR (bb_delete)

```
Tool: bb_delete
Params:
  path: "/repositories/{ws}/{repo}/pullrequests/{id}/decline"
```

### Delete Branch (bb_delete)

```
Tool: bb_delete
Params:
  path: "/repositories/{ws}/{repo}/refs/branches/{branch_name}"
```

---

## 4. Common Workflows

### Review PR Before Merge

1. `bb_get` → list open PRs → find the PR
2. `bb_get` → PR detail → read description
3. `bb_get` → PR diff → review changes
4. `bb_get` → PR comments → check feedback

### Check Branch State

1. `bb_get` → list branches filtered by name
2. `bb_get` → compare branches (diff source..destination)
3. `bb_get` → commits on branch → verify history

### Full PR Lifecycle

1. Push branch via git CLI (local)
2. `bb_post` → create PR
3. `bb_get` → verify PR created
4. `bb_post` → merge PR (after review)
5. `bb_delete` → delete source branch (optional)

---

## 5. Token Optimization

| Practice | Impact |
|----------|--------|
| **ALWAYS use `jq`** | Unfiltered responses are very expensive |
| **Use `pagelen`** | Default returns many results — use `"5"` for exploration |
| **Schema discovery** | First call: `pagelen: "1"` + no jq → explore fields. Then filter |
| **Use TOON format** | Default — 30-60% fewer tokens than JSON |
| **JSON only when needed** | `outputFormat: "json"` for exact structure |

### Query Filters (`q` parameter)

| Filter | Example |
|--------|---------|
| PR state | `state="OPEN"` |
| PR source branch | `source.branch.name="feature"` |
| Title contains | `title~"bug"` |

---

## See Also

- **Jira MCP**: `sovereignty/core/sops/mcp-jira.md`
- **Context7 MCP**: `sovereignty/core/sops/mcp-context7.md`
- **MCP Setup**: `sovereignty/core/sops/mcp-setup.md`
