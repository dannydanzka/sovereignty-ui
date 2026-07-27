# @dannydanzka/sovereignty-ui

## 0.26.0

### Minor Changes

- 567f0c0: `Alert`'s live-region role now follows its variant, and can be overridden with `role`.

  `role="alert"` is an **assertive** live region: a screen reader interrupts whatever it is saying. That
  is right for an error or a warning and wrong for a confirmation — "we sent your link" should wait its
  turn (`role="status"`, polite). `Alert` hardcoded `alert` for all four variants, so any consumer that
  had this distinction right lost it by adopting the component.

  New mapping: `error`/`warning` → `alert`, `info`/`success` → `status`. Pass `role` to override when the
  surrounding UI already announces the change.

  Found while migrating a product whose own success banner used `role="status"` and whose error banner
  used `role="alert"` — the library would have flattened both. The previous unit test asserted the
  hardcoded role, so it encoded the defect rather than catching it; it has been replaced with a
  per-variant table.

- 567f0c0: New `Form` pattern: the `<form>` element as a stack of fields.

  Three lines of CSS (`display: flex; flex-direction: column; gap: <token>`), which is exactly why it
  gets retyped. The product that drove this had **ten copies** — `Form` in seven modals/screens,
  `FormWrapper` in five admin forms — and they had already drifted: most at `gap: md`, one at `lg`, one
  carrying its own `max-height`/scroll for a modal.

  Not `Stack` with `as="form"`: `Stack` neither accepts `as` nor forwards props, so it cannot receive
  `onSubmit`, `noValidate` or an `id` — the things that make a form a form. `Form` spreads every native
  form attribute through, and a test covers submit specifically, because a wrapper that silently drops
  `onSubmit` looks identical on screen and breaks every form in the product.

  Scrolling inside a modal is `--sui-form-max-height` / `--sui-form-overflow-y`, so the one form that
  needs it does not become a wrapper.

## 0.25.0

### Minor Changes

- 7014d01: `PageTitle` / `SectionTitle` margins are overridable: `--sui-page-title-margin` ·
  `--sui-section-title-margin`.

  Found while adopting the colour seam from the previous release. Both headings ship
  `margin: 0 0 <sm>`, which is right for flow layout and wrong inside a gap'd flex/grid container —
  there the heading gets the container's gap **and** its own margin, so the spacing silently doubles and
  nothing in the calling code says why. Every screen that hit this was going to wrap the heading just to
  zero the margin, which is the exact fork the colour seam had just removed.

  Same rule as colour and scale: the product decides it once.

  `BackLink` accepts `as` in its props type.

  It already forwarded `as` at runtime through `...rest`, and its own doc comment told consumers to use
  it — but `BackLinkProps` never declared it, so every router-driven consumer failed to type-check. The
  pattern had shipped since v0.22.0 and no product had been able to adopt it. A typed test now covers it.

## 0.24.0

### Minor Changes

- 3296375: `PageTitle` and `SectionTitle` can be recoloured and resized by CSS variable.

  New: `--sui-page-title-color` · `--sui-page-title-size` · `--sui-section-title-color` ·
  `--sui-section-title-size`. Both primitives already accepted `as` for the heading level; that is now
  documented as the way to pick it.

  Why this is the whole point rather than a convenience: a branded product could not use these headings
  at all. Applying a tenant colour meant forking the heading in each screen, and once forked, the size
  went with it. Measured in the product that drove this: **14 page titles across 3 sizes and 4 colours,
  of which only 4 respected the tenant's brand colour** — and `Title` was an `h1` in 11 files and an
  `h2` in 3, so the heading level was being chosen by how big the text should look. The variable seam
  lets a product make that decision once, in one place.

  The unit test asserts the declarations go _through_ the variables (it fails if someone "simplifies"
  them back to a literal token). It cannot prove the cascade: jsdom does not resolve custom properties,
  so an ancestor actually winning is verified in a browser.

## 0.23.3

### Patch Changes

- baea450: `AppHeader` no longer notifies `onMenuToggle` from inside a state updater.

  A state updater has to be pure — React may re-run it — so calling the consumer's callback there made
  React warn _"Cannot update a component (`X`) while rendering a different component (`AppHeader`)"_
  whenever that callback was itself a `setState`, which is the normal way to use it. The next value is
  now computed before the update and the callback fires after it.

  Covered by a StrictMode test that spies on `console.error`; StrictMode is what re-runs the updater
  and surfaces the impurity. Verified the test fails with the old code and passes with the new — the
  same test outside StrictMode passed either way and would have been worthless.

