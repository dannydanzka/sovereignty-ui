---
"@dannydanzka/sovereignty-ui": patch
---

Fix package.json `exports` condition order: `react-native` now comes BEFORE `types` in every entry point (`.`, `./tokens`, `./hooks`, `./utils`). TypeScript consumers with `customConditions: ["react-native"]` (React Native projects extending `@react-native/typescript-config`) previously resolved the web `dist/*.d.ts` types instead of `src/index.native.ts`, breaking type-checking of native styled resolutions. No runtime change for web consumers — bundlers matching `import`/`require` are unaffected.
