---
'@dannydanzka/sovereignty-ui': minor
---

Input: dates and numbers are types of the same field, not hand-rolled ones

A consumer could not build a date or a bounded number field with `Input`: there was no `date` type
and no `min`/`max`/`step`, so every form fell back to a raw `<input type="date">`/`type="number"` —
losing the label, the error footer and the counter, and making each module's fields look different.
It also had no `onBlur`, so validate-on-blur forms had to bypass the component.

- `type` accepts `'date'`; `min` / `max` / `step` are forwarded (bounded ranges, money steps).
- `inputMode` asks for a specific on-screen keyboard without lying about the input type.
- `onBlur` completes the change API for forms that validate on blur.
- `TextField` (FormFields) forwards all of the above plus `maxLength` / `showCount`, which only
  `TextareaField` had — the pattern is no longer weaker than the component it wraps.

Native: `min`/`max`/`step` are dropped (TextInput has no equivalent) and `date` degrades to a
numbers-and-punctuation keyboard — use `Calendar` for a real native picker. Browser bounds are hints;
the schema still owns validation.