## 0.23.2

### Patch Changes

- e98a9ca: Every compound part is now also a named export: `FooterLink`, `FormGridFull`, `SidebarHeader`,
  `SidebarNav`, `SidebarFooter`, `SidebarLayoutRoot`, `SidebarLayoutContent`, `SidebarLayoutBody`.

  `AppFooter.Link` and friends are static properties, and **static properties do not survive the React
  Server Component boundary**. A server component importing `AppFooter` from this (now `'use client'`)
  package gets a client _reference_, on which `.Link` is `undefined`; it fails at render with
  _"Element type is invalid ... got: undefined"_, which points nowhere near the real cause.

  The dot form still works and stays the ergonomic choice inside client components. A server-rendered
  subtree has to use the named export. `FiltersBar` already did this; the rest now match.

## 0.23.1

### Patch Changes

- 5336553: The built component and hook bundles now declare `'use client'`, so they can be imported from a
  React Server Component.

  Until now the package shipped **zero** client directives. Every component here uses state, effects
  or styled-components, so importing one from a server component failed at runtime with _"useState
  only works in Client Components"_ — and the consumer adding `'use client'` to its own file does not
  fix it, because the boundary has to be declared by the module that owns the hook. It went unnoticed
  because consumers happened to use these components only from files that were already client
  components; the first server-rendered footer hit it immediately.

  `utils` and `tokens` are deliberately NOT marked: they are pure functions and plain objects, and a
  server component must stay free to call `formatCurrency` or read a token on the server. That split
  is why the build is now two tsup configs — tsup's array config form silently drops a per-entry
  `banner`.

  The directive is re-applied by `scripts/add-use-client.mjs` after the bundles are written, because
  tsup's `dts` pass re-reads them and strips module-level directives. The script exits non-zero if an
  expected entry is missing, so a change in build shape fails the build instead of quietly shipping
  components that crash on the server.

## 0.23.0

### Minor Changes

- 9285fb7: `AppHeader` grows the three behaviours a storefront header always needs, and `AppFooter` gets a link.

  **`AppHeader`**: `floating` (overlay a full-bleed hero instead of taking space in the flow),
  `hidden` (slide out of view — pair with the new `useHeaderScroll`), `transparent` (sit on dark
  imagery), `collapseAt` (`md` default, or `lg` when the nav is wide), `actionsCollapse` (default
  `true`, the previous behaviour; pass `false` when the slot holds something that must stay reachable
  on a phone, like a cart icon) and `onMenuToggle` (the mobile panel's state lives in the pattern, so
  a consumer that needs to react to it has to be told).

  `transparent` is the one that earns its keep. **The bar flips its own `color` and slot content
  inherits it**, so a consumer no longer threads an `isOnDark` boolean through its logo, every nav
  link, the cart icon and the hamburger — five styled components each carrying the same flag is the
  shape this always takes by hand. The mobile panel deliberately does NOT inherit it: text over hero
  imagery is unreadable, so the panel stays a solid surface.

  **`useHeaderScroll`** — `{ isHidden, isScrolled }` from scroll position, throttled to one read per
  animation frame (a raw scroll listener re-renders the header dozens of times a second). Hiding
  happens only while scrolling down past a threshold; any upward move brings the header back, so a
  reader never has to return to the top to reach the nav. Web-only (reads `window.scrollY`), so it is
  absent from the native barrel.

  **`AppFooter.Link`** — the muted-anchor-that-brightens-on-hover, which is otherwise re-declared once
  per link kind in a footer.

  Re-skin both through custom properties: `--sui-app-header-bg` · `-fg` · `-fg-on-dark` · `-border` ·
  `-shadow` · `-blur` · `-max-width`, and `--sui-app-footer-link-color` · `-hover-color`.

## 0.22.2

### Patch Changes

- b23bed3: `Sidebar.Nav` names every entry with `aria-label`, so a collapsed rail is still navigable by
  screen reader.

  Collapsed means icons only, and the visible label is `display: none` — which also removes it from
  the accessibility tree. Every hand-rolled sidebar this pattern replaced had the same defect: with
  the rail collapsed, an assistive-technology user got a list of unnamed links.

## 0.22.1

### Patch Changes

