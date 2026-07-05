# @dannydanzka/sovereignty-ui

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
