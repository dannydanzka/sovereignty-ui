---
'@dannydanzka/sovereignty-ui': minor
---

`Button`, `Card`, `Input` and `Textarea` take `testId`: it renders as `data-testid` on web and as `testID` on React
Native, so E2E drivers that read the accessibility tree (Maestro, Detox) can select them. The native primitives now map
any `data-testid` to `testID`.
