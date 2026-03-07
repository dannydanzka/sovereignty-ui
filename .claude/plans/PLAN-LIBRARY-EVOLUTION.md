# Plan: sovereignty-ui Library Evolution

> **Created**: 2026-03-07
> **Updated**: 2026-03-07
> **Goal**: Transform sovereignty-ui from a DearAdry component dump into a truly agnostic, publishable React component library
> **Phases**: 4 | **Deliverables**: ~50 items
> **Status**: PHASES 1-4 COMPLETE (code). Consumer integration pending first publish.

---

## Phase 1: Token Architecture (Foundation)

> **Priority**: URGENT — everything else depends on this
> **Principle**: Universal decisions = agnostic defaults. Visual identity = per-project overrides.

### 1.1 Separate agnostic vs project-specific tokens

**Current problem**: `color` has DearAdry-specific primaries, `brandColor` is 100% DearAdry, `typography.family` hardcodes Inter/Lato.

**Agnostic tokens** (ship with library):
- `spacing` — 8-point grid (universal)
- `shape` — border-radius scale (universal)
- `motion` — transition speeds (universal)
- `elevation` — shadow scale (universal)
- `layout` — breakpoints, z-index, container, icon sizes (universal)
- `color.neutral*` — gray scale (universal)
- `color.status` — error, warning, success, info + backgrounds (universal)
- `color.semantic` — background, border, surface, overlay, text* (universal)

**Per-project tokens** (each project overrides):
- `color.primary*` — brand primary palette
- `color.secondary*` — brand secondary palette
- `color.tertiary*` / `color.accent*` — brand accent palette
- `brandColor` — 100% project-specific (REMOVE from library)
- `typography.family` — font families (project chooses fonts)

| # | Deliverable | Status |
|---|-------------|--------|
| 1.1.1 | Create `tokens.types.ts` with full type contracts for overrideable tokens | DONE |
| 1.1.2 | Create `defaults.ts` — agnostic default values (neutrals, status, semantic, spacing, etc.) | SKIPPED (merged into tokens.ts — simpler, no extra file needed) |
| 1.1.3 | Create `create-tokens.ts` — token factory function for project overrides | DONE |
| 1.1.4 | Refactor `tokens.ts` — keep only agnostic defaults, move DearAdry colors out | DONE |
| 1.1.5 | Remove `brandColor` from library (move to DearAdry project) | DONE (0 references remain) |
| 1.1.6 | Make `typography.family` overrideable with system-ui defaults | DONE |
| 1.1.7 | Update all existing components to use new token structure | DONE (6 components: Button, StatsCard, ProgressBar, Image, PopButton, Tabs) |
| 1.1.8 | Update `presets.ts` to work with new token system | DONE (no changes needed — already uses typography import) |
| 1.1.9 | Verify build (`npm run build && npm run type-check && npm run lint`) | DONE (0 errors, 0 warnings, build success) |

---

## Phase 2: Component Migration (Expand Library)

> **Principle**: Only truly agnostic components. IO via callbacks, never direct service calls.

### 2.1 Primitives (atoms — 0 component dependencies)

| # | Component | Source in DearAdry | Notes | Status |
|---|-----------|-------------------|-------|--------|
| 2.1.1 | Spinner | `common/LoadingSpinner` | Pure CSS (no logo, no brand) | DONE |
| 2.1.2 | Skeleton | NEW | Shimmer placeholder (text/circular/rectangular) | DONE |
| 2.1.3 | Divider | NEW | Horizontal/vertical separator | DONE |
| 2.1.4 | GlobalLoading | `common/GlobalLoading` | Overlay with children slot (no Redux) | DONE |
| 2.1.5 | LazyFallback | `common/LazyFallback` | Suspense wrapper with children slot (no logo) | DONE |

### 2.2 Components (molecules — compose primitives)

| # | Component | Source in DearAdry | Notes | Status |
|---|-----------|-------------------|-------|--------|
| 2.2.1 | ErrorFallback | `common/ErrorFallback` | Agnostic (no i18n, configurable props) | DONE |
| 2.2.2 | Table | `common/Table` | Complex (7 sub-components), defer to Phase 5 | DEFERRED |
| 2.2.3 | MediaCard | `common/MediaCard` | Coupled (i18n, domain types), defer to Phase 5 | DEFERRED |
| 2.2.4 | Select | NEW | Dropdown with label/error, 3 sizes | DONE |
| 2.2.5 | Textarea | NEW | Multi-line with char count, error | DONE |
| 2.2.6 | Checkbox | NEW | Custom styled checkbox with label | DONE |
| 2.2.7 | Toggle | NEW | Toggle switch, 2 sizes | DONE |
| 2.2.8 | Tooltip | NEW | Hover tooltip, 4 positions | DONE |
| 2.2.9 | Avatar | NEW | Initials fallback + image, 4 sizes | DONE |
| 2.2.10 | Alert | NEW | 4 variants, dismissible, left border accent | DONE |

