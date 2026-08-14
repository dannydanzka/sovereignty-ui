module.exports = {
  root: true,
  extends: '@react-native',
  ignorePatterns: ['build/', 'node_modules/', 'android/', 'ios/', 'vendor/'],
  rules: {
    // Consistent with sovereignty-ui: single quotes in JSX comes from prettier config
    'react/react-in-jsx-scope': 'off',
  },
};