- 861a0b6: `SidebarLayout` accepts `style`, so a runtime theme can reach the shell.

  A multi-tenant product computes its palette per request and hands it down as CSS custom properties
  on the outermost node — it cannot come from a static stylesheet, and the sidebar reads its
  `--sui-sidebar-*` vars from an ancestor. Without this the consumer has to cast the prop away or add
  a wrapper element purely to host the declarations.

## 0.22.0

### Minor Changes

- 8ecaa0a: Add the `Sidebar` family and `BackLink` — the last two agnostic pieces an authenticated app was
  still rebuilding by hand.

  **`Sidebar` + `SidebarLayout`** (web-only: `position: fixed`, hover and media queries have no honest
  RN equivalent). Compound: `Sidebar.Header` (identity + collapse + mobile close), `Sidebar.Nav`
  (entries, badges, collapsed tooltips) and `Sidebar.Footer` (the pinned action), plus
  `SidebarLayout` / `.Content` / `.Body` for the shell beside it.

  Two things it takes off the product's hands:
  - **Which entry is active** is now one tested function (`isNavItemActive`), not a copy-pasted `if`.
    It also fixes a bug every copy had: a bare `startsWith` lights up `/x` for `/x-import`, so the
    match is now on a path segment boundary, and the section root matches exactly.
  - **The rail width and the content offset** read the same `--sui-sidebar-width` custom property.
    They used to be hardcoded in both components, which is how a collapsed rail ends up with a gap
    beside it.

  Re-skin through `--sui-sidebar-*` custom properties (bg, header-bg, border, fg, fg-muted, hover-bg,
  active-bg, active-fg, active-marker, avatar-bg, width, width-collapsed) — never by forking the
  structure, and never by passing a raw colour as a prop.

  **`BackLink`** — the "‹ back to the list" anchor above a detail screen. Recolour with
  `--sui-back-link-color`.

## 0.21.0

### Minor Changes

- 27d65b0: The three shapes every screen still hand-rolls: `PageHeader`, `DescriptionList`, `FormGrid` — plus an
  inline `EmptyState`.

  Measured in a consuming app before writing any code, counting duplicated styled exports:

  | New                           | Replaces                                                                        | Copies found               |
  | ----------------------------- | ------------------------------------------------------------------------------- | -------------------------- |
  | `PageHeader`                  | `HeaderRow` + `HeaderTitleColumn` + `Title` + `ScreenDescription`               | 12 · 12 · 23 · 11          |
  | `DescriptionList`             | `SummaryLabel`/`SummaryValue`, `MetaLabel`/`MetaValue`, `StatLabel`/`StatValue` | ~30 exports over 8 screens |
  | `FormGrid` (+ `.Full`)        | `Grid` + `FieldFull`                                                            | 6 · 6                      |
  | `EmptyState variant='inline'` | `EmptyMessage`                                                                  | 8                          |

  Several of those copies were **byte-identical**, which is the real cost: not the duplication, but that
  each copy is one edit away from a different gap, breakpoint or alignment — so "the same header" quietly
  differs per page.
  - **`PageHeader`** — title (+ optional one-line description) left, actions right. The title is a
    `ReactNode`: pass a string to get the library `PageTitle`, or pass your own heading to keep a brand
    colour and scale **without** copying the layout with it.
  - **`DescriptionList`** — label → value rows as a real `<dl>/<dt>/<dd>`, `columns` fixed or auto-fit,
    and `hidden` per item so callers stop building the array conditionally. Distinct from
    `StatsCard`/`StatItem`: those are KPIs with icons and semantic colour, this is one record's data.
  - **`FormGrid`** — the 2-column form body that collapses to 1 below `sm`, with `FormGrid.Full` for the
    field that spans the row.
  - **`EmptyState`** — `variant='inline'` renders one line of muted text where a list or table body
    would be. The default `block` panel is unchanged.

  `PageHeader`, `DescriptionList` and `FormGrid` are **web-only** (exported from the web barrel only):
  all three are CSS-grid layouts and React Native has no grid. `EmptyState` stays dual-platform, inline
  variant included.

  **Backwards compatible**: three new names, and `EmptyState` defaults to its current behaviour.

## 0.20.1

### Patch Changes

- 232ee61: `TableFooter`: stop the page-size label breaking mid-phrase.

  "Show [20] per page" is two short words around a dropdown; with a language whose words are longer than
  English's (`por página`) the trailing label wrapped onto a second line and read as a broken layout. Its
  grid column is `auto`, so the label can simply be as wide as its text — `white-space: nowrap`.