### 2.3 Patterns (organisms — compose molecules, complex UI)

| # | Component | Source in DearAdry | Notes | Status |
|---|-----------|-------------------|-------|--------|
| 2.3.1 | DataTable | `admin/DataTable` concept | Table + Pagination + Sort + Search | DONE |
| 2.3.2 | FileUploader | `common/FileUploader` | UI-only, IO via onChange callback | DONE |
| 2.3.3 | ConfirmModal | `common/ModalContainer` concept | SKIPPED (Modal already has variant='confirm') | SKIPPED |
| 2.3.4 | FormField | NEW | Label + Input/Select + Error + Help text | DONE |
| 2.3.5 | Pagination | `admin/AdminPagination` | Standalone pagination with ellipsis | DONE |

---

## Phase 3: Hooks + Utils (Agnostic Logic)

### 3.1 Hooks

| # | Hook | Source in DearAdry | Notes | Status |
|---|------|-------------------|-------|--------|
| 3.1.1 | useModal | `hooks/useModal` | Open/close/toggle state | DONE |
| 3.1.2 | usePagination | `hooks/usePagination` | Page state, handlers, hasNext/hasPrev | DONE |
| 3.1.3 | useTableSort | `hooks/useTableSort` | Sort column, direction, toggle/clear | DONE |
| 3.1.4 | useLoading | `hooks/useLoading` | Loading + error + withLoading wrapper | DONE |
| 3.1.5 | useMediaQuery | NEW | Responsive breakpoint hook (SSR-safe) | DONE |
| 3.1.6 | useClickOutside | NEW | Detect clicks outside ref | DONE |
| 3.1.7 | useDebounce | NEW | Debounce value changes | DONE |

### 3.2 Utils

| # | Util | Source in DearAdry | Notes | Status |
|---|------|-------------------|-------|--------|
| 3.2.1 | array utils | `shared/utils/array` | unique, uniqueBy, groupBy, sortBy, chunk | DONE |
| 3.2.2 | string utils | `shared/utils/string` | truncate, capitalize, slugify, pluralize, initials | DONE |
| 3.2.3 | date utils | `shared/utils/date` | formatDate, formatDateTime, formatRelative, diffInDays, isExpired | DONE |
| 3.2.4 | format utils | `shared/utils/format` | formatCurrency, formatNumber, formatCompact, formatPercentage, formatBytes, formatPhone | DONE |
| 3.2.5 | object utils | `shared/utils/object` | pick, omit, isEmpty, deepMerge | DONE |

---

## Phase 4: Publishing + CI/CD (Distribution)

### 4.1 Package Configuration

| # | Deliverable | Status |
|---|-------------|--------|
| 4.1.1 | Rename package to `@dannydanzka/sovereignty-ui` (scoped) | DONE |
| 4.1.2 | Add `.npmrc` for GitHub Packages registry | DONE |
| 4.1.3 | Configure `publishConfig` in package.json | DONE |
| 4.1.4 | Update `tsup.config.ts` entry points (tokens, hooks, utils, components) | DONE |
| 4.1.5 | Add `package.json` exports map for all entry points | DONE |

### 4.2 CI/CD Pipeline

| # | Deliverable | Status |
|---|-------------|--------|
| 4.2.1 | Create `.github/workflows/ci.yml` (lint + type-check + build on PR) | DONE |
| 4.2.2 | Create `.github/workflows/release.yml` (publish to GitHub Packages on main) | DONE |
| 4.2.3 | Configure Changesets for semantic versioning | DONE |
| 4.2.4 | Create `.github/workflows/storybook.yml` (deploy to GitHub Pages) | DONE |

### 4.3 Consumer Integration

| # | Deliverable | Status |
|---|-------------|--------|
| 4.3.1 | Create `.npmrc` in DearAdry for GitHub Packages | DONE |
| 4.3.2 | Install `@dannydanzka/sovereignty-ui` in DearAdry | PENDING (requires first publish) |
| 4.3.3 | Create DearAdry token overrides using `createTokens()` | PENDING (requires install) |
| 4.3.4 | Migrate DearAdry imports from local to library | PENDING (requires install) |
| 4.3.5 | Remove migrated components from DearAdry codebase | PENDING (requires migration) |

---

## Project Structure (Target)

