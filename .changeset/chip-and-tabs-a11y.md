---
'@dannydanzka/sovereignty-ui': minor
---

New `Chip`, and `Tabs` completes the ARIA tabs contract.

**`Chip`** — the selectable pill every product hand-rolls for a "filter by category" row. It was
missing, so consumers built it: two independent copies existed in one product alone, pill-shaped and
brand-coloured-when-active in both, differing only in padding and in which grey the unselected text
used. `Chip` is deliberately **not** `Badge`: a badge is a readout (status, count) and is not
interactive; a chip is a control the user presses to narrow a list, and conflating them is how a
product ends up with a clickable thing that looks like a label.

- `onSelect` hands back the chip's `value`, not the DOM event — so **one** handler serves a whole
  row and callers stop writing a curried factory per option.
- Semantics are a toggle button with `aria-pressed`, not a radio: a chip row is as often
  multi-select as single-select, and `aria-pressed` reads correctly either way.
- The selected state reads `accent500`, which is the library's brand seam, so a chip row follows the
  tenant with no wrapper and no new variable.
- Dual-platform (web + React Native resolution).

**`Tabs`** already had `role="tab"` / `role="tabpanel"`, which is only half of the contract — and the
missing half is what made the tab bar unusable without a mouse:

- each tab is now `aria-controls`-linked to the panel and the panel `aria-labelledby`-linked back, so
  a screen reader announces which panel it landed in instead of an unlabelled region;
- the tablist is one tab stop (`tabIndex` follows the active tab) and Left/Right/Home/End move
  between tabs, skipping disabled ones and wrapping at both ends. Before this, reaching the third tab
  meant three Tab presses and the panel never announced itself.

No API change on `Tabs` — existing consumers gain the behaviour without edits.
