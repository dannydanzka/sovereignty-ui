# Styling

> **Module**: presentation/styling
> **Tech**: Styled-components + Design Tokens
> **Principle**: Consistent, SSR-safe, token-based

---

## Patterns

| Pattern | Purpose | ESLint |
|---------|---------|--------|
| `styled-components.md` | SSR-safe patterns, composition | `no-native-html` |
| `design-tokens.md` | Colors, typography, spacing | `design-tokens-policy` |
| `responsive.md` | Breakpoints, grids, media queries | - |
| `text.md` | Dynamic text truncation with ellipsis | Responsive UI text |

---

## TL;DR

**Always use tokens, never hardcode.**

```typescript
// ✅ DO - tokens
const Card = styled.div`
  padding: ${spacing.md};
  color: ${color.textPrimary};
  border-radius: ${shape.md};
  box-shadow: ${elevation.sm};
`;

// ❌ DON'T - hardcoded
const Card = styled.div`
  padding: 16px;
  color: #333333;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;
```

**SSR-safe**: Use flat maps, NOT theme context.

```typescript
// ✅ SSR-safe
import { spacing, color } from '@constants';

// ❌ SSR crash
const theme = useTheme();  // Context not available on server
```

---

## Available Tokens

| Token | Example |
|-------|---------|
| `color.*` | `color.primary500`, `color.textPrimary` |
| `spacing.*` | `spacing.xs`, `spacing.md`, `spacing.xl` |
| `typography.*` | `typography.size.lg`, `typography.weight.bold` |
| `shape.*` | `shape.sm`, `shape.md`, `shape.full` |
| `elevation.*` | `elevation.sm`, `elevation.md` |
| `breakpoint.*` | `breakpoint.sm`, `breakpoint.lg` |

---

**Total**: 4 patterns
