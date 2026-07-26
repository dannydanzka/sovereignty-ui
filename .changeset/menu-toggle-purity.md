---
'@dannydanzka/sovereignty-ui': patch
---

`AppHeader` no longer notifies `onMenuToggle` from inside a state updater.

A state updater has to be pure — React may re-run it — so calling the consumer's callback there made
React warn *"Cannot update a component (`X`) while rendering a different component (`AppHeader`)"*
whenever that callback was itself a `setState`, which is the normal way to use it. The next value is
now computed before the update and the callback fires after it.

Covered by a StrictMode test that spies on `console.error`; StrictMode is what re-runs the updater
and surfaces the impurity. Verified the test fails with the old code and passes with the new — the
same test outside StrictMode passed either way and would have been worthless.
