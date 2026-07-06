# SOP: MCP Context7 (Library Documentation)

> **PURPOSE**: Query up-to-date documentation and code examples for any library
> **SCOPE**: Agnostic — any npm package, framework, or programming library
> **PREREQUISITE**: Context7 MCP plugin enabled
> **UPDATED**: 2026-03-10

---

## 1. Connection

| Parameter | Value |
|-----------|-------|
| MCP Prefix | `mcp__context7__` |
| Tools | `resolve-library-id`, `query-docs` |
| Rate Limit | Max 3 calls per question |

---

## 2. Two-Step Workflow (MANDATORY)

Context7 **always** requires two steps: resolve the library ID first, then query.

### Step 1: Resolve Library ID

```
Tool: resolve-library-id
Params:
  libraryName: "react"
  query: "what you need to find out"
```

**Returns** a ranked list with:
- **Library ID** — format: `/org/project` (required for step 2)
- **Code Snippets** — number of available examples
- **Source Reputation** — High / Medium / Low
- **Benchmark Score** — 0-100 (higher = better quality)
- **Versions** — available version-specific IDs

**Selection criteria** (priority order):
1. Exact name match
2. Source Reputation (High > Medium > Low)
3. Benchmark Score
4. Code Snippets count

### Step 2: Query Documentation

```
Tool: query-docs
Params:
  libraryId: "/org/project"
  query: "Specific question about the library"
```

### Version-Specific Queries

Use `/org/project/version` format:
```
libraryId: "/facebook/react/v18_3_1"
```

---

## 3. Query Best Practices

### Good Queries (Specific)

- `"How to set up authentication with JWT in Express.js"`
- `"React useEffect cleanup function examples"`
- `"Redux Saga takeLatest vs takeEvery difference"`
- `"styled-components transient props with TypeScript"`
- `"Jest mock implementation for async functions"`

### Bad Queries (Vague)

- `"auth"` — too broad
- `"hooks"` — no context
- `"testing"` — which aspect?

### Tips

- Be specific about what you need
- Include the framework/tool name
- Ask for code examples when possible
- Mention the version if relevant
- Never include sensitive data (API keys, passwords, proprietary code)

---

## 4. Common Workflows

### Look Up API Before Implementing

1. `resolve-library-id` → libraryName + query describing what you need
2. Pick best match by reputation + score
3. `query-docs` → libraryId + specific question

### Verify Pattern Against Current Docs

1. `resolve-library-id` → libraryName
2. `query-docs` → "Best practices for X"

### Check Breaking Changes or Migration

1. `resolve-library-id` → pick version-specific ID if available
2. `query-docs` → "Breaking changes and migration guide from vX to vY"

---

## 5. Optimization

| Practice | Impact |
|----------|--------|
| **Max 3 calls per question** | Plan queries carefully — don't waste calls |
| **Resolve once, query multiple** | Library ID is reusable within the session |
| **Be specific** | Vague queries waste your 3-call budget |
| **Cache common IDs** | Keep a table of pre-resolved IDs for your stack |
| **Skip resolve for known IDs** | If you already know the ID, go straight to `query-docs` |

---

## 6. Pre-Resolved ID Registry

Maintain a table of frequently used libraries in your project documentation to skip the resolve step:

```markdown
| Library | ID | Snippets | Score |
|---------|----|----------|-------|
| React | /websites/react_dev | 2796 | 89.97 |
| React (source) | /facebook/react | 4196 | 64.08 |
```

Update this table as you discover new libraries during development.

---

## See Also

- **Jira MCP**: `sovereignty/core/sops/mcp-jira.md`
- **Bitbucket MCP**: `sovereignty/core/sops/mcp-bitbucket.md`
- **MCP Setup**: `sovereignty/core/sops/mcp-setup.md`
