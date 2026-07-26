---
'@dannydanzka/sovereignty-ui': minor
---

`AppHeader` grows the three behaviours a storefront header always needs, and `AppFooter` gets a link.

**`AppHeader`**: `floating` (overlay a full-bleed hero instead of taking space in the flow),
`hidden` (slide out of view — pair with the new `useHeaderScroll`), `transparent` (sit on dark
imagery), `collapseAt` (`md` default, or `lg` when the nav is wide), `actionsCollapse` (default
`true`, the previous behaviour; pass `false` when the slot holds something that must stay reachable
on a phone, like a cart icon) and `onMenuToggle` (the mobile panel's state lives in the pattern, so
a consumer that needs to react to it has to be told).

`transparent` is the one that earns its keep. **The bar flips its own `color` and slot content
inherits it**, so a consumer no longer threads an `isOnDark` boolean through its logo, every nav
link, the cart icon and the hamburger — five styled components each carrying the same flag is the
shape this always takes by hand. The mobile panel deliberately does NOT inherit it: text over hero
imagery is unreadable, so the panel stays a solid surface.

**`useHeaderScroll`** — `{ isHidden, isScrolled }` from scroll position, throttled to one read per
animation frame (a raw scroll listener re-renders the header dozens of times a second). Hiding
happens only while scrolling down past a threshold; any upward move brings the header back, so a
reader never has to return to the top to reach the nav. Web-only (reads `window.scrollY`), so it is
absent from the native barrel.

**`AppFooter.Link`** — the muted-anchor-that-brightens-on-hover, which is otherwise re-declared once
per link kind in a footer.

Re-skin both through custom properties: `--sui-app-header-bg` · `-fg` · `-fg-on-dark` · `-border` ·
`-shadow` · `-blur` · `-max-width`, and `--sui-app-footer-link-color` · `-hover-color`.
