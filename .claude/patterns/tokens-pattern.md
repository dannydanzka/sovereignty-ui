# Tokens Pattern

> **PURPOSE**: How to use and extend the design token system in sovereignty-ui
> **SOURCE OF TRUTH**: `src/tokens/tokens.ts`

---

## Token Categories

| Token | Usage | Example |
|-------|-------|---------|
| `color` | All colors | `${color.primary}`, `${color.text.secondary}` |
| `spacing` | All spacing values | `${spacing.md}`, `${spacing.xl}` |
| `typography` | Font sizes, weights, families | `${typography.size.lg}`, `${typography.weight.bold}` |
| `shape` | Border radius, borders | `${shape.borderRadius.md}`, `${shape.border.default}` |
| `elevation` | Box shadows | `${elevation.sm}`, `${elevation.md}` |
| `motion` | Transitions, animations | `${motion.duration.fast}`, `${motion.easing.standard}` |
| `layout` | Max widths, z-index | `${layout.maxWidth.container}` |

---

## Usage in Styled Components

```typescript
import { color, elevation, motion, shape, spacing, typography } from '../../tokens';

// For components in src/components/*/
// All imports are relative to tokens directory

const Card = styled.div`
  background: ${color.surface.default};
  border: ${shape.border.default};
  border-radius: ${shape.borderRadius.lg};
  box-shadow: ${elevation.sm};
  padding: ${spacing.lg};
  transition: box-shadow ${motion.duration.fast} ${motion.easing.standard};

  &:hover {
    box-shadow: ${elevation.md};
  }
`;

const Title = styled.h2`
  color: ${color.text.primary};
  font-family: ${typography.family.primary};
  font-size: ${typography.size.xl};
  font-weight: ${typography.weight.semibold};
  margin-bottom: ${spacing.sm};
`;
```

---

## Consuming in DearAdry (installed library)

```typescript
// Import tokens from the package
import { color, spacing } from 'sovereignty-ui/tokens';

// Use in styled-components
const MyComponent = styled.div`
  background: ${color.primary};
  padding: ${spacing.md};
`;
```

---

## Adding New Token Values

When adding tokens, ALWAYS:
1. Add the value to `src/tokens/tokens.ts`
2. Add the TypeScript type to `src/tokens/tokens.types.ts` if needed
3. Export from `src/tokens/index.ts`
4. Document in `src/tokens/tokens.ts` with a comment

```typescript
// src/tokens/tokens.ts
export const color = {
  // ... existing
  newCategory: {
    default: '#HEXVAL',
    hover: '#HEXVAL',
  },
} as const;
```

---

## Anti-Patterns

```typescript
// ❌ WRONG - hardcoded values
const Button = styled.button`
  background: #5B4FCF;
  border-radius: 8px;
  font-size: 14px;
  padding: 12px 24px;
`;

// ✅ CORRECT - token values
const Button = styled.button`
  background: ${color.primary};
  border-radius: ${shape.borderRadius.md};
  font-size: ${typography.size.md};
  padding: ${spacing.sm} ${spacing.lg};
`;
```

---

**Version**: 1.0 | **Created**: 2026-03-06
