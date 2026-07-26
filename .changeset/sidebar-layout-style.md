---
'@dannydanzka/sovereignty-ui': patch
---

`SidebarLayout` accepts `style`, so a runtime theme can reach the shell.

A multi-tenant product computes its palette per request and hands it down as CSS custom properties
on the outermost node — it cannot come from a static stylesheet, and the sidebar reads its
`--sui-sidebar-*` vars from an ancestor. Without this the consumer has to cast the prop away or add
a wrapper element purely to host the declarations.
