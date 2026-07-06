# Quality Patterns

> **Module**: core/quality
> **Scope**: Code quality and best practices — applies to ALL disciplines
> **Updated**: 2026-03-23

---

## Patterns

| Pattern | Purpose |
|---------|---------|
| `naming.md` | File, component, variable naming conventions |
| `error-handling.md` | Consistent error handling patterns |
| `type-safety.md` | Strict typing, no `any` |
| `comments-policy.md` | When to comment (Clean Code) |
| `code-size-limits.md` | File/function size limits |
| `anti-patterns.md` | Universal anti-patterns (magic numbers, god objects, coupling, dead code) |
| `dead-code-prevention.md` | Detect and eliminate unused code |
| `toctou-and-atomicity.md` | Atomic repository writes, optimistic concurrency, discriminated-union results |
| `security-audit-checklist.md` | Five-vector post-phase security audit (tenant, authz, encoding, TOCTOU, input) |

---

## When to Consult

| Problem | Pattern |
|---------|---------|
| Handling errors | `error-handling.md` |
| Naming variables/functions | `naming.md` |
| Deciding whether to comment | `comments-policy.md` |
| File too large | `code-size-limits.md` |
| Using `any` | `type-safety.md` |
| Unused code | `dead-code-prevention.md` |
| Concurrent writes / TOCTOU | `toctou-and-atomicity.md` |
| Pre-release security review | `security-audit-checklist.md` |
| React-specific anti-patterns | `frontend/quality/anti-patterns.md` |

---

**Total**: 9 patterns | **Updated**: 2026-05-08
