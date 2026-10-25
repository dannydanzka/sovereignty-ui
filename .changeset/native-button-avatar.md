---
'@dannydanzka/sovereignty-ui': patch
---

fix(native): Button dims only when disabled or loading (the Pressable primitive also disabled every button without onClick, so display buttons rendered faded) and its primary/brand/accent label uses onPrimary/onAccent like web; Avatar drops `var()`, which React Native discards, so its circle and initials color render
