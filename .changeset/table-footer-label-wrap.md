---
'@dannydanzka/sovereignty-ui': patch
---

`TableFooter`: stop the page-size label breaking mid-phrase.

"Show [20] per page" is two short words around a dropdown; with a language whose words are longer than
English's (`por página`) the trailing label wrapped onto a second line and read as a broken layout. Its
grid column is `auto`, so the label can simply be as wide as its text — `white-space: nowrap`.
