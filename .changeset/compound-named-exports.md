---
'@dannydanzka/sovereignty-ui': patch
---

Every compound part is now also a named export: `FooterLink`, `FormGridFull`, `SidebarHeader`,
`SidebarNav`, `SidebarFooter`, `SidebarLayoutRoot`, `SidebarLayoutContent`, `SidebarLayoutBody`.

`AppFooter.Link` and friends are static properties, and **static properties do not survive the React
Server Component boundary**. A server component importing `AppFooter` from this (now `'use client'`)
package gets a client *reference*, on which `.Link` is `undefined`; it fails at render with
*"Element type is invalid ... got: undefined"*, which points nowhere near the real cause.

The dot form still works and stays the ergonomic choice inside client components. A server-rendered
subtree has to use the named export. `FiltersBar` already did this; the rest now match.
