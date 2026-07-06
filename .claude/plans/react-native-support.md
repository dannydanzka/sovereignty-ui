# Plan — React Native Support for sovereignty-ui

> **Status**: PHASE 1-2 EXECUTED (2026-07-05, v0.7.0) — token bridge, Div/Span primitives, native
> type-check, exports/react-native wiring, and first component batch (Avatar, Badge, Divider,
> EmptyState, InlineIcon, Spacer, StatsCard) shipped.
> **BATCH 7 EXECUTED** (2026-07-06, v0.8.0) — `Pressable` primitive (button ↔ TouchableOpacity, maps
> onClick→onPress via `.attrs`), internal icon module (`src/internal/icons` → lucide-react /
> lucide-react-native, optional peers), and native resolutions for **Button, Card, Alert,
> ProgressBar**. Validated in sovereignty-ui-lab (Metro iOS+Android bundles + Jest render).
> **BATCH 8 EXECUTED** (2026-07-06, v0.9.0) — `TextField` primitive (input ↔ TextInput, normalizes
> value change to one `onValueChange(value)` callback; maps secureTextEntry/multiline/type per
> platform) and native resolutions for the text-input Forms: **Input** (incl. password toggle),
> **SearchInput**, **Textarea** (multiline). Web `.tsx` refactored to route through the primitive with
> the SAME public `onChange(value)` API (235 tests green).
> **BATCH 9 EXECUTED** (2026-07-06, v0.10.0) — toggle family via the sanctioned `.native.tsx` pattern:
> **Checkbox** and **Toggle** get a dedicated `Component.native.tsx` (Pressable + rendered indicator)
> while web keeps its hidden `<input>` + CSS pseudo (best a11y/form semantics, untouched). Switch and
> RadioGroup deferred (their public `onChange` is a raw DOM event, not a value callback → porting is
> breaking). Remaining phases below.
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
2b. **Interaction primitive + icon module + Batch 7** — ✅ DONE (v0.8.0):
   - `Pressable` primitive (web `<button>` reset ↔ native `TouchableOpacity`); native maps the shared
     web props `onClick`→`onPress`, `disabled`, `aria-label`→`accessibilityLabel` via `.attrs`, so
     interactive components keep ONE `.tsx` that passes web props unchanged.
   - `src/internal/icons/{index.ts, index.native.ts}` — re-export lucide-react / lucide-react-native
     under one internal path (components import icons from here, never `lucide-react` directly).
     `lucide-react-native` + `react-native-svg` added as OPTIONAL peers.
   - Native styled resolutions: **Button** (Pressable + ButtonLabel Span carrying per-variant text
     color since RN Text doesn't inherit color; loader→ActivityIndicator), **Card** (Pressable,
     disabled when not clickable), **Alert** (row layout, Span message, internal icons, Pressable
     dismiss), **ProgressBar** (solid fill instead of gradient, no keyframes).
   - Validated in sovereignty-ui-lab (Metro iOS+Android + Jest); web 235 tests green.

3. **Forms**:
   - **Text inputs** — ✅ DONE (v0.9.0, Batch 8): `TextField` primitive + Input/SearchInput/Textarea.
     PasswordInput deferred (its public `onChange` is a raw DOM handler, not a value callback —
     migrating it is a breaking API change; Input already ships a built-in password toggle).
   - **Toggle family**: **Checkbox + Toggle** ✅ DONE (v0.10.0, Batch 9) via `.native.tsx` (web keeps
     hidden input + CSS pseudo; native = Pressable + rendered indicator). **Switch + RadioGroup**
     deferred — their public `onChange` is a raw DOM event (`ChangeEvent<HTMLInputElement>`), not a
     value callback; a native version would be a breaking API change (same rule as PasswordInput). When
     migrating them, first move to a value-based `onChange(checked)` in a coordinated major.
   - **Select**: native picker/action-sheet (heavy).
   - **FormField(s)** pattern: compose the above once Select lands.
4. **Overlays**:
   - **Modal** — ✅ DONE (v0.11.0, Batch 10) via `.native.tsx` on the RN `<Modal>` host (backdrop,
     Android back, fade); default + confirm variants reuse the native Button. Web (portal + document
     keydown/scroll-lock) untouched. Follow-up: wrap `ModalContent` in a ScrollView for long content.
   - **NotificationContainer** (toast queue) + **ImagePreviewModal** — pending (RN Modal + safe-area /
     RN Image zoom).
5. **Native list patterns** (`ListScreen` replacing DataTable) — FlatList-based.
6. Publish as minor with `react-native` optional peer; document in soberania `mobile/` + `lib/`.

### The `.attrs` prop-mapping pattern (Batch 7 learning)

Zero-web-risk rule for going cross-platform: **never edit the web `.styled.ts`**; put every platform
difference in `.styled.native.ts`, and map web props→native props with styled-components/native
`.attrs` (as Avatar's src→source did). Works when the only divergence is prop names / RN-safe CSS.
When it does NOT suffice — raw text rendered directly in a View (wrap children in a Span, a tiny shared
`.tsx` change), color that must reach a Text (pass `$variant` to the text Span), value extraction from a
DOM event, or CSS pseudo-elements — the component graduates to Phase 3+ and needs a primitive or a
shared-`.tsx` refactor, gated by re-running the full web test suite.

## Cross-references

- `soberania-del-codigo/mobile/index.md` — ✅ pointer added (PR #36), plus lab registered in `projects/mobile/sovereignty-ui-lab/`.
- betterware-ui `progress.md` — component-by-component shared/web/native classification methodology to imitate.
