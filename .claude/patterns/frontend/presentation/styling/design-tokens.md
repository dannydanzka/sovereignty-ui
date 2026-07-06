# Design Tokens

> **Module**: frontend/presentation/styling
> **ESLint**: `custom/design-tokens-policy`
> **Philosophy**: Material Design 3 + Apple HIG + 8-Point Grid

---

## TL;DR

**DO**:
- Import tokens from @constants: `spacing`, `color`, `typography`, `elevation`, `shape`
- Semantic names: `spacing.md` (24px), `color.textPrimary`
- 8-Point Grid: 8px, 16px, 24px, 32px... (multiples of 8)
- SSR-safe: Flat objects (NO theme context)

**DON'T**:
- Hardcoded values: `24px`, `#FFC107`
- Non-grid values: `15px`, `22px`, `28px`
- Theme context (crashes SSR)
- Magic numbers for z-index

---

## Why 8-Point Grid

- **Visual consistency** across entire application
- **Predictable spacing** relationships
- **Industry standard**: Apple, Google, IBM use it
- **Easier design handoff**: 8px base unit

**Allowed**: 4px (micro), 8px (xs), 16px (sm), 24px (md), 32px (lg)...

---

## Token Categories

### Spacing (8-Point Grid)

```typescript
import { spacing } from '@constants';

padding: ${spacing.md};      // 24px - default
gap: ${spacing.sm};          // 16px - small
margin: ${spacing.lg};       // 32px - large
padding: ${spacing.micro};   // 4px - fine adjustments
```

| Token | Pixels | Use Case |
|-------|--------|----------|
| micro | 4px | Borders, hairlines |
| xs | 8px | Tight spacing |
| sm | 16px | Small gaps |
| md | 24px | Default |
| lg | 32px | Section spacing |
| xl | 40px | Large gaps |

---

### Colors

```typescript
import { color } from '@constants';

// Text
color: ${color.textPrimary};   // Main text
color: ${color.textSecondary}; // Secondary

// Background
background: ${color.background};    // White
background: ${color.backgroundAlt}; // Tinted

// Brand
background: ${color.primary500};
&:hover { background: ${color.primary600}; }

// Status
color: ${color.error};
background: ${color.successBackground};
```

---

### Typography

```typescript
import { typography } from '@constants';

font-family: ${typography.family.display};  // Headings
font-family: ${typography.family.body};     // Text
font-size: ${typography.size.base};         // 16px
font-size: ${typography.size['2xl']};       // 24px
font-weight: ${typography.weight.bold};     // 700
line-height: ${typography.leading.relaxed}; // 1.75
```

---

### Elevation (Shadows)

```typescript
import { elevation } from '@constants';

box-shadow: ${elevation.sm};   // Cards
box-shadow: ${elevation.md};   // Dropdowns
box-shadow: ${elevation.lg};   // Modals
box-shadow: ${elevation.xl};   // Tooltips
```

---

### Shape (Border Radius)

```typescript
import { shape } from '@constants';

border-radius: ${shape.md};    // 8px - buttons
border-radius: ${shape.lg};    // 12px - cards
border-radius: ${shape.full};  // Circle
border-radius: ${shape['2xl']}; // Pills
```

---

### Layout

```typescript
import { layout } from '@constants';

// Breakpoints
@media (min-width: ${layout.breakpoint.md}) { ... }

// Z-Index (layering)
z-index: ${layout.zIndex.dropdown}; // 100
z-index: ${layout.zIndex.modal};    // 500
z-index: ${layout.zIndex.toast};    // 700

// Container
max-width: ${layout.container.lg}; // 1200px
```

---

### Motion (Transitions)

```typescript
import { motion } from '@constants';

transition: background ${motion.fast};   // 150ms
transition: transform ${motion.normal};  // 250ms
transition: opacity ${motion.slow};      // 400ms
```

---

## Complete Component Example

```typescript
import { color, spacing, typography, shape, motion, elevation } from '@constants';

export const Button = styled.button`
  font-family: ${typography.family.display};
  font-size: ${typography.size.base};
  font-weight: ${typography.weight.bold};
  padding: ${spacing.xs} ${spacing.md};
  border-radius: ${shape.md};
  background: ${color.primary500};
  color: ${color.textPrimary};
  transition: all ${motion.fast};

  &:hover {
    background: ${color.primary600};
    box-shadow: ${elevation.sm};
  }

  &:disabled {
    background: ${color.neutral200};
    color: ${color.textDisabled};
  }
`;
```

---

## Why SSR-Safe (Flat Objects)

Theme context crashes server-side rendering:
- Server components can't use React Context
- Flat objects work everywhere (server + client)
- Full TypeScript support with autocomplete
- No provider wrapping needed

---

## Related

- `frontend/presentation/styling/spacing.md` - Detailed spacing guide
- `frontend/presentation/styling/responsive.md` - Responsive patterns

