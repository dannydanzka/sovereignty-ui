# SOP: Playwright MCP — Visual Testing & Browser Automation

> **PURPOSE**: Use Playwright MCP for visual testing, screenshots, form testing, and UI validation
> **SCOPE**: Agnostic — applies to any project using Playwright MCP with Claude Code
> **PREREQUISITES**: Playwright MCP server configured, dev server running
> **UPDATED**: 2026-04-09

---

## 1. Overview

Playwright MCP allows Claude to control a browser session directly — navigate, click, fill forms, take screenshots, and verify UI state. Essential for:

- **Visual regression**: Compare screenshots before/after changes
- **UI validation**: Verify layouts match design standards
- **Form testing**: Fill and submit forms, verify responses
- **Flow testing**: Walk through multi-step user flows (login → navigate → action → verify)

### Available Tools

| Tool | Purpose |
|------|---------|
| `browser_navigate` | Go to a URL |
| `browser_snapshot` | Get accessibility tree (preferred for actions) |
| `browser_take_screenshot` | Capture PNG/JPEG of viewport or element |
| `browser_click` | Click an element by ref |
| `browser_fill_form` | Fill multiple form fields |
| `browser_file_upload` | Upload files to file inputs |
| `browser_handle_dialog` | Accept/dismiss dialogs |
| `browser_press_key` | Send keyboard events |
| `browser_close` | Close current page |
| `browser_tabs` | List open tabs |
| `browser_evaluate` | Run JS in the page |

---

## 2. Screenshot Management

### Directory Structure

Screenshots MUST be saved to `.playwright-mcp/screenshots/` — never to the project root.

```bash
.playwright-mcp/
├── screenshots/          # All screenshots go here
│   ├── ref-*.png         # Reference screenshots (known-good state)
│   ├── current-*.png     # Current state for comparison
│   └── debug-*.png       # Temporary debugging screenshots
└── console-*.log         # Browser console logs (auto-generated)
```

### Naming Convention

| Prefix | Purpose | Example |
|--------|---------|---------|
| `ref-` | Reference/baseline screenshot | `ref-dashboard.png` |
| `current-` | Current state being tested | `current-books.png` |
| `debug-` | Temporary debug capture | `debug-overflow.png` |
| `{feature}-` | Feature-specific capture | `reader-fullwidth.png` |

---

## 3. Common Workflows

### Visual Regression Check

```
1. browser_navigate → target URL
2. browser_take_screenshot → current-{page}.png
3. Read ref-{page}.png (if exists) → compare visually
4. Report: what changed, what looks correct
```

### Form Testing

```
1. browser_navigate → form URL
2. browser_snapshot → get form structure (accessibility tree)
3. browser_fill_form → fill all fields
4. browser_click → submit button
5. browser_snapshot → verify success message / validation errors
6. browser_take_screenshot → evidence
```

### Multi-Step Flow Testing

```
1. browser_navigate → login page
2. browser_fill_form → credentials
3. browser_click → login button
4. browser_snapshot → verify dashboard loaded
5. browser_navigate → target page
6. browser_take_screenshot → evidence of final state
```

---

## 4. Best Practices

| Practice | Why |
|----------|-----|
| Use `browser_snapshot` before `browser_click` | Gets element refs from accessibility tree — more reliable than CSS selectors |
| Always screenshot before AND after changes | Visual evidence for PR review |
| Use `ref-` prefix for baseline screenshots | Clear distinction between known-good and current state |
| Clean debug screenshots after debugging | Prevent `.playwright-mcp/` from bloating |
| Never hardcode viewport sizes | Use `browser_resize` to test responsive layouts explicitly |

---

## 5. Troubleshooting

| Problem | Fix |
|---------|-----|
| Element not found | Use `browser_snapshot` to check accessibility tree — element may have different text |
| Screenshot is blank | Page may not be fully loaded — add `browser_wait_for` before screenshot |
| Form submission fails silently | Check `browser_console_messages` for JS errors |
| Navigation timeout | Dev server may be down — verify with `curl localhost:3000` |
| Dialog blocks interaction | Use `browser_handle_dialog` to accept/dismiss before continuing |

---

## See Also

- `core/sops/mcp-setup.md` — MCP server configuration
- `core/sops/api-testing.md` — API testing with curl (complement to UI testing)
