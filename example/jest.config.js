module.exports = {
  clearMocks: true,
  preset: '@react-native/jest-preset',
  // lucide-react-native ships ESM-only `.mjs`, which the RN preset does not transform.
  transform: {
    '^.+\\.(js|mjs|ts|tsx)$': 'babel-jest',
  },
  // The library resolves through the `file:..` symlink: its imports must reach THIS app's copies.
  moduleNameMapper: {
    '^react$': '<rootDir>/node_modules/react',
    '^react/(.*)$': '<rootDir>/node_modules/react/$1',
    '^styled-components(/.*)?$': '<rootDir>/node_modules/styled-components$1',
    '^react-native-svg$': '<rootDir>/node_modules/react-native-svg',
    '^lucide-react-native$': '<rootDir>/node_modules/lucide-react-native',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}', '<rootDir>/scripts/eslint-rules/*.test.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|lucide-react-native|react-native-svg|react-native-safe-area-context|react-native-screens|styled-components|@dannydanzka)/)',
  ],
};
