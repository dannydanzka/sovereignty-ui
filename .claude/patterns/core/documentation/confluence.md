# Confluence Documentation Standards

> **Module**: sovereignty/core/documentation
> **Scope**: Cross-discipline — applies to all technical documentation in Confluence
> **Updated**: 2026-03-11

---

## TL;DR

| Aspect | Standard |
|--------|----------|
| **Language** | Match target audience (Spanish/English as appropriate) |
| **Format** | Markdown via MCP (converted by Confluence) |
| **Structure** | Metadata → Objetivo → Introduccion → Alcance → Content → Conclusion → Acronimos |
| **Audience** | Always explicit — developers, tech leads, direction, or mixed |
| **Width** | Fixed-width pages for technical docs |

---

## Document Structure

Every technical document in Confluence follows a consistent structure. This ensures readability, professionalism, and alignment with sovereignty governance.

### Metadata Block (Required)

Every page starts with a metadata block — one field per line, bold labels:

```markdown
**Proyecto:** [Organization Name]
**Area:** [Discipline or department]
**Autor:** [Name] — [Role] | [email]
**Version:** [X.Y]
**Fecha:** [DD Month YYYY]
**Alcance:** [What companies/teams this covers]
**Repositorio:** [repo URL if applicable]
```

### Section Flow (Professional Document)

```
Metadata block
---
Objetivo                    → What this document defines
Introduccion                → Context, problem, background
Alcance                     → In scope / Out of scope
[Content sections]          → Technical meat of the document
Conclusion                  → Summary and key takeaway
Acronimos y Definiciones    → Glossary of terms
Contacto                    → Owner and contact info (optional)
---
Closing quote               → Doctrinal quote (optional)
```

### Minimal Document (Short)

For documents that don't warrant full structure:

```
Metadata block
---
Objetivo
[Content sections]
---
Contacto (optional)
```

---

## Content Patterns

### Section Hierarchy

| Level | Use | Example |
|-------|-----|---------|
| `##` H2 | Major sections | Objetivo, Introduccion, Alcance |
| `###` H3 | Subsections within a major section | Dentro del alcance, Fuera del alcance |
| `####` H4 | Rare — specific details within subsections | Only when H3 nesting is insufficient |

**Rule**: Never skip levels (no H4 under H2).

### Tables

Use tables for structured comparisons, matrices, and reference data:

```markdown
| Column A | Column B | Column C |
| --- | --- | --- |
| Value 1 | Value 2 | Value 3 |
```

**When to use tables:**
- Comparing options (with/without, before/after)
- Reference matrices (permissions, roles, tools)
- Parameter documentation
- Feature comparisons

**When NOT to use tables:**
- Single-column lists (use bullet points)
- Narrative content (use paragraphs)
- Code examples (use code blocks)

### Code Blocks

Use fenced code blocks with language hints when applicable:

````markdown
```typescript
const example = "code here";
```
````

For ASCII diagrams and flow charts (no language hint):

````markdown
```
SOVEREIGNTY REPO (fuente de verdad)
├── Doctrine:   POR QUE
├── Core:       QUE
└── Discipline: COMO
```
````

### Blockquotes

Use blockquotes for:
- Doctrinal quotes and principles
- Key callouts that must stand out
- Definitions that anchor a section

```markdown
> *"La gobernanza no limita la velocidad — la hace sostenible."*
```

### Bullet Lists

- **Unordered lists** → For items without sequence (features, characteristics)
- **Ordered lists** → For steps, sequences, priorities
- **Bold first word** → When each item introduces a concept

```markdown
- **Gobernanza Explicita** — Rules documented, not in memory
- **Separacion de Dominios** — Clear, defensible boundaries
```

---

## Writing Guidelines

### Audience Segmentation

Documents may serve multiple audiences. Use clear section headers when content targets specific groups:

```markdown
## Guia para Developers
[Developer-specific content]

## Guia para Tech Leads y QA
[Lead-specific content]

## Resumen Ejecutivo (para Direccion)
[Executive summary]
```

