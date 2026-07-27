---
'@dannydanzka/sovereignty-ui': minor
---

`PageTitle` / `SectionTitle` margins are overridable: `--sui-page-title-margin` ·
`--sui-section-title-margin`.

Found while adopting the colour seam from the previous release. Both headings ship
`margin: 0 0 <sm>`, which is right for flow layout and wrong inside a gap'd flex/grid container —
there the heading gets the container's gap **and** its own margin, so the spacing silently doubles and
nothing in the calling code says why. Every screen that hit this was going to wrap the heading just to
zero the margin, which is the exact fork the colour seam had just removed.

Same rule as colour and scale: the product decides it once.

`BackLink` accepts `as` in its props type.

It already forwarded `as` at runtime through `...rest`, and its own doc comment told consumers to use
it — but `BackLinkProps` never declared it, so every router-driven consumer failed to type-check. The
pattern had shipped since v0.22.0 and no product had been able to adopt it. A typed test now covers it.
