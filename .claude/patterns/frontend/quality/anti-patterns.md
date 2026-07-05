# Anti-Patterns — Frontend (React)

> **Discipline**: `frontend` — React, Next.js, styled-components, Redux
> **Priority**: Critical — Zero Tolerance
> **Updated**: 2026-03-23

---

## Top 10 Most Common Violations

### 1. Default Exports for Components

```javascript
// WRONG
const MyComponent = () => <div>Hello</div>;
export default MyComponent;

// CORRECT
export const MyComponent = () => <div>Hello</div>;
```

**Exception**: Pages/routes that require default export by framework convention (Next.js pages, React Router).

---

### 2. Named Re-exports in Barrel Files

```javascript
// WRONG - index.js
export { Component } from './Component';

// CORRECT - index.js
export * from './Component';
```

---

### 3. Wildcard Imports in Implementation

```javascript
// WRONG
import * as React from 'react';
import * as Helpers from './helpers';

// CORRECT
import { useState, useEffect } from 'react';
import { helperA, helperB } from './helpers';
```

---

### 4. Inline Styles

```javascript
// WRONG
<div style={{ color: 'red', fontSize: '16px' }}>Text</div>

// CORRECT — Use styled-components or CSS modules
import { StyledContainer } from './Component.styled';
<StyledContainer>Text</StyledContainer>
```

---

### 5. Hardcoded Design Tokens

```javascript
// WRONG
<div style={{ width: '300px' }}>
const StyledBox = styled.div`padding: 16px; color: #FF0000;`;

// CORRECT — Use theme tokens
import { theme } from '@theme';

const StyledBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.error};
`;
```

---

### 6. Anonymous Functions in Props

```javascript
// WRONG
<Button onClick={() => doSomething(id)} />

// CORRECT
const handleClick = () => doSomething(id);
<Button onClick={handleClick} />
```

---

### 7. Direct State Access (Without Selectors)

```javascript
// WRONG
const data = useSelector((state) => state.myReducer.data);

// CORRECT
import { selectMyData } from '@store/selectors';
const data = useSelector(selectMyData);
```

---

### 8. PropTypes with defaultProps

```javascript
// WRONG
MyComponent.propTypes = {
  name: PropTypes.string,
};
MyComponent.defaultProps = {
  name: 'Default',
};

// CORRECT — Default in destructuring + TypeScript interface
interface Props {
  name?: string;
}
export const MyComponent = ({ name = 'Default' }: Props) => {
  // ...
};
```

---

### 9. Business Logic in Components

```javascript
// WRONG — Component with logic
export const MyScreen = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectMyData);

  useEffect(() => {
    dispatch(fetchData());
  }, []);

  const handleFilter = (filter) => {
    // 50 lines of logic...
  };

  return <div>{/* JSX */}</div>;
};

// CORRECT — Extract to hook
export const MyScreen = () => {
  const { data, handleFilter } = useMyScreen();
  return <div>{/* JSX */}</div>;
};
```

---

### 10. Using `var` or `function` keyword

```javascript
// WRONG
var name = 'John';
function doSomething() { /* ... */ }

// CORRECT
const name = 'John';
const doSomething = () => { /* ... */ };
```

---

## Immediate Refactoring Required

### Code Organization

- Nested component folders (> 1 level deep)
- Components in wrong location (UI in pages/)
- Mixing contexts (legacy + modern in same file)
- Duplicate code (not using helpers/shared)

### State Management

- Direct API calls in components (not using state layer)
- Prop drilling (> 2 levels)
- Missing clean flags/state actions
- Not exporting `initialState` in reducers

### Imports/Exports

- Relative imports > 3 levels (../../..)
- Missing `type` keyword for TS type imports
- Import order incorrect (React not first, styled not last)
- Default exports for non-pages

### Styling

- CSS modules mixed with styled-components
- `!important` in CSS (fix specificity instead)
- Hardcoded colors (use theme)
- Duplicate CSS mixins

### Testing

- No tests for new code
- Coverage < 80%
- Not testing edge cases

---

## Pre-Commit Checklist

```bash
# Adapt to your project's package manager
<pm> type-check
<pm> lint
<pm> test
<pm> test:coverage
```

**Manual checks**:

- [ ] NO PropTypes with defaultProps
- [ ] All constants in UPPER_CASE
- [ ] `export const` for all new code (except pages)
- [ ] Barrel exports with `export *` in index files
- [ ] NO anonymous functions in props
- [ ] Named handlers with `handle*` prefix
- [ ] Default values in prop destructuring
- [ ] Flat component structure (NO nesting)
- [ ] Context-based component names
- [ ] Selectors use `createSelector`
- [ ] Services use centralized request handler
- [ ] Tests cover happy path + edge cases
- [ ] Styled components (NO inline styles)
- [ ] 0 TypeScript errors
- [ ] 0 ESLint errors
- [ ] 0 ESLint warnings

---

## Quick Detection

```bash
# Adapt paths to your project structure
# Find default exports in components
grep -r "export default" src/components/

# Find inline styles
grep -r "style={{" src/

# Find anonymous functions in props
grep -r "onClick={() =>" src/

# Find var usage
grep -r "var " src/

# Find direct state access
grep -r "state\..*Reducer\." src/

# Find PropTypes
grep -r "PropTypes" src/
```

---

## Quick Answers

**Q: Can I use default exports?**
A: ONLY for pages/routes required by the framework. Everything else MUST use named exports.

**Q: When should I use selectors?**
A: ALWAYS. Never access state directly in components.

**Q: Can I use inline styles?**
A: NEVER. Use styled-components or your project's CSS solution.

**Q: Where does business logic go?**
A: In custom hooks or use cases, NOT in components.

---

## Related

- `../presentation/components.md` — Component structure
- `../presentation/hooks.md` — Custom hook patterns
- `../presentation/styling/styled-components.md` — Styled-components patterns
- `../infrastructure/state/slices.md` — Redux state patterns
- `../tooling/eslint.md` — ESLint configuration
- `../../core/quality/anti-patterns.md` — Universal anti-patterns

---

**Version**: 2.0 | **Status**: React/Next.js specific — see core/quality/anti-patterns.md for universal patterns
