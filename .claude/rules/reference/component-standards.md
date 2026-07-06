# Component Standards

> **APPLIES TO**: `src/components/**`, `src/patterns/**`
> **VERSION**: 1.0 | **UPDATED**: 2026-07-05

---

## File Structure (mandatory per component)

```
ComponentName/
├── ComponentName.tsx            # Logic — no styling, no type declarations
├── ComponentName.styled.ts      # styled-components — token helpers only
├── ComponentName.interfaces.ts  # Props + internal types (exported)
├── ComponentName.test.tsx       # Vitest + RTL — behavior, not implementation
├── ComponentName.stories.tsx    # Storybook — all variants + a11y-clean
└── index.ts                     # export * barrels only
```

Optional when needed: `ComponentName.constants.ts` (defaults, enums — no magic literals inline).

## Styling

- Every value in `.styled.ts` comes from a token helper: `c()`, `s()`, `sh()`, `ts()`, `tw()`, `tf()`, `tl()`, `tt()`, `el()`, `mo()`.
- Transient props use the `$` prefix (`$variant`, `$size`) so they never reach the DOM.
- Variants are typed unions in `.interfaces.ts` (`'primary' | 'secondary' | ...`), mapped in styled files — no string comparison against magic literals.
- Responsive behavior via `layout` tokens (breakpoints), not hardcoded media query values.

## Behavior & API design

- Controlled + uncontrolled support where it applies (`value`/`defaultValue` + `onChange`).
- Content injection via props/slots (`ReactNode`), never hardcoded copy (neutral, overridable defaults allowed, e.g. `label = 'Close'`).
- Icons: accept `ReactNode` or lucide icon component via prop — do not couple new components to specific icon names when avoidable.
- Callbacks named `on<Event>`; booleans named `is/has/should` prefixed in interfaces.

## Accessibility (blocking)

- Interactive components: keyboard operable, visible focus, correct role/aria attributes.
- Form controls: label association (`htmlFor`/`aria-labelledby`), error announcement (`aria-invalid`, `aria-describedby`).
- Overlays (Modal, Dropdown, Tooltip): focus management + Escape to close.
- Stories must pass `@storybook/addon-a11y` without violations.

## Testing

- Test behavior through the public API (render → interact → assert), not internals.
- Minimum: renders with defaults, each variant/state, user interaction paths, a11y-critical attributes.
- No snapshot-only tests. Follow `essential-testing` custom rule (no verbose patterns).

## React Native (dual-platform components)

- One shared `Component.tsx` for web and native — platform differences live ONLY in styling.
- Web styles stay in `Component.styled.ts`; the native resolution is `Component.styled.native.ts` exporting the SAME styled names, built on the primitives `Div` (View) and `Span` (Text).
- RN-safe CSS in `.styled.native.ts`: flexbox layout only; px values via token helpers (they resolve raw px on native); no `display` other than flex/none, no hover/transition/@media/grid/`vertical-align`/gradients/svg selectors; `background-color` (never the `background` shorthand); `border-radius: 9999px` instead of 50%.
- All raw text must render inside a Span-based styled component (native Text does not inherit from Views).
- Never `export * as X from` (breaks Metro/Babel).
- Export RN-ready components from `src/index.native.ts`; validate with `npm run type-check:native`.
