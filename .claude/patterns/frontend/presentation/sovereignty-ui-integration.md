# sovereignty-ui Integration Pattern

> **Applies to**: Any project consuming `@dannydanzka/sovereignty-ui`
> **Version**: 2.1 | **Updated**: 2026-07-05

---

## Overview

sovereignty-ui is the agnostic React component library of Code Sovereignty. It provides UI primitives, form controls, patterns, hooks, and utilities that any React project can consume without framework dependencies.

**Repository**: https://github.com/dannydanzka/sovereignty-ui (PUBLIC)
**Package**: `@dannydanzka/sovereignty-ui` (GitHub Packages)

---

## Installation

### 1. Create GitHub PAT (Classic) — One Time

GitHub Packages requires authentication even for public repositories.

GitHub → Avatar → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)**

- **Scope**: `read:packages` only
- **Expiration**: No expiration (recommended — read-only risk is minimal)
- **IMPORTANT**: Must be classic token, NOT fine-grained

### 2. Configure `.npmrc`

Create `.npmrc` in your project root:

```
@dannydanzka:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

### 3. Set NPM_TOKEN

```bash
# Local development — add to ~/.zshrc
export NPM_TOKEN=ghp_xxxxxxxxxxxxx

# Vercel / CI — add as environment variable
echo -n "ghp_xxxxxxxxxxxxx" | vercel env add NPM_TOKEN production
```

### 4. Install

```bash
npm install @dannydanzka/sovereignty-ui
# or
yarn add @dannydanzka/sovereignty-ui
```

### 5. Peer Dependencies

Your project must have these installed:

```json
{
  "react": ">=18",
  "react-dom": ">=18",
  "styled-components": ">=6"
}
```

### Token Renewal

If the token expires or is compromised, generate a new classic PAT with `read:packages` and update all locations (local `~/.zshrc`, Vercel env, any CI/CD). See `.claude/patterns/core/sops/sovereignty-ui-publish.md` for detailed steps.

---

## Entry Points

```typescript
// Components + Patterns (main entry — 48 components + 4 patterns)
import { Button, Modal, DataTable } from '@dannydanzka/sovereignty-ui';

// Design tokens + CSS var helpers + runtime theming
import { color, spacing, c, s, injectSuiTokens } from '@dannydanzka/sovereignty-ui/tokens';

// React hooks
import { useModal, useDebounce } from '@dannydanzka/sovereignty-ui/hooks';

// Utility functions
import { formatCurrency, truncate } from '@dannydanzka/sovereignty-ui/utils';
```

---

## Token Override Pattern (CSS Custom Properties)

sovereignty-ui v0.3.0+ uses CSS custom properties for runtime theming. All components render `var(--sui-token, fallback)` — consumers override via CSS or the `injectSuiTokens()` API.

### Option A: `injectSuiTokens()` (programmatic)

```typescript
// src/libs/shared/tokens/project-tokens.ts
import { injectSuiTokens } from '@dannydanzka/sovereignty-ui/tokens';

// Call once at app startup — injects :root CSS variables
injectSuiTokens({
  color: {
    primary: '#FFC107',
    secondary: '#2196F3',
    textPrimary: '#1A237E',
  },
  typography: {
    size: { lg: '1.25rem' },
    family: { body: "'Inter', sans-serif" },
  },
});
```

### Option B: CSS (declarative)

```css
:root {
  --sui-primary: #FFC107;
  --sui-secondary: #2196F3;
  --sui-text-primary: #1A237E;
  --sui-font-family-body: 'Inter', sans-serif;
}
```

### Legacy: `createTokens()` (pre-v0.3.0)

```typescript
import { createTokens } from '@dannydanzka/sovereignty-ui/tokens';
export const tokens = createTokens({ color: { primary: '#FFC107' } });
```

> **Note**: `createTokens()` still works but produces static overrides. Prefer `injectSuiTokens()` for runtime theming.

### What to override

| Token | Override when... |
|-------|------------------|
| `color.primary` | Always — your brand primary color |
| `color.secondary` | Always — your brand secondary color |
| `color.accent*` | Always — your brand accent color |
| `typography.family` | Always — your brand fonts |
| `spacing` | Rarely — only if not using 8-point grid |
| `shape` | Rarely — only if different border-radius scale |

### What NOT to override

- `color.error/warning/success/info` — Universal status colors
- `color.neutral*` — Gray scale works for everyone
- `motion` — Animation speeds are universal
- `layout.zIndex` — Z-index scale is universal

---

## Component Wrapper Pattern (for framework integration)

When a sovereignty-ui component needs framework-specific behavior (e.g., `'use client'` for Next.js), create a thin wrapper:

```typescript
// src/libs/presentation/components/Button/Button.tsx
'use client';

export { Button } from '@dannydanzka/sovereignty-ui';
export type { ButtonProps } from '@dannydanzka/sovereignty-ui';
```

This keeps sovereignty-ui agnostic while consumers handle their framework needs.

---

## Decision: What Goes in sovereignty-ui vs Local

| Goes in sovereignty-ui | Stays local |
|------------------------|-------------|
| Generic UI (Button, Modal, Input) | Domain-specific (RoleBadge, StatusBadge) |
| Agnostic feedback (Alert, Toast) | i18n-dependent (ErrorFallback with translations) |
| Pure utilities (formatDate, truncate) | Service-specific (Supabase upload) |
| Generic hooks (useModal, useDebounce) | State-specific (useAuth, useUsers) |
| Design tokens | Brand assets (Logo.svg, fonts) |

**Rule**: If a component needs `import` from your project's domain/infrastructure/services, it stays local.

---

## Updating sovereignty-ui

### Adding a new component

1. Create in `sovereignty-ui/src/components/NewComponent/` (5-file structure)
2. Export from `sovereignty-ui/src/index.ts`
3. Run `npm run lint && npm run type-check && npm run build`
4. `npx changeset` → describe change
5. `npx changeset version` → bump version
6. Push → CI publishes

### Consuming the update

```bash
npm update @dannydanzka/sovereignty-ui
```

---

## Library Inventory (v0.6.0)

| Category | Count |
|----------|-------|
| Components | 51 (Batch 6 added ActionButton, ImagePreviewModal, InlineIcon) |
| Patterns | 12 (DataTable, FileUploader, FormField, FormFields, Pagination, AvatarUpload, ImageUploader, NotificationContainer, AuthLayout, AppHeader, AppFooter, FloatingActions) |
| Hooks | 8 (Batch 6 added useNotifications — toast queue) |
| Utils | ~30 |
| Token helpers | 10 (c, s, sh, ts, tw, tf, tl, tt, el, mo) + `createBrandPalette()` |

### Batch 6 doctrine note

The Batch 6 additions replace the local components duplicated across products
(Form*Field, AvatarUpload, ImageUpload, ImagePreviewModal, NotificationContainer,
Header/Footer shells, FloatingSocialMedia). **Product custom components must be
business-only compositions of these agnostic pieces** — uploads via `onFileSelect`
callbacks (the consumer owns Supabase/S3), content via props/slots, no brand
defaults. Migration state per product is tracked in
`sovereignty-ui/.claude/docs/batch-6-inventory.md`.

---

## See Also

- SOP: `core/sops/sovereignty-ui-publish.md`
- Library README: `sovereignty-ui/README.md`
- Library CLAUDE.md: `sovereignty-ui/CLAUDE.md`
- Version tracking: `sovereignty-ui/.claude/.sovereignty-version` (auto-generated by sync)