## 0.20.0

### Minor Changes

- 1c52f46: The surfaces a screen is built on: `Stack` and an outlined `Card`.

  Both are the layout half of what consumers still hand-roll around `DataTable`. The furniture landed in
  v0.19.0 (`FiltersBar`, `TableFooter`, `ActionsCell`, `StatusBadge`); this is the room it sits in.
  - **`Stack`** (new, dual-platform web + native): a flex row/column with token spacing —
    `direction`, `gap`, `align`, `justify`, `wrap`. `Spacer` puts space between two things; `Stack` owns
    the rhythm of a whole group, which is the snippet (`display: flex; flex-direction: column; gap: …`)
    every screen re-types with a slightly different gap.
  - **`Card`** gains `variant` (`elevated` default = today's shadow, `outlined` = flat bordered
    surface), `clipped` (clip content to the rounded corners, so a table's first row can sit flush) and
    `className` pass-through. A table or a form section inside a shadowed card reads as a floating tile,
    which is why consumers built bordered `div`s instead of using `Card`.

  **Backwards compatible**: `Card` defaults to `elevated` with no border, no clipping — byte-identical
  to v0.19.0 for every existing call site. `Stack` is a new name. Nothing was renamed or removed.

## 0.19.0

### Minor Changes

- 95b45e6: Patterns for a list screen: FiltersBar, TableFooter, ActionsCell, StatusBadge, useDataTableState

  `DataTable` shipped without the furniture that surrounds it, so every consumer re-built the same four
  things next to it — and each one slightly differently. Measured in one admin panel: six screens had
  no paginator at all, ten carried their own `styled.input` + `styled.select` + `styled.option` for the
  filter row, and the page-size dropdown never matched the filter bar directly above it.
  - **`FiltersBar`** + `FiltersBar.Search` / `FiltersBar.Select` — the responsive search+filter row.
    The controls ARE `Input` and `Select`, so a filter field looks exactly like a form field.
  - **`TableFooter`** — page size + visible range + `Pagination`. Wording stays with the caller
    (`rangeLabel`, `pageSizeLabel`, `perPageLabel`) with neutral English defaults, so it carries no
    language of its own.
  - **`ActionsCell`** — the right-aligned row-actions slot, one gap for every table.
  - **`StatusBadge`** — the binary active/inactive state with a fixed colour pair, so the same state
    never reads as a different colour on two screens.
  - **`useDataTableState`** — sort + pagination over an in-memory list, returning the slice to render.
    `useTableSort` and `usePagination` each solved half; this composes them (including "back to page 1
    when the sort or page size changes" and clamping when the data shrinks).

  Additive only: every name is new, and no existing component, prop or export changed — upgrading
  cannot alter how a current consumer renders. `StatusBadge` is exported for native too (pure `Badge`
  composition); `FiltersBar` / `TableFooter` / `ActionsCell` are web-only for now, the same status as
  `Pagination` and `FormField`.

## 0.18.0

### Minor Changes

- ddbe814: Input: dates and numbers are types of the same field, not hand-rolled ones

  A consumer could not build a date or a bounded number field with `Input`: there was no `date` type
  and no `min`/`max`/`step`, so every form fell back to a raw `<input type="date">`/`type="number"` —
  losing the label, the error footer and the counter, and making each module's fields look different.
  It also had no `onBlur`, so validate-on-blur forms had to bypass the component.
  - `type` accepts `'date'`; `min` / `max` / `step` are forwarded (bounded ranges, money steps).
  - `inputMode` asks for a specific on-screen keyboard without lying about the input type.
  - `onBlur` completes the change API for forms that validate on blur.
  - `TextField` (FormFields) forwards all of the above plus `maxLength` / `showCount`, which only
    `TextareaField` had — the pattern is no longer weaker than the component it wraps.

  Native: `min`/`max`/`step` are dropped (TextInput has no equivalent) and `date` degrades to a
  numbers-and-punctuation keyboard — use `Calendar` for a real native picker. Browser bounds are hints;
  the schema still owns validation.

## 0.17.0

### Minor Changes

- 4bfa17f: Button: label weight `medium` → `bold` (web + native). A call to action reads as one; at 500 the
  label competed with body copy, and consumers were compensating with local overrides — which is the
  divergence the shared Button exists to prevent.

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
