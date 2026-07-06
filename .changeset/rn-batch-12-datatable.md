---
"@dannydanzka/sovereignty-ui": minor
---

React Native Batch 12 — DataTable on native (completes the RN plan).

**DataTable** now renders on React Native via a dedicated `DataTable.native.tsx` with the SAME `DataTableProps<T>` API. Since native has no table semantics, each row renders as a CARD of label/value pairs (built on the native SearchInput, Checkbox, and Pressable). Covered on native: search, row selection + select-all, per-row actions, empty/loading states, and `column.render`.

Deferred on native (documented in the component): the sortable column-header UI and the built-in Pagination footer — drive sort/paging with your own controls via the same `onSort`/`onPageChange` callbacks. Follow-up: swap the row `.map` for a FlatList when large datasets need virtualization.

Web is unchanged (235 tests green). Validated in the sovereignty-ui-lab harness (Metro iOS+Android bundles + Jest render). No breaking changes. This is the final batch of the React Native support plan — ~21 components/patterns are now dual-platform.
