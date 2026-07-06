# Architecture Patterns

> **Module**: core/architecture
> **Scope**: Structural principles and code philosophy

---

## Patterns

| Pattern | Purpose | Priority |
|---------|---------|----------|
| `code-sovereignty.md` | The 6 sovereignty principles | High |
| `clean-architecture.md` | Layers, flows, context boundaries | High |
| `anti-patterns.md` | Architecture violations and ESLint enforcement | High |
| `modularization.md` | File organization | Medium |
| `monorepo.md` | Monorepo patterns | Low |

---

## TL;DR

**Core principle**: Each layer has sovereignty over its domain.

```
Domain (pure logic) → NO external dependencies
Infrastructure → Implements Domain interfaces
Presentation → UI only, delegates to hooks/services
```

---

## When to consult

- Creating new feature → `clean-architecture.md`
- Deciding where to put code → `clean-architecture.md`
- Understanding philosophy → `code-sovereignty.md`
- Reviewing violations → `anti-patterns.md`
- Organizing files → `modularization.md`

---

**Total**: 5 patterns | **Updated**: 2026-03-11
