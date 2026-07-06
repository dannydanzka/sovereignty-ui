# Plan — React Native Support for sovereignty-ui

> **Status**: PHASE 1-2 EXECUTED (2026-07-05, v0.7.0) — token bridge, Div/Span primitives, native
> type-check, exports/react-native wiring, and first component batch (Avatar, Badge, Divider,
> EmptyState, InlineIcon, Spacer, StatsCard) shipped. Remaining phases trigger with the first
> Soverum mobile product (React Native/Expo).
> **Reference implementation studied**: `~/Documents/betterware/betterware-ui` (`@betternet/design-system`) — dual-platform React + RN library in production use. We adopt its mechanics, NOT its Betterware-specific components/theme.
> **Written**: 2026-07-05

---

## Goal

One library, one API, two platforms: web products keep importing `@dannydanzka/sovereignty-ui` unchanged; future RN apps import the same package and get native implementations. Product custom components remain compositions of agnostic SUI pieces on both platforms.

## Architecture decisions (from betterware-ui learnings)

### 1. Dual build

| Platform | Config | Output | Format |
|----------|--------|--------|--------|
| Web | current tsup | `dist/` | ESM + CJS (unchanged) |
| Native | `tsconfig.native.json` (tsc) | `dist-native/` | CommonJS |

package.json:

```jsonc
{
  "react-native": "src/index.ts",        // Metro reads TS source directly (betterware decision #7)
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "react-native": "./src/index.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "peerDependencies": {
    "react-native": ">=0.74 (optional)",  // via peerDependenciesMeta optional
    "react-native-svg": "optional"
  }
}
```

### 2. File convention per component — AS EXECUTED

> Final decision (differs slightly from the original sketch): ONE shared `Component.tsx`;
> only styles split. `Component.styled.ts` stays the web version (full CSS freedom, untouched);
> `Component.styled.native.ts` exports the SAME styled names built on `src/primitives`
> (`Div` = div↔View, `Span` = span↔Text, both with WebCompatProps so className/data-testid
> type-check). Metro picks `.native.ts` automatically; TS validates via
> `tsconfig.native.json` with `moduleSuffixes: ['.native', '']` (`npm run type-check:native`).

#### Original sketch (kept for reference)

```
Button/
├── Button.tsx           # shared logic OR native implementation
├── Button.web.tsx       # web-specific override (when split needed)
├── Button.styled.ts     # styled-components/native styles
├── Button.styled.web.ts # web styles (styled-components)
├── Button.interfaces.ts # ONE props interface for both platforms
├── Button.test.tsx
├── Button.stories.tsx
└── index.ts
```

- Metro resolves `.native.tsx`/base; bundlers with `react-native-web` resolve `.web.tsx` first.
- Native build excludes `**/*.web.ts(x)`; web build excludes `**/*.native.ts(x)`.

### 3. Hard rules (Metro/Babel constraints — already enforced in `.claude/rules/_global.md`)

- **NEVER `export * as X from`** — breaks Metro's Babel config. Use `import * as X` + `export { X }`.
- Transient props with `$` prefix everywhere (already our convention).
- Explicit type annotations in styled template literals: `({ $size }: StyledProps) => ...`.
- No DOM APIs in shared logic (`document`, `window`, `navigator`) — platform files only.

### 4. THE critical gap: token bridge (our problem, not betterware's)

SUI theming = CSS custom properties (`var(--sui-*, fallback)`). **RN has no CSS variables.** The helpers `c()/s()/sh()/ts()/…` must keep the same call sites but resolve differently per platform:

- `css-variables.web.ts` — current implementation (emits `var(--sui-x, fallback)`).
- `css-variables.native.ts` — resolves against a **runtime token registry**: a plain module-level object seeded with defaults, overridden by `setSuiTokens(overrides)` (native counterpart of `injectSuiTokens`). Returns raw values (`'#5B4FCF'`, `24` for spacing).
- `createBrandPalette()` is pure color math — works on both platforms untouched.
- Spacing/size tokens on native should resolve to **numbers** (dp), not rem strings → the native token map stores numeric equivalents (1rem = 16dp).
- Public API stays: consumers call `injectSuiTokens()` on web, `setSuiTokens()` on native (or one isomorphic `applySuiTokens()`).

