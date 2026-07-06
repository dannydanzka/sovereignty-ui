# SOP: Atlassian MCP Servers Setup

> **PURPOSE**: Configure Atlassian MCP servers (Jira, Confluence, Bitbucket) for Claude Code
> **SCOPE**: Local development environment
> **UPDATED**: 2026-03-10 (validated Bitbucket scope limitations + marketplace install)

---

## 1. Prerequisites

- Claude Code installed (native)
- Node.js 20+ (for npx)
- Atlassian account with access to the target workspace

---

## 2. Token Creation

Atlassian uses **two types of API tokens** created at: `https://id.atlassian.com/manage-profile/security/api-tokens`

### 2.1 Standard API Token (Jira + Confluence)

1. Go to API Tokens page
2. Click **"Create API token"**
3. Label: `Claude Code <Name>` (e.g., `Claude Code Danny`)
4. Copy the token immediately (shown only once)

**Works for**: Jira, Confluence
**Does NOT work for**: Bitbucket

### 2.2 API Token with Scopes (Bitbucket)

> Since September 2025, Bitbucket no longer supports App Passwords. Use "API tokens with scopes" instead.

1. Go to API Tokens page
2. Click **"Create API token with scopes"**
3. Label: `Claude Code Bitbucket <Name>`
4. Select scopes:
   - `read:repository:bitbucket` — View repositories
   - `read:pullrequest:bitbucket` — View pull requests
5. Copy the token immediately (shown only once)

**Works for**: Bitbucket only (requires scopes)

**Scope limitations** (validated 2026-03-10):
| Scopes Granted | Can Do | Cannot Do |
|----------------|--------|-----------|
| `read:repository` + `read:pullrequest` | List repos, view PRs, branches, diffs, commits, file content | List workspaces (`/workspaces` returns 403) |
| + `read:workspace:bitbucket` | All above + list workspaces | — |
| + `read:user:bitbucket` | All above + user profile | — |

**Recommendation**: `read:repository` + `read:pullrequest` is sufficient for daily work. The `/workspaces` endpoint is not needed if you know your workspace slug (e.g., `your-workspace`). Do NOT waste time adding extra scopes unless you specifically need them.

### Token Format

Both token types follow the format:
```
ATATT3xFfGF0...<long string>...=<HEX>
```

---

## 3. MCP Server Configuration

There are **two installation methods**:

### Method A: Claude Code Marketplace (Recommended)

MCPs can be installed directly from the Claude Code marketplace:
1. Open Claude Code
2. Run `/install-plugin` or browse the marketplace
3. Search for "Atlassian" — installs as native integration
4. Auth is handled via OAuth flow (browser redirect)

**Pros**: No manual config, OAuth tokens, automatic updates
**Cons**: Less control over specific settings

### Method B: Manual Configuration

Configuration lives in: `~/.claude.json` under `mcpServers`

### 3.1 Jira + Confluence (Official Package)

```bash
# Install the official MCP server
pip install mcp-atlassian
```

Configuration in `~/.claude.json`:

```json
{
  "mcpServers": {
    "atlassian-jira-confluence": {
      "type": "stdio",
      "command": "mcp-atlassian",
      "args": [],
      "env": {
        "JIRA_URL": "https://<workspace>.atlassian.net",
        "JIRA_USERNAME": "<email>",
        "JIRA_API_TOKEN": "<standard-api-token>",
        "CONFLUENCE_URL": "https://<workspace>.atlassian.net/wiki",
        "CONFLUENCE_USERNAME": "<email>",
        "CONFLUENCE_API_TOKEN": "<standard-api-token>"
      }
    }
  }
}
```

**Variables**:
| Variable | Example | Notes |
|----------|---------|-------|
| `<workspace>` | `your-workspace` | Your Atlassian workspace slug |
| `<email>` | `user@company.com` | Atlassian account email |
| `<standard-api-token>` | `ATATT3xFfGF0...` | From "Create API token" |

### 3.2 Bitbucket (Community Package)

Configuration in `~/.claude.json`:

```json
{
  "mcpServers": {
    "atlassian-bitbucket": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@aashari/mcp-server-atlassian-bitbucket"],
      "env": {
        "ATLASSIAN_USER_EMAIL": "<email>",
        "ATLASSIAN_API_TOKEN": "<scoped-api-token>"
      }
    }
  }
}
```

**Variables**:
| Variable | Example | Notes |
|----------|---------|-------|
| `<email>` | `user@company.com` | Atlassian account email |
| `<scoped-api-token>` | `ATATT3xFfGF0...` | From "Create API token with scopes" |

**Important**: The Bitbucket token MUST be created with scopes. A standard API token will return `401 Unauthorized`.

---

## 4. Validation

After configuring, **restart Claude Code** (MCPs load at startup), then run:

