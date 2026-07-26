---
'@dannydanzka/sovereignty-ui': minor
---

Input: add `maxLength` and `showCount`, mirroring the contract `Textarea` already had.

The counter was only available on `Textarea`, so a form with both field types could not offer a
consistent character limit — consumers had to either skip the limit on single-line fields or wrap
`Input` locally, forking the design system. `Input` now caps the value with the native `maxLength`
and renders the same footer shape as `Textarea` (error on the left, `current/max` on the right,
turning error-coloured when over the cap). Both props are optional and the counter only appears when
BOTH are set, so existing usages are untouched.

Implemented for web and native (`Input.styled.native.ts`), since the primitive `TextField` already
supported `maxLength` on both platforms.
