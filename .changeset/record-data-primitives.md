---
'@dannydanzka/sovereignty-ui': minor
---

Record-data primitives: new `TotalsList`, plus a colour seam on `ProgressBar` and `Avatar`.

**`TotalsList` (new)** — a money summary: label → value lines with one emphasized total. Quotes, carts,
checkouts, orders and invoices all render this shape, and a single product had **five** versions of it
under five names (`TotalsLine`, `SummaryRow`, `TotalRow`, `GrandTotal`, `TotalsRow`) that had already
drifted: the same grand total was tenant-dark bold `base` on one screen, brand-red display `xl` on
another and plain `textPrimary` `lg` on a third. It renders a real `<dl>/<dt>/<dd>`, and the total's
colour, scale and rule are `--sui-totals-*` variables, because money is exactly the thing a branded
product should decide once.

**`ProgressBar`** — the `default` fill and the track now read `--sui-progress-fill` /
`--sui-progress-track`, so a brand can own the bar without forking it. `success` and `warning` stay
fixed on purpose: they MEAN something, and a brand repainting them would stop a warning reading as a
warning. New `valueLabel` prop replaces the percentage with your own reading of the same progress
("$400 / $1,200") — a payment bar cares about the money, and without it the caller renders its own row
beside the bar and the screen shows the progress twice.

**`Avatar`** — colours go through `--sui-avatar-bg` / `--sui-avatar-fg`, and the size scale gains `xs`
(24px, the chip that fits in a top bar) and `2xl` (96px, a profile header). Both sizes existed as
hand-rolled copies in a product before they existed here: a scale that stops at 64px forces a fork for
the two most common placements.