### Tone

| DO | DON'T |
|----|-------|
| Direct and concise | Verbose or academic |
| Active voice | Passive voice |
| Specific examples | Abstract generalizations |
| "This defines X" | "This document aims to provide a comprehensive overview of X" |

### Language Rules

| Context | Language |
|---------|----------|
| Technical documentation body | Spanish (audience-facing) |
| Technical terms | English when universally used (Clean Architecture, Token Economy, sprint) |
| Code examples | English (variable names, comments) |
| Acronym definitions | English expansion + Spanish description |

### Content Density

- **Paragraphs**: 2-4 sentences max. Break long paragraphs.
- **Sections**: If a section exceeds ~15 lines, consider subsections.
- **Tables**: Preferred over paragraphs for structured data.
- **Redundancy**: Zero. Say it once, in the right place. Reference other sections, don't repeat.

---

## Page Configuration

### Page Width

| Type | Width | When |
|------|-------|------|
| Technical document | Fixed-width | Default for all technical docs |
| Dashboard/overview | Full-width | Only for pages with wide tables or diagrams |

### Emojis in Titles

- Use page emoji (Confluence icon) for visual navigation
- **Do NOT** use emojis inside the title text itself
- **Do NOT** use emojis inside document body content

### Labels

Apply labels for discoverability:

| Label | Use |
|-------|-----|
| `architecture` | Architectural decisions, patterns |
| `sovereignty` | Sovereignty system documents |
| `sop` | Standard operating procedures |
| `frontend` | Frontend-specific |
| `backend` | Backend-specific |
| `onboarding` | New team member resources |

---

## Document Types in Confluence

### Technical Architecture Document

Full structure. Theoretical + practical. Audience: developers + leads + direction.

**Example**: Sovereignty System page, SOX Compliance permissions architecture.

**Structure**: Metadata → Objetivo → Introduccion → Alcance → [Technical content] → Conclusion → Acronimos → Contacto

### SOP (Procedure)

Step-by-step guide. Audience: developers executing the procedure.

**Structure**: Metadata → Objetivo → Prerequisitos → [Numbered steps] → Troubleshooting → Contacto

### Decision Record

Why a decision was made. Audience: future maintainers.

**Structure**: Metadata → Contexto → Decision → Alternativas Consideradas → Consecuencias → Contacto

### Onboarding Guide

Getting started. Audience: new team members.

**Structure**: Metadata → Prerequisitos → [Setup steps] → Recursos Adicionales → Contacto

---

## Quality Checklist

Before publishing or updating a Confluence page:

- [ ] Metadata block is complete and current
- [ ] Objetivo section clearly states the purpose
- [ ] Alcance defines what's in and out
- [ ] No section exceeds screen height without subsections
- [ ] Tables have headers and consistent formatting
- [ ] Code blocks use appropriate language hints
- [ ] No orphan sections (H2 with only 1-2 lines)
- [ ] Acronyms section covers all non-obvious terms
- [ ] Page has appropriate labels
- [ ] Version comment describes what changed (for updates)

---

## Anti-Patterns

| Anti-Pattern | Why It's Wrong | Fix |
|-------------|----------------|-----|
| Wall of text without structure | Unreadable, no navigation | Break into H2/H3 sections |
| Table with 1 column | Misuse of tables | Use bullet list |
| Code block for non-code content | Confuses readers | Use blockquotes or bold |
| Duplicate content across pages | Maintenance nightmare | Link to single source of truth |
| Missing Alcance section | Scope creep, confusion | Always define in/out |
| Emoji-heavy titles and content | Unprofessional, noisy | Reserve emojis for page icons only |
| No version comment on updates | No audit trail | Always describe what changed |

---

## Related

- `core/documentation/index.md` — General documentation standards
- `core/sops/mcp-confluence.md` — How to manage Confluence pages via MCP
- `core/sops/pr-documentation.md` — PR documentation template
- `doctrine/governance-cycle.md` — Documentation as governance asset
