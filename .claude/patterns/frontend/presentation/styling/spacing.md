# Spacing System Patterns

> **Standard**: `.claude/patterns/core/SPACING-SYSTEM-STANDARDS.md`
> **Philosophy**: 8-Point Grid (Apple HIG + Material Design)

---

## Quick Reference

```typescript
import { spacingFlatMap } from '@constants';

// Semantic scale
spacingFlatMap.micro  // 4px  - borders, hairlines
spacingFlatMap.xs     // 8px  - tight spacing
spacingFlatMap.sm     // 16px - small gaps
spacingFlatMap.md     // 24px - default spacing
spacingFlatMap.lg     // 32px - section spacing
spacingFlatMap.xl     // 40px - large gaps
spacingFlatMap['2xl'] // 48px - major sections
spacingFlatMap['3xl'] // 56px - page sections
spacingFlatMap['4xl'] // 64px - large separations
spacingFlatMap['5xl'] // 72px - hero spacing
spacingFlatMap['6xl'] // 80px - major breaks
spacingFlatMap['7xl'] // 96px - maximum
```

---

## Pattern: Component Spacing

### Button Sizes

```typescript
const getSizeStyles = (size: ButtonSize) => {
  const sizes = {
    sm: css`
      height: ${spacingFlatMap.lg};        // 32px
      padding: ${spacingFlatMap.micro} ${spacingFlatMap.sm}; // 4px 16px
      font-size: ${typographyFlatMap.fontSize12};
    `,
    md: css`
      height: ${spacingFlatMap.xl};        // 40px
      padding: ${spacingFlatMap.xs} ${spacingFlatMap.md};    // 8px 24px
      font-size: ${typographyFlatMap.fontSize14};
    `,
    lg: css`
      height: ${spacingFlatMap['2xl']};    // 48px
      padding: ${spacingFlatMap.sm} ${spacingFlatMap.lg};    // 16px 32px
      font-size: ${typographyFlatMap.fontSize16};
    `,
  };
  return sizes[size];
};
```

### Card Layout

```typescript
export const Card = styled.div`
  padding: ${spacingFlatMap.md};           // 24px
  border-radius: ${borderRadiusFlatMap.lg};
`;

export const CardHeader = styled.div`
  margin-bottom: ${spacingFlatMap.sm};     // 16px
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacingFlatMap.xs};               // 8px
`;
```

### Form Layout

```typescript
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacingFlatMap.xs};               // 8px label-to-input
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacingFlatMap.sm};               // 16px between fields
  margin-bottom: ${spacingFlatMap.lg};     // 32px between sections
`;
```

---

## Pattern: Page Layout

```typescript
export const PageWrapper = styled.div`
  padding: ${spacingFlatMap.md};           // 24px mobile

  @media (min-width: 768px) {
    padding: ${spacingFlatMap.lg};         // 32px desktop
  }
`;

export const Section = styled.section`
  margin-bottom: ${spacingFlatMap.xl};     // 40px between sections
`;

export const SectionTitle = styled.h2`
  margin-bottom: ${spacingFlatMap.sm};     // 16px
`;
```

---

## Pattern: Grid & Flex Gaps

```typescript
// Card grid
export const CardGrid = styled.div`
  display: grid;
  gap: ${spacingFlatMap.sm};               // 16px
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
`;

// Inline elements
export const ButtonGroup = styled.div`
  display: flex;
  gap: ${spacingFlatMap.xs};               // 8px
`;

// Form actions
export const FormActions = styled.div`
  display: flex;
  gap: ${spacingFlatMap.sm};               // 16px
  margin-top: ${spacingFlatMap.md};        // 24px
`;
```

---

## Pattern: Icon Spacing

```typescript
// Icon in button
export const ButtonIcon = styled.span`
  margin-right: ${spacingFlatMap.xs};      // 8px
`;

// Icon button (square)
export const IconButton = styled.button`
  width: ${spacingFlatMap.lg};             // 32px
  height: ${spacingFlatMap.lg};            // 32px
  padding: ${spacingFlatMap.xs};           // 8px
`;
```

---

## Anti-Patterns

### DON'T: Hardcoded Values

```typescript
// BAD
padding: 24px;
gap: 18px;
margin: 28px;
```

### DON'T: Non-Grid Values

```typescript
// BAD - 18px is not in 8-point grid
margin-bottom: 18px;

// GOOD - use 16px (sm) or 24px (md)
margin-bottom: ${spacingFlatMap.sm};
```

### DON'T: Numeric Token Names (Legacy)

```typescript
// BAD - ties you to specific pixel values
padding: ${spacingFlatMap.spacing24};

// GOOD - semantic, flexible
padding: ${spacingFlatMap.md};
```

---

## Migration Checklist

When refactoring:
1. Replace hardcoded `Npx` with `spacingFlatMap.{token}`
2. Round non-grid values to nearest 8px multiple
3. Use semantic names (sm, md, lg) not numeric (spacing16, spacing24)
4. Verify visual consistency after changes

---

**Version**: 1.0 | **Created**: 2025-12-29
