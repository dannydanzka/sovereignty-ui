---
'@dannydanzka/sovereignty-ui': patch
---

`Sidebar.Nav` names every entry with `aria-label`, so a collapsed rail is still navigable by
screen reader.

Collapsed means icons only, and the visible label is `display: none` — which also removes it from
the accessibility tree. Every hand-rolled sidebar this pattern replaced had the same defect: with
the rail collapsed, an assistive-technology user got a list of unnamed links.
