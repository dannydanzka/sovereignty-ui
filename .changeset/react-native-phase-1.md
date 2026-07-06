---
'@dannydanzka/sovereignty-ui': minor
---

React Native support — phase 1-2 (experimental)

- Cross-platform primitives: Div (div ↔ View, flexbox-column default) and Span (span ↔ Text)
- Native token bridge: css-variables/inject resolve raw px values on RN via a runtime registry (setSuiTokens/resetSuiTokens; injectSuiTokens aliases on native); rem→px conversion, single-shadow elevations
- First RN-ready component batch via Component.styled.native.ts (same styled exports on Div/Span): Avatar, Badge, Divider, EmptyState, InlineIcon, Spacer, StatsCard
- New native entry src/index.native.ts wired through package.json react-native field + exports conditions; src now ships in the package for Metro; react-native optional peer
- tsconfig.native.json (moduleSuffixes) + npm run type-check:native; no-native-html rule recognizes .styled.native.ts
- TokenOverrides now accepts typography.size overrides (web injectSuiTokens honors them too)
