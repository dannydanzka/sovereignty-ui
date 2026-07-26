---
'@dannydanzka/sovereignty-ui': minor
---

The surfaces a screen is built on: `Stack` and an outlined `Card`.

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
