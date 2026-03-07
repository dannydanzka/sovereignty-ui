# Global Alignment - sovereignty-ui (Web)

> **Purpose**: Track alignment between this project and global `~/.claude/sovereignty/` framework
> **Last Sync**: 2026-03-07
> **Sovereignty Structure**: v4.0.0
> **Project Type**: React Component Library (Web)
> **Platform**: Web only — future mobile version will be a separate repository (`sovereignty-ui-native`)

---

## Stack Alignment

| Category | Global Standard | Project | Status |
|----------|----------------|---------|--------|
| **Sovereignty** | 4.0.0 | 4.0.0 | Aligned |
| React | 19.2.3 | 19.2.4 | Aligned |
| TypeScript | 5.9.3 | 5.9.3 | Aligned |
| Styled-components | 6.1.14 | 6.3.11 | Aligned |
| Vitest | 4.0.x | 4.0.18 | Aligned |
| ESLint Custom Rules | 19 (DearAdry) | 16 (library subset) | Aligned (library-adapted) |
| Prettier | Same config | Same config | Aligned |

> **Note on ESLint**: 3 rules excluded because they are framework-specific (Next.js / Redux):
> `require-use-client-directive`, `no-redux-in-components`, `redux-naming-policy`, `no-direct-service-calls`, `architecture-boundaries`, `use-case-policy`, `no-hardcoded-ui-strings`.
> All other 16 rules are active and identical to DearAdry.

---

## Project Identity

| Attribute | Value |
|-----------|-------|
| **Name** | sovereignty-ui |
| **Type** | React component library (npm package) |
| **Platform** | Web (React 19) |
| **Runtime** | Browser (no server-side code) |
| **Distribution** | npm / GitHub Packages |
| **Build tool** | tsup (ESM + CJS + .d.ts) |
| **Dev environment** | Storybook 8 (`@storybook/react-vite`) |
| **Testing** | Vitest + RTL |
| **Styling** | styled-components 6 (peerDependency) |
| **Future** | `sovereignty-ui-native` (React Native — separate repo) |

---

## Global Sovereignty Structure Applied

```
~/.claude/sovereignty/
├── doctrine/          → WHY — 8 principles applied (agnostic = sovereign, composable)
├── core/              → WHAT — transversal patterns (git, code review, quality, workflow)
└── frontend/          → HOW — presentation patterns only (no domain/infra, no Next.js)
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
| 5-file component structure | `~/.claude/sovereignty/frontend/presentation/components.md` | Active |
| Transient props (`$prop`) | `~/.claude/sovereignty/frontend/presentation/components.md` | Active |
| Design tokens flat maps | `~/.claude/sovereignty/frontend/presentation/` | Active |
| No hardcoded CSS values | `design-tokens-policy` ESLint rule | Enforced |
| No native HTML elements | `no-native-html` ESLint rule | Enforced |
| No inline styles | `no-inline-styles` ESLint rule | Enforced |
| Barrel exports (`export *`) | `index-barrel-exports-only` ESLint rule | Enforced |
| Code size limits | `code-size-limits` ESLint rule | Enforced |
| Named exports only | `no-restricted-syntax` ESLint rule | Enforced |
| Vitest testing | `~/.claude/sovereignty/frontend/testing/vitest.md` | Active |

### Local (library-specific)

| Pattern | Source | Purpose |
|---------|--------|---------|
| Component pattern | `.claude/patterns/component-pattern.md` | 5-file structure with stories |
| Token usage | `.claude/patterns/tokens-pattern.md` | Token consumption guide |
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
| `@dannydanzka/sovereignty-ui` | `dist/index.js` | 28 components + 4 patterns |
| `@dannydanzka/sovereignty-ui/tokens` | `dist/tokens/index.js` | Design tokens + createTokens() |
| `@dannydanzka/sovereignty-ui/hooks` | `dist/hooks/index.js` | 7 React hooks |
| `@dannydanzka/sovereignty-ui/utils` | `dist/utils/index.js` | ~30 utility functions |

## Library Inventory

| Category | Count | Details |
|----------|-------|---------|
| **Components** | 28 | Alert, Avatar, Badge, Button, Card, Checkbox, Container, Divider, ErrorFallback, GlobalLoading, Image, Input, LazyFallback, Modal, NotificationToast, PopButton, ProgressBar, Select, Skeleton, Spinner, StatsCard, StepCard, Tabs, TapHint, Textarea, Toggle, ToggleActiveButton, Tooltip |
| **Patterns** | 4 | DataTable, FileUploader, FormField, Pagination |
| **Hooks** | 7 | useModal, usePagination, useTableSort, useLoading, useMediaQuery, useClickOutside, useDebounce |
| **Utils** | ~30 | array (5), string (6), date (5), format (6), object (4) |
| **Tokens** | 6 | color, typography, spacing, shape, motion, elevation, layout |

---

## Key Constraints (Sovereignty Rules for this Library)

1. **Zero framework dependencies** — No Next.js, No Redux, No i18n, No router
2. **peerDependencies only** — `react`, `react-dom`, `styled-components` (consuming project provides them)
3. **No server-side code** — Library is pure client-side (no API calls, no sessions)
4. **No `ThemeProvider`** — Flat maps only (SSR-safe for consumers using Next.js)
5. **No `'use client'`** — Not a Next.js project; consuming projects handle this
6. **Named exports only** — Exception: Storybook stories + config files (framework requirement)

---

## Sync Protocol

When DearAdry ESLint rules change:
1. Copy modified rule files from `dearadry/scripts/eslint-rules/` to `sovereignty-ui/scripts/eslint-rules/`
2. Verify the rule is in the "applicable" list above
3. Run `npm run lint` to confirm 0 warnings
4. Commit with `chore: sync ESLint rules from DearAdry`

When global `~/.claude/sovereignty/` updates:
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

**Version**: 2.0 | **Created**: 2026-03-06 | **Updated**: 2026-03-07
**Maintainer**: Danny Ramirez
**Source of Truth**: `~/.claude/sovereignty/frontend/framework/`
