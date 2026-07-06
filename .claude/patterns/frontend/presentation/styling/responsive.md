# Responsive Design

> **Module**: frontend/presentation/styling
> **Pattern**: Mobile-first with min-width breakpoints

---

## TL;DR

**DO**:
- Mobile-first: Start small, add complexity
- min-width breakpoints: `@media (min-width: ${layout.breakpoint.md})`
- Touch targets ≥44px (WCAG 2.1 AA)
- Scale spacing: mobile (16px) → tablet (24px) → desktop (32px)
- Flat maps ONLY (NO theme context)

**DON'T**:
- Desktop-first (max-width as primary)
- Theme context (SSR crash)
- Touch targets <44px
- Hardcoded breakpoints

---

## Why Mobile-First

- **Progressive enhancement**: Base = mobile, add complexity for larger screens
- **Performance**: Mobile loads base styles only
- **Simplicity**: Fewer overrides, cleaner code
- **Traffic**: Most users are on mobile

---

## Breakpoints

| Breakpoint | Width | Columns | Devices |
|------------|-------|---------|---------|
| **base** | 320px+ | 1 | Mobile |
| **sm** | 640px+ | 2 | Mobile landscape |
| **md** | 768px+ | 3 | Tablets |
| **lg** | 1024px+ | 4 | Desktop |

```typescript
import { layout } from '@constants';

@media (min-width: ${layout.breakpoint.sm}) { /* 640px+ */ }
@media (min-width: ${layout.breakpoint.md}) { /* 768px+ */ }
@media (min-width: ${layout.breakpoint.lg}) { /* 1024px+ */ }
```

---

## Content Wrapper

```typescript
export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  margin: 0 auto;
  max-width: 1200px;
  padding: ${spacing.md};
  width: 100%;
`;
```

---

## Responsive Grid

```typescript
export const Grid = styled.div`
  display: grid;
  gap: ${spacing.sm} ${spacing.md};
  grid-template-columns: 1fr;  // Mobile: 1 column

  @media (min-width: ${layout.breakpoint.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${layout.breakpoint.md}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: ${layout.breakpoint.lg}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;
```

---

## Spacing Scale

```typescript
// Mobile → Tablet → Desktop
export const Section = styled.section`
  padding: ${spacing.sm};  // Mobile: 16px

  @media (min-width: ${layout.breakpoint.md}) {
    padding: ${spacing.md};  // Tablet: 24px
  }

  @media (min-width: ${layout.breakpoint.lg}) {
    padding: ${spacing.lg};  // Desktop: 32px
  }
`;
```

---

## Touch Targets

```typescript
// WCAG 2.1 AA: ≥44x44 pixels
export const TouchTarget = styled.button`
  min-height: 44px;
  min-width: 44px;
  touch-action: manipulation;  // Disable double-tap zoom
`;
```

**Why 44px**: Motor accessibility, reduced mis-taps, iOS/Android standard.

---

## Full-Width Span

```typescript
// Span all columns in grid
export const FullWidthField = styled.div`
  @media (min-width: ${layout.breakpoint.sm}) {
    grid-column: span 2;
  }

  @media (min-width: ${layout.breakpoint.md}) {
    grid-column: span 3;
  }

  @media (min-width: ${layout.breakpoint.lg}) {
    grid-column: span 4;
  }
`;
```

---

## max-width Exception

Use max-width **only** for layout toggles:

```typescript
// Desktop: Sidebar → Mobile: Drawer
export const Sidebar = styled.aside`
  position: fixed;
  width: 280px;

  @media (max-width: ${layout.breakpoint.md}) {
    transform: translateX(-100%);  // Hide on mobile
  }
`;
```

---

## Checklist

- [ ] Mobile gets 1 column
- [ ] Uses design tokens (not hardcoded px)
- [ ] Touch targets ≥44px
- [ ] max-width: 1200px for content
- [ ] Flat maps (no theme context)

---

## Related

- `frontend/presentation/styling/design-tokens.md` - Token reference
- `frontend/presentation/components.md` - Component structure

