---
'@dannydanzka/sovereignty-ui': patch
---

The built component and hook bundles now declare `'use client'`, so they can be imported from a
React Server Component.

Until now the package shipped **zero** client directives. Every component here uses state, effects
or styled-components, so importing one from a server component failed at runtime with *"useState
only works in Client Components"* — and the consumer adding `'use client'` to its own file does not
fix it, because the boundary has to be declared by the module that owns the hook. It went unnoticed
because consumers happened to use these components only from files that were already client
components; the first server-rendered footer hit it immediately.

`utils` and `tokens` are deliberately NOT marked: they are pure functions and plain objects, and a
server component must stay free to call `formatCurrency` or read a token on the server. That split
is why the build is now two tsup configs — tsup's array config form silently drops a per-entry
`banner`.

The directive is re-applied by `scripts/add-use-client.mjs` after the bundles are written, because
tsup's `dts` pass re-reads them and strips module-level directives. The script exits non-zero if an
expected entry is missing, so a change in build shape fails the build instead of quietly shipping
components that crash on the server.
