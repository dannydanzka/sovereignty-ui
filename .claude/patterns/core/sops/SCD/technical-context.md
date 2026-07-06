# SCD Step 2: Technical Context

> **Input**: task ticket key + feature keywords
> **Output**: external docs URLs saved, API contracts identified

---

## Procedure

### 2.1 Search external docs

```
docs_search → "TICKET-ID <feature keyword>"
  spaces_filter: B3
```

Look for:
- `[FrontEnd] - Documentación Técnica: <Feature> — TICKET-ID` → primary tech doc
- `[FrontEnd] - Research Técnico: <Topic> — TICKET-ID` → investigation doc
- `Contrato API - <Feature>` → API spec
- `[FrontEnd] - Documentación Técnica Consolidada: Release <X>` → release context

### 2.2 Save URLs

Store external docs URLs — they go in the PR description (Documentación section) and in ticket system comments later.

### 2.3 Identify API involvement

| Signal | Action |
|--------|--------|
| New endpoint mentioned in ticket system | Read API contract from external docs |
| Backend ticket linked | Check if API is deployed to QA |
| No API contract found | Flag to developer — may need to request from backend |

### 2.4 Read existing tech docs

If external docs pages exist for this feature, read them. They contain:
- Architecture decisions already made
- Data flow diagrams
- Edge cases identified by QA/PM

---

## Rules

- ALWAYS search external docs before writing code — tech docs may already exist
- Save ALL relevant URLs — you'll need them for PR and ticket system comments
- If no external docs pages exist, note it — you'll create them in SDP step 12
- Check the Spikes space (B3) specifically — that's where FE docs live
