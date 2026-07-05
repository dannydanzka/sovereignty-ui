# SOP: Pull Request Documentation & Submission

> **PURPOSE**: Standardized PR creation workflow via Bitbucket MCP, including title format, description template, reviewer assignment, and branch targeting
> **SCOPE**: All projects using Bitbucket + Jira + Atlassian MCP servers
> **PREREQUISITES**: Bitbucket MCP server configured (`atlassian-mcp-setup.md`), branch pushed to remote
> **UPDATED**: 2026-03-10

---

## 1. Branch Flow

PRs follow a promotion pipeline. Always target the correct environment branch:

```
feature/PLUS-XXXX-description
        │
        ▼
       qa          ← First PR target (testing)
        │
        ▼
       lab         ← Second promotion (staging)
        │
        ▼
      master       ← Final promotion (production)
```

**Rules:**
- Feature branches always target `qa` first
- Promotion from `qa → lab` and `lab → master` are separate PRs
- Never skip environments (no direct feature → master)
- **If the user does not specify the target environment, always ask before creating the PR**

---

## 2. Title Format

```
[TARGET][Type][Module] PLUS-XXXX: Description
```

| Segment | Values | Purpose |
|---------|--------|---------|
| `[TARGET]` | `[QA]`, `[LAB]`, `[MASTER]` | Target environment |
| `[Type]` | `[Feature]`, `[Fix]`, `[Refactor]`, `[Hotfix]` | Change type |
| `[Module]` | `[Sold Out]`, `[Orders]`, `[Promotions]`, etc. | Business module |
| `PLUS-XXXX:` | Jira ticket ID with colon | **Required** for Jira auto-detection |
| Description | Brief summary in Spanish | What the PR does |

**Examples:**
```
[QA][Feature][Sold Out] PLUS-9210: Checkbox de confirmación antes de enviar formulario
[QA][Fix][Orders] PLUS-9278: Incluir etiqueta de tipo de AS en la captura de pedido
[LAB][Feature][Promotions] PLUS-9141: Promociones Escalables SOX
[MASTER][Hotfix][Auth] PLUS-9300: Fix token refresh loop
```

**Critical**: The `PLUS-XXXX` in the title is what triggers Jira's automatic link detection. Without it, the PR won't appear in the Jira ticket.

---

## 3. Description Template

```markdown
Certifico que la totalidad de código de este PR se implementa atendiendo la solicitud enlazada en el mismo.

---

## ¿Qué incluye este PR?

[Brief summary of what the PR does and why]

**Cambios incluidos:**

* `package/path/to/file.ext` — Description of change
* `package/path/to/file.ext` — Description of change

## ¿Por dónde debería de iniciar el reviewer?

1. `path/to/main-file` — Why start here (core logic, orchestration, etc.)
2. `path/to/secondary-file` — Supporting changes
3. `path/to/tertiary-file` — UI or minor changes

## ¿Cómo debería de probarse la funcionalidad manualmente?

1. Navigate to **Module > Section**
2. Perform [action]
3. **Validate:** [expected result]
4. Perform [edge case action]
5. **Validate:** [expected result]

> **Nota QA**: [Any special setup, test data, or environment requirements]

## ¿Puedes proveer algún contexto adicional?

[Technical decisions, architecture notes, known limitations, related debt]

## ¿Que tickets son relevantes a este PR?

### https://your-company.atlassian.net/browse/PLUS-XXXX
```

**Notes on the template:**
- The certification statement at the top is mandatory
- Description sections are in Spanish (team convention)
- The Jira link at the bottom must be a raw URL for Bitbucket's smart link rendering
- For large PRs, expand the "Cambios incluidos" section with subsections per feature

---

## 4. Procedure: Creating a PR via MCP

### Step 0: Confirm target environment

**Before anything else**, if the user did not specify the target environment, **ASK**:

> "¿A qué ambiente va dirigido este PR? Opciones: `qa`, `lab`, `master` (prod)"

**Never assume the target branch.** The user must confirm it explicitly.

### Step 1: Verify branch state

```bash
# Ensure branch is pushed and up to date
git log master..HEAD --oneline
git diff master...HEAD --stat
git branch -vv
```

### Step 2: Identify reviewers

Query workspace members to get UUIDs:

```
mcp__atlassian-bitbucket__bb_get
  path: /workspaces/{workspace}/members
  queryParams: {"pagelen": "100"}
  jq: values[*].user.{display_name: display_name, uuid: uuid}
```

### Step 3: Get repo slug

```bash
git remote -v | head -1
# Extract: git@bitbucket.org:{workspace}/{repo-slug}.git
```

### Step 4: Create the PR

```
mcp__atlassian-bitbucket__bb_post
  path: /repositories/{workspace}/{repo-slug}/pullrequests
  body: {
    "title": "[QA][Feature][Module] PLUS-XXXX: Description",
    "description": "...(template above)...",
    "source": {"branch": {"name": "feature/PLUS-XXXX-description"}},
    "destination": {"branch": {"name": "qa"}},
    "reviewers": [
      {"uuid": "{reviewer-1-uuid}"},
      {"uuid": "{reviewer-2-uuid}"}
    ],
    "close_source_branch": true
  }
  jq: {id: id, title: title, state: state, destination: destination.branch.name, link: links.html.href}
```

### Step 5: Verify and suggest screenshots

After PR creation:
1. Return the PR link to the user
2. **Suggest**: "If the PR includes UI changes, consider attaching screenshots of the feature in the PR description for reviewer context."

> **Note**: Claude Code cannot take browser screenshots. The user must capture them manually and they can be added to the PR description as embedded images.

### Step 6: Update the PR (if corrections needed)

```
mcp__atlassian-bitbucket__bb_put
  path: /repositories/{workspace}/{repo-slug}/pullrequests/{id}
  body: { ...fields to update... }
  jq: {id: id, title: title, state: state, link: links.html.href}
```

---

## 5. Common Reviewer Teams

Maintain a reference of frequent reviewer groups per project. Example:

| Team | Members | UUIDs |
|------|---------|-------|
| Frontend | Jose Alfredo Lozoya Orozco | `{9003195e-d3a4-4803-9df7-bc6ab967ee96}` |
| Frontend | Jesus Manuel Cardenas Hernandez | `{93c2ab37-bef4-47a3-b989-bc679c4397b9}` |

> Update this table as team composition changes.

---

## 6. Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Jira doesn't detect PR | `PLUS-XXXX` missing from title | Update title to include ticket ID with colon separator |
| PR targets wrong branch | Destination set to `master` instead of `qa` | Update PR destination via `bb_put` |
| Reviewer not found | Wrong UUID or user not in workspace | Re-query workspace members for correct UUID |
| Description formatting broken | Markdown escaping issues in MCP body | Use `\\n` for newlines, escape special chars in JSON |

---

## 7. Checklist Summary

- [ ] Branch pushed to remote
- [ ] Title follows format: `[TARGET][Type][Module] PLUS-XXXX: Description`
- [ ] `PLUS-XXXX` present in title for Jira detection
- [ ] Destination branch is correct (`qa` for features)
- [ ] Description uses team template (certification + 5 sections)
- [ ] Reviewers assigned
- [ ] Jira ticket URL in "Tickets relevantes" section
- [ ] UI screenshots suggested (if applicable)
- [ ] `close_source_branch: true` set

---

## See Also

- **SOP**: `atlassian-mcp-setup.md` - Configure Bitbucket MCP server
- **SOP**: `api-testing.md` - Test APIs before submitting PR
- **Pattern**: `sovereignty/core/git/` - Git workflow and branch conventions

---

**Version:** 2.0 | **Last Updated:** 2026-03-10
