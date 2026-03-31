# Global Alignment - sovereignty-ui (Web)

> **Purpose**: Track alignment between this project and `soberania-del-codigo` framework
> **Source of Truth**: `~/Documents/proyectos/soberania-del-codigo/`
> **Last Sync**: 2026-03-30
> **Project Type**: React Component Library (Web)
> **Platform**: Web only — future mobile version will be a separate repository (`sovereignty-ui-native`)

---

## Stack Alignment

| Category | Global Standard | Project | Status |
|----------|----------------|---------|--------|
| React | 19.x | 19.2.4 | Aligned |
| TypeScript | 5.9.x | 5.9.3 | Aligned |
| Styled-components | 6.x | 6.3.11 | Aligned |
| Vitest | 4.0.x | 4.0.18 | Aligned |
| ESLint Custom Rules | 19 (DearAdry) | 16 (library subset) | Aligned (library-adapted) |
| CSS Variable Theming | N/A (library-specific) | Active (`css-variables.ts` + `inject.ts`) | Active |

> **Note on ESLint**: 3 rules excluded because they are framework-specific (Next.js / Redux):
> `require-use-client-directive`, `no-redux-in-components`, `redux-naming-policy`, `no-direct-service-calls`, `architecture-boundaries`, `use-case-policy`, `no-hardcoded-ui-strings`.
> All other 16 rules are active and identical to DearAdry.

---

## Project Identity

| Attribute | Value |
|-----------|-------|
| **Name** | sovereignty-ui |
| **Version** | 0.3.0 |
| **Type** | React component library (npm package) |
| **Platform** | Web (React 19) |
| **Runtime** | Browser (no server-side code) |
| **Distribution** | npm / GitHub Packages |
| **Build tool** | tsup (ESM + CJS + .d.ts) |
| **Dev environment** | Storybook 8 (`@storybook/react-vite`) |
| **Testing** | Vitest + RTL (jsdom) |
| **Styling** | styled-components 6 (peerDependency) |
| **Theming** | CSS custom properties via helpers (`c()`, `s()`, etc.) — no ThemeProvider |
| **Future** | `sovereignty-ui-native` (React Native — separate repo) |

---

## Global Sovereignty Structure Applied

```
~/Documents/proyectos/soberania-del-codigo/
├── doctrine/          → WHY — 8 principles applied (agnostic = sovereign, composable)
├── core/              → WHAT — Transversal patterns (git, code review, quality, workflow)
└── frontend/          → HOW — Presentation patterns only (no domain/infra, no Next.js)
    ├── presentation/  → Components, hooks, styling (DIRECTLY APPLICABLE)
    ├── tooling/       → ESLint, TypeScript, imports (DIRECTLY APPLICABLE)
    └── testing/       → Vitest patterns (DIRECTLY APPLICABLE)
    [infra, domain, nextjs, auth, media — NOT APPLICABLE to this library]
```

---

## Patterns Implemented

### From Global (applied)

| Pattern | Source | Status |
|---------|--------|--------|
| 5-file component structure | `soberania-del-codigo/frontend/presentation/components.md` | Active |
| Transient props (`$prop`) | `soberania-del-codigo/frontend/presentation/components.md` | Active |
| Design tokens flat maps | `soberania-del-codigo/frontend/presentation/` | Active |
| CSS variable theming | Library-specific (`css-variables.ts` + `inject.ts`) | Active |
| No hardcoded CSS values | `design-tokens-policy` ESLint rule | Enforced |
| No native HTML elements | `no-native-html` ESLint rule | Enforced |
| No inline styles | `no-inline-styles` ESLint rule | Enforced |
| Barrel exports (`export *`) | `index-barrel-exports-only` ESLint rule | Enforced |
| Code size limits | `code-size-limits` ESLint rule | Enforced |
| Named exports only | `no-restricted-syntax` ESLint rule | Enforced |
| Vitest testing | `soberania-del-codigo/frontend/testing/vitest.md` | Active |

### Local (library-specific)

| Pattern | Source | Purpose |
|---------|--------|---------|
| Component pattern | `.claude/patterns/component-pattern.md` | 5-file structure with CSS var helpers |
| Token usage | `.claude/patterns/tokens-pattern.md` | Token consumption + CSS variables guide |
| Storybook stories | `.claude/CLAUDE.md` | Documentation standard |

---

## ESLint Rules (16 active — library-adapted)

