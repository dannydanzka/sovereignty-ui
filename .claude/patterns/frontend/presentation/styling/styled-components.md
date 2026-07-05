# Styled Components Pattern

> **ESLint Enforcement**: `custom/no-native-html`, `custom/design-tokens-policy` ⚡

Use this pattern for all component styling with styled-components.

## Shared Styles (CSS Mixins)

Create reusable CSS mixins in `common/styles/[domain].styles.js`:

```javascript
import { css } from 'styled-components';
import { colors } from '@your-org/ui/lib/theme';

// ============================================================
// LAYOUT MIXINS
// ============================================================

export const flexCenter = css`
  align-items: center;
  display: flex;
  justify-content: center;
`;

export const flexCenterColumn = css`
  ${flexCenter}
  flex-direction: column;
`;

export const flexRow = css`
  display: flex;
  flex-direction: row;
`;

export const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

export const flexOne = css`
  display: flex;
  flex: 1;
`;

// ============================================================
// SPACING MIXINS
// ============================================================

export const paddingLarge = css`
  padding: 4rem 2rem;
`;

export const paddingMedium = css`
  padding: 1.5rem;
`;

export const paddingSmall = css`
  padding: 0.75rem 0.25rem;
`;

export const marginVertical = css`
  margin-bottom: 2.75rem;
  margin-top: 2.75rem;
`;

export const marginSmall = css`
  margin: 0.5rem;
`;

// ============================================================
// BORDER & SHADOW MIXINS
// ============================================================

export const cardShadow = css`
  box-shadow: 0 4px 18px rgb(0 0 0 / 0.25);
`;

export const borderRadiusSmall = css`
  border-radius: 0.5rem;
`;

export const borderRadiusMedium = css`
  border-radius: 0.75rem;
`;

export const dashedBorder = css`
  border: 0.125rem dashed ${colors.innerBorder};
`;

// ============================================================
// TYPOGRAPHY MIXINS
// ============================================================

export const montserratBold = css`
  font-family: Montserrat, sans-serif;
  font-weight: 700;
`;

export const montserratSemiBold = css`
  font-family: Montserrat, sans-serif;
  font-weight: 600;
`;

export const latoBold = css`
  font-family: Lato, sans-serif;
  font-weight: 700;
`;

export const latoRegular = css`
  font-family: Lato, sans-serif;
`;

export const letterSpacingBase = css`
  letter-spacing: 0.063rem;
`;

export const letterSpacingWide = css`
  letter-spacing: 0.125rem;
`;

export const textCentered = css`
  text-align: center;
`;

// ============================================================
// IMAGE MIXINS
// ============================================================

export const imageContain = css`
  height: auto;
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
`;

export const imageResponsive = css`
  height: auto;
  max-width: 100%;
`;

// ============================================================
// COLOR MIXINS
// ============================================================

export const backgroundWhite = css`
  background-color: ${colors.white};
`;

export const backgroundGrey = css`
  background-color: ${colors.backgroundGrey_2};
`;

export const textDarkGrey = css`
  color: ${colors.darkGrey_2};
`;

export const textLabel = css`
  color: ${colors.label};
`;

export const textBase = css`
  color: ${colors.base};
`;

// ============================================================
// COMPOSITE MIXINS
// ============================================================

export const cardContainer = css`
  ${backgroundWhite}
  ${borderRadiusMedium}
  ${cardShadow}
  ${flexColumn}
`;

export const emptyStateContainer = css`
  ${flexCenterColumn}
  ${paddingLarge}
  ${textCentered}
  min-height: 25rem;
`;

export const sectionTitle = css`
  ${montserratBold}
  ${letterSpacingBase}
  font-size: 2rem;
`;

export const sectionLabel = css`
  ${latoBold}
  ${textBase}
  ${letterSpacingBase}
  font-size: 1.25rem;
`;
```

## Component Styled File Template

```javascript
// ComponentName.styled.js
import styled from 'styled-components';
import { colors } from '@your-org/ui/lib/theme';

// Import shared mixins
import {
  cardContainer,
  flexCenter,
  marginVertical,
  paddingMedium,
} from '../../../common/styles/shared.styles';

// ============================================================
// CONTAINERS
// ============================================================

export const Container = styled.div`
  ${cardContainer}
  ${marginVertical}
`;

export const Wrapper = styled.div`
  display: flex;
`;

// ============================================================
// SECTIONS
// ============================================================

export const FlexSection = styled.div`
  display: flex;
  flex: 1;
`;

export const LeftSection = styled(FlexSection)`
  ${paddingMedium}
`;

export const RightSection = styled(FlexSection)`
  background-color: ${colors.backgroundGrey_8};
`;

// ============================================================
// CONTENT ELEMENTS
// ============================================================

export const Title = styled.h1`
  color: ${colors.base};
  font-family: Montserrat, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.063rem;
`;

export const Subtitle = styled.h2`
  color: ${colors.label};
  font-family: Lato, sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
`;

export const Text = styled.p`
  color: ${colors.darkGrey_2};
  font-family: Lato, sans-serif;
  font-size: 1rem;
  line-height: 1.5;
`;

// ============================================================
// INTERACTIVE ELEMENTS
// ============================================================

export const Button = styled.button`
  ${flexCenter}
  background-color: ${colors.primary};
  border: none;
  border-radius: 0.5rem;
  color: ${colors.white};
  cursor: pointer;
  font-family: Montserrat, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.primaryDark};
  }

  &:disabled {
    background-color: ${colors.disabled};
    cursor: not-allowed;
  }
`;
```

## Extending Styled Components

```javascript
// Base component
const BaseButton = styled.button`
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-family: Montserrat, sans-serif;
  padding: 0.75rem 1.5rem;
