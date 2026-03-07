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
import { createTokens } from '@dannydanzka/sovereignty-ui/tokens';
```

### Override Tokens (per-project branding)

```tsx
import { createTokens } from '@dannydanzka/sovereignty-ui/tokens';

const tokens = createTokens({
  color: {
    primary500: '#FFC107',
    secondary500: '#2196F3',
    accent500: '#FF4081',
  },
  typography: {
    family: {
      body: "'Inter', sans-serif",
      display: "'Lato', sans-serif",
    },
  },
});
```

---

## What's Included

### Components (28)

| Category | Components |
|----------|-----------|
| **Primitives** | Spinner, Skeleton, Divider, GlobalLoading, LazyFallback |
| **Form** | Input, Select, Textarea, Checkbox, Toggle |
| **Feedback** | Alert, Badge, ErrorFallback, NotificationToast, Tooltip |
| **Layout** | Card, Container, Tabs, StepCard, Modal |
| **Data** | StatsCard, ProgressBar, Image, Avatar |
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

---

## Entry Points

```
@dannydanzka/sovereignty-ui          # All components + patterns
@dannydanzka/sovereignty-ui/tokens   # Design tokens + createTokens()
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
npm run lint             # ESLint (0 warnings required)
npm run type-check       # TypeScript strict
npm run test             # Vitest
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
  tokens/        # Design tokens (agnostic defaults + override factory)
  components/    # Atoms + molecules (28 components)
  patterns/      # Organisms (4 complex compositions)
  hooks/         # React hooks (7 hooks)
  utils/         # Pure functions (5 modules)
  index.ts       # Main entry point
```

Each component follows a 5-file structure:
- `Component.tsx` — Logic
- `Component.styled.ts` — Styled-components (tokens only, no hardcoded values)
- `Component.interfaces.ts` — TypeScript interfaces
- `Component.stories.tsx` — Storybook stories
- `index.ts` — Barrel export

---

## License

MIT
