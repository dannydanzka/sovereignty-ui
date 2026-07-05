# Global Rules — sovereignty-ui

> **APPLIES TO**: All files in the library
> **PURPOSE**: Transversal rules for the agnostic UI library (`lib` discipline — NOT an app project)
> **ESLint**: 16 custom rules enforce most of these automatically (`scripts/eslint-rules/`)
> **VERSION**: 1.0 | **UPDATED**: 2026-07-05

---

## DO

- **SEARCH existing components/patterns/hooks/utils BEFORE creating new ones** — the library exists to kill duplication, not to host it
- Follow the component file structure: `Component.tsx` + `Component.styled.ts` + `Component.interfaces.ts` + `Component.test.tsx` + `Component.stories.tsx` + `index.ts`
- Style ONLY through CSS-var token helpers (`c()`, `s()`, `sh()`, `ts()`, `tw()`, `tf()`, `tl()`, `tt()`, `el()`, `mo()`) with static fallbacks
- Keep every export agnostic: props/slots for injection, callbacks for behavior, no hardcoded copy beyond neutral defaults that consumers can override
- Accessibility first: semantic roles, keyboard support, `aria-*` props; stories must pass the a11y addon
- Barrel exports: `export *` / `export type *` ONLY; public API = what the 4 entry-point barrels expose
- Named imports ONLY; type-only imports for interfaces/types
- English for all code, docs, stories, and test descriptions
- TypeScript strict — never `any` (tests included; use proper generics/mocks)
- Add a changeset for every user-visible change (`npx changeset`)
- Run `npm run lint && npm run type-check && npm run test && npm run build` before committing

## DON'T

- Import from React frameworks (Next.js), state managers (Redux), data layers (Prisma/Supabase), or i18n libraries — this library knows none of them
- Add runtime dependencies without explicit approval (current allowance: `lucide-react`; react/react-dom/styled-components are peers)
- Use ThemeProvider or React context for theming — CSS custom properties only
- Hardcode colors, spacing, radii, shadows, fonts, or durations in styled files
- Use `style={{}}` inline styles or raw HTML styling outside styled-components
- Ship a component without story + tests + interfaces file
- Use `export * as X from` (breaks Metro — future React Native support depends on it)
- Publish locally (`npm publish`) or push directly to `main` — releases go through CI (see `sop/release-via-ci.md`)
- Accept business/domain components — RoleBadge, KYC forms, Stripe gates, etc. stay in their products

---

## Reference

- `reference/library-architecture.md` — layers, entry points, admission criteria
- `reference/component-standards.md` — 5-file structure, tokens, a11y, testing
- `reference/api-stability.md` — semver, changesets, breaking-change policy
- `sop/release-via-ci.md` — release procedure (CI-only)
