# @dannydanzka/sovereignty-ui

## 0.16.0

### Minor Changes

- ad5f003: Button: the `primary`, `accent` and `brand` labels are now readable on ANY themed brand colour.

  Those three variants paint a **themed** background (`primary500` / `accent500`) but hardcoded their
  foreground — `primary` used the near-black `neutral900`, `accent`/`brand` used white. That works for
  the library's default brand (amber primary, pink accent) and breaks for the inverse: a consumer
  theming a dark brand got near-black text on a dark button (label effectively invisible), and a light
  accent would get white-on-light.

  New contrast tokens `onPrimary` / `onAccent` carry the readable foreground, and `createBrandPalette`
  computes each from the brand's **WCAG relative luminance** (light background → dark text, dark
  background → white text). Defaults keep the current look. `onBrandForeground(hex)` is exported so
  consumers can label custom brand surfaces the same way instead of guessing per theme.

## 0.15.0

### Minor Changes

- 4cd4cf0: Input: add `maxLength` and `showCount`, mirroring the contract `Textarea` already had.

  The counter was only available on `Textarea`, so a form with both field types could not offer a
  consistent character limit — consumers had to either skip the limit on single-line fields or wrap
  `Input` locally, forking the design system. `Input` now caps the value with the native `maxLength`
  and renders the same footer shape as `Textarea` (error on the left, `current/max` on the right,
  turning error-coloured when over the cap). Both props are optional and the counter only appears when
  BOTH are set, so existing usages are untouched.

  Implemented for web and native (`Input.styled.native.ts`), since the primitive `TextField` already
  supported `maxLength` on both platforms.

## 0.14.0

### Minor Changes

- Add `Calendar` component (dual-platform web + React Native): a month-grid date picker supporting single-date and range selection, per-day blocking via `isDateDisabled` (availability pickers), min/max bounds, configurable week start, and localized month/weekday/day labels. Pure date math is shared across platforms and unit-tested.

## 0.13.0

### Minor Changes

- d806b28: React Native Batch 12 — DataTable on native (completes the RN plan).

  **DataTable** now renders on React Native via a dedicated `DataTable.native.tsx` with the SAME `DataTableProps<T>` API. Since native has no table semantics, each row renders as a CARD of label/value pairs (built on the native SearchInput, Checkbox, and Pressable). Covered on native: search, row selection + select-all, per-row actions, empty/loading states, and `column.render`.

  Deferred on native (documented in the component): the sortable column-header UI and the built-in Pagination footer — drive sort/paging with your own controls via the same `onSort`/`onPageChange` callbacks. Follow-up: swap the row `.map` for a FlatList when large datasets need virtualization.

  Web is unchanged (235 tests green). Validated in the sovereignty-ui-lab harness (Metro iOS+Android bundles + Jest render). No breaking changes. This is the final batch of the React Native support plan — ~21 components/patterns are now dual-platform.

## 0.12.0

### Minor Changes

- 3b5263e: React Native Batch 11 — overlays complete.
  - **NotificationToast** and the **NotificationContainer** pattern now render on React Native (styles-only port: icons via the internal module, close button via the Pressable primitive; the container uses `position: absolute` since RN has no `position: fixed`).
  - **ImagePreviewModal** renders on native via a dedicated `.native.tsx` on the RN `<Modal>` host with an RN `Image` (gradients become flat translucent scrims).

  Web implementations are unchanged (235 tests green). Validated in the sovereignty-ui-lab harness (Metro iOS+Android bundles + Jest render). No breaking changes.

## 0.11.0

### Minor Changes

- fdbbad3: React Native Batch 10 — Modal on native.

  **Modal** now renders on React Native via a dedicated `Modal.native.tsx` built on the RN `<Modal>` host (backdrop, Android back button, fade animation). Both the `default` and `confirm` variants work, reusing the native Button. The web implementation (portal + `document` keydown/scroll-lock + close animation) is UNCHANGED — all 235 web tests pass untouched.

  Follow-up noted in the plan: wrap the native `ModalContent` in a ScrollView for long content. Validated in the sovereignty-ui-lab harness (Metro iOS+Android bundles + Jest render). No breaking changes.

## 0.10.0

### Minor Changes

- 889bffc: React Native Batch 9 — Checkbox and Toggle on native.
  - **Checkbox** and **Toggle** now render on React Native via a dedicated `Component.native.tsx`: a Pressable that toggles on press with a rendered indicator (checkmark icon / positioned thumb). The web implementations are UNCHANGED — they keep their hidden `<input>` (best a11y + form semantics) and CSS-pseudo indicator, so all 235 web tests pass untouched.
  - This introduces the sanctioned `.native.tsx` split for the narrow set of components whose interaction/structure genuinely diverges (form controls needing a hidden input, and later overlays/lists). Tooling: web `tsconfig.json` excludes `*.native.*`; `tsconfig.native.json` excludes the split web `.tsx` and ESLint now type-lints against both projects.

  Switch and RadioGroup are intentionally not ported: their public `onChange` is a raw DOM event rather than a value callback, so a native version would be a breaking API change (they need a coordinated `onChange(checked)` migration first). No breaking changes here; validated in the sovereignty-ui-lab harness (Metro iOS+Android bundles + Jest render).

## 0.9.0

### Minor Changes

