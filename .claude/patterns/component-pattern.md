# Component Pattern

> **PURPOSE**: Standard pattern for creating agnostic UI components in sovereignty-ui
> **RULE**: Zero framework dependencies — React + styled-components only
> **THEMING**: All styled files use CSS variable helpers for runtime theming

---

## File Structure

```
src/components/ComponentName/
├── ComponentName.tsx           # Component logic and JSX
├── ComponentName.styled.ts     # All visual styling (CSS var helpers)
├── ComponentName.interfaces.ts # TypeScript interfaces and types
├── ComponentName.test.tsx      # Vitest + RTL unit tests
├── ComponentName.stories.tsx   # Storybook documentation
└── index.ts                    # Barrel exports
```

---

## ComponentName.interfaces.ts

```typescript
export interface ComponentNameProps {
  /** Primary visual style */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Component size */
  size?: 'sm' | 'md' | 'lg';
  /** Makes component fill parent width */
  fullWidth?: boolean;
  /** Content to render inside */
  children: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
}

// Transient props for styled-components (all prefixed with $)
export interface ComponentNameStyledProps {
  $variant: NonNullable<ComponentNameProps['variant']>;
  $size: NonNullable<ComponentNameProps['size']>;
  $fullWidth?: boolean;
}
```

---

## ComponentName.styled.ts

```typescript
import styled from 'styled-components';

import { c, mo, s, sh, ts } from '../../tokens';

import type { ComponentNameStyledProps } from './ComponentName.interfaces';

const variantStyles = {
  ghost: `
    background: transparent;
    border: 1px solid ${c('borderDefault')};
    color: ${c('textPrimary')};
  `,
  primary: `
    background: ${c('primary')};
    border: none;
    color: ${c('white')};
  `,
  secondary: `
    background: ${c('secondary')};
    border: none;
    color: ${c('white')};
  `,
};

const sizeStyles = {
  lg: `
    font-size: ${ts('lg')};
    padding: ${s('md')} ${s('xl')};
  `,
  md: `
    font-size: ${ts('md')};
    padding: ${s('sm')} ${s('lg')};
  `,
  sm: `
    font-size: ${ts('sm')};
    padding: ${s('xs')} ${s('md')};
  `,
};

export const ComponentNameWrapper = styled.div<ComponentNameStyledProps>`
  border-radius: ${sh('md')};
  cursor: pointer;
  display: inline-flex;
  transition: all ${mo('fast')};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}
`;
```

> **CSS Variable Helpers**: `c()` = color, `s()` = spacing, `sh()` = shape, `ts()` = font-size, `tw()` = font-weight, `tf()` = font-family, `tl()` = line-height, `tt()` = letter-spacing, `el()` = elevation, `mo()` = motion. Each produces `var(--sui-token, fallback)`.

---

## ComponentName.tsx

```typescript
import { ComponentNameWrapper } from './ComponentName.styled';
import type { ComponentNameProps } from './ComponentName.interfaces';

export const ComponentName = ({
  children,
  fullWidth = false,
  onClick,
  size = 'md',
  variant = 'primary',
}: ComponentNameProps) => (
  <ComponentNameWrapper
    $fullWidth={fullWidth}
    $size={size}
    $variant={variant}
    onClick={onClick}
  >
    {children}
  </ComponentNameWrapper>
);
```

---

## index.ts

```typescript
export * from './ComponentName';
export type * from './ComponentName.interfaces';
```

---

## ComponentName.stories.tsx

```typescript
import type { Meta, StoryObj } from '@storybook/react';

import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Primary: Story = {
  args: { children: 'Primary', variant: 'primary' },
};

export const Secondary: Story = {
  args: { children: 'Secondary', variant: 'secondary' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '16px' }}>
      <ComponentName variant='primary'>Primary</ComponentName>
      <ComponentName variant='secondary'>Secondary</ComponentName>
      <ComponentName variant='ghost'>Ghost</ComponentName>
    </div>
  ),
};
```

---

## ComponentName.test.tsx

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders children', () => {
    render(<ComponentName>Content</ComponentName>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<ComponentName onClick={onClick}>Click me</ComponentName>);
    await userEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

---

## Critical Rules

1. **NEVER import from Next.js, Redux, or i18n libraries**
2. **ALL CSS values MUST use CSS var helpers** — `c()`, `s()`, `sh()`, etc. — never direct token values or hardcoded `16px`, `#fff`
3. **CSS properties in alphabetical order**
4. **Transient props ($prop) for all dynamic styled values**
5. **Named exports only** — no default exports except in stories/config files
6. **Interface in .interfaces.ts** — never inline in .tsx files

---

**Version**: 2.0 | **Created**: 2026-03-06 | **Updated**: 2026-03-30
