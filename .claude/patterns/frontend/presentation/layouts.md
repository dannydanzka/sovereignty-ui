# Stable Children Layout Pattern

> **Status**: Mandatory | **Category**: React Architecture | **Created**: 2026-01-14

---

## Problem

Conditional rendering that changes the **container structure** of `{children}` causes React to unmount and remount all children, destroying their local state.

```typescript
// ❌ ANTI-PATTERN: Multiple returns with different containers
const Layout = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <ContainerA>{children}</ContainerA>;  // Tree 1
  }

  if (isAuthenticated) {
    return <ContainerB><Sidebar />{children}</ContainerB>;  // Tree 2
  }

  return <ContainerC><Header />{children}</ContainerC>;  // Tree 3
};
```

**Impact:**
- Children remount on every state change (isLoading, isAuthenticated)
- Local state in children is lost (forms, inputs, errors)
- Creates false positives and forced scenarios
- Performance degradation from unnecessary re-renders
- Bugs that are extremely difficult to diagnose

---

## Solution

**Single return with conditional content around stable children:**

```typescript
// ✅ CORRECT: Single return, children always in same position
const Layout = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();

  const showAuthUI = isAuthenticated && !isLoading;

  return (
    <Container>
      {showAuthUI && <Sidebar />}
      <MainWrapper>
        {!isLoading && <Header variant={showAuthUI ? 'auth' : 'public'} />}
        <MainContent>{children}</MainContent>  {/* ALWAYS same position */}
        {!isLoading && <Footer />}
      </MainWrapper>
    </Container>
  );
};
```

---

## Rules

### DO ✅

- **Single return** in layout components
- **{children} always in the same container** at the same tree position
- Conditional rendering **around** children, not **containing** children
- Use CSS/props to change appearance, not different component trees

### DON'T ❌

- Multiple `return` statements with `{children}` in different containers
- `if (condition) return <A>{children}</A>` patterns
- Ternary that changes the parent: `condition ? <A>{children}</A> : <B>{children}</B>`
- Early returns that include `{children}`

---

## Detection Checklist

Before approving any layout/wrapper component:

1. [ ] Count `return` statements - should be **exactly 1**
2. [ ] Find `{children}` - should appear **exactly 1 time**
3. [ ] Verify `{children}` parent is **always the same component**
4. [ ] No `if (...) return` before the main return that includes children

---

## ESLint Custom Rule (Future)

This pattern could be enforced with a custom ESLint rule:

```javascript
// Pseudocode for rule logic
module.exports = {
  create(context) {
    return {
      JSXElement(node) {
        // 1. Detect layout components (naming convention or annotation)
        // 2. Count {children} occurrences
        // 3. Verify single return statement
        // 4. Verify {children} parent is consistent
        // 5. Flag violations
      }
    };
  }
};
```

**Rule name suggestion:** `no-unstable-children-container`

---

## Real-World Example (Reference Project)

**Before (Bug):** LoginForm remounted 4+ times on page load, losing error state.

```typescript
// ❌ PublicLayout before fix
if (isLoading) return <Container>{children}</Container>;
if (isAuthenticated) return <AuthContainer>{children}</AuthContainer>;
return <PublicContainer>{children}</PublicContainer>;
```

**After (Fixed):**

```typescript
// ✅ PublicLayout after fix
return (
  <PublicContainer>
    {showAuthUI && <Drawer />}
    <MainWrapper>
      {!isLoading && <Header variant={showAuthUI ? 'authenticated' : 'public'} />}
      <MainContent>{children}</MainContent>
      {!isLoading && <Footer />}
    </MainWrapper>
  </PublicContainer>
);
```

---

## Related

- `.claude/patterns/component-architecture.md` - Component patterns
- `.claude/patterns/core/COMPONENT-STRUCTURE-STANDARDS.md` - Component standards

---

**Version**: 1.0 | **Author**: Claude + Roberto
