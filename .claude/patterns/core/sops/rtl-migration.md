# SOP: RTL Migration — Snapshots & react-test-renderer

> **PURPOSE**: Migrate test files that use `toMatchSnapshot()` or `react-test-renderer` to `@testing-library/react-native` with explicit assertions.
> **SCOPE**: All test files in React Native projects using `@testing-library/react-native`.
> **UPDATED**: 2026-05-18

---

## Core Discipline

- **No subagents**: All work via Read/Edit/Bash/Grep directly.
- **Block discipline**: Process 5 files per block → fix all → verify block → next block.
- **Verify before delete**: Run the block's tests clean before removing `.snap` files.
- **Pre-existing failures are not our problem**: Confirm against master with `git stash` before claiming a regression.

---

## Inventory Command

```bash
# Count toMatchSnapshot calls in a module
grep -rn "toMatchSnapshot" src/modules/<module> --include="*.test.*" | wc -l

# List all files with toMatchSnapshot
grep -rn "toMatchSnapshot" src/modules/<module> --include="*.test.*" | sort

# Count remaining .snap files
find src/modules/<module> -name "*.snap" | wc -l
```

---

## Classification — Read each file before touching it

| Pattern | Fix |
|---|---|
| `toMatchSnapshot()` is the **only** assertion in the test | Replace with `expect(screen.UNSAFE_root).not.toBeNull()` |
| `toMatchSnapshot()` alongside other assertions | Remove the snapshot line entirely — other assertions already cover render |
| `create(...).toJSON().toMatchSnapshot()` (`react-test-renderer`) | Replace `create(...)` with `render(...)` from `library.tsx`; use `expect(screen.UNSAFE_root).not.toBeNull()` |
| `expect(wrapper).toMatchSnapshot()` where `wrapper = create(...).toJSON()` | Change to `const instance = create(...); expect(instance).not.toBeNull()` (remove `.toJSON()`) |
| `screen.toJSON()` returns `null` with `not.toBeNull()` | Switch to `screen.UNSAFE_root` — always defined even when children are mocked to null |

---

## Block Workflow

```
1. Get the full list:
   grep -rn "toMatchSnapshot" src/modules/<module> --include="*.test.*" | awk -F: '{print $1}' | sort -u

2. Take 5 files.

3. Read all 5. Classify each (table above).

4. Edit all 5.

5. Verify the block:
   cd <project-root> && npx jest <file1> <file2> <file3> <file4> <file5> --no-coverage 2>&1 | tail -6

6. If all pass → delete their .snap files:
   rm "src/.../path/__snapshots__/file.test.tsx.snap"

7. Confirm snap files are gone:
   find src/modules/<module> -name "*.snap" | wc -l

8. Take next 5.
```

---

## Replacement Recipes

### Recipe 1 — Snapshot-only render test (most common)

```tsx
// BEFORE
it('should render correctly', () => {
  render(<MyComponent {...props} />);
  expect(screen.toJSON()).toMatchSnapshot();
});

// AFTER
it('should render correctly', () => {
  render(<MyComponent {...props} />);
  expect(screen.UNSAFE_root).not.toBeNull();
});
```

### Recipe 2 — Snapshot alongside other assertions

```tsx
// BEFORE
it('should render correctly', () => {
  render(<MyComponent {...props} />);
  expect(screen.toJSON()).toMatchSnapshot();    // ← remove this line
  expect(screen.UNSAFE_getAllByType(BadgeIcon).length).toEqual(1);
});

// AFTER
it('should render correctly', () => {
  render(<MyComponent {...props} />);
  expect(screen.UNSAFE_getAllByType(BadgeIcon).length).toEqual(1);
});
```

### Recipe 3 — react-test-renderer `create().toJSON()` returning null

```tsx
// BEFORE
import { create } from 'react-test-renderer';

it('should render correctly', () => {
  const wrapper = create(<MyComponent {...props} />).toJSON();
  expect(wrapper).toMatchSnapshot();
});

// AFTER — remove create entirely, use render from library.tsx
import { render, screen } from '@/utils/testing/library';

it('should render correctly', () => {
  render(<MyComponent {...props} />);
  expect(screen.UNSAFE_root).not.toBeNull();
});
```

### Recipe 4 — react-test-renderer instance check

```tsx
// BEFORE
it('should render correctly', () => {
  const wrapper = create(<MyComponent {...props} />);
  expect(wrapper.toJSON()).toMatchSnapshot();
});

// AFTER — check the instance, not .toJSON() which returns null
it('should render correctly', () => {
  const instance = create(<MyComponent {...props} />);
  expect(instance).not.toBeNull();
});
```

### Recipe 5 — Multiple snapshots in one file (e.g. variant A / variant B)

Each snapshot → its own explicit assertion based on the variant:

```tsx
// BEFORE
it('renders default variant', () => {
  render(<StatusLabel status='APPROVED' />);
  expect(screen.toJSON()).toMatchSnapshot();
});
it('renders cancelled variant', () => {
  render(<StatusLabel status='CANCELLED' />);
  expect(screen.toJSON()).toMatchSnapshot();
});

// AFTER
it('renders default variant', () => {
  render(<StatusLabel status='APPROVED' onPress={onPress} />);
  expect(screen.UNSAFE_root).not.toBeNull();
});
it('renders cancelled variant', () => {
  render(<StatusLabel status='CANCELLED' onPress={onPress} />);
  expect(screen.UNSAFE_root).not.toBeNull();
});
```

---

## Dealing with Pre-Existing Failures

Before concluding a test failure is a regression we introduced, confirm against master:

```bash
git stash
npx jest <failing-suite> --no-coverage 2>&1 | grep -E "FAIL|PASS|Tests:"
git stash pop
```

If the suite was already failing on master → **not our problem**. Document as pre-existing and move on.

If passing on master but failing on our branch → regression. Root causes:
- `screen.toJSON()` returns `null` because component needs providers → switch to `screen.UNSAFE_root`
- Component renders `null` via `create().toJSON()` → use `instance` (Recipe 4) instead of `.toJSON()`

---

## Full-Module Completion Check

```bash
# Zero toMatchSnapshot calls remaining
grep -rn "toMatchSnapshot" src/modules/<module> --include="*.test.*" | wc -l

# Zero .snap files remaining
find src/modules/<module> -name "*.snap" | wc -l

# Full suite green
npx jest src/modules/<module> --no-coverage 2>&1 | tail -5
```

Expected final output:
```
Test Suites: N passed, N total
Tests:       N passed, N total
Snapshots:   0 total
```

---

## See Also

- `frontend/testing/stacks/react-native.md` — Render helpers table, react-test-renderer prohibition
- `frontend/testing/react-testing-library.md` — UNSAFE_root vs toJSON distinction
- `frontend/testing/anti-patterns.md` — toMatchSnapshot in Quick Reference (error severity)
- `core/sops/snapshot-management.md` — Snapshot PR separation strategy
