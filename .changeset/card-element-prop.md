---
'@dannydanzka/sovereignty-ui': minor
---

Card: the polymorphic prop is now `element`, not `as` — because `as` never worked through a wrapper.

`0.29.0` made Card polymorphic so a card inside a `<ul>` could stay an `li`. It worked when Card was
used directly and failed silently in the shape every real consumer uses: styled-components CONSUMES
`as` on a styled component, so `styled(Card)` + `as="li"` renders a bare `li` and Card never runs.
The surface disappears entirely — no border, no radius, no padding, no error, no failing test. It hit
21 call sites in one product and was caught by eye in a browser.

- `element?: CardElement` replaces `as?: CardElement`. Same values, same default (`div`), and it
  behaves identically direct or wrapped, because styled-components does not reserve the name.
- `as?: never` makes `<Card as='li'>` a compile error that names the fix. It does NOT catch
  `<Wrapped as='li'>` — styled-components' polymorphic typing wins there; the test below is what
  covers that case.
- New test: Card rendered THROUGH a `styled(Card)` wrapper must keep its surface. Verified to fail
  when the prop is renamed back to `as`.

Migration: `<Card as='li'>` → `<Card element='li'>`.
