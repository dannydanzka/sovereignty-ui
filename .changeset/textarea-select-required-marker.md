---
'@dannydanzka/sovereignty-ui': patch
---

`Textarea` and `Select` now render the `*` required marker that `Input` has always rendered.

Both already accepted `required` and forwarded it to the control, so the field was genuinely
required — but the label never said so. A form with a required text field next to a required
textarea or select marked only the text field, which tells the user the wrong thing about which
answers are mandatory. `TextField` / `TextareaField` / `SelectField` inherit the fix, since they
pass `required` straight down.

Found by adopting the fields in a real form (a contact form whose "Asunto*" was marked and whose
equally-required "Mensaje" was not), not by a test.
