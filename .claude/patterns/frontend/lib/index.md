# Lib — npm Packages / Component Libraries

> **Status**: Active — sovereignty-ui is the reference implementation
> **Scope**: Reusable packages consumed by other projects via npm

---

## When to use this discipline

Use `lib` when:
- Your project is a publishable npm package (not a deployable app)
- The codebase is a component library, design system, or utility package
- It has a build step that produces distributable artifacts (e.g., tsup, rollup)

Examples: `sovereignty-ui`, utility libraries, shared hooks packages

---

## Key Differences from App Projects

| Aspect | App (frontend/spa) | Library (lib) |
|--------|--------------------|---------------|
| Entry point | `app/page.tsx` | `src/index.ts` (barrel) |
| Build | Next.js / Vite dev server | tsup / rollup → `dist/` |
| Deployment | Vercel / server | npm registry (GitHub Packages) |
| Consumers | End users | Other codebases |
| Versioning | Git tags | Semantic versioning + changelogs |
| Theming | ThemeProvider / CSS vars | CSS custom properties (no context) |
| Testing | Vitest + RTL | Vitest + RTL + Storybook |

---

## Reference Implementation: sovereignty-ui

| Attribute | Value |
|-----------|-------|
| **Package** | `@dannydanzka/sovereignty-ui` |
| **Version** | 0.3.0 |
| **Components** | 48 + 4 patterns |
| **Build** | tsup (ESM + CJS + .d.ts) |
| **Theming** | CSS var helpers (`c()`, `s()`, etc.) + `injectSuiTokens()` |
| **Dev** | Storybook 8 |
| **Testing** | Vitest + RTL (jsdom) |

---

## Cross-Discipline References

- `core/sops/sovereignty-ui-publish.md` — Publish SOP (sovereignty-ui reference)
- `frontend/presentation/sovereignty-ui-integration.md` — Integration patterns for consumers
- `core/quality/` — Quality standards apply to libraries too
- `core/git/` — Changelog and versioning conventions
