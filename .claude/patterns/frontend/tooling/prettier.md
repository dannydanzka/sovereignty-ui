# Prettier Configuration

> **Module**: frontend/tooling
> **Scope**: Code formatting (automated, non-negotiable)
> **Updated**: 2026-03-10

---

## TL;DR

Prettier is the **formatting sovereign** — no debates about style. Configure once, enforce everywhere.

**DO**:
- Run prettier on save (IDE integration)
- Include in CI/CD pipeline
- Use consistent config across all project packages

**DON'T**:
- Override prettier with manual formatting
- Use ESLint for formatting (let prettier handle it)
- Debate formatting in code reviews (automate it)

---

## Standard Configuration

```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Key Decisions

| Option | Value | Reason |
|--------|-------|--------|
| `singleQuote` | `true` | Industry standard for JS/TS |
| `trailingComma` | `"all"` | Cleaner git diffs |
| `semi` | `true` | Explicit statement termination |
| `printWidth` | `80` | Readable in split-pane editors |
| `arrowParens` | `"always"` | Consistent arrow functions |

---

## ESLint Integration

Use `eslint-config-prettier` to disable ESLint rules that conflict with prettier:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ]
}
```

**Rule**: ESLint enforces code quality. Prettier enforces formatting. No overlap.

---

## How projects configure

sovereignty/ documents the **standard config and rationale**.
Each project's `.prettierrc` implements the specific config:

```
sovereignty/frontend/tooling/prettier.md  →  WHY these options, WHAT the standard is
project/.prettierrc                       →  HOW configured (may have project overrides)
```

---

## Related

- `frontend/tooling/eslint.md` - ESLint rules (quality, not formatting)
- `core/code-review/index.md` - Formatting is not a review concern (automate it)

---

**Updated**: 2026-03-10
