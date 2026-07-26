---
'@dannydanzka/sovereignty-ui': minor
---

Patterns for a list screen: FiltersBar, TableFooter, ActionsCell, StatusBadge, useDataTableState

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
