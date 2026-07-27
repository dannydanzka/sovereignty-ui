---
'@dannydanzka/sovereignty-ui': minor
---

`Alert`'s live-region role now follows its variant, and can be overridden with `role`.

`role="alert"` is an **assertive** live region: a screen reader interrupts whatever it is saying. That
is right for an error or a warning and wrong for a confirmation — "we sent your link" should wait its
turn (`role="status"`, polite). `Alert` hardcoded `alert` for all four variants, so any consumer that
had this distinction right lost it by adopting the component.

New mapping: `error`/`warning` → `alert`, `info`/`success` → `status`. Pass `role` to override when the
surrounding UI already announces the change.

Found while migrating a product whose own success banner used `role="status"` and whose error banner
used `role="alert"` — the library would have flattened both. The previous unit test asserted the
hardcoded role, so it encoded the defect rather than catching it; it has been replaced with a
per-variant table.
