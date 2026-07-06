# Code Review Practices

> **Module**: core/code-review
> **Scope**: All disciplines

---

## TL;DR

| Aspect | Practice |
|--------|----------|
| **Purpose** | Quality, learning, consistency |
| **Turnaround** | < 24h for reviews |
| **Size** | < 400 lines per PR |
| **Focus** | Architecture > style |

---

## Principles

### 1. Review is Collaboration

> **"Review is not to criticize, it's to improve together."**

- Assume good intent
- Ask before assuming
- Explain the "why" behind suggestions

### 2. Feedback Priority

```
1. Bugs/Security       <- Blocker
2. Architecture        <- Important
3. Performance         <- Important if applicable
4. Readability         <- Suggestion
5. Style/Formatting    <- Automate (lint)
```

### 3. Manageable Size

| Size | Review effectiveness |
|------|---------------------|
| < 200 lines | Optimal |
| 200-400 lines | Acceptable |
| 400+ lines | Split |

---

## Reviewer Checklist

### Mandatory

- [ ] Does the code solve the described problem?
- [ ] Are there tests for the changes?
- [ ] Does the code follow project patterns?
- [ ] Are there security vulnerabilities?

### Recommended

- [ ] Is the code maintainable?
- [ ] Is documentation updated?
- [ ] Are names descriptive?
- [ ] Is there avoidable duplicated code?

### DO NOT review (automate)

- Code formatting (ESLint/Prettier)
- Sorted imports (ESLint)
- Correct types (TypeScript)

---

## Comment Types

### Standard Prefixes

| Prefix | Meaning |
|--------|---------|
| `nit:` | Nitpick, non-blocking |
| `suggestion:` | Optional suggestion |
| `question:` | Question, non-blocking |
| `blocker:` | Must be resolved before merge |
| `praise:` | Positive recognition |

### Examples

```
nit: Could use destructuring here for clarity.

blocker: This query isn't sanitized, SQL injection vulnerability.

question: Did you consider useMemo here? Seems like it could benefit.

praise: Excellent edge case handling, hadn't considered it.
```

---

## Review Process

### 1. Before Requesting Review

```
- PR description complete
- Tests passing
- Lint/format passing
- Self-review done
- Size < 400 lines
```

### 2. During Review

```
1. Read full description
2. Understand the context
3. Review code systematically
4. Comment constructively
5. Approve or request changes
```

### 3. After Review

```
Author:
- Respond to all comments
- Implement necessary changes
- Re-request review if changes were made

Reviewer:
- Re-review changes
- Approve when satisfied
```

---

## Anti-Patterns

| Anti-pattern | Better practice |
|--------------|----------------|
| Rubber stamping (approve without reading) | Take time to review properly |
| Excessive nitpicking | Focus on what matters |
| Vague comments ("This is wrong") | Explain why and suggest alternative |
| Reviews that take days | Respond within < 24h |
| Giant PRs | Split into atomic changes |

---

## Healthy Metrics

| Metric | Target |
|--------|--------|
| Average review time | < 24h |
| Average PR size | < 300 lines |
| % PRs with changes requested | 30-50% |
| Average comments per PR | 3-7 |

---

## Related

- `core/git/` — PR conventions
- `core/documentation/` — Documenting decisions
- `doctrine/governance-cycle.md` — Review as governance

---

**Module**: core/code-review | **Scope**: All disciplines | **Updated**: 2026-03-23
