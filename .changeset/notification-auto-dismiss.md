---
'@dannydanzka/sovereignty-ui': minor
---

`NotificationContainer` takes `autoDismissMs`, and a notification may carry its own `displayDuration`: a queue kept in an app store (the managed runner's notification channel) is dismissed by the always-mounted container. Off by default; `useNotifications` keeps its own timers.
