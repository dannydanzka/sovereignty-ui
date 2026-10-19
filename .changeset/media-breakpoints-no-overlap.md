---
'@dannydanzka/sovereignty-ui': patch
---

`media.below(bp)` / `media.atLeast(bp)`: breakpoint queries that never overlap. At exactly a breakpoint width (1024px, an iPad in landscape) `AppHeader` hid both its nav and its menu button, because both edges were inclusive. `AppHeader`, `Sidebar`, `DataTable` (`hideBelow`), `AuthLayout`, `AppFooter`, `FloatingActions` and `FormGrid` now end their "below" rules at `bp - 0.02px`.
