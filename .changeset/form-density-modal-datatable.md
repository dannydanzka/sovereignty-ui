---
"@dannydanzka/sovereignty-ui": minor
---

Three measured layout defects fixed. **All three change how existing components render** — read this
before upgrading.

**1. Form controls share one metric (visual change to `Input`).**
`Input`, `Select`, `Textarea` and `SearchInput` each owned their own height, font size, padding,
border and focus treatment. Three agreed and `Input` did not, so the two side by side in one
`FormGrid` row visibly misaligned — measured in a consumer's admin at 1512px: **55px / 16px / 2px**
against **35px / 14px / 1px**. There is now one internal definition and all four consume it.

- **`Input` is the component that moves**: 1px border (was 2px), 14px font (was 16px), and the
  shorter shared height. It is now the same size as the `Select` beside it. `Select`, `Textarea` and
  `SearchInput` render as before.
- `Input` gains an optional **`size`** (`'sm' | 'md' | 'lg'`, default `'md'`) — the same scale
  `Select` already had, so a mixed row can be stepped together.
- `Textarea` and `SearchInput` gain the shared focus ring and the shared disabled treatment.

**2. `Modal` sizes are responsive (visual change to every size).**
The ladder was fixed pixels (`sm` 360 · `md` 480 · `lg` 600 · `xl` 700), so a `lg` form rendered
568px wide at 1512px leaving 944px of screen unused — and identically at 1280px. Each size is now
`min(ceiling, viewport fraction)`: fluid below the ceiling, capped above it so a form's fields never
become absurdly long lines. New ceilings: `sm` 420 · `md` 640 · `lg` 880 · `xl` 1120 · `full` 1600.

**3. `DataTableColumn` gains `sticky`, `minWidth` and `hideBelow`** (additive — no change unless used).

- **`minWidth`** — a floor the browser may not shrink past. `width` is only a suggestion to table
  auto-layout, which is why a wide table used to collapse its identity column to a few characters.
- **`sticky`** — pin the column while the table scrolls sideways, so the row keeps saying which
  record it is. Requires a px `minWidth`/`width` (the next pinned column's offset is summed from it)
  and that pinned columns be the leading ones; a `selectable` table pins its checkbox column too.
- **`hideBelow`** (`'sm' | 'md' | 'lg' | 'xl'`) — drop the column below a breakpoint instead of
  squeezing every column into illegibility.
