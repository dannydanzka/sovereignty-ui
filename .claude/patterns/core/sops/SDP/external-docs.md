# SDP Step 12: external docs Documentation

> **Input**: Implementation complete, PR created
> **Output**: external docs pages published in Spikes space (B3)

---

## Document Types

| Task Type | Document | Title Format |
|-----------|----------|-------------|
| Research/Spike | Research Técnico | `[FrontEnd] - Research Técnico: <Topic> — TICKET-ID` |
| Implementation | Documentación Técnica | `[FrontEnd] - Documentación Técnica: <Topic> — TICKET-ID` |

**Every implementation task needs Documentación Técnica.** Research Técnico is additional for spike/research tasks.

## Before Creating

**ALWAYS check existing pages first:**

```
docs_search → "[FrontEnd]" in docs space
```

Match the format of existing pages in the same category. Do NOT invent a new format.

## Metadata (ALL pages)

```
Proyecto: the organization
Área: Applications Engineering
Autor: <Name> — Applications Engineering | <email> | <Company>
Fecha: <DD de Mes del YYYY>  (long format: "09 de Abril del 2026")
Alcance: <Brief scope>
Repositorio: <repo name>
```

**Rules:**
- NO Versión field — external docs handles versioning natively
- NO Contacto section — already in Autor metadata
- Autor includes corporate email and company (Corporativo BeFra Group or the organization)

## Structure

```
Tickets Relacionados (at the top — ALL related TICKET-ID with links)

Metadata table

1. Objetivo
2. Introducción
3. Alcance
4. <Content sections — domain-specific>
5. Conclusión
6. Acrónimos (if needed)
```

## Research Técnico Content

- Problem statement
- Investigation methodology
- Options analyzed (with pros/cons)
- Recommended solution (with justification)
- References (SDK docs, existing code, Amplitude docs)

## Documentación Técnica Content

- Solution summary (references Research Técnico if exists)
- Architecture / data flow
- Files changed (with descriptions)
- Key technical decisions (with reasoning)
- Impact analysis
- Testing strategy

## Language

- **Spanish** with proper accents (á, é, í, ó, ú, ñ)
- Technical terms in English (SDK, API, deviceId, etc.)
- external docs stores accents as HTML entities (`&oacute;`) — this is correct behavior

---

## Rules

- Check existing pages BEFORE creating — match format
- Include ALL related tickets in Tickets Relacionados
- Reference Research Técnico from Documentación Técnica (and vice versa)
- Add external docs URLs to PR description (Documentación section)
- Add external docs URLs to ticket system comments