`;

// Extended components
export const PrimaryButton = styled(BaseButton)`
  background-color: ${colors.primary};
  color: ${colors.white};

  &:hover {
    background-color: ${colors.primaryDark};
  }
`;

export const SecondaryButton = styled(BaseButton)`
  background-color: ${colors.white};
  border: 1px solid ${colors.primary};
  color: ${colors.primary};

  &:hover {
    background-color: ${colors.backgroundGrey_8};
  }
`;
```

## Dynamic Styling with Props

```javascript
export const Container = styled.div`
  background-color: ${({ $isActive }) => ($isActive ? colors.primary : colors.white)};
  display: flex;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  padding: ${({ $size }) => {
    switch ($size) {
      case 'small': return '0.5rem';
      case 'large': return '2rem';
      default: return '1rem';
    }
  }};
`;

// Usage
<Container $isActive={true} $isVisible={true} $size="large" />
```

**Note:** Use `$` prefix for transient props that shouldn't be passed to DOM.

## Conditional Styling

```javascript
export const Card = styled.div`
  ${cardContainer}

  ${({ $variant }) => $variant === 'highlighted' && css`
    border: 2px solid ${colors.primary};
    box-shadow: 0 6px 24px rgb(0 0 0 / 0.3);
  `}

  ${({ $disabled }) => $disabled && css`
    opacity: 0.5;
    pointer-events: none;
  `}
`;
```

## Responsive Styling

```javascript
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    padding: 2rem;
  }

  @media (min-width: 1024px) {
    padding: 3rem;
  }
`;
```

## Theme Integration

Always use theme variables from `@your-org/ui/lib/theme`:

```javascript
import { colors, spacing, breakpoints } from '@your-org/ui/lib/theme';

export const Container = styled.div`
  background-color: ${colors.white};
  border: 1px solid ${colors.innerBorder};
  color: ${colors.base};
  padding: ${spacing.medium};

  @media (min-width: ${breakpoints.tablet}) {
    padding: ${spacing.large};
  }
`;
```

## Best Practices

### ✅ DO

1. **Group styled components by category** with comments
2. **Use shared mixins** for common patterns
3. **Use theme variables** for colors, spacing, breakpoints
4. **Alphabetize CSS properties** within each rule
5. **Use transient props** (`$prop`) for dynamic styling
6. **Export one styled component per line**
7. **Use composite mixins** for common component patterns
8. **Comment complex styling logic**
9. **Use semantic component names** (Container, Wrapper, Section, etc.)

### ❌ DON'T

1. **Don't use inline styles** in JSX
2. **Don't use magic numbers** - use theme or constants
3. **Don't duplicate CSS** - create mixins
4. **Don't use CSS modules** - use styled-components only
5. **Don't nest too deeply** - keep selectors flat
6. **Don't use `!important`** - fix specificity instead
7. **Don't pass non-transient props** to DOM elements

## Organization Pattern

```javascript
// ComponentName.styled.js

// Imports
import styled from 'styled-components';
import { colors } from '@your-org/ui/lib/theme';
import { mixins } from '../../../common/styles/shared.styles';

// ============================================================
// CONTAINERS
// ============================================================
export const Container = styled.div``;
export const Wrapper = styled.div``;

// ============================================================
// SECTIONS
// ============================================================
export const Header = styled.header``;
export const Content = styled.section``;
export const Footer = styled.footer``;

// ============================================================
// LAYOUT ELEMENTS
// ============================================================
export const Row = styled.div``;
export const Column = styled.div``;

// ============================================================
// CONTENT ELEMENTS
// ============================================================
export const Title = styled.h1``;
export const Subtitle = styled.h2``;
export const Text = styled.p``;

// ============================================================
// INTERACTIVE ELEMENTS
// ============================================================
export const Button = styled.button``;
export const Link = styled.a``;
export const Input = styled.input``;

// ============================================================
// MEDIA ELEMENTS
// ============================================================
export const Image = styled.img``;
export const Icon = styled.svg``;
```

## Common Patterns

### Card Pattern

```javascript
export const Card = styled.div`
  ${cardContainer}
  ${paddingMedium}
  ${marginVertical}
`;
```

### Flex Layout Pattern

```javascript
export const FlexRow = styled.div`
  ${flexRow}
  gap: 1rem;
`;

export const FlexColumn = styled.div`
  ${flexColumn}
  gap: 0.5rem;
`;
```

### Empty State Pattern

```javascript
export const EmptyState = styled.div`
  ${emptyStateContainer}
`;
```

### Grid Pattern

```javascript
export const Grid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
`;
```

## CSS Properties Order

Follow this order for consistency:

1. **Display & Box Model**: `display`, `position`, `top`, `right`, `bottom`, `left`
2. **Flexbox/Grid**: `flex`, `flex-direction`, `justify-content`, `align-items`, `grid-template`
3. **Dimensions**: `width`, `height`, `padding`, `margin`
4. **Typography**: `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`, `text-align`, `color`
5. **Visual**: `background`, `border`, `border-radius`, `box-shadow`, `opacity`
6. **Misc**: `cursor`, `transition`, `transform`, `overflow`
7. **Pseudo-classes/elements**: `&:hover`, `&:focus`, `&::before`
8. **Media queries**: `@media`

---

## See also

**Standards**:
- `docs/development-standards/COMPONENT-STRUCTURE-STANDARDS.md` - Styled file organization
- `docs/development-standards/RESPONSIVE-DESIGN-STANDARDS.md` - Breakpoints, mobile-first
- `docs/development-standards/CONFIGURATION-STANDARDS.md` - Flat maps (SSR-safe)

**Patterns**:
- `component-structure.md` - Component organization
- `.claude/patterns/business/` - Project-specific UI patterns

---

**Lines**: 534 | **Status**: ✅ Verified (styled-components patterns)
