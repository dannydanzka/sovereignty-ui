# Testing React Native — Layer 3 (Stack)

> **Layer**: 3 (stack-specific)
> **Stack**: React Native 0.72+ + `@testing-library/react-native` + Jest (mandatory — Vitest is not supported on RN)
> **Updated**: 2026-04-22

For runner config see `runners/jest.md`. This doc covers what RN specifically requires.

---

## Why RN is different

| Concern | Web RTL | React Native |
|---|---|---|
| Default render target | `document` (jsdom) | RN test renderer (no DOM) |
| Presence assertion | `.toBeInTheDocument()` | `.toBeOnTheScreen()` |
| Default interaction API | `userEvent.setup()` | `fireEvent` |
| Async queries | Same (`findBy*`) | Same (`findBy*`) |
| Role queries | `getByRole('button', { name })` | `getByRole('button', { name })` (mostly same) |
| Native modules (camera, geolocation, push) | N/A | Must mock — they don't exist in test env |
| Navigation | `next/navigation` (web), `react-router` (SPA) | `@react-navigation/*` |

The mental model from Layer 1 (`philosophy.md`, `react-testing-library.md`, `test-doubles.md`) carries over fully. Only the surface API and the boundary mocks change.

---

## Jest preset

```js
// jest.config.js (RN project)
module.exports = {
  preset: 'react-native',
  setupFilesAfterEach: ['@testing-library/jest-native/extend-expect', '<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(?:.pnpm/)?(@react-native|react-native|@react-navigation|@react-native-community)/)',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|svg)$': '<rootDir>/__mocks__/fileMock.ts',
  },
  clearMocks: true,
};
```

`transformIgnorePatterns` is the perpetual headache: every native dep that ships untranspiled ESM needs to be allow-listed. Symptom: `SyntaxError: Cannot use import statement outside a module` from a `node_modules` path → add the package to the negative-lookahead.

---

## Setup file essentials

```ts
// jest.setup.ts
import '@testing-library/jest-native/extend-expect';

// Common native module mocks
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// react-native-reanimated (almost universal)
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

// Silence the Animated warning
jest.useFakeTimers();
```

Many native libs ship official Jest mocks. Look for `<package>/jest/setup` or `<package>/jest-mock` before writing your own.

---

## Queries (mostly identical to web)

```ts
import { render, screen } from '@testing-library/react-native';

render(<UserCard user={mockUser} />);

expect(screen.getByText('María García')).toBeOnTheScreen();
expect(screen.getByRole('button', { name: 'Editar' })).toBeOnTheScreen();
expect(screen.getByLabelText('Nombre completo')).toBeOnTheScreen();
expect(screen.getByPlaceholderText('Correo electrónico')).toBeOnTheScreen();
expect(screen.getByDisplayValue('maria@example.com')).toBeOnTheScreen();
expect(screen.getByTestId('user-avatar')).toBeOnTheScreen();
```

The query priority order from Layer 1 still holds — `getByRole` first, `getByTestId` last. RN's accessibility tree mirrors the web's (props like `accessibilityRole`, `accessibilityLabel`).

---

## Interaction with `fireEvent`

```ts
import { fireEvent, render, screen } from '@testing-library/react-native';

render(<LoginForm onSubmit={mockOnSubmit} />);

fireEvent.changeText(screen.getByLabelText('Correo'), 'maria@example.com');
fireEvent.changeText(screen.getByLabelText('Contraseña'), 'pass123');
fireEvent.press(screen.getByRole('button', { name: 'Entrar' }));

expect(mockOnSubmit).toHaveBeenCalledWith({
  email: 'maria@example.com',
  password: 'pass123',
});
```

Common events:

| Web equivalent | RN |
|---|---|
| `user.type(input, 'x')` | `fireEvent.changeText(input, 'x')` |
| `user.click(button)` | `fireEvent.press(button)` |
| `user.scroll(...)` | `fireEvent.scroll(node, { nativeEvent: { contentOffset: { y: 100 } } })` |
| `user.keyboard('{Enter}')` | `fireEvent(input, 'submitEditing')` |

`@testing-library/react-native` v12+ ships an experimental `userEvent` API. Default to `fireEvent` until projects standardize.

---

## Mocking navigation (`@react-navigation`)

