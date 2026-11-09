---
'@dannydanzka/sovereignty-ui': patch
---

Native primitives keep a consumer's own `testID`: 0.36.0 mapped `data-testid` to `testID` through `.attrs`, which
erased a `testID` passed directly to a styled `Div`, `Span`, `Pressable` or `TextField` when no `data-testid` came.