### Jira
```
Ask Claude: "List Jira projects"
```
Expected: List of projects from the workspace.

If empty (`[]`):
- Verify user has project access in Jira
- Check `JIRA_URL` matches the workspace URL
- Optional: Set `JIRA_PROJECTS_FILTER` env var to specific project keys

### Confluence
```
Ask Claude: "Search Confluence for <term>"
```
Expected: Search results from Confluence.

### Bitbucket

> **IMPORTANT**: Do NOT validate with "List workspaces" — that endpoint requires `read:workspace` scope which is unnecessary for daily work.

**Correct validation** (use workspace slug directly):
```
Ask Claude: "List repos in the your-workspace workspace on Bitbucket"
```
Expected: List of repositories from the workspace.

**Alternative** (search specific repo):
```
Ask Claude: "Show me the your-project-main repo in Bitbucket workspace your-workspace"
```

If `403` on `/workspaces`:
- **This is expected** with `read:repository` + `read:pullrequest` scopes — NOT an error
- Use `/repositories/{workspace}` instead (skip workspace listing)

If `401`:
- Token is standard (not scoped) — recreate with scopes
- Token expired — check expiration date on API Tokens page
- Email mismatch — verify `ATLASSIAN_USER_EMAIL`

If `404` on `/repositories/{workspace}`:
- Wrong workspace slug — try common variations (e.g., `your-company` vs `your-workspace`)

---

## 5. Available Tools

### Jira
| Tool | Purpose |
|------|---------|
| `jira_get_all_projects` | List all projects |
| `jira_search` | JQL search |
| `jira_get_issue` | Get issue details |
| `jira_create_issue` | Create issue |
| `jira_update_issue` | Update issue |
| `jira_transition_issue` | Change issue status |
| `jira_add_comment` | Add comment |
| `jira_get_sprint_issues` | Sprint issues |

### Confluence
| Tool | Purpose |
|------|---------|
| `confluence_search` | Search pages |
| `confluence_get_page` | Get page content |
| `confluence_create_page` | Create page |
| `confluence_update_page` | Update page |

### Bitbucket
| Tool | Purpose |
|------|---------|
| `bb_get` | Read any Bitbucket data (repos, PRs, branches) |
| `bb_post` | Create resources |
| `bb_put` | Update resources |
| `bb_delete` | Delete resources |

---

## 6. Token Rotation

Tokens expire (default: 30 days). When a token expires:

1. Create new token at `https://id.atlassian.com/manage-profile/security/api-tokens`
2. Update `~/.claude.json` with the new token value
3. Revoke the old token
4. Restart Claude Code

### Quick Update Script

```bash
# Update Jira/Confluence token
python3 -c "
import json
with open('$HOME/.claude.json') as f:
    d = json.load(f)
d['mcpServers']['atlassian-jira-confluence']['env']['JIRA_API_TOKEN'] = '<new-token>'
d['mcpServers']['atlassian-jira-confluence']['env']['CONFLUENCE_API_TOKEN'] = '<new-token>'
with open('$HOME/.claude.json', 'w') as f:
    json.dump(d, f, indent=2)
print('Jira/Confluence token updated')
"

# Update Bitbucket token
python3 -c "
import json
with open('$HOME/.claude.json') as f:
    d = json.load(f)
d['mcpServers']['atlassian-bitbucket']['env']['ATLASSIAN_API_TOKEN'] = '<new-scoped-token>'
with open('$HOME/.claude.json', 'w') as f:
    json.dump(d, f, indent=2)
print('Bitbucket token updated')
"
```

---

## 7. Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Jira returns `[]` projects | No access or wrong URL | Verify workspace URL and user permissions |
| Bitbucket `403` on `/workspaces` | Missing `read:workspace` scope | **Not a real problem** — use `/repositories/{workspace}` directly with the known workspace slug |
| Bitbucket `401` | Standard token (no scopes) | Create "API token with scopes" with `read:repository:bitbucket` + `read:pullrequest:bitbucket` |
| Bitbucket `404` on `/repositories/{slug}` | Wrong workspace slug | Try variations: `your-company`, `your-workspace`, `your-company-mx` |
| `mcp-atlassian` not found | Not installed | `pip install mcp-atlassian` |
| `npx` fails for Bitbucket | Node.js not installed | Install Node.js 20+ |
| Token expired | 30-day expiration | Create new token, update config |
| Changes not taking effect | MCPs load at startup | Restart Claude Code |
| Marketplace MCP shows auth error | OAuth token expired | Re-authenticate via Claude Code marketplace |

---

## See Also

- **Atlassian API Tokens**: `https://id.atlassian.com/manage-profile/security/api-tokens`
- **MCP Atlassian (official)**: `https://github.com/sooperset/mcp-atlassian`
- **MCP Bitbucket (community)**: `https://github.com/aashari/mcp-server-atlassian-bitbucket`
