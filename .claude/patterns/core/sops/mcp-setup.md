# SOP: MCP Server Setup & Configuration

> **PURPOSE**: How MCP servers are configured, authenticated, and maintained in Claude Code
> **SCOPE**: Agnostic — applies to any MCP server setup
> **UPDATED**: 2026-03-10

---

## 1. What is MCP?

**Model Context Protocol (MCP)** allows Claude to interact with external services (Jira, Bitbucket, databases, documentation APIs) via standardized tool calls.

Each MCP server provides tools prefixed with `mcp__{server-name}__`.

---

## 2. Authentication Types

### OAuth-Managed (Recommended)

Handled by Claude's plugin system. No local config files needed.

| Aspect | Detail |
|--------|--------|
| Auth Flow | OAuth browser redirect |
| Token Storage | Managed by Claude internally |
| Auth Cache | `.claude/mcp-needs-auth-cache.json` |
| Re-auth | Automatic prompt when token expires |

**Current OAuth-managed servers:**
- `atlassian` (Jira + Confluence + Bitbucket)
- `context7`

### App Password / API Token

Some servers use static credentials (API keys, app passwords).

| Aspect | Detail |
|--------|--------|
| Config Location | Project `.mcp.json` or `.claude/.mcp.json` |
| Security | Token stored in config file — keep out of git |

### Config File Format (`.mcp.json`)

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@scope/mcp-server-name"],
      "env": {
        "API_KEY": "your-api-key",
        "BASE_URL": "https://api.example.com"
      }
    }
  }
}
```

**Placement:**
- **Global**: `.claude/.mcp.json` (all projects)
- **Project**: `{project-root}/.mcp.json` (project-specific)

---

## 3. Current MCP Inventory

| Server | Prefix | Auth | Tools |
|--------|--------|------|-------|
| **Jira/Confluence** | `mcp__atlassian-jira-confluence__` | OAuth | Issue CRUD, search, transitions, sprints, comments |
| **Bitbucket** | `mcp__atlassian-bitbucket__` | OAuth | PRs, branches, diffs, commits, file content |
| **Context7** | `mcp__context7__` | OAuth | Library documentation lookup |

### Bitbucket Scopes

| Scope | Status | Enables |
|-------|--------|---------|
| `read:repository` | Granted | Repos, branches, commits, files |
| `read:pullrequest` | Granted | PRs, diffs, comments |
| `read:user` | Missing | List users |
| `read:workspace` | Missing | List workspaces |

**Workaround for missing scopes**: Use workspace/repo names directly instead of listing.

---

## 4. Troubleshooting

### "Access denied" / 403

**Cause**: Missing scopes on the token/app password.

**Fix**:
1. Check the error detail for `required` vs `granted` scopes
2. Update the App Password or OAuth permissions to include missing scopes
3. Re-authenticate

### "mcp-needs-auth-cache" Prompt

**Cause**: OAuth token expired.

**Fix**: Follow the browser redirect to re-authenticate. Claude will prompt automatically.

### Tool Not Found

**Cause**: MCP server not loaded or misconfigured.

**Verify**:
1. Check if tools appear in `<available-deferred-tools>` at session start
2. Use `ToolSearch` to fetch the schema: `select:mcp__{server}__*`
3. If not listed, the MCP server is not connected

### Slow Response

**Cause**: Fetching too much data.

**Fix**:
- Use `jq` filters (Bitbucket)
- Use `fields` parameter (Jira)
- Use `limit`/`pagelen` to restrict results
- Avoid `*all` field expansions

---

## 5. Adding a New MCP Server

### Step 1: Install

```bash
# Via Claude CLI (if supported)
claude mcp add server-name

# Or via config file
# Add to .claude/.mcp.json or {project}/.mcp.json
```

### Step 2: Authenticate

Follow the OAuth prompt or add API credentials to config.

### Step 3: Verify

```
ToolSearch → select:mcp__{server-name}__*
```

Call a simple read operation to confirm connectivity.

### Step 4: Document

Create an SOP in `sovereignty/core/sops/mcp-{server-name}.md` following the pattern of existing MCP SOPs.

Update the inventory table in this file.

---

## 6. Project-Specific Configuration

When a project needs specific MCP settings (custom workspace, repo, project key), document them in the project's own SOP:

```
{project}/.claude/rules/sop/mcp-{server}.md
```

Include:
- Connection parameters (workspace, repo, project key)
- Pre-resolved IDs or common queries
- Scope limitations specific to that project

The sovereignty SOPs (this directory) stay **agnostic** — no project-specific values.

---

## See Also

- **Jira MCP**: `sovereignty/core/sops/mcp-jira.md`
- **Bitbucket MCP**: `sovereignty/core/sops/mcp-bitbucket.md`
- **Confluence MCP**: `sovereignty/core/sops/mcp-confluence.md`
- **Context7 MCP**: `sovereignty/core/sops/mcp-context7.md`
