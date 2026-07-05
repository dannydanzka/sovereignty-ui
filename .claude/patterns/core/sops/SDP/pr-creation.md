# SDP Step 11: PR Creation

> **Input**: Branch pushed (direct or sacrifice)
> **Output**: PR open with correct title, description, reviewers

---

## PR Title

```
[<TARGET>][<Type>][<Module>] - TICKET-ID TICKET-IDYYYY: Description
```

- **TARGET**: `QA`, `LAB`, `MASTER`
- **Type**: `Feature`, `BugFix`, `Hotfix`, `Refactor`, `Chore`, `Test`, `Doc`
- **Module**: English name (Orders, Cart, Auth, Shared, etc.)
- **TICKET-ID**: ALL related ticket keys — git host auto-links each one to ticket system
- **Description**: task ticket title (task context), NOT technical summary

### Title rules
- Include ALL related PLUS tickets for ticket system auto-linking
- Description = task ticket title, NOT a technical summary
- Technical details go in the PR body

## PR Description

```markdown
Certifico que la totalidad de código de este PR se implementa atendiendo la solicitud enlazada en el mismo.

---

## ¿Qué incluye este PR?

<Brief summary + bullet list of changes with business context>

---

## ¿Por dónde debería de iniciar el reviewer?

1. **<Layer>** — `src/path/file.ts` → <why start here>
2. **<Layer>** — `src/path/file.ts` → <supporting changes>

---

## ¿Cómo debería de probarse la funcionalidad manualmente?

**Prerequisitos:**
- Usuario con rol: <DISTRIBUTOR|ASSOCIATED>
- Ambiente: QA / DEV

**Pasos:**
1. <Action>
   - [ ] <Expected result>

---

## ¿Puedes proveer algún contexto adicional?

- <Technical decisions, trade-offs, known limitations>

---

## ¿Que tickets son relevantes a este PR?

- https://organization.atlassian.net/browse/TICKET-ID
- https://organization.atlassian.net/browse/TICKET-IDYYYY

---

## Documentación

- [Research Técnico: <Topic> — TICKET-ID](https://organization.atlassian.net/wiki/spaces/B3/pages/...)
- [Documentación Técnica: <Topic> — TICKET-ID](https://organization.atlassian.net/wiki/spaces/B3/pages/...)
```

## Description Rules

| Rule | Why |
|------|-----|
| NO `Completa el template...` boilerplate | Noise for reviewer |
| NO title repetition in body (`Feat TICKET-ID - Desc`) | Title field already carries this |
| Tickets as direct URLs only | git host auto-renders as smart links |
| external docs in separate Documentación section | Don't mix with task tickets |
| DO NOT list `.claude/` files in changes | Internal documentation, not reviewable code |

## Reviewers

Always assign from project team. Query if UUIDs unknown:

```
bb_get → /workspaces/{workspace}/members
  jq: values[*].user.{display_name: display_name, uuid: uuid}
```

## Create PR

```
pr_create → /repositories/{workspace}/{repo}/pullrequests
  body: {
    "title": "[QA][Feature][Module] - TICKET-ID: Desc",
    "description": "...",
    "source": {"branch": {"name": "<branch>"}},
    "destination": {"branch": {"name": "qa"}},
    "reviewers": [{"uuid": "{...}"}],
    "close_source_branch": <true for sacrifice, false for feature>
  }
```

## Update PR (corrections)

```
pr_update → /repositories/{workspace}/{repo}/pullrequests/{id}
  body: { ...fields to update... }
```

NEVER decline — ALWAYS update.
