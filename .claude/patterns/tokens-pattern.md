# Tokens Pattern

> **PURPOSE**: How to use and extend the design token system in sovereignty-ui
> **SOURCE OF TRUTH**: `src/tokens/tokens.ts` (raw values), `src/tokens/css-variables.ts` (helpers)
> **THEMING**: CSS custom properties via `injectSuiTokens()` — no ThemeProvider

---

## Token Categories

| Token | Helper | Example |
|-------|--------|---------|
| `color` | `c()` | `${c('primary')}`, `${c('textSecondary')}` |
| `spacing` | `s()` | `${s('md')}`, `${s('xl')}` |
| `shape` | `sh()` | `${sh('md')}`, `${sh('lg')}` |
| `typography.size` | `ts()` | `${ts('lg')}`, `${ts('sm')}` |
| `typography.weight` | `tw()` | `${tw('bold')}`, `${tw('semibold')}` |
| `typography.family` | `tf()` | `${tf('body')}`, `${tf('display')}` |
| `typography.leading` | `tl()` | `${tl('normal')}`, `${tl('relaxed')}` |
| `typography.tracking` | `tt()` | `${tt('normal')}`, `${tt('wide')}` |
| `elevation` | `el()` | `${el('sm')}`, `${el('md')}` |
| `motion` | `mo()` | `${mo('fast')}`, `${mo('normal')}` |
| `layout` | _(direct)_ | `${layout.maxWidth.container}` (structural, non-themeable) |

Each helper produces: `var(--sui-token-name, static-fallback)`

---

## Usage in Styled Components

```typescript
import { c, el, mo, s, sh, tf, ts, tw } from '../../tokens';

const Card = styled.div`
  background: ${c('surfaceDefault')};
  border-radius: ${sh('lg')};
  box-shadow: ${el('sm')};
  padding: ${s('lg')};
  transition: box-shadow ${mo('fast')};

  &:hover {
    box-shadow: ${el('md')};
  }
`;

const Title = styled.h2`
  color: ${c('textPrimary')};
  font-family: ${tf('body')};
  font-size: ${ts('xl')};
  font-weight: ${tw('semibold')};
  margin-bottom: ${s('sm')};
`;
```

---

## Runtime Theming (Consumer Side)

Consumers override tokens at runtime via CSS custom properties:

```typescript
// Option A: injectSuiTokens() — programmatic
import { injectSuiTokens } from '@dannydanzka/sovereignty-ui/tokens';

injectSuiTokens({
  color: { primary: '#FFC107', textPrimary: '#1A237E' },
  typography: { size: { lg: '1.25rem' } },
});

// Option B: CSS — declarative
:root {
  --sui-primary: #FFC107;
  --sui-text-primary: #1A237E;
  --sui-font-size-lg: 1.25rem;
}
```

---

## Adding New Token Values

When adding tokens, ALWAYS:
1. Add the value to `src/tokens/tokens.ts`
2. Add the TypeScript type to `src/tokens/tokens.types.ts`
3. Export from `src/tokens/index.ts`
4. Use the appropriate CSS var helper in styled files — never direct values

```typescript
// src/tokens/tokens.ts
export const color = {
  // ... existing
  newCategory: '#HEXVAL',
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
`;

// ❌ WRONG - direct token access (no theming support)
const Button = styled.button`
  background: ${color.primary};
  border-radius: ${shape.borderRadius.md};
`;

// ✅ CORRECT - CSS var helpers (runtime-themeable)
const Button = styled.button`
  background: ${c('primary')};
  border-radius: ${sh('md')};
  font-size: ${ts('md')};
  padding: ${s('sm')} ${s('lg')};
`;
```

---

## Token Files

| File | Purpose |
|------|---------|
| `tokens.ts` | Raw token values (source of truth) |
| `tokens.types.ts` | TypeScript types for all token keys |
| `css-variables.ts` | CSS var helper functions (`c`, `s`, `sh`, `ts`, `tw`, `tf`, `tl`, `tt`, `el`, `mo`) |
| `inject.ts` | `injectSuiTokens()` — consumer API for runtime overrides |
| `presets.ts` | Token presets (shorthand helpers) |
| `create-tokens.ts` | `createTokens()` — legacy factory (pre-CSS vars) |

---

**Version**: 2.0 | **Created**: 2026-03-06 | **Updated**: 2026-03-30
