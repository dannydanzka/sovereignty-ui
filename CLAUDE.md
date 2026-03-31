# CLAUDE.md - sovereignty-ui (Web) Development Guide

> **TYPE**: Agnostic React component library — **WEB PLATFORM**
> **STACK**: React 19 + TypeScript 5.9 + styled-components 6 + Storybook 8 + tsup
> **PURPOSE**: Reusable, framework-agnostic UI components consumed by DearAdry and all future web projects
> **PLATFORM SCOPE**: Web only. Mobile = separate repo (`sovereignty-ui-native`, React Native — not created yet)
> **GLOBAL ALIGNMENT**: See `.claude/GLOBAL-ALIGNMENT.md`

---

## CRITICAL RULE - READ FIRST (MANDATORY)

**BEFORE writing any code:**
1. **No framework dependencies** — ZERO Next.js, Redux, i18n, router imports. Library must be fully agnostic.
2. **CSS var helpers always** — ALWAYS use helpers: `${s('md')}`, `${c('white')}`, `${ts('lg')}` — NEVER direct values like `16px`, `white`, `1rem`, and NEVER direct token access like `${color.white}`
3. **CSS alphabetical** — CSS properties ALWAYS in alphabetical order
4. **No HTML elements** — NEVER use `<div>`, `<span>`, `<button>` directly — create a styled-component
5. **No inline styles** — NEVER use `style={{}}` in JSX — use transient props (`$prop`) in styled definitions
6. **Export pattern** — index.ts files use ONLY `export *` and `export type *` (no named re-exports)

**AFTER writing/modifying files:**
1. `npm run lint` — ESLint (0 warnings required)
2. `npm run type-check` — TypeScript (0 errors required)
3. `npm run build` — tsup build must succeed
4. `npm run test` — All tests passing (optional if not modifying logic)

**MANDATORY WORKFLOW:**
```
Read pattern → Write correct code → Lint file → Fix → Next file
```

**NEVER:**
- Import from Next.js (`next/image`, `next/router`, `next/navigation`)
- Import from Redux / Redux Toolkit
- Import from react-i18next or any i18n library
- Use `ThemeProvider` — flat maps only (SSR-safe, no context)
- Add `'use client'` directive (no Next.js)
- Use `any` types in production code

---

## Project Structure

```
sovereignty-ui/
├── src/
│   ├── components/           # One folder per component
│   │   └── Button/
│   │       ├── Button.tsx           # Component implementation
│   │       ├── Button.styled.ts     # Styled-components definitions
│   │       ├── Button.interfaces.ts # TypeScript interfaces
│   │       ├── Button.test.tsx      # Vitest + RTL tests
│   │       ├── Button.stories.tsx   # Storybook stories
│   │       └── index.ts             # Barrel: export * + export type *
│   ├── tokens/               # Design system tokens (source of truth)
│   │   ├── tokens.ts         # All design tokens (flat maps)
│   │   ├── tokens.types.ts   # Token TypeScript types
│   │   ├── css-variables.ts  # CSS var helpers: c(), s(), sh(), ts(), tw(), etc.
│   │   ├── inject.ts         # injectSuiTokens() — consumer runtime theming
│   │   ├── presets.ts        # Token presets (shorthand helpers)
│   │   ├── create-tokens.ts  # createTokens() — legacy factory
│   │   └── index.ts          # Barrel
│   └── index.ts              # Library entry: re-exports all components
├── .storybook/               # Storybook configuration
├── scripts/eslint-rules/     # 16 custom ESLint rules
├── .claude/                  # This governance directory
├── eslint.config.js          # ESLint configuration
├── tsup.config.ts            # Library build configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Library manifest
```

---

## Component Structure Standard (5-file pattern)

Every component MUST follow this structure:

```
ComponentName/
├── ComponentName.tsx           # Logic + JSX
├── ComponentName.styled.ts     # ALL visual styling
├── ComponentName.interfaces.ts # Props interface + types
├── ComponentName.test.tsx      # Unit tests
├── ComponentName.stories.tsx   # Storybook documentation
└── index.ts                    # export * + export type *
```

**index.ts pattern:**
```typescript
export * from './ComponentName';
export type * from './ComponentName.interfaces';
```

**Component pattern:**
```typescript
import { ComponentWrapper } from './ComponentName.styled';
import type { ComponentNameProps } from './ComponentName.interfaces';

export const ComponentName = ({ prop1, prop2 }: ComponentNameProps) => {
  return <ComponentWrapper $variant={prop1}>{prop2}</ComponentWrapper>;
};
```

---

## Tokens Usage (MANDATORY)

Import CSS var helpers from `../../tokens` (relative). All styled files use these helpers for runtime theming support:

```typescript
// In styled files — import ONLY the helpers you need
import { c, s, sh, ts, tw, mo } from '../../tokens';

// Correct usage — CSS var helpers
const Wrapper = styled.div`
  background-color: ${c('primary')};
  border-radius: ${sh('md')};
  font-size: ${ts('md')};
  padding: ${s('md')};
`;

// WRONG - never do this
const Wrapper = styled.div`
  background-color: #5B4FCF;      // ❌ hardcoded
  background-color: ${color.primary}; // ❌ direct token (no theming)
  border-radius: 8px;              // ❌ hardcoded
  padding: 16px;                   // ❌ hardcoded