| Rule | Agnostic | Active |
|------|----------|--------|
| `design-tokens-policy` | Yes | Yes |
| `no-native-html` | Yes | Yes |
| `no-inline-styles` | Yes | Yes |
| `code-size-limits` | Yes | Yes |
| `comments-policy` | Yes | Yes |
| `component-organization` | Yes | Yes |
| `index-barrel-exports-only` | Yes | Yes |
| `no-alias-exports` | Yes | Yes |
| `enforce-hook-composition` | Yes | Yes |
| `no-emojis-in-jsx` | Yes | Yes |
| `essential-testing` | Yes | Yes |
| `no-eslint-disable` | Yes | Yes |
| `no-magic-literal-comparison` | Yes | Yes |
| `no-underscore-prefix` | Yes | Yes |
| `import-strategy` | Yes | Yes |
| `import-order` | Yes | Yes |

**Excluded (framework-specific):**
- `architecture-boundaries` — no multi-context architecture in library
- `require-use-client-directive` — no Next.js
- `no-direct-service-calls` — no Redux
- `no-redux-in-components` — no Redux
- `redux-naming-policy` — no Redux
- `use-case-policy` — no Clean Architecture use cases
- `no-hardcoded-ui-strings` — no i18n (library accepts props)

---

## Library Entry Points

| Import | Source | Contents |
|--------|--------|----------|
| `@dannydanzka/sovereignty-ui` | `dist/index.js` | 48 components + 4 patterns + hooks + utils |
| `@dannydanzka/sovereignty-ui/tokens` | `dist/tokens/index.js` | Tokens + CSS var helpers + `injectSuiTokens()` |
| `@dannydanzka/sovereignty-ui/hooks` | `dist/hooks/index.js` | 7 React hooks |
| `@dannydanzka/sovereignty-ui/utils` | `dist/utils/index.js` | ~30 utility functions |

## Library Inventory

| Category | Count | Details |
|----------|-------|---------|
| **Components** | 48 | Alert, Avatar, Badge, Button, Card, Checkbox, Container, DetailLayout, Divider, Dropdown, EmptyState, EntityCell, ErrorFallback, ErrorState, FormActions, FormError, FormGroup, GlobalLoading, Image, InfoMessage, Input, LazyFallback, LoadingState, Modal, ModalFooter, NotificationToast, PageLayout, PasswordInput, PopButton, ProgressBar, RadioGroup, ScreenBoundary, SearchInput, Select, Skeleton, SortableHeader, Spacer, Spinner, StatItem, StatsCard, StepCard, Switch, Tabs, TapHint, Textarea, Toggle, ToggleActiveButton, Tooltip |
| **Patterns** | 4 | DataTable, FileUploader, FormField, Pagination |
| **Hooks** | 7 | useModal, usePagination, useTableSort, useLoading, useMediaQuery, useClickOutside, useDebounce |
| **Utils** | ~30 | array (5), string (6), date (5), format (6), object (4) |
| **Tokens** | 7 | color, typography, spacing, shape, motion, elevation, layout |
| **Token Helpers** | 10 | c(), s(), sh(), ts(), tw(), tf(), tl(), tt(), el(), mo() |

---

## Key Constraints (Sovereignty Rules for this Library)

1. **Zero framework dependencies** — No Next.js, No Redux, No i18n, No router
2. **peerDependencies only** — `react`, `react-dom`, `styled-components` (consuming project provides them)
3. **No server-side code** — Library is pure client-side (no API calls, no sessions)
4. **No `ThemeProvider`** — CSS var helpers + `injectSuiTokens()` (SSR-safe for consumers using Next.js)
5. **No `'use client'`** — Not a Next.js project; consuming projects handle this
6. **Named exports only** — Exception: Storybook stories + config files (framework requirement)
7. **CSS var helpers mandatory** — Never use direct token access (`color.primary`), always use helpers (`c('primary')`)

---

## Sync Protocol

When DearAdry ESLint rules change:
1. Copy modified rule files from `dearadry/scripts/eslint-rules/` to `sovereignty-ui/scripts/eslint-rules/`
2. Verify the rule is in the "applicable" list above
3. Run `npm run lint` to confirm 0 warnings
4. Commit with `chore: sync ESLint rules from DearAdry`

When `soberania-del-codigo` updates:
1. Check if change affects presentation layer patterns
2. Update `.claude/patterns/` if needed
3. Update this document's "Last Sync" date

---

## Validation Commands

```bash
npm run lint         # ESLint — 0 warnings required
npm run type-check   # TypeScript — 0 errors required
npm run build        # tsup — clean build required
npm run test         # Vitest — all passing required
```

---

**Version**: 3.0 | **Created**: 2026-03-06 | **Updated**: 2026-03-30
**Maintainer**: Danny Ramirez
**Source of Truth**: `~/Documents/proyectos/soberania-del-codigo/`
