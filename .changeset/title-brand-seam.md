---
'@dannydanzka/sovereignty-ui': minor
---

`PageTitle` and `SectionTitle` can be recoloured and resized by CSS variable.

New: `--sui-page-title-color` · `--sui-page-title-size` · `--sui-section-title-color` ·
`--sui-section-title-size`. Both primitives already accepted `as` for the heading level; that is now
documented as the way to pick it.

Why this is the whole point rather than a convenience: a branded product could not use these headings
at all. Applying a tenant colour meant forking the heading in each screen, and once forked, the size
went with it. Measured in the product that drove this: **14 page titles across 3 sizes and 4 colours,
of which only 4 respected the tenant's brand colour** — and `Title` was an `h1` in 11 files and an
`h2` in 3, so the heading level was being chosen by how big the text should look. The variable seam
lets a product make that decision once, in one place.

The unit test asserts the declarations go *through* the variables (it fails if someone "simplifies"
them back to a literal token). It cannot prove the cascade: jsdom does not resolve custom properties,
so an ancestor actually winning is verified in a browser.