- 417e677: React Native Batch 8 — `TextField` primitive and native text-input Forms.
  - **New `TextField` primitive** (public, exported from the main + native barrels): renders an `<input>` on web and a `TextInput` on native. Both platforms expose ONE change API — `onValueChange(value)` — so shared component files never touch `event.target.value` (absent on RN). `secureTextEntry`, `multiline`/`rows`, and `type` map to the right web attribute or TextInput prop per platform.
  - **Native resolutions for Input, SearchInput, Textarea** — these text inputs now render on React Native. Input keeps its password-visibility toggle (now via the internal icon module). Textarea maps `multiline`/`rows` to TextInput.
  - Web `.tsx` for these three was refactored to route through the primitive while keeping the exact public `onChange(value)` API and all rendered markup — all 235 web tests unchanged.

  PasswordInput is intentionally not ported yet: its public `onChange` is a raw DOM handler rather than a value callback, so a native version would be a breaking API change (Input already offers a built-in password toggle). No breaking changes here; validated end-to-end in the sovereignty-ui-lab harness (Metro iOS+Android bundles + Jest render).

## 0.8.0

### Minor Changes

- 3fa03ea: React Native Batch 7 — interaction primitive, icon module, and 4 more native components.
  - **New `Pressable` primitive** (public, exported from the main + native barrels): renders a real `<button>` on web and a `TouchableOpacity` on native. The native resolution maps the shared web props `onClick`→`onPress`, `disabled`, and `aria-label`→`accessibilityLabel`, so interactive components stay a single shared `.tsx`.
  - **Internal icon module** (`src/internal/icons`): components now resolve icons through one path that Metro swaps from `lucide-react` (web) to `lucide-react-native` (native). Added `lucide-react-native` and `react-native-svg` as OPTIONAL peer dependencies (native consumers install them; web is unaffected).
  - **Native resolutions for Button, Card, Alert, ProgressBar** — these now render on React Native (via `*.styled.native.ts`) in addition to web. `Button` wraps its label in a Span so native renders text correctly; the change is web-transparent (all 235 web tests unchanged).

  No breaking changes: web output, public component APIs, and existing `--sui-*` tokens are untouched. Validated end-to-end in the sovereignty-ui-lab harness (Metro iOS+Android bundles + Jest render).

## 0.7.1

### Patch Changes

- d2b1ad6: Fix package.json `exports` condition order: `react-native` now comes BEFORE `types` in every entry point (`.`, `./tokens`, `./hooks`, `./utils`). TypeScript consumers with `customConditions: ["react-native"]` (React Native projects extending `@react-native/typescript-config`) previously resolved the web `dist/*.d.ts` types instead of `src/index.native.ts`, breaking type-checking of native styled resolutions. No runtime change for web consumers — bundlers matching `import`/`require` are unaffected.

## 0.7.0

### Minor Changes

- 55e85f3: React Native support — phase 1-2 (experimental)
  - Cross-platform primitives: Div (div ↔ View, flexbox-column default) and Span (span ↔ Text)
  - Native token bridge: css-variables/inject resolve raw px values on RN via a runtime registry (setSuiTokens/resetSuiTokens; injectSuiTokens aliases on native); rem→px conversion, single-shadow elevations
  - First RN-ready component batch via Component.styled.native.ts (same styled exports on Div/Span): Avatar, Badge, Divider, EmptyState, InlineIcon, Spacer, StatsCard
  - New native entry src/index.native.ts wired through package.json react-native field + exports conditions; src now ships in the package for Metro; react-native optional peer
  - tsconfig.native.json (moduleSuffixes) + npm run type-check:native; no-native-html rule recognizes .styled.native.ts
  - TokenOverrides now accepts typography.size overrides (web injectSuiTokens honors them too)

## 0.6.0

### Minor Changes

- 8975086: Batch 6 extraction + library governance
  - New components: ActionButton (row actions with view/edit/delete/neutral variants), ImagePreviewModal (fullscreen preview with badge slot, Escape/overlay close), InlineIcon (icon-with-text alignment wrapper)
  - New patterns: TextField/SelectField/TextareaField (FormFields), AvatarUpload and ImageUploader (callback-based, consumer owns the upload), NotificationContainer (+ useNotifications hook: local toast queue with auto-dismiss and max cap), AuthLayout (+ AuthCard), AppHeader, AppFooter, FloatingActions
  - DataTable: optional row selection (selectable/selectedKeys/onSelectionChange) and per-row rowActions
  - StatsCard: new danger and info variants (StatsCardVariant type exported)
  - Governance: CLAUDE.md + .claude/rules (lib discipline), 6 additional canon ESLint rules (22 total), tsconfig noUncheckedIndexedAccess + verbatimModuleSyntax, sideEffects:false for tree-shaking, vitest clearMocks/restoreMocks
  - Backfilled 0.5.0 CHANGELOG entry (createBrandPalette)

## 0.5.0

### Minor Changes

- Add `createBrandPalette` factory for per-tenant SUI theming
  - Expands brand base colors into a full 50–900 SUI color-token override set (pure color math, no project knowledge)
  - Pairs with `injectSuiTokens()` to theme all components from a brand color (multi-tenant; consumed by Trackia SuiThemeBridge)

## 0.4.0

### Minor Changes

- Add CSS variable theming, Batch 5 components, and full unit test coverage
  - All 47 styled files now use CSS var helpers for runtime theming via `injectSuiTokens()` or CSS custom properties
  - New components: Dropdown, SearchInput, EntityCell, SortableHeader, Spacer, StatItem, PageLayout, DetailLayout, ScreenBoundary (48 total)
  - 184 unit tests across 54 test files (Vitest + RTL)
  - Token helpers: c(), s(), sh(), ts(), tw(), tf(), tl(), tt(), el(), mo()
  - Documentation synced with soberania-del-codigo

## 0.3.0

### Minor Changes

- Add Batch 4 form primitives: PasswordInput, RadioGroup, Switch, FormGroup, FormActions, FormError

## 0.2.0

### Minor Changes

- Add Batch 3 state feedback components: EmptyState, ErrorState, LoadingState, InfoMessage, ModalFooter