```ts
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockSetOptions = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: mockGoBack,
      setOptions: mockSetOptions,
      addListener: jest.fn(() => () => {}),
    }),
    useRoute: () => ({
      params: {},
      name: 'TestScreen',
      key: 'test',
    }),
    useFocusEffect: jest.fn((cb) => cb()),
    useIsFocused: () => true,
  };
});
```

**Stable references** rule applies hard here — same as `next/navigation` (see `stacks/nextjs-app-router.md`). New navigation object per call → re-render storm → OOM.

For navigation that ships its own context, prefer wrapping the component:

```ts
import { NavigationContainer } from '@react-navigation/native';

render(
  <NavigationContainer>
    <UserScreen />
  </NavigationContainer>
);
```

This exercises real navigation logic without per-test mocks.

---

## Native module mocks

| Module | Pattern |
|---|---|
| `@react-native-async-storage/async-storage` | Use shipped `jest/async-storage-mock` |
| `react-native-permissions` | Use shipped `mock` package |
| `@react-native-community/netinfo` | Use shipped `jest-setup` |
| `react-native-device-info` | Use shipped `jest-setup` |
| `expo-*` | Each Expo module ships its own; check the package README |
| Custom native modules (your own) | Mock the JS bridge file: `jest.mock('./MyNativeModule', () => ({ ... }))` |

Always check `<package>/jest*` for an official mock before writing your own. Hand-rolled mocks drift from real behavior every release.

---

## Animated and Reanimated

```ts
// In setup
jest.useFakeTimers();
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

// In test, if asserting on post-animation state
act(() => { jest.runAllTimers(); });
```

Without fake timers + `runAllTimers`, animated views start at the initial value and your assertion sees the wrong state.

---

## Snapshot testing in RN

Same caution as web (see `runners/snapshot-testing.md`): use sparingly, prefer behavioral assertions. RN's serializer outputs the test renderer tree — full screens become unreadable diffs fast.

```ts
// ✅ Small, stable
expect(render(<Avatar size="lg" />).toJSON()).toMatchSnapshot();

// ❌ Whole screen
expect(render(<DashboardScreen />).toJSON()).toMatchSnapshot();
```

---

## Redux Toolkit in RN

Identical to web (`stacks/redux-toolkit.md`). The store, slices, and thunks don't know they're in RN.

`renderWithProviders` for RN:

```ts
export function renderWithProviders(
  ui: ReactElement,
  { preloadedState, store = makeTestStore(preloadedState), ...options }: RenderOptions = {}
) {
  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>, options),
  };
}
```

Same shape as web. The `Provider` is `react-redux`'s — works on both.

---

## Common failures

| Symptom | Cause | Fix |
|---|---|---|
| `SyntaxError: Cannot use import statement outside a module` from `node_modules/some-pkg` | `transformIgnorePatterns` excludes ESM dep | Add `some-pkg` to the negative-lookahead |
| `useNavigation must be called within NavigationContainer` | Missing navigation mock or wrapper | Mock `@react-navigation/native` or wrap in `NavigationContainer` |
| `Animated: useNativeDriver is not supported` warning | Real Animated lib in test env | Mock `react-native-reanimated` and use fake timers |
| `expect(...).toBeOnTheScreen is not a function` | Missing `extend-expect` | Add `'@testing-library/jest-native/extend-expect'` to `setupFilesAfterEach` |
| OOM on screens with many `FlatList` items | RN renders all items in test (no virtualization) | Reduce mock data to minimal set; assert structure, not item count |
| Re-render loop with `useFocusEffect` | Unstable callback identity | Wrap callback in `useCallback` in production code (real bug, not test bug) |

---

## What's the same as web

The vast majority. Layer 1 (philosophy, RTL principles, test doubles, anti-patterns, coverage) applies as-is. Layer 2 Jest config is identical aside from preset and `transformIgnorePatterns`. Stack overlays (RTK) are identical.

What differs is **boundary mocking** — native modules and navigation. Once those are stable in setup, daily test writing feels indistinguishable from web.

---

## Related

- `runners/jest.md` — Jest config baseline
- `react-testing-library.md` — query principles (apply to RNTL too)
- `anti-patterns.md` — same anti-patterns, RN flavor
- `stacks/redux-toolkit.md` — RTK on RN
- Project overlays: `projects/your-company/patterns/...` and `projects/your-mobile-project/patterns/...`
