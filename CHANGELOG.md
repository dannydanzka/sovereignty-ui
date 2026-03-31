# @dannydanzka/sovereignty-ui

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
