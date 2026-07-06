# Stylelint Configuration

> **Module**: frontend/tooling
> **Scope**: CSS-in-JS and stylesheet enforcement
> **Updated**: 2026-03-10

---

## TL;DR

**DO**:
- Use design tokens for colors, spacing, typography
- Follow property order conventions
- Run stylelint before committing

**DON'T**:
- Hardcode hex colors (`#FFC107` → use token)
- Hardcode pixel values (`24px` → use spacing token)
- Mix shorthand and longhand properties

---

## Pattern ↔ Rule Enforcement

| Sovereignty Pattern | Stylelint Rule | ESLint Rule |
|---------------------|----------------|-------------|
| Use color tokens | `color-named: never` | `custom/no-hardcoded-colors` |
| Use spacing tokens | — | `custom/no-hardcoded-spacing` |
| No native HTML elements | — | `custom/no-native-html` |
| Property order | `order/properties-order` | — |

---

## Styled-Components Integration

For CSS-in-JS projects (styled-components, Emotion), stylelint requires a processor:

```json
{
  "customSyntax": "postcss-styled-syntax",
  "extends": ["stylelint-config-standard"],
  "rules": {
    "color-named": "never",
    "declaration-no-important": true,
    "no-descending-specificity": true
  }
}
```

---

## Design Token Enforcement

```typescript
// Hardcoded (violation)
background: #FFC107;
padding: 24px;
font-size: 14px;

// Token-based (correct)
background: ${({ theme }) => theme.colors.primary500};
padding: ${({ theme }) => theme.spacing.md};
font-size: ${({ theme }) => theme.typography.body.fontSize};
```

---

## How projects configure

sovereignty/ documents the **patterns and enforcement concepts**.
Each project's `.stylelintrc` implements specific config:

```
sovereignty/frontend/tooling/stylelint.md  →  WHAT patterns, WHY tokens
project/.stylelintrc                       →  HOW configured (rules, processors)
```

---

## Related

- `frontend/presentation/styling/design-tokens.md` - Token definitions
- `frontend/presentation/styling/styled-components.md` - Styled-components patterns
- `frontend/tooling/eslint.md` - ESLint complementary rules

---

**Updated**: 2026-03-10
