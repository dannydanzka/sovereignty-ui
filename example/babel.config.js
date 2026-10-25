module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@app': './src/app',
          '@apps': './src/apps',
          '@testing': './src/libs/testing',
        },
        extensions: ['.ios.ts', '.android.ts', '.native.ts', '.ts', '.tsx', '.js', '.json'],
        root: ['.'],
      },
    ],
  ],
  presets: ['module:@react-native/babel-preset'],
};
