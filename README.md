# @dannydanzka/sovereignty-ui

Agnostic React component library — Code Sovereignty UI System.

---

## Quick Start

### Install

```bash
npm install @dannydanzka/sovereignty-ui
```

### Use Components

```tsx
import { Button, Modal, DataTable } from '@dannydanzka/sovereignty-ui';
import { useModal, useDebounce } from '@dannydanzka/sovereignty-ui/hooks';
import { formatCurrency, truncate } from '@dannydanzka/sovereignty-ui/utils';
```

### Runtime Theming (CSS Custom Properties)

All components use CSS custom properties with static fallbacks. Override tokens at runtime — no ThemeProvider needed:

```tsx
// Option A: Programmatic
import { injectSuiTokens } from '@dannydanzka/sovereignty-ui/tokens';

injectSuiTokens({
  color: {
    primary: '#FFC107',
    secondary: '#2196F3',
    textPrimary: '#1A237E',
  },
  typography: {
    family: { body: "'Inter', sans-serif" },
  },
});

// Option B: CSS
// :root {
//   --sui-primary: #FFC107;
//   --sui-secondary: #2196F3;
//   --sui-font-family-body: 'Inter', sans-serif;
// }
```

### Legacy: createTokens() (pre-v0.4.0)

```tsx
import { createTokens } from '@dannydanzka/sovereignty-ui/tokens';

const tokens = createTokens({
  color: { primary: '#FFC107' },
});
```

---

## What's Included

### Components (48)

| Category | Components |
|----------|-----------|
| **Primitives** | Spinner, Skeleton, Divider, Spacer, GlobalLoading, LazyFallback, ScreenBoundary |
| **Form** | Input, Select, Textarea, Checkbox, Toggle, PasswordInput, RadioGroup, Switch, Dropdown, SearchInput |
| **Form Layout** | FormGroup, FormActions, FormError |
| **Feedback** | Alert, Badge, ErrorFallback, NotificationToast, Tooltip, EmptyState, ErrorState, LoadingState, InfoMessage |
| **Layout** | Card, Container, Tabs, StepCard, Modal, ModalFooter, PageLayout, DetailLayout |
| **Data** | StatsCard, StatItem, ProgressBar, Image, Avatar, EntityCell, SortableHeader |
| **Actions** | Button, PopButton, ToggleActiveButton, TapHint |

### Patterns (4)

| Pattern | Description |
|---------|-------------|
| **DataTable** | Sort + search + loading skeleton + pagination |
| **Pagination** | Page numbers with ellipsis, prev/next, first/last |
| **FormField** | Label + any input + error + help text wrapper |
| **FileUploader** | Drag-and-drop zone with file list and validation |

### Hooks (7)

| Hook | Description |
|------|-------------|
| `useModal` | Open/close/toggle state |
| `usePagination` | Page navigation with hasNext/hasPrev |
| `useTableSort` | Sort column + direction toggle |
| `useLoading` | Loading + error + `withLoading()` wrapper |
| `useMediaQuery` | Responsive breakpoint detection (SSR-safe) |
| `useClickOutside` | Click outside ref detection |
| `useDebounce` | Debounce value changes |

### Utils (5 modules, ~30 functions)

| Module | Functions |
|--------|-----------|
| `array` | unique, uniqueBy, groupBy, sortBy, chunk |
| `string` | truncate, capitalize, capitalizeWords, slugify, pluralize, initials |
| `date` | formatDate, formatDateTime, formatRelative, diffInDays, isExpired |
| `format` | formatCurrency, formatNumber, formatCompact, formatPercentage, formatBytes, formatPhone |
| `object` | pick, omit, isEmpty, deepMerge |

### Token Helpers (10)

CSS variable helper functions used internally and available for consumers:

| Helper | Token | Output |
|--------|-------|--------|
| `c()` | color | `var(--sui-primary, #5B4FCF)` |
| `s()` | spacing | `var(--sui-spacing-md, 1.5rem)` |
| `sh()` | shape | `var(--sui-shape-md, 0.5rem)` |
| `ts()` | font-size | `var(--sui-font-size-md, 1rem)` |
| `tw()` | font-weight | `var(--sui-font-weight-bold, 700)` |
| `tf()` | font-family | `var(--sui-font-family-body, ...)` |
| `tl()` | line-height | `var(--sui-leading-normal, 1.5)` |
| `tt()` | letter-spacing | `var(--sui-tracking-normal, 0)` |
| `el()` | elevation | `var(--sui-elevation-md, ...)` |
| `mo()` | motion | `var(--sui-motion-fast, ...)` |

---

## Entry Points

```
@dannydanzka/sovereignty-ui          # All components + patterns
@dannydanzka/sovereignty-ui/tokens   # Tokens + CSS var helpers + injectSuiTokens()
@dannydanzka/sovereignty-ui/hooks    # React hooks
@dannydanzka/sovereignty-ui/utils    # Pure utility functions
```

---

## Token System

Tokens are split into **agnostic** (ship with library) and **overrideable** (per-project):

| Token | Default | Override? |
|-------|---------|-----------|
| `spacing` | 8-point grid | Rarely |
| `shape` | Border-radius scale | Rarely |
| `motion` | 150/250/400ms | Rarely |
| `elevation` | Material-like shadows | Rarely |
| `layout` | Breakpoints, z-index, containers | Rarely |
| `color.neutral*` | Gray scale | Yes |
| `color.primary*` | Yellow palette | **Always** |
| `color.secondary*` | Blue palette | **Always** |
| `color.accent*` | Pink palette | **Always** |
| `typography.family` | System fonts | **Always** |

Override via `injectSuiTokens()` (runtime) or CSS custom properties (`:root { --sui-primary: ... }`).

---

## Peer Dependencies

```json
{
  "react": ">=18",
  "react-dom": ">=18",
  "styled-components": ">=6"
}
```

---

## Development

```bash
npm run dev              # Storybook (port 6006)
npm run build            # Build library (ESM + CJS + types)
npm run lint             # ESLint (0 warnings required, 16 custom rules)
npm run type-check       # TypeScript strict
npm run test             # Vitest (184 tests)
npm run build:storybook  # Build static Storybook
```

### Creating a Release

```bash
npx changeset            # Describe changes
npx changeset version    # Bump version + changelog
git push                 # CI publishes to GitHub Packages
```

---

## Architecture

```
src/
  tokens/        # Design tokens + CSS var helpers + runtime injection
  components/    # 48 components (atoms + molecules)
  patterns/      # 4 patterns (organisms)
  hooks/         # 7 React hooks
  utils/         # 5 utility modules (~30 functions)
  index.ts       # Main entry point
```

Each component follows a 5-file structure:
- `Component.tsx` — Logic
- `Component.styled.ts` — Styled-components (CSS var helpers, no hardcoded values)
- `Component.interfaces.ts` — TypeScript interfaces
- `Component.test.tsx` — Vitest + RTL tests
- `Component.stories.tsx` — Storybook stories
- `index.ts` — Barrel export

---

## License

MIT
