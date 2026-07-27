---
'@dannydanzka/sovereignty-ui': patch
---

`Card`'s radius comes from the shape token instead of a hardcoded `12px`.

Same rendered value — `shape.lg` **is** `0.75rem` — but a literal pixel inside the design system is the
one thing the system exists to prevent: it could not be themed through `--sui-shape-lg`, and a consumer
that wanted a different corner had no way to get one except by forking the card.

Found while migrating 12 hand-rolled cards in one product, whose radii were `shape.lg`, `shape.md` and
`shape.sm` — three different corners that the library could only answer with one hardcoded number.
