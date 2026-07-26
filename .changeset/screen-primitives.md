---
'@dannydanzka/sovereignty-ui': minor
---

The three shapes every screen still hand-rolls: `PageHeader`, `DescriptionList`, `FormGrid` — plus an
inline `EmptyState`.

Measured in a consuming app before writing any code, counting duplicated styled exports:

| New | Replaces | Copies found |
|---|---|---|
| `PageHeader` | `HeaderRow` + `HeaderTitleColumn` + `Title` + `ScreenDescription` | 12 · 12 · 23 · 11 |
| `DescriptionList` | `SummaryLabel`/`SummaryValue`, `MetaLabel`/`MetaValue`, `StatLabel`/`StatValue` | ~30 exports over 8 screens |
| `FormGrid` (+ `.Full`) | `Grid` + `FieldFull` | 6 · 6 |
| `EmptyState variant='inline'` | `EmptyMessage` | 8 |

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