```
sovereignty-ui/
├── src/
│   ├── tokens/                    # Design tokens (CONFIGURABLE)
│   │   ├── defaults.ts            # Agnostic default values
│   │   ├── create-tokens.ts       # Token factory (override defaults)
│   │   ├── tokens.types.ts        # Type contracts
│   │   ├── presets.ts             # Composed presets
│   │   └── index.ts
│   │
│   ├── primitives/                # ATOMS (0 dependencies)
│   │   ├── Spinner/
│   │   ├── Skeleton/
│   │   ├── Divider/
│   │   ├── GlobalLoading/
│   │   └── LazyFallback/
│   │
│   ├── components/                # MOLECULES (compose primitives)
│   │   ├── Alert/
│   │   ├── Avatar/
│   │   ├── Badge/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Checkbox/
│   │   ├── Container/
│   │   ├── ErrorFallback/
│   │   ├── Image/
│   │   ├── Input/
│   │   ├── MediaCard/
│   │   ├── Modal/
│   │   ├── PopButton/
│   │   ├── ProgressBar/
│   │   ├── Select/
│   │   ├── StatsCard/
│   │   ├── StepCard/
│   │   ├── Table/
│   │   ├── Tabs/
│   │   ├── TapHint/
│   │   ├── Textarea/
│   │   ├── Toast/
│   │   ├── Toggle/
│   │   ├── ToggleActiveButton/
│   │   └── Tooltip/
│   │
│   ├── patterns/                  # ORGANISMS (complex compositions)
│   │   ├── ConfirmModal/
│   │   ├── DataTable/
│   │   ├── FileUploader/
│   │   ├── FormField/
│   │   └── Pagination/
│   │
│   ├── hooks/                     # Agnostic hooks
│   │   ├── useClickOutside/
│   │   ├── useDebounce/
│   │   ├── useLoading/
│   │   ├── useMediaQuery/
│   │   ├── useModal/
│   │   ├── usePagination/
│   │   └── useTableSort/
│   │
│   ├── utils/                     # Pure utility functions
│   │   ├── array.ts
│   │   ├── date.ts
│   │   ├── format.ts
│   │   ├── object.ts
│   │   └── string.ts
│   │
│   └── index.ts                   # Library entry point
│
├── .github/
│   └── workflows/
│       ├── ci.yml                 # PR validation
│       ├── release.yml            # Publish to GitHub Packages
│       └── storybook.yml          # Deploy docs to GitHub Pages
│
├── .changeset/                    # Changesets config
├── tsup.config.ts                 # Multi-entry build
└── package.json                   # @dannydanzka/sovereignty-ui
```

---

## Token Configurability Matrix

| Token Category | Default in Library | Overrideable | Example Override |
|---------------|-------------------|--------------|-----------------|
| `spacing` | 8-point grid | Yes (rarely needed) | Custom scale |
| `shape` | border-radius scale | Yes (rarely needed) | Rounded vs sharp |
| `motion` | 150/250/400ms | Yes (rarely needed) | Slower animations |
| `elevation` | Material-like shadows | Yes (rarely needed) | Flat design |
| `layout.breakpoint` | 640/768/1024/1280/1536 | Yes | Custom breakpoints |
| `layout.zIndex` | 0-700 scale | Yes (rarely needed) | Custom z-index |
| `color.neutral*` | Gray scale | Yes | Warm/cool grays |
| `color.status` | Standard RGBY | Yes (rarely needed) | Custom status colors |
| `color.primary*` | Purple (library default) | **YES (always)** | Brand primary |
| `color.secondary*` | Blue (library default) | **YES (always)** | Brand secondary |
| `color.tertiary*` | Pink (library default) | **YES (always)** | Brand accent |
| `typography.family` | System fonts (default) | **YES (always)** | Project fonts |
| `typography.size` | rem scale | Yes (rarely needed) | Custom scale |
| `typography.weight` | 400-900 | Yes (rarely needed) | Custom weights |

---

## Decision Log

| Decision | Rationale |
|----------|-----------|
| GitHub Packages over npm public | Private scope, free, integrates with existing GH workflow |
| Atomic Design (primitives/components/patterns) | Clear hierarchy, prevents flat-folder chaos at scale |
| Token factory over ThemeProvider | SSR-safe, no context dependency, aligns with existing flat-map pattern |
| IO via callbacks (uploaders) | Library must be storage-agnostic (Supabase, S3, etc.) |
| Changesets over manual versioning | Automated semver, changelogs, multi-package support |
| lucide-react as icon dependency | Already in use, tree-shakeable, comprehensive |
| `brandColor` removed from library | 100% project-specific, violates agnostic principle |
| ConfirmModal skipped | Modal already has `variant='confirm'` built-in |
| Interfaces in `.interfaces.ts` files | ESLint `custom/component-organization` rule enforces this |

---

**Plan Version**: 2.0 | **Last Updated**: 2026-03-07
