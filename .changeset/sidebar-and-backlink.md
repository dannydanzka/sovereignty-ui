---
'@dannydanzka/sovereignty-ui': minor
---

Add the `Sidebar` family and `BackLink` — the last two agnostic pieces an authenticated app was
still rebuilding by hand.

**`Sidebar` + `SidebarLayout`** (web-only: `position: fixed`, hover and media queries have no honest
RN equivalent). Compound: `Sidebar.Header` (identity + collapse + mobile close), `Sidebar.Nav`
(entries, badges, collapsed tooltips) and `Sidebar.Footer` (the pinned action), plus
`SidebarLayout` / `.Content` / `.Body` for the shell beside it.

Two things it takes off the product's hands:

- **Which entry is active** is now one tested function (`isNavItemActive`), not a copy-pasted `if`.
  It also fixes a bug every copy had: a bare `startsWith` lights up `/x` for `/x-import`, so the
  match is now on a path segment boundary, and the section root matches exactly.
- **The rail width and the content offset** read the same `--sui-sidebar-width` custom property.
  They used to be hardcoded in both components, which is how a collapsed rail ends up with a gap
  beside it.

Re-skin through `--sui-sidebar-*` custom properties (bg, header-bg, border, fg, fg-muted, hover-bg,
active-bg, active-fg, active-marker, avatar-bg, width, width-collapsed) — never by forking the
structure, and never by passing a raw colour as a prop.

**`BackLink`** — the "‹ back to the list" anchor above a detail screen. Recolour with
`--sui-back-link-color`.