### 5. Styling

- `styled-components/native` for native styled files; keep styled-components v6 peer for both.
- No ThemeProvider on either platform (keeps invariant): native tokens come from the runtime registry above.
- Web-only CSS features (media queries, hover, keyframes) live in `.styled.web.ts`; native uses `useWindowDimensions` + `Animated`/`Reanimated`-free CSS-in-JS equivalents where feasible.

### 6. Icons

- Web: `lucide-react` (current).
- Native: `lucide-react-native` (same icon names) behind a platform-split `Icon` module so components import icons from ONE internal path.

### 7. Component classification (initial pass — refine at implementation)

- **Shared with light splits (majority)**: Button, Badge, Card, Alert, Spinner, Skeleton, Divider, Spacer, StatItem, StatsCard, Avatar, ProgressBar, Checkbox, Switch, Toggle, RadioGroup, InlineIcon, ActionButton, EmptyState/ErrorState/LoadingState, StepCard, Tabs.
- **Heavy split (different interaction model)**: Modal (RN `Modal`), Dropdown/Select (native picker/sheet), Tooltip (press-and-hold), NotificationContainer (safe-area), ImagePreviewModal (RN `Modal` + `Image`), AvatarUpload/ImageUploader/FileUploader (expo-image-picker injection via callback — API already callback-based after Batch 6 ✔).
- **Web-only (excluded from native barrel)**: PageLayout/DetailLayout media queries version (native gets simplified variants), SortableHeader (table), DataTable + Pagination (native uses FlatList patterns — new `ListScreen` pattern instead), AppHeader/AppFooter (native navigation owns headers), FloatingActions (maybe shared).
- **Hooks**: useDebounce/useLoading/useModal/usePagination/useTableSort/useNotifications shared as-is; useMediaQuery → `useWindowDimensions` bridge; useClickOutside web-only.
- **Utils**: 100% shared (pure functions).

### 8. Dev & QA

- Storybook stays web (via react-native-web alias like betterware's `tsconfig.web.json` paths) OR a bare Expo example app in `examples/native`.
- Metro symlink config documented for local `file:` installs (copy betterware README snippet).
- Vitest stays for shared/web; add `@testing-library/react-native` + jest-expo only if RN-specific logic grows.

## Phases

1. **Token bridge** — ✅ DONE (v0.7.0): `css-variables.native.ts` + `inject.native.ts` resolve raw
   px values from the runtime registry in `native-values.ts` (`setSuiTokens()` / `resetSuiTokens()`;
   `injectSuiTokens()` aliases to it on native). Spacing/sizes/leading/tracking converted rem→px,
   elevations single-shadow, motion 0ms.
2. **Core primitives + first batch** — ✅ DONE (v0.7.0): `src/primitives` (Div/Span) and native styled
   resolutions for Avatar, Badge, Divider, EmptyState, InlineIcon, Spacer, StatsCard; native barrel
   `src/index.native.ts` (tokens, utils, RN-safe hooks, primitives, batch). ✅ Validated under a real
   Metro bundle via **sovereignty-ui-lab** (bare RN 0.86, `../sovereignty-ui-lab`,
   github.com/dannydanzka/sovereignty-ui-lab): `file:` symlink + watchFolders, GalleryScreen demoing
   the whole batch, tsc/eslint/Jest green, iOS+Android release bundles build. Note: consumers' TS
   needs the `react-native` condition FIRST in package.json `exports` (before `types`) — shipped in
   v0.7.1.
3. **Forms** (Input, Checkbox, Switch, RadioGroup, FormField(s)).
4. **Overlays** (Modal, toast/NotificationContainer, ImagePreviewModal).
5. **Native list patterns** (`ListScreen` replacing DataTable).
6. Publish as minor with `react-native` optional peer; document in soberania `mobile/` + `lib/`.

## Cross-references

- `soberania-del-codigo/mobile/index.md` — ✅ pointer added (PR #36), plus lab registered in `projects/mobile/sovereignty-ui-lab/`.
- betterware-ui `progress.md` — component-by-component shared/web/native classification methodology to imitate.
