---
'@dannydanzka/sovereignty-ui': minor
---

Button: the `primary`, `accent` and `brand` labels are now readable on ANY themed brand colour.

Those three variants paint a **themed** background (`primary500` / `accent500`) but hardcoded their
foreground — `primary` used the near-black `neutral900`, `accent`/`brand` used white. That works for
the library's default brand (amber primary, pink accent) and breaks for the inverse: a consumer
theming a dark brand got near-black text on a dark button (label effectively invisible), and a light
accent would get white-on-light.

New contrast tokens `onPrimary` / `onAccent` carry the readable foreground, and `createBrandPalette`
computes each from the brand's **WCAG relative luminance** (light background → dark text, dark
background → white text). Defaults keep the current look. `onBrandForeground(hex)` is exported so
consumers can label custom brand surfaces the same way instead of guessing per theme.
