---
'@dannydanzka/sovereignty-ui': patch
---

`TotalsList` rows accept an `id`, used as the React key when the label is not unique.

Rows were keyed by `label`, which is safe for subtotal/tax/total but not for a summary whose lines are
**order lines**: two lines of the same asset for the same duration carry the same label, so the keys
collided and one row was dropped — a buyer would be shown a summary missing a line they are paying for.

Found while adopting the pattern in a checkout summary, one release after shipping it.