`;
```

**Helpers**: `c()` color, `s()` spacing, `sh()` shape, `ts()` font-size, `tw()` font-weight, `tf()` font-family, `tl()` line-height, `tt()` letter-spacing, `el()` elevation, `mo()` motion.

Each produces `var(--sui-token-name, static-fallback)` — consumers override via `:root` or `injectSuiTokens()`.

---

## Export Strategy

**Library entry points:**
- `sovereignty-ui` → `src/index.ts` → all components + patterns + hooks + utils
- `sovereignty-ui/tokens` → `src/tokens/index.ts` → tokens + CSS var helpers + `injectSuiTokens()`

**Adding a new component to the library:**
1. Create `src/components/NewComponent/` with 5-file structure
2. Add `export * from './components/NewComponent';` to `src/index.ts`

**Barrel files only use `export *`:**
```typescript
// ✅ Correct
export * from './Button';
export type * from './Button.interfaces';

// ❌ Wrong - named re-exports forbidden
export { Button } from './Button';
export type { ButtonProps } from './Button.interfaces';
```

---

## Transient Props Pattern (styled-components)

All dynamic CSS values use transient props (prefix `$`) to prevent DOM forwarding:

```typescript
// interfaces
interface ButtonStyledProps {
  $variant: 'primary' | 'secondary';
  $size: 'sm' | 'md' | 'lg';
  $fullWidth?: boolean;
}

// styled — use CSS var helpers, not direct tokens
const StyledButton = styled.button<ButtonStyledProps>`
  background: ${({ $variant }) => $variant === 'primary' ? c('primary') : c('secondary')};
  padding: ${({ $size }) => $size === 'lg' ? s('lg') : s('md')};
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};
`;

// component - pass from component props to styled transient props
export const Button = ({ variant, size, fullWidth, children }: ButtonProps) => (
  <StyledButton $fullWidth={fullWidth} $size={size} $variant={variant}>
    {children}
  </StyledButton>
);
```

---

## Storybook Guidelines

- Every component MUST have a `.stories.tsx` file
- Default export is required by Storybook (exception to no-default-exports rule)
- Stories show: all variants, all sizes, edge cases, interactive states
- Use `argTypes` to document all component props with controls
- `AllVariants` and `AllSizes` render stories are mandatory for multi-variant components

---

## ESLint Custom Rules (16 active)

| Rule | Purpose |
|------|---------|
| `design-tokens-policy` | No hardcoded colors/spacing |
| `no-native-html` | Styled-components only |
| `no-inline-styles` | No `style={{}}` in JSX |
| `code-size-limits` | Max 350 lines/file, 50 lines/function |
| `component-organization` | Types in .interfaces.ts only |
| `index-barrel-exports-only` | `export *` only in index.ts |
| `no-alias-exports` | No re-export aliases |
| `enforce-hook-composition` | Prevent complex hooks |
| `no-emojis-in-jsx` | No emojis in JSX |
| `essential-testing` | No verbose test patterns |
| `no-eslint-disable` | No disable comments |
| `no-magic-literal-comparison` | Named constants for comparisons |
| `no-underscore-prefix` | Zero tolerance underscores |
| `import-strategy` | Consistent imports |
| `import-order` | Sorted imports |
| `comments-policy` | No obvious comments |

---

## Commands

```bash
npm run dev              # Start Storybook on :6006
npm run build            # Build library (tsup → dist/)
npm run build:storybook  # Build static Storybook
npm run lint             # ESLint (0 warnings required)
npm run type-check       # TypeScript (0 errors required)
npm run test             # Vitest unit tests
```

---

## Adding a New Component (Checklist)

1. [ ] Read `.claude/patterns/component-pattern.md` first
2. [ ] Create folder `src/components/NewComponent/`
3. [ ] Create `NewComponent.interfaces.ts` with props interface
4. [ ] Create `NewComponent.styled.ts` with ALL styling (tokens only, no hardcoded values)
5. [ ] Create `NewComponent.tsx` using styled components and token values
6. [ ] Create `NewComponent.stories.tsx` with complete coverage
7. [ ] Create `NewComponent.test.tsx` with essential tests
8. [ ] Create `index.ts` with `export * / export type *`
9. [ ] Add to `src/index.ts`
10. [ ] Run `npm run lint && npm run type-check && npm run build`

---

## Patterns Reference

| Working On | Pattern |
|-----------|---------|
| New component | `.claude/patterns/component-pattern.md` |
| Design tokens / CSS vars | `.claude/patterns/tokens-pattern.md` |
| Storybook stories | `.claude/patterns/stories-pattern.md` |
| Component testing | `~/Documents/proyectos/soberania-del-codigo/frontend/testing/vitest.md` |
| Token system | `src/tokens/tokens.ts` (raw values) + `src/tokens/css-variables.ts` (helpers) |
| Global alignment | `.claude/GLOBAL-ALIGNMENT.md` |

---

**Version**: 2.0 | **Created**: 2026-03-06 | **Updated**: 2026-03-30
**Philosophy**: Code Sovereignty — agnostic, sovereign, composable UI primitives
