---
'@dannydanzka/sovereignty-ui': minor
---

New `Form` pattern: the `<form>` element as a stack of fields.

Three lines of CSS (`display: flex; flex-direction: column; gap: <token>`), which is exactly why it
gets retyped. The product that drove this had **ten copies** — `Form` in seven modals/screens,
`FormWrapper` in five admin forms — and they had already drifted: most at `gap: md`, one at `lg`, one
carrying its own `max-height`/scroll for a modal.

Not `Stack` with `as="form"`: `Stack` neither accepts `as` nor forwards props, so it cannot receive
`onSubmit`, `noValidate` or an `id` — the things that make a form a form. `Form` spreads every native
form attribute through, and a test covers submit specifically, because a wrapper that silently drops
`onSubmit` looks identical on screen and breaks every form in the product.

Scrolling inside a modal is `--sui-form-max-height` / `--sui-form-overflow-y`, so the one form that
needs it does not become a wrapper.
