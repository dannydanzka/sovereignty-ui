# Testing Patterns

> **Module**: core/testing
> **Scope**: Testing philosophy and strategies (agnostic)

---

## Patterns

| Pattern | Purpose | Priority |
|---------|---------|----------|
| `philosophy.md` | Value > Coverage, Essential testing | High |
| `mocking.md` | Mock-first strategy | Medium |

---

## TL;DR

**Principle**: Tests that deliver value, not coverage for coverage's sake.

```typescript
// Essential: Critical behavior
it('rejects payment with expired card', () => { ... });

// Verbose: Implementation details
it('calls setLoading with true', () => { ... });
```

**Mock-first**: Develop with mocks -> Validate -> Migrate to real.

---

## When to Consult

- Deciding what to test -> `philosophy.md`
- Implementing new feature -> `mocking.md`
- Verbose or fragile tests -> `philosophy.md`

---

**Total**: 2 patterns | **Updated**: 2026-03-23
