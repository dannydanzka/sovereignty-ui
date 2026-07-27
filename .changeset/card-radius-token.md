---
'@dannydanzka/sovereignty-ui': minor
---

`Card` gains a polymorphic `as`, and its radius comes from the shape token instead of a hardcoded `12px`.

**`as`** — a card is a *surface*, not a *meaning*, and the meaning belongs to the caller: a card in a
list is an `li`, a self-contained record is an `article`, a side summary is an `aside`, a testimonial is
a `blockquote`. `Card` was always a `div`, so adopting it inside a `<ul>` replaced the `li`s with
`div`s — invalid markup, and a screen reader stops announcing the list at all. **That cost is why
consumers kept hand-rolling a bordered div instead of using `Card`**: in one product, 7 of the ~20 cards
found while migrating were `li` inside a real list. `as` accepts `article | aside | blockquote | div |
li | section` and keeps every surface style.

**Radius** — same rendered value (`shape.lg` *is* `0.75rem`), but a literal pixel inside the design
system is the one thing the system exists to prevent: it could not be themed through `--sui-shape-lg`,
and a consumer who wanted a different corner had no way to get one except by forking the card. The same
migration found radii of `shape.lg`, `shape.md` and `shape.sm` — three corners the library could only
answer with one hardcoded number.
