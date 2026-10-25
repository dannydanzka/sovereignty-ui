/**
 * Global test doubles for native modules with no JS implementation under Jest.
 */

jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default
);
