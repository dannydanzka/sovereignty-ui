# Search Before Creating

> **Rule**: NEVER create blindly. Read context, investigate existing, then act.
> **Principle**: 3 searches take 5 seconds. Rework takes hours.

## Protocol (in order)

```
1. Read .claude/business/   → understand the task
2. Read .claude/plans/      → understand the plan (lists exact files)
3. Search similar files     → find 2-3 existing patterns
4. Read them completely     → match conventions exactly
5. THEN create/modify       → only targeted, informed changes
```

## Before Creating Code

| Check | Command |
|-------|---------|
| Similar component? | `grep -r "ComponentName" src/ -l` |
| Similar hook? | `grep -r "useSimilar" src/ -l` |
| Similar helper? | `grep -r "formatSimilar\|getSimilar" src/utils/ -l` |
| Similar service? | `grep -r "serviceName" src/services/ -l` |
| Similar constant? | `grep -r "SIMILAR_VALUE" src/ -l` |

## Before Creating Docs/Patterns

| Check | Where |
|-------|-------|
| Pattern documented? | `ls .claude/patterns/` |
| Rule in _global.md? | Read `rules/_global.md` contextual references |
| Library docs? | Use **context7** MCP (`resolve-library-id` → `query-docs`) |

## Context7 — Library Documentation

When working with any library (React Navigation, styled-components, Redux Saga, Jest, etc.):

```
1. mcp__context7__resolve-library-id → get library ID
2. mcp__context7__query-docs → get current best practices
```

Use context7 BEFORE writing library-specific code — your training data may be outdated.

## Decision

| Similarity | Action |
|-----------|--------|
| Exact match exists | REUSE — don't create |
| 70%+ match | ADAPT existing file |
| < 70% | CREATE following same conventions |

## Anti-Patterns

| Wrong | Right |
|-------|-------|
| Grep 20 files to understand a feature | Read business context file first |
| Create helper without searching | `grep -r "format.*Date" src/ -l` |
| Write library code from memory | Check context7 for current API |
| Assume something doesn't exist | 3 searches, 5 seconds |

## Token Economy

| Approach | Token cost |
|----------|-----------|
| Explore code first | ~5,000-10,000 tokens |
| Read context first, targeted exploration | ~1,000-2,000 tokens |
