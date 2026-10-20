---
'@dannydanzka/sovereignty-ui': patch
---

`Select` names its control through its `label` even without `id` or `name`: it falls back to `useId`.
