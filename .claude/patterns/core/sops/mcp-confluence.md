# SOP: MCP Confluence (Atlassian)

> **PURPOSE**: Create, update, move, and manage Confluence pages from Claude via MCP
> **SCOPE**: Agnostic — applies to any Confluence space
> **PREREQUISITE**: Atlassian MCP plugin authenticated (OAuth via Claude managed plugins)
> **UPDATED**: 2026-03-11

---

## 1. Connection

MCP Confluence shares the Atlassian OAuth-managed plugin with Jira.

| Parameter | Value |
|-----------|-------|
| MCP Prefix | `mcp__atlassian-jira-confluence__confluence_*` |
| Auth | OAuth (managed by Claude plugin system) |
| Auth Cache | `.claude/mcp-needs-auth-cache.json` |

**Space key must be known** — use `confluence_search` to discover available spaces.

---

## 2. Read Operations

### Get Page by ID

```
Tool: confluence_get_page
Params:
  page_id: "1234567890"
  include_metadata: true
  convert_to_markdown: true
```

**Page ID location**: In the URL `https://{site}.atlassian.net/wiki/spaces/{SPACE}/pages/{PAGE_ID}/Title`, the numeric value is the page ID.

### Get Page by Title + Space

```
Tool: confluence_get_page
Params:
  title: "Exact Page Title"
  space_key: "B3"
  include_metadata: true
  convert_to_markdown: true
```

### Content Format Options

| Parameter | Value | Use |
|-----------|-------|-----|
| `convert_to_markdown: true` | Returns markdown | Default — readable, lower tokens |
| `convert_to_markdown: false` | Returns raw HTML | Reveals macros (dates, panels) not visible in markdown |

**Warning**: Raw HTML significantly increases token usage.

### Search Pages

```
Tool: confluence_search
Params:
  query: "search term"
  space_key: "B3"        # Optional — filter by space
  limit: 10
```

### Get Page Children

```
Tool: confluence_get_page_children
Params:
  page_id: "1234567890"
```

### Get Page History

```
Tool: confluence_get_page_history
Params:
  page_id: "1234567890"
```

### Get Comments

```
Tool: confluence_get_comments
Params:
  page_id: "1234567890"
```

### Get Attachments

```
Tool: confluence_get_attachments
Params:
  page_id: "1234567890"
```

---

## 3. Write Operations

### Create Page

```
Tool: confluence_create_page
Params:
  space_key: "B3"
  title: "Page Title"
  content: "Markdown content here"
  parent_id: "1234567890"     # Optional — parent page ID
  content_format: "markdown"   # markdown | wiki | storage
```

**Content formats:**
- `markdown` (default) — Write in markdown, Confluence converts
- `wiki` — Confluence wiki markup
- `storage` — Raw Confluence storage format (XHTML)

### Update Page

```
Tool: confluence_update_page
Params:
  page_id: "1234567890"
  title: "Updated Title"
  content: "Updated markdown content"
  content_format: "markdown"
  version_comment: "Description of changes"
  is_minor_edit: false
  enable_heading_anchors: true    # Markdown only — generates anchor IDs
```

**Critical**: `title` and `content` are REQUIRED even if only one changes. Always provide both.

### Move Page

```
Tool: confluence_move_page
Params:
  page_id: "1234567890"
  target_parent_id: "9876543210"
  position: "append"               # append | above | below
```

| Position | Behavior |
|----------|----------|
| `append` | Move as child of target (default) |
| `above` | Move as sibling before target |
| `below` | Move as sibling after target |

### Cross-Space Move

```
Tool: confluence_move_page
Params:
  page_id: "1234567890"
  target_space_key: "NEWSPACE"
  target_parent_id: "9876543210"   # Optional — omit to move to space root
```

---

## 4. Labels and Comments

### Add Label

```
Tool: confluence_add_label
Params:
  page_id: "1234567890"
  label: "architecture"
```

### Add Comment

```
Tool: confluence_add_comment
Params:
  page_id: "1234567890"
  body: "Comment text in markdown"
```

### Reply to Comment

```
Tool: confluence_reply_to_comment
Params:
  page_id: "1234567890"
  comment_id: "comment-id"
  body: "Reply text"
```

---

## 5. Attachments

### Upload Attachment

```
Tool: confluence_upload_attachment
Params:
  page_id: "1234567890"
  file_path: "/path/to/file.png"
  comment: "Description of the attachment"
```

### Download Attachment

```
Tool: confluence_download_attachment
Params:
  page_id: "1234567890"
  attachment_id: "att1234567890"
```

---

## 6. Common Workflows

### Publish New Technical Document

1. **Search** if page already exists → `confluence_search`
2. **Find parent page** → `confluence_get_page` (by title or ID)
3. **Create page** → `confluence_create_page` with parent_id
4. **Add labels** → `confluence_add_label` (e.g., "architecture", "sovereignty")
5. **Verify** → `confluence_get_page` to confirm content rendered correctly

### Update Existing Document

1. **Read current page** → `confluence_get_page` (get current content + version)
2. **Prepare updated content** → Modify the markdown
3. **Update** → `confluence_update_page` with version_comment describing changes
4. **Verify** → `confluence_get_page` to confirm

### Reorganize Page Hierarchy

1. **Get children** → `confluence_get_page_children` to understand current structure
2. **Move pages** → `confluence_move_page` for each page to reposition
3. **Verify** → `confluence_get_page_children` on new parent to confirm

### Review Page Before Editing

1. **Read page** → `confluence_get_page` (markdown for content review)
2. **Check history** → `confluence_get_page_history` (who changed what)
3. **Read comments** → `confluence_get_comments` (pending feedback)
4. **Check labels** → `confluence_get_labels` (categorization)

---

## 7. Token Optimization

| Practice | Impact |
|----------|--------|
| Use `convert_to_markdown: true` | Significantly reduces token usage vs raw HTML |
| Set `include_metadata: false` when not needed | Avoids extra payload |
| Use `confluence_search` before `get_page` | Find the right page without trial-and-error |
| Use page IDs over title+space lookups | Faster, no ambiguity |
| Avoid reading pages just to get their ID | Extract IDs from URLs when provided |

---

## 8. Content Format Tips

### Markdown (Recommended)

- Tables render natively
- Code blocks render with syntax highlighting
- Headings auto-generate TOC in Confluence
- `enable_heading_anchors: true` adds anchor IDs for deep linking
- Blockquotes render as styled callouts

### Known Limitations

| Markdown Feature | Confluence Behavior |
|-----------------|---------------------|
| Nested code blocks in lists | May not render correctly |
| HTML in markdown | Stripped or ignored |
| Relative links | Only work within same space |
| Emoji shortcodes (`:emoji:`) | Not supported — use Unicode characters |
| Mermaid diagrams | Not natively supported |

### Formatting That Works Well

- **Bold/italic** for emphasis
- **Tables** for structured data
- **Code blocks** with language hints
- **Numbered/bulleted lists** for sequences
- **Horizontal rules** (`---`) for section breaks
- **Blockquotes** for callouts and citations

---

## See Also

- **Confluence Documentation Pattern**: `sovereignty/core/documentation/confluence.md`
- **Jira MCP**: `sovereignty/core/sops/mcp-jira.md`
- **Bitbucket MCP**: `sovereignty/core/sops/mcp-bitbucket.md`
- **MCP Setup**: `sovereignty/core/sops/mcp-setup.md`
